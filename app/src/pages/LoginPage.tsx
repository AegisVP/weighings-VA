import { Alert, Box, Button, Card, TextField } from '@mui/material';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader } from '../components/Loader/Loader';
import { loginUser } from '../redux/user/userOperations';
import { selectUserError, selectUserIsLoading } from '../redux/user/userSelectors';
import { userLoginRequestSchema } from '../schema/userSchema';
import { resetError } from '../redux/user/userSlice';

import type { TypeAppDispatch } from '../redux/store';
import type { TypeUserLoginRequestBody } from '../schema/userSchema';

export const LoginPage = () => {
  const defaultValues = { username: '', password: '' };
  const navigate = useNavigate();
  const dispatch = useDispatch<TypeAppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeUserLoginRequestBody>({
    resolver: zodResolver(userLoginRequestSchema),
    defaultValues,
  });

  const isLoading = useSelector(selectUserIsLoading);
  const error = useSelector(selectUserError);

  const onSubmit = async (data: TypeUserLoginRequestBody): Promise<void> => {
    const username = data.username.trim();
    const password = data.password.trim();
    await dispatch(loginUser({ username, password }));
  };

  const onRegisterClick = (): void => {
    dispatch(resetError());
    navigate('/register');
  };

  return (
    <Box width="100vw" height="100vh" display="flex" alignItems="center" justifyContent="center">
      <Card
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: 400,
        }}
      >
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Логін"
              error={!!errors.username}
              helperText={errors.username?.message}
              autoComplete="username"
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Пароль"
              type="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />
          )}
        />

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
          {isLoading ? <Loader size="24px" /> : 'Увійти'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onRegisterClick}>
          {'Створити обліковий запис'}
        </Button>
      </Card>
    </Box>
  );
};
