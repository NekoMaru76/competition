const path = require('path');
 
require('ts-node').register({
    transpileOnly: true,
    skipProject: true,
    logError: true,
    files: false
});
const { default: VMServer } = require(path.join(__dirname, './VMServer.ts'));
const serv = new VMServer;

serv.on("ping", () => {
    setTimeout(() => {
        serv.ping();
    }, 10000);
});
serv.ping();
process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);