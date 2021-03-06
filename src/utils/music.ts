import { LilNoteObj, NoteName, OctaveNote, ScaleDef, ScaleObj } from "../types";

export const rotateArray = (array: any[], toIdx: number) => {
  return array.map((_, idx) => array[(idx + toIdx) % array.length]);
}

export const getArrayValueAtRelativeIndex = (array: any[], idx: number) => array[idx % array.length];

export const getNotesInScale = (rootNote: string, scaleDef: ScaleDef, allNotes: NoteName[], wrapRootNote = false) => {
  const noteIdx = allNotes.findIndex(n => n === rootNote);

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
    const note = getArrayValueAtRelativeIndex(allNotes, curIdx);
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
export const transformNotesToOctaveNotes = (noteNames: NoteName[], allNotes: NoteName[], minOctave = 0, maxOctave = 9) => {
  let octaveNotes = [];
  let lastNoteIdx = allNotes.findIndex(n => n === noteNames[0]); // 0 for A
  let curOctave = minOctave; 

  while(curOctave <= maxOctave){
    for(let i = 0; i < noteNames.length; i++){
      const thisNoteIdx = allNotes.findIndex(nn => nn === noteNames[i]);
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
export const transformScaleNotesToOctaveNotes = (scaleNoteNames: NoteName[], allNotes: NoteName[], startOctave: number) => {
  let lastNoteIdx = allNotes.findIndex(n => n === scaleNoteNames[0]); // 0 for A
  let curOctave = startOctave; 

  return scaleNoteNames.map(snn => {
    const thisNoteIdx = allNotes.findIndex(nn => nn === snn);
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
export const getOctaveNotesInScale = (rootOctaveNote: OctaveNote, scaleDef: ScaleDef, allNotes: NoteName[], wrapRootNote = false) => {
  const notePieces = rootOctaveNote.split('-');
  const scaleNotes = getNotesInScale(notePieces[0], scaleDef, allNotes, wrapRootNote);

  return transformScaleNotesToOctaveNotes(scaleNotes, allNotes, parseInt(notePieces[1]));
}

export const getOctaveScaleObject = (rootOctaveNote: OctaveNote, scaleDef: ScaleDef, allNotes: NoteName[]): ScaleObj => {
  return {
    id: scaleDef.id,
    label: scaleDef.label,
    notes: getOctaveNotesInScale(rootOctaveNote, scaleDef, allNotes, true)
  }
}

export const getKeyScaleObject = (musicKey: string, scaleDef: ScaleDef, allNotes: NoteName[]): ScaleObj => {
  return {
    id: scaleDef.id,
    label: scaleDef.label,
    notes: getNotesInScale(musicKey, scaleDef, allNotes, true)
  }
}


/**
  "what are all the chromatic notes between A and B?" - ex, making piano keys

  example ('F-2', 'B#-3') => ['F-2','F#-2','A-3','A#-3','B-3','B#-3']
*/
export const getAllOctaveNotesBetween = (startOctaveNote: OctaveNote, endOctaveNote: OctaveNote, allNotes: NoteName[]) => {
  const startPieces = startOctaveNote.split('-');
  const endPieces = endOctaveNote.split('-');

  const startNote = startPieces[0] as NoteName;
  const startNoteIdx = allNotes.indexOf(startNote);
  const rotatedNotes = rotateArray(allNotes, startNoteIdx);

  const octaveNotes = transformNotesToOctaveNotes(rotatedNotes, allNotes, parseInt(startPieces[1]), parseInt(endPieces[1]));
  const indexOfEnd = octaveNotes.indexOf(endOctaveNote);
  return octaveNotes.slice(0, indexOfEnd + 1);
}

// A-4, B-4, delta is -2 (A-4 < A#-4 < B-4)
export const getOctaveNoteDelta = (firstOctaveNote: OctaveNote, secondOctaveNote: OctaveNote, allNotes: NoteName[]) => {
  const firstPieces = firstOctaveNote.split('-');
  const secondPieces = secondOctaveNote.split('-');

  const firstIdx = allNotes.indexOf(firstPieces[0] as NoteName);
  const firstOctave = parseInt(firstPieces[1]);
  const secondIdx = allNotes.indexOf(secondPieces[0] as NoteName);
  const secondOctave = parseInt(secondPieces[1]);

  const octaveChange = (secondOctave - firstOctave) * allNotes.length;
  const idxChange = secondIdx - firstIdx;
  const noteChange = octaveChange + idxChange;

  return noteChange;
}

/**
 * convert "C-4" to 60
 * 
 * in altered chromatic, A-4 = 60
 */
export const convertOctaveNoteToMidiId = (octaveNote: OctaveNote, midiRef: LilNoteObj, allNotes: NoteName[]) => {
  const delta = getOctaveNoteDelta(midiRef.octaveNote, octaveNote, allNotes);
  return midiRef.midiNote + delta;
}

/**
 * Might not be helpful for other stuff, but translated from standardChromatic to alteredChromatic, and vice versa
 * 
 * ex "C" -> "A" or "B" -> "F#"
 */
export const translateNoteBetweenConfigs = (noteName: NoteName, allOldNotes: NoteName[], allNewNotes: NoteName[]) => {
  const foundIdx = allOldNotes.indexOf(noteName);
  if(foundIdx > -1 && allNewNotes[foundIdx]){
    return allNewNotes[foundIdx];
  }

  console.error(`Error translating between noteDefs for "${noteName}"`);
  return noteName;
}