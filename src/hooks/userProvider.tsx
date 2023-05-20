import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/client.ts';
import { IUser } from '../interfaces/IUser.ts';
import { UserContext, UserContextProps, UserProviderProps } from './useUser.ts';

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigator = useNavigate();
  const email = user?.email || '';
  const password = user?.password || '';

  const logUser = async (email: string, password: string): Promise<void> => {
    try {
      const loginResponse = await loginUser(email, password);
      if (loginResponse.success) {
        if (!loginResponse.user) throw new Error('User not found');
        setUser(loginResponse.user);
        setIsLoggedIn(true);
        navigator('/home');
      }
    } catch (error) {
      console.log('An error occurred during login:', error);
    }
  };

  const logoutUser = (): void => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const refetchUser = async (): Promise<void> => {
    try {
      const response = await loginUser(email, password);
      if (!response?.user) {
        throw new Error('User not found');
      } else {
        setUser(response.user);
      }
    } catch (error) {
      console.log('An error occurred during login:', error);
    }
  };

  const value: UserContextProps = {
    user,
    isLoggedIn,
    logUser,
    logoutUser,
    refetchUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
