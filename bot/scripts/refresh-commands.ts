/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import fs from 'fs';
import path from 'path';

import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';

import { SlashCommand } from '../interfaces';

async function main() {
  const commandsPath = path.resolve(__dirname, '../commands');
  const commandFiles = await fs.promises.readdir(commandsPath);
  const commands: SlashCommand[] = commandFiles
    .map((filepath) => {
      return require(path.join(commandsPath, filepath))?.default;
    })
    .filter(Boolean);

  const commandData: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = commands.map((cmd) => {
    return cmd.slash.toJSON();
  });

  console.log(`◌ Refreshing ${commands.length} application command(s)...`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  const data: any = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commandData,
  });

  console.log(`◉ Refreshed ${data.length} application command(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
