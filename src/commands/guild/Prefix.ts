import { Message } from "eris";
import { GuildService } from "../../lib/database/services/guild/GuildService";
import { BaseCommand } from "../../structures/command/Command";
import { GameProfile } from "../../structures/game/Profile";

export default class Prefix extends BaseCommand {
  names = ["prefix"];
  description =
    `Changes the prefix of the bot.` +
    `\nRequires the **Manage Channels** permission.`;

  async exec(
    msg: Message,
    _profile: GameProfile,
    options: string[]
  ): Promise<void> {
    const prefix = options[0];
    const guild = this.zephyr.guilds.get(msg.guildID!);
    const author = guild?.members.get(msg.author.id)!;
    if (!prefix) {
      const currentPrefix = this.zephyr.getPrefix(guild!.id);
      await this.send(msg.channel, `The current prefix is ${currentPrefix}`);
      return;
    }
    if (!author?.permission.json["manageChannels"]) return;

    await GuildService.setPrefix(guild!.id!, prefix);
    this.zephyr.setPrefix(guild!.id!, prefix);
    await this.send(msg.channel, `Set the prefix to ${prefix}`);
    return;
  }
}
