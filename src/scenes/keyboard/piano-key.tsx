import styled, { css } from 'styled-components';
import { getColor } from '../../themes';
import { CompleteNote, NoteName } from '../../types';

export const SPECIAL_SHARPS: NoteName[] = [ 'A#', 'C#', 'D#' ];
export const ScContainer = styled.div`
  display:block;
  text-align:center;
`
const KEY_HEIGHT = 18;

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

const ScNoteFoot = styled.span`
  pointer-events:none;
  position:absolute;
  top:${KEY_HEIGHT}rem;
  left:50%;
  transform: translateX(-50%);

  margin-top:2rem;
  font-weight: bold;
  font-size:3rem;

  .scalestatus-invalid & {
    opacity:.15;
  }

  .scalestatus-root & {
    color: ${getColor('white')};
  }

  .scalestatus-scale & {

  }
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

const ScKeyBase = styled.div`
.scalestatus-invalid & {
  opacity:.15;
}
.scalestatus-root & {
  ${CSS_BlueKey}
}
`
const ScWholeKey = styled(ScKeyBase)`
  width: 7rem;
  margin-left:.5rem;
  height:${KEY_HEIGHT}rem;
  border-radius: 0 0 1rem 1rem;
  
  ${CSS_WhiteKey}
  box-shadow: .25rem .25rem .75rem .5rem ${getColor('black')};
`

const ScHalfKey = styled(ScKeyBase)`
  width:5rem;
  height:${KEY_HEIGHT / 1.8}rem;
  border-radius: 0 0 1.5rem 1.5rem;
  
  ${CSS_BlackKey}
  box-shadow: .15rem .15rem .25rem .25rem ${getColor('blue')};

  ${ScNoteLabel}{
    bottom:.75rem;
  }
  ${ScKeyLabel}{
    bottom:5rem;
    background-color: ${getColor('grey')};
  }

  
  .instrument-alteredPiano &.half-key {
    box-shadow: .15rem .15rem .25rem .25rem ${getColor('yellow')};
    border-radius: 2rem;
  }

  .half-key{
    ${ScNoteLabel}{ 
      bottom:.50rem;
    }
    ${ScKeyLabel}{
      bottom:4.75rem;
    }
  }
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
  keyIsDown?: boolean,
  keyboardControl?: boolean
}
export function PianoWholeKey({ noteObj, onMouseEnter, onMouseDown, showMusicNotes, showKeyboardKeys, keyIsDown, keyboardControl}: Props) {
  return (
    <ScWholeKeyWrapper
      key={noteObj.idx}
      onMouseEnter={e => onMouseEnter(e, noteObj)}
      onMouseDown={e => onMouseDown(e, noteObj)}
      keyPressed={noteObj.keyPressed && keyboardControl || keyIsDown}
      className={`scalestatus-${noteObj.scaleStatus}`}
    >
      <ScWholeKey data-midinote={noteObj.midiNote} data-octavenote={noteObj.octaveNote}>
        {showKeyboardKeys && (<ScKeyLabel>{noteObj.keyMatch}</ScKeyLabel>)}
        {showMusicNotes && (<ScNoteLabel>{noteObj.note}</ScNoteLabel>)}
      </ScWholeKey>
      {showMusicNotes && (<ScNoteFoot>{noteObj.note}</ScNoteFoot>)}
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
      className={`scalestatus-${noteObj.scaleStatus}`}
    >
      <ScHalfKey
        data-midinote={noteObj.midiNote}
        data-octavenote={noteObj.octaveNote}
        className={SPECIAL_SHARPS.includes(noteObj.note) ? 'half-key' : ''}
      >
        {showKeyboardKeys && (<ScKeyLabel>{noteObj.keyMatch}</ScKeyLabel>)}
        {showMusicNotes && (<ScNoteLabel>{noteObj.note}</ScNoteLabel>)}
      </ScHalfKey>
      {showMusicNotes && (<ScNoteFoot>{noteObj.note}</ScNoteFoot>)}
    </ScHalfKeyWrapper>
  );
}