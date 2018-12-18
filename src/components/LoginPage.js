import React, { Component } from 'react'
import {customErrorMessage} from '../utils/CommonHelper'
import {validatePassword} from '../utils/validatePassword'
import qs from 'query-string'
import LoginForm from './LoginForm'
import MfaForm from './MfaForm'
import NewPasswordRequiredForm from './NewPasswordRequiredForm'
import * as Auth from '../utils/Auth'
import CodeExpired from './CodeExpired'

const MODE = {
  LOGIN: 1,
  VALIDATING: 2,
  NEW_PASSWORD: 3,
  CODE_EXPIRED: 4
}

const mfaNumber = 3
class LoginPage extends Component {
  constructor (props, context) {
    super(props, context)
    this.timer = 0

    this.state = {
      mode: MODE.LOGIN,
      errorMsg: undefined,
      email: '',
      password: '',
      code: '',
      cognitoJson: '{}',
      newPassword: '',
      confirmPassword: '',
      disableSignIn: false,
      disableVerify: false,
      maxLength: false,
      lowerCase: false,
      upperCase: false,
      number: false,
      specialCharacter: false,
      MfaAttemptsRemaining: 3,
      countDown: 178
    }
    this.login = this.login.bind(this)
    this.validate = this.validate.bind(this)
    this.showValidationArea = this.showValidationArea.bind(this)
    this.showError = this.showError.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.setCognitoToken = this.setCognitoToken.bind(this)
    this.submitFormToPerry = this.submitFormToPerry.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.showNewPasswordRequiredArea = this.showNewPasswordRequiredArea.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.startTimer = this.startTimer.bind(this)
  }

  onInputChange (event) {
    this.setState({ [event.target.id]: event.target.value })
    if (event.target.id === 'newPassword') {
      validatePassword(this, event.target.value)
    }
  }

  showValidationArea (maskedEmail) {
    this.setState({
      mode: MODE.VALIDATING,
      maskedEmail: maskedEmail,
      errorMsg: ''
    })
    const intervalTime = 1000
    this.timer = setInterval(this.startTimer, intervalTime)
  }

  startTimer () {
    const duration = this.state.countDown
    if (duration > 0) {
      this.setState({
        countDown: duration - 1
      })
    } else {
      this.setState({
        mode: MODE.CODE_EXPIRED,
        code: '',
        password: ''
      })
      clearInterval(this.timer)
    }
  }

  showNewPasswordRequiredArea () {
    this.setState({
      mode: MODE.NEW_PASSWORD,
      errorMsg: ''
    })
  }

  setCognitoToken (token) {
    this.setState({cognitoJson: token})
    this.submitFormToPerry()
  }

  submitFormToPerry () {
    document.getElementById('login-form').submit()
  }

  showError (msg, mode = MODE.LOGIN, mfaCount = mfaNumber) {
    this.setState({
      mode: mode,
      errorMsg: msg,
      password: '',
      newPassword: '',
      confirmPassword: '',
      code: '',
      disableSignIn: false,
      disableVerify: false,
      MfaAttemptsRemaining: mfaCount
    })
  }

  validate (event) {
    event.preventDefault()
    const cognitoUser = this.state.cognitoUser
    const challengeResponses = `${this.state.code.trim()} ${cognitoUser.deviceKey}`
    const showError = this.showError
    const attemptsRemaining = this.state.MfaAttemptsRemaining
    const setCognitoToken = this.setCognitoToken
    const magicNum = 3
    this.setState({
      disableVerify: true
    })
    cognitoUser.sendCustomChallengeAnswer(challengeResponses, {
      onSuccess: result => {
        setCognitoToken(JSON.stringify(result))
        clearInterval(this.timer)
      },
      onFailure: () => {
        const count = attemptsRemaining - 1
        const errorMessage = customErrorMessage(count)
        if (count === 0) {
          showError('', MODE.LOGIN, magicNum)
          clearInterval(this.timer)
        } else {
          showError(errorMessage, MODE.VALIDATING, count)
        }
      }
    })
  }

