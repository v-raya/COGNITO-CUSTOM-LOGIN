import * as Auth from './Auth'

describe('Auth.js Tests', () => {
  describe('createUser Tests', () => {
    it('sets username correctly on cognitoUser', () => {
      process.env.USER_POOL_ID = 'us-west-2_blah'
      process.env.CLIENT_ID = 'test'

      const cognitoUser = Auth.createUser({email: 'A@Test.com'})

      // assert
      expect(cognitoUser.getUsername()).toEqual('a@test.com')

      delete process.env.USER_POOL_ID
      delete process.env.CLIENT_ID
    })
  })

  describe('authenticationDetails Tests', () => {
    it('sets username correctly', () => {
      const authenticationDetails = Auth.authenticationDetails({email: 'A@Test.com', password: 'abcdef'})

      // assert
      expect(authenticationDetails.getUsername()).toEqual('a@test.com')
    })

    it('sets password correctly', () => {
      const authenticationDetails = Auth.authenticationDetails({email: 'a@test.com', password: 'abcdef'})

      // assert
      expect(authenticationDetails.getPassword()).toEqual('abcdef')
    })
  })
})
