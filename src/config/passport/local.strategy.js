import passport from "passport";
import { Strategy } from "passport-local";
import { userDao } from "../../persistence/mongo/dao/user.dao.js";
import { hashPassword, comparePassword } from "../../utils/hasPassword.js";
import { cartDao } from "../../persistence/mongo/dao/cart.dao.js";


const registerStrategy = new Strategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
        try {
            const user = await userDao.getOne({ email: username });
            if (user) return done(null, false, { message: "El usuario ya existe" });

            const newCart = await cartDao.create();
            const newUser = {
                ...req.body,
                password: hashPassword(password),
                cart: newCart._id,
            };

            const userCreate = await userDao.create(newUser);

            return done(null, userCreate);

        } catch (error) {
            done({ erro: error });
        }
    }
);

passport.use("register", registerStrategy);


const loginStrategy = new Strategy({ usernameField: "email" },
    async (username, password, done) => {
        try {
            const user = await userDao.getOne({ email: username });
            if (!user || !comparePassword(user.password, password))
                return done(null, false, { message: "Email o password no válidos" });
            return done(null, user);
        } catch (error) {
            done(error)
        }
    }

)

passport.use("login", loginStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userDao.getOne({ _id: id });
        done(null, user);
    } catch (error) {
        done(error);
    }
})