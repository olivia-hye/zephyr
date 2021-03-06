import { Message } from "eris";
import { GameItem } from "../../../../structures/game/Item";
import { GameProfile } from "../../../../structures/game/Profile";
import { GameUserCard } from "../../../../structures/game/UserCard";
import { ACGet } from "../../sql/meta/anticheat/ACGet";
import { ACSet } from "../../sql/meta/anticheat/ACSet";

export abstract class AnticheatService {
  public static async logGift(
    giver: GameProfile,
    recipient: GameProfile,
    cards: GameUserCard[],
    guildId: string
  ): Promise<void> {
    return await ACSet.logGift(giver, recipient, cards, guildId);
  }

  public static async logClaim(
    claimer: GameProfile,
    dropper: GameProfile | undefined,
    card: GameUserCard,
    claimTime: number,
    dropTime: number,
    guildId: string,
    fightCount: number,
    claimedAfter: number
  ): Promise<void> {
    return await ACSet.logClaim(
      claimer,
      dropper,
      card,
      claimTime,
      dropTime,
      guildId,
      fightCount,
      claimedAfter
    );
  }

  public static async logBitTransaction(
    giver: GameProfile,
    recipient: GameProfile,
    amount: number,
    guildId: string
  ): Promise<void> {
    return await ACSet.logBitTransaction(giver, recipient, amount, guildId);
  }

  public static async logItemTransaction(
    giver: GameProfile,
    recipient: GameProfile,
    items: GameItem[],
    guildId: string
  ): Promise<void> {
    return await ACSet.logItemTransaction(giver, recipient, items, guildId);
  }

  public static async logTrade(
    sender: GameProfile,
    receiver: GameProfile,
    senderCard: GameUserCard,
    receiverCard: GameUserCard,
    guildId: string
  ): Promise<void> {
    return await ACSet.logTrade(
      sender,
      receiver,
      senderCard,
      receiverCard,
      guildId
    );
  }

  public static async logVote(
    voter: GameProfile,
    isWeekend: boolean
  ): Promise<void> {
    return await ACSet.logVote(voter, isWeekend);
  }

  /*
      Stat Getters
  */
  public static async getNumberOfClaimedCards(
    profile: GameProfile
  ): Promise<number> {
    return await ACGet.getNumberOfClaimedCards(profile);
  }

  public static async getNumberOfVotes(profile: GameProfile): Promise<number> {
    return await ACGet.getNumberOfVotes(profile);
  }

  public static async getNumberOfCardsGifted(
    profile: GameProfile
  ): Promise<number> {
    return await ACGet.getNumberOfCardsGifted(profile);
  }

  public static async getNumberOfCardsReceivedByGift(
    profile: GameProfile
  ): Promise<number> {
    return await ACGet.getNumberOfCardsReceivedByGift(profile);
  }

  public static async getClaimInformation(
    card: GameUserCard
  ): Promise<{
    id: number;
    claimer: string;
    dropper: string;
    card_id: number;
    guild_id: string;
    claim_time: string;
    drop_time: string;
    fight_count: number;
    wear: number;
    claimed_after: number;
  }> {
    return await ACGet.getClaimInformation(card);
  }

  public static async logMultitrade(
    senderItems: TradeItemResolvable[],
    receiverItems: TradeItemResolvable[],
    sender: GameProfile,
    receiver: GameProfile
  ): Promise<void> {
    return await ACSet.logMultitrade(
      senderItems,
      receiverItems,
      sender,
      receiver
    );
  }

  public static async logBurn(
    profile: GameProfile,
    cards: GameUserCard[]
  ): Promise<void> {
    return await ACSet.logBurn(profile, cards);
  }

  public static async getNumberOfCardsBurned(
    profile: GameProfile
  ): Promise<number> {
    return await ACGet.getNumberOfCardsBurned(profile);
  }

  public static async logCommand(
    commandId: string,
    message: Message,
    parameters: string,
    error: boolean
  ): Promise<void> {
    return await ACSet.logCommand(commandId, message, parameters, error);
  }
}
