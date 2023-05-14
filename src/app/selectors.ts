import { createSelector } from '@reduxjs/toolkit';
import { CompleteNote, InstrumentDef, NoteName, ScaleDef, ScaleDefs, ScaleObj, ScaleStatus } from '../types';
import { getAllOctaveNotesBetween, convertOctaveNoteToMidiId, getKeyScaleObject, getNotesInScale } from '../utils/music';
import { getAllMusicScales, getMusicConfig, MUSIC_CONFIGS, STANDARD_SCALES } from '../utils/music-data';
import { getInstruments, getPressedKeys, selectInstrumentDefs } from './ui-slice';
import { getActiveScale, getRootNoteIdx } from './music-slice';


export const selectAllAdjacentRootNoteIdxs = createSelector(
  [getRootNoteIdx, selectInstrumentDefs],
  (rootNoteIdx, instrumentDefs): [ number, number ][] | null => {
    if(rootNoteIdx === -1) return null;

    return instrumentDefs.map((instrumentDef, instrumentIdx) => {
      const allNotes = MUSIC_CONFIGS[instrumentDef.type].notes;
      return [ 
        rootNoteIdx === 0 ? allNotes.length - 1 : rootNoteIdx - 1, // prev, wrap to end
        rootNoteIdx === allNotes.length - 1 ? 0 : rootNoteIdx + 1 // next, wrap to beginning
      ];
    });
  }
);

export const getAdjacentScales = (curScaleName: string, scaleNames: string[]): [ string, string ] | null => {
  const idx = scaleNames.findIndex(scaleName => scaleName === curScaleName);
  if(idx === -1) return null;

  const prevIdx = idx === 0 ? scaleNames.length - 1 : idx - 1;
  const nextIdx = idx === scaleNames.length - 1 ? 0 : idx + 1;
  return [ scaleNames[prevIdx], scaleNames[nextIdx] ];
}

export const selectAdjacentScales = createSelector(
  [getActiveScale],
  (activeScale): [ string, string ] | null => {
    if(!activeScale) return null;
    const scaleNames = Object.keys(STANDARD_SCALES);
    return getAdjacentScales(activeScale, scaleNames);
  }
)

export const getScaleStatus = (noteLabel: string, scaleNotes: string[]): ScaleStatus => {
  if(!scaleNotes.includes(noteLabel)) return 'invalid';

  if(noteLabel === scaleNotes[0] || noteLabel === scaleNotes[scaleNotes.length - 1]){
    return 'root';
  }
  return 'scale';
}


type InstrumentKeysObj = {
  instrumentDef: InstrumentDef;
  completeNotes: CompleteNote[];
}

/* TODO: scale defs should really match between instruments, maybe this is not necessary */
export const selectAllScaleDefs = createSelector(
  [getInstruments],
  (instrumentObjs): ScaleDefs[] => {
    return getAllMusicScales(instrumentObjs.map(iO => iO.activeConfig));
  }
);

export const selectActiveScaleDefs = createSelector(
  [selectAllScaleDefs, getActiveScale],
  (scaleDefs, activeScale): ScaleDef[] => {
    if(!activeScale) return [];
    return scaleDefs.map(scaleDef => scaleDef[activeScale]);
  }
);

export const selectNotesFromScale = createSelector(
  [getRootNoteIdx, selectAllScaleDefs, getInstruments, getActiveScale],
  (rootNoteIdx, allScaleDefs, instrumentConfigs, activeScale): ScaleObj[] | null => {
    if(rootNoteIdx === -1 || !activeScale) return null;
    return allScaleDefs.map((scaleDefEntry, idx) => {
      const scaleDef = scaleDefEntry[activeScale];
      const allNotes = getMusicConfig('notes', instrumentConfigs[idx].activeConfig);
      
      return {
        id: scaleDef.id,
        label: scaleDef.label,
        notes: getNotesInScale(rootNoteIdx, scaleDef, allNotes, true)
      }
    });
  }
);

export const selectInstrumentKeys = createSelector(
  [selectNotesFromScale, selectInstrumentDefs],
  (keyScaleObj, instrumentDefs): InstrumentKeysObj[] => {
    return instrumentDefs.map((instrumentDef, instrumentIdx) => {
      const allNotes = getMusicConfig('notes', instrumentDef.type)
      const octaveNotes = getAllOctaveNotesBetween(instrumentDef.range[0], instrumentDef.range[1], allNotes);
      const mc = getMusicConfig('midiMap', instrumentDef.type);

      return {
        instrumentDef: instrumentDef,
        completeNotes: octaveNotes.map((octaveNote, idx) => {
          const noteLabel = octaveNote.split('-')[0] as NoteName;
          return {
            note: noteLabel,
            octaveNote: octaveNote,
            midiNote: convertOctaveNoteToMidiId(octaveNote, mc, allNotes),
            scaleStatus: keyScaleObj ? getScaleStatus(noteLabel, keyScaleObj[instrumentIdx].notes) : 'inactive',
            idx
          };
        })
      }
    })
  }
);

export const selectActiveInstrumentKeys = createSelector(
  [selectInstrumentKeys, getPressedKeys],
  (instrumentKeys, pressedKeys): CompleteNote[][] => {
    return instrumentKeys.map(instrumentKeyObj => 
      instrumentKeyObj.completeNotes.map(kk => (
        {
          ...kk,
          keyMatch: instrumentKeyObj.instrumentDef.keyboardKeys[kk.idx],
          keyPressed: pressedKeys.includes(instrumentKeyObj.instrumentDef.keyboardKeys[kk.idx])
        }
      ))
    )
  }
);

export const selectScaleObjects = createSelector(
  [getRootNoteIdx, selectActiveScaleDefs, getInstruments],
  (rootNoteIdx, activeScaleDefs, instrumentConfigs): ScaleObj[] | null => {
    if(rootNoteIdx === -1) return null;
    return activeScaleDefs?.map((asd, idx) => {
      const allNotes = getMusicConfig('notes', instrumentConfigs[idx].activeConfig);
      return getKeyScaleObject(rootNoteIdx, asd, allNotes)
    });
  }
);
