import { ReactElement } from "react";
import { Keyboard } from "../../scenes/keyboard";
import { About } from "../../scenes/about";
import { getColor, mixin_glowOnHover } from "../../themes/";
import { HashRouter, Route, Routes, Link } from "react-router-dom";
import styled, { css } from "styled-components";
import Header from "../header";

const ScStage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;

const ScCopyright = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 0.5rem;
  text-align:right;

  a,
  span {
    font-size: 2rem;
    font-weight: bold;
    color: ${getColor("black")};
  }

  a {
    text-decoration: none;

    &:visited {
      color: ${getColor("black")};
    }

    transition: color 0.2s;
    &:hover {
      transition: color 0.2s;
      color: ${getColor("blue")};
    }
  }
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
        <ScCopyright>
          <a href="http://thomasyancey.com" target="_blank">
            {"©Tom Yancey, 2023"}
          </a>
          <br />
          <a
            href="https://github.com/thyancey/altered-chromatic"
            target="_blank"
          >
            {"code"}
          </a>
          <span> {" | "}</span>
          <a
            href="https://thyancey.github.io/altered-chromatic/"
            target="_blank"
          >
            {"alpha"}
          </a>
        </ScCopyright>
      </ScStage>
    </HashRouter>
  );
}

export default Main;
