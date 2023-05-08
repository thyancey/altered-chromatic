import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface UiState {
  pressedKeys: string[];
  showKeyboardKeys: boolean;
  showMusicNotes: boolean;
}

const initialState: UiState = {
  pressedKeys: [],
  showKeyboardKeys: true,
  showMusicNotes: true
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setPressedKeys: (state, action: PayloadAction<string[]>) => {
      state.pressedKeys = action.payload;
    },
    setShowKeyboardKeys: (state, action: PayloadAction<boolean>) => {
      state.showKeyboardKeys = action.payload;
    },
    setShowMusicNotes: (state, action: PayloadAction<boolean>) => {
      state.showMusicNotes = action.payload;
    }
  }
});

export const { setShowMusicNotes, setShowKeyboardKeys, setPressedKeys } = uiSlice.actions;

export const getPressedKeys = (state: RootState) => state.ui.pressedKeys;
export const getShowKeyboardKeys = (state: RootState) => state.ui.showKeyboardKeys;
export const getShowMusicNotes = (state: RootState) => state.ui.showMusicNotes;

export default uiSlice.reducer;