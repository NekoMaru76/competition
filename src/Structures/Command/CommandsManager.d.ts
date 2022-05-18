import { Logger } from "winston";
import Command from "./Command";

export interface CommandsManagerOptions {
    logger?: Logger;
    commands?: Record<string, Command>;
}