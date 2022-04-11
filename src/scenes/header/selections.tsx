import styled from 'styled-components';
import Select from '../../components/select';
import { useState } from 'react';
import { SCALES } from '../../utils/music';

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

  >p{
    margin-left:1rem;
    margin-bottom: -.5rem;
  }
`

type Props = {}
function Selections({}: Props) {
  const [ scale, setScale ] = useState('test');

  return (
    <ScWrapper>
      <ScGroup>
        <p>{'Scales'}</p>
        <Select size='sm' value={scale} onChangeValue={(value: any) => setScale(value)} >
          { Object.keys(SCALES).map((sc, idx) => (
            <option key={idx} value={sc}>{SCALES[sc].label}</option>
          )) }
        </Select>
      </ScGroup>
      <ScGroup>
        <p>{'Root note'}</p>
        <Select size='sm' value={scale} onChangeValue={(value: any) => setScale(value)} >
          { Object.keys(SCALES).map((sc, idx) => (
            <option key={idx} value={sc}>{SCALES[sc].label}</option>
          )) }
        </Select>
      </ScGroup>
      <ScGroup>
        <p>{'Scales'}</p>
        <Select size='sm' value={scale} onChangeValue={(value: any) => setScale(value)} >
          { Object.keys(SCALES).map((sc, idx) => (
            <option key={idx} value={sc}>{SCALES[sc].label}</option>
          )) }
        </Select>
      </ScGroup>
      <ScGroup>
        <p>{'Root note'}</p>
        <Select size='sm' value={scale} onChangeValue={(value: any) => setScale(value)} >
          { Object.keys(SCALES).map((sc, idx) => (
            <option key={idx} value={sc}>{SCALES[sc].label}</option>
          )) }
        </Select>
      </ScGroup>
    </ScWrapper>
  );
}

export default Selections;
