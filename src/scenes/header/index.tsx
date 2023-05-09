import { useState } from 'react';
import { ColorType, getColor } from '../../themes/';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Icon_Tune from '../../assets/tune.svg';
import Icon_Piano from '../../assets/piano.svg';
import Icon_Help from '../../assets/help-circle-outline.svg';
import { PageInfo } from '../main';
import Selections from './selections';

const ScHeader = styled.div`
  position:absolute;
  z-index:1;
  top:0;
  padding-left:1rem;
  transition: top .5s ease-in-out;
  cursor:pointer;
  padding: .5rem;

  width: 100%;
  height:15rem;

  color:${getColor('white')};
  
  &.collapsed{
    top:-14.75rem;
    transition: top .5s ease-in-out;
  }
`;

const ScHeaderBg = styled.div`
  position:absolute;
  z-index:-1;
  left:0;
  right:0;
  top:0;
  bottom:0;
  background-color: ${getColor('blue')};
  box-shadow: .25rem .25rem .75rem .25rem ${getColor('black')};
`

const ScShadowFixer = styled.div`
  position:absolute;
  z-index:-1;
  width: 10rem;
  height:1rem;
  bottom:100%;
  left: -2rem;
  background-color: ${getColor('blue')};
  pointer-events:none;
`

const ScTuneIcon = styled.div`
  width:100%;
  height:100%;

  background-color: ${getColor('black')};
  -webkit-mask: url(${Icon_Tune}) no-repeat center;
  mask: url(${Icon_Tune}) no-repeat center;
  mask-size: 100%;
`

const ScHeaderTab = styled.div`
  position:absolute;
  z-index:1;
  width:6rem;
  height:5rem;
  right:2rem;
  top:100%;

  border-radius: 0 0 1rem 1rem;
  background-color: ${getColor('blue')};
  box-shadow: .25rem .25rem .75rem .25rem ${getColor('black')};

  &:hover{
    ${ScTuneIcon}{
      background-color: ${getColor('white')};
    }
  }

  padding: 1.25rem;
`

type IconProps = {
  iconId: string,
  color: ColorType
}
const ScIcon = styled.div<IconProps>`
  display:inline-block;
  width:3rem;
  height:3rem;

  background-color: ${p => getColor(p.color)};
  -webkit-mask: url(${p => getIcon(p.iconId)}) no-repeat center;
  mask: url(${p => getIcon(p.iconId)}) no-repeat center;
  mask-size: 100%;
`

const ScLinks = styled.div`
  display:inline-block;
  vertical-align:top;
  width:50%;
  >h2{
    font-size:2rem;
    pointer-events:none;
    margin-left: 0.75rem;
  }
  
  >*{
    color:${getColor('black')};
    display:block;
    transition: color .5s ease-in;
    text-decoration: none;
    &:hover{
      color: ${getColor('white')};
      transition: color .2s ease-out;

      ${ScIcon}{
        background-color:${getColor('white')};
        transition: background-color .2s ease-out;
      }
    }

    >*{
      display:inline-block;

      &:first-child{
        vertical-align:middle;
        margin-top:-1.5rem;
        margin-right: 1rem;
        margin-left: .5rem;
      }
    }
  }
`

const ScHint = styled.p`
  text-align:right;
  margin-right:9rem;
  color: ${getColor('black')};
  font-style: italic;

  margin-top:0rem;
  opacity: 0;
  transition: all .3s ease-in;

  .collapsed &{
    margin-top:2rem;
    opacity: 1;
    transition: all .3s ease-out;
  }
`

const getIcon = (id: string) => {
  switch(id){
    case 'piano': return Icon_Piano;
    case 'help': return Icon_Help;
  }
}

type Props = {
  pages: PageInfo[]
}

function Header({ pages }: Props) {
  const [ collapsed, setCollapsed ] = useState(true);

  return (
    <ScHeader className={ collapsed ? 'collapsed' : ''} >
      <ScLinks>
        <h2>{'Altered Chromatic'}</h2>
        {pages.map((p, i) => (
          <Link key={i} to={p.route} onClick={() => setCollapsed(!collapsed)}>
            {p.icon && <ScIcon iconId={p.icon} color='black' />}
            <h3>{p.text}</h3>
          </Link>
        ))}
      </ScLinks>
      <Selections />
      <ScHeaderTab onClick={() => setCollapsed(!collapsed)}>
        <ScTuneIcon />
        <ScShadowFixer />
      </ScHeaderTab>
      <ScHeaderBg/>
      {/* <ScHint>{'learn scales, switch to a regular piano, and more!'}</ScHint> */}
    </ScHeader>
  );
}

export default Header;
