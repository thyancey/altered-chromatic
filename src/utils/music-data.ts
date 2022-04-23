import { InstrumentDef, LilNoteObj, NoteName, ScaleDef, ScaleDefs } from '../types';

export const STANDARD_SCALES: ScaleDefs = {
  'ionian': {
    id: 'ionian',
    label: 'Ionian (Major)',
    intervals: [2,2,1,2,2,2,1]
  } as ScaleDef,
  'dorian': {
    id: 'dorian',
    label: 'Dorian',
    intervals: [2,1,2,2,2,1,2]
  } as ScaleDef,
  'phyrgian': {
    id: 'phyrgian',
    label: 'Phyrgian',
    intervals: [1,2,2,2,1,2,2]
  } as ScaleDef,
  'lydian': {
    id: 'lydian',
    label: 'Lydian',
    intervals: [2,2,2,1,2,2,1]
  } as ScaleDef,
  'mixolydian': {
    id: 'mixolydian',
    label: 'Mixolydian',
    intervals: [2,2,1,2,2,1,2]
  } as ScaleDef,
  'aeolian': {
    id: 'aeolian',
    label: 'Aeolian (Minor)',
    intervals: [2,1,2,2,1,2,2]
  } as ScaleDef,
  'locrian': {
    id: 'locrian',
    label: 'Locrian',
    intervals: [1,2,2,1,2,2,2]
  } as ScaleDef
};

type MusicConfig = {
  notes: NoteName[],
  scales: ScaleDefs,
  midiMap: LilNoteObj
}

type TypeMusicConfigs = {
  [key: string]: MusicConfig
}

const Config_StandardChromatic: MusicConfig = {
  notes: [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ],
  scales: STANDARD_SCALES,
  midiMap: {
    octaveNote: 'C-4',
    midiNote: 60
  }
}

const Config_AlteredChromatic: MusicConfig = {
  notes: [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ],
  scales: STANDARD_SCALES,
  midiMap: {
    octaveNote: 'A-4',
    midiNote: 60
  }
}

export const DEFAULT_CONFIG_TYPE = 'standardChromatic';
export const DEFAULT_INSTRUMENT_TYPE = 'standardPiano';
// export const DEFAULT_CONFIG_TYPE = 'alteredChromatic';
// export const DEFAULT_INSTRUMENT_TYPE = 'alteredPiano';

const MusicConfigs: TypeMusicConfigs = {
  'standardChromatic': Config_StandardChromatic,
  'alteredChromatic': Config_AlteredChromatic
}

const getMusicConfig = (subKey: string, configType: string = DEFAULT_CONFIG_TYPE) => {
  
  if(!MusicConfigs[configType]){
    console.error(`cannot get config for configType${configType}`);
  }
  // @ts-ignore
  if(!MusicConfigs[configType][subKey]){
    console.error(`cannot get config for subKey ${subKey} under ${configType}`);
  }

  // @ts-ignore
  return MusicConfigs[configType][subKey];
}

export const getMusicNotes = (configType?: string): NoteName[] => {
  return getMusicConfig('notes', configType);
}
export const getMusicScales = (configType?: string): ScaleDefs => {
  return getMusicConfig('scales', configType);
}
export const getMusicMidiMap = (configType?: string): LilNoteObj => {
  return getMusicConfig('midiMap', configType);
}

type InstrumentDefs = {
  [ instrumentKey: string ]: InstrumentDef
}

export const INSTRUMENT_DEFS: InstrumentDefs = {
  'alteredPiano': {
    range: ['A-4', 'D-5'],
    keyboardKeys: ['a','w','s','e','d','r','f','t','g','y','h','u','j','i','k','o','l','p',';','[','\'']
  } as InstrumentDef,
  'standardPiano': {
    range: ['C-4', 'E-5'],
    keyboardKeys: ['a','w','s','e','d','f','t','g','y','h','u','j','k','o','l','p',';']
  } as InstrumentDef
}