import React from 'react'
export const customErrorMessage = (errorMessage) => {
  const customMessage = {
    'Missing required parameter USERNAME': 'Email is required.',
    'User account has expired, it must be reset by an administrator.': 'Your temporary password has expired and must be reset by an administrator.',
    1: (<span>Error. Incorrect code. You have <b>1</b> attempt remaining.</span>),
    2: (<span>Error. Incorrect code. You have <b>2</b> attempts remaining.</span>),
    'default': errorMessage
  }
  return customMessage[errorMessage] || customMessage.default
}

export const secondstoTime = seconds => {
  const secondsPerMinute = 60
  const tenSeconds = 10
  const min = Math.floor(seconds / secondsPerMinute)
  const sec = seconds % secondsPerMinute
  const formattedSeconds = sec < tenSeconds ? `0${sec}` : sec
  return `${min}:${formattedSeconds}`
}
