import { URL } from 'url';

import { SlashCommandBuilder } from 'discord.js';

import { SlashCommand } from '../interfaces';

function validateURL(urlParam: string | null) {
  try {
    if (!urlParam) {
      return false;
    }
    // eslint-disable-next-line no-new
    new URL(urlParam);
    return true;
  } catch {
    return false;
  }
}

const login: SlashCommand = {
  slash: new SlashCommandBuilder()
    .setName('login')
    .setDescription('Test login form detections against a target URL.')
    .addUserOption((option) => {
      return option.setName('url').setDescription('The URL to test.').setRequired(true);
    }),

  async run(interaction) {
    try {
      const url = interaction.options.getString('url');
      const isValidURL = validateURL(url);

      if (isValidURL) {
        await fetch('https://api.github.com/repos/withuno/locust/dispatches', {
          method: 'POST',
          body: JSON.stringify({
            event_type: 'login_test',
            client_payload: { url },
          }),
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        interaction.reply({
          content: `Testing login element detections for: \`${url}\``,
        });
      } else {
        interaction.reply({
          content: `Please provide a valid URL. Received: \`${url}\``,
        });
      }
    } catch {
      // TODO: handle errors
    }
  },
};

export default login;
