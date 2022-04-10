import styled, { css } from 'styled-components';
import { getColor } from '../../themes';

import { 
  CompleteNote,
  NoteName,
  ScaleStatus
} from '../../utils/music';

export const SPECIAL_ACCIDENTALS: NoteName[] = [ 'A#', 'C#', 'D#' ];
export const ScContainer = styled.div`
  display:block;
  text-align:center;
`


type ScPianoKeyProps = {
  scaleStatus: ScaleStatus,
  shadeKey?: boolean,
  keyPressed?: boolean
}

export const ScPianoBaseKey = styled.div<ScPianoKeyProps>`
  ${p => p.scaleStatus === 'root' && css`
    border: .5rem solid ${getColor('red')};
  `}

  ${p => p.scaleStatus === 'scale' && css`
    border: .5rem dashed ${getColor('red')};
  `}

  ${p => p.keyPressed && css`
    background-color: ${getColor('grey')} !important;
  `}

  border: .5rem solid ${getColor('black')};
  border-radius: 0 0 1rem 1rem;
`

const mixin_bounceAnim = () => `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
    20% {transform: translateY(-3px);} 
    60% {transform: translateY(-2.5px);} 
  } 
`;


const PianoKeyPressed = `
  margin-top:-.25rem;
  margin-left: -.1rem;
  margin-right: .6rem;
  box-shadow: .2rem .3rem .5rem .125rem ${getColor('black')};
  z-index:0;

  animation: bounce; /* referring directly to the animation's @keyframe declaration */
  animation-duration: .25s; /* don't forget to set a duration! */
`

const ScNoteLabel = styled.span`
  position:absolute;
  bottom:0rem;
  left:50%;
  transform: translateX(-50%);

  color: ${getColor('grey')};
  font-weight: bold;
  opacity: .5;
  font-size:3rem;
`;


const ScPianoKey = styled.div<ScPianoKeyProps>`
  border-radius: 0 0 1rem 1rem;
  box-shadow: .5rem .5rem .5rem .25rem ${getColor('black')};

  position:relative;
  width:7rem;
  max-width:7rem;
  height: 18rem;
  margin-left: .25rem;
  margin-right: .25rem;
  background-color: ${getColor('white')};
  cursor: pointer;
  z-index: 1;
  ${mixin_bounceAnim}

  &:hover{
    background-color: ${getColor('green')};
  }

  
  ${p => p.keyPressed && css`
    ${PianoKeyPressed}
  `}
  
  &:active{
    ${PianoKeyPressed}
  }

  ${ScNoteLabel}{
    margin-bottom: 1rem;
  }
` 

const PianoAccidentalKeyPressed = `
  animation: bounce; /* referring directly to the animation's @keyframe declaration */
  animation-duration: .25s; /* don't forget to set a duration! */
  z-index:2;

  >div{
    margin-top:-.25rem;
    margin-left: -.1rem;
    margin-right: .6rem;
  }
`
type ScAccidentalPianoKeyProps = {
  shadeKey: boolean,
  scaleStatus: ScaleStatus,
  keyPressed?: boolean
}


const ScAccidentalPianoKey = styled.div<ScAccidentalPianoKeyProps>`
  position:relative;
  cursor: pointer;

  ${mixin_bounceAnim}
  
  >div{
    position:absolute;
    z-index:2;
    width:5rem;
    height:10rem;
    box-shadow: .5rem .5rem .5rem .25rem ${getColor('black')};

    left:50%;
    transform:translateX(-50%);
    border-radius: 0 0 1rem 1rem;
    
    ${p => p.shadeKey ? css`
      >span{
        color: ${getColor('white')};
      }
      background-color: ${getColor('black')};
      box-shadow: .35rem .35rem .5rem .175rem ${getColor('pink')};

      &:hover{
        background-color: ${getColor('green')};
        >span{
          color: ${getColor('black')}
        }
      }
    ` : css`
      >span{
        color: ${getColor('black')};
      }
      background-color: ${getColor('grey_light')};
      box-shadow: .35rem .35rem .5rem .25rem ${getColor('black')};

      &:hover{
        background-color: ${getColor('green')};
      }
    `}

  }
  &:active{
    ${PianoAccidentalKeyPressed}
  }

  >div{
    ${p => p.shadeKey ? 
      css`
        &:active{
          box-shadow: .1rem .1rem .3rem .25rem ${getColor('pink')};
        }
      ` : css`
        &:active{
          box-shadow: .25rem .25rem .5rem .25rem ${getColor('black')};
        }
      `
    }
  }
  
  ${p => p.keyPressed && css`
    ${PianoAccidentalKeyPressed}

    >div{
      ${p.shadeKey ? css`
          box-shadow: .1rem .1rem .3rem .25rem ${getColor('pink')};
      ` : css`
        box-shadow: .25rem .25rem .5rem .25rem ${getColor('black')};
      `}
    }
  `}

  ${ScNoteLabel}{
    font-size: 2rem;
    margin-bottom: .5rem;
  }
`

const ScKeyboardLabel = styled.span`
  position:absolute;
  bottom:.5rem;
  left:50%;
  transform: translateX(-50%);

  margin-bottom:-3rem;
  border: .25rem solid ${getColor('grey')};
  color: ${getColor('black')};
  width:2rem;
  padding: 0;
  border-radius: .25rem;
  background-color: ${getColor('grey_light')};
  font-size: 1.5rem !important;
`;
type Props = {
  noteObj: CompleteNote,
  onClick: Function
}

export function PianoKey({ noteObj, onClick }: Props) {
  return (
    <ScPianoKey
      key={noteObj.idx}
      scaleStatus={noteObj.scaleStatus}
      keyPressed={noteObj.keyPressed}
      onClick={e => onClick(e, noteObj)}
    >
      <ScNoteLabel>{noteObj.note}</ScNoteLabel>
      {/* <ScKeyboardLabel>{noteObj.keyMatch}</ScKeyboardLabel> */}
    </ScPianoKey>
  );
}

export function AltPianoKey({ noteObj, onClick }: Props) {
  return (
    <ScAccidentalPianoKey
      key={noteObj.idx}
      onClick={e => onClick(e, noteObj)}
      shadeKey={SPECIAL_ACCIDENTALS.includes(noteObj.note)}
      scaleStatus={noteObj.scaleStatus}
      keyPressed={noteObj.keyPressed}
    >
      <div>
        <ScNoteLabel>{noteObj.note}</ScNoteLabel>
      </div>
    </ScAccidentalPianoKey>
  );
}