import { useState } from 'react';
import { getColor } from '../../themes/';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import Icon_Github from '../../assets/github-mark.svg';
import Icon_Tune from '../../assets/tune.svg';
import { PageInfo } from '../main';
import Selections from './selections';

const ScHeader = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition: top .5s ease-in-out;
  cursor:pointer;

  width: 100%;
  height:10rem;

  color:${getColor('white')};
  

  &.collapsed{
    top:-10.25rem;
    transition: top .5s ease-in-out;
  }

  >.link-button{
    color:${getColor('black')};
    display:inline-block;
    vertical-align:middle;
    margin:1.4rem 1.8rem;
    transition: color .5s ease-in;
    text-decoration: none;
    &:hover{
      color: ${getColor('white')};
      transition: color .2s ease-out;
    }
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
  width: 12rem;
  height:1rem;
  bottom:100%;
  left: -3rem;
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

const ScGithubIcon = styled.div`
  width:100%;
  height:100%;
  cursor:pointer;

  background-color: ${getColor('black')};
`

const ScGithub = styled.a`
  position: absolute;
  width: 6rem;
  height: 6rem;
  padding: 1rem;
  right: 2rem;
  top:50%;
  transform:translateY(-50%);
  background:0;
  border:0;


  &:hover{
    ${ScGithubIcon}{
      background-color: ${getColor('white')};
    }
  }
`

type Props = {
  pages: PageInfo[]
}

function Header({ pages }: Props) {
  const [ collapsed, setCollapsed ] = useState(true);

  return (
    <ScHeader className={ collapsed ? 'collapsed' : ''} onClick={() => setCollapsed(!collapsed)}>
      {pages.map((p, i) => (
        <Link key={i} to={p.route} className="link-button">
          <h2>{p.text}</h2>
        </Link>
      ))}
      <Selections />
      <ScGithub href="https://github.com/thyancey/altered-chromatic" target="_blank" >
        <ScGithubIcon />
      </ScGithub>
      <ScHeaderTab>
        <ScTuneIcon />
        <ScShadowFixer />
      </ScHeaderTab>
      <ScHeaderBg/>
    </ScHeader>
  );
}

export default Header;
