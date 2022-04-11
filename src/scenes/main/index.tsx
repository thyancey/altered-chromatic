import { ReactElement } from 'react';
import { Keyboard } from '../../scenes/keyboard';
import { About } from '../../scenes/about';
import { getColor, mixin_glowOnHover } from '../../themes/';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Header from '../header';

const ScStage = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  z-index:-1;
`

const ScCopyright = styled.a`
  position:absolute;
  right:1rem;
  bottom:.5rem;
  font-size:2rem;
  font-weight:bold;
  color: ${getColor('black')};
  text-decoration: none;


  &:visited{
    color: ${getColor('black')};
  }

  transition: color .2s;
  &:hover{
    transition: color .2s;
    color: ${getColor('blue')};
  }
`
const ScGithub = styled.a`
  position:absolute;
  left:1rem;
  bottom:.5rem;
  font-size:2rem;
  font-weight:bold;
  color: ${getColor('black')};
  text-decoration: none;


  &:visited{
    color: ${getColor('black')};
  }

  transition: color .2s;
  &:hover{
    transition: color .2s;
    color: ${getColor('blue')};
  }
`

export type PageInfo = {
  route: string,
  text: string,
  element?: ReactElement,
  icon?: string
}

function Main() {
  const pages: PageInfo[] = [    
    {
      route: '/',
      text: 'Keyboard',
      icon: 'piano',
      element: <Keyboard/>
    },
    {
      route: '/about',
      text: 'About',
      icon: 'help',
      element: <About/>
    }
  ]
  
  return (
    <HashRouter>
      <Header pages={pages} />
      <ScStage>
        <Routes>
          {pages.map((p, i) => (
            <Route key={i} path={p.route} element={p.element} />
          ))}
        </Routes>
        <ScCopyright href="http://thomasyancey.com" target="_blank">{'©Tom Yancey, 2022'}</ScCopyright>
        <ScGithub href="https://github.com/thyancey/altered-chromatic" target="_blank">{'github'}</ScGithub>
      </ScStage>
    </HashRouter>
  );
}

export default Main;
