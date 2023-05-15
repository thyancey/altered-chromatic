import styled from 'styled-components';
import { Piano } from './piano';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveInstrumentIdx, selectInstrumentDefs, setActiveInstrumentIdx } from '../../app/ui-slice';
import { useCallback, useMemo } from 'react';
import { selectScaleObjects } from '../../app/selectors';
import { ScaleLabel } from '../widgets/scale-label';
import { MUSIC_CONFIGS } from '../../utils/music-data';
import { getColor } from '../../themes';
import Toggle from '../../components/toggle';
import { setActiveScale, setRootNoteIdx } from '../../app/music-slice';

const ScContainer = styled.div`
  border: .5rem dashed ${getColor('grey')};
  border-left:0;
  border-right:0;
  padding: 1rem 2rem 3rem 2rem;
  margin-top:-.5rem;
`

const ScHeader = styled.div`
  text-align:left;
  padding-left:2rem;
  padding-right:2rem;

  display: flex;
  flex-direction: row; 
`

const ScInstrumentLabel = styled.div`
  text-align: left;

  p{
    margin-left:1rem;
    margin-top:-1rem;
    font-style:italic;
  }
`

const ScResetButton = styled.div`
  text-align:right;
  flex:1;
  font-size: 2rem;
  cursor: pointer;

  margin-top:1rem;
  font-style:italic;
  color: ${getColor('black')};
  
  &:hover{
    text-decoration: underline;
    color: ${getColor('white')};
  }
`

const getLabel = (musicType: string) => {
  switch(musicType){
    case 'standardChromatic': return 'standard';
    case 'alteredChromatic': return 'altered chromatic';
    default: return musicType;
  }
}

const ScBody = styled.div`
  display:flex;
  position:relative;
  >:first-child{
    flex: 0 0 16rem;
  }
  >:last-child{
    flex: 1;
  }
`

const ScToggleGroup = styled.div`
  bottom:0;
  position:absolute;
  padding: 1rem;
`

type Props = {
  instrumentIdx: number
}
export function Instrument({instrumentIdx}: Props) {
  const dispatch = useAppDispatch();
  const instrumentDefs = useAppSelector(selectInstrumentDefs);
  const instrumentDef = useMemo(() => {
    return instrumentDefs ? instrumentDefs[instrumentIdx] : null;
  }, [ instrumentDefs, instrumentIdx ])

  const activeInstrumentIdx = useAppSelector(getActiveInstrumentIdx);

  const scaleObjs = useAppSelector(selectScaleObjects);
  const scaleObj = useMemo(() => {
    return scaleObjs ? scaleObjs[instrumentIdx] : null;
  }, [ scaleObjs, instrumentIdx ]);

  if(!instrumentDef){
    console.error(`piano could not get instrument for idx ${instrumentIdx}`);
    return null;
  }
  const instrumentNotes = MUSIC_CONFIGS[instrumentDef.type].notes;

  let toggledOn = activeInstrumentIdx === instrumentIdx;

  const onActiveToggle = useCallback((togglingOn: boolean) => {
    dispatch(setActiveInstrumentIdx(togglingOn ? instrumentIdx : -1));
  }, [ instrumentIdx ])

  const onResetClick = useCallback(() => {
    dispatch(setRootNoteIdx(0));
    dispatch(setActiveScale('ionian'));
  }, [])

  return (
    <ScContainer>
      <ScHeader>
        <ScInstrumentLabel>
          <h3>{'Keyboard'}</h3>
          <p>{getLabel(instrumentDef.type)}</p>
        </ScInstrumentLabel>
        {scaleObj ? (
          <ScaleLabel scaleObj={scaleObj} instrumentNotes={instrumentNotes}/>
        ) : (
          <ScResetButton role="button" onClick={onResetClick}>{'show key & scales'}</ScResetButton>
        )}
      </ScHeader>
      <ScBody>
        <div>
          <ScToggleGroup>
            <p>{'play w/keyboard'}</p>
            <Toggle 
              labels={{'off': 'OFF', 'on': 'ON'}}
              size='sm'
              grow='stretch'
              value={toggledOn}
              onSetToggle={onActiveToggle} 
            />
          </ScToggleGroup>
        </div>
        <Piano instrumentIdx={instrumentIdx} instrumentDef={instrumentDef} isActiveInstrument={instrumentIdx === activeInstrumentIdx}/>
      </ScBody>
    </ScContainer>
  );
}
