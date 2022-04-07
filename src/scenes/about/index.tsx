import styled from 'styled-components';
import { getColor } from '../../themes';

export const ScContainer = styled.div`
  color: ${getColor('green')};
  text-align:center;
  margin-top:5rem;
`

export function About() {
  return (
    <ScContainer>
      <h2>{`I'll explain myself soon.`}</h2>
    </ScContainer>
  );
}
