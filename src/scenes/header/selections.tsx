import styled from 'styled-components';
import { getColor } from '../../themes';

const ScWrapper = styled.div`
  position:fixed;

  top: 10%;
  bottom: 10%;
  left: 10%;
  right: 10%;

  border: 1rem solid white;
  background-color: ${getColor('pink')};
`;

const ScGroup = styled.div`
  margin:auto;

  padding: 2rem;
`

type Props = {}
function Selections({}: Props) {

  return (
    <ScWrapper>
      <ScGroup>
        <select placeholder="Select option">
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </select>
      </ScGroup>
    </ScWrapper>
  );
}

export default Selections;
