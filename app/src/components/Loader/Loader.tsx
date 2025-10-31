import { CircularProgress } from '@mui/material';
import type { CircularProgressProps } from '@mui/material';

type LoaderProps = CircularProgressProps;
export const Loader = ({ size, color, ...props }: LoaderProps) => {
  return <CircularProgress {...props} color={color} size={size} />;
};
