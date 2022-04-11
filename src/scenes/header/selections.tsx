import styled from 'styled-components';
import { getColor } from '../../themes';
import Select from '../../components/select';
import { useState } from 'react';
import { SCALES } from '../../utils/music';

const ScWrapper = styled.div`
  display:inline-block;
  width:50%;
  vertical-align:top;
  height:100%;
`;

const ScGroup = styled.div`
  margin:auto;
  position:relative;

  >p{
    margin-left:1rem;
    margin-bottom: -.5rem;
    /* display:inline-block; */
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
