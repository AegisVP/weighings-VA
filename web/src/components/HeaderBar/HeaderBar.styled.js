import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderBarSection = styled.header`
  width: 100%;

  font-size: 16px;
  font-weight: 500;

  background-color: #eeeeee;
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
  padding: 10px 20px 0;
`;

export const NavWrapper = styled.nav`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

export const NavLinkStyled = styled(NavLink)`
  display: inline-block;
  padding: 10px 20px 10px;
  margin: 0 5px;

  background-color: #ffffcc;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;

  text-decoration: none;

  &.active {
    background-color: #ffffee;
    padding-bottom: 15px;
    box-shadow: 0 -2px 3px 1px rgba(0, 0, 0, 0.1);
  }
`;

export const AuthLinks = styled.aside`
  align-self: center;
  padding: 5px 10px;
  font-size: 16px;
`;
