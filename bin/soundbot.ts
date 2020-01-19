#!/usr/bin/env node

import * as Sentry from '@sentry/node';

import localize from '@util/i18n/localize';
import container from '../src/util/Container';
import SoundBot from '../src/bot/SoundBot';
import Config from '../src/config/Config';
import SystemConfig from '../src/config/SystemConfig';

const config = container.cradle.config as Config;
const systemConfig = new SystemConfig();

localize.setLocale(config.language);

if (systemConfig.sentryDsn) {
  Sentry.init({
    dsn: systemConfig.sentryDsn,
    environment: systemConfig.environment,
    serverName: systemConfig.hostName
  });
}

const bot = container.cradle.soundBot as SoundBot;
bot.start();

console.info(localize.t('url', { clientId: config.clientId }));