  login (event) {
    event.preventDefault()
    const showValidationArea = this.showValidationArea
    const showNewPasswordRequiredArea = this.showNewPasswordRequiredArea
    const props = this.props
    props.history.push({msg: ''})
    const showError = this.showError
    const setCognitoToken = this.setCognitoToken

    const cognitoUser = Auth.createUser(this.state)
    this.setState({
      cognitoUser: cognitoUser,
      disableSignIn: true
    })
    cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH')

    const authenticationDetails = Auth.authenticationDetails(this.state)
    cognitoUser.authenticateUserDefaultAuth(authenticationDetails, {
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        showNewPasswordRequiredArea()
      },
      onFailure: err => {
        const errorMessage = customErrorMessage(err.message)
        showError(errorMessage)
      },
      customChallenge: () => {
        // device challenge
        const challengeResponses = cognitoUser.deviceKey ? cognitoUser.deviceKey : 'null'
        cognitoUser.sendCustomChallengeAnswer(challengeResponses, {
          onSuccess: result => {
            setCognitoToken(JSON.stringify(result))
          },
          onFailure: err => {
            showError(err.message)
          },
          customChallenge: challengeParameters => {
            showValidationArea(challengeParameters.maskedEmail)
          }
        })
      }
    })
  }

  changePassword (event) {
    event.preventDefault()
    const showError = this.showError
    const cognitoUser = this.state.cognitoUser
    const setCognitoToken = this.setCognitoToken
    switch (this.state.confirmPassword) {
      case this.state.newPassword:
        cognitoUser.completeNewPasswordChallenge(this.state.newPassword, {}, {
          onSuccess: result => {
            setCognitoToken(JSON.stringify(result))
          },
          onFailure: err => {
            showError(err.message, MODE.NEW_PASSWORD)
          }
        })
        break
      default: {
        this.setState({
          newPassword: '',
          confirmPassword: ''
        })
        showError('Passwords do not match', MODE.NEW_PASSWORD)
      }
    }
  }

  onCancel () {
    this.setState({
      disableSignIn: false,
      mode: MODE.LOGIN,
      errorMsg: '',
      MfaAttemptsRemaining: 3,
      countDown: 178,
      password: ''
    })
    clearInterval(this.timer)
  }

  render () {
    const perryLoginUrl = `${process.env.PERRY_URL}/perry/login`
    const props = this.props
    let comp
    switch (this.state.mode) {
      // MFA PAGE
      case MODE.VALIDATING:
        comp = <MfaForm
          disableVerify={this.state.disableVerify}
          maskedEmail={this.state.maskedEmail}
          code={this.state.code}
          onCodeChange={this.onInputChange}
          onValidate={event => this.validate(event)}
          onCancel={this.onCancel}
          errorMsg={this.state.errorMsg}
          countDown={this.state.countDown} />
        break
      case MODE.NEW_PASSWORD:
        comp = <NewPasswordRequiredForm
          validateLength={this.state.maxLength}
          validateLowerCase={this.state.lowerCase}
          validateUpperCase={this.state.upperCase}
          validateNumber={this.state.number}
          validateSpecialCharacter={this.state.specialCharacter}
          errorMsg={this.state.errorMsg}
          confirmPassword={this.state.confirmPassword}
          newPassword={this.state.newPassword}
          onNewPasswordChange={this.onInputChange}
          onConfirmPasswordChange={this.onInputChange}
          onCancel={this.onCancel}
          onSubmit={event => this.changePassword(event)} />
        break
      case MODE.LOGIN:
        comp = <LoginForm
          onSubmit={event => this.login(event)}
          disableSignIn={this.state.disableSignIn}
          errorMsg={this.state.errorMsg}
          successMessage={props.history.location.msg}
          email={this.state.email}
          password={this.state.password}
          onEmailChange={this.onInputChange}
          onPasswordChange={this.onInputChange} />
        break
      case MODE.CODE_EXPIRED:
        comp = <CodeExpired
          onReturn={this.onCancel}
          errorMsg='Your code has now expired.'/>
        break
      default:
        this.showError('Unknown Request')
        break
    }
    return (
      <React.Fragment>
        {comp}
        <form id='login-form' action={perryLoginUrl} method='post'>
          <input
            type='hidden'
            name="CognitoResponse"
            value={this.state.cognitoJson} />
        </form>
      </React.Fragment>
    )
  }
}

LoginPage.defaultProps = {
  history: {
    location: {msg: ''}
  }
}

export default LoginPage
