import { Paper, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import { Schema } from 'mongoose';
import { useEffect, useMemo, useState } from 'react';
import { getTrainingTypesById } from '../api/client.ts';
import { useUser } from '../hooks/useUser.ts';
import { ITrainingType } from '../interfaces/ITrainingType.ts';

const TrainingItem = styled(Paper)<{ color: string }>(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  background: '#ffffff',
  color: '#000000',
  borderLeft: `10px solid ${color}`,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  gap: '2rem',
}));

type TrainingPlan = {
  type: Schema.Types.ObjectId;
  distance?: number;
  duration?: number;
  date: Date;
  completed?: boolean;
};

const TrainingHistory = () => {
  const { user } = useUser();

  const uniqueTrainingTypes = useMemo(() => {
    const typesSet = new Set(
      user?.completedTrainings?.map((training: TrainingPlan) => training?.type)
    );
    return Array.from(typesSet);
  }, [user?.completedTrainings]);

  const [trainingsType, setTrainingsType] = useState<ITrainingType[]>([]);

  useEffect(() => {
    if (!user?.completedTrainings) return;

    (async () => {
      const trainingsType = await Promise.all(
        uniqueTrainingTypes.map(async (type) => {
          const response = await getTrainingTypesById(type.toString());
          return response.trainings;
        })
      );
      if (!trainingsType) return;

      setTrainingsType(trainingsType as ITrainingType[]);
    })();
  }, [user?.completedTrainings, uniqueTrainingTypes]);

  if (!user?.completedTrainings) return null;

  return (
    <Box>
      <Typography variant='h5' component='h1' align='center' gutterBottom>
        History of your trainings
      </Typography>
      {user.completedTrainings?.map((training: TrainingPlan, index: number) => {
        const matchingType = trainingsType?.find(
          (type) => type._id === training.type
        );

        return (
          <TrainingItem key={index} color={matchingType?.color || '#000000'}>
            <Typography variant='subtitle1' sx={{ flex: '0.5' }}>
              {matchingType?.type}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <Typography variant='body2'>
                Difficulty: {matchingType?.load}
              </Typography>
              {training && training.distance !== undefined && (
                <Typography variant='body2'>
                  Distance:{' '}
                  {training.distance !== 0 ? training.distance + ' km' : '0 km'}
                </Typography>
              )}
              {training && training.duration !== undefined && (
                <Typography variant='body2'>
                  Duration:{' '}
                  {training.duration !== 0
                    ? training.duration + ' min'
                    : '0 min'}
                </Typography>
              )}

              <Box>
                <Typography variant='body2'>
                  {new Date(training.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Typography>
                <Typography variant='body2' color='secondary'>
                  {new Date(training.date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Typography>
              </Box>
            </Box>
          </TrainingItem>
        );
      })}
    </Box>
  );
};

export default TrainingHistory;
