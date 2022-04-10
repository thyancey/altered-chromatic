import styled from 'styled-components';
import { getColor } from '../../themes';


const CSS_RotateForever = (duration: string) => `
  transform-origin: center;

  @-webkit-keyframes rotating /* Safari and Chrome */ {
    0% {
      -webkit-transform: rotate(0deg) scale(50%);
      -o-transform: rotate(0deg) scale(50%);
      transform: rotate(0deg) scale(50%);
      filter: blur(10rem);
    }
    50% {
      -webkit-transform: rotate(180deg) scale(150%);
      -o-transform: rotate(180deg) scale(150%);
      transform: rotate(180deg) scale(150%);
      filter: blur(.5rem);
    }
    100% {
      -webkit-transform: rotate(360deg) scale(50%);
      -o-transform: rotate(360deg) scale(50%);
      transform: rotate(360deg) scale(50%);
      filter: blur(10rem);
    }
  }
  @keyframes rotating {
    0%  {
      -ms-transform: rotate(0deg) scale(50%);
      -moz-transform: rotate(0deg) scale(50%);
      -webkit-transform: rotate(0deg) scale(50%);
      -o-transform: rotate(0deg) scale(50%);
      transform: rotate(0deg) scale(50%);
      filter: blur(10rem);
    }
    50% {
      -ms-transform: rotate(180deg) scale(150%);
      -moz-transform: rotate(180deg) scale(150%);
      -webkit-transform: rotate(180deg) scale(150%);
      -o-transform: rotate(180deg) scale(150%);
      transform: rotate(180deg) scale(150%);
      filter: blur(.5rem);
    }
    100% {
      -ms-transform: rotate(360deg) scale(50%);
      -moz-transform: rotate(360deg) scale(50%);
      -webkit-transform: rotate(360deg) scale(50%);
      -o-transform: rotate(360deg) scale(50%);
      transform: rotate(360deg) scale(50%);
      filter: blur(10rem);
    }
  }
  -webkit-animation: rotating ${duration} linear infinite;
  -moz-animation: rotating ${duration} linear infinite;
  -ms-animation: rotating ${duration} linear infinite;
  -o-animation: rotating ${duration} linear infinite;
  animation: rotating ${duration} linear infinite;
`



type ScWrapperProps = {
  rotateBg?: boolean
}

const ScWrapper = styled.div<ScWrapperProps>`
  position:fixed;
  z-index:-999;
  left:0;
  top:0;
  right:0;
  bottom:0;

  left:-100%;
  top:-100%;

  height:300%;
  width:300%;

  transform: rotate(30deg);


  ${p => p.rotateBg ? CSS_RotateForever('40s') : `filter: blur(10rem);`}

  >div{
    display:inline-block;
    height:100%;

    &:nth-child(1){
      background-color:${getColor('blue')};
      width:40%;
    }
    &:nth-child(2){
      background-color:${getColor('pink')};
      width:20%;
    }
    &:nth-child(3){
      background-color:${getColor('yellow')};
      width:40%;
    }
  }
`

export function DynamicBg() {
  return (
    <ScWrapper rotateBg={true}>
      <div />
      <div />
      <div />
    </ScWrapper>
  );
}