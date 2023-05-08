import { LilNoteObj, NoteName, OctaveNote, RootNoteObj, ScaleDef, ScaleObj } from "../types";

export const rotateArray = (array: any[], toIdx: number) => {
  return array.map((_, idx) => array[(idx + toIdx) % array.length]);
}

export const getArrayValueAtRelativeIndex = (array: any[], idx: number) => array[idx % array.length];

/* label could be a note label "A#" or an OcataveNote "A#-5" */
export const getRootNoteIdxFromLabel = (rootNoteLabel: string, allNotes: NoteName[]) => {
  const label = rootNoteLabel.split('-')[0];
  const noteIdx = allNotes.findIndex(n => n === label);

  if(noteIdx === -1) {
    console.error(`getRootNoteIdxFromLabel, invalid rootNoteLabel provided "${rootNoteLabel}"`)
  };
  return noteIdx;
}

export const getRootNoteInScale = (rootNoteIdx: number, scaleDef: ScaleDef, allNotes: NoteName[], wrapRootNote = false) => {
  if(rootNoteIdx === -1) {
    console.error(`invalid note provided "${rootNoteIdx}"`)
    return [];
  };
  if(!scaleDef){
    console.error(`invalid scaleDef provided`)
    return [];
  };

  return allNotes[rootNoteIdx];
}

export const getNotesInScale = (rootNoteIdx: number, scaleDef: ScaleDef, allNotes: NoteName[], wrapRootNote = false) => {
  if(rootNoteIdx === -1) {
    console.error(`invalid note provided "${rootNoteIdx}"`)
    return [];
  };
  if(!scaleDef){
    console.error(`invalid scaleDef provided`)
    return [];
  };

  let curIdx = rootNoteIdx;
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
export const getOctaveNotesInScale = (rootNote: RootNoteObj, scaleDef: ScaleDef, allNotes: NoteName[], wrapRootNote = false) => {
  const scaleNotes = getNotesInScale(rootNote.idx, scaleDef, allNotes, wrapRootNote);
  return transformScaleNotesToOctaveNotes(scaleNotes, allNotes, rootNote.octave);
}


export const getOctaveScaleObject = (rootNote: RootNoteObj, scaleDef: ScaleDef, allNotes: NoteName[]): ScaleObj => {
  return {
    id: scaleDef.id,
    label: scaleDef.label,
    notes: getOctaveNotesInScale(rootNote, scaleDef, allNotes, true)
  }
}

export const getKeyScaleObject = (rootNoteIdx: number, scaleDef: ScaleDef, allNotes: NoteName[]): ScaleObj => {
  return {
    id: scaleDef.id,
    label: scaleDef.label,
    notes: getNotesInScale(rootNoteIdx, scaleDef, allNotes, true)
  }
}

export const getKeyScaleObjects = (rootNoteIdx: number, scaleDefs: ScaleDef[], allNotes: NoteName[]): ScaleObj[] => {
  return scaleDefs.map(scaleDef => ({
    id: scaleDef.id,
    label: scaleDef.label,
    notes: getNotesInScale(rootNoteIdx, scaleDef, allNotes, true)
  }));
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
export const convertOctaveNoteToMidiId = (octaveNote: OctaveNote, midiRef: LilNoteObj, allNotes: NoteName[], adjusterIdx: number) => {
  const delta = getOctaveNoteDelta(midiRef.octaveNote, octaveNote, allNotes) + adjusterIdx;
  return midiRef.midiNote + delta;
}
