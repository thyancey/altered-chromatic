import styled from 'styled-components';
import { ColorType, getColor, mixinFontFamily } from '../../themes';
import Icon_ChevronDown from '../../assets/chevron-down.svg';

import {
  selectAllAdjacentRootNoteIdxs, selectAdjacentScales, selectScaleObjects
} from '../../app/selectors';
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

type Props = {
  instrumentIdx: number;
}

export function ScaleWidget({instrumentIdx}:Props) {
  const dispatch = useAppDispatch();
  const adjacentScales = useAppSelector(selectAdjacentScales);
  const allAdjacentRootNoteIdxs = useAppSelector(selectAllAdjacentRootNoteIdxs);
  const scaleObjs = useAppSelector(selectScaleObjects);

  const onKeyButton = useCallback((value:number) => {
    dispatch(setRootNoteIdx(value));
  }, [ dispatch ]);

  const onScaleButton = useCallback((value:string) => {
    dispatch(setActiveScale(value));
  }, [ dispatch ]);

  const scaleObj = useMemo(() => {
    return scaleObjs ? scaleObjs[instrumentIdx] : null;
  }, [ scaleObjs, instrumentIdx ]);

  const adjacentRootNoteIdxs = useMemo(() => {
    return allAdjacentRootNoteIdxs ? allAdjacentRootNoteIdxs[instrumentIdx] : null;
  }, [ allAdjacentRootNoteIdxs, instrumentIdx ]);

  if(!adjacentScales || !adjacentRootNoteIdxs || !scaleObj) return null;

  return (
    <ScContainer>
      <ScBody>
        <div>
          <ScKey>
            <button onClick={e => onKeyButton(adjacentRootNoteIdxs[0])}><ScIcon iconId={'chevronDown'}/></button>
            <span>{scaleObj.notes[0]}</span>
            <button onClick={e => onKeyButton(adjacentRootNoteIdxs[1])}><ScIcon iconId={'chevronDown'}/></button>
          </ScKey>
        </div>
        <div>
          <ScScale>
            <button onClick={e => onScaleButton(adjacentScales[0])}><ScIcon iconId={'chevronDown'}/></button>
            <span>{scaleObj.label}</span>
            <button onClick={e => onScaleButton(adjacentScales[1])}><ScIcon iconId={'chevronDown'}/></button>
          </ScScale>
        </div>

      </ScBody>
      <ScNotes>
        { scaleObj.notes.map((keyLabel, idx) => (
          <ScNote
            key={idx}
            className={keyLabel === scaleObj.notes[0] ? 'active' : ''}
          >
            {keyLabel}
          </ScNote>
        )) }
      </ScNotes>
    </ScContainer>
  );
}
