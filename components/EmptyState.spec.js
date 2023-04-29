import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import EmptyState from './EmptyState';

let rendered;
let mockAction = jest.fn();
describe('EmptyState - Coverage', () => {
  beforeEach(async () => {
    await waitFor(async () => {
      rendered = render(<EmptyState image={require('../assets/empty-discover.jpg')}
      title="No results found"
      message="Try adjusting the settings"
      actionLabel="Go to Settings"
      onAction={() => mockAction()}/>);
    });
  });

  it('Renders correctly', async () => {
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByText('No results found')).toBeDefined();
    expect(rendered.getByText('Try adjusting the settings')).toBeDefined();
    expect(rendered.getByText('Go to Settings')).toBeDefined();
  });

  it('Button should be triggered correctly', () => {
    const button = rendered.getByText('Go to Settings');
    fireEvent.press(button);
    expect(mockAction).toBeCalledTimes(1);
  });
});
