export {};
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string; // set on `npm start` in dev OR on `pm2 start` in prod
            DB_HOST: string;
            PORT: string;
            DB_NAME: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_SYNCHRONIZE: string;
            DB_LOGGING: string;
            SEND_SMS: string;
            SEND_EMAIL: string;
            SEND_MONTHLY_EMAIL: string;
            SERVER_DOMAIN: string;
            ACCESS_TOKEN_NAME: string;
            TWO_FACTOR_TOKEN_COOKIE: string;
            SECRET_OR_KEY: string;
            MAIL_USER: string;
            MAIL_PASSWORD: string;
            CHAT_GPT_KEY: string;
            CLIENT_DOMAIN: string;
        }
    }
}
