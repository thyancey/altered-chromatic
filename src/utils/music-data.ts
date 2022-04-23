import { LilNoteObj, NoteName, ScaleDef, ScaleDefs } from "../types";

export const NOTES: NoteName[] = [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ];

export const MIDI_NOTE_REF: LilNoteObj = {
  octaveNote: 'A-4',
  midiNote: 60
};

export const SCALES: ScaleDefs = {
  'ionian': {
    label: 'Ionian (Major)',
    intervals: [2,2,1,2,2,2,1]
  } as ScaleDef,
  'dorian': {
    label: 'Dorian',
    intervals: [2,1,2,2,2,1,2]
  } as ScaleDef,
  'phyrgian': {
    label: 'Phyrgian',
    intervals: [1,2,2,2,1,2,2]
  } as ScaleDef,
  'lydian': {
    label: 'Lydian',
    intervals: [2,2,2,1,2,2,1]
  } as ScaleDef,
  'mixolydian': {
    label: 'Mixolydian',
    intervals: [2,2,1,2,2,1,2]
  } as ScaleDef,
  'aeolian': {
    label: 'Aeolian (Minor)',
    intervals: [2,1,2,2,1,2,2]
  } as ScaleDef,
  'locrian': {
    label: 'Locrian',
    intervals: [1,2,2,1,2,2,2]
  } as ScaleDef
};