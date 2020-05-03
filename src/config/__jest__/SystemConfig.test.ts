import * as os from 'os';
import EnvironmentConfig from '../EnvironmentConfig';

describe('SystemConfig', () => {
  const OLD_ENVIRONMENT_VARIABLES = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENVIRONMENT_VARIABLES };
  });

  afterEach(() => {
    process.env = OLD_ENVIRONMENT_VARIABLES;
  });

  describe('Sentry integration', () => {
    it('is turned on when passing a DSN string', () => {
      process.env.SENTRY_DSN = 'https://c4c3dce19407466db31cfb5c9be7d3f4@sentry.io/1887279';

      const testedConfig = new EnvironmentConfig();

      expect(testedConfig.sentryDsn).toBeTruthy();
    });

    it('can be turned off by passing an empty string to the environment variable', () => {
      process.env.SENTRY_DSN = '';

      const testedConfig = new EnvironmentConfig();

      expect(testedConfig.sentryDsn).toBeFalsy();
    });

    it('can be turned off by not configuring the environment variable', () => {
      delete process.env.SENTRY_DSN;

      const testedConfig = new EnvironmentConfig();

      expect(testedConfig.sentryDsn).toBeFalsy();
    });
  });

  describe('environment', () => {
    it('is resolved from the NODE_ENV in process.env', () => {
      process.env.NODE_ENV = 'testing';

      const testedConfig = new EnvironmentConfig();

      expect(testedConfig.environment).toEqual('testing');
    });

    it('can be undefined if you do not set it', () => {
      delete process.env.NODE_ENV;

      const testedConfig = new EnvironmentConfig();

      expect(testedConfig.environment).toBeUndefined();
    });
  });

  describe('hostname', () => {
    it('is resolved from os.hostname', () => {
      const testedConfig = new EnvironmentConfig();

      expect(testedConfig.hostName).toEqual(os.hostname());
    });
  });
});
