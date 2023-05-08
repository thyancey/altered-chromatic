import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CompleteNote, RootNoteObj, InstrumentDef, LilNoteObj, NoteName, ScaleDef, ScaleDefs, ScaleObj, ScaleStatus } from '../../types';
import { getOctaveScaleObject, getAllOctaveNotesBetween, convertOctaveNoteToMidiId, getKeyScaleObject, getNotesInScale } from '../../utils/music';
import { DEFAULT_CONFIG_TYPE, DEFAULT_INSTRUMENT_TYPE, getAllMusicScales, getMusicConfig, getMusicMidiMap, getMusicNotes, getMusicScales, INSTRUMENT_DEFS, MUSIC_CONFIGS } from '../../utils/music-data';
import { getInstruments, getPressedKeys, selectInstrumentDefs } from '../../app/ui-slice';
import { getActiveScale, getRootNoteIdx, getRootNoteOctave } from '../../app/music-slice';

export interface KeyboardState {
  activeConfig: string;
  instrumentType: string;
}

const initialState: KeyboardState = {
  activeConfig: DEFAULT_CONFIG_TYPE,
  instrumentType: DEFAULT_INSTRUMENT_TYPE,
};

export const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setActiveConfig: (state, action: PayloadAction<string>) => {
      if(state.activeConfig !== action.payload){
        state.activeConfig = action.payload;
        if(action.payload === 'alteredChromatic'){
          state.instrumentType = 'alteredPiano';
        }
        if(action.payload === 'standardChromatic'){
          state.instrumentType = 'standardPiano';
        }
      }
    },
  }
});

export const { setActiveConfig } = keyboardSlice.actions;

export const getActiveConfig = (state: RootState) => state.keyboard.activeConfig;
export const getInstrumentType = (state: RootState) => state.keyboard.instrumentType;

export const selectInstrumentDef = createSelector(
  [getInstrumentType],
  (instrumentType): InstrumentDef => {
    return {
      ...INSTRUMENT_DEFS[instrumentType],
      key: instrumentType
    }
  }
);

export const selectMidiRefDef = createSelector(
  [getActiveConfig],
  (activeConfig): LilNoteObj => {
    return getMusicMidiMap(activeConfig);
  }
);

export const selectAllNotes = createSelector(
  [getActiveConfig],
  (activeConfig): NoteName[] => {
    return getMusicNotes(activeConfig);
  }
);

export const selectScaleDefs = createSelector(
  [getActiveConfig],
  (activeConfig): ScaleDefs => {
    return getMusicScales(activeConfig);
  }
);

export const selectActiveScaleDef = createSelector(
  [selectScaleDefs, getActiveScale],
  (scaleDefs, activeScale): ScaleDef | null => {
    return activeScale ? scaleDefs[activeScale] : null;
  }
);

export const selectAdjacentRootNoteIdxs = createSelector(
  [selectAllNotes, getRootNoteIdx],
  (allKeys, rootNoteIdx): [ number, number ] | null => {
    if(rootNoteIdx === -1) return null;

    return [ 
      rootNoteIdx === 0 ? allKeys.length - 1 : rootNoteIdx - 1, // prev, wrap to end
      rootNoteIdx === allKeys.length - 1 ? 0 : rootNoteIdx + 1 // next, wrap to beginning
    ];
  }
)

export const selectRootNote = createSelector(
  [getRootNoteIdx, getRootNoteOctave, selectAllNotes],
  (rootNoteIdx, rootNoteOctave, allNotes): RootNoteObj | null => {
    if(rootNoteIdx === -1 || !allNotes) return null;
    return {
      idx: rootNoteIdx,
      label: allNotes[rootNoteIdx],
      octave: rootNoteOctave
    }
  }
);

export const selectActiveScaleObject = createSelector(
  [selectRootNote, selectActiveScaleDef, selectAllNotes],
  (rootNote, activeScaleDef, allNotes): ScaleObj | null => {
    if(!rootNote || !activeScaleDef) return null;

    return getOctaveScaleObject(rootNote, activeScaleDef, allNotes);
  }
);

export const selectAllMajorScales = createSelector(
  [getRootNoteIdx, selectScaleDefs, selectAllNotes],
  (rootNoteIdx, scaleDefs, allNotes): ScaleObj[] => {
    if(rootNoteIdx === -1 || !scaleDefs || !allNotes) return [];

    return Object.keys(scaleDefs).map(scaleKey => {
      return getKeyScaleObject(rootNoteIdx, scaleDefs[scaleKey], allNotes)
    });
  }
);

export const selectAdjacentScales = createSelector(
  [selectAllMajorScales, getActiveScale],
  (allScales, activeScale): [ ScaleObj, ScaleObj ] | null => {
    if(!activeScale) return null;

    const idx = allScales.findIndex(scaleObj => scaleObj.id === activeScale);
    if(idx === -1) return null;

    const prevIdx = idx === 0 ? allScales.length - 1 : idx - 1;
    const nextIdx = idx === allScales.length - 1 ? 0 : idx + 1;
    return [ allScales[prevIdx], allScales[nextIdx] ];
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

export const selectAllInstrumentNotes = createSelector(
  [getActiveConfig],
  (activeConfig): NoteName[] => {
    return getMusicNotes(activeConfig);
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
  [selectNotesFromScale, selectMidiRefDef, selectInstrumentDefs],
  (keyScaleObj, midiRefDef, instrumentDefs): InstrumentKeysObj[] => {
    return instrumentDefs.map((instrumentDef, instrumentIdx) => {
      const allNotes = getMusicConfig('notes', instrumentDef.type)
      const octaveNotes = getAllOctaveNotesBetween(instrumentDef.range[0], instrumentDef.range[1], allNotes);

      return {
        instrumentDef: instrumentDef,
        completeNotes: octaveNotes.map((octaveNote, idx) => {
          const noteLabel = octaveNote.split('-')[0] as NoteName;
          return {
            note: noteLabel,
            octaveNote: octaveNote,
            midiNote: convertOctaveNoteToMidiId(octaveNote, midiRefDef, allNotes, instrumentDef.standardOffset),
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


export default keyboardSlice.reducer;