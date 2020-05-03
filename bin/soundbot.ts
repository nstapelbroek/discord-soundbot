#!/usr/bin/env node

import * as Sentry from '@sentry/node';

import localize from '@util/i18n/localize';
import Container from '@util/Container';
import EnvironmentConfig from '@config/EnvironmentConfig';

const { config, soundBot: bot } = Container;
const environment = new EnvironmentConfig();

localize.setLocale(config.language);

if (environment.sentryDsn) {
  Sentry.init({
    dsn: environment.sentryDsn,
    environment: environment.environment,
    serverName: environment.hostName
  });
}

bot.start();

console.info(localize.t('url', { clientId: config.clientId }));
