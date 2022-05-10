import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup({ delay: null }),
    ...render(jsx),
  };
}
