export default {
  apiPort: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
}
