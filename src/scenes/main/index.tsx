import { useState } from 'react';
import { Keyboard } from '../../scenes/keyboard';
import { About } from '../../scenes/about';
import { getColor, mixin_glowOnHover } from '../../themes/';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import GithubLogo from './github-mark.svg';

const ScHeader = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition: top .5s ease-in-out;
  cursor:pointer;

  width: 100%;
  height:10rem;
  border-bottom:.5rem solid ${getColor('blue')};
  color:white;
  z-index:1;
  background-color:black;

  &.collapsed{
    top:-8rem;
    transition: top .5s ease-in-out;
      
    &:hover{
      background-color: ${getColor('grey')};
    }
  }

  >.link-button{
    color:white;
    display:inline-block;
    vertical-align:middle;
    margin:1.4rem 1.8rem;
    transition: color .5s ease-in;
    &:hover{
      color: ${getColor('yellow')};
      transition: color .2s ease-out;
    }
  }
`;

const ScStage = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  padding-top:5rem;
  z-index:-1;
`

const ScCopyright = styled.a`
  position:absolute;
  right:1rem;
  bottom:.5rem;
  color: ${getColor('green')};
  font-size:2rem;

  font-size:2rem;
  color: ${getColor('blue')};
  &:visited{
    color: ${getColor('blue')};
  }
  
  ${mixin_glowOnHover('blue')}
`

const ScGithub = styled.button`
  position: absolute;
  width: 5rem;
  right: 1rem;
  top:50%;
  transform:translateY(-50%);
  background:0;
  border:0;

  cursor:pointer;

  ${mixin_glowOnHover('green')}
`


function Main() {
  const [ collapsed, setCollapsed ] = useState(true);
  const pages = [
    {
      route: '/',
      text: 'Keyboard',
      element: <Keyboard/>
    },
    {
      route: '/about',
      text: 'About',
      element: <About/>
    }
  ]
  
  return (
    <HashRouter>
      <ScHeader className={ collapsed ? 'collapsed' : ''} onClick={() => setCollapsed(!collapsed)}>
        {pages.map((p, i) => (
          <Link key={i} to={p.route} className="link-button">
            <h2>{p.text}</h2>
          </Link>
        ))}
        <ScGithub>
          <img src={GithubLogo} />
        </ScGithub>
      </ScHeader>
      <ScStage>
        <Routes>
          {pages.map((p, i) => (
            <Route key={i} path={p.route} element={p.element} />
          ))}
        </Routes>
        <ScCopyright href="http://thomasyancey.com" target="_blank">{'©Tom Yancey, 2022'}</ScCopyright>
      </ScStage>
    </HashRouter>
  );
}

export default Main;
