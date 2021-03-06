import { GameBadge, GameUserBadge } from "../../../../structures/game/Badge";
import { GameProfile } from "../../../../structures/game/Profile";
import { BadgeGet } from "../../sql/game/badge/BadgeGet";
import { BadgeSet } from "../../sql/game/badge/BadgeSet";

export abstract class BadgeService {
  public static async createBadge(
    name: string,
    emoji: string
  ): Promise<GameBadge> {
    return await BadgeSet.createBadge(name, emoji);
  }

  public static async deleteBadge(badge: GameBadge): Promise<void> {
    return await BadgeSet.deleteBadge(badge);
  }

  public static async createUserBadge(
    profile: GameProfile,
    badge: GameBadge
  ): Promise<GameUserBadge> {
    return await BadgeSet.createUserBadge(profile, badge);
  }

  public static async deleteUserBadge(
    profile: GameProfile,
    badge: GameUserBadge
  ): Promise<void> {
    return await BadgeSet.deleteUserBadge(profile, badge);
  }

  public static async getBadgeById(id: number): Promise<GameBadge> {
    return await BadgeGet.getBadgeById(id);
  }

  public static async getUserBadgeById(id: number): Promise<GameUserBadge> {
    return await BadgeGet.getUserBadgeById(id);
  }

  public static async getProfileBadges(
    profile: GameProfile
  ): Promise<GameUserBadge[]> {
    return await BadgeGet.getProfileBadges(profile);
  }

  public static async getBadgeByName(
    name: string
  ): Promise<GameBadge | undefined> {
    return await BadgeGet.getBadgeByName(name);
  }

  public static async getBadgeByEmoji(
    emoji: string
  ): Promise<GameBadge | undefined> {
    return await BadgeGet.getBadgeByEmoji(emoji);
  }

  public static async getNumberOfBadgeGranted(
    badge: GameBadge
  ): Promise<number> {
    return await BadgeGet.getNumberOfBadgeGranted(badge);
  }
}
