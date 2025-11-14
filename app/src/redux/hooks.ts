import { useDispatch, useSelector } from 'react-redux';
import type { TypeAppDispatch, TypeRootReduxState } from './store';

export const useAppDispatch = useDispatch.withTypes<TypeAppDispatch>();
export const useAppSelector = useSelector.withTypes<TypeRootReduxState>();
