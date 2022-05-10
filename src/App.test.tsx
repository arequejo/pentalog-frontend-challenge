import { screen } from '@testing-library/react';
import { setup } from './test/utils';
import App from './App';

describe('<App />', () => {
  test('renders', () => {
    setup(<App />);
    expect(screen.getByText('Hello, world.')).toBeInTheDocument();
  });
});
