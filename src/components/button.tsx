import { MouseEventHandler } from 'react';
import styled from 'styled-components';

export const ScButton = styled.div`
  padding: 2rem;
`;

interface LBType {
  onClick: MouseEventHandler,
  text: string
}

export function Button({ onClick, text }: LBType) {
  return (
    <ScButton onClick={onClick}><span>{text}</span></ScButton>
  )
}
