import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { loginSuccess, logout } from './actions';
import { DeepUndefined } from '../types';
import { RootState } from './store';
import { Login_login } from '../views/Login/__generated__/Login';

type UserState = DeepUndefined<Login_login>;

const initialState: UserState = {
  accessToken: undefined,
  user: undefined,
};

export const useAuthSelector = () =>
  useSelector((state: RootState) => ({ ...state.auth }));

export const useUserSelector = () =>
  useSelector((state: RootState) => state.auth.user);

export const auth = createReducer<UserState>(initialState, builder => {
  builder.addCase(loginSuccess, (state, action) => {
    return {
      ...state,
      accessToken: action.payload.accessToken,
      user: {
        ...action.payload.user,
      },
    };
  });
  builder.addCase(logout, () => {
    return initialState;
  });
});
