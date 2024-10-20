
const {
  Strategy, ExtractJwt 
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');
const User = require('../model/user');

const clientPassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = JWT.CLIENT_SECRET;
  passport.use('client-rule',
    new Strategy(options, async (payload, done) => {
      try {
        const result = await User.findOne({ _id: payload.id });
        if (result) {
          return done(null, result.toJSON());
        }
        return done('No User Found', {});
      } catch (error) {
        return done(error,{});
      }
    })
  );   
};

module.exports = { clientPassportStrategy };