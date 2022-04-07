import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface KeyboardState {
  activeNote: string | null;
  activeScale: string | null;
}

const initialState: KeyboardState = {
  activeNote: null,
  activeScale: null,
};

type NoteType = 'normal' | 'accidental';
type NoteName = 'A' | 'A#' | 'B' | 'B#' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'E#' | 'F' | 'F#';
const NOTES: NoteName[] = [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ];
const SPECIAL_ACCIDENTALS: NoteName[] = [ 'A#', 'C#', 'D#' ];
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

const NUM_KEYS = 29;
const START_OCTAVE_NOTE = 'A-4';
const NUM_OCTAVES = 9;

export type ScaleStatus = 'root' | 'scale' | 'inactive';
export type KeyObj = {
  note: NoteName,
  octaveNote: string,
  keyStyle: boolean,
  scaleStatus: ScaleStatus,
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
    },
    setActiveScale: (state, action: PayloadAction<string>) => {
      if(state.activeScale === action.payload){
        state.activeScale = null;
      }else{
        state.activeScale = action.payload;
      }
    }
  }
});

export const { setActiveNote, setActiveScale } = keyboardSlice.actions;

export const getActiveNote = (state: RootState) => state.keyboard.activeNote;
export const getActiveScale = (state: RootState) => state.keyboard.activeScale;
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



export const selectActiveScale = createSelector(
  [getActiveScale, getActiveNote, selectAllOctiveNotes],
  (activeScale, activeNote, octaveNotes): ScaleObj | null => {
    if(!activeNote || !activeScale) return null;
    let curIdx = octaveNotes.findIndex(oN => oN === activeNote);
    // @ts-ignore
    const scaleDef = SCALES[activeScale] as ScaleDef;

    return {
      id: activeScale,
      label: scaleDef.label,
      octaveNotes: scaleDef.intervals.map(interval => {
        curIdx += interval;
        return octaveNotes[curIdx];
      })
    };
  }
);

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
);

export const getScaleStatus = (octaveNote: string, scaleNotes: string[]): ScaleStatus => {
  if(!scaleNotes.includes(octaveNote)) return 'inactive';

  if(octaveNote === scaleNotes[0] || octaveNote === scaleNotes[scaleNotes.length - 1]){
    return 'root';
  }
  return 'scale';
}

export const selectKeyboardKeys = createSelector(
  [selectAllOctiveNotes, selectActiveScale],
  (allOctaveNotes, activeScaleObj): KeyObj[] => {
    const keys = Array.from(Array(NUM_KEYS));
    const startIdx = allOctaveNotes.findIndex(oN => oN === START_OCTAVE_NOTE);
    return keys.map((k, idx) => {
      const octaveNote = allOctaveNotes[idx + startIdx];
      const noteLabel = octaveNote.split('-')[0] as NoteName;
      return {
        note: noteLabel,
        octaveNote: octaveNote,
        keyStyle: SPECIAL_ACCIDENTALS.includes(noteLabel),
        scaleStatus: activeScaleObj ? getScaleStatus(octaveNote, activeScaleObj.octaveNotes) : 'inactive',
        type: noteLabel.includes('#') ? 'accidental' : 'normal',
        idx
      };
    })
  }
);

export default keyboardSlice.reducer;
