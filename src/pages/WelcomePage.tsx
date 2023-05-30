import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser.ts';

const WelcomePage = () => {
  const navigator = useNavigate();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { isLoggedIn, logUser } = useUser();

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'
    >
      <Container maxWidth='sm'>
        <Box sx={{ mb: '2.4rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src='public/main-logo.svg'
              alt='Train.me logo'
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Typography variant='h4' component='h1' align='center' gutterBottom>
            Welcome to
            <Typography
              variant='h4'
              component='span'
              color='logo.main'
              sx={{ fontWeight: 'bold', mx: '0.5rem' }}
            >
              Train.Me
            </Typography>
          </Typography>
          <Typography
            variant='h6'
            component='h2'
            align='center'
            gutterBottom
            sx={{ mb: '1.8rem' }}
          >
            your personal trainer for running
          </Typography>
          <Typography
            variant='body1'
            component='p'
            color='textSecondary'
            align='center'
          >
            Begin your fitness goals with our personalized running plans.
          </Typography>
        </Box>
        <Formik
          initialValues={{
            email: 'oleksandr-borodavchenko@gmail.com',
            password: '1234',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await logUser(values.email, values.password);
            if (!isLoggedIn) {
              setDialogOpen(true);
            }
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <Box display='flex' flexDirection='column' gap={2}>
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
                  type='password'
                  name='password'
                  label='Password'
                  variant='outlined'
                  fullWidth
                  required
                />
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting}
                  fullWidth
                >
                  Sign In
                </Button>
                <Button
                  type='button'
                  variant='outlined'
                  color='primary'
                  disabled={isSubmitting}
                  fullWidth
                  onClick={() =>
                    navigator(
                      `/registration?email=${values.email}&password=${values.password}`
                    )
                  }
                >
                  Sign Up
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title' align='center'>
            Login Failed
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              The user with the provided login details was not found. Please
              check your email and password or register if you don't have an
              account.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default WelcomePage;
