import styled from 'styled-components';
import { getColor } from '../../themes';

export const ScContainer = styled.div`
  color: ${getColor('green')};
  text-align:center;
  margin-top:5rem;

  >p{
    color: ${getColor('red')};
  }
`

export function About() {
  return (
    <ScContainer>
      <h2>{`I'll explain this soon.`}</h2>
      <p>{`Next feature: play midi sounds`}</p>
    </ScContainer>
  );
}
