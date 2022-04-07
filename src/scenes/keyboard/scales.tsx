import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  getActiveNote
} from './slice';
import { useAppSelector } from '../../app/hooks';
import { ScaleGroups } from './scalegroups';

export const ScContainer = styled.div`
  background-color: ${getColor('purple')};
  text-align:left;
  display:inline-block;
  padding: 0rem 2rem;

  ul{
    list-style:none;
  }

  >h4{
    margin-left:-1rem;
  }
`

export function Scales() {
  const activeNote = useAppSelector(getActiveNote);
  if(!activeNote) return null;

  return (
    <ScContainer>
      <h4>{'root note'}</h4>
      <p>{activeNote}</p>
      <h4>{'western scales'}</h4>
      <ScaleGroups />
    </ScContainer>
  );
}
