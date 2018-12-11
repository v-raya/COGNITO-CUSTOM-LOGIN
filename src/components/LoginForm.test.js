/* eslint "no-magic-numbers": [0, { "enforceConst": true, "ignore": [-1,0,1,2] }] */

import React from 'react'
import { shallow } from 'enzyme'
import LoginForm from './LoginForm'
import UserMessage from './UserMessage'

describe('LoginForm.js Tests', () => {
  it('should require correct params', () => {
    const mock = jest.fn()
    // eslint-disable-next-line no-console
    console.error = mock

    shallow(<LoginForm/>)

    expect(mock).toHaveBeenCalledTimes(6)
    const concat = [].concat(...mock.mock.calls)
    expect(concat.some((element) => { return element.includes('`onSubmit` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`email` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`password` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onEmailChange` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onPasswordChange` is marked as required') })).toBe(true)
    expect(concat.some((element) => { return element.includes('`onChange` is marked as required') })).toBe(true)
  })

  it('should display `Log In` at top', () => {
    const wrapper = shallow(<LoginForm/>)

    const h1 = wrapper.find('h1')

    expect(h1).toHaveLength(1)
    expect(h1.text()).toEqual('Log In')
  })

  it('should pass errorMsg to <UserMessage>', () => {
    const mock = jest.fn()
    const wrapper = shallow(<LoginForm
      email="a"
      passowrd="thepassword"
      onSubmit={mock}
      onEmailChange={mock}
      onPasswordChange={mock}
      errorMsg="some_message"/>)

    const UserMessageTag = wrapper.find(UserMessage)
    expect(UserMessageTag).toHaveLength(1)
    expect(UserMessageTag.props().errorMessage).toEqual('some_message')
  })

  it('should pass success message to <UserMessage>', () => {
    const mock = jest.fn()
    const wrapper = shallow(<LoginForm
      email=''
      passowrd=''
      onSubmit={mock}
      onEmailChange={mock}
      onPasswordChange={mock}
      errorMsg=''
      successMessage='some_message'/>)

    const UserMessageTag = wrapper.find(UserMessage)
    expect(UserMessageTag).toHaveLength(1)
    expect(UserMessageTag.props().successMessage).toEqual('some_message')
  })

  describe('email input Tests', () => {
    const mock = jest.fn()
    const mockToVerify = jest.fn()
    const wrapper = shallow(<LoginForm
      email="a@test.com"
      password="thepassword"
      onSubmit={mock}
      onEmailChange={mockToVerify}
      onPasswordChange={mock}
      errorMsg="some_message"/>)

    afterEach(() => {
      mockToVerify.mockReset()
    })

    it('contains label', () => {
      const label = wrapper.find('label')

      expect(label).toHaveLength(2)
      expect(label.at(0).text()).toEqual('Email')
    })

    it('contains text input for email', () => {
      const input = wrapper.find('input')

      expect(input).toHaveLength(1)
      expect(input.at(0).props().id).toEqual('email')
      expect(input.at(0).props().placeholder).toEqual('Email')
    })

    it('lets component manage email value', () => {
      const input = wrapper.find('input')

      expect(input).toHaveLength(1)
      expect(input.at(0).props().value).toEqual('a@test.com')
    })

    it('has type of text', () => {
      const input = wrapper.find('input')

      expect(input).toHaveLength(1)
      expect(input.at(0).props().type).toEqual('text')
    })

    it('calls correct callback onChange', () => {
      const input = wrapper.find('input')

      expect(input).toHaveLength(1)
      expect(input.at(0).props().onChange).toEqual(mockToVerify)
    })
  })

  describe('password input Tests', () => {
    const mock = jest.fn()
    const mockToVerify = jest.fn()
    const wrapper = shallow(<LoginForm
      email="a@test.com"
      password="thepassword"
      onSubmit={mock}
      onEmailChange={mock}
      onPasswordChange={mockToVerify}
      errorMsg="some_message"/>)

    let passwordInput

    beforeEach(() => {
      passwordInput = wrapper.find('PasswordInput')
    })
    afterEach(() => {
      mockToVerify.mockReset()
    })

    it('contains label', () => {
      const label = wrapper.find('label')

      expect(label).toHaveLength(2)
      expect(label.at(1).text()).toEqual('Password')
    })

    it('lets component manage password value', () => {
      expect(passwordInput.props().password).toEqual('thepassword')
    })

    it('calls correct callback onChange', () => {
      expect(passwordInput.props().onChange).toEqual(mockToVerify)
    })
  })

  describe('submit button Tests', () => {
    const mock = jest.fn()
    const mockToVerify = jest.fn()
    const disableSignIn = false
    const wrapper = shallow(<LoginForm
      email="a@test.com"
      password="thepassword"
      onSubmit={mockToVerify}
      onEmailChange={mock}
      onPasswordChange={mock}
      disableSignIn={disableSignIn}
      errorMsg="some_message"/>)

    afterEach(() => {
      mockToVerify.mockReset()
    })

    it('contains submit button', () => {
      const button = wrapper.find('button')

      expect(button).toHaveLength(1)
    })

    it('has correct text on submit button', () => {
      const button = wrapper.find('button')

      expect(button.text()).toEqual('Sign In')
    })

    it('calls correct callback onClick', () => {
      const button = wrapper.find('button')

      expect(button).toHaveLength(1)
      expect(button.props().onClick).toEqual(mockToVerify)
    })
    it('check if submit button is disabled or not', () => {
      const button = wrapper.find('button')
      expect(button.props().disabled).toEqual(disableSignIn)
    })
    it('check if submit button text is changed', () => {
      const wrapper = shallow(<LoginForm
        email="a@test.com"
        password="thepassword"
        onSubmit={mockToVerify}
        onEmailChange={mock}
        onPasswordChange={mock}
        disableSignIn={true}
        errorMsg="some_message"/>)
      const button = wrapper.find('button')
      expect(button.text()).toEqual('Loading....')
    })
  })
})
