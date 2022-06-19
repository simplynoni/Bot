import { MessageEmbed } from 'discord.js'
import { EmbedTypes } from '../Config.js'
import Utils from '../Modules/Utils.js'

export default class Embed extends MessageEmbed {
    constructor (Type) {
        super()

        let EmbedType = EmbedTypes[Type]
        if (!EmbedType) return
        this.EmbedType = EmbedType

        if (EmbedType.Color) {
            this.setColor(EmbedType.Color)
        }

        if (EmbedType.Title) {
            this.setTitle(EmbedType.Title)
        }
    }

    async AddFooter () {
        if (this.EmbedType.Footer) {
           if (this.EmbedType.Footer.Icon && this.EmbedType.Footer.Icon == 'Group') {
               this.setFooter(this.EmbedType.Footer.Text, await Utils.GetGroupIcon())
           } else {
               this.setFooter(this.EmbedType.Footer.Text, this.EmbedType.Footer.Text ?? null)
           }
        }
    }
}