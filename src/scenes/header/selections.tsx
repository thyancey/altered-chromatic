import styled from 'styled-components';
import Select from '../../components/select';
import Toggle from '../../components/toggle';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setActiveKey, getActiveKey, setActiveScale, getActiveScale, setShowKeyboardKeys, getShowKeyboardKeys, setShowMusicNotes, getShowMusicNotes, selectScaleDefs } from '../keyboard/slice';
import { NOTES } from '../../utils/music-data';

const ScWrapper = styled.div`
  position:absolute;
  right:1rem;
  top:0;

  display:grid;
  width:50%;
  height:100%;
  padding:.5rem;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const ScGroup = styled.div`
  margin:auto;
  position:relative;
  width: 100%;

  >p{
    margin-left:1rem;
    margin-bottom: -.5rem;
  }
`

type Props = {}
function Selections({}: Props) {
  const [ scale, setScale ] = useState('test');
  const dispatch = useAppDispatch();
  const activeScale = useAppSelector(getActiveScale);
  const activeKey = useAppSelector(getActiveKey);
  const showKeyboardKeys = useAppSelector(getShowKeyboardKeys);
  const showMusicNotes = useAppSelector(getShowMusicNotes);
  const scaleDefs = useAppSelector(selectScaleDefs);

  return (
    <ScWrapper>
      <ScGroup>
        <p>{'Scales'}</p>
        <Select size='sm' grow='stretch' value={activeScale || ''} onChangeValue={(value: any) => dispatch(setActiveScale(value))} >
          <option key={-1} value=''>{''}</option>
          { Object.keys(scaleDefs).map((sc, idx) => (
            <option key={idx} value={sc}>{scaleDefs[sc].label}</option>
          )) }
        </Select>
      </ScGroup>
      <ScGroup>
        <p>{'Show notes'}</p>
        <Toggle 
          labels={{'off': 'OFF', 'on': 'ON'}}
          size='sm'
          grow='stretch'
          value={showMusicNotes}
          onSetToggle={(value: boolean) => dispatch(setShowMusicNotes(value))} 
        />
      </ScGroup>
      <ScGroup>
        <p>{'Key'}</p>
        <Select size='sm' grow='stretch' value={activeKey || ''} onChangeValue={(value: any) => dispatch(setActiveKey(value))} >
          <option key={-1} value=''>{''}</option>
          { NOTES.map((nN, idx) => (
            <option key={idx} value={nN}>{nN}</option>
          )) }
        </Select>
      </ScGroup>
      <ScGroup>
        <p>{'Show keyboard keys'}</p>
        <Toggle 
          labels={{'off': 'OFF', 'on': 'ON'}}
          size='sm'
          grow='stretch'
          value={showKeyboardKeys}
          onSetToggle={(value: boolean) => dispatch(setShowKeyboardKeys(value))} 
        />
      </ScGroup>
    </ScWrapper>
  );
}

export default Selections;
