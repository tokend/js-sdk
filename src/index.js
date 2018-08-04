require('es6-promise').polyfill();

// stellar-sdk classes to expose
export * from "./errors";
export {Config} from "./config";
export {Server} from "./server";

// expose classes and functions from 'tokend-js-base'
export * from "tokend-js-base";

export default module.exports;
