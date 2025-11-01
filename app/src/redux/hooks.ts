import { useDispatch, useSelector } from 'react-redux';
import type { TypeAppDispatch, TypeRootReduxState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<TypeAppDispatch>();
export const useAppSelector = useSelector.withTypes<TypeRootReduxState>();
