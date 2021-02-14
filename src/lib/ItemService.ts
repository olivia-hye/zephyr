import { PrefabItem } from "../structures/item/PrefabItem";

export class ItemService {
  public static items: PrefabItem[] = (require(`../assets/Items`) as {
    items: PrefabItem[];
  }).items;

  public static refreshItems(): void {
    delete require.cache[require.resolve(`../assets/Items`)];

    const { items } = require(`../assets/Items`) as { items: PrefabItem[] };
    this.items = items;
  }

  public static getItemById(id: number): PrefabItem | undefined {
    return this.items.find((i) => i.id === id);
  }

  public static getItemByName(name: string): PrefabItem | undefined {
    return this.items.find((i) =>
      i.names.map((i) => i.toLowerCase()).find((n) => name.toLowerCase() === n)
    );
  }
}
