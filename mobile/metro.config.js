// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Настройки для улучшения производительности дебаггинга
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,    // Сохранять имена классов
    keep_fnames: true,        // Сохранять имена функций
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Включить source maps для дебаггинга
config.server = {
  ...config.server,
  enhanceDebugging: true,
};

module.exports = config;