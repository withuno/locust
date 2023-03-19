import fs from 'fs';
import path from 'path';

import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';

import { SlashCommand } from '../interfaces';

async function main() {
  const commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    // eslint-disable-next-line no-await-in-loop
    const command = (await import(`../commands/${file}`)).default as SlashCommand;
    commands.push(command.slash.toJSON());
  }

  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);
  const data: any = await rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID!), {
    body: commands,
  });

  console.log(`Successfully refreshed ${data.length} application (/) commands.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
