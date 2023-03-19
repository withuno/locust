import { Events } from 'discord.js';

import { DiscordEvent } from '../interfaces';

const ready: DiscordEvent<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  async run(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};

export default ready;
