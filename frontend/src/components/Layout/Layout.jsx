import React from "react";
import styled from "@emotion/styled";
import { COLORS, QUERIES } from "utils";
import { ReactComponent as UnstyledUmaLogo } from "assets/Across-Powered-UMA.svg";
import { ReactComponent as SupportLogo } from "assets/support-logo.svg";
import { ReactComponent as GithubLogo } from "assets/github-logo.svg";
import { ReactComponent as DocsLogo } from "assets/docs-logo.svg";

const NAV_LINKS = [
  {
    name: "Docs",
    url: "https://docs.across.to/bridge/",
    icon: DocsLogo,
  },
  {
    name: "Support",
    url: "https://discord.gg/across",
    icon: SupportLogo,
  },
  {
    name: "Github",
    url: "https://github.com/across-protocol",
    icon: GithubLogo,
  },
];

const Layout = ({ children }) => (
  <div className="relative block py-0 px-2.5 sm:px-[30px] min-h-100% h-fit mt-16">
    <main
      className="min-h-full grid-cols-2 bg-[#ffd091] w-[450px] m-auto rounded-2xl"
      style={{ boxShadow: "0 0 120px hsl(41.97deg 52.05% 32.72% / 49%)" }}
    >
      {children}
    </main>
    <div
      className="flex flex-row justify-between items-center fixed bottom-0"
      style={{ left: "calc(50% - 100px)" }}
    >
      <LinkFooter className="block">
        {/* {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <link.icon />
            <LinkText>{link.name}</LinkText>
          </Link>
        ))} */}
        <div className="flex flex-row">
          <a href="#" className="mr-12 text-[#ef4444]">
            <svg
              class="h-8 w-8 text-red-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.009z" />
            </svg>
          </a>
          <a href="#" className="mr-12 text-[#ef4444]">
            <svg
              class="h-8 w-8 text-red-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
            </svg>
          </a>
          <a href="#" className="text-[#ef4444]">
            <svg
              class="h-8 w-8 text-red-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M9 19c-4.286 1.35-4.286-2.55-6-3m12 5v-3.5c0-1 .099-1.405-.5-2 2.791-.3 5.5-1.366 5.5-6.04a4.567 4.567 0 0 0 -1.333 -3.21 4.192 4.192 0 00-.08-3.227s-1.05-.3-3.476 1.267a12.334 12.334 0 0 0 -6.222 0C6.462 2.723 5.413 3.023 5.413 3.023a4.192 4.192 0 0 0 -.08 3.227A4.566 4.566 0 004 9.486c0 4.64 2.709 5.68 5.5 6.014-.591.589-.56 1.183-.5 2V21" />
            </svg>
          </a>
        </div>
        <div className="text-center mt-4 text-[#ef4444]">Terms In Use</div>
      </LinkFooter>
    </div>
  </div>
);

export default Layout;

const BaseFooter = styled.footer`
  position: sticky;
  bottom: 0;
  padding: 0 15px 15px;
  align-self: self-end;
  justify-self: center;
  @media ${QUERIES.laptopAndUp} {
    justify-self: start;
  }
`;

const LinkFooter = styled(BaseFooter)`
  display: none;
  align-items: center;
  margin: auto;
  & svg {
    width: 25px;
    height: 25px;
  }
  @media ${QUERIES.laptopAndUp} {
    display: block;
  }
`;

const LogoFooter = styled(BaseFooter)`
  position: relative;
  right: 10px;
  @media ${QUERIES.tabletAndUp} {
    position: relative;
  }
`;

const Link = styled.a`
  text-decoration: none;
  transition: color 100ms linear;
  color: hsla(${COLORS.white} / 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: ${14 / 16}rem;
  opacity: 0.75;

  &:not(:last-of-type) {
    margin-right: 45px;
  }

  &:hover {
    color: var(--color-white);
    opacity: 1;
  }
`;

const AccentLink = styled(Link)`
  &:hover {
    color: var(--color-uma-red);
  }
`;

const PoweredByUMA = styled(UnstyledUmaLogo)`
  fill: currentColor;
  transition: fill linear 100ms;
  & path {
    fill: currentColor;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: block;
  padding: 0 10px;
  min-height: 100%;
  height: fit-content;
  @media ${QUERIES.tabletAndUp} {
    padding: 0 30px;
  }
`;

const Main = styled.main`
  min-height: 100%;
  grid-column: 2;
  background: #ffd091;
  box-shadow: 0 0 120px hsla(${COLORS.primary[500]} / 0.25);
  clip-path: inset(0px -160px 0px -160px);
`;

const LinkText = styled.div`
  color: #ffffff;
`;
