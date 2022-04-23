import { LilNoteObj, NoteName, ScaleDef, ScaleDefs } from "../types";

export const NOTES: NoteName[] = [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ];

export const MIDI_NOTE_REF: LilNoteObj = {
  octaveNote: 'A-4',
  midiNote: 60
};

export const STANDARD_SCALES: ScaleDefs = {
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

type MusicConfig = {
  notes: NoteName[],
  scales: ScaleDefs,
  midiMap: LilNoteObj
}

type MusicConfigs = {
  [key: string]: MusicConfig
}

const Config_AlteredChromatic: MusicConfig = {
  notes: [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ],
  scales: STANDARD_SCALES,
  midiMap: {
    octaveNote: 'A-4',
    midiNote: 60
  }
}

const MusicConfigs: MusicConfigs = {
  'alteredChromatic': Config_AlteredChromatic
}


const defaultConfigType = 'alteredChromatic';
const getMusicConfig = (subKey: string, configType: string = defaultConfigType) => {
  
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