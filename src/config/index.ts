import * as dotenv from 'dotenv'
dotenv.config({ path: 'config/.env' })

interface Config {
  privateKeyFile: string
  privateKeyPassphrase: string
  publicKeyFile: string,
}

const config: Config = {
  privateKeyFile: process.env.PRIVATE_KEY_FILE as string,
  privateKeyPassphrase: process.env.PRIVATE_KEY_PASSPHRASE as string,
  publicKeyFile: process.env.PUBLIC_KEY_FILE as string,
}

export default config;
