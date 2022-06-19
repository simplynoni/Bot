import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import Chalk from 'chalk';
import { Routes } from 'discord-api-types/v9';
import { Collection } from 'discord.js';
import { GuildId } from '../Config.js';

let Module = {
	Commands: [],
	CommandCollection: new Collection(),
	Rest: null,
	Start: async (Client) => {
		Client.on('interactionCreate', (Interaction) => {
			if (!Interaction.isCommand()) return;

			const Command = Module.CommandCollection.get(Interaction.commandName);
			if (!Command) return;
			Command.Execute(Client, Interaction, Interaction.options);
		});

		Module.Rest = new REST({ version: '9' }).setToken(Client.token);
	},
	RegisterCommand: async (Command) => {
		let CommandData = Command.CommandData;
		if (!CommandData.Name) {
			return console.trace(Chalk.red(`Command has no name!`));
		} else if (!CommandData.Description) {
			return console.trace(Chalk.red(`Command has no description!`));
		}

		let SlashCommand = new SlashCommandBuilder();
		SlashCommand.setName(CommandData.Name.toLowerCase());
		SlashCommand.setDescription(CommandData.Description);
		SlashCommand.setDefaultPermission(CommandData.DefaultPermission ?? true);

		if (CommandData.Subcommands) {
			CommandData.Subcommands.forEach(async (SubcommandData) => {
				if (!SubcommandData.Name) {
					return console.trace(Chalk.red(`Subcommand has no name!`));
				} else if (!CommandData.Description) {
					return console.trace(Chalk.red(`Subcommand has no description!`));
				}

				SlashCommand.addSubcommand((Subcommand) => {
					Subcommand.setName(SubcommandData.Name.toLowerCase());
					Subcommand.setDescription(SubcommandData.Description);

					if (SubcommandData.Options) {
						SubcommandData.Options.forEach(async (Option) => {
							Subcommand[`add${Option.Type}Option`]((SubcommandOption) => {
								SubcommandOption.setName(Option.Name);
								SubcommandOption.setDescription(Option.Description);
								SubcommandOption.setRequired(Option.Required ?? false);

								if (Option.Choices) {
									Option.Choices.forEach(async (Choice) => {
										SubcommandOption.addChoice(Choice.Name, Choice.Value);
									});
								}

								return SubcommandOption;
							});
						});
					}

					return Subcommand;
				});
			});
		} else if (CommandData.Options) {
			CommandData.Options.forEach(async (Option) => {
				SlashCommand[`add${Option.Type}Option`]((CommandOption) => {
					CommandOption.setName(Option.Name);
					CommandOption.setDescription(Option.Description);
					CommandOption.setRequired(Option.Required ?? false);

					if (Option.Choices) {
						Option.Choices.forEach(async (Choice) => {
							CommandOption.addChoice(Choice.Name, Choice.Value);
						});
					}

					return CommandOption;
				});
			});
		}
		Module.Commands.push(SlashCommand.toJSON());
		Module.CommandCollection.set(CommandData.Name, Command);
	},
	CreateCommands: async (Client) => {
		await Module.Rest.put(Routes.applicationGuildCommands(Client.user.id, GuildId), {
			body: Module.Commands,
		});
	},
};

export default Module;
