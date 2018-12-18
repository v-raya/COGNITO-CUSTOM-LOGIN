/* eslint "no-magic-numbers": [0, { "enforceConst": true, "ignore": [-1,0,1,2] }] */

import React from 'react'
import { shallow } from 'enzyme'
import LoginPage from './LoginPage'
import LoginForm from './LoginForm'
import MfaForm from './MfaForm'
import NewPasswordRequiredForm from './NewPasswordRequiredForm'
import * as Auth from '../utils/Auth'
import CodeExpired from './CodeExpired'

describe('LoginPage.js Tests', () => {
  const MODE = {
    LOGIN: 1,
    VALIDATING: 2,
    NEW_PASSWORD: 3,
    CODE_EXPIRED: 4
  }
  it('should have mode of login by default', () => {
    const wrapper = shallow(<LoginPage/>)

    expect(wrapper.state().mode).toEqual(MODE.LOGIN)
  })

  it('should contain <LoginForm> by default', () => {
    const wrapper = shallow(<LoginPage/>)

    expect(wrapper.find(LoginForm).length).toEqual(1)
    expect(wrapper.find(MfaForm).length).toEqual(0)
  })

  it('replace login page with MFA page when the mode is VALIDATING', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.setState({ mode: MODE.VALIDATING })
    expect(wrapper.find(LoginForm).length).toEqual(0)
    expect(wrapper.find(MfaForm).length).toEqual(1)
  })

  it('replace login page with code expired page when the mode is CODE_EXPIRED', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.setState({ mode: MODE.CODE_EXPIRED })
    expect(wrapper.find(LoginForm).length).toEqual(0)
    expect(wrapper.find(CodeExpired).length).toEqual(1)
  })

  it('replace login page with New password required form page when the mode is NEW_PASSWORD', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.setState({ mode: MODE.NEW_PASSWORD })
    expect(wrapper.find(LoginForm).length).toEqual(0)
    expect(wrapper.find(MfaForm).length).toEqual(0)
    expect(wrapper.find(NewPasswordRequiredForm).length).toEqual(1)
  })

  it('should contain form', () => {
    const wrapper = shallow(<LoginPage/>)

    expect(wrapper.find('#login-form').length).toEqual(1)
  })

  it('sets code on input change', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.instance().onInputChange({ target: { id: 'code', value: 'the_code' } })
    expect(wrapper.state().code).toEqual('the_code')
  })

  it('sets email on input change', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.instance().onInputChange({ target: { id: 'email', value: 'email' } })
    expect(wrapper.state().email).toEqual('email')
  })

  it('sets password on input change', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.instance().onInputChange({ target: { id: 'password', value: 'password' } })
    expect(wrapper.state().password).toEqual('password')
  })

  it('sets newPassword on input change and validates newPassword', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.instance().onInputChange({ target: { id: 'newPassword', value: 'password' } })
    expect(wrapper.state().newPassword).toEqual('password')
    expect(wrapper.state().maxLength).toEqual(true)
  })

  it('sets confirmPassoword on input change', () => {
    const wrapper = shallow(<LoginPage />)

    wrapper.instance().onInputChange({ target: { id: 'confirmPassword', value: 'password' } })
    expect(wrapper.state().confirmPassword).toEqual('password')
    expect(wrapper.state().maxLength).toEqual(false)
  })

  it('sets up correctly when showing validation area', () => {
    const countDown = 178
    const wrapper = shallow(<LoginPage />)
    wrapper.setState({mode: MODE.LOGIN, maskedEmail: '', countDown: countDown})
    wrapper.instance().showValidationArea('a@test.com')
    expect(wrapper.state().mode).toEqual(MODE.VALIDATING)
    expect(wrapper.state().maskedEmail).toEqual('a@test.com')
    expect(wrapper.state().errorMsg).toEqual('')
    const mockStartTimer = wrapper.instance().startTimer
    expect(wrapper.instance().timer._repeat).toEqual(1000)
    expect(wrapper.instance().timer._onTimeout).toEqual(mockStartTimer)
  })

  it('sets up correctly after startTimer is called, when countDown is greater than 0', () => {
    const countDown = 124
    const wrapper = shallow(<LoginPage />)
    wrapper.setState({mode: MODE.VALIDATING, maskedEmail: 'a@test.com', countDown: countDown, code: 'LETMEIN'})
    wrapper.instance().startTimer()
    expect(wrapper.state().mode).toEqual(MODE.VALIDATING)
    expect(wrapper.state().maskedEmail).toEqual('a@test.com')
    expect(wrapper.state().countDown).toEqual(123)
  })

  it('sets up correctly after startTimer is called, when countDown = 0', () => {
    const countDown = 0
    const wrapper = shallow(<LoginPage />)
    wrapper.setState({mode: MODE.VALIDATING, maskedEmail: 'a@test.com', countDown: countDown, email: 'a@test.com', password: 'something'})
    wrapper.instance().startTimer()
    expect(wrapper.state().mode).toEqual(MODE.CODE_EXPIRED)
    expect(wrapper.state().code).toEqual('')
    expect(wrapper.state().email).toEqual('a@test.com')
    expect(wrapper.state().password).toEqual('')
    expect(wrapper.state().maskedEmail).toEqual('a@test.com')
  })

  it('sets up correctly when unknown mode', () => {
    const mockShowError = jest.fn()

    const wrapper = shallow(<LoginPage />)

    wrapper.instance().showError = mockShowError
    wrapper.setState({mode: -1})

    expect(mockShowError.mock.calls.length).toEqual(1)
    expect(mockShowError.mock.calls[0][0]).toEqual('Unknown Request')
  })

  it('sets up correctly when showError', () => {
    const countDown = 178
    const wrapper = shallow(<LoginPage />)
    wrapper.setState({
      mode: MODE.VALIDATING,
      maskedEmail: 'somevalue',
      errorMsg: '',
      email: 'a@a.com',
      password: 'password'
    })

    wrapper.instance().showError('msg')
    expect(wrapper.state()).toEqual({
      MfaAttemptsRemaining: 3,
      code: '',
      mode: MODE.LOGIN,
      maskedEmail: 'somevalue',
      errorMsg: 'msg',
      email: 'a@a.com',
      password: '',
      cognitoJson: '{}',
      newPassword: '',
      confirmPassword: '',
      countDown,
      disableSignIn: false,
      disableVerify: false,
      maxLength: false,
      lowerCase: false,
      upperCase: false,
      number: false,
      specialCharacter: false
    })
  })

  it('sets up correctly when showing update password page', () => {
    const wrapper = shallow(<LoginPage />)
    wrapper.setState({mode: MODE.LOGIN, errorMsg: 'some-text'})
    wrapper.instance().showNewPasswordRequiredArea()
    expect(wrapper.state().mode).toEqual(MODE.NEW_PASSWORD)
    expect(wrapper.state().errorMsg).toEqual('')
  })

  it('MfaAttemptsRemaining should have 3 as initial value', () => {
    const wrapper = shallow(<LoginPage/>)

    expect(wrapper.state().MfaAttemptsRemaining).toEqual(3)
  })

  describe('validate Tests', () => {
    const event = { preventDefault: () => {} }
    it('calls cognitoUser.sendCustomChallengeAnswer with correct value', () => {
      const sendCustomChallengeAnswer = jest.fn()
      const cognitoUser = {
        deviceKey: 'device_key',
        sendCustomChallengeAnswer: sendCustomChallengeAnswer
      }

      const wrapper = shallow(<LoginPage />)
      wrapper.setState(
        {
          cognitoUser: cognitoUser,
          code: 'some_code'
        }
      )
      wrapper.instance().validate(event)
      expect(sendCustomChallengeAnswer.mock.calls.length).toEqual(1)
      expect(sendCustomChallengeAnswer.mock.calls[0][0]).toEqual('some_code device_key')
    })

    it('calls showError when error', () => {
      const mockShowError = jest.fn()

      const sendCustomChallengeAnswer = (response, callback) => {
        callback.onFailure()
      }
      const cognitoUser = {
        deviceKey: 'device_key',
        sendCustomChallengeAnswer: sendCustomChallengeAnswer
      }
      const wrapper = shallow(<LoginPage />)
      wrapper.setState(
        {
          cognitoUser: cognitoUser,
          code: 'some_code',
          MfaAttemptsRemaining: 2
        }
      )
      expect(wrapper.state().MfaAttemptsRemaining).toEqual(2)
      wrapper.instance().showError = mockShowError
      wrapper.instance().validate(event)
      expect(mockShowError.mock.calls.length).toEqual(1)
      expect(mockShowError.mock.calls[0][0]).toEqual(<span>Error. Incorrect code. You have <b>1</b> attempt remaining.</span>)
    })

    describe('verify button', () => {
      it('verify button default state', () => {
        const wrapper = shallow(<LoginPage />)
        wrapper.setState({ mode: MODE.VALIDATING, code: '' })
        expect(wrapper.find(MfaForm).props().disableVerify).toEqual(false)
      })

      it('changes verify button state', () => {
        const wrapper = shallow(<LoginPage />)
        const sendCustomChallengeAnswer = jest.fn()
        wrapper.setState({ mode: MODE.VALIDATING, code: '' })
        expect(wrapper.find(MfaForm).props().disableVerify).toEqual(false)
        const cognitoUser = {
          deviceKey: 'device_key',
          sendCustomChallengeAnswer: sendCustomChallengeAnswer
        }
        wrapper.setState(
          {
            cognitoUser: cognitoUser,
            code: 'some_code'
          }
        )
        wrapper.instance().validate(event)
        wrapper.setState({ disableVerify: true })
        expect(wrapper.find(MfaForm).props().disableVerify).toEqual(true)
      })
    })
  })

  describe('login Tests', () => {
    const mockAuthenticateUserDefaultAuth = jest.fn()
    const mockSendCustomChallengeAnswer = jest.fn()
    const mockSetAuthenticationFlowType = jest.fn()
    const mockPush = jest.fn()
    const event = { preventDefault: () => {} }
    let cognitoUser = {
      authenticateUserDefaultAuth: mockAuthenticateUserDefaultAuth,
      sendCustomChallengeAnswer: mockSendCustomChallengeAnswer,
      setAuthenticationFlowType: mockSetAuthenticationFlowType,
      deviceKey: 'device_key'
    }

    const mockAuthCreateUser = jest.fn()

    Auth.createUser = mockAuthCreateUser
    let history

    beforeEach(() => {
      cognitoUser = {
        authenticateUserDefaultAuth: mockAuthenticateUserDefaultAuth,
        sendCustomChallengeAnswer: mockSendCustomChallengeAnswer,
        setAuthenticationFlowType: mockSetAuthenticationFlowType,
        deviceKey: 'device_key'
      }
      mockAuthCreateUser.mockReturnValue(cognitoUser)
      history = {push: mockPush, location: {msg: ''}}
    })

    afterEach(() => {
      mockAuthenticateUserDefaultAuth.mockReset()
      mockSendCustomChallengeAnswer.mockReset()
      mockSetAuthenticationFlowType.mockReset()
      mockAuthCreateUser.mockReset()
    })

    it('sets cognitoUser to state', () => {
      const wrapper = shallow(<LoginPage history={history}/>)

      wrapper.instance().login(event)
      expect(wrapper.state().cognitoUser).toEqual(cognitoUser)
    })

    it('sets authenticationFlowType to CUSTOM_AUTH', () => {
      const wrapper = shallow(<LoginPage history={history}/>)
      wrapper.instance().login(event)

      expect(mockSetAuthenticationFlowType.mock.calls.length).toEqual(1)
      expect(mockSetAuthenticationFlowType.mock.calls[0][0]).toEqual('CUSTOM_AUTH')
    })

    it('calls cognitoUser.authenticateUserDefaultAuth', () => {
      const wrapper = shallow(<LoginPage history={history}/>)
      wrapper.instance().login(event)

      expect(mockAuthenticateUserDefaultAuth.mock.calls.length).toEqual(1)
    })

    it('displays custom message(email is required) when both email/password are empty', () => {
      const mockShowError = jest.fn()

      const wrapper = shallow(<LoginPage history={history}/>)
      cognitoUser.authenticateUserDefaultAuth = (details, callback) => {
        callback.onFailure({code: 'InvalidParameterException', message: 'Missing required parameter USERNAME'})
      }
      const instance = wrapper.instance()
      instance.showError = mockShowError
      instance.login(event)

      expect(mockShowError.mock.calls.length).toEqual(1)
      expect(mockShowError.mock.calls[0][0]).toEqual('Email is required.')
    })

    it('displays custom error message when user is expired', () => {
      const mockShowError = jest.fn()

      const wrapper = shallow(<LoginPage history={history}/>)
      cognitoUser.authenticateUserDefaultAuth = (details, callback) => {
        callback.onFailure({code: 'NotAuthorizedException', message: 'User account has expired, it must be reset by an administrator.'})
      }
      const instance = wrapper.instance()
      instance.showError = mockShowError
      instance.login(event)

      expect(mockShowError.mock.calls.length).toEqual(1)
      expect(mockShowError.mock.calls[0][0]).toEqual('Your temporary password has expired and must be reset by an administrator.')
    })

    it('displays default error message', () => {
      const mockShowError = jest.fn()

      const wrapper = shallow(<LoginPage history={history}/>)
      cognitoUser.authenticateUserDefaultAuth = (details, callback) => {
        callback.onFailure({code: 'something', message: 'some_message'})
      }
      const instance = wrapper.instance()
      instance.showError = mockShowError
      instance.login(event)

      expect(mockShowError.mock.calls.length).toEqual(1)
      expect(mockShowError.mock.calls[0][0]).toEqual('some_message')
    })

    it('changes errorMsg state to empty string after successful signIn', () => {
      const mockShowError = jest.fn()

      const wrapper = shallow(<LoginPage history={history}/>)
      cognitoUser.authenticateUserDefaultAuth = (details, callback) => {
        callback.onFailure({code: 'something', message: 'some_message'})
      }
      const instance = wrapper.instance()
      instance.showError = mockShowError
      instance.login(event)

      expect(mockShowError.mock.calls.length).toEqual(1)
      expect(mockShowError.mock.calls[0][0]).toEqual('some_message')

      wrapper.instance().showValidationArea('a@test.com')
      expect(wrapper.state().mode).toEqual(MODE.VALIDATING)
      expect(wrapper.state().maskedEmail).toEqual('a@test.com')
      expect(wrapper.state().errorMsg).toEqual('')
    })

    describe('customChallenge Tests', () => {
      it('calls showError on Error', () => {
        const mockShowError = jest.fn()

        const wrapper = shallow(<LoginPage history={history}/>)
        cognitoUser.authenticateUserDefaultAuth = (details, callback) => {
          callback.customChallenge()
        }
        cognitoUser.sendCustomChallengeAnswer = (details, callback) => {
          callback.onFailure({code: 'somecode', message: 'some_message'})
        }
        const instance = wrapper.instance()
        instance.showError = mockShowError
        instance.login(event)

        expect(mockShowError.mock.calls.length).toEqual(1)
        expect(mockShowError.mock.calls[0][0]).toEqual('some_message')
      })

      it('calls setCognitoToken when success', () => {
        const mockSetCognitoToken = jest.fn()

        const sendCustomChallengeAnswer = (response, callback) => {
          callback.onSuccess()
        }
        const cognitoUser = {
          deviceKey: 'device_key',
          sendCustomChallengeAnswer: sendCustomChallengeAnswer
        }
        const wrapper = shallow(<LoginPage history={history}/>)
        wrapper.setState(
          {
            cognitoUser: cognitoUser,
            code: 'some_code'
          }
        )

        const instance = wrapper.instance()
        instance.setCognitoToken = mockSetCognitoToken
        instance.validate(event)
        expect(mockSetCognitoToken.mock.calls.length).toEqual(1)
      })

      it('calls sendToRedirectUri', () => {
        const mockSetCognitoToken = jest.fn()
        const wrapper = shallow(<LoginPage history={history}/>)
        cognitoUser.authenticateUserDefaultAuth = (details, callback) => {
          callback.customChallenge()
        }
        cognitoUser.sendCustomChallengeAnswer = (details, callback) => {
          callback.onSuccess()
        }

        const instance = wrapper.instance()
        instance.setCognitoToken = mockSetCognitoToken
        instance.login(event)
        expect(mockSetCognitoToken.mock.calls.length).toEqual(1)
      })

      it('shows validation area', () => {
        const mockShowValidationArea = jest.fn()
        const wrapper = shallow(<LoginPage history={history}/>)
        cognitoUser.authenticateUserDefaultAuth = (details, callback) => {
          callback.customChallenge()
        }
        cognitoUser.sendCustomChallengeAnswer = (details, callback) => {
          callback.customChallenge({maskedEmail: 'someEmail'})
        }

        const instance = wrapper.instance()
        instance.showValidationArea = mockShowValidationArea
        instance.login(event)

        expect(mockShowValidationArea.mock.calls.length).toEqual(1)
        expect(mockShowValidationArea.mock.calls[0][0]).toEqual('someEmail')
      })
    })

    describe('login button', () => {
      it('login button default state', () => {
        const wrapper = shallow(<LoginPage history={history}/>)
        expect(wrapper.find(LoginForm).props().disableSignIn).toEqual(false)
      })

      it('changes login in button state', () => {
        const mockSetCognitoToken = jest.fn()
        const wrapper = shallow(<LoginPage history={history}/>)
        expect(wrapper.find(LoginForm).props().disableSignIn).toEqual(false)
        wrapper.instance().login(event)
        wrapper.setState({ disableSignIn: true })
        expect(wrapper.find(LoginForm).props().disableSignIn).toEqual(true)
      })
    })
  })

  describe('changePassword tests', () => {
    const event = { preventDefault: () => {} }
    it('shows error when passwords do not match', () => {
      const mockShowError = jest.fn()
      const wrapper = shallow(<LoginPage />)
      wrapper.setState({ mode: MODE.NEW_PASSWORD,
        confirmPassword: 'foo',
        newPassword: 'bar' })

      const instance = wrapper.instance()
      instance.showError = mockShowError
      instance.changePassword(event)

      expect(wrapper.state().newPassword).toEqual('')
      expect(wrapper.state().confirmPassword).toEqual('')
      expect(mockShowError.mock.calls.length).toEqual(1)
      expect(mockShowError.mock.calls[0][0]).toEqual('Passwords do not match')
      expect(mockShowError.mock.calls[0][1]).toEqual(3)
    })

    describe('completeNewPasswordChallenge', () => {
      const mockAuthenticateUserDefaultAuth = jest.fn()
      const mockSendCustomChallengeAnswer = jest.fn()
      const mockSetAuthenticationFlowType = jest.fn()
      const cognitoUser = {
        authenticateUserDefaultAuth: mockAuthenticateUserDefaultAuth,
        sendCustomChallengeAnswer: mockSendCustomChallengeAnswer,
        setAuthenticationFlowType: mockSetAuthenticationFlowType,
        deviceKey: 'device_key'
      }

      it('handles failure', () => {
        const mockShowError = jest.fn()
        const wrapper = shallow(<LoginPage />)
        cognitoUser.completeNewPasswordChallenge = (newPassword, details, callback) => {
          callback.onFailure({message: 'some message'})
        }

        wrapper.setState(
          {
            cognitoUser: cognitoUser
          }
        )

        const instance = wrapper.instance()
        instance.showError = mockShowError
        instance.changePassword(event)

        expect(mockShowError.mock.calls.length).toEqual(1)
        expect(mockShowError.mock.calls[0][0]).toEqual('some message')
        expect(mockShowError.mock.calls[0][1]).toEqual(3)
      })

      it('handles success', () => {
        const result = {foo: 'bar'}
        const mockSetCognitoToken = jest.fn()
        const wrapper = shallow(<LoginPage />)
        cognitoUser.completeNewPasswordChallenge = (newPassword, details, callback) => {
          callback.onSuccess(result)
        }

        wrapper.setState(
          {
            cognitoUser: cognitoUser
          }
        )

        const instance = wrapper.instance()
        instance.setCognitoToken = mockSetCognitoToken
        instance.changePassword(event)

        expect(mockSetCognitoToken.mock.calls.length).toEqual(1)
        expect(mockSetCognitoToken.mock.calls[0][0]).toEqual(JSON.stringify(result))
      })
    })
  })

  describe('Cancel button', () => {
    it('calls onCancel', () => {
      const wrapper = shallow(<LoginPage />)
      wrapper.setState({ mode: MODE.VALIDATING, disableSignIn: true, errorMsg: 'Some-error' })

      expect(wrapper.state().mode).toEqual(MODE.VALIDATING)
      expect(wrapper.find(MfaForm).length).toEqual(1)
      expect(wrapper.state().errorMsg).toEqual('Some-error')

      wrapper.instance().onCancel()

      wrapper.update()
      expect(wrapper.state().mode).toEqual(MODE.LOGIN)
      expect(wrapper.state().disableSignIn).toEqual(false)
      expect(wrapper.state().errorMsg).toEqual('')
      expect(wrapper.state().MfaAttemptsRemaining).toEqual(3)
      expect(wrapper.state().countDown).toEqual(178)
      expect(wrapper.find(LoginForm).length).toEqual(1)
    })
  })
})
