import React from 'react';
// import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Settings from './Settings';

test('renders correctly', () => {
    const { toJSON } = render(<Settings />);
    expect(toJSON()).toMatchSnapshot();
});

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('Settings', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(<Settings />);
        const component = getByTestId('Settings');
        expect(component).toBeDefined();
    });
});