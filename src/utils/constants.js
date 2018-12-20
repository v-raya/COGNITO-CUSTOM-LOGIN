export const MODE = {
  LOGIN: 1,
  VALIDATING: 2,
  NEW_PASSWORD: 3,
  CODE_EXPIRED: 4
}

export const mfaMessages = {
  errorMsg: 'Your Code has expired.',
  userMsg1: 'Please return to the login screen and re-enter your login information.',
  userMsg2: 'A new code will be sent to your email.'
}

export const updatePasswordMessages = {
  errorMsg: 'Your session has expired.',
  userMsg1: 'Please return to the login screen to start the Password Update process.',
  userMsg2: ''
}

export const mfaTotalAttempts = 3
