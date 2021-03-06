import styled, { css } from 'styled-components';
import { getColor } from '../../themes';
import { CompleteNote, NoteName, ScaleStatus } from '../../types';

export const SPECIAL_SHARPS: NoteName[] = [ 'A#', 'C#', 'D#' ];
export const ScContainer = styled.div`
  display:block;
  text-align:center;
`
const mixin_bounceAnim = () => `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 
    20% {transform: translateY(-3px);} 
    60% {transform: translateY(-2.5px);} 
  } 
`;

const Anim_RegPress = `
  margin-top:-.25rem;
  margin-left: -.6rem;
  margin-right: .6rem;
  z-index:0;

  animation: bounce;
  animation-duration: .25s;
`
const Anim_SharpPress = `
  animation: bounce;
  animation-duration: .25s;
  z-index:2;

  >div{
    margin-top:-.25rem;
    margin-left: -.1rem;
    margin-right: .6rem;
  }
`




type SKeyBaseProps = {
  scaleStatus: ScaleStatus,
  altKey?: boolean
}
const ScKeyBase = styled.div<SKeyBaseProps>`
`

const ScKeyLabel = styled.span`
  pointer-events:none;
  position:absolute;
  bottom:4rem;
  left:50%;
  transform: translateX(-50%);

  font-weight: bold;
  font-size:2rem;

  opacity:.8;

  background-color: ${getColor('grey_light')};
  border-radius: .5rem;
  padding: .25rem 1rem;
`

const ScNoteLabel = styled.span`
  pointer-events:none;
  position:absolute;
  bottom:.25rem;
  left:50%;
  transform: translateX(-50%);

  font-weight: bold;
  font-size:3rem;

  opacity:.8;
`

const CSS_WhiteKey = `
  color: ${getColor('grey')};
  background-color: ${getColor('white')};


  &:hover{
    color: ${getColor('black')};
    background-color: ${getColor('grey_light')};
  }
`
const CSS_BlackKey = `
  color: ${getColor('grey_light')};
  background-color: ${getColor('black')};


  &:hover{
    color: ${getColor('blue')};
    background-color: ${getColor('grey')};
  }
`

const CSS_BlueKey = `
  color: ${getColor('white')};
  background-color: ${getColor('blue')};
  
  &:hover{
    color: ${getColor('black')};
    background-color: ${getColor('blue_dark')};
  }
`

const ScWholeKey = styled(ScKeyBase)`
  width: 7rem;
  margin-left:.5rem;
  height: 18rem;
  border-radius: 0 0 1rem 1rem;
  
  ${CSS_WhiteKey}
  box-shadow: .25rem .25rem .75rem .5rem ${getColor('black')};

  ${p => p.scaleStatus === 'invalid' && css`
    opacity:.15;
  `}

  ${p => p.scaleStatus === 'root' && css`
    ${CSS_BlueKey}
  `}
`

const ScHalfKey = styled(ScKeyBase)`
  width:5rem;
  height:10rem;
  border-radius: 0 0 1rem 1rem;
  
  ${CSS_BlackKey}
  box-shadow: .15rem .15rem .25rem .25rem ${getColor('blue')};

  ${p => p.scaleStatus === 'invalid' && css`
    opacity:.15;
  `}

  ${p => p.scaleStatus === 'root' && css`
    ${CSS_BlueKey}
  `}

  border-radius: 0 0 2.5rem 2.5rem;

  ${ScNoteLabel}{
    bottom:.75rem;
  }
  ${ScKeyLabel}{
    bottom:5rem;
    background-color: ${getColor('grey')};
  }

  ${p => !p.altKey && css`
    top:-.25rem;
    border-radius: 0 0 1rem 1rem;

    ${ScNoteLabel}{ 
      bottom:.50rem;
    }
    ${ScKeyLabel}{
      bottom:4.75rem;
    }
  `}
`

type ScKeyWrapperBaseProps = {
  keyPressed?: boolean
}
const ScKeyWrapperBase = styled.div<ScKeyWrapperBaseProps>`
  position:relative;
  ${mixin_bounceAnim}
  cursor: pointer;
`

const ScWholeKeyWrapper = styled(ScKeyWrapperBase)`
  z-index:1;

  ${p => p.keyPressed && css`${Anim_RegPress}`}
  &:active{
    ${Anim_RegPress}
  }
`

const ScHalfKeyWrapper = styled(ScKeyWrapperBase)`
  z-index:3;

  ${p => p.keyPressed && css`${Anim_SharpPress}`}
  &:active{
    ${Anim_SharpPress}
  }

  >div{
    position:absolute;
    left:50%;
    transform:translateX(-50%);
  }
`

type Props = {
  noteObj: CompleteNote,
  onMouseEnter: Function,
  onMouseDown: Function,
  showKeyboardKeys?: boolean,
  showMusicNotes?: boolean,
  keyIsDown?: boolean
}
export function PianoWholeKey({ noteObj, onMouseEnter, onMouseDown, showMusicNotes, showKeyboardKeys, keyIsDown }: Props) {
  return (
    <ScWholeKeyWrapper
      key={noteObj.idx}
      onMouseEnter={e => onMouseEnter(e, noteObj)}
      onMouseDown={e => onMouseDown(e, noteObj)}
      keyPressed={noteObj.keyPressed || keyIsDown}
    >
      <ScWholeKey data-midinote={noteObj.midiNote} data-octavenote={noteObj.octaveNote} scaleStatus={noteObj.scaleStatus}>
        {showKeyboardKeys && (<ScKeyLabel>{noteObj.keyMatch}</ScKeyLabel>)}
        {showMusicNotes && (<ScNoteLabel>{noteObj.note}</ScNoteLabel>)}
      </ScWholeKey>
    </ScWholeKeyWrapper>
  );
}

export function PianoHalfKey({ noteObj, onMouseEnter, onMouseDown, showMusicNotes, showKeyboardKeys, keyIsDown }: Props) {
  return (
    <ScHalfKeyWrapper
      key={noteObj.idx}
      onMouseEnter={e => onMouseEnter(e, noteObj)}
      onMouseDown={e => onMouseDown(e, noteObj)}
      keyPressed={noteObj.keyPressed || keyIsDown}
    >
      <ScHalfKey data-midinote={noteObj.midiNote} data-octavenote={noteObj.octaveNote} scaleStatus={noteObj.scaleStatus} altKey={SPECIAL_SHARPS.includes(noteObj.note)}>
        {showKeyboardKeys && (<ScKeyLabel>{noteObj.keyMatch}</ScKeyLabel>)}
        {showMusicNotes && (<ScNoteLabel>{noteObj.note}</ScNoteLabel>)}
      </ScHalfKey>
    </ScHalfKeyWrapper>
  );
}