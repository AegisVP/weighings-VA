import { Box, Button, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from '../components/Loader/Loader';
import { logoutUser } from '../redux/user/userOperations';
import { selectUserIsLoading } from '../redux/user/userSelectors';

import type { TypeAppDispatch } from '../redux/store';

export const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<TypeAppDispatch>();
  const isLoading = useSelector(selectUserIsLoading);

  const onSubmit = async (): Promise<void> => {
    await dispatch(logoutUser());
  };

  return (
    <Box width="100%" height="calc(100vh - 165px)" display="flex" alignItems="center" justifyContent="center">
      <Card
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: 400,
        }}
      >
        <Typography>Дійсно вийти?</Typography>

        <Button variant="contained" color="primary" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <Loader size="24px" /> : 'Вийти'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
          {'Повернутись на головну'}
        </Button>
      </Card>
    </Box>
  );
};
