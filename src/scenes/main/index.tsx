import { useState } from 'react';
import { Keyboard } from '../../scenes/keyboard';
import { About } from '../../scenes/about';
import { getColor } from '../../themes/';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import styled from 'styled-components';

export const GroupContainer = styled.div`
  background-color: ${getColor('blue')};
  border: 1rem solid ${getColor('white')};
  border-radius: 5rem;
  margin: 3rem;
  padding: 2rem 3.3rem;
`;

export const ScHeader = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition: top .5s ease-in-out;

  width: 100%;
  height:10rem;
  border-bottom:.5rem solid ${getColor('blue')};
  color:white;
  z-index:1;
  background-color:black;

  &.collapsed{
    top:-8rem;
    transition: top .5s ease-in-out;
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

export const ScStage = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  padding-top:5rem;
  z-index:-1;
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
      </ScHeader>
      <ScStage>
        <Routes>
          {pages.map((p, i) => (
            <Route key={i} path={p.route} element={p.element} />
          ))}
        </Routes>
      </ScStage>
    </HashRouter>
  );
}

export default Main;
