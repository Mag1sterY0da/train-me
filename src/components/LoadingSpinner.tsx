import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress sx={{ color: 'secondary', size: '3rem' }} />
    </Box>
  );
};

export default LoadingSpinner;
