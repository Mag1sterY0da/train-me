import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import L from 'leaflet';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet';

// Leaflet CSS
import { Box } from '@mui/system';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { getTrainingTypes, pushCompletedTraining } from '../api/client.ts';
import { useUser } from '../hooks/useUser.ts';
import { ITrainingType } from '../interfaces/ITrainingType.ts';

// Custom styles for the stats container
const statsContainerStyle = {
  marginTop: '16px',
};

// Create a custom Leaflet icon for the user's current position marker
const currentPositionIcon = L.icon({
  iconUrl: markerIconUrl,
  iconSize: [32, 48],
  iconAnchor: [16, 32],
  shadowUrl: markerShadowUrl,
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

// Define custom Leaflet polyline options for the user's movement line
const movementLineOptions = {
  color: 'blue',
  weight: 3,
};

const WorkoutMap: React.FC = () => {
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [pauseTime, setPauseTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState<L.LatLngExpression[]>(
    []
  );
  const workoutHistoryRef = useRef<L.LatLngExpression[]>(workoutHistory);
  const [trainingTypes, setTrainingTypes] = useState<ITrainingType[]>([]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>('');
  const { user, refetchUser } = useUser();

  useEffect(() => {
    (async () => {
      const types = await getTrainingTypes();

      if (types.trainings) setTrainingTypes(types.trainings);
    })();
  }, []);

  // Start the workout
  const startWorkout = () => {
    setIsWorkoutStarted(true);
    setStartTime(Date.now());
  };

  // Pause or resume the workout
  const togglePauseWorkout = () => {
    if (isWorkoutPaused) {
      // Resume the workout
      setIsWorkoutPaused(false);
      const pausedTime = Date.now() - (pauseTime || 0);
      setStartTime((prevStartTime) =>
        prevStartTime ? prevStartTime + pausedTime : 0
      );
      setPauseTime(0);
    } else {
      // Pause the workout
      setIsWorkoutPaused(true);
      setPauseTime(Date.now());
    }
  };

  // Finish the workout
  const finishWorkout = async () => {
    setIsWorkoutStarted(false);
    setIsWorkoutPaused(false);

    // Reset workout data
    setStartTime(0);
    setPauseTime(0);
    setElapsedTime(0);
    setDistance(0);
    setSpeed(0);

    // Reset workout history
    setWorkoutHistory([]);
    workoutHistoryRef.current = [];

    // Send workout data to the user's workout history
    const selectedTrainingType = trainingTypes.find(
      (type) => type.type === selectedWorkoutType
    );
    if (selectedTrainingType) {
      await pushCompletedTraining(
        user?._id ? user._id.toString() : '',
        selectedTrainingType._id?.toString(),
        Math.floor(distance),
        Math.floor(elapsedTime / 60)
      );
    }
  };

  // Update distance, elapsed time, and speed based on workout history and workout state
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isWorkoutStarted && !isWorkoutPaused) {
      intervalId = setInterval(() => {
        const currentElapsedTime = pauseTime
          ? Math.floor((pauseTime - startTime) / 1000)
          : Math.floor((Date.now() - startTime) / 1000);

        const workoutDistance = workoutHistoryRef.current.reduce(
          (totalDistance, currentLatLng, index, array) => {
            if (index === 0) {
              return 0;
            } else {
              const prevLatLng = array[index - 1];
              const distance = L.latLng(currentLatLng).distanceTo(
                L.latLng(prevLatLng)
              );
              return totalDistance + distance;
            }
          },
          0
        );

        const workoutSpeed = workoutDistance / currentElapsedTime;

        setElapsedTime(currentElapsedTime);
        setDistance(workoutDistance);
        setSpeed(workoutSpeed);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        if (isWorkoutPaused) setPauseTime(Date.now());
        clearInterval(intervalId);
      }
    };
  }, [isWorkoutStarted, isWorkoutPaused, startTime, pauseTime]);

  // Update map view and draw workout lines when workout history changes
  const WorkoutMapUpdater: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (workoutHistory.length > 0) {
        const bounds = L.latLngBounds(workoutHistory);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, [map]);

    return (
      <>
        {workoutHistory.length > 0 && (
          <Polyline
            positions={workoutHistory}
            pathOptions={movementLineOptions}
          />
        )}
      </>
    );
  };

  // Update map view and draw workout lines when workout history changes
  const WorkoutMapTracker: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const map = useMap();

    const updateWorkoutHistory = useCallback(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const latLng: L.LatLngExpression = [latitude, longitude];

            map.panTo(latLng, { animate: true });

            if (isWorkoutStarted && !isWorkoutPaused) {
              if (workoutHistory.length === 0) {
                // Add first position to workout history
                setWorkoutHistory([latLng]);
                workoutHistoryRef.current = [latLng];
              } else {
                // Only add new position to workout history if it's different from the previous one
                const prevLatLng = workoutHistory[
                  workoutHistory.length - 1
                ] as [number, number];
                if (prevLatLng[0] !== latitude || prevLatLng[1] !== longitude) {
                  setWorkoutHistory([...workoutHistory, latLng]);
                  workoutHistoryRef.current = [...workoutHistory, latLng];
                }
              }
            }
          },
          (error) => {
            console.error('Error getting current position:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }, [map]);

    useEffect(() => {
      updateWorkoutHistory();

      const intervalId: NodeJS.Timeout = setInterval(
        updateWorkoutHistory,
        5000
      );
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [updateWorkoutHistory]);

    return <>{children}</>;
  };

  // Format the elapsed time to the format 00:00:00
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: '1',
        position: 'relative',
        minHeight: '85vh',
      }}
    >
      <MapContainer
        center={[50.293201, 26.858789]}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ flex: 1, minHeight: '100%', zIndex: 0 }}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <WorkoutMapUpdater />
        {isWorkoutStarted && (
          <WorkoutMapTracker>
            {workoutHistory.length > 0 ? (
              <Marker
                position={workoutHistory[workoutHistory.length - 1]}
                icon={currentPositionIcon}
              />
            ) : null}
          </WorkoutMapTracker>
        )}
      </MapContainer>

      {!isWorkoutStarted && (
        <FormControl fullWidth>
          <InputLabel id='workout-type-label'>Workout Type</InputLabel>
          <Select
            labelId='workout-type-label'
            id='workout-type'
            label='Workout Type'
            value={selectedWorkoutType}
            onChange={(e) => setSelectedWorkoutType(e.target.value)}
          >
            {trainingTypes.map((type, i) => (
              <MenuItem key={i} value={type.type} color={type.color}>
                {type.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {isWorkoutStarted && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            padding: '1rem',
            background: '#eeeeee',
            width: '100%',
            zIndex: 1,
            opacity: 0.7,
          }}
        >
          <Box sx={statsContainerStyle}>
            <Typography variant='h6' align='center'>
              Elapsed Time
            </Typography>
            <Typography variant='h4'>{formatTime(elapsedTime)}</Typography>
          </Box>
          <Box sx={statsContainerStyle}>
            <Typography variant='h6' align='center'>
              Distance
            </Typography>
            <Typography variant='h4'>{`${distance.toFixed(2)} m`}</Typography>
          </Box>
          <Box sx={statsContainerStyle}>
            <Typography variant='h6' align='center'>
              Speed
            </Typography>
            <Typography variant='h4'>{`${speed.toFixed(2)} m/s`}</Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant='contained'
          onClick={startWorkout}
          disabled={isWorkoutStarted}
          sx={{ flex: 1 }}
        >
          Start
        </Button>
        <Button
          variant='contained'
          onClick={togglePauseWorkout}
          disabled={!isWorkoutStarted}
          sx={{ flex: 1 }}
        >
          {isWorkoutPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button
          variant='contained'
          onClick={async () => {
            await finishWorkout();
            await refetchUser();
          }}
          disabled={!isWorkoutStarted}
          sx={{ flex: 1 }}
        >
          Finish
        </Button>
      </Box>
    </Box>
  );
};

export default WorkoutMap;
