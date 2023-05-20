import {
  AccountBox,
  CalendarMonth,
  DirectionsRun,
  FitnessCenter,
  People,
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Tab, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FriendList from '../components/FriendsList.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import TrainingHistory from '../components/TrainingHistory.tsx';
import TrainingPlan from '../components/TrainingPlan.tsx';
import UserProfile from '../components/UserProfile.tsx';
import WorkoutMap from '../components/WorkoutMap.tsx';
import { useUser } from '../hooks/useUser.ts';

const HomePage = () => {
  // Add params to url on tab change
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { tab } = Object.fromEntries(params.entries());

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);

  const navigator = useNavigate();
  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState<string>('1');

  useEffect(() => {
    if (!user) {
      navigator('/');
      return;
    }
  }, [navigator, user]);

  if (!user) {
    return <LoadingSpinner />;
  }

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    params.set('tab', newValue);
    navigator(`?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <TabContext value={currentTab}>
        <Container maxWidth='sm' sx={{ flexGrow: 1 }}>
          <Box sx={{ width: '100%' }}>
            <TabPanel value='1'>
              <TrainingPlan />
            </TabPanel>
            <TabPanel value='2'>
              <TrainingHistory />
            </TabPanel>
            <TabPanel value='3'>
              <WorkoutMap />
            </TabPanel>
            <TabPanel value='4'>
              <Typography variant='h6'>
                <FriendList />
              </Typography>
            </TabPanel>
            <TabPanel value='5'>
              <UserProfile />
            </TabPanel>
          </Box>
        </Container>
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 1,
            backgroundColor: 'background.paper',
            boxShadow: 2,
            width: '100%',
            alignSelf: 'flex-end',
          }}
        >
          <TabList
            onChange={handleChange}
            centered
            sx={{
              width: '100%',
              pb: '0.2rem',
            }}
          >
            <Tab
              label='Plan'
              icon={<CalendarMonth />}
              sx={{ flex: 1 }}
              value='1'
            />
            <Tab
              label='History'
              icon={<FitnessCenter />}
              sx={{ flex: 1 }}
              value='2'
            />
            <Tab
              label='Train'
              icon={<DirectionsRun />}
              sx={{ flex: 1 }}
              value='3'
            />
            <Tab label='Friends' icon={<People />} sx={{ flex: 1 }} value='4' />
            <Tab
              label='My data'
              icon={<AccountBox />}
              sx={{ flex: 1 }}
              value='5'
            />
          </TabList>
        </Box>
      </TabContext>
    </Box>
  );
};

export default HomePage;
