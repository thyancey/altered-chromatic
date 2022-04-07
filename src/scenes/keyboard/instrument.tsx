import styled, { css } from 'styled-components';
import { getColor } from '../../themes';

import {
  KeyObj,
  selectKeyboardKeys,
  setActiveNote,
} from './slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';


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
`

export const ScKeyboardKey = styled.div`
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

export const ScAccidentalKeyboardKey = styled.div<ScAccidentalKeyboardKeyProps>`
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
    background-color: ${getColor('purple')};
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
  const keys = useAppSelector(selectKeyboardKeys);
  const dispatch = useAppDispatch();

  const onClick = (e:any, keyObj:KeyObj) => {
    if(e.ctrlKey){
      dispatch(setActiveNote(keyObj.octaveNote))
    }

    console.log(`play ${keyObj.octaveNote}`);
  }

  return (
    <ScContainer>
      <ScInstrument>
        {keys.map((keyObj, idx) => {
          if(keyObj.type === 'accidental'){
            return (
              <ScAccidentalKeyboardKey 
                  key={keyObj.idx}
                  onClick={e => onClick(e, keyObj)}
                  keyStyle={keyObj.keyStyle}
              >
                  <span>{keyObj.note}</span>
              </ScAccidentalKeyboardKey>
            );
          }else{
            return (
              <ScKeyboardKey
                key={keyObj.idx}
                onClick={e => onClick(e, keyObj)}
              >
                <span>{keyObj.note}</span>
              </ScKeyboardKey>
            );
          }
        })}
      </ScInstrument>
    </ScContainer>
  );
}
