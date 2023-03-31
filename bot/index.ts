/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import fs from 'fs';
import path from 'path';

import { Client, GatewayIntentBits, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import fastify from 'fastify';

import { DiscordEvent, SlashCommand } from './interfaces';

const symbols = {
  wait: '◌',
  complete: '◉',
};

/**
 * Start a `fastify` server to provide the app platform with health-checks.
 */
async function startServer() {
  const server = fastify();
  server.get('/', () => '[@withuno/locust] Locust Test Bot');
  await server.listen({
    host: '0.0.0.0',
    port: Number(process.env.PORT ?? 8080),
  });
}

/**
 * Update the Discord Bot with the latest slash commands spec.
 */
async function loadSlashCommands() {
  const commandsPath = path.resolve(__dirname, './commands');
  const commandFiles = await fs.promises.readdir(commandsPath);
  const commands: SlashCommand[] = commandFiles
    .map((filepath) => {
      return require(path.join(commandsPath, filepath))?.default;
    })
    .filter(Boolean);

  const commandData: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = commands.map((cmd) => {
    return cmd.slash.toJSON();
  });

  console.log(`${symbols.wait} Refreshing ${commands.length} application command(s)...`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  const data: any = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commandData,
  });

  console.log(`${symbols.complete} Refreshed ${data.length} application command(s)`);
}

/**
 * Bootstrap a Discord client & start listening for events.
 */
async function startDiscordClient() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const eventsPath = path.resolve(__dirname, './events');
  const eventFiles = await fs.promises.readdir(eventsPath);
  const events: DiscordEvent[] = eventFiles
    .map((filepath) => {
      return require(path.join(eventsPath, filepath))?.default;
    })
    .filter(Boolean);

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.run(...args));
    } else {
      client.on(event.name, (...args) => event.run(...args));
    }
  }

  await client.login(process.env.DISCORD_TOKEN);
}

async function main() {
  await loadSlashCommands();
  await startDiscordClient();
  await startServer();
}

main().catch((err) => {
  console.error('----- FATAL ERROR -----');
  console.error(err);
  process.exit(1);
});
