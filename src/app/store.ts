import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../examples/counter/counterSlice';
import keyboardReducer from '../scenes/keyboard/slice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    keyboard: keyboardReducer,
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
