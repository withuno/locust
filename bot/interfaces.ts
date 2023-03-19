import { ChatInputCommandInteraction, ClientEvents, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
  slash: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  run: (interaction: ChatInputCommandInteraction) => Promise<any>;
}

export interface DiscordEvent<EventName extends keyof ClientEvents = keyof ClientEvents> {
  name: EventName;
  once?: boolean;
  run(...args: ClientEvents[EventName]): Promise<void> | void;
}
