import dotenv from 'dotenv'
dotenv.config();

const config = {
    ACCESS_KEY: process.env.ACCESS_KEY,
    BASE_URL: process.env.BASE_URL,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
}

export default config