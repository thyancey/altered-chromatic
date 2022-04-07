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
  padding-top:5rem;
  
  text-align:center;

  >p{
    color: ${getColor('grey_light')};
    margin-bottom:1rem;
  }
`

export function Keyboard() {
  return (
    <ScContainer>
      <h1>{'Altered Chromatic.'}</h1>
      <p>{'click to play a note'}</p>
      <p>{'ctrl + click to set the key'}</p>
      <Instrument />
      <Scales />
    </ScContainer>
  );
}
