import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert } from '@cwds/components'

class PasswordInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = { capslock: false }

    this.handleKeydown = this.handleKeydown.bind(this)

    this.setPasswordInputRef = element => {
      if (element) element.addEventListener('keydown', this.handleKeydown)
    }
  }

  render () {
    const { password, onChange, ariaLabelledBy, placeholder, tabIndex } = this.props
    return (<React.Fragment>
      <input id={this.props.id} ref={this.setPasswordInputRef} name='password' type='password' className='form-control inputField-customizable'
        placeholder={placeholder} value={password} onChange={onChange} aria-labelledby={ariaLabelledBy} tabIndex={tabIndex} />
      {this.state.capslock && <Alert className='errorMessage-customizable' color='danger'>Caps Lock is on</Alert>}
    </React.Fragment>
    )
  }

  handleKeydown (event) {
    const caps = event.getModifierState !== undefined && event.getModifierState('CapsLock')
    this.setState(state => ({
      capslock: caps
    }))
  }
}

PasswordInput.propTypes = {
  id: PropTypes.string,
  password: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  ariaLabelledBy: PropTypes.string,
  placeholder: PropTypes.string,
  tabIndex: PropTypes.string
}
export default PasswordInput
