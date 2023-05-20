import { Box, Container, Typography } from '@mui/material';

const TermsPage = () => {
  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' component='h1' align='center' gutterBottom>
          Terms and Conditions
        </Typography>

        <Typography variant='body1' gutterBottom>
          Please read the following terms and conditions carefully before using
          the web app. By accessing and using the app, you agree to be bound by
          these terms. If you do not agree with any of the terms, please do not
          use the app.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          1. Terms of Service
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users agree to abide by the terms and conditions outlined by the web
          app provider, including any restrictions on usage, intellectual
          property rights, and disclaimers of liability.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          2. Privacy Policy
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users agree to abide by the terms and conditions outlined by the web
          app provider, including any restrictions on usage, intellectual
          property rights, and disclaimers of liability.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          3. Data Usage and Sharing
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users agree to allow the web app to collect and analyze their running
          workout data, including distance, duration, and performance metrics,
          for the purpose of providing personalized recommendations, tracking
          progress, and improving the app's functionality.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          4. Account Registration
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users agree to provide accurate and up-to-date information when
          creating an account, and to maintain the confidentiality of their
          login credentials.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          5. Consent for Notifications
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users agree to receive notifications and alerts related to their
          running workouts, such as goal achievements, reminders, and updates on
          training plans, either through the web app or via email, based on
          their communication preferences.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          6. User Generated Content
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users agree to take responsibility for any content they upload or
          share within the web app's community, ensuring it complies with
          applicable laws, respects intellectual property rights, and does not
          violate the rights of others.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          7. Fitness Disclaimer
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users acknowledge that the web app's personalized recommendations and
          training plans are provided for informational purposes only and should
          not replace professional advice. Users are advised to consult with a
          qualified fitness professional before starting or modifying any
          exercise program.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          8. Age Restriction
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users agree that they are of legal age or have obtained parental
          consent to use the web app if they are under the specified age limit.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          9. Termination of Account
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users acknowledge that the web app provider reserves the right to
          terminate or suspend user accounts in case of violation of the terms
          of service or for any other valid reason.
        </Typography>

        <Typography variant='h5' component='h2' gutterBottom>
          10. Changes to Terms
        </Typography>

        <Typography variant='body1' gutterBottom>
          Users acknowledge that the web app provider may update or modify the
          terms and conditions from time to time and agree to review and comply
          with the most recent version.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsPage;
