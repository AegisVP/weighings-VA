import styled from 'styled-components';

export const WidthWrapperLimiter = styled.div`
  width: 100%;
  min-width: 320px;
  max-width: 480px;
  height: 100vh;

  margin: ${p => p.theme.mp(0, 'auto', 0, 'auto')};

  @media screen and (min-width: 768px) {
    max-width: 768px;
  }

  @media screen and (min-width: 1280px) {
    max-width: 1280px;
  }
`;

export const HeaderBarIsLogedIn = styled.div`
  @media screen and (min-width: 1280px) {
    width: 100%;
    height: 100vh;
    background: linear-gradient(to right, white 59%, ${p => p.theme.colors.background.greyBackground} 59% 100%);
    margin-left: auto;
    margin-right: auto;
  }
`;
