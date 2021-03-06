import { GameProfile } from "../../../../structures/game/Profile";
import { LeaderboardGet } from "../../sql/game/leaderboard/LeaderboardGet";

export abstract class LeaderboardService {
  public static async getBitLeaderboardCount(): Promise<number> {
    return await LeaderboardGet.getBitLeaderboardCount();
  }

  public static async getBitLeaderboard(
    page: number = 1
  ): Promise<GameProfile[]> {
    return await LeaderboardGet.getBitLeaderboard(page);
  }

  public static async getDailyStreakLeaderboardCount(): Promise<number> {
    return await LeaderboardGet.getDailyStreakLeaderboardCount();
  }

  public static async getDailyStreakLeaderboard(
    page: number = 1
  ): Promise<GameProfile[]> {
    return await LeaderboardGet.getDailyStreakLeaderboard(page);
  }

  public static async getCardLeaderboardCount(): Promise<number> {
    return await LeaderboardGet.getCardLeaderboardCount();
  }

  public static async getCardLeaderboard(
    page: number = 1
  ): Promise<{ profile: GameProfile; count: number }[]> {
    return await LeaderboardGet.getCardLeaderboard(page);
  }

  public static async getCubitLeaderboardCount(): Promise<number> {
    return await LeaderboardGet.getCubitLeaderboardCount();
  }

  public static async getCubitLeaderboard(
    page: number = 1
  ): Promise<GameProfile[]> {
    return await LeaderboardGet.getCubitLeaderboard(page);
  }
}
