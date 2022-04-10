import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  getActiveNote
} from './slice';
import { useAppSelector } from '../../app/hooks';
import { ScaleGroups } from './scalegroups';

const ScContainer = styled.div`
  text-align:left;
  display:inline-block;
  padding: 0rem 2rem;
  position: relative;

  ul{
    list-style:none;
  }


  >div{
    margin:1rem;
  }
`

const ScScales = styled.div`
  background-color: ${getColor('pink')};
  padding: 1rem 2rem;
  
  >h4{
    text-align:center;
  }
`

const ScScalesBg = styled.div`
  background-color: ${getColor('white')};
  border-radius: 2.5rem 2.5rem 0 0;
  position:absolute;
  z-index:-1;
  left:0;
  right:0;
  top:-2rem;
  bottom:0rem;
  filter: blur(1rem);
  opacity:.7;
`

export function Scales() {
  const activeNote = useAppSelector(getActiveNote);
  if(!activeNote) return null;

  return (
    <ScContainer>
      <ScScales>
        <p>{`key: ${activeNote.split('-')[0]}`}</p>
        <p>{`root note: ${activeNote}`}</p>
      </ScScales>
      <ScScales>
        <h4>{'scales'}</h4>
        <p>{'click a scale name to toggle it on/off'}</p>
        <ScaleGroups />
      </ScScales>
      <ScScalesBg />
    </ScContainer>
  );
}
