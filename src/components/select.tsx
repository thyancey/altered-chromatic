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
  border:none;

  background:none;
  color: ${getColor('white')};
  background-color: ${getColor('pink')};
  border-radius: 1.25rem;

  appearance: none;
  cursor:pointer;
  ${mixinFontFamily('details')};
`

const ScDropdownIcon = styled.div`
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
  componentSize?: SizeTypes,
  grow?: string
};
const ScWrapper = styled.div<ScWrapperProps>`
  position:relative;
  width:max-content;
  margin:.5rem;

  ${p => p.grow === 'stretch' && css`
    width:auto;
    select{
      width:100%;
    }
  `}

  ${p => (!p.componentSize || p.componentSize === 'md') && css`
    ${ScSelect} {
      font-size: 2rem;
    }
    ${ScDropdownIcon}{
    }
  `}
  ${p => (p.componentSize === 'lg') && css`
    ${ScSelect} {font-size: 3rem;}
    ${ScDropdownIcon}{
      width:4rem;
      height:4rem;
    }
  `}
  ${p => (p.componentSize === 'sm') && css`
    ${ScSelect} {
      font-size: 1.5rem;
    }
    ${ScDropdownIcon}{
      top:.8rem;
      
      width:2.5rem;
      height:2.5rem;
    }
  `}

  &:hover{
    ${ScSelect}{
      background-color: ${getShade('pink', 8)};
    }
    ${ScDropdownIcon}{
    }
  }
`;

type Props = {
  value: any,
  onChangeValue: Function,
  children?: React.ReactNode,
  size?: SizeTypes,
  grow?: string,
  placeholder?: string,
}
function Select({ children, value, onChangeValue, size, grow, placeholder }: Props) {
  return (
    <ScWrapper componentSize={size} grow={grow}>
      {/* @ts-ignore */}
      <ScSelect placeholder={placeholder} value={value} onChange={(e:any) => onChangeValue(e.target.value)} >
        { children }
      </ScSelect>
      <ScDropdownIcon />
    </ScWrapper>
  );
}

export default Select;
