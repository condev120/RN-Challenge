import React from 'react';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { render, waitFor } from '@testing-library/react-native';
import { MovieCard } from './MovieCard';
import { mockMovies } from '../services/mock.service';

let rendered;
jest.mock('react-native-ratings', () => ({
  AirbnbRating: jest.fn()
}))
jest.mock('react-native-vector-icons/Ionicons', () => jest.fn());
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
const movie = mockMovies.results[0];
describe('MovieCard - Coverage', () => {
  const mockProps = {
    ...movie,
    full: true
  };
  beforeEach(async () => {
    await waitFor(async () => {
      rendered = render(<MovieCard {...mockProps}/>);
    });
  });

  it('Renders correctly', async () => {
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(rendered.getByTestId('MovieCard')).toBeDefined();
    expect(rendered.getByTestId('MoviePoster')).toBeDefined();
    expect(rendered.getByTestId('MoviDetail')).toBeDefined();
  });

  it('Render movie card with detail correctly', () => {
    expect(rendered.getByText('Ant-Man and the Wasp: Quantumania')).toBeDefined();
    expect(rendered.getByText('2023')).toBeDefined();
  });
  it('Render movie poster without detail correctly', () => {
    rendered = render(<MovieCard {...mockProps} full={false}/>);
    expect(rendered.getByTestId('MoviePosterSecondTitle')).toBeDefined();
    expect(rendered.queryByTestId('MoviDetail')).toBeFalsy();
  });
});
