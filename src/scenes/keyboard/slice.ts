import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CompleteNote, LilNoteObj, NoteName, ScaleDef, ScaleDefs, ScaleObj, ScaleStatus } from '../../types';
import { getOctaveScaleObject, getAllOctaveNotesBetween, convertOctaveNoteToMidiId, getKeyScaleObject } from '../../utils/music';
import { getMusicMidiMap, getMusicNotes, getMusicScales } from '../../utils/music-data';

export interface KeyboardState {
  activeKey: string | null;
  activeNote: string | null;
  activeScale: string | null;
  pressedKeys: string[];
  showKeyboardKeys: boolean;
  showMusicNotes: boolean;
  musicType: string;
}

const initialState: KeyboardState = {
  activeKey: null,
  activeNote: null,
  activeScale: null,
  pressedKeys: [],
  showKeyboardKeys: true,
  showMusicNotes: true,
  musicType: 'alteredChromatic'
};

export const PIANO_RANGE = ['A-4', 'D-5'];
export const KEYBOARD_MAP = ['a','w','s','e','d','r','f','t','g','y','h','u','j','i','k','o','l','p',';','[','\''];

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
    }
  }
});

export const { setShowMusicNotes, setShowKeyboardKeys, setActiveKey, setActiveNote, setActiveScale, setPressedKeys } = keyboardSlice.actions;

export const getActiveKey = (state: RootState) => state.keyboard.activeKey;
export const getActiveNote = (state: RootState) => state.keyboard.activeNote;
export const getActiveScale = (state: RootState) => state.keyboard.activeScale;
export const getPressedKeys = (state: RootState) => state.keyboard.pressedKeys;
export const getShowKeyboardKeys = (state: RootState) => state.keyboard.showKeyboardKeys;
export const getShowMusicNotes = (state: RootState) => state.keyboard.showMusicNotes;

export const getMusicType = (state: RootState) => state.keyboard.musicType;
// export const getScaleDefs = (state: RootState) => getMusicScales(state.keyboard.musicType);

export const selectMidiRefDef = createSelector(
  [getMusicType],
  (musicType): LilNoteObj => {
    return getMusicMidiMap(musicType);
  }
);

export const selectNoteDefs = createSelector(
  [getMusicType],
  (musicType): NoteName[] => {
    return getMusicNotes(musicType);
  }
);

export const selectScaleDefs = createSelector(
  [getMusicType],
  (musicType): ScaleDefs => {
    return getMusicScales(musicType);
  }
);

export const selectActiveScaleDef = createSelector(
  [selectScaleDefs, getActiveScale],
  (scaleDefs, activeScale): ScaleDef | null => {
    return activeScale ? scaleDefs[activeScale] : null;
  }
);

export const selectNotesFromScale = createSelector(
  [getActiveKey, selectActiveScaleDef, selectNoteDefs],
  (activeKey, activeScaleDef, noteDefs): ScaleObj | null => {
    if(!activeKey || !activeScaleDef || !noteDefs) return null;

    return getKeyScaleObject(activeKey, activeScaleDef, noteDefs);
  }
);

export const selectActiveScaleObject = createSelector(
  [getActiveNote, selectActiveScaleDef, selectNoteDefs],
  (activeNote, activeScaleDef, noteDefs): ScaleObj | null => {
    if(!activeNote || !activeScaleDef) return null;

    return getOctaveScaleObject(activeNote, activeScaleDef, noteDefs);
  }
);

export const selectAllMajorScales = createSelector(
  [getActiveKey, selectScaleDefs, selectNoteDefs],
  (activeKey, scaleDefs, noteDefs): ScaleObj[] => {
    if(!activeKey || !scaleDefs || !noteDefs) return [];

    return Object.keys(scaleDefs).map(scaleKey => {
      return getKeyScaleObject(activeKey, scaleDefs[scaleKey], noteDefs)
    });
  }
);

export const getScaleStatus = (noteLabel: string, scaleNotes: string[]): ScaleStatus => {
  if(!scaleNotes.includes(noteLabel)) return 'invalid';

  if(noteLabel === scaleNotes[0] || noteLabel === scaleNotes[scaleNotes.length - 1]){
    return 'root';
  }
  return 'scale';
}

export const selectKeyboardKeys = createSelector(
  [selectNotesFromScale, selectMidiRefDef],
  (keyScaleObj, midiRefDef): CompleteNote[] => {
    const octaveNotes = getAllOctaveNotesBetween(PIANO_RANGE[0], PIANO_RANGE[1]);
    return octaveNotes.map((octaveNote, idx) => {
      const noteLabel = octaveNote.split('-')[0] as NoteName;
      return {
        note: noteLabel,
        octaveNote: octaveNote,
        midiNote: convertOctaveNoteToMidiId(octaveNote, midiRefDef),
        scaleStatus: keyScaleObj ? getScaleStatus(noteLabel, keyScaleObj.notes) : 'inactive',
        idx
      };
    })
  }
);

export const selectKeyboardKeysWithPressed = createSelector(
  [selectKeyboardKeys, getPressedKeys],
  (keyboardKeys, pressedKeys): CompleteNote[] => {
    return keyboardKeys.map(kk => ({
      ...kk,
      keyMatch: KEYBOARD_MAP[kk.idx],
      keyPressed: pressedKeys.includes(KEYBOARD_MAP[kk.idx])
    }));
  }
)

export default keyboardSlice.reducer;