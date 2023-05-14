import styled from 'styled-components';
import { Piano } from './piano';
import { useAppSelector } from '../../app/hooks';
import { selectInstrumentDefs } from '../../app/ui-slice';
import { useMemo } from 'react';
import { selectScaleObjects } from '../../app/selectors';
import { ScaleLabel } from '../widgets/scale-label';
import { MUSIC_CONFIGS } from '../../utils/music-data';

const ScContainer = styled.div`
  border: .5rem dashed black;
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

const getLabel = (musicType: string) => {
  switch(musicType){
    case 'standardChromatic': return 'standard';
    case 'alteredChromatic': return 'altered chromatic';
    default: return musicType;
  }
}

type Props = {
  instrumentIdx: number
}
export function Instrument({instrumentIdx}: Props) {
  const instrumentDefs = useAppSelector(selectInstrumentDefs);
  const instrumentDef = useMemo(() => {
    return instrumentDefs ? instrumentDefs[instrumentIdx] : null;
  }, [ instrumentDefs, instrumentIdx ])

  const scaleObjs = useAppSelector(selectScaleObjects);
  const scaleObj = useMemo(() => {
    return scaleObjs ? scaleObjs[instrumentIdx] : null;
  }, [ scaleObjs, instrumentIdx ]);

  if(!instrumentDef){
    console.error(`piano could not get instrument for idx ${instrumentIdx}`);
    return null;
  }
  const instrumentNotes = MUSIC_CONFIGS[instrumentDef.type].notes;

  return (
    <ScContainer>
      <ScHeader>
        <ScInstrumentLabel>
          <h3>{'Keyboard'}</h3>
          <p>{getLabel(instrumentDef.type)}</p>
        </ScInstrumentLabel>
        {scaleObj && (
          <ScaleLabel scaleObj={scaleObj} instrumentNotes={instrumentNotes}/>
        )}
      </ScHeader>
      <Piano instrumentIdx={instrumentIdx} instrumentDef={instrumentDef} keyboardControl={instrumentIdx === 0}/>
    </ScContainer>
  );
}
