const { get } = require('powercord/http');
const { Plugin } = require('powercord/entities');

class AnimalFact extends Plugin {
    startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'animal',
            aliases: ['ani'],
            usage: '{c} [--(fox|panda|koala|cat|dog|bird)] [--image]',
            executor: args => this.getAnimal(args)
        })
    }

    async getAnimal(args) {
        // setup
        let options = ["fox", "cat", "koala", "panda", "bird", "dog"]
        let option = false;
        let type = "facts";

        // get an option
        for (let arg of args) {
            if (options.includes(arg.slice(2))) {
                option = arg.slice(2);
                break
            }
        }
        if (!option) option = options[Math.floor(Math.random() * options.length)];
        if (args.includes("--image") || args.includes("--img")) type = "img";

        // get the animal
        const res = await get(`https://some-random-api.ml/${type}/${option}`);
        let animal = res.body.fact || res.body.link;

        // make the embed
        let embed = {
            type: 'rich',
            title: `Animal - ${option[0].toUpperCase() + option.slice(1).toLowerCase()}`,
            color: 0x4B0082,
        }
        // Image
        if (args.includes("--image") || args.includes("--img")) {
            await new Promise(resolve => {
                let img = new Image();
                img.src = animal;
                img.onload = function() {
                    embed.image = {
                        url: animal,
                        width: this.width,
                        height: this.height
                    }
                  resolve();
                }
            })
        // Plain text
        } else {
            embed.description = animal;
        }

        return {
            send: false,
            result: embed
        }

    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('fact');
    }
}

module.exports = AnimalFact;