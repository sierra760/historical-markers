const { getDefaultConfig } = require('expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('txt');
defaultConfig.resolver.sourceExts.push('cjs');
module.exports = defaultConfig;