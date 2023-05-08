import styled, { css } from 'styled-components';
import { ColorType, getColor, mixinFontFamily } from '../../themes';
import Icon_ChevronDown from '../../assets/chevron-down.svg';

import {
  selectActiveScaleDef, selectAdjacentRootNoteIdxs, selectAdjacentScales, selectAllNotes, selectNotesFromScale, selectRootNote
} from '../keyboard/slice';
import { setActiveScale, setRootNoteIdx } from '../../app/music-slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCallback, useMemo } from 'react';


const getIcon = (id: string) => {
  switch(id){
    case 'chevronDown': return Icon_ChevronDown;
  }
}
type IconProps = {
  iconId: string,
  color?: ColorType
}
const ScIcon = styled.div<IconProps>`
  display:inline-block;
  width:8rem;
  height:8rem;

  background-color: ${p => getColor(p.color || 'black')};
  -webkit-mask: url(${p => getIcon(p.iconId)}) no-repeat center;
  mask: url(${p => getIcon(p.iconId)}) no-repeat center;
  mask-size: 100%;
`

const ScContainer = styled.div`
  text-align:left;
  padding: 1rem 2rem;
  position: relative;

  h4{
    padding:0;
    margin:0;
    margin-top:-1rem;
  }
`

const ScBody = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  >*{
    margin: 0 2rem;
    height: 15rem;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  span {
    ${mixinFontFamily('display')};
    font-size: 7rem;
    color: ${getColor('black')};
  }
  button{
    background: 0;
    border: 0;
    cursor: pointer;

    &:hover{
      ${ScIcon}{
        background-color: ${getColor('white')};
      }
    }
  }
`

const ScKey = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 15% 70% 15%;
  height:100%;

  *{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button{
    &:first-child{
      ${ScIcon}{
        transform: rotate(180deg);
      }
    }
  }
`

const ScScale = styled.div`
  >*{
    display:inline-block;
    vertical-align: middle;
  }
  
  button{
    &:first-child{
      ${ScIcon}{
        transform: rotate(90deg);
      }
    }
    &:last-child{
      ${ScIcon}{
        transform: rotate(270deg);
      }
    }
  }
`


const ScNotes = styled.div`
  width:100%;
  text-align:center;
  margin-top:1rem;
  font-size:5rem;
  color: ${getColor('black')};
`

const ScNote = styled.div`
  display:inline-block;
  margin: 1rem;
  &.active{
    color: ${getColor('white')};
  }
`

export function ScaleWidget() {
  const dispatch = useAppDispatch();
  const rootNote = useAppSelector(selectRootNote);
  const activeScaleDef = useAppSelector(selectActiveScaleDef);
  const adjacentScales = useAppSelector(selectAdjacentScales);
  const adjacentRootNoteIdxs = useAppSelector(selectAdjacentRootNoteIdxs);
  const allKeys = useAppSelector(selectNotesFromScale);
  
  const scaleLabel = useMemo(() => {
    return activeScaleDef ? `${activeScaleDef.label}` : ''
  }, [ activeScaleDef ])

  const onKeyButton = useCallback((value:number) => {
    dispatch(setRootNoteIdx(value));
  }, [ dispatch ]);

  const onScaleButton = useCallback((value:string) => {
    dispatch(setActiveScale(value));
  }, [ dispatch ]);
  if(!rootNote || !adjacentScales || !adjacentRootNoteIdxs || !allKeys) return null;

  return (
    <ScContainer>
      <ScBody>
        <div>
          <ScKey>
            <button onClick={e => onKeyButton(adjacentRootNoteIdxs[0])}><ScIcon iconId={'chevronDown'}/></button>
            <span>{rootNote?.label}</span>
            <button onClick={e => onKeyButton(adjacentRootNoteIdxs[1])}><ScIcon iconId={'chevronDown'}/></button>
          </ScKey>
        </div>
        <div>
          <ScScale>
            <button onClick={e => onScaleButton(adjacentScales[0].id)}><ScIcon iconId={'chevronDown'}/></button>
            <span>{scaleLabel}</span>
            <button onClick={e => onScaleButton(adjacentScales[1].id)}><ScIcon iconId={'chevronDown'}/></button>
          </ScScale>
        </div>

      </ScBody>
      <ScNotes>
        { allKeys.notes.map((keyLabel, idx) => (
          <ScNote
            key={idx}
            className={idx === rootNote.idx ? 'active' : ''}
          >
            {keyLabel}
          </ScNote>
        )) }
      </ScNotes>
    </ScContainer>
  );
}
