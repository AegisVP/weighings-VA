import styled from 'styled-components';

export const MainBodyWrapper = styled.main`
  width: 100%;
  min-width: 320px;
  max-width: 1240px;
  height: 100vh;

  margin: ${p => p.theme.mp(0, 'auto', 0, 'auto')};
  padding: ${p => p.theme.mp(2, 3, 3)};
`;
