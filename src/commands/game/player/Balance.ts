import { Message } from "eris";
import { ProfileService } from "../../../lib/database/services/game/ProfileService";
import { MessageEmbed } from "../../../structures/client/RichEmbed";
import { BaseCommand } from "../../../structures/command/Command";
import { GameProfile } from "../../../structures/game/Profile";
import * as ZephyrError from "../../../structures/error/ZephyrError";
import { Zephyr } from "../../../structures/client/Zephyr";

export default class Balance extends BaseCommand {
  id = `spirit`;
  names = ["balance", "bits", "$", "bal", "cubits"];
  description = "Shows you your balance.";
  allowDm = true;

  async exec(
    msg: Message,
    profile: GameProfile,
    options: string[]
  ): Promise<void> {
    let targetUser, targetProfile;
    if (msg.mentions[0]) {
      targetUser = msg.mentions[0];
      targetProfile = await ProfileService.getProfile(targetUser.id);
    } else if (!isNaN(parseInt(options[0]))) {
      if (options[0].length < 17) throw new ZephyrError.InvalidSnowflakeError();

      targetUser = await Zephyr.fetchUser(options[0]);
      if (!targetUser) throw new ZephyrError.InvalidSnowflakeError();

      targetProfile = await ProfileService.getProfile(targetUser.id);
    } else {
      targetUser = msg.author;
      targetProfile = profile;
    }

    if (targetProfile.private && targetProfile.discordId !== msg.author.id)
      throw new ZephyrError.PrivateProfileError(targetUser.tag);

    const embed = new MessageEmbed(`Balance`, msg.author)
      .setTitle(`${targetUser.tag}'s balance`)
      .addFields([
        {
          name: `${Zephyr.config.discord.emoji.blank} Bits`,
          value: `${
            Zephyr.config.discord.emoji.bits
          } \`${targetProfile.bits.toLocaleString()}\``,
          inline: true,
        },
        {
          name: `${Zephyr.config.discord.emoji.blank} Cubits`,
          value: `:package: \`${targetProfile.cubits.toLocaleString()}\``,
          inline: true,
        },
      ]);

    await this.send(msg.channel, embed);
    return;
  }
}
