import styled, { css } from 'styled-components';
import { getColor } from '../../themes';

import {
  selectKeyboardKeys,
  setActiveNote,
} from './slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { MusicBox } from '../../components/musicbox';
import { 
  CompleteNote,
  ScaleStatus 
} from '../../utils/music';


export const ScContainer = styled.div`
  display:block;
  text-align:center;
`

const ScInstrument = styled.div`
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

type ScKeyboardKeyProps = {
  scaleStatus: ScaleStatus
}

export const ScKeyboardBaseKey = styled.div<ScKeyboardKeyProps>`
  ${p => p.scaleStatus === 'root' && css`
    border: .5rem solid ${getColor('red')};
  `}

  ${p => p.scaleStatus === 'scale' && css`
    border: .5rem dashed ${getColor('red')};
  `}
`

export const ScKeyboardKey = styled(ScKeyboardBaseKey)`
  position:relative;
  display:inline-block;
  width:4rem;
  height:13rem;
  margin-left: .25rem;
  margin-right: .25rem;
  background-color: ${getColor('white')};
  cursor: pointer;

  &:hover{
    background-color: ${getColor('green')};
  }
  
  span{
    position:absolute;
    bottom:.5rem;
    left:50%;
    transform: translateX(-50%);
  }
`

type ScAccidentalKeyboardKeyProps = {
  keyStyle: boolean
}

export const ScAccidentalKeyboardKey = styled(ScKeyboardBaseKey)<ScAccidentalKeyboardKeyProps>`
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
    font-size:1rem;
    position:absolute;
    bottom:.5rem;
    left:50%;
    transform: translateX(-50%);
  }
`

export function Instrument() {
  const keyboardKeys = useAppSelector(selectKeyboardKeys);
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
      <MusicBox midiInstrument={'piano'} volume={1} />
      <ScInstrument>
        {keyboardKeys.map(noteObj => {
          if(noteObj.type === 'accidental'){
            return (
              <ScAccidentalKeyboardKey 
                key={noteObj.idx}
                onClick={e => onClick(e, noteObj)}
                keyStyle={noteObj.keyStyle}
                scaleStatus={noteObj.scaleStatus}
              >
                <span>{noteObj.note}</span>
              </ScAccidentalKeyboardKey>
            );
          }else{
            return (
              <ScKeyboardKey
                key={noteObj.idx}
                scaleStatus={noteObj.scaleStatus}
                onClick={e => onClick(e, noteObj)}
              >
                <span>{noteObj.note}</span>
              </ScKeyboardKey>
            );
          }
        })}
      </ScInstrument>
    </ScContainer>
  );
}
