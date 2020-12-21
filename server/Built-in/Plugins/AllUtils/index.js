const Discord = require('discord.js');
const terminal = require('terminal');
const Database = require('database');
const {Plugin, Command} = require('plugin');

const db = new Database(
    __dirname,
    'All utils',
    {

    },
    {

    },
    {
       pluginDescription: 'Podstawowe funkcjonalności',
       recivedMessage: 'Otrzymano wiadomość od %s na kanale %s:%s:\n\"%s\"'
    }
)

module.exports = new Plugin(
    {
        name: "All utils",
        description: "Opis",
        version: "0.0.1",
    },{
        consoleCommands: [
            new Command(['exit','bye'], "Wyłącza serwer", "%s", {}, ()=>{
                process.exit();
            }),
            new Command(['plugins', 'pl'], "Pokazuje wszyskie pluginy", '%s', {}, () => {
                let values = Array.from(db.plugins.values());
                let maxlength = Math.max(...(values.map(x => {
                    return x.builtIn ? (x.name.length + 1) : x.name.length
                })))
                terminal.log(`Chat │ Konsola │ Nazwa${" ".repeat(maxlength-"Nazwa".length+1)} │ Wersja │ Opis`)
                for (const x of values) {
                    terminal.log(`${x.chatCommands.length>0?"⁕   ":"    "} │ ${x.consoleCommands.length>0?"⁕      ":"       "} │ ${x.name}${x.builtIn?"*":" "}${" ".repeat(maxlength-x.name.length)} │ v${x.version} │ ${x.description}`)
                }
            })
        ],
        chatCommands:[
            new Command(['help', '?'], "Pomoc", '%s', {}, (msg)=>{
                let tekst = "";
                db.commands.chat.forEach((value, key) => {
                    tekst+=(`\`\`\`${key} - ${value.usage}\n${value.description}\`\`\``)
                });
                msg.channel.send(tekst);
            })
        ],
    },
    (client, ...args)=>{
        client.on('message', msg=>{
            terminal.debug(db.lang('pl')['recivedMessage'], msg.author.tag, msg.channel.guild.name, msg.channel.name, msg.content)
        })
    }
    )