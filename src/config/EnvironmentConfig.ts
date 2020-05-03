import * as os from 'os';

export default class EnvironmentConfig {
  public sentryDsn?: string;
  public environment?: string;
  public hostName!: string;

  constructor() {
    this.sentryDsn = process.env.SENTRY_DSN;
    this.hostName = os.hostname();
    this.environment = process.env.NODE_ENV;
  }
}
