import { Message, User } from "eris";
import { ProfileService } from "../../../lib/database/services/game/ProfileService";
import { BaseCommand } from "../../../structures/command/Command";
import { GameProfile } from "../../../structures/game/Profile";
import * as ZephyrError from "../../../structures/error/ZephyrError";
import { MessageEmbed } from "../../../structures/client/RichEmbed";
import { BadgeService } from "../../../lib/database/services/game/BadgeService";
import { Zephyr } from "../../../structures/client/Zephyr";

export default class UngrantBadge extends BaseCommand {
  names = [`ungrant`];
  description = `Takes a badge away.`;
  usage = [`$CMD$ <@mention/user id> <badge name>`];
  allowDm = true;
  developerOnly = true;

  async exec(
    msg: Message,
    _profile: GameProfile,
    options: string[]
  ): Promise<void> {
    if (!options[0]) throw new ZephyrError.InvalidMentionError();
    if (!options[1]) throw new ZephyrError.InvalidBadgeNameError();

    let targetUser: User;
    let targetProfile: GameProfile | undefined;

    if (msg.mentions[0]) {
      targetUser = msg.mentions[0];
    } else if (options[0]) {
      if (
        isNaN(parseInt(options[0], 10)) ||
        options[0].length < 17 ||
        options[0].length > 18
      )
        throw new ZephyrError.InvalidMentionError();

      const fetchUser = await Zephyr.fetchUser(options[0]);

      if (!fetchUser) throw new ZephyrError.UserNotFoundError();

      targetUser = fetchUser;
    } else throw new ZephyrError.InvalidMentionError();

    targetProfile = await ProfileService.getProfile(targetUser.id);

    const badgeName = options.slice(1).join(` `);

    const targetBadge = await BadgeService.getBadgeByName(badgeName);

    if (!targetBadge) throw new ZephyrError.BadgeNameNotFoundError(badgeName);

    const profileBadges = await BadgeService.getProfileBadges(targetProfile);

    const targetUserBadge = profileBadges.find(
      (b) => b.badgeId === targetBadge.id
    );
    if (!targetUserBadge)
      throw new ZephyrError.UserLacksBadgeError(targetUser, targetBadge);

    await BadgeService.deleteUserBadge(targetProfile, targetUserBadge);

    const embed = new MessageEmbed(`Ungrant Badge`, msg.author).setDescription(
      `${targetBadge.badgeEmoji} **${targetBadge.badgeName}** was removed from **${targetUser.tag}**.`
    );

    await this.send(msg.channel, embed);
    return;
  }
}
