import React from 'react';
import { View } from 'react-native';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { render, waitFor } from '@testing-library/react-native';
import { mockMovies } from '../services/mock.service';
import { MovieList } from './MovieList';

let rendered;
jest.mock('react-native-ratings', () => ({
  AirbnbRating: jest.fn()
}))
jest.mock('react-native-vector-icons/Ionicons', () => jest.fn());
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
const movies = mockMovies.results;
describe('MovieList - Coverage', () => {
  const mockProps = {
    movies,
    full: true
  };
  beforeEach(async () => {
    await waitFor(async () => {
      rendered = render(<MovieList {...mockProps}/>);
    });
  });

  it('Renders correctly', async () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('Render movie list correctly', () => {
    expect(rendered.getByTestId('MovieList')).toBeDefined();
    expect(rendered.getByTestId('MovieList').props.data).toHaveLength(4);
  });
});
