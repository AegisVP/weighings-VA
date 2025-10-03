import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderBarSection = styled.header`
  width: 100%;

  font-size: ${p => p.theme.fontSizes.m};
  font-weight: 500;

  background-color: #f8f8f8;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  min-height: 60px;
  height: 100%;
  min-width: 320px;
  max-width: 1240px;

  margin: ${p => p.theme.mp(0, 'auto', 0, 'auto')};
  padding: ${p => p.theme.mp(2, 3, 0)};
`;

export const NavWrapper = styled.nav`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

export const NavLinkStyled = styled(NavLink)`
  display: inline-block;
  padding: ${p => p.theme.mp(2, 3)};
  margin: ${p => p.theme.mp(0, 1)};

  background-color: #ffffcc;
  border-top-right-radius: ${p => p.theme.radii.large};
  border-top-left-radius: ${p => p.theme.radii.large};

  text-decoration: none;
  box-shadow: inset 1px 2px 4px 1px rgba(0, 0, 0, 0.1);

  &.active {
    background-color: #ffffee;
    padding-bottom: 15px;
    box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.15);
  }
`;

export const AuthLinks = styled.aside`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  align-self: center;
  font-size: ${p => p.theme.fontSizes.m};
`;
