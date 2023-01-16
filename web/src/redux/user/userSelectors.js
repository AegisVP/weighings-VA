export const selectUserAuth = store => {
  const { name, email, subscription } = store.user;
  return { name, email, subscription };
};

export const selectUserToken = store => store.user.token;

export const selectUserError = store => store.user.error;

export const selectUserIsLoading = store => store.user.isLoading;

export const selectUserIsLoggedIn = store => {
  const { email } = selectUserAuth(store);
  const token = selectUserToken(store);
  return !!token && !!email;
};

export const selectUserIsRefreshing = store => {
  const { name } = selectUserAuth(store);
  const token = selectUserToken(store);
  return !!token && !name;
};
