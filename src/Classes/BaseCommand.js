import Chalk from 'chalk';

export default class BaseCommand {
	constructor(CommandData) {
		this.CommandData = CommandData;
		this.CommandData.Name = CommandData.Name ?? '';
		this.CommandData.Description = CommandData.Description ?? '';
		this.CommandData.DefaultPermission = CommandData.DefaultPermission ?? true;
		this.CommandData.Subcommands = CommandData.Subcommands ?? null;
		this.CommandData.Options = CommandData.Options ?? [];
	}

	async Init(Client) {
		if (!this.CommandData.Name) {
			return console.log(Chalk.red(`${this.constructor.name} has no name!`));
		} else if (!this.CommandData.Description) {
			return console.log(Chalk.red(`${this.constructor.name} has no description!`));
		}

		await Client.Modules.CommandHandler.RegisterCommand(this);
	}
}
