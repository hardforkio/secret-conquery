const version = require("../../package.json").version;
const config = require("./functions/api/config.json");

config.version = version;

export default config;
