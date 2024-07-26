const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
config.resolver.assetExts.push("lottie");
config.resolver.assetExts.push("cjs");

module.exports = config;
