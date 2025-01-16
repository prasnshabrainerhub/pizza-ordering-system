module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'hi'],
  },
  defaultNS: 'common',
  localePath: 'public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  serializeConfig: false,
};
