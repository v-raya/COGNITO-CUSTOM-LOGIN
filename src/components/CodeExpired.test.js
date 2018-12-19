/* eslint "no-magic-numbers": [0, { "enforceConst": true, "ignore": [-1,0,1,2] }] */

import React from 'react'
import { shallow } from 'enzyme'
import CodeExpired from './CodeExpired'
import UserMessage from './UserMessage'

describe('CodeExpired.js Tests', () => {
  const mock = jest.fn()
  it('should require correct params', () => {
    // eslint-disable-next-line no-console
    console.error = mock

    shallow(<CodeExpired />)

    expect(mock).toHaveBeenCalledTimes(1)
    const concat = [].concat(...mock.mock.calls)

    expect(concat.some((element) => { return element.includes('`onReturn` is marked as required') })).toBe(true)
  })

  describe('instructions Tests', () => {
    it('should display instructions when code is expired', () => {
      const userMsg1 = 'Please return to the login screen and re-enter your login information.'
      const userMsg2 = 'A new code will be sent to your email.'
      const wrapper = shallow(<CodeExpired onReturn={mock} userMsg1={userMsg1} userMsg2={userMsg2} />)

      const span = wrapper.find('p')

      expect(span).toHaveLength(2)
      expect(span.at(0).text()).toEqual(userMsg1)
      expect(span.at(1).text()).toEqual(userMsg2)
    })

    it('should display instructions when session is expired', () => {
      const userMsg1 = 'Please return to the login screen to start the Update Password process'
      const wrapper = shallow(<CodeExpired onReturn={mock} userMsg1={userMsg1} />)

      const span = wrapper.find('p')

      expect(span).toHaveLength(2)
      expect(span.at(0).text()).toEqual(userMsg1)
    })
  })

  describe('Error message Tests', () => {
    it('should pass errorMsg to <UserMessage>', () => {
      const wrapper = shallow(<CodeExpired
        onReturn={mock}
        errorMsg="some_message" />)

      const UserMessageTag = wrapper.find(UserMessage)
      expect(UserMessageTag).toHaveLength(1)
      expect(UserMessageTag.props().errorMessage).toEqual('some_message')
    })
  })

  describe('RETURN TO LOGIN button Tests', () => {
    it('contains RETURN TO LOGIN button', () => {
      const wrapper = shallow(<CodeExpired onReturn={mock} />)
      const button = wrapper.find('.returnToLogin-button')
      expect(button).toHaveLength(1)
    })

    it('has correct text on button', () => {
      const wrapper = shallow(<CodeExpired onReturn={mock} />)

      const button = wrapper.find('.returnToLogin-button')

      expect(button.props().children).toEqual('RETURN TO LOGIN')
    })

    it('calls correct callback onClick', () => {
      const wrapper = shallow(<CodeExpired onReturn={mock} />)

      const button = wrapper.find('.returnToLogin-button')

      expect(button).toHaveLength(1)
      expect(button.props().onClick).toEqual(mock)
    })
  })
})
