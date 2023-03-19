/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import fs from 'fs';
import path from 'path';

import { Events } from 'discord.js';

import { DiscordEvent, SlashCommand } from '../interfaces';

const interactionCreate: DiscordEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  async run(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const commandsPath = path.resolve(__dirname, '../commands');
    const commandFiles = await fs.promises.readdir(commandsPath);
    const commands: SlashCommand[] = commandFiles
      .map((filepath) => {
        return require(path.join(commandsPath, filepath))?.default;
      })
      .filter(Boolean);

    const cmd = commands.find(({ slash }) => {
      return interaction.commandName === slash.name;
    });

    if (!cmd) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await cmd.run(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};

export default interactionCreate;
