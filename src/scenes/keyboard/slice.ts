import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CompleteNote, InstrumentDef, LilNoteObj, NoteName, ScaleDef, ScaleDefs, ScaleObj, ScaleStatus } from '../../types';
import { getOctaveScaleObject, getAllOctaveNotesBetween, convertOctaveNoteToMidiId, getKeyScaleObject, translateNoteBetweenConfigs } from '../../utils/music';
import { DEFAULT_CONFIG_TYPE, DEFAULT_INSTRUMENT_TYPE, getMusicMidiMap, getMusicNotes, getMusicScales, INSTRUMENT_DEFS, MUSIC_CONFIGS } from '../../utils/music-data';

export interface KeyboardState {
  activeKey: string | null;
  activeNote: string | null;
  activeScale: string | null;
  pressedKeys: string[];
  showKeyboardKeys: boolean;
  showMusicNotes: boolean;
  activeConfig: string;
  instrumentType: string;
}

const initialState: KeyboardState = {
  // activeKey: null,
  activeKey: 'A',
  activeNote: null,
  // activeScale: null,
  activeScale: 'ionian',
  pressedKeys: [],
  showKeyboardKeys: true,
  showMusicNotes: true,
  activeConfig: DEFAULT_CONFIG_TYPE,
  instrumentType: DEFAULT_INSTRUMENT_TYPE,
};

export const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActiveKey: (state, action: PayloadAction<string>) => {
      state.activeKey = action.payload;
    },
    setActiveNote: (state, action: PayloadAction<string>) => {
      state.activeNote = action.payload;
      if(action.payload){
        state.activeKey = action.payload.split('-')[0];
      }else{
        state.activeKey = null;
      }
    },
    setActiveScale: (state, action: PayloadAction<string>) => {
      if(state.activeScale === action.payload){
        state.activeScale = null;
      }else{
        state.activeScale = action.payload;
      }
    },
    setPressedKeys: (state, action: PayloadAction<string[]>) => {
      state.pressedKeys = action.payload;
    },
    setShowKeyboardKeys: (state, action: PayloadAction<boolean>) => {
      state.showKeyboardKeys = action.payload;
    },
    setShowMusicNotes: (state, action: PayloadAction<boolean>) => {
      state.showMusicNotes = action.payload;
    },
    setActiveConfig: (state, action: PayloadAction<string>) => {
      if(state.activeConfig !== action.payload){
        state.activeConfig = action.payload;
        if(action.payload === 'alteredChromatic'){
          state.instrumentType = 'alteredPiano';
          if(state.activeKey){
            state.activeKey = translateNoteBetweenConfigs(state.activeKey, MUSIC_CONFIGS.standardChromatic.notes, MUSIC_CONFIGS.alteredChromatic.notes);
          }
        }
        if(action.payload === 'standardChromatic'){
          state.instrumentType = 'standardPiano';
          if(state.activeKey){
            state.activeKey = translateNoteBetweenConfigs(state.activeKey, MUSIC_CONFIGS.alteredChromatic.notes, MUSIC_CONFIGS.standardChromatic.notes);
          }
        }
      }
    },
  }
});

export const { setShowMusicNotes, setShowKeyboardKeys, setActiveKey, setActiveNote, setActiveScale, setPressedKeys, setActiveConfig } = keyboardSlice.actions;

export const getActiveKey = (state: RootState) => state.keyboard.activeKey;
export const getActiveNote = (state: RootState) => state.keyboard.activeNote;
export const getActiveScale = (state: RootState) => state.keyboard.activeScale;
export const getPressedKeys = (state: RootState) => state.keyboard.pressedKeys;
export const getShowKeyboardKeys = (state: RootState) => state.keyboard.showKeyboardKeys;
export const getShowMusicNotes = (state: RootState) => state.keyboard.showMusicNotes;

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
  [getActiveKey, selectActiveScaleDef, selectAllNotes],
  (activeKey, activeScaleDef, allNotes): ScaleObj | null => {
    if(!activeKey || !activeScaleDef || !allNotes) return null;

    return getKeyScaleObject(activeKey, activeScaleDef, allNotes);
  }
);

export const selectAdjacentKeys = createSelector(
  [selectAllNotes, getActiveKey],
  (allKeys, activeKey): [ string, string ] | null => {
    if(!activeKey) return null;

    const idx = allKeys.findIndex(keyName => keyName === activeKey);
    if(idx === -1) return null;

    const prevIdx = idx === 0 ? allKeys.length - 1 : idx - 1;
    const nextIdx = idx === allKeys.length - 1 ? 0 : idx + 1;
    return [ allKeys[prevIdx], allKeys[nextIdx] ];
  }
)

export const selectActiveScaleObject = createSelector(
  [getActiveNote, selectActiveScaleDef, selectAllNotes],
  (activeNote, activeScaleDef, allNotes): ScaleObj | null => {
    if(!activeNote || !activeScaleDef) return null;

    return getOctaveScaleObject(activeNote, activeScaleDef, allNotes);
  }
);

export const selectAllMajorScales = createSelector(
  [getActiveKey, selectScaleDefs, selectAllNotes],
  (activeKey, scaleDefs, allNotes): ScaleObj[] => {
    if(!activeKey || !scaleDefs || !allNotes) return [];

    return Object.keys(scaleDefs).map(scaleKey => {
      return getKeyScaleObject(activeKey, scaleDefs[scaleKey], allNotes)
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