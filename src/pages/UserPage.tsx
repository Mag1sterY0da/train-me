import { Avatar, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTrainingTypes, getUser } from '../api/client.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { ITrainingType } from '../interfaces/ITrainingType.ts';
import { IUser } from '../interfaces/IUser.ts';

const UserPage = (): ReactElement => {
  const { id } = useParams();

  const [user, setUser] = useState<IUser | null>(null);

  const [trainingsTypes, setTrainingsTypes] = useState<ITrainingType[]>([]);

  useEffect(() => {
    (async () => {
      const types = await getTrainingTypes();

      if (types.trainings) setTrainingsTypes(types.trainings);
    })();
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      const response = await getUser(id);
      if (!response?.user) {
        throw new Error('User not found');
      } else {
        setUser(response.user);
      }
    })();
  }, [id]);

  if (!user) return <LoadingSpinner />;

  const { avatar, completedTrainings } = user;

  const longestRun =
    completedTrainings && completedTrainings.length
      ? completedTrainings.reduce((prev, current) =>
          (prev?.distance ?? 0) > (current?.distance ?? 0) ? prev : current
        )
      : null;

  const longestDuration =
    completedTrainings && completedTrainings.length
      ? completedTrainings.reduce((prev, current) =>
          (prev?.duration ?? 0) > (current?.duration ?? 0) ? prev : current
        )
      : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Avatar
        alt={user.nickname}
        src={`data:image/png;base64, ${avatar}`}
        sx={{ width: 200, height: 200 }}
      />

      <Typography variant='h4' sx={{ marginTop: '1rem' }}>
        {user.nickname}
      </Typography>

      <Grid
        container
        sx={{
          marginTop: '0.5rem',
          marginBottom: '1rem',
          background: '#eaeaea',
          borderRadius: '0.8rem',
          padding: '0.6rem',
        }}
      >
        <Grid item xs={4}>
          <Typography
            variant='body1'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Workouts
          </Typography>
          <Typography variant='body1' align='center'>
            {completedTrainings.length}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant='body1'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Longest Run
          </Typography>
          <Typography variant='body1' align='center'>
            {longestRun?.distance ?? 0} km
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant='body1'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Longest Duration
          </Typography>
          <Typography variant='body1' align='center'>
            {longestDuration?.duration ?? 0} minutes
          </Typography>
        </Grid>
      </Grid>

      <Typography variant='h5'>Finished Workouts:</Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          marginTop: '0.5rem',
          marginBottom: '1rem',
          background: '#f4f4f4',
          padding: '0.6rem',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='body2'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Long
          </Typography>
          <Typography variant='body1' align='center'>
            {
              completedTrainings.filter(
                (training) => training.type === trainingsTypes[0]?._id
              ).length
            }
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='body2'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Middle
          </Typography>
          <Typography variant='body1' align='center'>
            {
              completedTrainings.filter(
                (training) => training.type === trainingsTypes[1]?._id
              ).length
            }
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='body2'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Speed
          </Typography>
          <Typography variant='body1' align='center'>
            {
              completedTrainings.filter(
                (training) => training.type === trainingsTypes[2]?._id
              ).length
            }
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='body2'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Chill
          </Typography>
          <Typography variant='body1' align='center'>
            {
              completedTrainings.filter(
                (training) => training.type === trainingsTypes[3]?._id
              ).length
            }
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant='body2'
            align='center'
            sx={{ fontWeight: 'bold' }}
          >
            Stretching
          </Typography>
          <Typography variant='body1' align='center'>
            {
              completedTrainings.filter(
                (training) => training.type === trainingsTypes[4]?._id
              ).length
            }
          </Typography>
        </Box>
      </Box>

      <Typography variant='h5'>All Workouts:</Typography>

      <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
        {completedTrainings
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((workout, i) => {
            const typeI = trainingsTypes.findIndex(
              (type) => type._id === workout.type
            );
            return (
              <Grid item key={i} xs={6}>
                <Box
                  sx={{
                    boxShadow: `0px 1px 4px ${trainingsTypes[typeI]?.color}`,
                    borderRadius: '0.8rem',
                    padding: '1rem',
                  }}
                >
                  <Typography variant='h6' align='center'>
                    {`${trainingsTypes[typeI]?.type}`}
                  </Typography>
                  <Typography variant='body1' align='center'>
                    {workout.distance || workout.distance === 0
                      ? `Distance: ${workout.distance} km`
                      : ''}
                  </Typography>
                  <Typography variant='body1' align='center'>
                    {workout.duration || workout.duration === 0
                      ? `Duration: ${workout.duration} min`
                      : ''}
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {new Date(workout.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default UserPage;
