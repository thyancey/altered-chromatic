import {
  transformNotesToOctaveNotes,
  getNotesInScale, rotateArray, getOctaveNotesInScale, transformScaleNotesToOctaveNotes, getAllOctaveNotesBetween, getOctaveNoteDelta, convertOctaveNoteToMidiId, MIDI_NOTE_REF
} from './music';

describe('utils > music', () => {
  describe('#rotateArray', () => {
    it('should rotate from index', () => {
      expect(rotateArray(['A', 'B', 'C'], 1)).toEqual(
        ['B', 'C', 'A']
      );
    });
    it('should not rotate from 0 index', () => {
      expect(rotateArray(['A', 'B', 'C'], 0)).toEqual(
        ['A', 'B', 'C' ]
      );
    });
    it('should rotate with last index', () => {
      expect(rotateArray(['A', 'B', 'C'], 2)).toEqual(
        ['C', 'A', 'B']
      );
    });
    it('should rotate anything', () => {
      const obj = { 'hi': 'there' };
      const strang = 'hello';
      const numbo = 4;
      const falsy = 0;
      const falsy2 = false;
      const falsy3 = null;
      expect(rotateArray([obj, strang, numbo, falsy, falsy2, falsy3], 1)).toEqual(
        [strang, numbo, falsy, falsy2, falsy3, obj]
      );
    });
  });

  describe('#getNotesInScale', () => {
    it('should return notes', () => {
      expect(getNotesInScale('A', 'ionian')).toEqual(
        ['A','B','C','C#','D#','E#','F#']
      );
    });
    it('should return notes from another rootNote', () => {
      expect(getNotesInScale('C#', 'ionian')).toEqual(
        ['C#','D#','E#','F','A','B','C']
      );
    });
    it('should return notes from aeolian mode', () => {
      expect(getNotesInScale('A', 'aeolian')).toEqual(
        ['A','B','B#','C#','D#','E','F']
      );
    });
    it('should wrap root note, if requested', () => {
      expect(getNotesInScale('A', 'aeolian', true)).toEqual(
        ['A','B','B#','C#','D#','E','F','A']
      );
    });
  });

  describe('#transformNotesToOctaveNotes', () => {
    it('should return octaveNotes in normal range', () => {
      expect(transformNotesToOctaveNotes(['A','C','F'], 1, 2)).toEqual(
        ['A-1','C-1','F-1','A-2','C-2','F-2']
      );
    });
    it('should return clipped octaveNotes for halfway along normal range', () => {
      expect(transformNotesToOctaveNotes(['C','F','A'], 1, 2)).toEqual(
        ['C-1','F-1','A-2','C-2','F-2']
      );
    });
    it('should return octaveNotes in narrow range', () => {
      expect(transformNotesToOctaveNotes(['A','C','F'], 1, 1)).toEqual(
        ['A-1','C-1','F-1']
      );
    });
    it('should return clipped octaveNotes in narrow range', () => {
      expect(transformNotesToOctaveNotes(['F','A'], 1, 1)).toEqual(
        ['F-1']
      );
    });
    it('should return full range of octave notes if defaults not provided', () => {
      expect(transformNotesToOctaveNotes(['A','F'])).toEqual(
        ['A-0','F-0','A-1','F-1','A-2','F-2','A-3','F-3','A-4','F-4','A-5','F-5','A-6','F-6','A-7','F-7','A-8','F-8','A-9','F-9']
      );
    });
  });

  describe('#transformScaleNotesToOctaveNotes', () => {
    it('should return octaveNotes within one octave', () => {
      expect(transformScaleNotesToOctaveNotes(['A','C','F'], 1)).toEqual(
        ['A-1','C-1','F-1']
      );
    });
    it('should return octaveNotes that span octaves', () => {
      expect(transformScaleNotesToOctaveNotes(['C','F','A'], 1)).toEqual(
        ['C-1','F-1','A-2']
      );
    });
  });

  describe('#getOctaveNotesInScale', () => {
    it('should return octaveNotes in normal range', () => {
      expect(getOctaveNotesInScale('F-2', 'ionian')).toEqual(
        ['F-2','A-3','B-3','B#-3','C#-3','D#-3','E#-3']
      );
    });
    it('should return octaveNotes in normal range, and wrap root note, if requested', () => {
      expect(getOctaveNotesInScale('F-2', 'ionian', true)).toEqual(
        ['F-2','A-3','B-3','B#-3','C#-3','D#-3','E#-3','F-3']
      );
    });
  });

  describe('#getAllOctaveNotesBetween', () => {
    it('should return octaveNotes in normal range', () => {
      expect(getAllOctaveNotesBetween('F-2', 'B#-3')).toEqual(
        ['F-2','F#-2','A-3','A#-3','B-3','B#-3']
      );
      expect(getAllOctaveNotesBetween('F-2', 'F-2')).toEqual(
        ['F-2']
      );
    });
  });

  describe('#getOctaveNoteDelta', () => {
    it('should return single distance between adjacent notes', () => {
      expect(getOctaveNoteDelta('A-2', 'A#-2')).toEqual(
        1
      );
      expect(getOctaveNoteDelta('A#-2', 'A-2')).toEqual(
        -1
      );
    });

    it('should return distance between notes in the same octave', () => {
      expect(getOctaveNoteDelta('A-2', 'F#-2')).toEqual(
        11
      );
      expect(getOctaveNoteDelta('F#-2', 'A-2')).toEqual(
        -11
      );
    });

    it('should return distance between notes that span octaves', () => {
      expect(getOctaveNoteDelta('F-2', 'B#-3')).toEqual(
        5
      );
      expect(getOctaveNoteDelta('B#-3', 'F-2')).toEqual(
        -5
      );
    });

    it('should return 0 distance between the same note', () => {
      expect(getOctaveNoteDelta('A-2', 'A-2')).toEqual(
        0
      );
    });
  });

  describe('#convertOctaveNoteToMidiId', () => {
    it('converts base note to expected midi value (using const)', () => {
      expect(convertOctaveNoteToMidiId(MIDI_NOTE_REF.octaveNote)).toEqual(
        MIDI_NOTE_REF.code
      );
    });
    it('converts base note to expected midi value', () => {
      expect(convertOctaveNoteToMidiId('A-4')).toEqual(
        60
      );
    });
    it('converts note to expected midi value', () => {
      expect(convertOctaveNoteToMidiId('A#-4')).toEqual(
        61
      );
    });
    it('converts note to expected midi value', () => {
      expect(convertOctaveNoteToMidiId('F#-3')).toEqual(
        59
      );
    });
  });
});
