module.exports = {
    apps: [
        {
            name: "backend",
            cwd: "./apps/backend",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                RESEND_API_KEY: "dev_key_fake",
                EMAIL_FROM: "test@test.com",
                DATABASE_URL: "SUA_URL_AQUI"
            }
        }
    ]
};