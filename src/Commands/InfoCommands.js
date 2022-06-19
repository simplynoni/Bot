import Noblox from 'noblox.js';
import BaseCommand from '../Classes/BaseCommand.js';
import Embed from '../Classes/Embed.js';
import { GroupId } from '../Config.js';

export default class InfoCommand extends BaseCommand {
	constructor() {
		super({
			Name: 'info',
			Description: 'Returns info about a user.',
			Subcommands: [
				{
					Name: 'discord',
					Description: "Returns info about a Discord user's Roblox account.",
					Options: [
						{
							Name: 'user',
							Description: "The Discord user who's Roblox info will be retrieved.",
							Type: 'User',
							Required: true,
						},
					],
				},
				{
					Name: 'username',
					Description: 'Returns info about a Roblox user using their username.',
					Options: [
						{
							Name: 'username',
							Description: "The name of the Roblox user who's info will be retrieved.",
							Type: 'String',
							Required: true,
						},
					],
				},
				{
					Name: 'userid',
					Description: 'Returns info about a Roblox user using their user id.',
					Options: [
						{
							Name: 'userid',
							Description: "The id of the Roblox user who's info will be retrieved.",
							Type: 'Integer',
							Required: true,
						},
					],
				},
			],
		});
	}

	async _GetInfoEmbed(UserId) {
		let UserInfo = await Noblox.getPlayerInfo(UserId);
		let GroupRank = await Noblox.getRankInGroup(GroupId, UserId);
		let GroupRankName = await Noblox.getRankNameInGroup(GroupId, UserId);

		if (!UserInfo.isBanned) {
			let InfoEmbed = new Embed('Success');
			InfoEmbed.setTitle(`${UserInfo.username}'s Info`);
			InfoEmbed.addField('DisplayName', UserInfo.displayName, true);
			InfoEmbed.addField('Username', `@${UserInfo.username}`, true);
			InfoEmbed.addField('UserId', String(UserId), true);
			if (GroupRank != 0) {
				InfoEmbed.addField('Group Rank', `${GroupRankName} (${GroupRank})`, true);
			}
			InfoEmbed.addField('Join Date', `<t:${Math.floor(UserInfo.joinDate.getTime() / 1000)}:D>`, true);
			InfoEmbed.addField('Friends', String(UserInfo.friendCount ?? 0), true);
			InfoEmbed.addField('Followers', String(UserInfo.followerCount ?? 0), true);
			InfoEmbed.setThumbnail(
				// this api is probably gonna get deprecated eventually
				`https://www.roblox.com/headshot-thumbnail/image?userId=${UserId}&width=420&height=420&format=png `,
			);
			await InfoEmbed.AddFooter();
			return InfoEmbed;
		} else {
			let InfoEmbed = new Embed('Error');
			InfoEmbed.setTitle(`${UserInfo.username}'s Info`);
			InfoEmbed.setDescription('**This user is banned. Some information might not be available.**');
			InfoEmbed.addField('DisplayName', UserInfo.displayName, true);
			InfoEmbed.addField('Username', `@${UserInfo.username}`, true);
			InfoEmbed.addField('UserId', String(UserId), true);
			if (GroupRank != 0) {
				InfoEmbed.addField('Group Rank', `${GroupRankName} (${GroupRank})`, true);
			}
			InfoEmbed.addField('Join Date', `<t:${Math.floor(UserInfo.joinDate.getTime() / 1000)}:D>`, true);
			InfoEmbed.addField('Banned', 'True', true);
			InfoEmbed.setThumbnail(
				`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&userid=${UserInfo.UserId}`,
			);
			await InfoEmbed.AddFooter();
			return InfoEmbed;
		}
	}

	async Execute(Client, Interaction, Args) {
		let Subcommand = Args.getSubcommand();

		if (Subcommand == 'discord') {
			let DiscordUser = Args.getUser('user');

			let VerifyResponse = await Client.Modules.Utils.GetLinkedUser(DiscordUser.id);

			if (!VerifyResponse.Success) {
				let ErrorEmbed = new Embed('Error');
				ErrorEmbed.setDescription("There was an error getting that user's Roblox id. Try again later.");
				await ErrorEmbed.AddFooter();
				return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
			} else if (!VerifyResponse.RobloxId) {
				let ErrorEmbed = new Embed('Error');
				ErrorEmbed.setTitle('User Not Verified');
				ErrorEmbed.setDescription("That user isn't verified with [Bloxlink](https://blox.link).");
				await ErrorEmbed.AddFooter();
				return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
			}

			let InfoEmbed = await this._GetInfoEmbed(VerifyResponse.RobloxId);
			Interaction.reply({ embeds: [InfoEmbed] });
		} else if (Subcommand == 'username') {
			let Username = Args.getString('username');
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

			let InfoEmbed = await this._GetInfoEmbed(UserId);
			Interaction.reply({ embeds: [InfoEmbed] });
		} else if (Subcommand == 'userid') {
			let UserId = Args.getInteger('userid');

			try {
				await Noblox.getUsernameFromId(UserId);
			} catch (Error) {
				let ErrorEmbed = new Embed('Error');
				ErrorEmbed.setTitle("User Doesn't Exist");
				ErrorEmbed.setDescription(`The user that you specified (\`${UserId}\`) doesn't exist.`);
				await ErrorEmbed.AddFooter();
				return Interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
			}

			let InfoEmbed = await this._GetInfoEmbed(UserId);
			Interaction.reply({ embeds: [InfoEmbed] });
		}
	}
}
