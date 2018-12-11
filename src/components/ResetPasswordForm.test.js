/* eslint "no-magic-numbers": [0, { "enforceConst": true, "ignore": [-1,0,1,2] }] */

import React from 'react'
import { shallow } from 'enzyme'
import ResetPasswordForm from './ResetPasswordForm'
import UserMessage from './UserMessage'
import PasswordInput from './PasswordInput'

describe('ResetPasswordForm.js Tests', () => {
  it('should require correct params', () => {
    const mock = jest.fn()

    // eslint-disable-next-line no-console
    console.error = mock

    shallow(<ResetPasswordForm/>)

    expect(mock).toHaveBeenCalledTimes(9)
    const concat = [].concat(...mock.mock.calls)

    expect(concat.some((element) => { return element.includes('`email` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`code` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`newPassword` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`confirmPassword` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onCodeChange` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onNewPasswordChange` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onConfirmPasswordChange` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onSubmit` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onChange` is marked as required in `PasswordInput`') })).toBe(true)
  })

  it('should display `Password Reset` at top', () => {
    const wrapper = shallow(<ResetPasswordForm/>)

    const h1 = wrapper.find('h1')

    expect(h1).toHaveLength(1)
    expect(h1.text()).toEqual('Password Reset')
  })

  it('should pass errorMsg to <UserMessage>', () => {
    const wrapper = shallow(<ResetPasswordForm errorMsg="some_message"/>)

    const UserMessageTag = wrapper.find(UserMessage)
    expect(UserMessageTag).toHaveLength(1)
    expect(UserMessageTag.props().errorMessage).toEqual('some_message')
  })

  describe('instructions Tests', () => {
    it('should display instructions', () => {
      const wrapper = shallow(<ResetPasswordForm email="a@test.com"/>)

      const span = wrapper.find('span')
      const div = wrapper.find('div')

      expect(span).toHaveLength(1)
      expect(div).toHaveLength(2)
      expect(div.at(1).text()).toEqual('Please check your email.')
      expect(span.at(0).text()).toEqual('We have sent a password reset code by email to a@test.com. Enter it below to reset your password.')
    })
  })

  describe('code input Tests', () => {
    const mockToVerify = jest.fn()
    const mock = jest.fn()
    const wrapper = shallow(<ResetPasswordForm email="a@test.com" code="the_code" newPassword="" confirmPassword=""
      onCodeChange={mockToVerify} onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    let input
    beforeEach(() => {
      input = wrapper.find('PasswordInput')
      expect(input).toHaveLength(3)
    })
    afterEach(() => {
      mockToVerify.mockReset()
    })

    it('contains label', () => {
      const label = wrapper.find('label')

      expect(label).toHaveLength(3)
      expect(label.at(0).text()).toEqual('Code')
    })

    it('contains text input for code', () => {
      expect(input.at(0).props().id).toEqual('forgot_password_code')
    })

    it('lets component manage code value', () => {
      expect(input.at(0).props().password).toEqual('the_code')
    })

    it('calls correct callback onChange', () => {
      expect(input.at(0).props().onChange).toEqual(mockToVerify)
    })
  })

  describe('new password input Tests', () => {
    const mockToVerify = jest.fn()
    const mock = jest.fn()
    const wrapper = shallow(<ResetPasswordForm email="a@test.com" code="the_code" newPassword="new_password" confirmPassword=""
      onCodeChange={mock} onNewPasswordChange={mockToVerify} onConfirmPasswordChange={mock} onSubmit={mock}/>)
    let input

    beforeEach(() => {
      input = wrapper.find('PasswordInput')
      expect(input).toHaveLength(3)
    })
    afterEach(() => {
      mockToVerify.mockReset()
    })

    it('contains label', () => {
      const label = wrapper.find('label')

      expect(label.at(1).text()).toEqual('Create Password')
    })

    it('contains text input for new password', () => {
      expect(input.at(1).props().id).toEqual('new_password')
    })

    it('lets component manage new password value', () => {
      expect(input.at(1).props().password).toEqual('new_password')
    })

    it('calls correct callback onChange', () => {
      expect(input.at(1).props().onChange).toEqual(mockToVerify)
    })
  })

  describe('confirm password input Tests', () => {
    const mockToVerify = jest.fn()
    const mock = jest.fn()
    const wrapper = shallow(<ResetPasswordForm email="a@test.com" code="the_code" newPassword="new_password" confirmPassword="confirm_password"
      onCodeChange={mock} onNewPasswordChange={mock} onConfirmPasswordChange={mockToVerify} onSubmit={mock}/>)
    let input

    beforeEach(() => {
      input = wrapper.find('PasswordInput')
      expect(input).toHaveLength(3)
    })
    afterEach(() => {
      mockToVerify.mockReset()
    })

    it('contains label', () => {
      const label = wrapper.find('label')

      expect(label).toHaveLength(3)
      expect(label.at(2).text()).toEqual('Confirm New Password Again')
    })

    it('contains text input for confirm password', () => {
      expect(input.at(2).props().id).toEqual('confirm_password')
    })

    it('lets component manage confirm password value', () => {
      expect(input.at(2).props().password).toEqual('confirm_password')
    })

    it('calls correct callback onChange', () => {
      expect(input.at(2).props().onChange).toEqual(mockToVerify)
    })
  })

  describe('Change Password button Tests', () => {
    const mockToVerify = jest.fn()
    const mock = jest.fn()
    const wrapper = shallow(<ResetPasswordForm email="a@test.com" code="the_code" newPassword="new_password" confirmPassword="confirm_password"
      onCodeChange={mock} onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mockToVerify}/>)

    afterEach(() => {
      mockToVerify.mockReset()
    })

    it('has correct text on change password button', () => {
      const button = wrapper.find('button')
      expect(button).toHaveLength(2)
      expect(button.at(0).text()).toEqual('Change Password')
    })

    it('calls correct callback onClick for change password', () => {
      const button = wrapper.find('button')
      expect(button).toHaveLength(2)
      expect(button.at(0).props().onClick).toEqual(mockToVerify)
    })
  })

  describe('Cancel button Tests', () => {
    const mock = jest.fn()
    const onCancel = jest.fn()
    const wrapper = shallow(<ResetPasswordForm email="a@test.com" code="the_code" newPassword="new_password" confirmPassword="confirm_password"
      onCodeChange={mock} onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock} onCancel={onCancel}/>)

    it('has correct text on cancel button', () => {
      const button = wrapper.find('button')
      expect(button).toHaveLength(2)
      expect(button.at(1).text()).toEqual('<FontAwesomeIcon /> Cancel - Return to Login')
    })

    it('calls correct callback onClick for cancel', () => {
      const button = wrapper.find('button')
      expect(button).toHaveLength(2)
      expect(button.at(1).props().onClick).toEqual(onCancel)
    })
  })
})
