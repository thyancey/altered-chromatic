import styled from 'styled-components';
import { getColor } from '../../themes';

import {
  selectActiveInstrumentKeys,
} from './slice';
import { getShowKeyboardKeys, getShowMusicNotes, selectInstrumentDefs, setPressedKeys, setShowKeyboardKeys } from '../../app/ui-slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { MusicBox } from '../../components/musicbox';
import { KeyManager } from './key-manager';
import { PianoHalfKey, PianoWholeKey } from './piano-key';
import MIDI_DATA from '../../components/mididata.json';
import { useEffect, useMemo, useState } from 'react';
import { CompleteNote, LilNoteObj, MidiNote } from '../../types';

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
  -webkit-tap-highlight-color:  rgba(255, 255, 255, 0); 
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


let otherTouchedKeys: string[] = [];

type Props = {
  instrumentIdx: number;
}
export function Piano({instrumentIdx}: Props) {
  const dispatch = useAppDispatch();
  const showMusicNotes = useAppSelector(getShowMusicNotes);
  const showKeyboardKeys = useAppSelector(getShowKeyboardKeys);

  const [ fingerIsDown, setFingerIsDown ] = useState(false);
  const [ useTouchEvents, setUseTouchEvents ] = useState(false);
  const [ touchedKeys, setTouchedKeys ] = useState<string[]>([]);

  const instrumentDefs = useAppSelector(selectInstrumentDefs);
  const instrumentDef = useMemo(() => {
    return instrumentDefs ? instrumentDefs[instrumentIdx] : null;
  }, [ instrumentDefs, instrumentIdx ])

  
  const instrumentKeys = useAppSelector(selectActiveInstrumentKeys);
  const pianoKeys = useMemo(() => {
    return instrumentKeys ? instrumentKeys[instrumentIdx] : null;
  }, [ instrumentKeys, instrumentIdx ])

  if(!instrumentDef){
    console.error(`piano could not get instrument for idx ${instrumentIdx}`);
    return null;
  }

  if(!pianoKeys){
    console.error(`piano could not get pianoKeys for idx ${instrumentIdx}`);
    return null;

  }

  const setAllTouchedKeys = (touchedKeys: string[]) => {
    setTouchedKeys(touchedKeys);
    otherTouchedKeys = touchedKeys;
  }

  const onMouseDown = (e:any, noteObj:CompleteNote) => {
    if(!useTouchEvents){
      setFingerIsDown(true);
      playNote(noteObj.midiNote);
    }
  }

  const playNote = (midiNote: MidiNote) => {
    // @ts-ignore;
    global.globalMidiHandler && global.globalMidiHandler([midiNote]);
  }
  const playNotes = (midiNotes: MidiNote[]) => {
    // @ts-ignore;
    global.globalMidiHandler && global.globalMidiHandler(midiNotes);
  }

  const onMouseEnter = (e:any, noteObj:CompleteNote) => {
    // console.log('>>> onMouseEnter!', noteObj.octaveNote, useTouchEvents);
    if(!useTouchEvents && fingerIsDown){
      setAllTouchedKeys([noteObj.octaveNote]);
      playNote(noteObj.midiNote);
    }
  }

  const attemptNotesUnderFinger = (e:any, absolute?: boolean): void => {
    // console.log('touches', e.touches);
    const lilNoteArray: LilNoteObj[] = [];
    for(let i = 0; i < e.touches.length; i++){
      const lilNoteObj = getNoteForTouch(e.touches[i]);
      if(lilNoteObj && (absolute || !otherTouchedKeys.includes(lilNoteObj.octaveNote))){
        lilNoteArray.push(lilNoteObj);
      }
    }
    
    if(lilNoteArray.length > 0){
      setAllTouchedKeys(lilNoteArray.map(nO => nO.octaveNote));
      playNotes(lilNoteArray.map((nO: LilNoteObj) => nO.midiNote));
    }
  }

  const getNoteForTouch = (touchEvent:any) => {
    try{
      const ele = document.elementFromPoint(touchEvent.clientX, touchEvent.clientY);
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

  const attemptKeyUnderTouchPosition = (touchEvent:any, absolute?: boolean) => {
    attemptNotesUnderFinger(touchEvent, absolute);
    /*
    const lilNoteObj = getNoteUnderFinger(touchEvent);
    
    if(lilNoteObj && !otherTouchedKeys.includes(lilNoteObj.octaveNote)){
      setAllTouchedKeys([lilNoteObj.octaveNote]);
      playNote(lilNoteObj.midiNote);
    }*/
  }
  
  const onDocumentTouchMove = (e:any) => {
    // console.log('onDocumentTouchMove!');
    attemptKeyUnderTouchPosition(e);
  }

  const onDocumentTouchStart = (e:any) => {
    // console.log('onDocumentTouchStart');
    attemptKeyUnderTouchPosition(e, true);
  }

  const onDocumentTouchEnd = (e:any) => {
    // console.log('onDocumentTouchEnd');
    setAllTouchedKeys([]);
    // e.preventDefault(); // prevent mouse click from triggering even on a touch device
  }

  const onDocumentMouseUp = (e:any) => {
    // console.log('onDocumentMouseUp!');
    setAllTouchedKeys([]);
    setFingerIsDown(false);
  }

  const checkTouchSupport = () => {
    // @ts-ignore
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  useEffect(() => {
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('touchstart', onDocumentTouchStart);
    document.addEventListener('touchmove', onDocumentTouchMove);
    document.addEventListener('touchend', onDocumentTouchEnd);

    if(checkTouchSupport()){
      setUseTouchEvents(true);
      dispatch(setShowKeyboardKeys(false));
    }
  }, [ dispatch ]);

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
        keysToWatch={instrumentDef.keyboardKeys}
      />
      <MusicBox midiInstrument={MIDI_DATA.defaultInstrument} volume={0.5} />
      <ScPiano className={`instrument-${instrumentDef.key}`}>
        <ScPianoBar />
        <ScPianoKeys>
          {pianoKeys.map(noteObj => {
            if(noteObj.note.includes('#')){
              return (
                <PianoHalfKey 
                  key={noteObj.idx}
                  noteObj={noteObj}
                  onMouseEnter={onMouseEnter}
                  onMouseDown={onMouseDown}
                  showMusicNotes={showMusicNotes}
                  showKeyboardKeys={showKeyboardKeys}
                  keyIsDown={touchedKeys.includes(noteObj.octaveNote)} />
              );
            }else{
              return (
                <PianoWholeKey 
                  key={noteObj.idx}
                  noteObj={noteObj}
                  onMouseEnter={onMouseEnter}
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
