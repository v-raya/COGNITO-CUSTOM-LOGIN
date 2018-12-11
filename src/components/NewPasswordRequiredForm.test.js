/* eslint "no-magic-numbers": [0, { "enforceConst": true, "ignore": [-1,0,1,2] }] */

import React from 'react'
import { shallow } from 'enzyme'
import NewPasswordRequiredForm from './NewPasswordRequiredForm'
import UserMessage from './UserMessage'

describe('NewPasswordRequiredForm.js Tests', () => {
  it('should require correct params', () => {
    const mock = jest.fn()
    // eslint-disable-next-line no-console
    console.error = mock

    shallow(<NewPasswordRequiredForm/>)

    expect(mock).toHaveBeenCalledTimes(5)
    const concat = [].concat(...mock.mock.calls)
    expect(concat.some((element) => { return element.includes('`onNewPasswordChange` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onConfirmPasswordChange` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onSubmit` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onCancel` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onChange` is marked as required') })).toBe(true)
  })

  it('should display `Password Reset` at top', () => {
    const mock = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    const h1 = wrapper.find('h1')
    const label = wrapper.find('label')

    expect(h1).toHaveLength(1)
    expect(h1.text()).toEqual('Please Update Password')
    expect(label.at(0).text()).toEqual('You must choose a new password to continue.')
  })

  it('should pass errorMsg to <UserMessage>', () => {
    const mock = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm errorMsg="some_message" onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    const UserMessageTag = wrapper.find(UserMessage)
    expect(UserMessageTag).toHaveLength(1)
    expect(UserMessageTag.props().errorMessage).toEqual('some_message')
  })

  it('contains text input for new password', () => {
    const mock = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm newPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    const input = wrapper.find('PasswordInput')

    expect(input).toHaveLength(2)
    expect(input.at(0).props().id).toEqual('newPassword')
  })

  it('lets component manage new password value', () => {
    const mock = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm newPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    const input = wrapper.find('PasswordInput')

    expect(input).toHaveLength(2)
    expect(input.at(0).props().password).toEqual('New Password')
  })

  it('calls correct callback onChange for new password', () => {
    const mock = jest.fn()
    const onChange = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm newPassword="New Password" onNewPasswordChange={onChange} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    const input = wrapper.find('PasswordInput')

    expect(input).toHaveLength(2)
    expect(input.at(0).props().onChange).toEqual(onChange)
  })

  it('contains passwordInstructions', () => {
    const wrapper = shallow(<NewPasswordRequiredForm validateLowerCase={false} validateSpecialCharacter={false} validateUpperCase={false} validateNumber={false} validateLength={false}/>)

    const passwordInstructions = wrapper.find('PasswordInstructions')
    const props = {validateUpperCase: false, validateNumber: false, validateLength: false, validateLowerCase: false, validateSpecialCharacter: false}

    expect(passwordInstructions.length).toEqual(1)
    expect(passwordInstructions.props()).toEqual(props)
  })

  it('contains text input for confirmPassword', () => {
    const mock = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    const input = wrapper.find('PasswordInput')

    expect(input).toHaveLength(2)
    expect(input.at(1).props().id).toEqual('confirmPassword')
  })

  it('lets component manage confirmPassword value', () => {
    const mock = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock}/>)

    const input = wrapper.find('PasswordInput')

    expect(input).toHaveLength(2)
    expect(input.at(1).props().password).toEqual('New Password')
  })

  it('calls correct callback onChange for confirmPassword', () => {
    const mock = jest.fn()
    const onChange = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={onChange} onSubmit={mock}/>)

    const input = wrapper.find('PasswordInput')

    expect(input).toHaveLength(2)
    expect(input.at(1).props().onChange).toEqual(onChange)
  })

  it('contains change password button and cancel button', () => {
    const mock = jest.fn()
    const onChange = jest.fn()
    const onSubmit = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={onChange} onSubmit={onSubmit}/>)

    const button = wrapper.find('button')

    expect(button).toHaveLength(2)
  })

  it('has correct text on change password button', () => {
    const mock = jest.fn()
    const onChange = jest.fn()
    const onSubmit = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={onChange} onSubmit={onSubmit}/>)

    const button = wrapper.find('button')

    expect(button.at(0).text()).toEqual('Change Password')
  })

  it('calls correct callback onClick for change password', () => {
    const mock = jest.fn()
    const onChange = jest.fn()
    const onSubmit = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={onChange} onSubmit={onSubmit}/>)

    const button = wrapper.find('button')

    expect(button.at(0).props().onClick).toEqual(onSubmit)
  })

  it('has correct text on cancel button', () => {
    const mock = jest.fn()
    const onCancel = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock} onCancel={onCancel}/>)

    const button = wrapper.find('button')

    expect(button.at(1).text()).toEqual('<FontAwesomeIcon /> Cancel - Start Over')
  })

  it('calls correct callback onClick for cancel', () => {
    const mock = jest.fn()
    const onCancel = jest.fn()
    const wrapper = shallow(<NewPasswordRequiredForm confirmPassword="New Password" onNewPasswordChange={mock} onConfirmPasswordChange={mock} onSubmit={mock} onCancel={onCancel}/>)

    const button = wrapper.find('button')

    expect(button.at(1).props().onClick).toEqual(onCancel)
  })
})
