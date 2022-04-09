import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  getActiveNote
} from './slice';
import { useAppSelector } from '../../app/hooks';
import { ScaleGroups } from './scalegroups';

export const ScContainer = styled.div`
  text-align:left;
  display:inline-block;
  padding: 0rem 2rem;

  ul{
    list-style:none;
  }


  >div{
    margin:1rem;
  }
`
export const ScInstructions = styled.div`
  color: ${getColor('grey_light')};
`

export const ScScales = styled.div`
  background-color: ${getColor('purple')};
  padding: 1rem 2rem;
  
  >h4{
    text-align:center;
  }
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
    </ScContainer>
  );
}
