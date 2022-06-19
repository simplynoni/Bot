import { LogChannelId } from '../Config.js'
import Chalk from 'chalk'
import Embed from '../Classes/Embed.js'

const Module = {
    Client: null,
    Channel: null,
    Start: async (Client) => {
        Module.Client = Client
        
        if (LogChannelId) {
            try {
                Module.Channel = await Client.channels.fetch(LogChannelId)
            } catch (Error) {
                console.log(Chalk.red(`Couldn't get log channel: ${Error}`))
            }
        }
    },
    LogAction: async (Action, ActionData, ActionImage, ReturnEmbed) => {
        const LogEmbed = new Embed('Log')
        LogEmbed.setTitle(Action)
        await LogEmbed.AddFooter()

        if (ActionData) {
            for (const [Name, Value] of Object.entries(ActionData)) {
                LogEmbed.addField(Name, Value)
            }
        }

        if (ActionImage) {
            LogEmbed.setThumbnail(ActionImage)
        }

        if (ReturnEmbed) {
            return LogEmbed, Module.Channel
        } else {
            return await Module.Channel.send({ embeds: [LogEmbed] })
        }
    }
}

export default Module