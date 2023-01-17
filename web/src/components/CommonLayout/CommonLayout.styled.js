import styled from 'styled-components';

export const MainBodyWrapper = styled.main`
  width: 100%;
  min-width: 320px;
  max-width: 1240px;
  height: 100vh;

  margin: ${p => p.theme.mp(0, 'auto', 0, 'auto')};
  padding: 10px 20px 20px;

  /* @media screen and (min-width: 768px) {
    max-width: 768px;
  }

  @media screen and (min-width: 1280px) {
    max-width: 1280px;
  } */
`;
