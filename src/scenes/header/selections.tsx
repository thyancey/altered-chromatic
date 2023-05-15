import styled from 'styled-components';
import Toggle from '../../components/toggle';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getShowKeyboardKeys, setShowKeyboardKeys, setShowMusicNotes, getShowMusicNotes, setShowScaleNotes, getShowScaleNotes } from '../../app/ui-slice';

const ScWrapper = styled.div`
  position:absolute;
  right:1rem;
  top:0;

  display:grid;
  width:50%;
  height:100%;
  padding:.5rem;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const ScGroup = styled.div`
  position:absolute;
  width: 100%;

  >p{
    margin-left:1rem;
    margin-bottom: -.5rem;
  }
`;

export const ScToggleGroup = styled.div`
  margin:auto;
  position:relative;
  width:calc(50% - 1rem);
  display:inline-block;

  &:last-child{
    padding-left:1rem;
  }

  >p{
    margin-left:1rem;
    margin-top: 1rem;
  }
`;

function Selections() {
  const dispatch = useAppDispatch();
  const showKeyboardKeys = useAppSelector(getShowKeyboardKeys);
  const showMusicNotes = useAppSelector(getShowMusicNotes);
  const showScaleNotes = useAppSelector(getShowScaleNotes);

  return (
    <ScWrapper>
      <ScGroup>
        <ScToggleGroup>
          <p>{'Notes on Keys'}</p>
          <Toggle 
            labels={{'off': 'OFF', 'on': 'ON'}}
            size='sm'
            grow='stretch'
            value={showMusicNotes}
            onSetToggle={(value: boolean) => dispatch(setShowMusicNotes(value))} 
          />
          <p>{'Notes under Keys'}</p>
          <Toggle 
            labels={{'off': 'OFF', 'on': 'ON'}}
            size='sm'
            grow='stretch'
            value={showScaleNotes}
            onSetToggle={(value: boolean) => dispatch(setShowScaleNotes(value))} 
          />
        </ScToggleGroup>
        <ScToggleGroup>
          <p>{'Keyboard Keys'}</p>
          <Toggle 
            labels={{'off': 'OFF', 'on': 'ON'}}
            size='sm'
            grow='stretch'
            value={showKeyboardKeys}
            onSetToggle={(value: boolean) => dispatch(setShowKeyboardKeys(value))} 
          />
        </ScToggleGroup>
      </ScGroup>
    </ScWrapper>
  );
}

export default Selections;
