export default {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/e-comerce",
    SESSION_SECRET: process.env.SESSION_SECRET || "secret"
}