import styled from 'styled-components';
import { getColor } from '../../themes';
import { Instrument } from './instrument';
import { Scales } from './scales';

export const ScContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('grey')};
  z-index:-1;
  padding-top:2rem;
  padding-left:1.5rem;
  
  text-align:center;
`

export function Keyboard() {
  return (
    <ScContainer>
      <h1>{'Altered Chromatic'}</h1>
      <Instrument />
      <Scales />
    </ScContainer>
  );
}
