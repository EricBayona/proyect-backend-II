import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import envsConfig from "../envs.config.js";
import { userDao } from "../../persistence/mongo/dao/user.dao.js";

const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies.token;
    }

    console.log(`token recibido: ${token}`);

    return token;
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, ExtractJwt.fromAuthHeaderAsBearerToken()]),
    secretOrKey: envsConfig.JWT_SECRET,
}
const jwtStategy = new Strategy(jwtOptions, async (payload, done) => {
    try {
        if (payload) {
            const user = await userDao.getOne({ email: payload.email });
            return done(null, user);
        }
    } catch (error) {
        done(error);
    }
})

passport.use("jwt", jwtStategy);
