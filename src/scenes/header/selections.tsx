import styled from 'styled-components';
import Select from '../../components/select';
import { useState } from 'react';
import { NOTES, SCALES } from '../../utils/music';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setActiveKey, getActiveKey, setActiveScale, getActiveScale } from '../keyboard/slice';

const ScWrapper = styled.div`
  position:absolute;
  right:0;
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

  return (
    <ScWrapper>
      <ScGroup>
        <p>{'Scales'}</p>
        <Select size='sm' grow='stretch' value={activeScale || ''} onChangeValue={(value: any) => dispatch(setActiveScale(value))} >
          <option key={-1} value=''>{''}</option>
          { Object.keys(SCALES).map((sc, idx) => (
            <option key={idx} value={sc}>{SCALES[sc].label}</option>
          )) }
        </Select>
      </ScGroup>
      <ScGroup>
        <p>{'Scales'}</p>
        <Select size='sm' grow='stretch' value={scale || ''} onChangeValue={(value: any) => setScale(value)} >
         <option key={-1} value=''>{''}</option>
          { Object.keys(SCALES).map((sc, idx) => (
            <option key={idx} value={sc}>{SCALES[sc].label}</option>
          )) }
        </Select>
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
        <p>{'Root note'}</p>
        <Select size='sm' grow='stretch' value={scale || ''} onChangeValue={(value: any) => setScale(value)} >
          <option key={-1} value=''>{''}</option>
          { Object.keys(SCALES).map((sc, idx) => (
            <option key={idx} value={sc}>{SCALES[sc].label}</option>
          )) }
        </Select>
      </ScGroup>
    </ScWrapper>
  );
}

export default Selections;
