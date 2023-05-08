import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  getRootNoteIdx
} from './slice';
import { useAppSelector } from '../../app/hooks';
import { ScaleGroups } from './scalegroups';

const ScContainer = styled.div`
  text-align:left;
  display:inline-block;
  padding: 0rem 2rem;
  position: relative;

  ul{
    list-style:none;
  }


  >div{
    margin:1rem;
  }
`

const ScScales = styled.div`
  /* background-color: ${getColor('white')}; */
  padding-bottom: 2rem;
  border-radius: 1rem;
  
  >h4{
    margin-top:0;
    padding-top:0;
    text-align:center;
    font-size: 2rem;
  }
`

const ScScalesBg = styled.div`
  background-color: ${getColor('white')};
  /* border-radius: 2.5rem 2.5rem 0 0; */
  position:absolute;
  z-index:-1;
  left:0;
  right:0;
  top:-2rem;
  bottom:0rem;
  filter: blur(1rem);
  opacity:.7;
`

export function Scales() {
  const rootNoteIdx = useAppSelector(getRootNoteIdx);
  if(rootNoteIdx === -1) return null;

  return (
    <ScContainer>
      <ScScales>
        <h4>{'( scales )'}</h4>
        <ScaleGroups />
      </ScScales>
      <ScScalesBg />
    </ScContainer>
  );
}
