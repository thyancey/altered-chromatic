import styled, { css } from 'styled-components';
import { getColor } from '../../themes';

import {
  getActiveNote,
  getActiveScale,
  selectAllMajorScales,
  setActiveScale
} from './slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export const ScContainer = styled.div`
  background-color: ${getColor('pink')};
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
`
type ScScaleLabelProps = {
  isActive: boolean
}
export const ScScaleLabel = styled.p<ScScaleLabelProps>`
  font-weight: bold;
  cursor:pointer;
  &:hover{
    color:white;
  }

  ${p => p.isActive && css`
    color: ${getColor('green')}
  `}
`

export function ScaleGroups() {
  const allScales = useAppSelector(selectAllMajorScales);
  const activeScale = useAppSelector(getActiveScale);
  const activeNote = useAppSelector(getActiveNote);
  const dispatch = useAppDispatch();
  if(!allScales) return null;

  const onClick = (e:any, clickedId:string) => {
    dispatch(setActiveScale(clickedId));
  }

  return (
    <ScContainer>
      {allScales.map((scaleObj, idx) => (
        <ScScaleGroup key={scaleObj.id}>
          <ScScaleLabel
            isActive={scaleObj.id === activeScale}
            onClick={e => onClick(e, scaleObj.id)}
          >
            {`${activeNote?.split('-')[0]} ${scaleObj.label}:`}
          </ScScaleLabel>
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
