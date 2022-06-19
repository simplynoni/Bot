import Chalk from 'chalk';
import Noblox from 'noblox.js';
import BaseCommand from '../Classes/BaseCommand.js';
import Embed from '../Classes/Embed.js';
import { GroupId, LogChannelId, MaxRank } from '../Config.js';

export default class PromoteCommand extends BaseCommand {
	constructor() {
		super({
			Name: 'promote',
			Description: 'Promotes a user in the Roblox group.',
			DefaultPermission: false,
			Options: [
				{
					Name: 'user',
					Description: 'The user to promote.',
					Type: 'String',
					Required: true,
				},
			],
		});
	}

	async Execute(Client, Interaction, Args) {
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

		let RankInGroup = await Noblox.getRankInGroup(GroupId, UserId);
		if (RankInGroup >= MaxRank) {
			let ErrorEmbed = new Embed('Error');
			ErrorEmbed.setTitle("User Cant't Be Ranked");
			ErrorEmbed.setDescription(
				`The user that you specified (\`${Username}\`) can't be ranked because they are a higher rank than this bot.`,
			);
			await ErrorEmbed.AddFooter();
			return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
		} else if (RankInGroup == 0) {
			let ErrorEmbed = new Embed('Error');
			ErrorEmbed.setTitle('User Not In Group');
			ErrorEmbed.setDescription(`The user that you specified (\`${Username}\`) isn't in the group.`);
			await ErrorEmbed.AddFooter();
			return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
		}

		let RankResponse;
		let RankNameInGroup = await Noblox.getRankNameInGroup(GroupId, UserId);
		try {
			RankResponse = await Noblox.promote(GroupId, UserId);
		} catch (Error) {
			console.log(Chalk.red(`Promote Error: ${Error}`));
			let ErrorEmbed = new Embed('Error');
			ErrorEmbed.setDescription(String(Error));
			await ErrorEmbed.AddFooter();
			return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
		}

		Username = await Noblox.getUsernameFromId(UserId);

		let SuccessEmbed = new Embed('Success');
		SuccessEmbed.setDescription(`Successfully promoted ${Username}!`);
		SuccessEmbed.setThumbnail(
			`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${Username}`,
		);
		SuccessEmbed.addFields(
			{ name: 'Old Rank', value: `${RankNameInGroup} (${RankInGroup})` },
			{ name: 'New Rank', value: `${RankResponse.newRole.name} (${RankResponse.newRole.rank})` },
		);
		await SuccessEmbed.AddFooter();
		Interaction.reply({ embeds: [SuccessEmbed] });

		if (LogChannelId) {
			Client.Modules.Logger.LogAction(
				'User Promoted',
				{
					Admin: `<@${Interaction.user.id}> (\`${Interaction.user.id}\`)`,
					User: `${Username} (\`${UserId}\`)`,
					'Old Rank': `${RankNameInGroup} (${RankInGroup})`,
					'New Rank': `${RankResponse.newRole.name} (${RankResponse.newRole.rank})`,
				},
				`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${Username}`,
			);
		}
	}
}
