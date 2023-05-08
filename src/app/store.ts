import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import keyboardReducer from '../scenes/keyboard/slice';
import uiReducer from './ui-slice';

export const store = configureStore({
  reducer: {
    keyboard: keyboardReducer,
    ui: uiReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
