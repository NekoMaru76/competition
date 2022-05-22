import { User } from "discord.js";
import Bot from "../../Structures/Bot/Bot";
import Argument from "../../Structures/Command/Argument";
import { CallbackFunctionOptions, Callback } from "../../Structures/Command/Callback";
import Battle from "../../Structures/Game/Battle/Battle";
import Team from "../../Structures/Game/Battle/BattleTeam";
import { ComputerPlayer } from "../../Structures/Game/Battle/ComputerPlayer";
import HumanPlayer from "../../Structures/Game/Battle/HumanPlayer";
import Integer from "../../Structures/Types/Integer";
import Text from "../../Structures/Types/Text";

const hp = {
    current: 3,
    max: 3
};
const inBattleOnly = (bot: Bot, user: User): void => {
    if (!bot.playersBattles.has(user.id)) throw `User is not in a battle`;
};
const ownerOnly = (battle: Battle, user: User): void => {
    if (battle.data.ownerId !== user.id) throw `User is not owner`;
};
const battleIsNotStarted = (battle: Battle): void => {
    if (battle.round.started) throw `The battle is started already`;
};
const notInBattleOnly = (bot: Bot, user: User): void => {
    if (bot.playersBattles.has(user.id)) throw `User is in a battle`;
};

const callbacks: Callback[] = [
    {
        async func({
            msg,
            bot
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);
            await msg.author.send({
                embeds: [
                    bot.playersBattles.get(msg.author.id).toEmbed()
                ]
            });
        },
        args: [
            new Argument(new Text(["info-battle"]), "Type")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);
            await msg.author.send({
                embeds: [
                    bot.playersBattles.get(msg.author.id).data.teams[testArgs[1].val].toEmbed(bot.embedColors.Base)
                ]
            });
        },
        args: [
            new Argument(new Text(["info-team"]), "Type"),
            new Argument(new Text, "Team ID")
        ]
    },
    {
        async func({
            msg,
            bot
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);
            
            const battle = bot.playersBattles.get(msg.author.id); 

            await msg.author.send({
                embeds: [
                    battle.roundToEmbed()
                ]
            });
        },
        args: [
            new Argument(new Text(["info-problem"]), "Type")
        ]
    },
    {
        async func({
            msg,
            bot,
            restArgs,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);
            await bot.playersBattles.get(msg.author.id).round.submit(msg.author.id, [testArgs[1].val, ...restArgs].join(" "));
            await msg.author.send("Submitted.");
        },
        args: [
            new Argument(new Text(["submit"]), "Type"),
            new Argument(new Text, "code")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs,
            restArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);

            const battle = bot.playersBattles.get(msg.author.id);

            ownerOnly(battle, msg.author);
            battleIsNotStarted(battle);

            const name = [testArgs[1].val, ...restArgs].join(" ");
            const id = bot.uid.gen();
            const team = new Team(id, {
                name,
                players: {}
            });

            battle.addTeams([team]);
            await msg.channel.send(`Created a team with ID ${id}`);
        },
        args: [
            new Argument(new Text(["create-team"]), "Type"),
            new Argument(new Text, "Team Name")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);

            const battle = bot.playersBattles.get(msg.author.id);

            ownerOnly(battle, msg.author);
            battleIsNotStarted(battle);

            const id = testArgs[1].val;
            const team = battle.data.teams[id];

            if (!team) throw `Cannot found a team with ID ${id}`;
            if (Object.keys(team.data.players).length) throw `Room is not empty`;

            await msg.channel.send(`Removed a team with ID ${id}`);
        },
        args: [
            new Argument(new Text(["delete-team"]), "Type"),
            new Argument(new Text, "Team ID")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);

            const battle = bot.playersBattles.get(msg.author.id);

            ownerOnly(battle, msg.author);
            battleIsNotStarted(battle);

            const id = testArgs[1].val;
            const player = battle.data.players[id];

            if (id === msg.author.id) throw `You can't kick yourself`;
            if (!player) throw `Cannot found a player with ID ${id}`;

            battle.rmPlayers([player]);
            await msg.channel.send(`Kicked player with ID ${id}`);

            try {
                await player.send(bot, { content: "You have been kicked from a battle" });
            } catch {}
        },
        args: [
            new Argument(new Text(["kick-player"]), "Type"),
            new Argument(new Text, "Player ID")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);

            const battle = bot.playersBattles.get(msg.author.id);

            ownerOnly(battle, msg.author);
            battleIsNotStarted(battle);

            const id = testArgs[1].val;
            const player = battle.data.players[id];
            const team = battle.data.teams[testArgs[2].val];

            if (!team) throw `Cannot found a team with ID ${id}`;
            if (!player) throw `Cannot found a player with ID ${id}`;
            
            delete team.data.players[id];

            team.data.players[id] = player;
            player.data.team = team;

            await msg.channel.send(`Moved player with ID ${id} to the destination team`);

            
        },
        args: [
            new Argument(new Text(["move-player"]), "Type"),
            new Argument(new Text, "Player ID"),
            new Argument(new Text, "Team ID")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs,
            restArgs
        }: CallbackFunctionOptions): Promise<void> {
            notInBattleOnly(bot, msg.author);

            const id = bot.uid.gen();
            const battle = new Battle({
                bot,
                data: {
                    players: {},
                    teams: {},
                    ownerId: msg.author.id
                },
                id
            });
            const team = new Team(bot.uid.gen(), {
                name: [testArgs[1].val, ...restArgs].join(" "),
                players: {}
            });
            const player = new HumanPlayer(msg.author.id, {
                name: msg.author.tag,
                hp: Object.create(hp),
                team
            });

            bot.battles.set(id, battle);
            battle.addTeams([team]);
            battle.addPlayers([player]);
            await msg.channel.send(`Created a battle with ID ${id}`);
        },
        args: [
            new Argument(new Text(["create-battle"]), "Type"),
            new Argument(new Text, "Team Name")
        ]
    },
    {
        async func({
            msg,
            bot
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);

            const battle = bot.playersBattles.get(msg.author.id);

            ownerOnly(battle, msg.author);
            battleIsNotStarted(battle);
            await battle.startRound();
        },
        args: [
            new Argument(new Text(["start-battle"]), "Type")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            notInBattleOnly(bot, msg.author);

            const battle = bot.battles.get(testArgs[1].val);

            if (!battle) throw `Cannot found a battle with ID ${testArgs[1].val}`;

            battleIsNotStarted(battle);
            
            const team = battle.data.teams[testArgs[2].val];

            if (!team) throw `Cannot found a team with ID ${testArgs[2].val}`;
            
            const player = new HumanPlayer(msg.author.id, {
                name: msg.author.tag,
                hp: Object.create(hp),
                team
            });

            battle.addPlayers([player]);
            await msg.channel.send(`Joined the battle`);
        },
        args: [
            new Argument(new Text(["join-battle"]), "Type"),
            new Argument(new Text, "Battle ID"),
            new Argument(new Text, "Team ID")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);

            const battle = bot.playersBattles.get(msg.author.id);
            
            battleIsNotStarted(battle);
            
            const team = battle.data.teams[testArgs[1].val];

            if (!team) throw `Cannot found a team with ID ${testArgs[1].val}`;
            
            const id = bot.uid.gen();
            const player = new ComputerPlayer(id, {
                name: `Computer ${id}`,
                hp: Object.create(hp),
                team,
                level: testArgs[2].val
            });

            battle.addPlayers([player]);
            await msg.channel.send(`AI joined the battle`);
        },
        args: [
            new Argument(new Text(["add-computer"]), "Type"),
            new Argument(new Text, "Team ID"),
            new Argument(new Integer, "AI Level")
        ]
    },
    {
        async func({
            msg,
            bot,
            testArgs
        }: CallbackFunctionOptions): Promise<void> {
            inBattleOnly(bot, msg.author);

            const battle = bot.playersBattles.get(msg.author.id);
            
            battleIsNotStarted(battle);
            battle.rmPlayers([battle.data.players[msg.author.id]]);

            if (battle.data.ownerId === msg.author.id) {
                let onlyBot = true;

                for (const player of Object.values(battle.data.players)) {
                    if (player.type !== "Human") continue;

                    battle.data.ownerId = player.id;

                    await player.send(bot, {
                        content: `You are the owner of the battle now`
                    });

                    onlyBot = false;
                }

                if (onlyBot) bot.battles.delete(battle.id);
            }

            await msg.channel.send(`Left the battle`);
        },
        args: [
            new Argument(new Text(["leave-battle"]), "Type")
        ]
    }
];
const description = "";
const only = "dm";

export {
    callbacks,
    description,
    only
};