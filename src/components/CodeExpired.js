import React from 'react'
import PropTypes from 'prop-types'
import UserMessage from './UserMessage'
import { Button } from '@cwds/components'

const CodeExpired = ({ onReturn, errorMsg }) => {
  return (
    <React.Fragment>
      <div id='div-forgot-password-msg'>
        <UserMessage errorMessage={errorMsg}/>
        <br/>
        <p className='userMsg1'>Please return to the login screen and re-enter your login information.</p>
        <p className='userMsg2'>A new code will be sent to your email.</p>
      </div>
      <br/>
      <span className='return-to-login-block'>
        <Button
          color='primary'
          size='lg'
          type='button'
          id='returnButton'
          className='returnToLogin-button btn btn-primary'
          onClick={onReturn} >
          RETURN TO LOGIN
        </Button>
      </span>
    </React.Fragment>
  )
}

CodeExpired.propTypes = {
  onReturn: PropTypes.func.isRequired,
  errorMsg: PropTypes.string
}

export default CodeExpired
