import { Message } from "eris";
import { BaseCommand } from "../../../structures/command/Command";
import recipes from "../../../assets/recipes.json";
import { MessageEmbed } from "../../../structures/client/RichEmbed";
import { renderRecipe } from "../../../lib/utility/text/TextUtils";
import { Zephyr } from "../../../structures/client/Zephyr";

export default class ShowRecipes extends BaseCommand {
  id = `voyager`;
  names = ["recipes"];
  description = "Shows recipes available to craft.";
  allowDm = true;

  async exec(msg: Message): Promise<void> {
    const embed = new MessageEmbed(`Recipes`, msg.author);

    const prefix = Zephyr.getPrefix(msg.guildID!);

    for (let recipe of recipes) {
      embed.addField({
        name: recipe.name,
        value: `\`${prefix}craft ${recipe.query}\`\n` + renderRecipe(recipe),
        inline: true,
      });
    }

    await this.send(msg.channel, embed);
    return;
  }
}
