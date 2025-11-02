import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import type { TypeApiError } from '../types';
import type { TypeUserReduxState } from './userSlice';
import type { TypeUserLoginAction, TypeUserRefreshAction, TypeUserRegisterAction } from '../../schema/userSchema';

type HandleLoginUserDef = CaseReducer<TypeUserReduxState, PayloadAction<TypeUserLoginAction>>;
type HandleRegisterUserDef = CaseReducer<TypeUserReduxState, PayloadAction<TypeUserRegisterAction>>;
type HandleRefreshUserDef = CaseReducer<TypeUserReduxState, PayloadAction<TypeUserRefreshAction>>;
type HandleRejectedDef = CaseReducer<TypeUserReduxState, PayloadAction<TypeApiError>>;

export const handleLoginUser: HandleLoginUserDef = (state, { payload }) => ({ ...state, ...payload });

export const handleRegisterUser: HandleRegisterUserDef = (state, { payload }) => ({ ...state, ...payload });

export const handleRefreshUser: HandleRefreshUserDef = (state, { payload }) => ({ ...state, ...payload });

export const handlePending: CaseReducer<TypeUserReduxState> = (state) => ({ ...state, isLoading: true, error: undefined });

export const handleFulfill: CaseReducer<TypeUserReduxState> = (state) => ({ ...state, isLoading: false, error: undefined });

export const handleReject: HandleRejectedDef = (state, { payload }) => ({ ...state, isLoading: false, error: payload });
