import CircularProgress from '@mui/material/CircularProgress';
import type { CircularProgressProps } from '@mui/material/CircularProgress';

type LoaderProps = CircularProgressProps;
export const Loader = ({ size, color, ...props }: LoaderProps) => {
  return <CircularProgress {...props} color={color} size={size} />;
};
