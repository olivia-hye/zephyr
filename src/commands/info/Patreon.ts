import { Message } from "eris";
import { MessageEmbed } from "../../structures/client/RichEmbed";
import { BaseCommand } from "../../structures/command/Command";

export default class Patreon extends BaseCommand {
  id = `crawling`;
  names = ["patreon", "donate", "kofi", "ko-fi"];
  description = "Sends a link to Zephyr's Patreon page.";
  usage = ["$CMD$"];
  allowDm = true;

  async exec(msg: Message): Promise<void> {
    const embed = new MessageEmbed(`Patreon`, msg.author).setDescription(
      `If you'd like to help fund the development of Zephyr and receive some cool perks, head over to the following link to become a patron!` +
        `\n— https://patreon.com/rtfl`
    );

    await this.send(msg.channel, embed);
    return;
  }
}
