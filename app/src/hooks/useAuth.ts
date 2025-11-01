import { useSelector } from 'react-redux';
// import { RootState } from '../store';
import {
  selectUserError,
  selectUserInfo,
  selectUserIsLoggedIn,
  selectUserIsRefreshing,
} from '../redux/user/userSelectors';

export const useAuth = () => {
  const user = useSelector(selectUserInfo);
  const error = useSelector(selectUserError);
  const isRefreshing = useSelector(selectUserIsRefreshing);
  const isLoggedIn = useSelector(selectUserIsLoggedIn);

  return {
    isLoggedIn,
    isRefreshing,
    error,
    user,
  };
};
