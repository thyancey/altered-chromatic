import { useEffect } from 'react';
// @ts-ignore
import MIDISounds from 'midi-sounds-react';

import midiDataJSON from './mididata.json';

type midiInstrumentData = {
  defaultInstrument: string,
  instruments: {
    [instrumentId: string]: {
      midiId: number,
      title: string
    }
  }
}
const MIDI_INSTRUMENT_DATA = midiDataJSON as midiInstrumentData;

const findInstrument = (instrumentId?: string) => {
  if(!instrumentId){
    instrumentId = MIDI_INSTRUMENT_DATA.defaultInstrument;
  }
  return { ...MIDI_INSTRUMENT_DATA.instruments[instrumentId], id: instrumentId }
}

let midiSounds: any;
const playMidiNotes = (notes: number[], midiId: number) => {
  midiSounds.playChordNow(midiId, notes, 2.5);
}

type Props = {
  midiInstrument?: string,
  volume: number
}
export function MusicBox({ midiInstrument, volume }: Props) {
  useEffect(() => {
    const foundInstrument = findInstrument(midiInstrument);
    midiSounds.cacheInstrument(foundInstrument.midiId);
    midiSounds.setMasterVolume(volume);

    (global as any).globalMidiHandler = (notes: number[]) => playMidiNotes(notes, foundInstrument.midiId);
  }, [midiInstrument, volume])

  return (
    <div style={{'display':'none'}}>
      <MIDISounds ref={(ref: any) => (midiSounds = ref)} appElementName="root"  />
    </div>
  );
}
