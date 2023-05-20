import { createContext, useContext } from 'react';
import { IUser } from '../interfaces/IUser.ts';

export interface UserContextProps {
  user: IUser | null;
  isLoggedIn: boolean;
  logUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  refetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export interface UserProviderProps {
  children: React.ReactNode;
}
