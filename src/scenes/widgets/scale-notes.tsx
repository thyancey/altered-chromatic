import styled from 'styled-components';
import { getColor } from '../../themes';

const ScNotes = styled.div`
  width:100%;
  text-align:center;
  margin-top:1rem;
  font-size:5rem;
  color: ${getColor('black')};
`

const ScNote = styled.div`
  display:inline-block;
  margin: 1rem;
  &.active{
    color: ${getColor('white')};
  }
`

type Props = {
  notes: string[];
}

export function ScaleNotes({notes}:Props) {
  return (
    <ScNotes>
      { notes.map((keyLabel, idx) => (
        <ScNote
          key={idx}
          className={keyLabel === notes[0] ? 'active' : ''}
        >
          {keyLabel}
        </ScNote>
      )) }
    </ScNotes>
  );
}
