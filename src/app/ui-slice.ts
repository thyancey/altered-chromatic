import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { InstrumentDef, InstrumentObj } from '../types';
import { INSTRUMENT_DEFS } from '../utils/music-data';

export interface UiState {
  pressedKeys: string[];
  showKeyboardKeys: boolean;
  showMusicNotes: boolean;
  showScaleNotes: boolean;
  instruments: InstrumentObj[];
  activeInstrumentIdx: number;
}

const initialState: UiState = {
  pressedKeys: [],
  showKeyboardKeys: true,
  showMusicNotes: false,
  showScaleNotes: true,
  instruments: [
    {
      activeConfig: "alteredChromatic",
      instrumentType: "alteredPiano"
    },
    {
      activeConfig: "standardChromatic",
      instrumentType: "standardPiano"
    }
  ],
  activeInstrumentIdx: 0,
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
    },
    setShowScaleNotes: (state, action: PayloadAction<boolean>) => {
      state.showScaleNotes = action.payload;
    },
    setActiveInstrumentIdx: (state, action: PayloadAction<number>) => {
      state.activeInstrumentIdx = action.payload;
    }
  }
});

export const { setActiveInstrumentIdx, setShowScaleNotes, setShowMusicNotes, setShowKeyboardKeys, setPressedKeys } = uiSlice.actions;

export const getPressedKeys = (state: RootState) => state.ui.pressedKeys;
export const getShowKeyboardKeys = (state: RootState) => state.ui.showKeyboardKeys;
export const getShowMusicNotes = (state: RootState) => state.ui.showMusicNotes;
export const getShowScaleNotes = (state: RootState) => state.ui.showScaleNotes;
export const getInstruments = (state: RootState) => state.ui.instruments;
export const getActiveInstrumentIdx = (state: RootState) => state.ui.activeInstrumentIdx;

export const selectInstrumentDefs = createSelector(
  [getInstruments],
  (instruments): InstrumentDef[] => {
    return instruments.map(instrument => ({
      ...INSTRUMENT_DEFS[instrument.instrumentType],
      key: instrument.instrumentType
    }));
  }
);

export default uiSlice.reducer;