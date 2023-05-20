import { PhotoCamera } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateUserById } from '../api/client.ts';
import { useModel } from '../hooks/useModel.ts';
import { useUser } from '../hooks/useUser.ts';

const UserProfile = () => {
  const { user, refetchUser } = useUser();
  const [avatar, setAvatar] = useState<string>('');
  const { predictWorkouts } = useModel();
  const navigator = useNavigate();

  if (!user) return null;

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
    >
      <Link
        to={`/users/${user._id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Typography variant='h4' component='h1' sx={{ marginBottom: 2 }}>
          {user.nickname}
        </Typography>
      </Link>

      <Container maxWidth='sm' sx={{ mt: '1.2rem' }}>
        <Formik
          initialValues={{
            email: user.email,
            password: user.password,
            gender: user.gender,
            birthDate: new Date(user.birthDate).toISOString().split('T')[0],
            height: user.height,
            weight: user.weight,
            fitnessLevelNum:
              user.fitnessLevel === 'minimum'
                ? 0
                : user.fitnessLevel === 'beginner'
                ? 25
                : user.fitnessLevel === 'moderate'
                ? 50
                : user.fitnessLevel === 'high'
                ? 75
                : 100,
            avatar: user.avatar,
            nickname: user.nickname,
            submitButton: '',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
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

              const fitnessLevel = getFitnessLevelText(values.fitnessLevelNum);

              const newUser = {
                email: values.email,
                password: values.password,
                gender: values.gender as 'male' | 'female',
                birthDate: new Date(values.birthDate),
                height: values.height,
                weight: values.weight,
                fitnessLevel,
                avatar,
                nickname: values.nickname,
                completedTrainings: [...user.completedTrainings],
                plannedTrainings: [...user.plannedTrainings],
                subscribes: [...user.subscribes],
              };

              if (values.submitButton === 'getNewPlan') {
                await predictWorkouts(
                  user?._id ? user._id.toString() : '',
                  newUser
                );
                refetchUser();
              } else if (values.submitButton === 'changeData') {
                await updateUserById(
                  user._id ? user._id.toString() : '',
                  newUser
                );
                refetchUser();
              }
            } catch (error) {
              console.log('An error occurred during update:', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', mb: '1.2rem' }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={
                      avatar === ''
                        ? `data:image/png;base64, ${user.avatar}`
                        : avatar
                    }
                    sx={{ width: 200, height: 200 }}
                  />

                  <IconButton
                    component='label'
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      m: 1,
                      backgroundColor: 'white',
                      color: 'primary.main',
                      border: '1px solid',
                      '&:hover': {
                        backgroundColor: '#eeeeee',
                      },
                    }}
                  >
                    <PhotoCamera />
                    <input
                      type='file'
                      style={{ display: 'none' }}
                      onChange={(event) => {
                        handleAvatarChange(event);
                        setFieldValue('avatar', event.currentTarget.files?.[0]);
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>

              <Box display='flex' flexDirection='column' gap={2} mb='1.2rem'>
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
                  type='text'
                  name='nickname'
                  label='Nickname'
                  variant='outlined'
                  fullWidth
                  required
                />

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

                <Field
                  as={Slider}
                  name='fitnessLevelNum'
                  step={25}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: 'Minimum' },
                    { value: 25, label: 'Beginner' },
                    { value: 50, label: 'Moderate' },
                    { value: 75, label: 'High' },
                    { value: 100, label: 'Extreme' },
                  ]}
                  sx={{ width: '80%', mx: 'auto' }}
                />

                <Button
                  type='submit'
                  variant='outlined'
                  color='primary'
                  disabled={isSubmitting}
                  fullWidth
                  onClick={() => setFieldValue('submitButton', 'getNewPlan')}
                >
                  Get new plan
                </Button>

                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting}
                  fullWidth
                  onClick={() => setFieldValue('submitButton', 'changeData')}
                >
                  Change data
                </Button>

                <Button
                  type='button'
                  variant='text'
                  color='primary'
                  disabled={isSubmitting}
                  fullWidth
                  onClick={() => navigator('/')}
                >
                  Sign out
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

export default UserProfile;
