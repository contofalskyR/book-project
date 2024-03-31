// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { ReactElement } from 'react';
import App from './App';
import {ShallowWrapper, shallow } from 'enzyme';

describe('My Books frontend', () => {
  it('renders frontend without crashing', () => {

   const wrapper: ShallowWrapper = shallow(<App />);

    expect(wrapper.exists()).toBe(true);
  });
});