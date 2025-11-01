import { useDispatch, useSelector } from 'react-redux';
import type { TypeAppDispatch, TypeRootReduxState } from '../redux/store';
import { useEffect } from 'react';
import type { RESOURCE_CONFIGS } from '../resources/resources';

export const useResource = <T extends (typeof RESOURCE_CONFIGS)[number]>(config: T) => {
  const dispatch = useDispatch<TypeAppDispatch>();
  const state = useSelector((s: TypeRootReduxState) => config.selector(s));

  useEffect(() => {
    config.actions.load(dispatch)();
  }, [dispatch, config]);

  return {
    items: state.items as Infer<T['schemaType']>[],
    isLoading: state.isLoading,
    error: state.error,
    count: state.count,
    // onAdd: (item: Infer<T['schemaType']>) => config.actions.add(dispatch)(item),
    // onUpdate: (item: Infer<T['schemaType']>) => config.actions.add(dispatch)(item),
    // onDelete: (id: string) => config.actions.add(dispatch)(id),
  };
};

type Infer<T> = T extends null ? never : T;
