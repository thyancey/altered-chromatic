export type NoteName = 'A' | 'A#' | 'B' | 'B#' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'E#' | 'F' | 'F#';
// export type ScaleKey = 'ionian' | 'dorian' | 'phyrgian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';
export type ScaleStatus = 'root' | 'scale' | 'invalid'| 'inactive';

export type ScaleObj = {
  id: string,
  label: string,
  notes: string[]
}


export type CompleteNote = {
  note: NoteName,
  octaveNote: string,
  scaleStatus: ScaleStatus,
  idx: number,
  midiNote: number,
  keyPressed?: boolean,
  keyMatch?: string
}

export type ScaleDefs = {
  [key: string]: ScaleDef
}

export type ScaleDef = {
  label: string,
  intervals: number[]
}