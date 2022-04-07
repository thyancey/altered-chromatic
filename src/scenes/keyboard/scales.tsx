import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  getActiveNote,
  setActiveNote,
  selectAllOctiveNotes,
} from './slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export const ScContainer = styled.div`
  width:50%;
  height:10rem;
  background-color: ${getColor('purple')};
  display:inline-block;
`

export function Scales() {
  const activeNote = useAppSelector(getActiveNote);
  const allNotes = useAppSelector(selectAllOctiveNotes);
  
  return (
    <ScContainer>
      <h2>{activeNote}</h2>
    </ScContainer>
  );
}
