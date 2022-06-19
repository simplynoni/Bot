import Noblox from 'noblox.js';
import BaseCommand from '../Classes/BaseCommand.js';
import Embed from '../Classes/Embed.js';

export default class GameCommand extends BaseCommand {
	constructor() {
		super({
			Name: 'game',
			Description: 'Commands that interact with the Roblox game.',
			DefaultPermission: false,
			Subcommands: [
				{
					Name: 'kick',
					Description: 'Kicks a user from the Roblox game.',
					Options: [
						{
							Name: 'user',
							Description: 'The user to kick.',
							Type: 'String',
							Required: true,
						},
					],
				},
			],
		});
	}

	//WIP
	async Execute(Client, Interaction, Args) {
		let Subcommand = Args.getSubcommand();

		if (Subcommand == 'kick') {
			let Username = Args.getString('user');

			let UserId;
			try {
				UserId = await Noblox.getIdFromUsername(Username);
			} catch (Error) {
				let ErrorEmbed = new Embed('Error');
				ErrorEmbed.setTitle("User Doesn't Exist");
				ErrorEmbed.setDescription(`The user that you specified (\`${Username}\`) doesn't exist.`);
				await ErrorEmbed.AddFooter();
				return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
			}

			Client.Modules.LongPolling.Send('Kick', { UserId: UserId });

			let SuccessEmbed = new Embed('Success');
			SuccessEmbed.setDescription(`Successfully kicked ${Username}!`);
			SuccessEmbed.setThumbnail(
				`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${Username}`,
			);
			await SuccessEmbed.AddFooter();
			Interaction.reply({ embeds: [SuccessEmbed] });
		}
	}
}
