const readline = require('readline');
let rl;

let terminal = {
    initialize:function(name){
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
            historySize: 0,
            prompt: name + ">",
            removeHistoryDuplicates: true,
        });
    },
    log: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.log(...args);
        rl.prompt();
    },
    debug: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        args[0] = "\x1b[38;5;8m" + args[0] + "\x1b[0m";
        console.debug(...args);
        rl.prompt();
    },
    info:function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        args[0] = "\x1b[38;5;12m" + args[0] + "\x1b[0m";
        console.info(...args);
        rl.prompt();
    },
    success:function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        args[0] = "\x1b[38;5;10m" + args[0] + "\x1b[0m";
        console.info(...args);
        rl.prompt();
    },
    warn: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        args[0] = "\x1b[33m" + args[0] + "\x1b[0m";
        console.warn(...args);
        rl.prompt();
    },
    error: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        args[0] = "\x1b[31m" + args[0] + "\x1b[0m";
        console.error(...args);
        rl.prompt();
    },
    assert: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.assert(...args);
        rl.prompt();
    },
    count: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.count(...args);
        rl.prompt();
    },
    countReset: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.countReset(...args);
        rl.prompt();
    },
    dir: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.dir(...args);
        rl.prompt();
    },
    dirxml: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.dirxml(...args);
        rl.prompt();
    },
    group: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.group(...args);
        rl.prompt();
    },
    groupCollapsed: this.group,
    groupEnd: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.groupEnd(...args);
        rl.prompt();
    },
    table: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.table(...args);
        rl.prompt();
    },
    clear: function(...args) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        console.clear(...args);
        rl.prompt();
    },
    on: function(...args) {
        return rl.on(...args);
    }
}

module.exports = terminal;