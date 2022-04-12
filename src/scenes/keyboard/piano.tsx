import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  getShowKeyboardKeys,
  getShowMusicNotes,
  selectKeyboardKeysWithPressed,
  setActiveNote,
  setPressedKeys,
  setShowKeyboardKeys,
} from './slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { MusicBox } from '../../components/musicbox';
import { 
  CompleteNote
} from '../../utils/music';
import { KeyManager } from './key-manager';
import { PianoHalfKey, PianoWholeKey } from './piano-key';
import MIDI_DATA from '../../components/mididata';
import { useEffect, useRef, useState } from 'react';

export const ScContainer = styled.div`
  display:block;
  text-align:center;
`
const ScPianoBar = styled.div`
  position:absolute;
  z-index:4;
  left:1rem;
  right:1rem;
  height:3rem;
  top:3rem;

  background-color: ${getColor('black')};
  border-radius: 1rem;  
  box-shadow: .25rem .25rem .25rem .175rem ${getColor('black')};
`

const ScPiano = styled.div`
  position: relative;
  padding: 5rem 1rem;
  width: max-content;
  margin: auto;
  width:max-content;

  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
`

const ScPianoBg = styled.div`
  background-color: ${getColor('blue')};
  z-index:-1;

  position:absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  opacity: .7;

  border-radius: 2.5rem;
  
  filter: blur(3rem);
`

const ScPianoKeys = styled.div`
  position:relative;
  width:100%;
  padding:0 1rem;

  >div{
    display:inline-block;
    vertical-align:top;
  }
`

export function Piano() {
  const pianoKeys = useAppSelector(selectKeyboardKeysWithPressed);
  const dispatch = useAppDispatch();
  const showMusicNotes = useAppSelector(getShowMusicNotes);
  const showKeyboardKeys = useAppSelector(getShowKeyboardKeys);
  const [ fingerIsDown, setFingerIsDown ] = useState(false);
  const [ touchedKeys, setTouchedKeys ] = useState<string[]>([]);

  const onClick = (e:any, noteObj:CompleteNote) => {
    // if(e.ctrlKey){
    //   dispatch(setActiveNote(noteObj.octaveNote))
    // }
    // console.log('onClick!', noteObj.octaveNote);
    // playNote(noteObj);
  }

  type LilNoteObj = {
    octaveNote: string,
    midiNote: number
  }

  const onTouchStart = (e:any, noteObj:CompleteNote) => {
    // console.log('onTouchStart!', noteObj.octaveNote);
    setFingerIsDown(true);
    setTouchedKeys([noteObj.octaveNote]);
    playNote(noteObj.midiNote);
  }
  const onTouchEnd = (e:any, noteObj:CompleteNote) => {
    // console.log('onTouchEnd!', noteObj.octaveNote);
    setTouchedKeys([]);

    setFingerIsDown(false);
    e.preventDefault();
    // playNote(noteObj.midiNote);
  }
  const onMouseDown = (e:any, noteObj:CompleteNote) => {
    // console.log('onMouseDown!', noteObj.octaveNote);
    setFingerIsDown(true);
    playNote(noteObj.midiNote);
  }

  const playNote = (midiNote: number) => {
    // @ts-ignore;
    global.globalMidiHandler && global.globalMidiHandler([midiNote]);
  }

  const onMouseEnter = (e:any, noteObj:CompleteNote) => {
    // console.log('>>> onMouseEnter!', noteObj.octaveNote);
    if(fingerIsDown){
      setTouchedKeys([noteObj.octaveNote]);
      playNote(noteObj.midiNote);
    }
  }

  const getNoteUnderFinger = (e:any): LilNoteObj | null => {
    try{
      const touch = e.touches[0];
      // console.log('touches', touches);
      const ele = document.elementFromPoint(touch.clientX, touch.clientY);
      const mN = ele?.getAttribute('data-midinote');
      const oN = ele?.getAttribute('data-octavenote');

      if(mN && oN){
        return {
          midiNote: parseInt(mN),
          octaveNote: oN
        }
      }
    }catch(e){
      console.log('ERRRR', e);
    }

    return null;
  }


  const onTouchMove = (e:any, noteObj:CompleteNote) => {
    // console.log('>>> onTouchMove!', noteObj.octaveNote);
    // if(fingerIsDown){
    const lilNoteObj = getNoteUnderFinger(e);

    if(lilNoteObj && !touchedKeys.includes(lilNoteObj.octaveNote)){
      // console.log('touchedNote', lilNoteObj.octaveNote);
      // console.log(`touchMove: (${e.clientX},${e.clientY})`);
      // (global as any).ele = document.elementFromPoint(e.clientX, e.clientY);
      setTouchedKeys([lilNoteObj.octaveNote]);
      playNote(lilNoteObj.midiNote);
    }
  }

  const onDocumentMouseUp = (e:any) => {
    // console.log('onDocumentMouseUp!');
    setTouchedKeys([]);
    setFingerIsDown(false);
  }

  const checkTouchSupport = () => {
    // @ts-ignore
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  useEffect(() => {
    console.log('useEffect')
    document.addEventListener('mouseup', onDocumentMouseUp);

    if(checkTouchSupport()){
      dispatch(setShowKeyboardKeys(false));
    }
  }, []);

  // console.log(fingerIsDown ? `\n---finger is DOWN }]!---` : `---finger is ^^up^^}]!---\n`)
  // console.log('touchedNotes', touchedKeys);

  return (
    <ScContainer>
      <KeyManager 
        onKeyPressed={(key:string) => {
          const foundPianoKey = pianoKeys.find(pK => pK.keyMatch === key);
          if(foundPianoKey !== undefined){
            // @ts-ignore;
            global.globalMidiHandler && global.globalMidiHandler([foundPianoKey.midiNote]);
          }
        }}
        onKeysChanged={(keys: string[]) => {
          dispatch(setPressedKeys(keys));
        }}
      />
      <MusicBox midiInstrument={MIDI_DATA.defaultInstrument} volume={0.2} />
      <ScPiano>
        <ScPianoBar />
        <ScPianoKeys>
          {pianoKeys.map(noteObj => {
            if(noteObj.note.includes('#')){
              return (
                <PianoHalfKey 
                  key={noteObj.idx} 
                  noteObj={noteObj} 
                  onClick={onClick} 
                  onMouseEnter={onMouseEnter} 
                  onTouchStart={onTouchStart} 
                  onTouchMove={onTouchMove} 
                  onTouchEnd={onTouchEnd} 
                  onMouseDown={onMouseDown} 
                  showMusicNotes={showMusicNotes} 
                  showKeyboardKeys={showKeyboardKeys} 
                  keyIsDown={touchedKeys.includes(noteObj.octaveNote)} />
              );
            }else{
              return (
                <PianoWholeKey 
                key={noteObj.idx} noteObj={noteObj} 
                onClick={onClick} 
                onMouseEnter={onMouseEnter} 
                onTouchStart={onTouchStart} 
                onTouchMove={onTouchMove} 
                onTouchEnd={onTouchEnd} 
                onMouseDown={onMouseDown} 
                showMusicNotes={showMusicNotes} 
                showKeyboardKeys={showKeyboardKeys} 
                keyIsDown={touchedKeys.includes(noteObj.octaveNote)} />
              );
            }
          })}
        </ScPianoKeys>
        <ScPianoBg />
      </ScPiano>
    </ScContainer>
  );
}
