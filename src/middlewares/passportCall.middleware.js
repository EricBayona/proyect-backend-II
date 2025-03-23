import passport from "passport";

export const passportCall = (Strategy) => {
    return (req, res, next) => {
        passport.authenticate(Strategy, (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ status: "error", message: info.message });
            req.user = user;
            next();
        })(req, res, next)
    }
}