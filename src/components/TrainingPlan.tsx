import { Checkbox, Paper, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import { Field, Form, Formik } from 'formik';
import { Schema } from 'mongoose';
import { useEffect, useMemo, useState } from 'react';
import { getTrainingTypesById, updateTrainingStatus } from '../api/client.ts';
import { useModel } from '../hooks/useModel.ts';
import { useUser } from '../hooks/useUser.ts';
import { ITrainingType } from '../interfaces/ITrainingType.ts';
import { IUser } from '../interfaces/IUser.ts';
import LoadingSpinner from './LoadingSpinner.tsx';

interface TrainingItemProps {
  completed: string;
  color: string;
  overdue: string; // Define the 'overdue' prop
}

const TrainingItem = styled(Paper)<TrainingItemProps>(
  ({ completed, color, overdue }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    background:
      completed === 'false'
        ? overdue === 'true'
          ? '#ffdddd'
          : '#ffffff'
        : '#eeeeee',
    color: completed === 'true' ? '#888888' : '#000000',
    borderLeft: `10px solid ${color}`,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    gap: '2rem',
  })
);

type TrainingPlan = {
  type: Schema.Types.ObjectId;
  distance?: number;
  duration?: number;
  date: Date;
  completed?: boolean;
};

const TrainingPlan = () => {
  const { user, refetchUser } = useUser();
  const { predictWorkouts } = useModel();

  useEffect(() => {
    (async () => {
      if (
        user?.plannedTrainings.length === 0 &&
        user?.completedTrainings.length === 0
      ) {
        try {
          await predictWorkouts(user?._id?.toString() || '', user as IUser);
          await refetchUser();
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [user, refetchUser, predictWorkouts]);

  const uniqueTrainingTypes = useMemo(() => {
    const typesSet = new Set(
      user?.plannedTrainings?.map((training: TrainingPlan) => training?.type)
    );
    return Array.from(typesSet);
  }, [user?.plannedTrainings]);

  const [trainingsType, setTrainingsType] = useState<ITrainingType[]>([]);

  useEffect(() => {
    if (!user?.plannedTrainings) return;

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
  }, [user?.plannedTrainings, uniqueTrainingTypes]);

  if (!user || trainingsType.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Typography variant='h5' component='h1' align='center' gutterBottom>
        Next 7 days you have to run:
      </Typography>
      <Formik
        initialValues={user}
        onSubmit={() => {
          // Handle form submission if needed
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {values.plannedTrainings?.map(
              (training: TrainingPlan, index: number) => {
                const matchingType = trainingsType?.find(
                  (type) => type._id === training.type
                );

                return (
                  <TrainingItem
                    key={index}
                    color={matchingType?.color || '#000000'}
                    completed={training.completed ? 'true' : 'false'}
                    overdue={
                      new Date(training.date) < new Date() ? 'true' : 'false'
                    }
                  >
                    <Field
                      type='checkbox'
                      name={`plannedTrainings[${index}].completed`}
                      as={Checkbox}
                      onChange={async (
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFieldValue(
                          `plannedTrainings[${index}].completed`,
                          e.target.checked
                        );
                        await updateTrainingStatus(
                          user?._id?.toString() || '',
                          training.date,
                          e.target.checked
                        );
                        await refetchUser();
                      }}
                    />
                    <Typography variant='subtitle1' sx={{ flex: '0.5' }}>
                      {matchingType?.type}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2'>
                        Difficulty: {matchingType?.load}
                      </Typography>
                      {training.distance && (
                        <Typography variant='body2'>
                          Distance: {training.distance} m
                        </Typography>
                      )}
                      {training.duration && (
                        <Typography variant='body2'>
                          Duration: {training.duration} min
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
              }
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default TrainingPlan;
