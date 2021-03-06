import { Message, User } from "eris";
import { addReaction } from "../../lib/discord/message/addReaction";
import { createMessage } from "../../lib/discord/message/createMessage";
import { deleteMessage } from "../../lib/discord/message/deleteMessage";
import { editMessage } from "../../lib/discord/message/editMessage";
import { MessageEmbed } from "../client/RichEmbed";
import { GameProfile } from "../game/Profile";

export interface Command {
  id?: string;
  names: string[];
  description: string;
  usage: string[];
  subcommands: string[];
  allowDm: boolean;
  exec(msg: Message, profile: GameProfile, options: string[]): Promise<void>;
}

export abstract class BaseCommand implements Command {
  id?: string;
  names: string[] = [];
  description: string = "This command has no description!";
  usage: string[] = [];
  subcommands: string[] = [];
  allowDm = false;
  developerOnly = false;
  moderatorOnly = false;

  path: string | undefined; // Used for "hot-swapping" commands... weird?

  disabled = false;
  disabledMessage = `This command is currently disabled.`;

  abstract exec(
    msg: Message,
    profile: GameProfile,
    options: string[]
  ): Promise<void>;

  public async run(msg: Message, profile: GameProfile) {
    let options = [];

    for (const [index, option] of msg.content.split(` `).entries()) {
      if (index === 0 && option.includes(`\n`)) {
        const splitOptions = option.split(`\n`).slice(1);

        for (let splitOption of splitOptions) {
          options.push(splitOption);
        }
        continue;
      }
      options.push(option.trim());
    }

    // Parses out the command itself and removes empty elements
    options = options.slice(1).filter((o) => o);

    await this.exec(msg, profile, options);
  }

  public selfDestruct(): string {
    return "💥 Self destructing...";
  }

  public async handleError(
    msg: Message,
    user: User,
    error: Error
  ): Promise<void> {
    const embed = new MessageEmbed(`Error`, user).setDescription(error.message);
    await createMessage(msg.channel, embed);
    return;
  }

  public send = createMessage;
  public react = addReaction;
  public edit = editMessage;
  public delete = deleteMessage;
}
