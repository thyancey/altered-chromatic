import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface MusicState {
  rootNoteIdx: number;
  rootNoteOctave: number;
  activeScale: string | null;
}

const initialState: MusicState = {
  rootNoteIdx: 0,
  rootNoteOctave: 5,
  activeScale: 'ionian'
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRootNoteIdx: (state, action: PayloadAction<number>) => {
      state.rootNoteIdx = action.payload;
    },
    setActiveScale: (state, action: PayloadAction<string>) => {
      if(state.activeScale === action.payload){
        state.activeScale = null;
      }else{
        state.activeScale = action.payload;
      }
    },
    setDefaultScale: (state, action: PayloadAction<string>) => {
      if(state.activeScale === action.payload){
        state.activeScale = null;
      }else{
        state.activeScale = action.payload;
      }
    }
  }
});

export const { setRootNoteIdx, setActiveScale, setDefaultScale } = musicSlice.actions;

export const getRootNoteIdx = (state: RootState) => state.music.rootNoteIdx;
export const getRootNoteOctave = (state: RootState) => state.music.rootNoteOctave;
export const getActiveScale = (state: RootState) => state.music.activeScale;

export default musicSlice.reducer;