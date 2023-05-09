/** The chromatic notation you want to use.
 * 
 * For your run of the mill 12 note chromatic scale, that'd be [ C, C#, D, D#, E, F, F#, G, G#, A, A#, B ]
 * 
 * For the altered chromatic notation, it's [ A, A#, B, B#, C, C#, D, D#, E, E#, F, F# ]
 * */
export type NoteName = string;

/** A note + octave range.
 * ex, "A#-3"
 * 
 * If it aint got the ${Note}-${Octave} format, it's gonna break stuff.
 * */
export type OctaveNote = string;

/** Type for a pattern of intervals.
 * 
 * Some examples: [ 'ionian', 'dorian', 'phyrgian', 'lydian', 'mixolydian', 'aeolian', 'locrian' ];
 * */
export type ScaleId = string;

/** Addressable numeric midi id from 0-127
 * 
 * 0: C-3
 * 
 * 60: C-4 (middle C)
 * 
 * 127: G-9
 * */
 export type MidiNote = number;

/** The status of a particular note, in the context of a key/scale/notation.
 * 
 * root: root note of the scale
 * 
 * scale: valid note within the current key/scale
 * 
 * invalid: note outside of the current key/scale
 * 
 * inactive: not applicable here?
 * */
export type ScaleStatus = 'root' | 'scale' | 'invalid'| 'inactive';

export type ScaleObj = {
  id: ScaleId,
  label: string,
  notes: string[]
}

export type InstrumentObj = {
  activeConfig: string,
  instrumentType: string
}

export type RootNoteObj = {
  idx: number,
  label: string,
  octave: number
}

export type CompleteNote = {
  note: NoteName,
  octaveNote: OctaveNote,
  scaleStatus: ScaleStatus,
  idx: number,
  midiNote: MidiNote,
  keyPressed?: boolean,
  keyMatch?: string
}

export type ScaleDefs = {
  [key: string]: ScaleDef
}

export type ScaleDef = {
  id: string,
  label: string,
  intervals: number[]
}

export type LilNoteObj = {
  octaveNote: OctaveNote,
  midiNote: MidiNote
}

/**
 * Handles how an instrument should display and perform
 */
export type InstrumentDef = {
  key: string,
  type: string,
  range: OctaveNote[],
  keyboardKeys: string[]
}