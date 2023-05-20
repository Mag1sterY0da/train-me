import {
  Avatar,
  Box,
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { ChangeEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SignInSignUpResponse, registerUser } from '../api/client.ts';
import { useUser } from '../hooks/useUser.ts';

const RegistrationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const password = queryParams.get('password');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { logUser } = useUser();

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const nextButton = () => (
    <Button
      type='submit'
      variant='contained'
      color='primary'
      fullWidth
      sx={{ position: 'absolute', bottom: '-4.8rem' }}
    >
      Next Page
    </Button>
  );

  const previousButton = () => (
    <Button
      type='button'
      variant='outlined'
      color='primary'
      fullWidth
      sx={{
        position: 'absolute',
        bottom: '-8rem',
      }}
      onClick={previousPage}
    >
      Previous
    </Button>
  );

  const getFitnessLevelText = (fitnessLevel: number) => {
    if (fitnessLevel === 0) {
      return 'Minimum activity level: People who lead predominantly sedentary lifestyles or have physical limitations.';
    } else if (fitnessLevel === 25) {
      return 'Beginners: People who have just started engaging in sports or participate in sports intermittently, understand basic exercises.';
    } else if (fitnessLevel === 50) {
      return 'Moderate activity level: People who engage in sports regularly and have an average level of physical fitness.';
    } else if (fitnessLevel === 75) {
      return 'High activity level: People who engage in sports daily and have a high level of physical fitness.';
    } else if (fitnessLevel === 100) {
      return 'Extreme activity level: Professional athletes or individuals with advanced fitness levels.';
    }
    return '';
  };

  const [avatar, setAvatar] = useState<string>('');

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      // setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'
    >
      <Container maxWidth='sm'>
        <Formik
          initialValues={{
            email: email ? email : '',
            password: password ? password : '',
            gender: 'male',
            birthDate: '',
            height: '',
            weight: '',
            fitnessLevelNum: 0,
            avatar: '',
            nickname: '',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if ([1, 2, 3, 4].includes(currentPage as number)) {
                nextPage();
              } else {
                const getFitnessLevelText = (
                  fitnessLevel: number
                ): 'minimum' | 'beginner' | 'moderate' | 'high' | 'extreme' => {
                  if (fitnessLevel === 25) {
                    return 'beginner';
                  } else if (fitnessLevel === 50) {
                    return 'moderate';
                  } else if (fitnessLevel === 75) {
                    return 'high';
                  } else if (fitnessLevel === 100) {
                    return 'extreme';
                  }
                  return 'minimum';
                };

                const fitnessLevel = getFitnessLevelText(
                  values.fitnessLevelNum
                );

                const registerResponse: SignInSignUpResponse =
                  await registerUser({
                    email: values.email,
                    password: values.password,
                    gender: values.gender as 'male' | 'female',
                    birthDate: new Date(values.birthDate),
                    height: parseInt(values.height),
                    weight: parseInt(values.weight),
                    fitnessLevel,
                    avatar,
                    nickname: values.nickname,
                    completedTrainings: [],
                    plannedTrainings: [],
                    subscribes: [],
                  });

                if (registerResponse.success) {
                  await logUser(values.email, values.password);
                } else {
                  console.log(registerResponse.error);
                }
              }
            } catch (error) {
              console.log('An error occurred during login:', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              {currentPage === 1 && (
                <Box
                  display='flex'
                  flexDirection='column'
                  position='relative'
                  minHeight='25vh'
                  gap={2}
                >
                  <Typography
                    variant='h5'
                    component='h1'
                    align='center'
                    gutterBottom
                    sx={{ mb: '1.8rem' }}
                  >
                    {email && password
                      ? 'Check your email and password'
                      : 'Write your email and password'}
                  </Typography>
                  <Field
                    as={TextField}
                    type='email'
                    name='email'
                    label='Email'
                    variant='outlined'
                    fullWidth
                    required
                  />
                  <Field
                    as={TextField}
                    type='text'
                    name='password'
                    label='Password'
                    variant='outlined'
                    fullWidth
                    required
                  />
                  {nextButton()}
                </Box>
              )}
              {currentPage === 2 && (
                <Box
                  display='flex'
                  flexDirection='column'
                  position='relative'
                  minHeight='25vh'
                  gap={2}
                >
                  <Typography
                    variant='h5'
                    component='h1'
                    align='center'
                    gutterBottom
                    sx={{ mb: '1.8rem' }}
                  >
                    Select your sex and date of birth
                  </Typography>

                  <RadioGroup
                    row
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Field
                          as={Radio}
                          type='radio'
                          name='gender'
                          value='male'
                          required
                        />
                      }
                      label='Male'
                    />
                    <FormControlLabel
                      control={
                        <Field
                          as={Radio}
                          type='radio'
                          name='gender'
                          value='female'
                          required
                        />
                      }
                      label='Female'
                    />
                  </RadioGroup>

                  <Field
                    as={TextField}
                    type='date'
                    name='birthDate'
                    label='Birthdate'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  {nextButton()}
                  {previousButton()}
                </Box>
              )}
              {currentPage === 3 && (
                <Box
                  display='flex'
                  flexDirection='column'
                  position='relative'
                  minHeight='25vh'
                  gap={2}
                >
                  <Typography
                    variant='h5'
                    component='h1'
                    align='center'
                    gutterBottom
                    sx={{ mb: '1.8rem' }}
                  >
                    Write your height and weight
                  </Typography>

                  <Field
                    as={TextField}
                    type='number'
                    name='height'
                    label='Height (cm)'
                    variant='outlined'
                    fullWidth
                    required
                  />

                  <Field
                    as={TextField}
                    type='number'
                    name='weight'
                    label='Weight (kg)'
                    variant='outlined'
                    fullWidth
                    required
                  />

                  {nextButton()}
                  {previousButton()}
                </Box>
              )}
              {currentPage === 4 && (
                <Box
                  display='flex'
                  flexDirection='column'
                  position='relative'
                  minHeight='25vh'
                  gap={2}
                >
                  <Typography variant='h5' align='center' gutterBottom>
                    Fitness Level:
                  </Typography>

                  <Typography
                    variant='body1'
                    component='span'
                    align='center'
                    gutterBottom
                    sx={{ mb: '1.8rem' }}
                  >
                    {getFitnessLevelText(values.fitnessLevelNum)}
                  </Typography>

                  <Field
                    as={Slider}
                    name='fitnessLevelNum'
                    step={25}
                    min={0}
                    max={100}
                    marks={[
                      { value: 0, label: 'Minimum' },
                      { value: 25, label: 'Beginners' },
                      { value: 50, label: 'Moderate' },
                      { value: 75, label: 'High' },
                      { value: 100, label: 'Extreme' },
                    ]}
                    sx={{ width: '70%', mx: 'auto' }}
                  />

                  {nextButton()}
                  {previousButton()}
                </Box>
              )}
              {currentPage === 5 && (
                <Box
                  display='flex'
                  flexDirection='column'
                  position='relative'
                  minHeight='25vh'
                  gap={1}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginBottom: '1.2rem',
                    }}
                  >
                    <Avatar
                      src={avatar as string}
                      sx={{
                        position: 'absolute',
                        top: '-14rem',
                        width: 250,
                        height: 250,
                        marginBottom: '0.5rem',
                      }}
                    />

                    <Button
                      variant='contained'
                      component='label'
                      sx={{
                        mt: '3.2rem',
                      }}
                    >
                      Upload Avatar
                      <input
                        type='file'
                        style={{ display: 'none' }}
                        onChange={(event) => {
                          handleAvatarChange(event);
                          setFieldValue(
                            'avatar',
                            event.currentTarget.files?.[0]
                          );
                        }}
                      />
                    </Button>
                  </Box>

                  <Field
                    as={TextField}
                    type='text'
                    name='nickname'
                    label='Nickname'
                    variant='outlined'
                    fullWidth
                    required
                  />

                  <Typography variant='body2' align='center' gutterBottom>
                    By clicking the "Submit" button, you agree to our{' '}
                    <Typography
                      component='a'
                      href='/terms'
                      target='_blank'
                      rel='noopener noreferrer'
                      color='primary'
                    >
                      Terms
                    </Typography>
                  </Typography>

                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={isSubmitting}
                    fullWidth
                    sx={{ position: 'absolute', bottom: '-4.8rem' }}
                  >
                    Submit
                  </Button>
                  {previousButton()}
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

export default RegistrationPage;
