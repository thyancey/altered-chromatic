import styled from 'styled-components';
import { getColor } from '../../themes';

export const ScContainer = styled.div`
  color: ${getColor('green')};
  text-align:center;
  margin-top:5rem;

  >p{
    color: ${getColor('red')};
  }

  table{
    text-align:center;
    margin:auto;
  }
`

export function About() {
  return (
    <ScContainer>
      <h2>{'What is this?'}</h2>
      <p>{'When I started to learn more about music theory, I started getting pretty frustrated when notes were sometimes Sharp and sometimes Flat, and why each scale had to have a note of each letter, and why some letters only have a half step between them (lookin at you E and B)'}</p>
      <p>{'So screw it, here\'s a more consistent 12-note chromatic notation, and a keyboard that follows the same rules. '}</p>
      <p>{'Since each note has a sharp, the "G" notes have been removed all together. In terms of pitch, "A" is the same as "C". Here is a note map if it helps you wrap you mind around it'}</p>
      <table>
        <tr><th>{'new'}</th><th>{'old'}</th></tr>
        <tr><td>{'A'}</td><td>{'C'}</td></tr>
        <tr><td>{'A#'}</td><td>{'C#'}</td></tr>
        <tr><td>{'B'}</td><td>{'D'}</td></tr>
        <tr><td>{'B#'}</td><td>{'D#'}</td></tr>
        <tr><td>{'C'}</td><td>{'E'}</td></tr>
        <tr><td>{'C#'}</td><td>{'F'}</td></tr>
        <tr><td>{'D'}</td><td>{'F#'}</td></tr>
        <tr><td>{'D#'}</td><td>{'G'}</td></tr>
        <tr><td>{'E'}</td><td>{'G#'}</td></tr>
        <tr><td>{'E#'}</td><td>{'A'}</td></tr>
        <tr><td>{'F'}</td><td>{'A#'}</td></tr>
        <tr><td>{'F#'}</td><td>{'B'}</td></tr>
      </table>
      <h2>{'Just added'}</h2>
      <p>{`play with keyboard`}</p>
      <h2>{'Next feature'}</h2>
      <p>{`redesign`}</p>
    </ScContainer>
  );
}
