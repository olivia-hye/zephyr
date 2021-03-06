import { Message } from "eris";
import * as ZephyrError from "../../../structures/error/ZephyrError";
import { retryOperation } from "../Retry";
import { StatsD } from "../../StatsD";
import { Logger } from "../../logger/Logger";

export async function deleteMessage(message: Message): Promise<void> {
  StatsD.increment(`zephyr.message.delete`, 1);
  await retryOperation(async () => message.delete(), 10000, 3).catch((e) => {
    Logger.error(
      `Failed trying to delete message ${message.id}. Full stack:\n${e.stack}`
    );
    throw new ZephyrError.FailedToDeleteMessageError();
  });

  return;
}
