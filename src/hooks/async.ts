import React from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface State<TData, TError> {
  status: Status;
  data: TData | undefined;
  error: TError | undefined;
}

/**
 * Custom hook used to manage all the logic related to an async function.
 *
 * It allows to know the state of execution, provides the resolved value of the
 * async function used and also catches any error automatically that might
 * happen during execution.
 */
export default function useAsync<TData = unknown, TError = Error>(
  initialState: Partial<State<TData, TError>> = {}
): {
  status: Status;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: TData | undefined;
  error: TError | undefined;
  run: (promise: Promise<TData>) => Promise<void>;
} {
  const initialStateRef = React.useRef<State<TData, TError>>({
    ...{
      status: 'idle',
      data: undefined,
      error: undefined,
    },
    ...initialState,
  });

  const [{ data, error, status }, dispatch] = React.useReducer(
    (
      state: State<TData, TError>,
      newState: Partial<State<TData, TError>>
    ): State<TData, TError> => ({
      ...state,
      ...newState,
    }),
    initialStateRef.current
  );

  const run = React.useCallback(
    (promise: Promise<TData>) => {
      dispatch({ status: 'loading', data: undefined, error: undefined });
      return promise
        .then((data: TData) =>
          dispatch({ status: 'success', data, error: undefined })
        )
        .catch((error: TError) =>
          dispatch({ status: 'error', error, data: undefined })
        );
    },
    [dispatch]
  );

  return {
    status,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    data,
    error,
    run,
  };
}
