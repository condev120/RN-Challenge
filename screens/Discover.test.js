import React from 'react';
// import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Discover from './Discover';

test('renders correctly', () => {
    const { toJSON } = render(<Discover />);
    expect(toJSON()).toMatchSnapshot();
});

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

describe('Discover', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(<Discover />);
        const component = getByTestId('Discover');
        expect(component).toBeDefined();
    });
});