import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CompleteNote, RootNoteObj, InstrumentDef, LilNoteObj, NoteName, ScaleDef, ScaleDefs, ScaleObj, ScaleStatus } from '../../types';
import { getOctaveScaleObject, getAllOctaveNotesBetween, convertOctaveNoteToMidiId, getKeyScaleObject } from '../../utils/music';
import { DEFAULT_CONFIG_TYPE, DEFAULT_INSTRUMENT_TYPE, getMusicMidiMap, getMusicNotes, getMusicScales, INSTRUMENT_DEFS, MUSIC_CONFIGS } from '../../utils/music-data';
import { getPressedKeys } from '../../app/ui-slice';

export interface KeyboardState {
  rootNoteIdx: number;
  rootNoteOctave: number;
  activeScale: string | null;
  activeConfig: string;
  instrumentType: string;
}

const initialState: KeyboardState = {
  rootNoteIdx: 0,
  rootNoteOctave: 5,
  // activeScale: null,
  activeScale: 'ionian',
  activeConfig: DEFAULT_CONFIG_TYPE,
  instrumentType: DEFAULT_INSTRUMENT_TYPE,
};

export const keyboardSlice = createSlice({
  name: 'keyboard',
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
    setActiveConfig: (state, action: PayloadAction<string>) => {
      if(state.activeConfig !== action.payload){
        state.activeConfig = action.payload;
        if(action.payload === 'alteredChromatic'){
          state.instrumentType = 'alteredPiano';
        }
        if(action.payload === 'standardChromatic'){
          state.instrumentType = 'standardPiano';
        }
      }
    },
  }
});

export const { setRootNoteIdx, setActiveScale, setActiveConfig } = keyboardSlice.actions;

export const getRootNoteIdx = (state: RootState) => state.keyboard.rootNoteIdx;
export const getRootNoteOctave = (state: RootState) => state.keyboard.rootNoteOctave;
export const getActiveScale = (state: RootState) => state.keyboard.activeScale;

export const getActiveConfig = (state: RootState) => state.keyboard.activeConfig;
export const getInstrumentType = (state: RootState) => state.keyboard.instrumentType;

export const selectInstrumentDef = createSelector(
  [getInstrumentType],
  (instrumentType): InstrumentDef => {
    return {
      ...INSTRUMENT_DEFS[instrumentType],
      key: instrumentType
    }
  }
);

export const selectMidiRefDef = createSelector(
  [getActiveConfig],
  (activeConfig): LilNoteObj => {
    return getMusicMidiMap(activeConfig);
  }
);

export const selectAllNotes = createSelector(
  [getActiveConfig],
  (activeConfig): NoteName[] => {
    return getMusicNotes(activeConfig);
  }
);

export const selectScaleDefs = createSelector(
  [getActiveConfig],
  (activeConfig): ScaleDefs => {
    return getMusicScales(activeConfig);
  }
);

export const selectActiveScaleDef = createSelector(
  [selectScaleDefs, getActiveScale],
  (scaleDefs, activeScale): ScaleDef | null => {
    return activeScale ? scaleDefs[activeScale] : null;
  }
);

export const selectNotesFromScale = createSelector(
  [getRootNoteIdx, selectActiveScaleDef, selectAllNotes],
  (rootNoteIdx, activeScaleDef, allNotes): ScaleObj | null => {
    if(rootNoteIdx === -1  || !activeScaleDef || !allNotes) return null;

    return getKeyScaleObject(rootNoteIdx, activeScaleDef, allNotes);
  }
);

export const selectAdjacentRootNoteIdxs = createSelector(
  [selectAllNotes, getRootNoteIdx],
  (allKeys, rootNoteIdx): [ number, number ] | null => {
    if(rootNoteIdx === -1) return null;

    return [ 
      rootNoteIdx === 0 ? allKeys.length - 1 : rootNoteIdx - 1, // prev, wrap to end
      rootNoteIdx === allKeys.length - 1 ? 0 : rootNoteIdx + 1 // next, wrap to beginning
    ];
  }
)

export const selectRootNote = createSelector(
  [getRootNoteIdx, getRootNoteOctave, selectAllNotes],
  (rootNoteIdx, rootNoteOctave, allNotes): RootNoteObj | null => {
    if(rootNoteIdx === -1 || !allNotes) return null;
    return {
      idx: rootNoteIdx,
      label: allNotes[rootNoteIdx],
      octave: rootNoteOctave
    }
  }
);

export const selectActiveScaleObject = createSelector(
  [selectRootNote, selectActiveScaleDef, selectAllNotes],
  (rootNote, activeScaleDef, allNotes): ScaleObj | null => {
    if(!rootNote || !activeScaleDef) return null;

    return getOctaveScaleObject(rootNote, activeScaleDef, allNotes);
  }
);

export const selectAllMajorScales = createSelector(
  [getRootNoteIdx, selectScaleDefs, selectAllNotes],
  (rootNoteIdx, scaleDefs, allNotes): ScaleObj[] => {
    if(rootNoteIdx === -1 || !scaleDefs || !allNotes) return [];

    return Object.keys(scaleDefs).map(scaleKey => {
      return getKeyScaleObject(rootNoteIdx, scaleDefs[scaleKey], allNotes)
    });
  }
);

export const selectAdjacentScales = createSelector(
  [selectAllMajorScales, getActiveScale],
  (allScales, activeScale): [ ScaleObj, ScaleObj ] | null => {
    if(!activeScale) return null;

    const idx = allScales.findIndex(scaleObj => scaleObj.id === activeScale);
    if(idx === -1) return null;

    const prevIdx = idx === 0 ? allScales.length - 1 : idx - 1;
    const nextIdx = idx === allScales.length - 1 ? 0 : idx + 1;
    return [ allScales[prevIdx], allScales[nextIdx] ];
  }
)

export const getScaleStatus = (noteLabel: string, scaleNotes: string[]): ScaleStatus => {
  if(!scaleNotes.includes(noteLabel)) return 'invalid';

  if(noteLabel === scaleNotes[0] || noteLabel === scaleNotes[scaleNotes.length - 1]){
    return 'root';
  }
  return 'scale';
}

export const selectKeyboardKeys = createSelector(
  [selectNotesFromScale, selectMidiRefDef, selectAllNotes, selectInstrumentDef],
  (keyScaleObj, midiRefDef, allNotes, instrumentDef): CompleteNote[] => {
    const octaveNotes = getAllOctaveNotesBetween(instrumentDef.range[0], instrumentDef.range[1], allNotes);
    return octaveNotes.map((octaveNote, idx) => {
      const noteLabel = octaveNote.split('-')[0] as NoteName;
      return {
        note: noteLabel,
        octaveNote: octaveNote,
        midiNote: convertOctaveNoteToMidiId(octaveNote, midiRefDef, allNotes),
        scaleStatus: keyScaleObj ? getScaleStatus(noteLabel, keyScaleObj.notes) : 'inactive',
        idx
      };
    })
  }
);

export const selectKeyboardKeysWithPressed = createSelector(
  [selectKeyboardKeys, getPressedKeys, selectInstrumentDef],
  (keyboardKeys, pressedKeys, instrumentDef): CompleteNote[] => {
    return keyboardKeys.map(kk => ({
      ...kk,
      keyMatch: instrumentDef.keyboardKeys[kk.idx],
      keyPressed: pressedKeys.includes(instrumentDef.keyboardKeys[kk.idx])
    }));
  }
)

export default keyboardSlice.reducer;