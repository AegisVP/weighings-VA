export const selectUserInfo = store => {
  const { name, email, subscription } = store.auth.user;
  return { name, email, subscription };
};

export const selectUserToken = store => store.auth.token;

export const selectUserError = store => store.auth.error;

export const selectUserIsLoading = store => store.auth.isLoading;

export const selectUserIsLoggedIn = store => {
  const { email } = selectUserInfo(store);
  const token = selectUserToken(store);
  return !!token && !!email;
};

export const selectUserIsRefreshing = store => {
  const { name } = selectUserInfo(store);
  const token = selectUserToken(store);
  return !!token && !name;
};
