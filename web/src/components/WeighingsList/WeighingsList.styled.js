import styled from 'styled-components';

export const HarvestersList = styled.ul`
  display: grid;
  grid-template-columns: repeat(${p => p.count}, 1fr);

  width: 100%;

  list-style: none;
`;

export const HarvesterItem = styled.li`
  text-align: center;

  border-right: 1px solid #e5e7eb;
  &:last-child {
    border-right: unset;
  }
`;
