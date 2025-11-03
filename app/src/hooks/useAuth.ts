import { useAppSelector } from '../redux/hooks';
import {
  selectUserError,
  selectUserInfo,
  selectUserIsLoggedIn,
  selectUserIsRefreshing,
} from '../redux/user/userSelectors';

export const useAuth = () => {
  const user = useAppSelector(selectUserInfo);
  const error = useAppSelector(selectUserError);
  const isRefreshing = useAppSelector(selectUserIsRefreshing);
  const isLoggedIn = useAppSelector(selectUserIsLoggedIn);

  return {
    isLoggedIn,
    isRefreshing,
    error,
    user,
  };
};
