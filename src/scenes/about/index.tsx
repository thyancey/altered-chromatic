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
        <p>{'While I was diving deeper into music theory, a few of the concepts started to frustrate me. Specifically, why some notes (B/C, E/F) only had a half-step between them. In addition, depending on what mode you are playing in, a note like "C flat" can exist, even though it\'s technically B! My old brain was having a hard time baking all of the note and scale rules in and thought - if we could throw history aside, is there another way to notate this stuff?'}</p>
        <p>{'So screw it! Here\'s a more consistent 12-note chromatic notation, and a keyboard that follows the same rules.  Since each note has a sharp, the "G" notes have been removed all together. I made all the notes revolve around "A" and not "C". In terms of pitch, "A" is the same as "C".'}</p>
        <h2>{'Just added'}</h2>
        <p>{`keyboard/touch events`}</p>
        <h2>{'Next feature'}</h2>
        <p>{`better multi-touch input on mobile`}</p>
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
