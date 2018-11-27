import React from 'react'
import PropTypes from 'prop-types'
import UserMessage from './UserMessage'
import PasswordInstructions from './PasswordInstructions'
import { Circle } from '../utils/FaIcons'

const NewPasswordRequiredForm = ({errorMsg, validateLowerCase, validateSpecialCharacter, validateUpperCase, validateNumber, validateLength, newPassword, confirmPassword, onNewPasswordChange, onConfirmPasswordChange, onSubmit, onCancel}) => {
  return (
    <form>
      <h1>Please Update Password</h1>
      <label htmlFor="label_header_text" className="label-header-text-description">
        You must choose a new password to continue
      </label>
      <UserMessage errorMessage={errorMsg}/>
      <br/>
      <label id='first_new_password'>
        New Password
        <input id="newPassword" className="form-control inputField-customizable" type="password" name="password" value={newPassword} onChange={onNewPasswordChange} aria-labelledby="first_new_password"/>
      </label>
      <PasswordInstructions validateLowerCase={validateLowerCase}
        validateUpperCase={validateUpperCase}
        validateNumber={validateNumber}
        validateLength={validateLength}
        validateSpecialCharacter={validateSpecialCharacter}/>
      <br/>
      <label id='first_confirm_password'>
        Confirm New Password
        <input id="confirmPassword" className="form-control inputField-customizable" type="password" name="confirmPassword" value={confirmPassword} onChange={onConfirmPasswordChange} aria-labelledby="first_confirm_password"/>
      </label>
      <button id="change_password_button" className="btn btn-primary submitButton-customizable" type="submit" onClick={onSubmit}>Change Password</button>
      <button id="cancel_button" className="btn btn-link cancelButton-customizable" type="submit" onClick={onCancel}>{Circle()} Cancel - Start Over</button>
    </form>
  )
}

NewPasswordRequiredForm.propTypes = {
  errorMsg: PropTypes.string,
  newPassword: PropTypes.string,
  confirmPassword: PropTypes.string,
  onNewPasswordChange: PropTypes.func.isRequired,
  onConfirmPasswordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  validateLowerCase: PropTypes.bool,
  validateSpecialCharacter: PropTypes.bool,
  validateUpperCase: PropTypes.bool,
  validateNumber: PropTypes.bool,
  validateLength: PropTypes.bool
}

export default NewPasswordRequiredForm
