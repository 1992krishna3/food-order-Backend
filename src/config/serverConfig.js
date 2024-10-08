import dotenv from "dotenv";

dotenv.config();

const serverConfig = {
    Port:process.env.PORT || 3000,
    db : process.env.DB_URL || "",
    token: process.env.TOKEN_SECRET || "",
    jwtexpire: process.env.JWT_EXPIRATION || "",
};
export default serverConfig;