const fs = require('fs');
const yaml = require('yaml');
const path = require('path');


function readAndParse(path, ...options) {
    return yaml.parse(fs.readFileSync(path, "utf8"), ...options)
}

function writeYaml(path, data) {
    return fs.writeFileSync(
        path,
        yaml.stringify(data)
    );
}

function replacePlaceholders(input, placeholders = {}) {
    let output = input;
    for (const key in placeholders) {
        if (Object.hasOwnProperty.call(placeholders, key)) {
            const element = placeholders[key];
            let regex = new RegExp("%" + key.toString() + "%", "g");
            output = output.replace(regex, element);
        }
    }
    return output
}

let servers = new Map();
let commands = {
    chat: new Map(),
    console: new Map()
}
let plugins = new Map();


module.exports = class {
    constructor(path, name, default_plugin_config, default_server_config, default_lang) {
        this.path = path;
        this.name = name;
        this.defaults = {
            pluginConfig: default_plugin_config,
            serverConfig: default_server_config,
            lang: default_lang,
        };
        this.cache = {};
    }
    get plugin() {
        if (this.cache.hasOwnProperty('config')) return this.cache.config
        try {
            return this.cache.config = readAndParse(this.path + "/config.yaml");
        } catch (err) {
            console.error('\x1b[31m%s\x1b[0m', `Wykryto błąd ${err.name} w trakcie odczytywania pliku:\n${this.path+"/config.yaml"}\nTreść błędu: ${err.message}`);
            writeYaml(this.path + "/config.yaml", this.defaults.pluginConfig);
            return this.defaults.pluginConfig
        }

    }

    set plugin(data) {
        try {
            writeYaml(this.path + "/config.yaml", data);
        } catch (err) {
            console.error('\x1b[31m%s\x1b[0m', `Wykryto błąd w trakcie zapisu pliku:\n${this.path+"/config.yaml"}\nTreść błędu: ${err.message}`)
        }
    }

    server(id) {
        if (servers.has(id)) {
            if (servers.get(id).has(this.name)) return servers.get(id).get(this.name);
            servers.get(id).set(this.name, this.defaults.serverConfig);
            this.saveServerConfig(id);
            return this.defaults.serverConfig
        }
        if (fs.readdirSync(global.root + `/Data/Servers`).includes(id)) {
            servers.set(id, readAndParse(global.root + `/Data/Servers/${id}`, {
                mapAsMap: true
            }));
            return this.server(id)
        }
        writeYaml(global.root + `/Data/Servers/${id}`, new Map().set(this.name, this.defaults.serverConfig));
        return this.defaults.serverConfig;
    }

    editServerSetting(id, options) {
        let errors = [];
        for (const {
                key,
                value
            } in options.entries()) {
            if (this.server(id).has(key)) servers.get(id).set(key, value)
            else errors.push(`Option: Bad option name: ${key}`)
        }
        this.saveServerConfig(id);
        if (errors.length != 0) throw new Error(errors.join('\n'));
        return
    }

    saveServerConfig(id) {
        writeYaml(global.root + `/Data/Servers/${id}`, servers.get(id));
    }

    reloadServerConfig(id) {
        servers.delete(id);
        this.server(id);
    }

    lang(langCode) {
        return (id, placeholders = {}) => {
            return replacePlaceholders((() => {
                if (!this.cache.hasOwnProperty('langs')) this.cache.langs = new Map();
                if (this.cache.langs.has(langCode)) return this.cache.langs.get(langCode);
                try {
                    if (fs.readdirSync(this.path + "/langs").includes(langCode + '.lang')) {
                        this.cache.langs.set(langCode, readAndParse(this.path + `/langs/${langCode}.lang`))
                        return this.cache.langs.get(langCode);
                    }
                    writeYaml(this.path + `/langs/default.lang`, this.defaults.lang);
                    return this.defaults.lang
                } catch (error) {
                    console.error(error)
                }
            })()[id], placeholders);
        }
    }

    get commands() {
        return commands
    }

    get plugins() {
        return plugins
    }

}