import styled from 'styled-components';
import { getColor } from '../../themes';
// import { DynamicBg } from './dynamic-bg';
import { Piano } from './piano';
import { Scales } from './scales';

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
  margin-bottom: -6.5rem;

  >h1{
    color: ${getColor('black')};
    font-size: 9rem;

    padding:1rem;
    width: max-content;
    margin:auto;
    font-weight:800;
  }
`

const ScLogoBg = styled.div`
  background-color: ${getColor('pink')};
  border-radius: 2.5rem 2.5rem 0 0;
  position:absolute;
  z-index:-1;
  left:0;
  right:0;
  top:0;
  bottom:0;
  filter: blur(2rem);
  opacity:.7;
`;

const ScInstruction = styled.p`
  color:yellow !important;
`

const ScPianoContainer = styled.div`
  
`

export function Keyboard() {
  return (
    <ScContainer>
      <ScLogo>
        <h1>{'Altered Chromatic'}</h1>
        {/* <ScLogoBg /> */}
      </ScLogo>
      <ScPianoContainer>
        <Piano />
      </ScPianoContainer>
      <Scales />
      {/* <DynamicBg /> */}
    </ScContainer>
  );
}
