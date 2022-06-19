import Chalk from 'chalk';
import Noblox from 'noblox.js';
import BaseCommand from '../Classes/BaseCommand.js';
import Embed from '../Classes/Embed.js';
import { GroupId, LogChannelId } from '../Config.js';

export default class ShoutCommand extends BaseCommand {
	constructor() {
		super({
			Name: 'shout',
			Description: 'Posts a shout on the Roblox group.',
			DefaultPermission: false,
			Subcommands: [
				{
					Name: 'message',
					Description: 'Posts a message to the group shout.',
					Options: [
						{
							Name: 'message',
							Description: 'The message to be posted.',
							Type: 'String',
							Required: true,
						},
					],
				},
				{
					Name: 'clear',
					Description: 'Clears the group shout.',
				},
			],
		});
	}

	async Execute(Client, Interaction, Args) {
		let Subcommand = Args.getSubcommand();

		if (Subcommand == 'message') {
			let ShoutMessage = Args.getString('message');

			try {
				await Noblox.shout(GroupId, ShoutMessage);
			} catch (Error) {
				console.log(Chalk.red(`Shout Error: ${Error}`));
				let ErrorEmbed = new Embed('Error');
				ErrorEmbed.setDescription(String(Error));
				await ErrorEmbed.AddFooter();
				return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
			}

			let SuccessEmbed = new Embed('Success');
			SuccessEmbed.setDescription(`Successfully posted shout: \n\`\`\`${ShoutMessage}\`\`\``);
			await SuccessEmbed.AddFooter();
			Interaction.reply({ embeds: [SuccessEmbed] });

			if (LogChannelId) {
				Client.Modules.Logger.LogAction('Shout Posted', {
					Admin: `<@${Interaction.user.id}> (\`${Interaction.user.id}\`)`,
					Message: `\`\`\`${ShoutMessage}\`\`\``,
				});
			}
		} else if (Subcommand == 'clear') {
			try {
				await Noblox.shout(GroupId, '');
			} catch (Error) {
				console.log(Chalk.red(`Shout Error: ${Error}`));
				let ErrorEmbed = new Embed('Error');
				ErrorEmbed.setDescription(String(Error));
				await ErrorEmbed.AddFooter();
				return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
			}

			let SuccessEmbed = new Embed('Success');
			SuccessEmbed.setDescription('Successfully cleared the shout!');
			await SuccessEmbed.AddFooter();
			Interaction.reply({ embeds: [SuccessEmbed] });

			if (LogChannelId) {
				Client.Modules.Logger.LogAction('Shout Cleared', {
					Admin: `<@${Interaction.user.id}> (\`${Interaction.user.id}\`)`,
				});
			}
		}
	}
}
