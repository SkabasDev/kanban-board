import * as dotenv from 'dotenv'

dotenv.config()

export class ConfigService {
  get(key: string, def?: string): string {
    return process.env[key] ?? (def as any)
  }
}
