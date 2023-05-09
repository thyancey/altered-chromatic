import styled, { css } from 'styled-components';
import { getColor, getShade, mixinFontFamily } from '../themes';

type SizeTypes = 'sm' | 'md' | 'lg';
type ScWrapperProps = {
  componentSize?: SizeTypes,
  grow?: string,
  status?: boolean
};

const ScToggle = styled.button<ScWrapperProps>`
  position:relative;
  width:max-content;
  margin:.5rem;

  border:none;
  cursor: pointer;
  
  color: ${getColor('white')};
  background-color: ${getColor('pink')};
  ${mixinFontFamily('details')};

  padding: .5rem;
  border-radius: 1.25rem;

  ${p => p.grow === 'stretch' && css`
    width:100%;
  `}

  ${p => (!p.componentSize || p.componentSize === 'md') && css`
    font-size: 2rem;
  `}
  ${p => (p.componentSize === 'lg') && css`
    font-size: 3rem;
  `}
  ${p => (p.componentSize === 'sm') && css`
    font-size: 1.5rem;
  `}

  &:hover{
    background-color: ${getShade('pink', 8)};
  }
`;

type ScLabelProps = {
  isActive?: boolean
}
const ScLabel = styled.span<ScLabelProps>`
  display:inline-block;
  width:50%;
  
  &:first-child{
  }

  &:last-child{
  }

  border-radius: .5rem;
  ${p => p.isActive && css`
    background-color: ${getColor('yellow')};
  `}
`

type Props = {
  onSetToggle: Function,
  size?: SizeTypes,
  grow?: string,
  value?: boolean,
  labels:{
    off:string,
    on:string,
  }
}
function Toggle({ value, labels, onSetToggle, size, grow }: Props) {
  
  return (
    <ScToggle status={value} componentSize={size} grow={grow} onClick={(e:any) => onSetToggle(!value)}>
      <ScLabel isActive={!value}>{labels.off}</ScLabel>
      <ScLabel isActive={value}>{labels.on}</ScLabel>
    </ScToggle>
  );
}

export default Toggle;
