import { NoteName, OctaveNote, ScaleDef, ScaleObj } from "../types";
import { MIDI_NOTE_REF, NOTES } from "./music-data";

export const rotateArray = (array: any[], toIdx: number) => {
  return array.map((_, idx) => array[(idx + toIdx) % array.length]);
}

export const getArrayValueAtRelativeIndex = (array: any[], idx: number) => array[idx % array.length];

export const getNotesInScale = (rootNote: string, scaleDef: ScaleDef, wrapRootNote = false) => {
  const noteIdx = NOTES.findIndex(n => n === rootNote);

  if(noteIdx === -1) {
    console.error(`invalid note provided "${rootNote}"`)
    return [];
  };
  if(!scaleDef){
    console.error(`invalid scaleDef provided`)
    return [];
  };

  let curIdx = noteIdx;
  const scaleNotes = scaleDef.intervals.map((interval, idx) => {
    const note = getArrayValueAtRelativeIndex(NOTES, curIdx);
    curIdx += interval;
    return note
  });

  return !wrapRootNote ? scaleNotes : [...scaleNotes, scaleNotes[0]];
}

/**
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

/**
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

/**
  the good good, provide any note, scale, get the octaveNotes back to play

  example: ('A-1', 'ionian', true) => ['A-1','B-1','C-1','C#-1','D#-1','E#-1','F#-1','A-2']
*/
export const getOctaveNotesInScale = (rootOctaveNote: OctaveNote, scaleDef: ScaleDef, wrapRootNote = false) => {
  const notePieces = rootOctaveNote.split('-');
  const scaleNotes = getNotesInScale(notePieces[0], scaleDef, wrapRootNote);

  return transformScaleNotesToOctaveNotes(scaleNotes, parseInt(notePieces[1]));
}

export const getOctaveScaleObject = (rootOctaveNote: OctaveNote, scaleDef: ScaleDef): ScaleObj => {
  return {
    id: scaleDef.id,
    label: scaleDef.label,
    notes: getOctaveNotesInScale(rootOctaveNote, scaleDef, true)
  }
}

export const getKeyScaleObject = (musicKey: string, scaleDef: ScaleDef): ScaleObj => {
  return {
    id: scaleDef.id,
    label: scaleDef.label,
    notes: getNotesInScale(musicKey, scaleDef, true)
  }
}


/**
  "what are all the chromatic notes between A and B?" - ex, making piano keys

  example ('F-2', 'B#-3') => ['F-2','F#-2','A-3','A#-3','B-3','B#-3']
*/
export const getAllOctaveNotesBetween = (startOctaveNote: OctaveNote, endOctaveNote: OctaveNote) => {
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
export const getOctaveNoteDelta = (firstOctaveNote: OctaveNote, secondOctaveNote: OctaveNote) => {
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

/**
 * convert "C-4" to 60
 * 
 * in altered chromatic, A-4 = 60
 */
export const convertOctaveNoteToMidiId = (octaveNote: OctaveNote) => {
  const delta = getOctaveNoteDelta(MIDI_NOTE_REF.octaveNote, octaveNote);
  return MIDI_NOTE_REF.midiNote + delta;
}