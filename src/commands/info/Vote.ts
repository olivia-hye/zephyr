import { Message } from "eris";
import { MessageEmbed } from "../../structures/client/RichEmbed";
import { Zephyr } from "../../structures/client/Zephyr";
import { BaseCommand } from "../../structures/command/Command";
import { GameProfile } from "../../structures/game/Profile";

export default class Vote extends BaseCommand {
  id = `runaway`;
  names = ["vote"];
  description = "Sends a link to Zephyr's voting page.";
  usage = ["$CMD$"];
  allowDm = true;

  async exec(msg: Message, _profile: GameProfile): Promise<void> {
    const prefix = Zephyr.getPrefix(msg.guildID);
    const embed = new MessageEmbed(`Vote`, msg.author).setDescription(
      `You receive **2** cubits every time you vote.\nThis is doubled on weekends!\n— [Click here to vote!](https://top.gg/bot/791100707629432863/vote)` +
        `\n\n**Cubits** can be spent on various cosmetic rewards for your cards.\nCheck the \`${prefix}shop\` to view a full list of items!`
    );

    await this.send(msg.channel, embed);
    return;
  }
}
