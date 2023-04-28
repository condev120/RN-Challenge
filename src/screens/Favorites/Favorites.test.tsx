import React from 'react'
import renderer from 'react-test-renderer'
import { Favorites } from './Favorites'

test('renders correctly', () => {
  const tree = renderer.create(<Favorites />).toJSON()
  expect(tree).toMatchSnapshot()
})
