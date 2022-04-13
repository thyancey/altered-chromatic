import styled, { css } from 'styled-components';
import { getColor } from '../../themes';

import {
  getActiveKey,
  getActiveNote,
  getActiveScale,
  selectAllMajorScales,
  selectAllMajorScales2,
  setActiveScale
} from './slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export const ScContainer = styled.div`
  /* background-color: ${getColor('pink')}; */
  display:inline-block;
  margin-top:.5rem;

  ul{
    list-style:none;
  }
`

export const ScScaleNote = styled.li`
  display:inline-block;
  list-style:none;
  margin:.5rem;
  margin-top: -.25rem;
`

type ScScaleGroupProps = {
  isActive: boolean
}
export const ScScaleGroup = styled.div<ScScaleGroupProps>`
  text-align:left;
  padding: .5rem 1rem;
  margin-top: -.5rem;
  
  ${p => p.isActive && css`
    background-color: ${getColor('blue')};
    border-radius: 1rem;
    border-left:0;
    border-right:0;
  `}
`

export const ScScaleLabel = styled.p`
  font-weight: bold;
  cursor:pointer;
  &:hover{
    color:${getColor('white')};
  }

`

export function ScaleGroups() {
  const allScales = useAppSelector(selectAllMajorScales2);
  const activeScale = useAppSelector(getActiveScale);
  const activeKey = useAppSelector(getActiveKey);
  const dispatch = useAppDispatch();
  if(!allScales) return null;

  const onClick = (e:any, clickedId:string) => {
    dispatch(setActiveScale(clickedId));
  }

  return (
    <ScContainer>
      {allScales.map((scaleObj, idx) => (
        <ScScaleGroup key={scaleObj.id} isActive={scaleObj.id === activeScale}>
          <ScScaleLabel
            onClick={e => onClick(e, scaleObj.id)}
          >
            {`${activeKey} ${scaleObj.label}:`}
          </ScScaleLabel>
          <ul>
            {scaleObj.notes.map(octaveNote => (
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
