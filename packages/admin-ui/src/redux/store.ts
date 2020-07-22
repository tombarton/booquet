import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { auth } from './reducers';

export interface RootState {
  auth: ReturnType<typeof auth>;
}

export const store = configureStore({
  reducer: combineReducers({ auth }),
});
