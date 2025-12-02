import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';

import { constants } from '../../constants/constants';
import { useAppSelector } from '../../redux/hooks';
import { selectUserLocale } from '../../redux/user/userSelectors';

import type { TypeWeighingSchema } from '../../redux/types';

type SortOrder = 'asc' | 'desc';
type SortField = keyof TypeWeighingSchema | 'none';

type WeighingTableProps = {
  weighings: TypeWeighingSchema[];
  getLocationName: (id: string) => string;
  getOperatorName: (id: string) => string;
  getMachineDescription: (id: string) => string;
  showCrop?: boolean;
  getCropName?: (id: string) => string;
};

export const WeighingTable = ({
  weighings,
  getLocationName,
  getOperatorName,
  getMachineDescription,
  showCrop = false,
  getCropName,
}: WeighingTableProps) => {
  const locale = useAppSelector(selectUserLocale);
  const { formatMessage } = useIntl();
  const [sortField, setSortField] = useState<SortField>('dateTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedWeighings = useMemo(() => {
    const result = [...weighings];

    if (sortField !== 'none') {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (sortField === 'dateTime') {
          const aTime = new Date(aVal as string).getTime();
          const bTime = new Date(bVal as string).getTime();
          return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [weighings, sortField, sortOrder]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(constants.localeLang[locale], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === 'dateTime'}
                direction={sortField === 'dateTime' ? sortOrder : 'asc'}
                onClick={() => handleSort('dateTime')}
              >
                {formatMessage({ id: 'weighing_entry.table.headers.date' })}
              </TableSortLabel>
            </TableCell>
            {showCrop && getCropName && (
              <TableCell>
                <TableSortLabel
                  active={sortField === 'crop'}
                  direction={sortField === 'crop' ? sortOrder : 'asc'}
                  onClick={() => handleSort('crop')}
                >
                  {formatMessage({ id: 'weighing_entry.table.headers.crop' })}
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>
              <TableSortLabel
                active={sortField === 'sourceLocation'}
                direction={sortField === 'sourceLocation' ? sortOrder : 'asc'}
                onClick={() => handleSort('sourceLocation')}
              >
                {formatMessage({ id: 'weighing_entry.table.headers.source' })}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'destinationLocation'}
                direction={sortField === 'destinationLocation' ? sortOrder : 'asc'}
                onClick={() => handleSort('destinationLocation')}
              >
                {formatMessage({ id: 'weighing_entry.table.headers.destination' })}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'deliveryOperator'}
                direction={sortField === 'deliveryOperator' ? sortOrder : 'asc'}
                onClick={() => handleSort('deliveryOperator')}
              >
                {formatMessage({ id: 'weighing_entry.table.headers.driver' })}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'harvesterOperator'}
                direction={sortField === 'harvesterOperator' ? sortOrder : 'asc'}
                onClick={() => handleSort('harvesterOperator')}
              >
                {formatMessage({ id: 'weighing_entry.table.headers.harvester' })}
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'weightNetto'}
                direction={sortField === 'weightNetto' ? sortOrder : 'asc'}
                onClick={() => handleSort('weightNetto')}
              >
                {formatMessage({ id: 'weighing_entry.table.headers.weight' })}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedWeighings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showCrop ? 7 : 6} align="center">
                <Typography color="text.secondary">Немає даних</Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedWeighings.map((weighing, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{formatDate(weighing.dateTime)}</TableCell>
                {showCrop && getCropName && <TableCell>{getCropName(weighing.crop)}</TableCell>}
                <TableCell>{getLocationName(weighing.sourceLocation)}</TableCell>
                <TableCell>{getLocationName(weighing.destinationLocation)}</TableCell>
                <TableCell>{`${getOperatorName(weighing.deliveryOperator)} (${getMachineDescription(
                  weighing.deliveryMachine
                )})`}</TableCell>
                <TableCell>{`${getOperatorName(weighing.harvesterOperator)} (${getMachineDescription(
                  weighing.harvesterMachine
                )})`}</TableCell>
                <TableCell align="right">{weighing.weightNetto.toLocaleString(constants.localeLang[locale])}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
