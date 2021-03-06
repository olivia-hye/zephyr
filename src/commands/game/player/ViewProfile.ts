import { Message, User } from "eris";
import { ProfileService } from "../../../lib/database/services/game/ProfileService";
import { MessageEmbed } from "../../../structures/client/RichEmbed";
import { BaseCommand } from "../../../structures/command/Command";
import { GameProfile } from "../../../structures/game/Profile";
import * as ZephyrError from "../../../structures/error/ZephyrError";
import { CardService } from "../../../lib/database/services/game/CardService";
import { Zephyr } from "../../../structures/client/Zephyr";
import { getTruncatedDescription } from "../../../lib/utility/text/TextUtils";

export default class ViewProfile extends BaseCommand {
  id = `reagan`;
  names = ["profile", "p"];
  usage = ["$CMD$", "$CMD$ <@mention>", "$CMD$ <id>"];
  description = "Displays your profile.";
  allowDm = true;

  async exec(
    msg: Message,
    profile: GameProfile,
    options: string[]
  ): Promise<void> {
    let target: GameProfile | undefined;
    let targetUser: User | undefined;
    if (options[0]) {
      if (!isNaN(parseInt(options[0], 10))) {
        const userId = options[0];
        if (userId.length < 17) throw new ZephyrError.InvalidSnowflakeError();

        targetUser = await Zephyr.fetchUser(userId);
      } else if (msg.mentions[0]) {
        targetUser = msg.mentions[0];
      } else throw new ZephyrError.InvalidMentionError();
    } else {
      targetUser = msg.author;
      target = profile;
    }

    if (!targetUser) throw new ZephyrError.UserNotFoundError();

    if (!target) target = await ProfileService.getProfile(targetUser.id);

    if (
      target.private &&
      target.discordId !== msg.author.id &&
      !Zephyr.config.moderators.includes(msg.author.id) &&
      !Zephyr.config.developers.includes(msg.author.id)
    )
      throw new ZephyrError.PrivateProfileError(targetUser.tag);

    const cardsAmount = await CardService.getUserInventorySize(target, [], {});

    const targetIsSender = target.discordId === msg.author.id;

    let description =
      `**Blurb**` +
      `\n${target.blurb || "*No blurb set*"}` +
      `\n\n— ${targetIsSender ? `You have` : `${targetUser.tag} has`} ${
        Zephyr.config.discord.emoji.bits
      } **${target.bits.toLocaleString()}**.` +
      `\n— ${
        targetIsSender ? `You have` : `${targetUser.tag} has`
      } **${target.cubits.toLocaleString()}** cubit${
        target.cubits === 1 ? `` : `s`
      }.` +
      `\n— ${
        targetIsSender ? `You have` : `${targetUser.tag} has`
      } **${cardsAmount.toLocaleString()}** card${
        cardsAmount === 1 ? `` : `s`
      }.`;

    if (target.activeCard) {
      const card = await CardService.getUserCardById(target.activeCard);

      description += `\n\n**Active Card**\n${getTruncatedDescription(card)}`;
    } else {
      const prefix = Zephyr.getPrefix(msg.guildID);

      description += `\n\n**Active Card**\nNo active card set!\nUse \`${prefix}setactive <card>\` to start gaining XP!`;
    }

    const embed = new MessageEmbed(`Profile`, msg.author)
      .setTitle(`${targetUser.tag}'s Profile`)
      .setDescription(description);

    let footer = `User ID: ${targetUser.id}`;

    if (target.discordId === msg.author.id && profile.private)
      footer += `\nYour profile is currently private.`;

    embed.setFooter(footer);

    await this.send(msg.channel, embed);
    return;
  }
}
