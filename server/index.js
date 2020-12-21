console.clear();

//Modules
const Discord = require('discord.js');
const terminal = require('terminal');
const Database = require('database');
const fs = require('fs');
//const {Plugin, Command} = require('plugin');


//Objects
const client = new Discord.Client();
const db = new Database(__dirname, 'Bot', {
    name: '',
    token: '',
    consoleLang: ''
}, {
    lang: 'en'
}, {
    loggedIntoServers: 'Zalogowano do serwerów: ',
    messageRecived: 'Otrzymano wiadomość',
    pluginLoaded: 'Załadowano plugin %s',
    pluginLoadingError: 'Ładowanie pluginu %s trwa zbyt długo. Plugin może być uszkodzony',
    pluginLoading: "Ładowanie pluginu %s",
    noSuchCommand: "Komenda %s nie istnieje",
});

//Initialization
client.login(db.plugin.token);
terminal.initialize(db.plugin.name);
const lang = db.lang(db.plugin.consoleLang);

destructPluginsFromDir(`${__dirname}/Plugins`);
destructPluginsFromDir(`${__dirname}/Built-in/Plugins`);

//Events
client.on('ready', () => {
    terminal.success(lang['loggedIntoServers']);
    terminal.info(client.guilds.cache.map(x => `${x.name} (${x.id})`).join('\n'));
});

client.on('message', msg => {
    if (msg.author != client.user) {
        let args = msg.content.split(/\s+/);
        if (db.commands.chat.has(args[0])) {
            db.commands.chat.get(args[0]).run(msg, args);
        }
    }
});

terminal.on('line', input => {
    let args = input.split(/\s+/);
    if (db.commands.console.has(args[0])) {
        db.commands.console.get(args[0]).run(args);
    } else {
        terminal.warn(lang['noSuchCommand'], args[0])
    }
})

//Functions
function getServerLang(serverID, stringID) {
    return db.lang(db.server(serverID).get('lang'))[stringID];
}

function destructPluginsFromDir(path) {
    for (const x of fs.readdirSync(path, {
            withFileTypes: true
        })) {
        if (!x.isDirectory()) continue;
        let contents = fs.readdirSync(path + '/' + x.name);
        let file = contents.find(y => y == 'index.js');
        if (!file) file = contents.find(y => y == 'plugin.js');
        if (!file) file = contents.find(y => y == 'main.js');
        if (!file) file = contents.find(y => y.match(/ *.js/g));
        let adress = `${path}/${x.name}/${file}`;
        if (file) db.plugins.set(adress, require(adress));
        if (db.plugins.has(adress)) {
            const plugin = db.plugins.get(adress);
            terminal.debug(lang['pluginLoading'], `${plugin.name}@${plugin.version}`)
            plugin.chatCommands.forEach(element => {
                element.plugin = plugin;
                element.names.forEach(elem => {
                    db.commands.chat.set(elem, element);
                });
            });
            plugin.consoleCommands.forEach(element => {
                element.plugin = plugin;
                element.names.forEach(elem => {
                    db.commands.console.set(elem, element);
                });
            });
            plugin.builtIn = path == `${__dirname}/Built-in/Plugins`;

            let stopped = false;
            setTimeout(() => {
                if (!stopped) terminal.warn(lang['pluginLoadingError'], plugin.name + '@' + plugin.version);
            }, 5000);
            (async () => {
                plugin.run(client, {
                    name: db.plugin.name,
                    consoleLang: db.plugin.consoleLang
                })
            })().then(() => {
                stopped = true;
                terminal.info(lang['pluginLoaded'], plugin.name + '@' + plugin.version)
            });
        }
    }
}