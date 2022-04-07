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

const NUM_KEYS = 29;
const START_OCTAVE = 4;
const START_OCTAVE_NOTE = 'A-4';
const NUM_OCTAVES = 9;

export type KeyObj = {
  note: NoteName,
  octaveNote: string,
  keyStyle: boolean,
  type: NoteType,
  idx: number
}

export type ScaleDef = {
  label: string,
  intervals: number[]
}

export type ScaleObj = {
  id: string,
  label: string,
  octaveNotes: string[]
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
    const keys = Array.from(Array(NUM_OCTAVES * NOTES.length));
    return keys.map((k, idx) => {
      const octave = Math.floor(idx / notes.length);
      const noteLabel = notes[(idx) % notes.length];
      return `${noteLabel}-${octave}`;
    });
  }
);

export const selectKeyboardKeys = createSelector(
  [selectAllOctiveNotes],
  (allOctaveNotes): KeyObj[] => {
    const keys = Array.from(Array(NUM_KEYS));
    const startIdx = allOctaveNotes.findIndex(oN => oN === START_OCTAVE_NOTE);
    return keys.map((k, idx) => {
      const octaveNote = allOctaveNotes[idx + startIdx];
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


const SCALES = {
  'ionian': {
    label: 'Ionian (Major)',
    intervals: [0,2,2,1,2,2,2,1]
  } as ScaleDef,
  'dorian': {
    label: 'Dorian',
    intervals: [0,2,1,2,2,2,1,2]
  } as ScaleDef,
  'phyrgian': {
    label: 'Phyrgian',
    intervals: [0,1,2,2,2,1,2,2]
  } as ScaleDef,
  'lydian': {
    label: 'Lydian',
    intervals: [0,2,2,2,1,2,2,1]
  } as ScaleDef,
  'mixolydian': {
    label: 'Mixolydian',
    intervals: [0,2,2,1,2,2,1,2]
  } as ScaleDef,
  'aeolian': {
    label: 'Aeolian (Minor)',
    intervals: [0,2,1,2,2,1,2,2]
  } as ScaleDef,
  'locrian': {
    label: 'Locrian',
    intervals: [0,1,2,2,1,2,2,2]
  } as ScaleDef
};

export const selectAllMajorScales = createSelector(
  [getActiveNote, selectAllOctiveNotes],
  (activeNote, octaveNotes): ScaleObj[] | null => {
    if(!activeNote) return null;

    return Object.keys(SCALES).map(scaleKey => {
      let curIdx = octaveNotes.findIndex(oN => oN === activeNote);
      // @ts-ignore
      const scaleDef = SCALES[scaleKey] as ScaleDef;

      return {
        id: scaleKey,
        label: scaleDef.label,
        octaveNotes: scaleDef.intervals.map(interval => {
          curIdx += interval;
          return octaveNotes[curIdx];
        })
      };
    });
  }
)

export default keyboardSlice.reducer;
