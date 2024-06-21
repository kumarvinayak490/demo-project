'use strict'

import config from '../config'
import User from '../models/user.model'
import passportJWT from 'passport-jwt'

const { ExtractJwt, Strategy: JwtStrategy } = passportJWT

export const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

export const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    console.log(jwtPayload)
    const user = await User.findById(jwtPayload.sub)
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } catch (err) {
    return done(err, false)
  }
})


