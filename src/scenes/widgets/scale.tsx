import styled, { css } from 'styled-components';
import { ColorType, getColor, mixinFontFamily } from '../../themes';
import Icon_ChevronDown from '../../assets/chevron-down.svg';

import {
  getActiveKey, getActiveScale, selectActiveScaleDef, selectAdjacentKeys, selectAdjacentScales, selectAllNotes, selectNotesFromScale, setActiveKey, setActiveScale
} from '../keyboard/slice';
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
  const activeKey = useAppSelector(getActiveKey);
  const activeScaleDef = useAppSelector(selectActiveScaleDef);
  const adjacentScales = useAppSelector(selectAdjacentScales);
  const adjacentKeys = useAppSelector(selectAdjacentKeys);
  const allKeys = useAppSelector(selectNotesFromScale);
  
  const scaleLabel = useMemo(() => {
    return activeScaleDef ? `${activeScaleDef.label}` : ''
  }, [ activeScaleDef ])

  const onKeyButton = useCallback((value:string) => {
    dispatch(setActiveKey(value));
  }, [ dispatch ]);

  const onScaleButton = useCallback((value:string) => {
    dispatch(setActiveScale(value));
  }, [ dispatch ]);
  if(!activeKey || !adjacentScales || !adjacentKeys || !allKeys) return null;

  return (
    <ScContainer>
      <ScBody>
        <div>
          <ScKey>
            <button onClick={e => onKeyButton(adjacentKeys[0])}><ScIcon iconId={'chevronDown'}/></button>
            <span>{activeKey}</span>
            <button onClick={e => onKeyButton(adjacentKeys[1])}><ScIcon iconId={'chevronDown'}/></button>
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
            className={keyLabel === activeKey ? 'active' : ''}
          >
            {keyLabel}
          </ScNote>
        )) }
      </ScNotes>
    </ScContainer>
  );
  /*
  return (
    <ScContainer>
    <h4>{'( scales )'}</h4>
      <ScScales>
        {allScales.map((scaleObj, idx) => (
          <ScScaleGroup key={scaleObj.id} isActive={scaleObj.id === activeScale}>
            <ScScaleLabel
              onClick={e => onClick(e, scaleObj.id)}
            >
              {`${activeKey} ${scaleObj.label}:`}
            </ScScaleLabel>
            <ul>
              {scaleObj.notes.map((note, sIdx) => (
                <ScScaleNote 
                  key={`${idx}_${sIdx}_${note}`} 
                  id={note}
                  onClick={e => onClickNote(e, note)}
                >
                  <span>{note.split('-')[0]}</span>
                </ScScaleNote>
              ))}
            </ul>
          </ScScaleGroup>
        ))}
      </ScScales>
      <ScScalesBg />
    </ScContainer>
  );
  */
}
