import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface KeyboardState {
  activeNote: string | null;
}

const initialState: KeyboardState = {
  activeNote: null
};

type NoteType = 'normal' | 'accidental';
type NoteName = 'A' | 'A#' | 'B' | 'B#' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'E#' | 'F' | 'F#';
const NOTES: NoteName[] = [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ];
const SPECIAL_ACCIDENTALS: NoteName[] = [ 'A#', 'C#', 'D#' ];

const START_NOTE = 'A';
const NUM_KEYS = 29;
const START_OCTAVE = 4;

type KeyObj = {
  note: NoteName,
  octaveNote: string,
  keyStyle: boolean,
  type: NoteType,
  idx: number
}


export const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActiveNote: (state, action: PayloadAction<string>) => {
      state.activeNote = action.payload;
    }
  }
});

export const { setActiveNote } = keyboardSlice.actions;

export const getActiveNote = (state: RootState) => state.keyboard.activeNote;
export const getNotes = (state: RootState) => NOTES;


// generate A-1, A#-1, B-1, B#-1...
export const selectAllOctiveNotes = createSelector(
  [getNotes],
  (notes): string[] => {
    const keys = Array.from(Array(NUM_KEYS));
    return keys.map((k, idx) => {
      const octave = Math.floor(idx / notes.length) + START_OCTAVE;
      const noteLabel = notes[(idx) % notes.length];
      return `${noteLabel}-${octave}`;
    });
  }
);

export const selectKeyboardKeys = createSelector(
  [selectAllOctiveNotes],
  (allOctaveNotes): KeyObj[] => {
    const keys = Array.from(Array(NUM_KEYS));
    return keys.map((k, idx) => {
      const octaveNote = allOctaveNotes[(idx) % allOctaveNotes.length];
      const noteLabel = octaveNote.split('-')[0] as NoteName;
      return {
        note: noteLabel,
        octaveNote: octaveNote,
        keyStyle: SPECIAL_ACCIDENTALS.includes(noteLabel),
        type: noteLabel.includes('#') ? 'accidental' : 'normal',
        idx
      };
    })
  }
);

export default keyboardSlice.reducer;
