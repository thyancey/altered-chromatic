import styled, { css } from 'styled-components';
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
  ScaleStatus 
} from '../../utils/music';
import { KeyManager } from './key-manager';

export const ScContainer = styled.div`
  display:block;
  text-align:center;
`

const ScPiano = styled.div`
  padding: 1rem;
  background-color: ${getColor('blue')};
  border: 1rem solid ${getColor('white')};
  border-radius: 1rem;
  width: max-content;
  margin: auto;

  user-select: none; /* supported by Chrome and Opera */
   -webkit-user-select: none; /* Safari */
   -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
`

type ScPianoKeyProps = {
  scaleStatus: ScaleStatus,
  keyPressed?: boolean
}

export const ScPianoBaseKey = styled.div<ScPianoKeyProps>`
  ${p => p.scaleStatus === 'root' && css`
    border: .5rem solid ${getColor('red')};
  `}

  ${p => p.scaleStatus === 'scale' && css`
    border: .5rem dashed ${getColor('red')};
  `}

${p => p.keyPressed && css`
  background-color: ${getColor('grey')} !important;
`}
`

export const ScPianoKey = styled(ScPianoBaseKey)`
  position:relative;
  display:inline-block;
  width:4rem;
  height:13rem;
  margin-left: .25rem;
  margin-right: .25rem;
  margin-bottom: 2rem;
  background-color: ${getColor('white')};
  cursor: pointer;

  &:hover{
    background-color: ${getColor('green')};
  }
  
  span{
    /* margin-bottom: -2rem; */
  }
`

type ScAccidentalPianoKeyProps = {
  keyStyle: boolean
}

export const ScAccidentalPianoKey = styled(ScPianoBaseKey)<ScAccidentalPianoKeyProps>`
  position:absolute;
  display:inline-block;
  z-index:1;
  width:3rem;
  height:7rem;  
  margin-left:-1.5rem;
  
  ${p => p.keyStyle ? css`
    background-color: ${getColor('black')};
  ` : css`
    background-color: ${getColor('grey_light')};
  `}
  
  color: ${getColor('white')};
  cursor: pointer;
  box-shadow: .25rem .25rem .5rem .1rem ${getColor('blue')};

  &:hover{
    background-color: ${getColor('green')};
    box-shadow: .5rem .5rem .5rem .1rem ${getColor('blue')};
  }

  span{
    bottom:2rem;
    font-size: 1.5rem;
  }
`

export const ScKeyboardLabel = styled.span`
  position:absolute;
  bottom:.5rem;
  left:50%;
  transform: translateX(-50%);

  margin-bottom:-3rem;
  border: .25rem solid ${getColor('grey')};
  color: ${getColor('black')};
  width:2rem;
  padding: 0;
  border-radius: .25rem;
  background-color: ${getColor('grey_light')};
  font-size: 1.5rem !important;
`;

export const ScNoteLabel = styled.span`
  position:absolute;
  bottom:.5rem;
  left:50%;
  transform: translateX(-50%);
`;

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
      <MusicBox midiInstrument={'piano'} volume={1} />
      <ScPiano>
        {pianoKeys.map(noteObj => {
          if(noteObj.type === 'accidental'){
            return (
              <ScAccidentalPianoKey 
                key={noteObj.idx}
                onClick={e => onClick(e, noteObj)}
                keyStyle={noteObj.keyStyle}
                scaleStatus={noteObj.scaleStatus}
                keyPressed={noteObj.keyPressed}
              >
                <ScNoteLabel>{noteObj.note}</ScNoteLabel>
                <ScKeyboardLabel>{noteObj.keyMatch}</ScKeyboardLabel>
              </ScAccidentalPianoKey>
            );
          }else{
            return (
              <ScPianoKey
                key={noteObj.idx}
                scaleStatus={noteObj.scaleStatus}
                keyPressed={noteObj.keyPressed}
                onClick={e => onClick(e, noteObj)}
              >
                <ScNoteLabel>{noteObj.note}</ScNoteLabel>
                <ScKeyboardLabel>{noteObj.keyMatch}</ScKeyboardLabel>
              </ScPianoKey>
            );
          }
        })}
      </ScPiano>
    </ScContainer>
  );
}