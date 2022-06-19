import Axios from 'axios';
import Chalk from 'chalk';
import { GroupId, GuildId } from '../Config.js';

let GroupIcon = '';

const Module = {
	GetLinkedUser: async (UserId) => {
		let BloxlinkResponse;
		try {
			BloxlinkResponse = await Axios(`https://v3.blox.link/developer/discord/${UserId}?guild=${GuildId}`, {
				headers: {
					'api-key': process.env.BloxlinkKey,
				},
			});
		} catch (Error) {
			console.trace(Chalk.red(`Error getting linked account: ${Error}`));
			return {
				Success: false,
				Error: Error,
			};
		}

		if (!BloxlinkResponse.data.success) {
			return {
				Success: false,
				Error: Error,
			};
		}

		return {
			Success: true,
			RobloxId:
				Number(BloxlinkResponse.data.user.robloxId) ??
				Number(BloxlinkResponse.data.user.primaryAccount) ??
				null,
		};
	},
	GetGroupIcon: async () => {
		if (!GroupIcon) {
			let IconResponse;
			try {
				IconResponse = await Axios(
					`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${GroupId}&size=150x150&format=Png&isCircular=false`,
				);
			} catch (Error) {
				console.trace(Chalk.red(`Error getting group icon: ${Error}`));
				return '';
			}

			GroupIcon = IconResponse.data.data[0].imageUrl ?? '';
			return GroupIcon;
		} else return GroupIcon;
	},
};

export default Module;
