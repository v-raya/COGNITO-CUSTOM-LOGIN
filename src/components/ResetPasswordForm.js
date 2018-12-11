import React from 'react'
import PropTypes from 'prop-types'
import UserMessage from './UserMessage'
import PasswordInstructions from './PasswordInstructions'
import { Circle } from '../utils/FaIcons'
import PasswordInput from './PasswordInput'

const ResetPasswordForm = ({email, errorMsg, validateLowerCase, validateSpecialCharacter, validateUpperCase, validateNumber, validateLength, code, newPassword, confirmPassword, onCodeChange, onNewPasswordChange, onConfirmPasswordChange, onSubmit, disableChangePasswordBtn, onCancel}) => {
  return (
    <form>
      <h1>Password Reset</h1>
      <UserMessage errorMessage={errorMsg}/>
      <br/>
      <div id="div-forgot-password-msg">
        <div>Please check your email.</div>
        <br/>
        <span id="text-code">We have sent a password reset code by email to {email}. Enter it below to reset your password.</span>
      </div>
      <label id='code_label' htmlFor='forgot_password_code'>
        Code
      </label>
      <PasswordInput id="forgot_password_code" placeholder='Enter Code Here' password={code} onChange={onCodeChange} ariaLabelledBy='code_label'/>
      <br/>
      <label id='new_password_label' htmlFor='new_password'>
        Create Password
      </label>
      <PasswordInput id="new_password" placeholder='Password' password={newPassword} onChange={onNewPasswordChange} ariaLabelledBy='new_password_label'/>
      <PasswordInstructions validateLowerCase={validateLowerCase}
        validateUpperCase={validateUpperCase}
        validateNumber={validateNumber}
        validateLength={validateLength}
        validateSpecialCharacter={validateSpecialCharacter}/>
      <br/>
      <label id='confirm_password_label' htmlFor='confirm_password'>
        Confirm New Password Again
      </label>
      <PasswordInput id='confirm_password' placeholder='Password' password={confirmPassword} onChange={onConfirmPasswordChange} ariaLabelledBy='confirm_password_label'/>

      <button disabled={disableChangePasswordBtn} id="change_password_button" className="btn btn-primary submitButton-customizable" type="submit" onClick={onSubmit}>Change Password</button>
      <button id="cancel_button" className="btn btn-link cancelButton-customizable" type="submit" onClick={onCancel}>{Circle()} Cancel - Return to Login</button>
    </form>
  )
}

ResetPasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
  errorMsg: PropTypes.string,
  code: PropTypes.string.isRequired,
  newPassword: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onNewPasswordChange: PropTypes.func.isRequired,
  onConfirmPasswordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  disableChangePasswordBtn: PropTypes.bool,
  validateLowerCase: PropTypes.bool,
  validateSpecialCharacter: PropTypes.bool,
  validateUpperCase: PropTypes.bool,
  validateNumber: PropTypes.bool,
  validateLength: PropTypes.bool
}

export default ResetPasswordForm
