import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useModel } from './hooks/useModel.ts';
import { UserProvider } from './hooks/userProvider.tsx';
import HomePage from './pages/HomePage.tsx';
import RegistrationPage from './pages/RegistrationPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import UserPage from './pages/UserPage.tsx';
import WelcomePage from './pages/WelcomePage.tsx';

type themeProps = {
  palette: {
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
    logo: {
      main: string;
    };
  };
};

const theme: themeProps = {
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#7e7e7e',
    },
    logo: {
      main: '#64cc77',
    },
  },
};

const muiTheme = createTheme(theme);

const App = () => {
  const { startTrainOfModel, trained } = useModel();

  useEffect(() => {
    if (!trained) startTrainOfModel();
    console.log('trained', trained);
  }, [startTrainOfModel, trained]);

  return (
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path='/' element={<WelcomePage />} />
            <Route path='/registration' element={<RegistrationPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/users/:id' element={<UserPage />} />
            <Route path='/terms' element={<TermsPage />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
