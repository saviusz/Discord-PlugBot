
    module.exports.Plugin = class {
        constructor(
            {name, description = 'No description provided', version = '0.0.1'}, {consoleCommands = [], chatCommands = []}, otherFunctions = ()=>{}) {
            this.name = name,
                this.description = description,
                this.version = version,
                this.consoleCommands = consoleCommands,
                this.chatCommands = chatCommands,
                this.run = otherFunctions
        }
    }

    module.exports.Command = class {
        constructor(names, description, usage, options={}, callback) {
            this.names = names;
            this.description = description;
            this.usage = usage;
            this.options = options;
            this.run = callback;
        }
    }