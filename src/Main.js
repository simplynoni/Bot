import { Client, Intents } from 'discord.js'
import Noblox from 'noblox.js'
import { Colors } from './Config.js'
import FS from 'fs/promises'
import Chalk from 'chalk'
import Figlet from 'figlet'
import DotEnv from 'dotenv'
DotEnv.config()

// Discord and Roblox login
const Bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

const RobloxAccount = await Noblox.setCookie(process.env.RobloxCookie)

Bot.RobloxAccount = RobloxAccount
Bot.Modules = {}

// Start Modules
let ModuleFiles
try {
    ModuleFiles = await FS.readdir('./src/Modules')
} catch (Error) {
    console.error(Chalk.red('Error loading modules: ' + Error))
}

async function StartModules () {
    ModuleFiles = ModuleFiles.filter(File => File.endsWith('.js') && !File.endsWith('.disabled.js'))
    if (ModuleFiles.length == 0) {
        console.log(Chalk.yellow('No modules found.'))
        Resolve()
    }
    for (const File of ModuleFiles) {
        let Module = await import(`./Modules/${File}`)
        Module = Module.default
        Bot.Modules[File.split('.')[0]] = Module
        if (Module.Start) {
            Module.Start(Bot)
        }
    }
}

// Initialize Commands
let CommandFiles
try {
    CommandFiles = await FS.readdir('./src/Commands')
} catch (Error) {
    console.error(Chalk.red('Error loading commands: ' + Error))
}

async function InitCommands () {
    CommandFiles = CommandFiles.filter(File => File.endsWith('.js') && !File.endsWith('.disabled.js'))
    if (CommandFiles.length == 0) {
        console.log(Chalk.yellow('No commands found.'))
        Resolve()
    }
    for (const File of CommandFiles) {
        let Command = await import(`./Commands/${File}`)
        Command = Command.default
        Command = new Command(Bot)
        await Command.Init(Bot)
    }
}

Bot.once('ready', async () => {
    console.log(Chalk.hex(Colors.Primary)(Figlet.textSync('Roblox Bot')))
    console.log(Chalk.hex(Colors.Primary)('Bot started!'))
    console.log(`Logged in as \nDiscord: ${Bot.user.tag} \nRoblox: ${Bot.RobloxAccount.UserName}`)

    await StartModules()
    await InitCommands()
    await Bot.Modules.CommandHandler.CreateCommands(Bot)
})

Bot.login(process.env.DiscordToken)