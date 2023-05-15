import { ReactElement } from "react";
import { Keyboard } from "../../scenes/keyboard";
import { About } from "../../scenes/about";
import { getColor } from "../../themes/";
import { HashRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Header from "../header";

const ScStage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;

export type PageInfo = {
  route: string;
  text: string;
  element?: ReactElement;
  icon?: string;
};

function Main() {
  const pages: PageInfo[] = [
    {
      route: "/",
      text: "Keyboard",
      icon: "piano",
      element: <Keyboard />,
    },
    {
      route: "/about",
      text: "About",
      icon: "help",
      element: <About />,
    },
  ];

  return (
    <HashRouter>
      <Header pages={pages} />
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
