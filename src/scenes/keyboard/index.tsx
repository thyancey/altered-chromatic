import styled from 'styled-components';
import { getColor } from '../../themes';
import { Piano } from './piano';
import { Scales } from './scales';

const ScContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('grey')};
  z-index:-1;
  padding-top:4rem;
  
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
  padding: .5rem 2rem 0rem 2rem;
  margin-bottom:-3rem;

  >h1{
    color: ${getColor('black')};
    font-size: 8rem;

    padding:1rem;
    width: max-content;
    margin:auto;
    font-weight:800;
  }
`

const ScLogoBg = styled.div`
  background-color: ${getColor('white')};
  border-radius: 2.5rem 2.5rem 0 0;
  position:absolute;
  z-index:-1;
  left:0;
  right:0;
  top:0;
  bottom:2rem;
  filter: blur(1rem);
  opacity:.7;
`;

const ScBg = styled.div`
  position:fixed;
  z-index:-999;
  left:0;
  top:0;
  right:0;
  bottom:0;

  height:200%;
  width:200%;

  transform: rotate(30deg);

  >div{
    display:inline-block;
    width:20%;
    height:100%;

    &:nth-child(1){
      background-color:${getColor('pink')};
    }
    &:nth-child(2){
      background-color:${getColor('blue')};
    }
    &:nth-child(3){
      background-color:${getColor('green')};
    }
    &:nth-child(4){
      background-color:${getColor('yellow')};
    }
    &:nth-child(5){
      background-color:${getColor('red')};
    }
  }
`

const ScInstruction = styled.p`
  color:yellow !important;
`

const ScPianoContainer = styled.div`
  
`
const ScPianoBg = styled.div`
`

export function Keyboard() {
  return (
    <ScContainer>
      <ScLogo>
        <h1>{'Altered Chromatic'}</h1>
        <ScLogoBg />
      </ScLogo>
      <ScPianoContainer>
        <Piano />
        <ScPianoBg />
      </ScPianoContainer>
      <ScInstruction>{'ctrl + click to set the key & root note'}</ScInstruction>
      <Scales />
      <ScBg>
        <div />
        <div />
        <div />
        <div />
        <div />
      </ScBg>
    </ScContainer>
  );
}
