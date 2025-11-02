import type { TypeRootReduxState } from '../store';

export const selectUserInfo = (store: TypeRootReduxState) => store.auth.user;

export const selectUserToken = (store: TypeRootReduxState) => store.auth.token;

export const selectUserError = (store: TypeRootReduxState) => store.auth.error;

export const selectUserIsLoading = (store: TypeRootReduxState) => store.auth.isLoading;

export const selectUserFeatures = (store: TypeRootReduxState) => store.auth.user?.features || [];

export const selectUserIsLoggedIn = (store: TypeRootReduxState) => {
  const { username } = selectUserInfo(store);
  const token = selectUserToken(store);
  return !!token && !!username;
};

export const selectUserIsRefreshing = (store: TypeRootReduxState) => {
  const { name } = selectUserInfo(store);
  const token = selectUserToken(store);
  return !!token && !name;
};
