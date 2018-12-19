import React from 'react'
import PropTypes from 'prop-types'
import UserMessage from './UserMessage'
import { Button } from '@cwds/components'

const CodeExpired = ({ onReturn, errorMsg, userMsg1, userMsg2 }) => {
  return (
    <React.Fragment>
      <div id='div-forgot-password-msg'>
        <UserMessage errorMessage={errorMsg} />
        <br />
        <p className='userMsg1'>{userMsg1}</p>
        <p className='userMsg2'>{userMsg2}</p>
      </div>
      <br />
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
  userMsg1: PropTypes.string,
  userMsg2: PropTypes.string,
  errorMsg: PropTypes.string
}

export default CodeExpired
