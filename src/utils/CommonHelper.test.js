import React from 'react'
import {customErrorMessage, secondstoTime} from '../utils/CommonHelper'

describe('Return custom error messages comparing default error messages from the amazon cognito', () => {
  it('displays custom message when both email is empty', () => {
    const input = 'Missing required parameter USERNAME'
    const output = 'Email is required.'
    expect(customErrorMessage(input)).toEqual(output)
  })

  it('displays custom error message when user is expired', () => {
    const input = 'User account has expired, it must be reset by an administrator.'
    const output = 'Your temporary password has expired and must be reset by an administrator.'
    expect(customErrorMessage(input)).toEqual(output)
  })

  it('displays custom error message when user is expired', () => {
    const input = 1
    const output = <span>Error. Incorrect code. You have <b>1</b> attempt remaining.</span>
    expect(customErrorMessage(input)).toEqual(output)
  })

  it('displays custom error message when user is expired', () => {
    const input = 2
    const output = <span>Error. Incorrect code. You have <b>2</b> attempts remaining.</span>
    expect(customErrorMessage(input)).toEqual(output)
  })

  it('displays default error message', () => {
    const input = 'some message'
    const output = 'some message'
    expect(customErrorMessage(input)).toEqual(output)
  })
})

describe('#secondstoTime', () => {
  it('converts countDown value to minutes and seconds', () => {
    const input = 178
    const output = '2:58'
    expect(secondstoTime(input)).toEqual(output)
  })

  it('adds 0 to seconds when there are less than 10 seconds', () => {
    const input = 128
    const output = '2:08'
    expect(secondstoTime(input)).toEqual(output)
  })
})
