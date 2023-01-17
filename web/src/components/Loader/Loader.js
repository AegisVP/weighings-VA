import styled from 'styled-components';

export const Loader = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  max-width: 64px;
  max-height: 64px;
  width: 100%;
  height: 100%;

  border: 8px solid;
  border-color: #3d5af1 transparent #3d5af1 transparent;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
`;
