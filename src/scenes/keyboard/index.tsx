import styled from 'styled-components';
import { getColor } from '../../themes';
import { Instrument } from './instrument';

const ScContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('pink')};
  z-index:-1;
  padding-top:0rem;
  
  text-align:center;

  overflow-y:auto;

  >p{
    color: ${getColor('grey_light')};
    margin-bottom:1rem;
  }
`

const ScLogo = styled.div`
  width: max-content;
  height: max-content;
  margin: auto;
  position: relative;
  padding: 2rem 2rem 0rem 2rem;
  margin-bottom: -2rem;
  margin-top: -3rem;

  >h1{
    color: ${getColor('black')};
    font-size: 9rem;

    width: max-content;
    margin:auto;
    font-weight:800;
  }
`

export function Keyboard() {
  return (
    <ScContainer>
      <ScLogo>
        <h1>{'Altered Chromatic'}</h1>
      </ScLogo>
      <Instrument instrumentIdx={0} />
      <Instrument instrumentIdx={1} />
    </ScContainer>
  );
}
