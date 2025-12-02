import { useNavigate } from 'react-router';
import { useIntl } from 'react-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';

import { Loader } from '../components/Loader/Loader';
import { LanguageSelector } from '../components/LanguageSelector/LanguageSelector';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser } from '../redux/user/userOperations';
import { selectUserError, selectUserIsLoading } from '../redux/user/userSelectors';
import { userLoginRequestSchema } from '../schema/userSchema';

import type { TypeUserLoginRequestBody } from '../schema/userSchema';

export const LoginPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const defaultValues = { username: '', password: '' };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeUserLoginRequestBody>({
    resolver: zodResolver(userLoginRequestSchema),
    defaultValues,
  });

  const isLoading = useAppSelector(selectUserIsLoading);
  const error = useAppSelector(selectUserError);

  const onSubmit = async (data: TypeUserLoginRequestBody): Promise<void> => {
    const username = data.username.trim();
    const password = data.password.trim();
    await dispatch(loginUser({ username, password }));
  };

  const onRegisterClick = (): void => {
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
              label={formatMessage({ id: 'auth_page.username' })}
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
              label={formatMessage({ id: 'auth_page.password' })}
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
          {isLoading ? <Loader size="24px" /> : formatMessage({ id: 'auth_page.login' })}
        </Button>
        <Box display="flex" justifyContent="space-between" flexWrap="nowrap" gap={2}>
          <Button variant="outlined" color="secondary" onClick={onRegisterClick} sx={{ width: '100%' }}>
            {formatMessage({ id: 'auth_page.dont_have_account' })}
          </Button>
          <LanguageSelector color="primary" />
        </Box>
      </Card>
    </Box>
  );
};
