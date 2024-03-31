import React, { ReactElement } from 'react';
import App from './App';
import { ShallowWrapper, shallow } from 'enzyme';

describe('My Books frontend', () => {
  it('renders frontend without crashing', () => {
    const wrapper= shallow<ReactElement>(<App />);
    expect(wrapper.exists()).toBe(true);
  });
});