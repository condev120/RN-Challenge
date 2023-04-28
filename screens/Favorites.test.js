import React from 'react';
// import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Favorites from './Favorites';

test('renders correctly', () => {
    const { toJSON } = render(<Favorites />);
    expect(toJSON()).toMatchSnapshot();
});

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('Favorites', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(<Favorites />);
        const component = getByTestId('Favorites');
        expect(component).toBeDefined();
    });
});