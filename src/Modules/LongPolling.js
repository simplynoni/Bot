import LongPolling from 'roblox-long-polling'
import { Port } from '../Config.js'

const Module = {
    Poll: null,
    Start: async () => {
        Module.Poll = new LongPolling({ port: Port, password: process.env.APIKey})

        Module.Poll.on('connection', async (Connection) => {
            console.log('new connection', Connection.id)
        })
    },
    Send: async (Event, Data) => {
        Module.Poll.broadcast(Event, Data)
    }
}

export default Module