import React from 'react'
import PropTypes from 'prop-types'
import UserMessage from './UserMessage'
import PasswordInstructions from './PasswordInstructions'
import { Circle } from '../utils/FaIcons'
import PasswordInput from './PasswordInput'

const NewPasswordRequiredForm = ({errorMsg, validateLowerCase, validateSpecialCharacter, validateUpperCase, validateNumber, validateLength, newPassword, confirmPassword, onNewPasswordChange, onConfirmPasswordChange, onSubmit, onCancel}) => {
  return (
    <form>
      <h1>Please Update Password</h1>
      <label htmlFor="label_header_text" className="label-header-text-description">
        You must choose a new password to continue.
      </label>
      <UserMessage errorMessage={errorMsg}/>
      <br/>
      <label id='first_new_password' htmlFor='newPassword'> New Password</label>
      <PasswordInput id='newPassword' placeholder='Password' password={newPassword} ariaLabeledBy='first_new_password' onChange={onNewPasswordChange}/>

      <PasswordInstructions validateLowerCase={validateLowerCase}
        validateUpperCase={validateUpperCase}
        validateNumber={validateNumber}
        validateLength={validateLength}
        validateSpecialCharacter={validateSpecialCharacter}/>
      <br/>
      <label id='first_confirm_password' htmlFor='confirmPassword'>Confirm New Password</label>
        Confirm New Password
      <PasswordInput id='confirmPassword' placeholder='Password' password={confirmPassword} onChange={onConfirmPasswordChange}/>

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
