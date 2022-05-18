import { Logger } from "winston";
import { Colors } from "../Color/Color";
import { CommandsManager } from "../Command/CommandsManager";
import Database from "../Database/Database";
import UID from "../UID/UID";
import VMServer from "../VM/VMServer";

export interface BotOptions {
    prefix: string;
    logger?: Logger;
    db: Database;
    commandsManager: CommandsManager;
    embedColors: Colors;
    vm: VMServer;
    uid: UID;
}