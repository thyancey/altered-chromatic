import styled from 'styled-components';
import { getColor } from '../../themes';
import { ScaleObj } from '../../types';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getRootNoteIdx, setActiveScale, setRootNoteIdx } from '../../app/music-slice';
import { STANDARD_SCALES } from '../../utils/music-data';
import { getAdjacentScales } from '../../app/selectors';

const ScLabel = styled.div`
  text-align: right;
  flex: 1;
  cursor: pointer;

  p{
    margin-top:-1rem;
    font-style:italic;
    color: ${getColor('black')};
    
    &:hover{
      text-decoration: underline;
      color: ${getColor('white')};
    }
  }

  span{
    font-size: 3.5rem;
  }

  h3{
    display:inline;
    &:hover{
      text-decoration: underline;
      color: ${getColor('white')};
    }
  }
`
type Props = {
  scaleObj: ScaleObj;
  instrumentNotes: string[];
}

export function ScaleLabel({scaleObj, instrumentNotes}:Props) {
  const dispatch = useAppDispatch();
  const rootNoteIdx = useAppSelector(getRootNoteIdx);

  const onScaleClick = useCallback(() => {
    const adjacents = getAdjacentScales(scaleObj.id, Object.keys(STANDARD_SCALES));
    if(adjacents){
      dispatch(setActiveScale(adjacents[1]));
    }
  }, [ scaleObj ]);

  const onRootNoteClick = useCallback(() => {
    if(rootNoteIdx >= instrumentNotes.length - 1){
      dispatch(setRootNoteIdx(0));
    }
    dispatch(setRootNoteIdx(rootNoteIdx + 1))
  }, [ rootNoteIdx ]);

  const onResetClick = useCallback(() => {
    dispatch(setRootNoteIdx(0));
    dispatch(setActiveScale(scaleObj.id));
  }, [ scaleObj ])

  return (
    <ScLabel>
      <h3 role="button" onClick={onRootNoteClick}>
        {scaleObj.notes[0]}
      </h3>
      <span>{' - '}</span>
      <h3 role="button" onClick={onScaleClick}>
        {scaleObj.label}
      </h3>
      <p role="button" onClick={onResetClick}>{'clear'}</p>
    </ScLabel>
  );
}
