import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase().trim()
      if (!email) return done(new Error('Google account has no email'), null)

      const requestedType = req.query.state === 'host' ? 'host' : 'traveler'
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] })

      if (!user) {
        user = await User.create({
          name: profile.displayName || 'VanaVas user',
          email,
          googleId: profile.id,
          userType: requestedType,
          role: 'viewer',
        })
      } else if (!user.googleId) {
        user.googleId = profile.id
        await user.save()
      }

      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }
))

export default passport
