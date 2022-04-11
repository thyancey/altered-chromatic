import styled, { css } from 'styled-components';
import { getColor, getShade, mixinFontFamily } from '../themes';
import Icon_MenuDown from '../assets/menu-down.svg';

type SizeTypes = 'sm' | 'md' | 'lg';

const ScSelect = styled.select`
  padding: 1rem;
  padding-right: 3rem;
  padding-left: 1.5rem;
  font-size: 3rem;
  font-weight: bold;

  background:none;
  color: ${getColor('white')};
  background-color: ${getColor('pink')};
  border-radius: 1.5rem;

  appearance: none;
  cursor:pointer;
  ${mixinFontFamily('details')};
`

const ScTuneIcon = styled.div`
  position:absolute;
  right:1rem;
  top:1rem;
  width:3rem;
  height:3rem;

  background-color: ${getColor('white')};
  -webkit-mask: url(${Icon_MenuDown}) no-repeat center;
  mask: url(${Icon_MenuDown}) no-repeat center;
  mask-size: 100%;

  pointer-events:none;
`
type ScWrapperProps = {
  selectSize?: SizeTypes
};
const ScWrapper = styled.div<ScWrapperProps>`
  position:relative;
  width:max-content;
  margin:.5rem;

  ${p => (!p.selectSize || p.selectSize === 'md') && css`
    ${ScSelect} {
      font-size: 2rem;
    }
    ${ScTuneIcon}{
    }
  `}
  ${p => (p.selectSize === 'lg') && css`
    ${ScSelect} {font-size: 3rem;}
    ${ScTuneIcon}{
      width:4rem;
      height:4rem;
    }
  `}
  ${p => (p.selectSize === 'sm') && css`
    ${ScSelect} {
      font-size: 1.5rem;
    }
    ${ScTuneIcon}{
      top:.8rem;
      
      width:2.5rem;
      height:2.5rem;
    }
  `}

  &:hover{
    ${ScSelect}{
      background-color: ${getShade('pink', 8)};
    }
    ${ScTuneIcon}{
    }
  }
`;

type Props = {
  value: any,
  onChangeValue: Function,
  children?: React.ReactNode,
  size?: SizeTypes
}
function Select({ children, value, onChangeValue, size }: Props) {
  return (
    <ScWrapper selectSize={size}>
      {/* @ts-ignore */}
      <ScSelect value={value} onChange={(e:any) => onChangeValue(e.target.value)} >
        { children }
      </ScSelect>
      <ScTuneIcon />
    </ScWrapper>
  );
}

export default Select;
