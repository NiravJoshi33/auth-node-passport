const dotenv = require("dotenv");

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
