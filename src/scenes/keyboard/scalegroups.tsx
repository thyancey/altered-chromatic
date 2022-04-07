import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  getActiveNote,
  selectAllMajorScales
} from './slice';
import { useAppSelector } from '../../app/hooks';

export const ScContainer = styled.div`
  background-color: ${getColor('purple')};
  display:inline-block;

  ul{
    list-style:none;
  }
`

export const ScScaleNote = styled.li`
  display:inline-block;
  list-style:none;
  margin:.5rem;
`

export const ScScaleGroup = styled.div`
  text-align:left;

  p{
    font-weight: bold;
  }
`

export function ScaleGroups() {
  const allScales = useAppSelector(selectAllMajorScales);
  const activeNote = useAppSelector(getActiveNote);
  if(!allScales) return null;

  return (
    <ScContainer>
      {allScales.map((scaleObj, idx) => (
        <ScScaleGroup key={scaleObj.id}>
          <p>{`${activeNote?.split('-')[0]} ${scaleObj.label}:`}</p>
          <ul>
            {scaleObj.octaveNotes.map(octaveNote => (
              <ScScaleNote key={octaveNote}>
                <span>{octaveNote.split('-')[0]}</span>
              </ScScaleNote>
            ))}
          </ul>
        </ScScaleGroup>
      ))}
    </ScContainer>
  );
}
