import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CompleteNote, NoteName, ScaleObj, SCALES, ScaleStatus, getOctaveScaleObject, getAllOctaveNotesBetween, convertOctaveNoteToMidiId, getKeyScaleObject } from '../../utils/music';

export interface KeyboardState {
  activeKey: string | null;
  activeNote: string | null;
  activeScale: string | null;
  pressedKeys: string[];
}

const initialState: KeyboardState = {
  activeKey: null,
  activeNote: null,
  activeScale: null,
  pressedKeys: []
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
    }
  }
});

export const { setActiveKey, setActiveNote, setActiveScale, setPressedKeys } = keyboardSlice.actions;

export const getActiveKey = (state: RootState) => state.keyboard.activeKey;
export const getActiveNote = (state: RootState) => state.keyboard.activeNote;
export const getActiveScale = (state: RootState) => state.keyboard.activeScale;
export const getPressedKeys = (state: RootState) => state.keyboard.pressedKeys;


export const selectNotesFromScale = createSelector(
  [getActiveKey, getActiveScale],
  (activeKey, activeScale): ScaleObj | null => {
    if(!activeKey || !activeScale) return null;

    return getKeyScaleObject(activeKey, activeScale);
  }
);


export const selectActiveScaleObject = createSelector(
  [getActiveScale, getActiveNote],
  (activeScale, activeNote): ScaleObj | null => {
    if(!activeNote || !activeScale) return null;

    return getOctaveScaleObject(activeNote, activeScale);
  }
);

export const selectAllMajorScales = createSelector(
  [getActiveNote],
  (activeNote): ScaleObj[] => {
    if(!activeNote) return [];

    return Object.keys(SCALES).map(scaleKey => {
      return getOctaveScaleObject(activeNote, scaleKey)
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
  [selectNotesFromScale],
  (keyScaleObj): CompleteNote[] => {
    const octaveNotes = getAllOctaveNotesBetween(PIANO_RANGE[0], PIANO_RANGE[1]);
    return octaveNotes.map((octaveNote, idx) => {
      const noteLabel = octaveNote.split('-')[0] as NoteName;
      return {
        note: noteLabel,
        octaveNote: octaveNote,
        midiNote: convertOctaveNoteToMidiId(octaveNote),
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
