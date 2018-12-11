import React from 'react'
import PropTypes from 'prop-types'
import UserMessage from './UserMessage'
import PasswordInput from './PasswordInput'

const MfaForm = ({maskedEmail, code, onCodeChange, onValidate, disableVerify, onCancel, errorMsg}) => {
  return (
    <form>
      <div id="div-forgot-password-msg">
        <UserMessage errorMessage={errorMsg}/>
        <h1>Account Verification</h1>
        <br/>
        <p>For additional security, we need to verify your account.</p>
        <br/>
        <p>We have sent a verification code by email to {maskedEmail}</p>
        <br/>
        <p>Please enter it below to complete verification.</p>
      </div>
      <br/>
      <label htmlFor='code'>Enter Code</label>
      <PasswordInput id="code" password={code} onChange={onCodeChange} />

      <div className= 'submit-block'>
        <button
          type="button"
          id="cancelButton"
          className="cancel-button btn btn-primary"
          onClick={onCancel}>
          Cancel
        </button>
        <button
          type='submit'
          id="validateButton"
          className="validate-button btn btn-primary"
          disabled={!code || disableVerify}
          onClick={onValidate}
          tabIndex="2">
          {disableVerify ? 'Loading....' : 'Verify'}
        </button>
      </div>
    </form>
  )
}

MfaForm.propTypes = {
  maskedEmail: PropTypes.string,
  code: PropTypes.string,
  onCodeChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  disableVerify: PropTypes.bool,
  onCancel: PropTypes.func,
  errorMsg: PropTypes.string
}

export default MfaForm
