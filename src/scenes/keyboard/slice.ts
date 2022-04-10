import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CompleteNote, NoteName, ScaleObj, SCALES, ScaleStatus, getScaleObject, getAllOctaveNotesBetween, convertOctaveNoteToMidiId } from '../../utils/music';

export interface KeyboardState {
  activeNote: string | null;
  activeScale: string | null;
  pressedKeys: string[];
}

const initialState: KeyboardState = {
  activeNote: null,
  activeScale: null,
  pressedKeys: []
};

export const PIANO_RANGE = ['A-4', 'E-5'];
export const KEYBOARD_MAP = ['a','w','s','e','d','r','f','t','g','y','h','u','j','i','k','o','l','p',';','[','\''];

export const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActiveNote: (state, action: PayloadAction<string>) => {
      state.activeNote = action.payload;
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

export const { setActiveNote, setActiveScale, setPressedKeys } = keyboardSlice.actions;

export const getActiveNote = (state: RootState) => state.keyboard.activeNote;
export const getActiveScale = (state: RootState) => state.keyboard.activeScale;
export const getPressedKeys = (state: RootState) => state.keyboard.pressedKeys;

export const selectActiveScale = createSelector(
  [getActiveScale, getActiveNote],
  (activeScale, activeNote): ScaleObj | null => {
    if(!activeNote || !activeScale) return null;

    return getScaleObject(activeNote, activeScale);
  }
);

export const selectAllMajorScales = createSelector(
  [getActiveNote],
  (activeNote): ScaleObj[] | null => {
    if(!activeNote) return null;

    return Object.keys(SCALES).map(scaleKey => {
      return getScaleObject(activeNote, scaleKey)
    });
  }
);

export const getScaleStatus = (octaveNote: string, scaleNotes: string[]): ScaleStatus => {
  if(!scaleNotes.includes(octaveNote)) return 'inactive';

  if(octaveNote === scaleNotes[0] || octaveNote === scaleNotes[scaleNotes.length - 1]){
    return 'root';
  }
  return 'scale';
}

export const selectKeyboardKeys = createSelector(
  [selectActiveScale],
  (activeScaleObj): CompleteNote[] => {
    const octaveNotes = getAllOctaveNotesBetween(PIANO_RANGE[0], PIANO_RANGE[1]);
    return octaveNotes.map((octaveNote, idx) => {
      const noteLabel = octaveNote.split('-')[0] as NoteName;
      return {
        note: noteLabel,
        octaveNote: octaveNote,
        midiNote: convertOctaveNoteToMidiId(octaveNote),
        scaleStatus: activeScaleObj ? getScaleStatus(octaveNote, activeScaleObj.octaveNotes) : 'inactive',
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
