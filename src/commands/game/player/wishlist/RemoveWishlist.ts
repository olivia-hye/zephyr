import { Message } from "eris";
import { ProfileService } from "../../../../lib/database/services/game/ProfileService";
import { MessageEmbed } from "../../../../structures/client/RichEmbed";
import { BaseCommand } from "../../../../structures/command/Command";
import { GameProfile } from "../../../../structures/game/Profile";
import * as ZephyrError from "../../../../structures/error/ZephyrError";
import { MessageCollector } from "eris-collector";
import { GameIdol } from "../../../../structures/game/Idol";
import { getGroupsByIdolId } from "../../../../lib/utility/text/TextUtils";
import { WishlistError } from "../../../../structures/error/WishlistError";
import { Zephyr } from "../../../../structures/client/Zephyr";

export default class RemoveWishlist extends BaseCommand {
  id = `combat`;
  names = ["wishremove", "wr"];
  usage = [`$CMD$ <idol>`];
  description = "Removes an idol from your wishlist.";
  allowDm = true;

  async exec(
    msg: Message,
    profile: GameProfile,
    options: string[]
  ): Promise<void> {
    const wishlist = await ProfileService.getWishlist(profile);

    if (wishlist.length === 0) {
      const prefix = Zephyr.getPrefix(msg.guildID);
      throw new WishlistError.WishlistEmptyError(prefix);
    }

    if (!options[0]) throw new ZephyrError.InvalidIdolError();

    const nameQuery = options.join(" ").toLowerCase();

    const matches: GameIdol[] = [];

    Zephyr.getCards()
      .filter((c) => `${c.group} ${c.name}`.toLowerCase().includes(nameQuery))
      .map((c) => Zephyr.getIdol(c.idolId))
      .filter((c) => c)
      .forEach((c) => {
        if (!matches.find((m) => m.id === c!.id)) matches.push(c!);
      });

    if (matches.length === 0) throw new ZephyrError.UnknownIdolError();

    const matchesOnWishlist = matches.filter((i) =>
      wishlist.find((w) => w.idolId === i.id)
    );

    if (matchesOnWishlist.length === 0)
      throw new WishlistError.IdolNotOnWishlistError();

    if (matches.length > 25) throw new ZephyrError.LookupQueryTooBroadError();

    let removalTarget: GameIdol;

    if (matches.length === 1) {
      removalTarget = matches[0];
    } else {
      const embed = new MessageEmbed(
        `Wishlist Remove`,
        msg.author
      ).setDescription(
        `I found multiple matches for \`${nameQuery}\`.\nPlease choose a number corresponding to the desired idol.\n${matches
          .map((u, index) => {
            const groups = getGroupsByIdolId(u.id, Zephyr.getCards());

            return `— \`${index + 1}\` **${u.name}**${
              groups.length === 0 ? `` : ` (${groups.join(`, `)})`
            }`;
          })
          .join("\n")}`
      );

      const confirmation = await this.send(msg.channel, embed);

      const choice: GameIdol | undefined = await new Promise(
        async (res, _req) => {
          const filter = (m: Message) =>
            matches[parseInt(m.content, 10) - 1] &&
            m.author.id === msg.author.id;

          const collector = new MessageCollector(Zephyr, msg.channel, filter, {
            time: 30000,
            max: 1,
          });

          collector.on("error", async (e: Error) => {
            await this.handleError(msg, msg.author, e);
          });

          collector.on("collect", async (m: Message) => {
            const index = matches[parseInt(m.content, 10) - 1];

            if (!index) res(undefined);

            res(index);
          });

          collector.on("end", async (_c: any, reason: string) => {
            if (reason === "time") res(undefined);
          });
        }
      );

      if (!choice) {
        await confirmation.edit({
          embed: embed.setFooter(`🕒 This search has timed out.`),
        });
        return;
      }

      removalTarget = choice;
      await this.delete(confirmation);
    }

    const exists = wishlist.find((wl) => wl.idolId === removalTarget.id);

    const groups = getGroupsByIdolId(removalTarget.id, Zephyr.getCards());

    if (!exists) throw new WishlistError.IdolNotOnWishlistError();

    await ProfileService.removeFromWishlist(profile, removalTarget.id);

    const embed = new MessageEmbed(
      `Wishlist Remove`,
      msg.author
    ).setDescription(
      `Removed **${removalTarget.name}**${
        groups.length === 0 ? `` : ` (${groups.join(`, `)})`
      } from your wishlist.`
    );

    await this.send(msg.channel, embed);
    return;
  }
}
