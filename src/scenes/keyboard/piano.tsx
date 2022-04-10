import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  selectKeyboardKeysWithPressed,
  setActiveNote,
  setPressedKeys,
} from './slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { MusicBox } from '../../components/musicbox';
import { 
  CompleteNote,
  NoteName
} from '../../utils/music';
import { KeyManager } from './key-manager';
import { PianoKey, AltPianoKey } from './piano-key';

export const SPECIAL_ACCIDENTALS: NoteName[] = [ 'A#', 'C#', 'D#' ];
export const ScContainer = styled.div`
  display:block;
  text-align:center;
`
const ScPianoBar = styled.div`
  position:absolute;
  z-index:3;
  left:4rem;
  right:4rem;
  height:3rem;
  top:3rem;

  background-color: ${getColor('black')};
  border-radius: 1rem;  
  box-shadow: .25rem .25rem .25rem .175rem ${getColor('black')};
`

const ScPiano = styled.div`
  position: relative;
  padding: 5rem 1rem;
  width: max-content;
  margin: auto;
  width:max-content;

  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
`

const ScPianoBg = styled.div`
  background-color: ${getColor('white')};
  z-index:-1;

  position:absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  opacity: .7;

  border-radius: 2.5rem;
  
  filter: blur(1rem);
`

const ScPianoKeys = styled.div`
  position:relative;
  width:100%;
  padding:0 4rem;

  >div{
    display:inline-block;
    vertical-align:top;
  }
`

export function Piano() {
  const pianoKeys = useAppSelector(selectKeyboardKeysWithPressed);
  const dispatch = useAppDispatch();

  const onClick = (e:any, noteObj:CompleteNote) => {
    if(e.ctrlKey){
      dispatch(setActiveNote(noteObj.octaveNote))
    }

    // @ts-ignore;
    global.globalMidiHandler && global.globalMidiHandler([noteObj.midiNote]);
  }

  return (
    <ScContainer>
      <KeyManager 
        onKeyPressed={(key:string) => {
          const foundPianoKey = pianoKeys.find(pK => pK.keyMatch === key);
          if(foundPianoKey !== undefined){
            // @ts-ignore;
            global.globalMidiHandler && global.globalMidiHandler([foundPianoKey.midiNote]);
          }
        }}
        onKeysChanged={(keys: string[]) => {
          dispatch(setPressedKeys(keys));
        }}
      />
      <MusicBox midiInstrument={'starfield'} volume={0.2} />
      <ScPiano>
        <ScPianoBar />
        <ScPianoKeys>
          {pianoKeys.map(noteObj => {
            if(noteObj.note.includes('#')){
              return (
                <AltPianoKey noteObj={noteObj} onClick={onClick} />
              );
            }else{
              return (
                <PianoKey noteObj={noteObj} onClick={onClick} />
              );
            }
          })}
        </ScPianoKeys>
        <ScPianoBg />
      </ScPiano>
    </ScContainer>
  );
}