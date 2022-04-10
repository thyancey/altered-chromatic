export type NoteName = 'A' | 'A#' | 'B' | 'B#' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'E#' | 'F' | 'F#';
// export type ScaleKey = 'ionian' | 'dorian' | 'phyrgian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';

export type ScaleStatus = 'root' | 'scale' | 'inactive';
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

export type ScaleObj = {
  id: string,
  label: string,
  octaveNotes: string[]
}

export const NOTES: NoteName[] = [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ];
export const MIDI_NOTE_REF = {
  octaveNote: 'A-4',
  code: 60
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

export const rotateArray = (array: any[], toIdx: number) => {
  return array.map((_, idx) => array[(idx + toIdx) % array.length]);
}

export const getArrayValueAtRelativeIndex = (array: any[], idx: number) => array[idx % array.length];

export const getNotesInScale = (rootNote: string, scaleKey: string, wrapRootNote = false) => {
  const noteIdx = NOTES.findIndex(n => n === rootNote);
  const scale = SCALES[scaleKey];
  if(noteIdx === -1) {
    console.error(`invalid note provided "${rootNote}"`)
    return [];
  };
  if(!scale){
    console.error(`invalid scale provided "${scaleKey}"`)
    return [];
  };

  let curIdx = noteIdx;
  const scaleNotes = scale.intervals.map((interval, idx) => {
    const note = getArrayValueAtRelativeIndex(NOTES, curIdx);
    curIdx += interval;
    return note
  });

  return !wrapRootNote ? scaleNotes : [...scaleNotes, scaleNotes[0]];
}

/*
  convert an explicit sequence of asecending notes into octave notes, constrained by octave
  notes received could be (& will usually be) fewer than provided, depending on how the octaves are clamped

  example: ([ 'F', 'A' ], 1, 2) => [ 'F-1', 'A-2', 'F-2' ]
*/
export const transformNotesToOctaveNotes = (noteNames: NoteName[], minOctave = 0, maxOctave = 9) => {
  let octaveNotes = [];
  let lastNoteIdx = NOTES.findIndex(n => n === noteNames[0]); // 0 for A
  let curOctave = minOctave; 

  while(curOctave <= maxOctave){
    for(let i = 0; i < noteNames.length; i++){
      const thisNoteIdx = NOTES.findIndex(nn => nn === noteNames[i]);
      if(thisNoteIdx < lastNoteIdx){
        curOctave++;
        if(curOctave > maxOctave) break;
      }
      lastNoteIdx = thisNoteIdx;
      octaveNotes.push(`${noteNames[i]}-${curOctave}`);
    }
  }

  return octaveNotes;
}

/*
  convert an explicit sequence of asecending notes into octave notes, starting from an octave
  notes received should be the same length

  example: ([ 'F', 'A' ], 2) => [ 'F-2', 'A-3' ]
*/
export const transformScaleNotesToOctaveNotes = (scaleNoteNames: NoteName[], startOctave: number) => {
  let lastNoteIdx = NOTES.findIndex(n => n === scaleNoteNames[0]); // 0 for A
  let curOctave = startOctave; 

  return scaleNoteNames.map(snn => {
    const thisNoteIdx = NOTES.findIndex(nn => nn === snn);
    if(thisNoteIdx < lastNoteIdx){
      curOctave++;
    }
    lastNoteIdx = thisNoteIdx;

    return `${snn}-${curOctave}`;
  });
}

/*
  the good good, provide any note, scale, get the octaveNotes back to play

  example: ('A-1', 'ionian', true) => ['A-1','B-1','C-1','C#-1','D#-1','E#-1','F#-1','A-2']
*/
export const getOctaveNotesInScale = (rootOctaveNote: string, scaleKey: string, wrapRootNote = false) => {
  const notePieces = rootOctaveNote.split('-');
  const scaleNotes = getNotesInScale(notePieces[0], scaleKey, wrapRootNote);

  return transformScaleNotesToOctaveNotes(scaleNotes, parseInt(notePieces[1]));
}

export const getScaleObject = (rootOctaveNote: string, scaleKey: string): ScaleObj => {
  const scaleDef = SCALES[scaleKey];

  return {
    id: scaleKey,
    label: scaleDef.label,
    octaveNotes: getOctaveNotesInScale(rootOctaveNote, scaleKey, true)
  }
}

/*
  "what are all the chromatic notes between A and B?" - ex, making piano keys

  example ('F-2', 'B#-3') => ['F-2','F#-2','A-3','A#-3','B-3','B#-3']
*/
export const getAllOctaveNotesBetween = (startOctaveNote: string, endOctaveNote: string) => {
  const startPieces = startOctaveNote.split('-');
  const endPieces = endOctaveNote.split('-');

  const startNote = startPieces[0] as NoteName;
  const startNoteIdx = NOTES.indexOf(startNote);
  const allNotes = rotateArray(NOTES, startNoteIdx);

  const octaveNotes = transformNotesToOctaveNotes(allNotes, parseInt(startPieces[1]), parseInt(endPieces[1]));
  const indexOfEnd = octaveNotes.indexOf(endOctaveNote);
  return octaveNotes.slice(0, indexOfEnd + 1);
}

// A-4, B-4, delta is -2 (A-4 < A#-4 < B-4)
export const getOctaveNoteDelta = (firstOctaveNote: string, secondOctaveNote: string) => {
  const firstPieces = firstOctaveNote.split('-');
  const secondPieces = secondOctaveNote.split('-');

  const firstIdx = NOTES.indexOf(firstPieces[0] as NoteName);
  const firstOctave = parseInt(firstPieces[1]);
  const secondIdx = NOTES.indexOf(secondPieces[0] as NoteName);
  const secondOctave = parseInt(secondPieces[1]);

  const octaveChange = (secondOctave - firstOctave) * NOTES.length;
  const idxChange = secondIdx - firstIdx;
  const noteChange = octaveChange + idxChange;

  return noteChange;
}

// traditionally, C4 == 60 ... in this wacky world A4 == 60
export const convertOctaveNoteToMidiId = (octaveNote:string) => {
  const delta = getOctaveNoteDelta(MIDI_NOTE_REF.octaveNote, octaveNote);
  return MIDI_NOTE_REF.code + delta;
}