export const Port = 5000;

export const GroupId = 0;
export const MaxRank = 255;
export const DemoteRank = 0;

export const GuildId = '0';
export const LogChannelId = '0';

export const Colors = {
	Primary: '#FF9B45',
	Secondary: '#914DFF',
	Error: '#FF4D4D',
};
export const EmbedTypes = {
	Success: {
		Title: 'Success',
		Footer: {
			Text: 'Group Name',
			Icon: 'Group',
		},
		Color: Colors.Primary,
	},
	Error: {
		Title: 'Error',
		Footer: {
			Text: 'Group Name',
			Icon: 'Group',
		},
		Color: Colors.Error,
	},
	Log: {
		Footer: {
			Text: 'Group Name',
			Icon: 'Group',
		},
		Color: Colors.Secondary,
	},
};
