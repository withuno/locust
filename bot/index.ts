/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import fs from 'fs';
import path from 'path';

import { Client, GatewayIntentBits } from 'discord.js';

import { DiscordEvent } from './interfaces';

async function main() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const eventsPath = path.join(__dirname, './events');
  const eventFiles = await fs.promises.readdir(eventsPath);
  const events: DiscordEvent[] = eventFiles
    .map((filepath) => {
      return require(filepath).default;
    })
    .filter(Boolean);

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.run(...args));
    } else {
      client.on(event.name, (...args) => event.run(...args));
    }
  }

  await client.login(process.env.DISCORD_BOT_TOKEN);
}

main().catch((err) => {
  console.error('----- FATAL ERROR -----');
  console.error(err);
  process.exit(1);
});
