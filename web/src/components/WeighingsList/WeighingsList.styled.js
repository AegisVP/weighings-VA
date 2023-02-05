import styled from 'styled-components';

export const StyledTable = styled.table`
  min-width: 1200px;
  margin: 12px auto 0;
  /* border: ${p => p.theme.border.listTable}; */
`;

export const StyledTableHeaderSection = styled.thead`
  border: ${p => p.theme.border.listTableSection};
`;

export const StyledTableEntrySection = styled.tbody`
  border: ${p => p.theme.border.listTableSection};
`;

export const StyledTableListSection = styled.tfoot`
  border: ${p => p.theme.border.listTableSection};
`;

export const StyledTableRow = styled.tr`
  /* border: ${p => p.theme.border.listTable}; */
  min-height: 30px;
`;

export const StyledTableCell = styled.td`
  border: ${p => p.theme.border.listTable};
  padding: 2px 10px 1px;
`;

export const StyledTableHeaderCell = styled.th`
  border: ${p => p.theme.border.listTable};
  padding: 2px 10px;
  font-weight: bold;
  text-align: center;
`;

export const StyledTableSpannedErrorCell = styled(StyledTableCell)`
  padding: 20px;
  padding-left: 50px;
  font-size: 24px;
`;

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
