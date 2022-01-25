import dotenv from 'dotenv'
dotenv.config();

const config = {
    ACCESS_KEY: process.env.ACCESS_KEY,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URI: process.env.MONGODB_URI,
}

export default config