export const selectUserAuth = store => {
  const { name, email, token } = store.user;
  return { name, email, token };
};

export const selectUserToken = store => store.user.token;

export const selectUserParams = store => store.user.params;

export const selectIsLoadingUser = store => store.user.isLoading;

export const selectErrorUser = store => store.user.error;

export const selectUserIsLoggedIn = store => {
  const { email, token } = selectUserAuth(store);
  return !!token && !!email;
};

export const selectUserIsRefreshing = store => {
  const { name, token } = selectUserAuth(store);
  return !!token && !name;
};
