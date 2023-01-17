import { initialAuthState } from './userSlice';

export const handleLoginUser = (state, action) => ({ ...state, ...action.payload });

export const handleRegisterUser = (state, action) => ({ ...state, ...action.payload });

export const handleLogoutUser = state => (state = initialAuthState);

export const handleRefreshUser = (_, action) => action.payload;
