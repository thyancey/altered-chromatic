import styled from 'styled-components';
import { getColor } from '../../themes';

export const ScContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  background-color: ${getColor('pink')};

  color: ${getColor('white')};
  text-align:left;

  padding: 2rem;
  padding-top:5rem;

  >p{
    color: ${getColor('black')};
  }

  >div{
    display:inline-block;
    vertical-align:top;
  }
`

const ScLeft = styled.div`
  width: calc(100% - 15rem);
  >p{
    margin-bottom: 1rem;
    text-indent: 2rem;
  }

  padding-right: 4rem;
`

const ScTable = styled.div`
  width:15rem;
  padding: 1rem;
  text-align:center;
  margin-top:4rem;

  border: .5rem solid white;
  border-radius: 1rem;

  >p{
    margin-top:1rem;
    font-size:1.5rem;
    font-style: italic;
  }
`

const ScRowPair = styled.div`
  >span{
    display:inline-block;
    width:50%;

    border-bottom: .25rem solid white;

    &:first-child{
      border-right: .25rem solid white;
    }
  }

  &:first-child{
    >span{
      font-weight:bold;
    }
  }

  &:last-child{
    >span{
      border-bottom: none;
    }
  }
`

const oldNotes = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];
const newNotes = [ 'A', 'A#', 'B', 'B#', 'C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#' ];

export function About() {
  return (
    <ScContainer>
      <ScLeft>
        <h2>{'What is this?'}</h2>
        <p>{'When I started to learn more about music theory, I started getting pretty frustrated when notes were sometimes Sharp and sometimes Flat, and why each scale had to have a note of each letter, and why some letters only have a half step between them (lookin at you E and B)'}</p>
        <p>{'So screw it, here\'s a more consistent 12-note chromatic notation, and a keyboard that follows the same rules. Since each note has a sharp, the "G" notes have been removed all together. In terms of pitch, "A" is the same as "C".'}</p>
        <h2>{'Just added'}</h2>
        <p>{`redesign`}</p>
        <h2>{'Next feature'}</h2>
        <p>{`scale tools`}</p>
      </ScLeft>
      <ScTable>
        <ScRowPair>
          <span>{'NEW'}</span>
          <span>{'OLD'}</span>
        </ScRowPair>
        {newNotes.map((nN, idx) => (
          <ScRowPair key={idx}>
            <span>{nN}</span>
            <span>{oldNotes[idx]}</span>
          </ScRowPair>
        ))}
      </ScTable>
    </ScContainer>
  );
}
