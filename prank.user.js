// ==UserScript==
// @name         lscc - Mischief and Fun
// @namespace
// @version      1.11.0
// @description  lscc's prank on her friends
// @author       Lucifer's Sidechick
// @include      /^https:\/\/(www\.)?bondage(projects\.elementfx|-(europe|asia))\.com\/.*/
// @icon
// @grant        none
// @require      https://github.com/Jomshir98/bondage-club-mod-sdk/releases/download/v1.2.0/bcmodsdk.js
// @updateURL    https://khiles.github.io/prank/prank.user.js
// @downloadURL  https://khiles.github.io/prank/prank.user.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    if (window.LSCC_PRANK_LOADED) {
        console.log("lscc's prank Plugin is already loaded");
        return;
    }
    window.LSCC_PRANK_LOADED = true;

    let modApi;
    const modversion = "1.11.0";

    // ===== Image path helper tool =====
    const ImagePathHelper = {
        _cachedBasePath: null,

        getBasePath: function() {
            if (this._cachedBasePath) return this._cachedBasePath;

            let href = window.location.href;

            // Make sure there is a slash at the end.
            if (!href.endsWith('/')) {
                href = href.substring(0, href.lastIndexOf('/') + 1);
            }

            this._cachedBasePath = href;
            return href;
        },

        getAssetURL: function(path) {
            return this.getBasePath() + 'Assets/' + path;
        },

        clearCache: function() {
            this._cachedBasePath = null;
        }
    };

    const messages = {
        en: {
            loaded: `lscc's Prank Plugin v${modversion} Loaded!`,
            notFound: "Target not found",
            noPermission: "No permission",
            noUnderwear: "has no underwear",
            noSocks: "has no socks",
            stealFailed: "Failed to steal",
            removeFailed: "Failed to remove",
            nothingToRemove: "has no removable clothing in this area",

            // Actions
            stealUnderwear: "discreetly steals",
            stealUnderwearSuffix: "'s underwear 💕",
            removedOwnUnderwear: "takes off their own underwear",
            dissolveClothes: "splashes an obscene concoction on",
            dissolveClothesTarget: "'s clothes",
            dissolveOwnClothes: "splashes an obscene concotion on their own clothes",
            enterPortal: "opens a wormhole towards",
            exitPortal: "emerges from a wormhole",
            cutClothes: "cuts off",
            cutClothesTarget: "'s",
            cutOwnClothes: "cuts off their own",
            removeClothes: "removes",
            removeOwnClothes: "removes their own",
            stoleUnderwear: "snatches",
            removedAndHoldUnderwear: "slips off",
            holdUnderwear: "'s underwear and embraces their warmth",
            holdOwnUnderwear: "slips down their own underwear and holds them",
            stoleSocks: "snatches",
            socksSuffix: "'s socks",
            removedAndHoldSocks: "pulls off",
            holdSocks: "'s socks and clutches them",
            holdOwnSocks: "pulls off their socks and holds them",
            pluckingOwnHair: "pluckes out their own ahoge",
            pluckingHair: "pluckes out",
            pluckingHairSuffix: "'s ahoge",
            dyeClothes: "splashes a rainbow potion on",
            dyeClothesTarget: "'s outfit, making it burst into wild colors! 🌈",
            dyeOwnClothes: "splashes a rainbow potion all over their own outfit! 🌈",
            streakAction: "dramatically streaks through the room! 🏃",
            notHolding: "You are not holding anything",
            giveTo: "gives",
            giveSuffix: "to",
            noBra: "has no bra",
            noHat: "has no hat",
            stealBra: "sneakily unclasps",
            stealBraSuffix: "'s bra, sending it flying! 👙",
            stealHat: "swipes",
            stealHatSuffix: "'s hat and puts it on 🎩",
            dyeHair: "sneaks up and dyes",
            dyeHairSuffix: "'s hair in wild colors! 💇",
            dyeOwnHair: "dyes their own hair in wild colors! 💇",
            swapOutfits: "and",
            swapOutfitsSuffix: "mysteriously swap outfits! 👗",
            noShoes: "has no shoes",
            stealShoes: "yanks off",
            stealShoesSuffix: "'s shoes and runs away! 👟",
            tickle: "tickles",
            tickleSuffix: ", sending them into a fit of giggles! 🤭",
            tickleSelf: "tickles themselves for some reason 🤭",
            copyOutfit: "steals the look of",
            copyOutfitSuffix: " — identity theft! 👀",
            resetColors: "restores",
            resetColorsSuffix: "'s clothing back to normal",
            resetOwnColors: "restores their own clothing back to normal",
            noGloves: "has no gloves",
            stealGloves: "slips off",
            stealGlovesSuffix: "'s gloves! 🧤",
            headpat: "gives",
            headpatSuffix: "a gentle headpat 🐾",
            headpatSelf: "pats their own head 🐾",
            rouletteAnnounce: "spins the prank wheel...",
            prankRandom: "hits",
            prankRandomSuffix: "with a random prank!",
            slowStripRemoves: "slowly peels off",
            slowStripDone: "has been completely stripped... slowly 😈",
            blackoutAction: "casts a shadow over",
            blackoutSuffix: "'s entire wardrobe 🖤",
            loopStarted: "Started prank loop on",
            loopStopped: "Stopped prank loop on",
            loopAllStopped: "Stopped all prank loops",
            loopAlready: "Already looping on",
            loopNone: "No active loop for that player",
            bonk: "bonks",
            bonkSuffix: "on the head with a rolled-up newspaper 📰",
            bonkSelf: "bonks themselves on the head 📰",
            serenade: "serenades",
            serenadeSuffix: "with a passionately off-key love song 🎵",
            serenadeSelf: "serenades themselves... it's giving main character energy 🎵",
            noogie: "grabs",
            noogieSuffix: "and gives them a noogie 👊",
            noogieSelf: "somehow gives themselves a noogie 👊",
            proposeAction: "gets down on one knee and proposes to",
            proposeSuffix: "💍 ...will they say yes?",
            adoptAction: "officially adopts",
            adoptSuffix: "as their child 👨‍👧",
            wedgieAction: "sneaks up and gives",
            wedgieSuffix: "a wedgie! 😬",
            teaseAction: "leans close to",
            teaseSuffix: "and whispers something that makes them go bright red... 😳",
            teaseSelf: "teases themselves somehow. Impressive.",
            flashAction: "flashes",
            flashSuffix: "!! 😳",

            // Activity labels
            actCutClothes: "Cut Clothes",
            actRemoveClothes: "Remove Clothes",
            actDissolveClothes: "Dissolve Clothes",
            actStealPanties: "Steal Panties",
            actRemoveHoldPanties: "Take Panties",
            actStealSocks: "Steal Socks",
            actRemoveHoldSocks: "Take Socks",
            actPluckingHair: "Pluck Ahoge",
            actDyeClothes: "Rainbow Dye",
            actStealBra: "Steal Bra",
            actStealHat: "Steal Hat",
            actDyeHair: "Dye Hair",

            // Activity descriptions
            actCutClothesDesc: "SourceCharacter cuts off TargetCharacter's clothes using scissors",
            actCutClothesSelf: "SourceCharacter cuts off their own clothes using scissors",
            actRemoveClothesDesc: "SourceCharacter removes TargetCharacter's clothes",
            actRemoveClothesSelf: "SourceCharacter removes their own clothes",
            actDissolveClothesDesc: "SourceCharacter splashes an obscene concotion on TargetCharacter",
            actDissolveClothesSelf: "SourceCharacter splashes an obscene concotion on themselves",
            actStealPantiesDesc: "SourceCharacter snatches TargetCharacter's panties",
            actRemoveHoldPantiesDesc: "SourceCharacter slips off TargetCharacter's panties and holds them",
            actRemoveHoldPantiesSelf: "SourceCharacter slips off their own panties holds them",
            actStealSocksDesc: "SourceCharacter snatches TargetCharacter's socks",
            actRemoveHoldSocksDesc: "SourceCharacter pulls off TargetCharacter's socks and holds them",
            actRemoveHoldSocksSelf: "SourceCharacter pulls off their own socks and holds them",
            actDyeClothesDesc: "SourceCharacter splashes a rainbow potion on TargetCharacter's outfit",
            actDyeClothesSelf: "SourceCharacter splashes a rainbow potion all over their own outfit",
            actStealBraDesc: "SourceCharacter sneakily unclasps TargetCharacter's bra",
            actStealHatDesc: "SourceCharacter swipes TargetCharacter's hat and puts it on",
            actDyeHairDesc: "SourceCharacter sneaks up and dyes TargetCharacter's hair in wild colors",
            actDyeHairSelf: "SourceCharacter dyes their own hair in wild colors",
            actTickle: "Tickle",
            actTickleDesc: "SourceCharacter tickles TargetCharacter",
            actTickleSelf: "SourceCharacter tickles themselves",
            actStealShoes: "Steal Shoes",
            actStealShoesDesc: "SourceCharacter yanks off TargetCharacter's shoes",
            actResetColors: "Restore Colors",
            actResetColorsDesc: "SourceCharacter restores TargetCharacter's clothing colors back to normal",
            actResetColorsSelf: "SourceCharacter restores their own clothing colors back to normal",
            actStealGloves: "Steal Gloves",
            actStealGlovesDesc: "SourceCharacter slips off TargetCharacter's gloves",
            actHeadpat: "Headpat",
            actHeadpatDesc: "SourceCharacter gives TargetCharacter a gentle headpat",
            actHeadpatSelf: "SourceCharacter pats their own head",
            actBonk: "Bonk",
            actBonkDesc: "SourceCharacter bonks TargetCharacter on the head with a rolled-up newspaper",
            actBonkSelf: "SourceCharacter bonks themselves on the head",
            actSerenade: "Serenade",
            actSerenadeDesc: "SourceCharacter serenades TargetCharacter with a passionately off-key love song",
            actSerenadeSelf: "SourceCharacter serenades themselves",
            actNoogie: "Noogie",
            actNoogieDesc: "SourceCharacter grabs TargetCharacter and gives them a noogie",
            actNoogieSelf: "SourceCharacter somehow gives themselves a noogie",
            actWedgie: "Wedgie",
            actWedgieDesc: "SourceCharacter sneaks up and gives TargetCharacter a wedgie",
            actTease: "Tease",
            actTeaseDesc: "SourceCharacter leans close and whispers something that makes TargetCharacter go bright red",
            actTeaseSelf: "SourceCharacter teases themselves somehow",

            // Poke
            pokeAction: "pokes",
            pokeSuffix: "👉",
            pokeSelf: "pokes themselves for no apparent reason 👉",

            // Dare
            dareAction: "dares",
            dareSuffix: "! Will they accept? 🎯",

            // Taunt
            tauntAction: "taunts",

            // Activity labels / descriptions
            actPoke: "Poke",
            actPokeDesc: "SourceCharacter pokes TargetCharacter",
            actPokeSelf: "SourceCharacter pokes themselves",

            // Shrink
            shrinkAction: "waves a tiny wand and casts a shrinking spell on",
            shrinkSuffix: "! ✨ Watch out, you might fit in a pocket now...",
            shrinkSelf: "accidentally shrinks themselves! 🔬",

            // Dye (single color)
            dyeColorAction: "dips",
            dyeColorMidfix: "'s entire wardrobe in a vat of",
            dyeColorSelfAction: "dips their own wardrobe in a vat of",

            // Freeze
            freezeAction: "casts a freeze spell on",
            freezeSuffix: "... they can't move! 🧊",
            freezeSelf: "accidentally freezes themselves in place! 🧊",
            freezeAlready: "Already freezing",
            freezeNone: "No active freeze for that player",
            freezeStopped: "Stopped freeze on",
            freezeAllStopped: "Stopped all freezes",
            freezeStarted: "Started freeze on",

            // Rename
            renameAction: "renames",
            renameSuffix: "to",
            unrenameAction: "restores the name of",
            renameUsage: "Usage: /rename <player> <nickname>",
            renameNotFound: "Could not find original name for",
            renameLocalNote: "(local only)",

            // Countdown
            countdownAction: "starts a countdown:",
            countdownBoom: "💥 TIME'S UP!",

            // Quiz
            quizAction: "challenges",
            quizSuffix: "to answer a trivia question:",
            quizCorrect: "got it right! No prank for you... this time. 🎉",
            quizWrong: "couldn't answer in time! Prank incoming... 😈",
            quizAlready: "Already quizzing",

            // Announce
            announceUsage: "Usage: /announce <message>",

            // History / Stats
            historyEmpty: "No prank history for",
            historyNone: "No prank history this session.",
            statsNone: "No pranks recorded this session.",
            statsHeader: "=== Prank Stats ===",
            statsTotal: "Total pranks:",

            // Trust
            trustAdded: "Added to trust list:",
            trustRemoved: "Removed from trust list:",
            trustAlready: "Already in trust list:",
            trustNotIn: "Not in trust list:",
            trustListHeader: "=== Trust List ===",
            trustEmpty: "Trust list is empty.",

            // Help
            helpNotFound: "Unknown command:",
            helpUsage: "Usage: /help <command>",
            helpExample: "Example:",
            helpUsageLabel: "Usage:",

            // New activity labels
            actSpin: "Spin",
            actSpinDesc: "SourceCharacter grabs TargetCharacter and spins them around! 🌀",
            actSpinSelf: "SourceCharacter spins around dramatically! 🌀",
            actStealCollar: "Steal Collar",
            actStealCollarDesc: "SourceCharacter unclasps TargetCharacter's collar! 📿",
            actPiggyback: "Piggyback",
            actPiggybackDesc: "SourceCharacter leaps onto TargetCharacter's back for a piggyback ride! 🐎",
            actPiggybackSelf: "SourceCharacter piggybacks themselves... somehow.",
            actDyeOneItem: "Dye Item",
            actDyeOneItemDesc: "SourceCharacter splashes a dab of paint on TargetCharacter's outfit! 🎨",
            actDyeOneItemSelf: "SourceCharacter splashes paint on their own outfit! 🎨",
            actHighFive: "High Five",
            actHighFiveDesc: "SourceCharacter gives TargetCharacter a high five! 🙌",
            actHighFiveSelf: "SourceCharacter high fives themselves. Impressive dedication. 🙌",
            actTrip: "Trip",
            actTripDesc: "SourceCharacter sticks their foot out and trips TargetCharacter!",
            actTripSelf: "SourceCharacter trips over their own feet somehow.",

            // New activity chat strings
            spinAction: "grabs",
            spinSuffix: "and spins them around! 🌀",
            spinSelf: "spins around dramatically! 🌀",
            noCollar: "has no collar",
            stealCollar: "unclasps",
            stealCollarSuffix: "'s collar! 📿",
            piggybackAction: "leaps onto",
            piggybackSuffix: "'s back for a piggyback ride! 🐎",
            piggybackSelf: "tries to give themselves a piggyback ride somehow 🤔",
            dyeOneItemAction: "splashes a dab of paint on",
            dyeOneItemSuffix: "'s outfit! 🎨",
            dyeOneItemSelf: "splashes paint on their own outfit! 🎨",
            highFiveAction: "gives",
            highFiveSuffix: "a high five! 🙌",
            highFiveSelf: "high fives themselves with great enthusiasm 🙌",
            tripAction: "sticks their foot out and trips",
            tripSuffix: "! 😄",
            tripSelf: "trips over their own feet 😅"
        }
    };

    function getMessage(key) {
        return messages.en[key];
    }

    try {
        if (typeof bcModSdk === "object" && typeof bcModSdk.registerMod === "function") {
            modApi = bcModSdk.registerMod({
                name: "lscc's prank",
                fullName: "lscc's prank on her friends",
                version: modversion,
                repository: "lscc's prank"
            });
            console.log("[prank] Mod registered with bcModSdk");
        }
    } catch (error) {
        console.error("[prank] Failed to initialize modApi", error);
    }

    // ===== Utility functions =====
    function waitFor(condition, timeout = 30000) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const check = () => {
                if (condition()) {
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error('Timeout'));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    function getPlayer(identifier) {
        if (!ChatRoomCharacter) return null;
        if (typeof identifier === "number" || /^\d+$/.test(identifier)) {
            return ChatRoomCharacter.find(c => c.MemberNumber === parseInt(identifier)) || null;
        } else if (typeof identifier === "string") {
            const lower = identifier.toLowerCase();
            return ChatRoomCharacter.find(c =>
                c.Name?.toLowerCase() === lower ||
                c.Nickname?.toLowerCase() === lower ||
                c.AccountName?.toLowerCase() === lower
            ) || null;
        }
        return null;
    }

    function getNickname(character) {
        if (!character) return "Unknown";
        return character.Nickname || character.Name || character.AccountName || "Unknown";
    }

    function chatSendCustomAction(message) {
        if (typeof ServerSend === "function") {
            ServerSend("ChatRoomChat", {
                Type: "Action",
                Content: "CUSTOM_SYSTEM_ACTION",
                Dictionary: [{
                    Tag: 'MISSING TEXT IN "Interface.csv": CUSTOM_SYSTEM_ACTION',
                    Text: message
                }]
            });
        }
    }

    function chatSendLocal(message, timeout = 10000) {
        if (typeof ChatRoomSendLocal === "function") {
            ChatRoomSendLocal(message, timeout);
        } else if (typeof ChatRoomMessage === "function") {
            ChatRoomMessage({ Content: message, Type: "LocalMessage" }, timeout);
        } else {
            console.log("Local: " + message);
        }
    }

    // ===== Auto-update check =====
    const UPDATE_URL = "https://khiles.github.io/prank/prank.user.js";

    function checkForUpdates() {
        fetch(UPDATE_URL, { cache: "no-store" })
            .then(r => r.text())
            .then(text => {
                const match = text.match(/@version\s+([\d.]+)/);
                if (!match) return;
                const remote = match[1];
                if (remote !== modversion) {
                    chatSendLocal(
                        `⬆️ Prank Mod update available: v${modversion} → v${remote}! ` +
                        `Tampermonkey will auto-update on next page load, or click the extension icon to update now.`
                    );
                }
            })
            .catch(() => {}); // Silently ignore network errors
    }

    // ===== Hidden packet system =====
    const PRANK_PKT = "LSCC_PRANK";

    function sendPrankPacket(payload) {
        if (typeof ServerSend !== "function") return;
        ServerSend("ChatRoomChat", {
            Type: "Hidden",
            Content: PRANK_PKT,
            Dictionary: [{ Tag: "data", Text: JSON.stringify(payload) }]
        });
    }

    function hasBCItemPermission(target) {
        return typeof ServerChatRoomGetAllowItem === "function"
            ? ServerChatRoomGetAllowItem(Player, target)
            : true;
    }

    function getRandomColor() {
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    const appearanceGroupNames = [
        "Panties", "Socks", "ClothLower", "Gloves", "HairAccessory1", "Cloth", "Bra", "Hat", "Shoes",
        "ClothAccessory", "Necklace", "Suit", "SuitLower", "Corset", "SocksRight", "SocksLeft",
        "RightAnklet", "LeftAnklet", "Garters", "HairAccessory3", "Bracelet", "Glasses", "Jewelry",
        "Mask", "HairFront", "Mask_笨笨蛋Luzi", "Gloves_笨笨蛋Luzi", "Luzi_HairAccessory3_2",
        "Luzi_HairAccessory3_1", "HairAccessory3_笨笨蛋Luzi", "Hat_笨笨蛋Luzi", "Shoes_笨笨蛋Luzi",
        "Necklace_笨笨蛋Luzi", "ClothAccessory_笨笨笨蛋Luzi2", "SuitLower_笨笨蛋Luzi",
        "Suit_笨笨蛋Luzi", "Panties_笨笨蛋Luzi", "ClothLower_笨笨笨蛋Luzi2", "ClothLower_笨笨蛋Luzi",
        "Cloth_笨笨笨蛋Luzi2", "BodyMarkings2_Luzi", "长袖子_Luzi", "身体痕迹_Luzi", "Liquid2_Luzi",
        "FaceMarkings", "BodyMarkings", "HandAccessoryRight", "HandAccessoryLeft", "AnkletLeft",
        "AnkletRight", "EyeShadow", "ClothOuter", "Cloth_笨笨蛋Luzi", "ClothAccessory_笨笨蛋Luzi",
        "Bra_笨笨蛋Luzi", "Decals"
    ];

    // ===== Commands =====
    function stealPanties(args) {
        try {
            let target;
            const targetArg = (args || "").trim();

            if (!targetArg) {
                target = Player;
            } else {
                target = getPlayer(targetArg);
                if (!target) {
                    return chatSendLocal(getMessage('notFound'));
                }
            }

            if (!hasBCItemPermission(target)) {
                return chatSendLocal(getMessage('noPermission'));
            }

            const targetNick = getNickname(target);
            const playerNick = getNickname(Player);
            const panties = InventoryGet(target, "Panties");

            try {
                InventoryRemove(target, "Panties");
                ChatRoomCharacterUpdate(target);
            } catch (e) {
                console.log("[prank] Error removing panties:", e);
            }

            let itemColor = "Default";
            if (panties && panties.Color !== "Default") {
                itemColor = panties.Color;
            } else {
                const hairFront = InventoryGet(target, "HairFront");
                const hairBack = InventoryGet(target, "HairBack");
                if (hairFront && hairFront.Color) {
                    itemColor = hairFront.Color;
                } else if (hairBack && hairBack.Color) {
                    itemColor = hairBack.Color;
                } else {
                    itemColor = getRandomColor();
                }
            }

            InventoryRemove(Player, "ItemHandheld");

            const itemName = `${targetNick}'s freshly removed panties 💕`;
            const itemDesc = `${targetNick}'s freshly removed panties, with a hint of warmth and scent 💕`;

            try {
                InventoryWear(Player, "Panties", "ItemHandheld", itemColor, 0, target.MemberNumber, {
                    Name: itemName,
                    Description: itemDesc,
                    Color: itemColor,
                    Private: true,
                    ItemProperty: {},
                    MemberNumber: target.MemberNumber,
                    MemberName: targetNick
                });
            } catch (e) {
                console.log("[prank] InventoryWear error:", e);
                chatSendLocal(getMessage('stealFailed'));
                return;
            }

            ChatRoomCharacterUpdate(Player);

            if (target.MemberNumber === Player.MemberNumber) {
                chatSendCustomAction(playerNick + " " + getMessage('removedOwnUnderwear'));
            } else {
                chatSendCustomAction(playerNick + " " + getMessage('stealUnderwear') + " " + targetNick + getMessage('stealUnderwearSuffix'));
                sendPrankPacket({ type: "steal_panties", source: Player.MemberNumber, target: target.MemberNumber });
            }

        } catch (error) {
            console.error("Error in stealPanties:", error);
        }
    }

    function spillObscenePotion(args) {
        try {
            const target = getPlayer(args.trim());
            if (!target) {
                return chatSendLocal(getMessage('notFound'));
            }

            if (!hasBCItemPermission(target)) {
                return chatSendLocal(getMessage('noPermission'));
            }

            takeSnapshot(target);
            const noClothesFilter = (item) => !appearanceGroupNames.includes(item.Group);
            const appearance = ServerAppearanceBundle(target.Appearance).filter(noClothesFilter);

            ServerSend("ChatRoomCharacterUpdate", {
                ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                ActivePose: target.ActivePose,
                Appearance: appearance
            });

            chatSendCustomAction(getNickname(Player) + " " + getMessage('dissolveClothes') + " " + getNickname(target) + getMessage('dissolveClothesTarget'));
            sendPrankPacket({ type: "dissolve", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in spillObscenePotion:", error);
        }
    }

    async function openPortal(args) {
        try {
            let roomName = args.trim();
            if (!roomName) {
                const promptText = "Enter room name";
                roomName = window.prompt(promptText);
                if (!roomName) return;
            }

            chatSendCustomAction(getNickname(Player) + " " + getMessage('enterPortal') + "「" + roomName + "」");

            setTimeout(() => {
                if (typeof ChatRoomLeave === "function") ChatRoomLeave();
                if (typeof CommonSetScreen === "function") CommonSetScreen("Online", "ChatSearch");
                if (typeof ServerSend === "function") {
                    ServerSend("ChatRoomJoin", { Name: roomName });
                    setTimeout(() => {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('exitPortal'));
                    }, 1000);
                }
            }, 500);
        } catch (error) {
            console.error("Error in openPortal:", error);
        }
    }

    // ===== Activity System =====
    let actData = {
        CustomPrerequisiteFuncs: new Map(),
        CustomActionCallbacks: new Map(),
        CustomImages: new Map(),
    };

    function AddCustomPrereq(prereq) {
        if (!actData.CustomPrerequisiteFuncs.get(prereq.Name))
            actData.CustomPrerequisiteFuncs.set(prereq.Name, prereq.Func);
    }

    function RegisterCustomFuncs(bundle, activity) {
        bundle.CustomPrereqs?.forEach((prereq) => {
            if (activity.Prerequisite.indexOf(prereq.Name) === -1)
                activity.Prerequisite.push(prereq.Name);
            AddCustomPrereq(prereq);
        });

        if (bundle.CustomAction && !actData.CustomActionCallbacks.get(activity.Name))
            actData.CustomActionCallbacks.set(activity.Name, bundle.CustomAction.Func);

        if (bundle.CustomImage && !actData.CustomImages.get(activity.Name))
            actData.CustomImages.set(activity.Name, bundle.CustomImage);
    }

    function AddTargetToActivity(activity, tgt) {
        tgt.TargetLabel = tgt.TargetLabel ?? activity.Name.substring(5);

        if (tgt.SelfAllowed) {
            if (!activity.TargetSelf) activity.TargetSelf = [];
            if (typeof activity.TargetSelf !== "boolean" && activity.TargetSelf.indexOf(tgt.Name) === -1) {
                activity.TargetSelf.push(tgt.Name);
            }
        }

        if (!tgt.SelfOnly) {
            if (!activity.Target) activity.Target = [];
            if (activity.Target.indexOf(tgt.Name) === -1) {
                activity.Target.push(tgt.Name);
            }
        }

        ActivityDictionary?.push(["Label-ChatOther-" + tgt.Name + "-" + activity.Name, tgt.TargetLabel]);
        ActivityDictionary?.push(["ChatOther-" + tgt.Name + "-" + activity.Name, tgt.TargetAction]);

        if (tgt.SelfAllowed) {
            ActivityDictionary?.push(["Label-ChatSelf-" + tgt.Name + "-" + activity.Name, tgt.TargetSelfLabel ?? tgt.TargetLabel]);
            ActivityDictionary?.push(["ChatSelf-" + tgt.Name + "-" + activity.Name, tgt.TargetSelfAction ?? tgt.TargetAction]);
        }
    }

    function AddActivity(bundle) {
        if (!bundle.Targets || bundle.Targets.length <= 0) return;

        let activity = bundle.Activity;
        activity.Target = activity.Target ?? [];
        activity.Prerequisite = activity.Prerequisite ?? [];
        activity.Name = "lscc_" + activity.Name;

        RegisterCustomFuncs(bundle, bundle.Activity);
        ActivityDictionary?.push(["Activity" + activity.Name, bundle.Targets[0].TargetLabel ?? activity.Name.substring(5)]);

        bundle.Targets.forEach((tgt) => {
            AddTargetToActivity(activity, tgt);
        });

        ActivityFemale3DCG.push(activity);
        ActivityFemale3DCGOrdering.push(activity.Name);
    }

    function hasRemovableClothing(target, group) {
        const clothingMap = {
            "ItemNeck": ["Suit", "Cloth", "Bra"],
            "ItemNipples": ["Suit", "Cloth", "Bra"],
            "ItemBreast": ["Suit", "Cloth", "Bra"],
            "ItemTorso": ["Suit", "Cloth", "Bra"],
            "ItemNeckAccessories": ["Suit", "Cloth", "Bra"],
            "ItemNeckRestraints": ["Suit", "Cloth", "Bra"],
            "ItemNipplesPiercings": ["Suit", "Cloth", "Bra"],
            "ItemTorso2": ["Suit", "Cloth", "Bra"],
            "ItemHands": ["Gloves"],
            "ItemHandheld": ["Gloves"],
            "ItemPelvis": ["ClothLower", "SuitLower", "Panties"],
            "ItemButt": ["ClothLower", "SuitLower", "Panties"],
            "ItemVulvaPiercings": ["ClothLower", "SuitLower", "Panties"],
            "ItemVulva": ["ClothLower", "SuitLower", "Panties"],
            "ItemPenis": ["ClothLower", "SuitLower", "Panties"],
            "ItemBoots": ["Shoes", "Socks", "SocksRight", "SocksLeft"],
            "ItemLegs": ["Socks", "SocksRight", "SocksLeft"],
            "ItemFeet": ["Socks", "SocksRight", "SocksLeft"],
            "ItemMouth": ["Mask"],
            "ItemMouth2": ["Mask"],
            "ItemMouth3": ["Mask"]
        };

        if (group === "ItemLegs" || group === "ItemFeet") {
            const hasShoes = InventoryGet(target, "Shoes");
            if (hasShoes) return false;
        }

        const priority = clothingMap[group];
        if (!priority) return false;

        return priority.some(clothGroup => InventoryGet(target, clothGroup));
    }

    function removeClothing(target, group) {
        const clothingMap = {
            "ItemNeck": ["Suit", "Cloth", "Bra"],
            "ItemNipples": ["Suit", "Cloth", "Bra"],
            "ItemBreast": ["Suit", "Cloth", "Bra"],
            "ItemTorso": ["Suit", "Cloth", "Bra"],
            "ItemNeckAccessories": ["Suit", "Cloth", "Bra"],
            "ItemNeckRestraints": ["Suit", "Cloth", "Bra"],
            "ItemNipplesPiercings": ["Suit", "Cloth", "Bra"],
            "ItemTorso2": ["Suit", "Cloth", "Bra"],
            "ItemHands": ["Gloves"],
            "ItemHandheld": ["Gloves"],
            "ItemPelvis": ["ClothLower", "SuitLower", "Panties"],
            "ItemButt": ["ClothLower", "SuitLower", "Panties"],
            "ItemVulvaPiercings": ["ClothLower", "SuitLower", "Panties"],
            "ItemVulva": ["ClothLower", "SuitLower", "Panties"],
            "ItemPenis": ["ClothLower", "SuitLower", "Panties"],
            "ItemBoots": ["Shoes", "Socks", "SocksRight", "SocksLeft"],
            "ItemLegs": ["Socks", "SocksRight", "SocksLeft"],
            "ItemFeet": ["Socks", "SocksRight", "SocksLeft"],
            "ItemMouth": ["Mask"],
            "ItemMouth2": ["Mask"],
            "ItemMouth3": ["Mask"]
        };

        if (group === "ItemLegs" || group === "ItemFeet") {
            const hasShoes = InventoryGet(target, "Shoes");
            if (hasShoes) return null;
        }

        const priority = clothingMap[group];
        if (!priority) return null;

        for (let clothGroup of priority) {
            const item = InventoryGet(target, clothGroup);
            if (item) {
                const itemName = (item.Asset && item.Asset.Description) || clothGroup;
                InventoryRemove(target, clothGroup);
                ChatRoomCharacterUpdate(target);
                return itemName;
            }
        }

        return null;
    }

    function stealItem(target, itemType) {
        let item, originalItemGroup, targetNick;
        targetNick = getNickname(target);

        if (itemType === "panties") {
            item = InventoryGet(target, "Panties");
            if (!item) return false;
            originalItemGroup = "Panties";
        } else if (itemType === "socks") {
            item = InventoryGet(target, "Socks") || InventoryGet(target, "SocksRight") || InventoryGet(target, "SocksLeft");
            if (!item) return false;
            if (InventoryGet(target, "Socks")) {
                originalItemGroup = "Socks";
            } else if (InventoryGet(target, "SocksRight")) {
                originalItemGroup = "SocksRight";
            } else {
                originalItemGroup = "SocksLeft";
            }
        }

        let itemColor = "Default";
        if (item.Color !== "Default") {
            itemColor = item.Color;
        } else {
            const hairFront = InventoryGet(target, "HairFront");
            const hairBack = InventoryGet(target, "HairBack");
            if (hairFront && hairFront.Color) {
                itemColor = hairFront.Color;
            } else if (hairBack && hairBack.Color) {
                itemColor = hairBack.Color;
            } else {
                itemColor = getRandomColor();
            }
        }

        if (itemType === "panties") {
            InventoryRemove(target, "Panties");
        } else if (itemType === "socks") {
            InventoryRemove(target, "Socks");
            InventoryRemove(target, "SocksRight");
            InventoryRemove(target, "SocksLeft");
        }
        ChatRoomCharacterUpdate(target);

        InventoryRemove(Player, "ItemHandheld");

        let handheldItemName;

        if (itemType === "panties") {
            handheldItemName = "Panties";
        } else {
            handheldItemName = "LongSock";
        }

        const itemName = itemType === "panties" ?
              `${targetNick}'s freshly removed panties 💕` :
              `${targetNick}'s freshly removed socks 💕`;

        const itemDesc = itemType === "panties" ?
              `${targetNick}'s freshly removed panties, with a hint of warmth and scent 💕` :
              `${targetNick}'s freshly removed socks, with a hint of warmth and scent 💕`;

        InventoryWear(Player, handheldItemName, "ItemHandheld", itemColor, 0, target.MemberNumber, {
            Name: itemName,
            Description: itemDesc,
            Color: itemColor,
            Private: true,
            ItemProperty: {},
            MemberNumber: target.MemberNumber,
            MemberName: targetNick
        });

        ChatRoomCharacterUpdate(Player);

        const finalHandItem = InventoryGet(Player, "ItemHandheld");
        if (!finalHandItem) {
            console.error("[prank] Item failed to persist in hand!");
            return false;
        }

        return true;
    }

    function pluckingHair(target) {
        if (!hasBCItemPermission(target)) {
            return chatSendLocal(getMessage('noPermission'));
        }

        try {
            InventoryRemove(target, "额外头发_Luzi");
            ChatRoomCharacterUpdate(target);
        } catch (e) {
            console.log("[prank] Error removing 额外头发_Luzi:", e);
        }

        return true;
    }

    function stealBra(target) {
        const bra = InventoryGet(target, "Bra");
        if (!bra) return false;
        takeSnapshot(target);
        InventoryRemove(target, "Bra");
        ChatRoomCharacterUpdate(target);
        return true;
    }

    function stealHat(target) {
        const hat = InventoryGet(target, "Hat");
        if (!hat) return false;
        takeSnapshot(target);
        const assetName = hat.Asset?.Name;
        const color = hat.Color || "Default";
        InventoryRemove(target, "Hat");
        ChatRoomCharacterUpdate(target);
        try {
            InventoryRemove(Player, "Hat");
            InventoryWear(Player, assetName, "Hat", color, 0, target.MemberNumber, hat.Craft || {});
            ChatRoomCharacterUpdate(Player);
        } catch (e) {
            console.log("[prank] Could not put hat on player:", e);
        }
        return true;
    }

    function stealHatCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /stealhat <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));
            if (!InventoryGet(target, "Hat")) return chatSendLocal(getNickname(target) + " " + getMessage('noHat'));
            if (stealHat(target)) {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('stealHat') + " " + getNickname(target) + getMessage('stealHatSuffix'));
                sendPrankPacket({ type: "steal_hat", source: Player.MemberNumber, target: target.MemberNumber });
            } else {
                chatSendLocal(getMessage('stealFailed'));
            }
        } catch (error) {
            console.error("Error in stealHatCmd:", error);
        }
    }

    function stealBraCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /stealbra <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));
            if (!InventoryGet(target, "Bra")) return chatSendLocal(getNickname(target) + " " + getMessage('noBra'));
            if (stealBra(target)) {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('stealBra') + " " + getNickname(target) + getMessage('stealBraSuffix'));
                sendPrankPacket({ type: "steal_bra", source: Player.MemberNumber, target: target.MemberNumber });
            } else {
                chatSendLocal(getMessage('stealFailed'));
            }
        } catch (error) {
            console.error("Error in stealBraCmd:", error);
        }
    }

    function stealGlovesCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /stealgloves <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));
            if (!InventoryGet(target, "Gloves")) return chatSendLocal(getNickname(target) + " " + getMessage('noGloves'));
            if (stealGloves(target)) {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('stealGloves') + " " + getNickname(target) + getMessage('stealGlovesSuffix'));
                sendPrankPacket({ type: "steal_gloves", source: Player.MemberNumber, target: target.MemberNumber });
            } else {
                chatSendLocal(getMessage('stealFailed'));
            }
        } catch (error) {
            console.error("Error in stealGlovesCmd:", error);
        }
    }

    function stealShoesCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /stealshoes <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));
            if (!InventoryGet(target, "Shoes")) return chatSendLocal(getNickname(target) + " " + getMessage('noShoes'));
            if (stealShoes(target)) {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('stealShoes') + " " + getNickname(target) + getMessage('stealShoesSuffix'));
                sendPrankPacket({ type: "steal_shoes", source: Player.MemberNumber, target: target.MemberNumber });
            } else {
                chatSendLocal(getMessage('stealFailed'));
            }
        } catch (error) {
            console.error("Error in stealShoesCmd:", error);
        }
    }

    function dyeHair(target) {
        const hairGroups = ["HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3"];
        const bundle = ServerAppearanceBundle(target.Appearance).map(item => {
            if (hairGroups.includes(item.Group)) {
                if (Array.isArray(item.Color)) {
                    item.Color = item.Color.map(() => getRandomColor());
                } else {
                    item.Color = getRandomColor();
                }
            }
            return item;
        });
        ServerSend("ChatRoomCharacterUpdate", {
            ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
            ActivePose: target.ActivePose,
            Appearance: bundle
        });
    }

    function swapOutfits(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /swap <player name or number>");

            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (target.MemberNumber === Player.MemberNumber) return chatSendLocal("You can't swap with yourself");
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));

            const clothingGroups = [
                "Cloth", "ClothLower", "Bra", "Panties", "Socks", "SocksRight", "SocksLeft",
                "Shoes", "Gloves", "Hat", "Suit", "SuitLower", "Corset", "ClothOuter", "ClothAccessory"
            ];

            // Snapshot BOTH outfits as bundles before touching anything
            const playerClothes = ServerAppearanceBundle(Player.Appearance)
                .filter(i => clothingGroups.includes(i.Group));
            const targetClothes = ServerAppearanceBundle(target.Appearance)
                .filter(i => clothingGroups.includes(i.Group));

            // Strip clothing from both characters
            clothingGroups.forEach(group => {
                try { InventoryRemove(Player, group); } catch(e) {}
                try { InventoryRemove(target, group); } catch(e) {}
            });

            // Dress player in target's saved clothes
            targetClothes.forEach(item => {
                try {
                    InventoryWear(Player, item.Name, item.Group, item.Color,
                        item.Difficulty || 0, item.MemberNumber || Player.MemberNumber, item.Craft);
                } catch(e) {}
            });

            // Dress target in player's saved clothes
            playerClothes.forEach(item => {
                try {
                    InventoryWear(target, item.Name, item.Group, item.Color,
                        item.Difficulty || 0, item.MemberNumber || Player.MemberNumber, item.Craft);
                } catch(e) {}
            });

            // Broadcast both updates via BC's own function (handles ID format correctly)
            ChatRoomCharacterUpdate(Player);
            ChatRoomCharacterUpdate(target);

            chatSendCustomAction(getNickname(Player) + " " + getMessage('swapOutfits') + " " + getNickname(target) + " " + getMessage('swapOutfitsSuffix'));
            sendPrankPacket({ type: "swap", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in swapOutfits:", error);
        }
    }

    function flash(args) {
        try {
            const target = getPlayer((args || "").trim());
            if (!target) return chatSendLocal(getMessage('notFound'));
            chatSendCustomAction(getNickname(Player) + " " + getMessage('flashAction') + " " + getNickname(target) + " " + getMessage('flashSuffix'));
            sendPrankPacket({ type: "flash", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in flash:", error);
        }
    }

    function propose(args) {
        try {
            const target = getPlayer((args || "").trim());
            if (!target) return chatSendLocal(getMessage('notFound'));
            chatSendCustomAction(getNickname(Player) + " " + getMessage('proposeAction') + " " + getNickname(target) + " " + getMessage('proposeSuffix'));
            sendPrankPacket({ type: "propose", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in propose:", error);
        }
    }

    function adopt(args) {
        try {
            const target = getPlayer((args || "").trim());
            if (!target) return chatSendLocal(getMessage('notFound'));
            chatSendCustomAction(getNickname(Player) + " " + getMessage('adoptAction') + " " + getNickname(target) + " " + getMessage('adoptSuffix'));
            sendPrankPacket({ type: "adopt", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in adopt:", error);
        }
    }

    const prankLoops = new Map();
    const outfitSnapshots = new Map(); // MemberNumber -> appearance bundle
    const mimicTargets = new Map();    // target MemberNumber -> intervalId
    const pokeCounters = new Map();    // sourceMemberNumber -> count (pokes I've received from them)
    const prankHistory = [];           // Array of {targetNumber, targetNick, type, timestamp}
    const freezeLoops = new Map();     // target MemberNumber -> intervalId
    const renamedPlayers = new Map();  // target MemberNumber -> originalNickname
    const pendingQuizzes = new Map();  // target MemberNumber -> {question, answer, timerId}
    let trustList = new Set();         // MemberNumbers whose pranks I will react to
    const prankCooldowns = new Map();  // target MemberNumber -> last prank timestamp
    const PRANK_COOLDOWN_MS = 0;       // 0 = disabled; set to e.g. 5000 for 5s cooldown

    function takeSnapshot(target) {
        try {
            outfitSnapshots.set(target.MemberNumber, JSON.parse(JSON.stringify(ServerAppearanceBundle(target.Appearance))));
        } catch (e) {
            console.error("[prank] snapshot failed:", e);
        }
    }

    function silentStrip(args) {
        try {
            const target = getPlayer((args || "").trim());
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));

            takeSnapshot(target);
            const noClothesFilter = (item) => !appearanceGroupNames.includes(item.Group);
            const appearance = ServerAppearanceBundle(target.Appearance).filter(noClothesFilter);
            ServerSend("ChatRoomCharacterUpdate", {
                ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                ActivePose: target.ActivePose,
                Appearance: appearance
            });
            // Intentionally no chat message
        } catch (error) {
            console.error("Error in silentStrip:", error);
        }
    }

    function slowStrip(args) {
        try {
            const target = getPlayer((args || "").trim());
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));

            takeSnapshot(target);
            const groups = ["Hat", "Gloves", "Shoes", "Socks", "SocksRight", "SocksLeft",
                            "Bra", "ClothAccessory", "Cloth", "ClothLower", "Suit", "SuitLower",
                            "Panties", "Corset", "ClothOuter", "Mask", "Necklace"];
            let index = 0;

            const interval = setInterval(() => {
                // Skip groups with no item
                while (index < groups.length && !InventoryGet(target, groups[index])) index++;

                if (index >= groups.length) {
                    clearInterval(interval);
                    chatSendCustomAction(getNickname(target) + " " + getMessage('slowStripDone'));
                    return;
                }

                const group = groups[index];
                const item = InventoryGet(target, group);
                if (item) {
                    const itemName = item.Asset?.Description || group;
                    InventoryRemove(target, group);
                    ChatRoomCharacterUpdate(target);
                    chatSendCustomAction(getNickname(Player) + " " + getMessage('slowStripRemoves') + " " + getNickname(target) + "'s " + itemName + "...");
                }
                index++;
            }, 3000);
        } catch (error) {
            console.error("Error in slowStrip:", error);
        }
    }

    function blackout(args) {
        try {
            const target = getPlayer((args || "").trim());
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));

            takeSnapshot(target);
            const clothingGroups = [
                "Cloth", "ClothLower", "Bra", "Panties", "Socks", "SocksRight", "SocksLeft",
                "Shoes", "Gloves", "Hat", "Suit", "SuitLower", "Corset", "ClothOuter",
                "ClothAccessory", "Necklace", "Mask", "Garters", "Bracelet", "Jewelry"
            ];
            const bundle = ServerAppearanceBundle(target.Appearance).map(item => {
                if (clothingGroups.includes(item.Group)) {
                    item.Color = Array.isArray(item.Color)
                        ? item.Color.map(() => "#000000")
                        : "#000000";
                }
                return item;
            });
            ServerSend("ChatRoomCharacterUpdate", {
                ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                ActivePose: target.ActivePose,
                Appearance: bundle
            });
            chatSendCustomAction(getNickname(Player) + " " + getMessage('blackoutAction') + " " + getNickname(target) + getMessage('blackoutSuffix'));
            sendPrankPacket({ type: "blackout", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in blackout:", error);
        }
    }

    function startLoop(args) {
        try {
            const target = getPlayer((args || "").trim());
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (prankLoops.has(target.MemberNumber)) return chatSendLocal(getMessage('loopAlready') + " " + getNickname(target));

            const id = setInterval(() => applyRandomPrank(target), 30000);
            prankLoops.set(target.MemberNumber, id);
            chatSendLocal(getMessage('loopStarted') + " " + getNickname(target));
        } catch (error) {
            console.error("Error in startLoop:", error);
        }
    }

    function stopLoop(args) {
        const targetArg = (args || "").trim();
        if (!targetArg) {
            prankLoops.forEach(id => clearInterval(id));
            prankLoops.clear();
            return chatSendLocal(getMessage('loopAllStopped'));
        }
        const target = getPlayer(targetArg);
        if (!target || !prankLoops.has(target.MemberNumber)) return chatSendLocal(getMessage('loopNone'));
        clearInterval(prankLoops.get(target.MemberNumber));
        prankLoops.delete(target.MemberNumber);
        chatSendLocal(getMessage('loopStopped') + " " + getNickname(target));
    }

    function stealGloves(target) {
        const glove = InventoryGet(target, "Gloves");
        if (!glove) return false;
        takeSnapshot(target);
        InventoryRemove(target, "Gloves");
        ChatRoomCharacterUpdate(target);
        return true;
    }

    function applyRandomPrank(target) {
        if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));

        const targetNick = getNickname(target);
        const pranks = [
            () => {
                dyeClothes(target);
                chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeClothes') + " " + targetNick + getMessage('dyeClothesTarget'));
            },
            () => {
                dyeHair(target);
                chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeHair') + " " + targetNick + getMessage('dyeHairSuffix'));
            },
            () => {
                const noClothesFilter = (item) => !appearanceGroupNames.includes(item.Group);
                const appearance = ServerAppearanceBundle(target.Appearance).filter(noClothesFilter);
                ServerSend("ChatRoomCharacterUpdate", {
                    ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                    ActivePose: target.ActivePose,
                    Appearance: appearance
                });
                chatSendCustomAction(getNickname(Player) + " " + getMessage('dissolveClothes') + " " + targetNick + getMessage('dissolveClothesTarget'));
            },
            () => {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('tickle') + " " + targetNick + getMessage('tickleSuffix'));
            },
            () => {
                if (InventoryGet(target, "Panties")) {
                    stealItem(target, "panties");
                    chatSendCustomAction(getNickname(Player) + " " + getMessage('stoleUnderwear') + " " + targetNick + getMessage('stealUnderwearSuffix'));
                } else {
                    dyeClothes(target);
                    chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeClothes') + " " + targetNick + getMessage('dyeClothesTarget'));
                }
            },
            () => {
                if (InventoryGet(target, "Hat")) {
                    stealHat(target);
                    chatSendCustomAction(getNickname(Player) + " " + getMessage('stealHat') + " " + targetNick + getMessage('stealHatSuffix'));
                } else {
                    dyeHair(target);
                    chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeHair') + " " + targetNick + getMessage('dyeHairSuffix'));
                }
            }
        ];

        chatSendCustomAction(getNickname(Player) + " " + getMessage('prankRandom') + " " + targetNick + " " + getMessage('prankRandomSuffix'));
        setTimeout(() => {
            pranks[Math.floor(Math.random() * pranks.length)]();
        }, 1500);
    }

    function prankRoulette() {
        const others = ChatRoomCharacter ? ChatRoomCharacter.filter(c => c.MemberNumber !== Player.MemberNumber) : [];
        if (others.length === 0) return chatSendLocal("No one else in the room!");

        const victim = others[Math.floor(Math.random() * others.length)];
        chatSendCustomAction(getNickname(Player) + " " + getMessage('rouletteAnnounce'));
        setTimeout(() => applyRandomPrank(victim), 1500);
    }

    function stealShoes(target) {
        const shoe = InventoryGet(target, "Shoes");
        if (!shoe) return false;
        takeSnapshot(target);
        InventoryRemove(target, "Shoes");
        ChatRoomCharacterUpdate(target);
        return true;
    }

    function resetColors(target) {
        const bundle = ServerAppearanceBundle(target.Appearance).map(item => {
            item.Color = "Default";
            return item;
        });
        ServerSend("ChatRoomCharacterUpdate", {
            ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
            ActivePose: target.ActivePose,
            Appearance: bundle
        });
    }

    function copyOutfit(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /copy <player name or number>");

            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (target.MemberNumber === Player.MemberNumber) return chatSendLocal("You can't copy yourself");

            const clothingGroups = [
                "Cloth", "ClothLower", "Bra", "Panties", "Socks", "SocksRight", "SocksLeft",
                "Shoes", "Gloves", "Hat", "Suit", "SuitLower", "Corset", "ClothOuter", "ClothAccessory"
            ];

            const playerOther   = ServerAppearanceBundle(Player.Appearance).filter(i => !clothingGroups.includes(i.Group));
            const targetClothes = ServerAppearanceBundle(target.Appearance).filter(i => clothingGroups.includes(i.Group));

            ServerSend("ChatRoomCharacterUpdate", {
                ID: Player.AccountName.replace("Online-", ""),
                ActivePose: Player.ActivePose,
                Appearance: [...playerOther, ...targetClothes]
            });

            chatSendCustomAction(getNickname(Player) + " " + getMessage('copyOutfit') + " " + getNickname(target) + getMessage('copyOutfitSuffix'));
            sendPrankPacket({ type: "copy", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in copyOutfit:", error);
        }
    }

    function dyeClothes(target) {
        takeSnapshot(target);
        const clothingGroups = [
            "Cloth", "ClothLower", "Bra", "Panties", "Socks", "SocksRight", "SocksLeft",
            "Shoes", "Gloves", "Hat", "Suit", "SuitLower", "Corset", "ClothOuter",
            "ClothAccessory", "Necklace", "Mask", "Garters", "Bracelet", "Jewelry"
        ];

        const bundle = ServerAppearanceBundle(target.Appearance);
        bundle.forEach(item => {
            if (clothingGroups.includes(item.Group)) {
                if (Array.isArray(item.Color)) {
                    item.Color = item.Color.map(() => getRandomColor());
                } else {
                    item.Color = getRandomColor();
                }
            }
        });

        ServerSend("ChatRoomCharacterUpdate", {
            ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
            ActivePose: target.ActivePose,
            Appearance: bundle
        });
    }

    function giveItem(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /give <player name or number>");

            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (target.MemberNumber === Player.MemberNumber) return chatSendLocal("You can't give an item to yourself");
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));

            const heldItem = InventoryGet(Player, "ItemHandheld");
            if (!heldItem) return chatSendLocal(getMessage('notHolding'));

            const itemAssetName = heldItem.Asset?.Name;
            const itemColor = heldItem.Color || "Default";
            const craft = heldItem.Craft;
            const displayName = craft?.Name || heldItem.Asset?.Description || itemAssetName;

            InventoryRemove(Player, "ItemHandheld");
            InventoryRemove(target, "ItemHandheld");

            InventoryWear(target, itemAssetName, "ItemHandheld", itemColor, 0, Player.MemberNumber, craft || {});

            ChatRoomCharacterUpdate(Player);
            ChatRoomCharacterUpdate(target);

            chatSendCustomAction(getNickname(Player) + " " + getMessage('giveTo') + " " + getNickname(target) + " " + displayName);
        } catch (error) {
            console.error("Error in giveItem:", error);
        }
    }

    function streak() {
        try {
            const noClothesFilter = (item) => !appearanceGroupNames.includes(item.Group);
            const appearance = ServerAppearanceBundle(Player.Appearance).filter(noClothesFilter);

            ServerSend("ChatRoomCharacterUpdate", {
                ID: Player.AccountName.replace("Online-", ""),
                ActivePose: Player.ActivePose,
                Appearance: appearance
            });

            chatSendCustomAction(getNickname(Player) + " " + getMessage('streakAction'));
        } catch (error) {
            console.error("Error in streak:", error);
        }
    }

    // ===== QoL Commands =====
    const COMMANDS_HELP = [
        { tag: "steal",       desc: "Steal panties from a player",                     usage: "/steal [player]",                    example: "/steal Alice" },
        { tag: "dissolve",    desc: "Splash potion to dissolve all of a player's clothes", usage: "/dissolve [player]",              example: "/dissolve Alice" },
        { tag: "teleport",    desc: "Open a portal and teleport to another room",      usage: "/teleport [room]",                   example: "/teleport MyRoom" },
        { tag: "give",        desc: "Give your held item to a player",                 usage: "/give [player]",                     example: "/give Alice" },
        { tag: "streak",      desc: "Strip all your own clothes off",                  usage: "/streak",                            example: "/streak" },
        { tag: "swap",        desc: "Swap outfits with a player",                      usage: "/swap [player]",                     example: "/swap Alice" },
        { tag: "copy",        desc: "Copy a player's outfit",                          usage: "/copy [player]",                     example: "/copy Alice" },
        { tag: "stealhat",    desc: "Steal a player's hat and wear it",                usage: "/stealhat [player]",                 example: "/stealhat Alice" },
        { tag: "stealbra",    desc: "Steal a player's bra",                            usage: "/stealbra [player]",                 example: "/stealbra Alice" },
        { tag: "stealgloves", desc: "Steal a player's gloves",                         usage: "/stealgloves [player]",              example: "/stealgloves Alice" },
        { tag: "stealshoes",  desc: "Steal a player's shoes",                          usage: "/stealshoes [player]",               example: "/stealshoes Alice" },
        { tag: "prank",       desc: "Apply a random prank to a player",                usage: "/prank [player]",                    example: "/prank Alice" },
        { tag: "roulette",    desc: "Random prank on a random person in the room",     usage: "/roulette",                          example: "/roulette" },
        { tag: "silentstrip", desc: "Strip a player silently (no chat message)",       usage: "/silentstrip [player]",              example: "/silentstrip Alice" },
        { tag: "slowstrip",   desc: "Gradually strip a player one item at a time",     usage: "/slowstrip [player]",                example: "/slowstrip Alice" },
        { tag: "blackout",    desc: "Turn all of a player's clothing black",           usage: "/blackout [player]",                 example: "/blackout Alice" },
        { tag: "loop",        desc: "Repeatedly prank a player every 30s",             usage: "/loop [player]",                     example: "/loop Alice" },
        { tag: "stoploop",    desc: "Stop prank loop (omit name to stop all)",         usage: "/stoploop [player]",                 example: "/stoploop" },
        { tag: "propose",     desc: "Propose to a player",                             usage: "/propose [player]",                  example: "/propose Alice" },
        { tag: "adopt",       desc: "Adopt a player as your child",                    usage: "/adopt [player]",                    example: "/adopt Alice" },
        { tag: "flash",       desc: "Flash a player",                                  usage: "/flash [player]",                    example: "/flash Alice" },
        { tag: "undo",        desc: "Restore a player's last outfit snapshot",         usage: "/undo [player]",                     example: "/undo Alice" },
        { tag: "pranks",      desc: "Show players with active prank loops",            usage: "/pranks",                            example: "/pranks" },
        { tag: "mimic",       desc: "Start mirroring a player's outfit",               usage: "/mimic [player]",                    example: "/mimic Alice" },
        { tag: "stopmimic",   desc: "Stop mirroring (omit name to stop all)",          usage: "/stopmimic [player]",                example: "/stopmimic" },
        { tag: "poke",        desc: "Poke a player",                                   usage: "/poke [player]",                     example: "/poke Alice" },
        { tag: "dare",        desc: "Dare a player to do something (optional: specify the dare)", usage: "/dare [player] [dare text]", example: "/dare Alice do a spin" },
        { tag: "taunt",       desc: "Taunt a player with a random remark",             usage: "/taunt [player]",                    example: "/taunt Alice" },
        { tag: "crown",       desc: "Crown a player with a random superlative title",  usage: "/crown [player]",                    example: "/crown Alice" },
        { tag: "gossip",      desc: "Whisper a random rumor about a player to the room", usage: "/gossip [player]",                 example: "/gossip Alice" },
        { tag: "shrink",      desc: "Cast a shrinking spell on a player",              usage: "/shrink [player]",                   example: "/shrink Alice" },
        { tag: "dye",         desc: "Dye a player's outfit a solid color (random if omitted)", usage: "/dye [player] [color|#hex]", example: "/dye Alice pink" },
        { tag: "freeze",      desc: "Lock a player's pose in place",                   usage: "/freeze [player]",                   example: "/freeze Alice" },
        { tag: "unfreeze",    desc: "Stop freezing a player (omit name to stop all)",  usage: "/unfreeze [player]",                 example: "/unfreeze Alice" },
        { tag: "rename",      desc: "Temporarily rename a player locally",             usage: "/rename [player] [nickname]",        example: "/rename Alice Shorty" },
        { tag: "unrename",    desc: "Restore a player's original local name",          usage: "/unrename [player]",                 example: "/unrename Alice" },
        { tag: "countdown",   desc: "Post a public countdown in chat (1–60 seconds)",  usage: "/countdown [seconds]",               example: "/countdown 5" },
        { tag: "quiz",        desc: "Challenge a player with trivia — prank them if wrong!", usage: "/quiz [player]",               example: "/quiz Alice" },
        { tag: "announce",    desc: "Broadcast a formatted announcement to the room",  usage: "/announce [message]",                example: "/announce Party time!" },
        { tag: "history",     desc: "Show your prank history this session",            usage: "/history [player]",                  example: "/history" },
        { tag: "stats",       desc: "Show prank stats for this session",               usage: "/stats",                             example: "/stats" },
        { tag: "trust",       desc: "Add a player to your prank-reaction trust list (show list if no args)", usage: "/trust [player]", example: "/trust Alice" },
        { tag: "untrust",     desc: "Remove a player from your trust list",            usage: "/untrust [player]",                  example: "/untrust Alice" },
        { tag: "list",        desc: "Show all prank commands",                         usage: "/list",                              example: "/list" },
        { tag: "help",        desc: "Show detailed help for a specific command",       usage: "/help [command]",                    example: "/help prank" },
    ];

    function listCommands() {
        const lines = ["=== Prank Commands ==="].concat(
            COMMANDS_HELP.map(c => `  /${c.tag} — ${c.desc}`)
        );
        chatSendLocal(lines.join("\n"), 20000);
    }

    function showPranks() {
        if (prankLoops.size === 0) return chatSendLocal("No active prank loops.");
        const lines = ["Active prank loops:"];
        prankLoops.forEach((_, memberNumber) => {
            const c = ChatRoomCharacter ? ChatRoomCharacter.find(x => x.MemberNumber === memberNumber) : null;
            lines.push("  " + (c ? getNickname(c) : "MemberNumber " + memberNumber));
        });
        lines.forEach(line => chatSendLocal(line));
    }

    function undoOutfit(args) {
        try {
            const targetArg = (args || "").trim();
            const target = targetArg ? getPlayer(targetArg) : Player;
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (target.MemberNumber !== Player.MemberNumber && !hasBCItemPermission(target)) {
                return chatSendLocal(getMessage('noPermission'));
            }
            const snapshot = outfitSnapshots.get(target.MemberNumber);
            if (!snapshot) return chatSendLocal("No snapshot for " + getNickname(target));
            ServerSend("ChatRoomCharacterUpdate", {
                ID: target.MemberNumber === Player.MemberNumber
                    ? Player.AccountName.replace("Online-", "")
                    : (target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", "")),
                ActivePose: target.ActivePose,
                Appearance: snapshot
            });
            outfitSnapshots.delete(target.MemberNumber);
            chatSendLocal("Restored outfit for " + getNickname(target));
        } catch (error) {
            console.error("Error in undoOutfit:", error);
        }
    }

    function startMimic(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /mimic <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (target.MemberNumber === Player.MemberNumber) return chatSendLocal("You can't mimic yourself");
            if (mimicTargets.has(target.MemberNumber)) return chatSendLocal("Already mimicking " + getNickname(target));

            const clothingGroups = [
                "Cloth", "ClothLower", "Bra", "Panties", "Socks", "SocksRight", "SocksLeft",
                "Shoes", "Gloves", "Hat", "Suit", "SuitLower", "Corset", "ClothOuter", "ClothAccessory"
            ];

            const id = setInterval(() => {
                const fresh = ChatRoomCharacter ? ChatRoomCharacter.find(c => c.MemberNumber === target.MemberNumber) : null;
                if (!fresh) return;
                const selfOther   = ServerAppearanceBundle(Player.Appearance).filter(i => !clothingGroups.includes(i.Group));
                const targetCloth = ServerAppearanceBundle(fresh.Appearance).filter(i => clothingGroups.includes(i.Group));
                ServerSend("ChatRoomCharacterUpdate", {
                    ID: Player.AccountName.replace("Online-", ""),
                    ActivePose: fresh.ActivePose || Player.ActivePose,
                    Appearance: [...selfOther, ...targetCloth]
                });
            }, 3000);

            mimicTargets.set(target.MemberNumber, id);
            chatSendLocal("Now mimicking " + getNickname(target));
            chatSendCustomAction(getNickname(Player) + " starts copying " + getNickname(target) + "'s every move... 🪞");
            sendPrankPacket({ type: "mimic", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in startMimic:", error);
        }
    }

    function stopMimic(args) {
        const targetArg = (args || "").trim();
        if (!targetArg) {
            mimicTargets.forEach(id => clearInterval(id));
            mimicTargets.clear();
            return chatSendLocal("Stopped all mimic loops.");
        }
        const target = getPlayer(targetArg);
        if (!target || !mimicTargets.has(target.MemberNumber)) return chatSendLocal("Not mimicking that player.");
        clearInterval(mimicTargets.get(target.MemberNumber));
        mimicTargets.delete(target.MemberNumber);
        chatSendLocal("Stopped mimicking " + getNickname(target));
    }

    function pokeCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /poke <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            const isSelf = target.MemberNumber === Player.MemberNumber;
            if (isSelf) {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('pokeSelf'));
            } else {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('pokeAction') + " " + getNickname(target) + " " + getMessage('pokeSuffix'));
                sendPrankPacket({ type: "poke", source: Player.MemberNumber, target: target.MemberNumber });
            }
        } catch (error) {
            console.error("Error in pokeCmd:", error);
        }
    }

    const RANDOM_DARES = [
        "spin around three times without stopping",
        "compliment every person in the room",
        "do their best superhero pose",
        "tell a joke (it has to be funny)",
        "confess something embarrassing",
        "sing a line from their favorite song",
        "act like a cat for 10 seconds",
        "do their best impression of someone here",
        "strike a dramatic pose and hold it for 5 seconds",
        "say something kind to the next person who speaks"
    ];

    function dareCmd(args) {
        try {
            const parts = (args || "").trim().split(/\s+/);
            if (!parts[0]) return chatSendLocal("Usage: /dare <player> [dare text]");
            const target = getPlayer(parts[0]);
            if (!target) return chatSendLocal(getMessage('notFound'));
            const dareText = parts.slice(1).join(" ") || RANDOM_DARES[Math.floor(Math.random() * RANDOM_DARES.length)];
            chatSendCustomAction(getNickname(Player) + " " + getMessage('dareAction') + " " + getNickname(target) + " to " + dareText + getMessage('dareSuffix'));
            sendPrankPacket({ type: "dare", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in dareCmd:", error);
        }
    }

    const RANDOM_TAUNTS = [
        "bets you can't even touch your toes 🤭",
        "doesn't think you have what it takes 😏",
        "says your dance moves seriously need work 💃",
        "wonders if you're always this easy to tease 😈",
        "thinks your poker face needs serious practice 🃏",
        "is pretty sure a goldfish has a longer attention span than you 🐟",
        "challenges you to do something impressive for once 👀",
        "heard your fashion sense went on vacation and never came back 🧣",
        "says you look like you need a hug... or maybe just a nap 😴",
        "bets you blink first 👁️"
    ];

    function tauntCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /taunt <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            const line = RANDOM_TAUNTS[Math.floor(Math.random() * RANDOM_TAUNTS.length)];
            chatSendCustomAction(getNickname(Player) + " " + getMessage('tauntAction') + " " + getNickname(target) + ": \"" + line + "\"");
            sendPrankPacket({ type: "taunt", source: Player.MemberNumber, target: target.MemberNumber });
        } catch (error) {
            console.error("Error in tauntCmd:", error);
        }
    }

    const RANDOM_SUPERLATIVES = [
        "Most Likely to Trip Over Their Own Shoes",
        "Most Likely to Cause Chaos and Blame Someone Else",
        "Most Likely to Be Found Napping in a Corner",
        "Best Hair in the Room (Probably)",
        "Most Likely to Challenge a Random Stranger",
        "Reigning Champion of Absolutely Nothing",
        "Most Dramatically Underestimated Person Here",
        "Voted Most Likely to Start a Spontaneous Dance Party",
        "Official Room Gremlin",
        "Certified Main Character Energy",
        "Most Likely to Steal the Show Without Even Trying",
        "Undisputed Vibe Check Champion"
    ];

    function crownCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /crown <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            const title = RANDOM_SUPERLATIVES[Math.floor(Math.random() * RANDOM_SUPERLATIVES.length)];
            chatSendCustomAction(getNickname(Player) + " places a crown on " + getNickname(target) + " — officially declaring them \"" + title + "\" 👑");
        } catch (error) {
            console.error("Error in crownCmd:", error);
        }
    }

    const RANDOM_GOSSIP = [
        "apparently fell asleep during their own story once",
        "was once outsmarted by a door",
        "has a secret talent nobody knows about",
        "once tried to pet a statue thinking it was a cat",
        "claims to be a morning person but nobody believes them",
        "reportedly laughed at their own joke for five minutes straight",
        "once got lost in a room with only two doors",
        "absolutely cannot resist a good conspiracy theory",
        "has never finished a single cup of tea while it was still warm",
        "once waved back at someone who wasn't actually waving at them"
    ];

    function gossipCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /gossip <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            const rumor = RANDOM_GOSSIP[Math.floor(Math.random() * RANDOM_GOSSIP.length)];
            chatSendCustomAction(getNickname(Player) + " leans in and whispers to the room: \"I heard " + getNickname(target) + " " + rumor + "...\" 🤫");
        } catch (error) {
            console.error("Error in gossipCmd:", error);
        }
    }

    // ===== Prank History & Stats =====
    function logPrank(target, type) {
        prankHistory.push({
            targetNumber: target.MemberNumber,
            targetNick: getNickname(target),
            type,
            timestamp: Date.now()
        });
    }

    // ===== Cooldown Helper =====
    function checkAndUpdateCooldown(target) {
        if (PRANK_COOLDOWN_MS <= 0) return true;
        const now = Date.now();
        const last = prankCooldowns.get(target.MemberNumber) || 0;
        if (now - last < PRANK_COOLDOWN_MS) {
            const remaining = Math.ceil((PRANK_COOLDOWN_MS - (now - last)) / 1000);
            chatSendLocal("Cooldown active for " + getNickname(target) + " (" + remaining + "s remaining)");
            return false;
        }
        prankCooldowns.set(target.MemberNumber, now);
        return true;
    }

    // ===== Trust List =====
    function loadTrustList() {
        try {
            const saved = localStorage.getItem("lscc_trust_list");
            if (saved) JSON.parse(saved).forEach(n => trustList.add(n));
        } catch(e) {}
    }

    function saveTrustList() {
        try {
            localStorage.setItem("lscc_trust_list", JSON.stringify([...trustList]));
        } catch(e) {}
    }

    function isPrankAllowed(sourceMemberNumber) {
        if (trustList.size === 0) return true;
        return trustList.has(sourceMemberNumber);
    }

    function trustCmd(args) {
        const targetArg = (args || "").trim();
        if (!targetArg) {
            if (trustList.size === 0) return chatSendLocal(getMessage('trustEmpty'));
            const lines = [getMessage('trustListHeader')];
            trustList.forEach(num => {
                const c = ChatRoomCharacter ? ChatRoomCharacter.find(x => x.MemberNumber === num) : null;
                lines.push("  " + (c ? getNickname(c) : "#" + num));
            });
            return chatSendLocal(lines.join("\n"), 15000);
        }
        const target = getPlayer(targetArg);
        if (!target) return chatSendLocal(getMessage('notFound'));
        if (trustList.has(target.MemberNumber)) return chatSendLocal(getMessage('trustAlready') + " " + getNickname(target));
        trustList.add(target.MemberNumber);
        saveTrustList();
        chatSendLocal(getMessage('trustAdded') + " " + getNickname(target));
    }

    function untrustCmd(args) {
        const targetArg = (args || "").trim();
        if (!targetArg) return chatSendLocal("Usage: /untrust <player>");
        const target = getPlayer(targetArg);
        if (!target) return chatSendLocal(getMessage('notFound'));
        if (!trustList.has(target.MemberNumber)) return chatSendLocal(getMessage('trustNotIn') + " " + getNickname(target));
        trustList.delete(target.MemberNumber);
        saveTrustList();
        chatSendLocal(getMessage('trustRemoved') + " " + getNickname(target));
    }

    // ===== /shrink =====
    function shrinkCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /shrink <player>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            const isSelf = target.MemberNumber === Player.MemberNumber;
            if (isSelf) {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('shrinkSelf'));
            } else {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('shrinkAction') + " " + getNickname(target) + getMessage('shrinkSuffix'));
                logPrank(target, "shrink");
                sendPrankPacket({ type: "shrink", source: Player.MemberNumber, target: target.MemberNumber });
            }
        } catch (error) {
            console.error("Error in shrinkCmd:", error);
        }
    }

    // ===== /dye =====
    const DYE_COLOR_MAP = {
        red: "#FF0000", green: "#00CC00", blue: "#0055FF", yellow: "#FFE000",
        pink: "#FF69B4", purple: "#9400D3", orange: "#FF8C00", white: "#FFFFFF",
        black: "#000000", cyan: "#00CCCC", teal: "#008080", gold: "#FFD700",
        silver: "#C0C0C0", brown: "#8B4513", lime: "#00FF00", navy: "#000080"
    };

    function dyeColorCmd(args) {
        try {
            const parts = (args || "").trim().split(/\s+/);
            if (!parts[0]) return chatSendLocal("Usage: /dye <player> [color|#hex]");
            const target = getPlayer(parts[0]);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));
            if (!checkAndUpdateCooldown(target)) return;

            const colorArg = parts[1] || null;
            let color;
            let colorLabel;
            if (colorArg) {
                const mapped = DYE_COLOR_MAP[colorArg.toLowerCase()];
                if (mapped) {
                    color = mapped;
                    colorLabel = colorArg.toLowerCase();
                } else if (/^#[0-9A-Fa-f]{6}$/.test(colorArg)) {
                    color = colorArg;
                    colorLabel = colorArg;
                } else {
                    color = getRandomColor();
                    colorLabel = "random colors";
                }
            } else {
                color = getRandomColor();
                colorLabel = "random colors";
            }

            takeSnapshot(target);
            const clothingGroups = [
                "Cloth", "ClothLower", "Bra", "Panties", "Socks", "SocksRight", "SocksLeft",
                "Shoes", "Gloves", "Hat", "Suit", "SuitLower", "Corset", "ClothOuter",
                "ClothAccessory", "Necklace", "Mask", "Garters", "Bracelet", "Jewelry"
            ];
            const bundle = ServerAppearanceBundle(target.Appearance).map(item => {
                if (clothingGroups.includes(item.Group)) {
                    item.Color = Array.isArray(item.Color) ? item.Color.map(() => color) : color;
                }
                return item;
            });
            ServerSend("ChatRoomCharacterUpdate", {
                ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                ActivePose: target.ActivePose,
                Appearance: bundle
            });

            const isSelf = target.MemberNumber === Player.MemberNumber;
            if (isSelf) {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeColorSelfAction') + " " + colorLabel + "! 🎨");
            } else {
                chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeColorAction') + " " + getNickname(target) + getMessage('dyeColorMidfix') + " " + colorLabel + "! 🎨");
                logPrank(target, "dye_color");
                sendPrankPacket({ type: "dye_color", source: Player.MemberNumber, target: target.MemberNumber });
            }
        } catch (error) {
            console.error("Error in dyeColorCmd:", error);
        }
    }

    // ===== /freeze / /unfreeze =====
    function freezeCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /freeze <player>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (target.MemberNumber === Player.MemberNumber) return chatSendLocal("You can't freeze yourself");
            if (!hasBCItemPermission(target)) return chatSendLocal(getMessage('noPermission'));
            if (freezeLoops.has(target.MemberNumber)) return chatSendLocal(getMessage('freezeAlready') + " " + getNickname(target));

            const frozenPose = target.ActivePose ? [...target.ActivePose] : [];
            const id = setInterval(() => {
                const fresh = ChatRoomCharacter ? ChatRoomCharacter.find(c => c.MemberNumber === target.MemberNumber) : null;
                if (!fresh) return;
                ServerSend("ChatRoomCharacterUpdate", {
                    ID: fresh.ID === 0 ? fresh.OnlineID : fresh.AccountName.replace("Online-", ""),
                    ActivePose: frozenPose,
                    Appearance: ServerAppearanceBundle(fresh.Appearance)
                });
            }, 2000);

            freezeLoops.set(target.MemberNumber, id);
            chatSendCustomAction(getNickname(Player) + " " + getMessage('freezeAction') + " " + getNickname(target) + getMessage('freezeSuffix'));
            logPrank(target, "freeze");
            sendPrankPacket({ type: "freeze", source: Player.MemberNumber, target: target.MemberNumber });
            chatSendLocal(getMessage('freezeStarted') + " " + getNickname(target));
        } catch (error) {
            console.error("Error in freezeCmd:", error);
        }
    }

    function unfreezeCmd(args) {
        const targetArg = (args || "").trim();
        if (!targetArg) {
            freezeLoops.forEach(id => clearInterval(id));
            freezeLoops.clear();
            return chatSendLocal(getMessage('freezeAllStopped'));
        }
        const target = getPlayer(targetArg);
        if (!target || !freezeLoops.has(target.MemberNumber)) return chatSendLocal(getMessage('freezeNone'));
        clearInterval(freezeLoops.get(target.MemberNumber));
        freezeLoops.delete(target.MemberNumber);
        chatSendLocal(getMessage('freezeStopped') + " " + getNickname(target));
    }

    // ===== /rename / /unrename =====
    function renameCmd(args) {
        try {
            const parts = (args || "").trim().split(/\s+/);
            if (parts.length < 2) return chatSendLocal(getMessage('renameUsage'));
            const target = getPlayer(parts[0]);
            if (!target) return chatSendLocal(getMessage('notFound'));
            const newNick = parts.slice(1).join(" ");
            if (!renamedPlayers.has(target.MemberNumber)) {
                renamedPlayers.set(target.MemberNumber, target.Nickname || target.Name);
            }
            target.Nickname = newNick;
            chatSendLocal(getMessage('renameAction') + " " + (target.Name || target.AccountName) + " " + getMessage('renameSuffix') + " \"" + newNick + "\" " + getMessage('renameLocalNote'));
        } catch (error) {
            console.error("Error in renameCmd:", error);
        }
    }

    function unrenameCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /unrename <player name or number>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (!renamedPlayers.has(target.MemberNumber)) return chatSendLocal(getMessage('renameNotFound') + " " + (target.Name || target.AccountName));
            target.Nickname = renamedPlayers.get(target.MemberNumber);
            renamedPlayers.delete(target.MemberNumber);
            chatSendLocal(getMessage('unrenameAction') + " " + (target.Name || target.AccountName));
        } catch (error) {
            console.error("Error in unrenameCmd:", error);
        }
    }

    // ===== /countdown =====
    function countdownCmd(args) {
        try {
            const secs = parseInt((args || "").trim());
            if (!secs || secs < 1 || secs > 60) return chatSendLocal("Usage: /countdown <1-60>");
            chatSendCustomAction(getNickname(Player) + " " + getMessage('countdownAction'));
            let remaining = secs;
            const id = setInterval(() => {
                if (remaining > 0) {
                    chatSendCustomAction(remaining + "…");
                    remaining--;
                } else {
                    clearInterval(id);
                    chatSendCustomAction(getMessage('countdownBoom'));
                }
            }, 1000);
        } catch (error) {
            console.error("Error in countdownCmd:", error);
        }
    }

    // ===== /quiz =====
    const QUIZ_QUESTIONS = [
        { q: "What color do you get when you mix red and blue?", a: "purple" },
        { q: "How many sides does a triangle have?", a: "3" },
        { q: "What is the opposite of hot?", a: "cold" },
        { q: "What animal says 'moo'?", a: "cow" },
        { q: "What comes after Monday?", a: "tuesday" },
        { q: "How many legs does a spider have?", a: "8" },
        { q: "What is 7 + 5?", a: "12" },
        { q: "What season comes after winter?", a: "spring" },
        { q: "What is the biggest planet in our solar system?", a: "jupiter" },
        { q: "How many fingers are on one hand?", a: "5" },
        { q: "What do bees make?", a: "honey" },
        { q: "How many days are in a week?", a: "7" }
    ];

    function quizCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (!targetArg) return chatSendLocal("Usage: /quiz <player>");
            const target = getPlayer(targetArg);
            if (!target) return chatSendLocal(getMessage('notFound'));
            if (pendingQuizzes.has(target.MemberNumber)) return chatSendLocal(getMessage('quizAlready') + " " + getNickname(target));

            const qz = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
            const timerId = setTimeout(() => {
                if (pendingQuizzes.has(target.MemberNumber)) {
                    pendingQuizzes.delete(target.MemberNumber);
                    chatSendCustomAction(getNickname(target) + " " + getMessage('quizWrong'));
                    setTimeout(() => applyRandomPrank(target), 1000);
                }
            }, 30000);

            pendingQuizzes.set(target.MemberNumber, { question: qz.q, answer: qz.a, timerId });
            chatSendCustomAction(getNickname(Player) + " " + getMessage('quizAction') + " " + getNickname(target) + " " + getMessage('quizSuffix') + " \"" + qz.q + "\" (30 seconds!)");
        } catch (error) {
            console.error("Error in quizCmd:", error);
        }
    }

    // ===== /announce =====
    function announceCmd(args) {
        try {
            const msg = (args || "").trim();
            if (!msg) return chatSendLocal(getMessage('announceUsage'));
            chatSendCustomAction("📢 【 " + msg + " 】");
        } catch (error) {
            console.error("Error in announceCmd:", error);
        }
    }

    // ===== /history =====
    function historyCmd(args) {
        try {
            const targetArg = (args || "").trim();
            if (prankHistory.length === 0) return chatSendLocal(getMessage('historyNone'));

            let filtered = prankHistory;
            if (targetArg) {
                const target = getPlayer(targetArg);
                if (!target) return chatSendLocal(getMessage('notFound'));
                filtered = prankHistory.filter(e => e.targetNumber === target.MemberNumber);
                if (filtered.length === 0) return chatSendLocal(getMessage('historyEmpty') + " " + getNickname(target));
            }

            const lines = ["=== Prank History ==="];
            filtered.slice(-20).forEach(e => {
                const time = new Date(e.timestamp).toLocaleTimeString();
                lines.push("  [" + time + "] " + e.type + " → " + e.targetNick);
            });
            chatSendLocal(lines.join("\n"), 20000);
        } catch (error) {
            console.error("Error in historyCmd:", error);
        }
    }

    // ===== /stats =====
    function statsCmd() {
        try {
            if (prankHistory.length === 0) return chatSendLocal(getMessage('statsNone'));
            const counts = {};
            prankHistory.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
            const lines = [getMessage('statsHeader'), "  " + getMessage('statsTotal') + " " + prankHistory.length];
            Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
                lines.push("  " + type + ": " + count);
            });
            chatSendLocal(lines.join("\n"), 20000);
        } catch (error) {
            console.error("Error in statsCmd:", error);
        }
    }

    // ===== /help =====
    function helpCmd(args) {
        try {
            const tag = (args || "").trim().toLowerCase().replace(/^\//, "");
            if (!tag) return chatSendLocal(getMessage('helpUsage'));
            const cmd = COMMANDS_HELP.find(c => c.tag === tag);
            if (!cmd) return chatSendLocal(getMessage('helpNotFound') + " /" + tag);
            const lines = ["/" + cmd.tag + " — " + cmd.desc];
            if (cmd.usage) lines.push("  " + getMessage('helpUsageLabel') + " " + cmd.usage);
            if (cmd.example) lines.push("  " + getMessage('helpExample') + " " + cmd.example);
            chatSendLocal(lines.join("\n"), 15000);
        } catch (error) {
            console.error("Error in helpCmd:", error);
        }
    }

    // ===== Hidden packet handler =====
    const PRANK_REACTIONS = {
        tickle:        ["bursts into uncontrollable laughter, tears streaming 😂",
                        "squirms and kicks trying to escape the tickles 🤣",
                        "begs for mercy between fits of giggles 😆",
                        "collapses giggling and can barely breathe 😂"],
        headpat:       ["melts a little and leans into the headpat 🥺",
                        "makes a small happy noise and scrunches up 🐾",
                        "tries to look dignified but clearly enjoys it 💕",
                        "lets out a tiny contented sigh ✨"],
        bonk:          ["rubs their head and glares indignantly 😤",
                        "yelps and clutches their head 🤕",
                        "crosses their arms and sulks 😒",
                        "opens their mouth to protest but can't find the words 😶"],
        serenade:      ["covers their face and turns absolutely scarlet 😳",
                        "desperately looks for somewhere to hide 😖",
                        "starts slowly backing away 😅",
                        "slow claps sarcastically, face completely red 👏"],
        noogie:        ["flails helplessly and demands to be released 😤",
                        "squirms furiously to no avail 😩",
                        "lets out a long-suffering groan 😮‍💨",
                        "vows revenge with great dignity 😤"],
        wedgie:        ["lets out an undignified yelp of surprise 😱",
                        "turns bright red and shuffles awkwardly 😳",
                        "stares in disbelief at their predicament 😶"],
        tease:         ["goes absolutely scarlet and refuses to make eye contact 🌹",
                        "sputters incoherently and looks away 💦",
                        "covers their face and pretends not to exist 🫣",
                        "makes a strangled noise and stares at the floor 😳"],
        steal_panties: ["looks down with wide eyes in complete shock 😱",
                        "makes a horrified noise and covers themselves 🙈",
                        "stands frozen in absolute disbelief 😶",
                        "lets out a very undignified squeak 😳"],
        steal_bra:     ["grabs at their chest in shock 😱",
                        "gasps and immediately crosses their arms 😤",
                        "stands frozen for a full second before reacting 😶"],
        steal_hat:     ["reaches up to their head with a confused expression 🤔",
                        "looks around frantically for their hat 👀",
                        "pats their bare head in utter bewilderment 😶"],
        steal_gloves:  ["looks down at their hands in surprise 👀",
                        "flexes their fingers bewilderedly 🤔",
                        "stares at their bare hands in mild indignation 😤"],
        steal_shoes:   ["wiggles their bare toes and looks down in disbelief 😱",
                        "shuffles awkwardly on the cold floor 🤣",
                        "looks around helplessly for their shoes 👀"],
        dissolve:      ["shrieks and frantically tries to cover themselves 😱",
                        "stands there in absolute shock for a moment 😶",
                        "makes a noise that is not entirely a word 🙈"],
        dye_clothes:   ["stares at their outfit in horrified silence 😱",
                        "turns slowly to witness the full rainbow damage 🌈",
                        "opens their mouth, closes it, opens it again 😶"],
        dye_hair:      ["frantically pats their newly colored hair in dismay 😱",
                        "catches a glimpse in a reflection and freezes 🪞",
                        "touches their hair and lets out a quiet noise of despair 😩"],
        flash:         ["covers their eyes with a scandalized expression 🙈",
                        "stares wide-eyed and then immediately looks away 😳",
                        "shields their gaze with a hand and sputters 🫣"],
        swap:          ["looks down at their new outfit with deep confusion 😶",
                        "glances between themselves and the other person in bewilderment 👀"],
        copy:          ["squints and looks between themselves and their copycat 👀",
                        "puts their hands on their hips, thoroughly unimpressed 😒"],
        propose:       ["looks startled and goes bright pink 💍",
                        "claps their hands to their cheeks in shock 😳",
                        "stares with wide unbelieving eyes 💕"],
        adopt:         ["blinks in utter confusion at what just happened 👨‍👧",
                        "slowly processes the new family arrangement 🤔",
                        "looks both touched and baffled simultaneously 😶"],
        blackout:      ["looks down at their pitch-black outfit in dismay 🖤",
                        "stares at the darkness that was once a colorful wardrobe 😶",
                        "holds up a sleeve and squints at it in disbelief 🖤"],
        mimic:         ["notices something eerily familiar about someone's outfit 🪞",
                        "does a double-take at the suspiciously similar-looking person 👀",
                        "looks between themselves and the copycat with growing suspicion 🪞"],
        shrink:        ["looks down at their hands in sudden alarm 🔬",
                        "glances around as the room suddenly seems much bigger 😱",
                        "squeaks in surprise and looks very small indeed ✨"],
        freeze:        ["goes completely rigid and can't seem to move at all! 🧊",
                        "stands stock-still, apparently frozen in place 🥶",
                        "blinks rapidly, willing their limbs to respond 🧊"],
        steal_collar:  ["reaches for their neck in surprise 😱",
                        "looks confused at the sudden lightness around their neck 🤔",
                        "pats their bare neck with wide eyes 📿"],
        spin:          ["spins around with a startled yelp! 🌀",
                        "stumbles dizzily when released, holding their head 😵",
                        "grabs onto the nearest thing to stop spinning 🌀"],
        piggyback:     ["staggers slightly under the unexpected weight 😅",
                        "laughs and reaches back to hold on properly 😄",
                        "protests loudly while being hauled around 😤"],
        highfive:      ["claps hands with a satisfying smack! 🙌",
                        "grins and returns the high five enthusiastically 🙌"],
        trip:          ["catches themselves just in time 😅",
                        "stumbles forward with a very surprised noise 😮",
                        "trips and does a surprisingly graceful recovery 🤸"],
        dye_color:     ["looks down at their now-monochrome outfit in dismay 😱",
                        "stares at the overwhelming single color in pure horror 🎨",
                        "opens their mouth to protest and simply can't find the words 😶"],
        dye_one_item:  ["notices a suspicious new splash of color on their outfit 🎨",
                        "looks at the newly painted item and sighs deeply 😩",
                        "stares at the freshly-dyed spot with a resigned expression 😶"]
    };

    function prankReact(type, sourceNick) {
        const lines = PRANK_REACTIONS[type];
        if (!lines) return;
        const line = lines[Math.floor(Math.random() * lines.length)];
        setTimeout(() => chatSendCustomAction(getNickname(Player) + " " + line), 700);
    }

    function handlePrankPacket(payload, senderMemberNumber) {
        if (!payload || !payload.type) return;
        const isTarget = payload.target === Player.MemberNumber;

        // Trust check: if trust list is non-empty and source is not in it, suppress reactions
        if (isTarget && !isPrankAllowed(payload.source)) return;

        switch (payload.type) {
            case "poke": {
                if (!isTarget) break;
                const count = (pokeCounters.get(payload.source) || 0) + 1;
                pokeCounters.set(payload.source, count);
                const src = ChatRoomCharacter?.find(c => c.MemberNumber === payload.source);
                const srcNick = src ? getNickname(src) : "Someone";
                const myNick = getNickname(Player);
                if (count <= 2) {
                    setTimeout(() => chatSendCustomAction(myNick + " glances over at " + srcNick + " with a raised eyebrow 👀"), 700);
                } else if (count <= 4) {
                    setTimeout(() => chatSendCustomAction(myNick + " squirms and tries to dodge away from " + srcNick + " 😤"), 700);
                } else if (count <= 6) {
                    setTimeout(() => chatSendCustomAction(myNick + " has had ENOUGH — pokes " + srcNick + " right back! 👉"), 700);
                } else {
                    setTimeout(() => chatSendCustomAction(myNick + " is completely unfazed. Professional poker-resistance achieved 🛡️"), 700);
                }
                break;
            }
            case "dare":
                if (isTarget) chatSendLocal("You've been dared! Respond in chat... if you dare. 🎯");
                break;
            case "taunt":
                if (isTarget) chatSendLocal("You've been taunted! Retaliate with /taunt 😏");
                break;
            case "propose":
                if (isTarget) {
                    chatSendLocal("You've been proposed to! 💍 How will you respond?");
                    prankReact("propose");
                }
                break;
            case "adopt":
                if (isTarget) {
                    chatSendLocal("You've been adopted! 👨‍👧");
                    prankReact("adopt");
                }
                break;
            case "mimic":
                if (isTarget) {
                    chatSendLocal("Someone is mimicking your outfit! 🪞");
                    prankReact("mimic");
                }
                break;
            case "blackout":
                if (isTarget) {
                    chatSendLocal("Your outfit has been turned all black... 🖤");
                    prankReact("blackout");
                }
                break;
            case "tickle":
            case "headpat":
            case "bonk":
            case "serenade":
            case "noogie":
            case "wedgie":
            case "tease":
            case "steal_panties":
            case "steal_bra":
            case "steal_hat":
            case "steal_gloves":
            case "steal_shoes":
            case "steal_collar":
            case "dissolve":
            case "dye_clothes":
            case "dye_hair":
            case "dye_color":
            case "dye_one_item":
            case "flash":
            case "swap":
            case "copy":
            case "shrink":
            case "freeze":
            case "spin":
            case "piggyback":
            case "highfive":
            case "trip":
                if (isTarget) prankReact(payload.type);
                break;

        }
    }

    // ===== Register Activities =====
    function registerActivities() {
        ImagePathHelper.clearCache();

        actData.CustomPrerequisiteFuncs.set("lsccCanInteract", function(target1, target2, group) {
            return target1.CanInteract();
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasBCItemPermission", function(target1, target2, group) {
            return hasBCItemPermission(target2);
        });

        actData.CustomPrerequisiteFuncs.set("lsccHoldingScissors", function(target1, target2, group) {
            const handItem = InventoryGet(target1, "ItemHandheld");
            return handItem && handItem.Asset && handItem.Asset.Name === "Scissors";
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasClothing", function(target1, target2, group) {
            return true;
        });

        actData.CustomPrerequisiteFuncs.set("lsccTargetHasClothing", function(target1, target2, group) {
            return hasRemovableClothing(target2, group?.Name);
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasPanties", function(target1, target2, group) {
            return !!InventoryGet(target2, "Panties");
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasSocks", function(target1, target2, group) {
            return !!(InventoryGet(target2, "Socks") || InventoryGet(target2, "SocksRight") || InventoryGet(target2, "SocksLeft"));
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasAhoge", function(target1, target2, group) {
            return !!(InventoryGet(target2, "额外头发_Luzi"))
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasBra", function(target1, target2, group) {
            return !!InventoryGet(target2, "Bra");
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasHat", function(target1, target2, group) {
            return !!InventoryGet(target2, "Hat");
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasShoes", function(target1, target2, group) {
            return !!InventoryGet(target2, "Shoes");
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasGloves", function(target1, target2, group) {
            return !!InventoryGet(target2, "Gloves");
        });

        actData.CustomPrerequisiteFuncs.set("lsccHasNecklace", function(target1, target2, group) {
            return !!InventoryGet(target2, "Necklace");
        });

        const clothingTargets = [
            "ItemHead", "ItemNeck", "ItemNeckAccessories", "ItemNeckRestraints",
            "ItemNipples", "ItemNipplesPiercings", "ItemBreast",
            "ItemArms", "ItemHands", "ItemHandheld",
            "ItemTorso", "ItemTorso2",
            "ItemPelvis", "ItemButt", "ItemVulvaPiercings", "ItemVulva", "ItemPenis", "ItemGlans",
            "ItemBoots", "ItemLegs", "ItemFeet",
            "ItemMouth"
        ];

        // 1. Cut Clothes
        AddActivity({
            Activity: {
                Name: "CutClothes",
                MaxProgress: 50,
                MaxProgressSelf: 50,
                Prerequisite: []
            },
            Targets: clothingTargets.map(t => ({
                TargetLabel: getMessage('actCutClothes'),
                Name: t,
                SelfAllowed: true,
                TargetAction: getMessage('actCutClothesDesc'),
                TargetSelfAction: getMessage('actCutClothesSelf')
            })),
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHoldingScissors", Func: actData.CustomPrerequisiteFuncs.get("lsccHoldingScissors") },
                { Name: "lsccTargetHasClothing", Func: actData.CustomPrerequisiteFuncs.get("lsccTargetHasClothing") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const focusGroup = target.FocusGroup?.Name;
                    if (focusGroup) {
                        const item = removeClothing(target, focusGroup);
                        if (item) {
                            const isSelf = target.MemberNumber === Player.MemberNumber;
                            if (isSelf) {
                                chatSendCustomAction(getNickname(Player) + " " + getMessage('cutOwnClothes') + " " + item);
                            } else {
                                chatSendCustomAction(getNickname(Player) + " " + getMessage('cutClothes') + " " + getNickname(target) + getMessage('cutClothesTarget') + " " + item);
                            }
                        } else {
                            chatSendCustomAction(getNickname(target) + " " + getMessage('nothingToRemove'));
                        }
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHandheld/Preview/Scissors.png")
        });

        // 2. Remove Clothes
        AddActivity({
            Activity: {
                Name: "RemoveClothes",
                MaxProgress: 40,
                MaxProgressSelf: 40,
                Prerequisite: []
            },
            Targets: clothingTargets.map(t => ({
                TargetLabel: getMessage('actRemoveClothes'),
                Name: t,
                SelfAllowed: true,
                TargetAction: getMessage('actRemoveClothesDesc'),
                TargetSelfAction: getMessage('actRemoveClothesSelf')
            })),
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccTargetHasClothing", Func: actData.CustomPrerequisiteFuncs.get("lsccTargetHasClothing") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const focusGroup = target.FocusGroup?.Name;
                    if (focusGroup) {
                        const item = removeClothing(target, focusGroup);
                        if (item) {
                            const isSelf = target.MemberNumber === Player.MemberNumber;
                            if (isSelf) {
                                chatSendCustomAction(getNickname(Player) + " " + getMessage('removeOwnClothes') + " " + item);
                            } else {
                                chatSendCustomAction(getNickname(Player) + " " + getMessage('removeClothes') + " " + getNickname(target) + getMessage('cutClothesTarget') + " " + item);
                            }
                        } else {
                            chatSendCustomAction(getNickname(target) + " " + getMessage('nothingToRemove'));
                        }
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 3. Dissolve Clothes
        AddActivity({
            Activity: {
                Name: "DissolveClothes",
                MaxProgress: 60,
                MaxProgressSelf: 60,
                Prerequisite: []
            },
            Targets: [{
                TargetLabel: getMessage('actDissolveClothes'),
                Name: "ItemHead",
                SelfAllowed: true,
                TargetAction: getMessage('actDissolveClothesDesc'),
                TargetSelfAction: getMessage('actDissolveClothesSelf')
            }],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const noClothesFilter = (item) => !appearanceGroupNames.includes(item.Group);
                    const appearance = ServerAppearanceBundle(target.Appearance).filter(noClothesFilter);

                    ServerSend("ChatRoomCharacterUpdate", {
                        ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                        ActivePose: target.ActivePose,
                        Appearance: appearance
                    });

                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dissolveOwnClothes'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dissolveClothes') + " " + getNickname(target) + getMessage('dissolveClothesTarget'));
                        sendPrankPacket({ type: "dissolve", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHandheld/Preview/PotionBottle.png")
        });

        // 4. Steal Panties
        AddActivity({
            Activity: {
                Name: "StealPanties",
                MaxProgress: 50,
                MaxProgressSelf: 50,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemPelvis", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') },
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemButt", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') },
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemVulvaPiercings", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') },
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemVulva", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') },
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemPenis", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') },
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemGlans", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasPanties", Func: actData.CustomPrerequisiteFuncs.get("lsccHasPanties") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    if (!InventoryGet(target, "Panties")) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('noUnderwear'));
                        return;
                    }

                    if (stealItem(target, "panties")) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('stoleUnderwear') + " " + getNickname(target) + getMessage('stealUnderwearSuffix'));
                        sendPrankPacket({ type: "steal_panties", source: Player.MemberNumber, target: target.MemberNumber });
                    } else {
                        ChatRoomSendLocal(getMessage('stealFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Panties/Preview/Panties1.png")
        });

        // 5. Remove and Hold Panties
        AddActivity({
            Activity: {
                Name: "RemoveAndHoldPanties",
                MaxProgress: 40,
                MaxProgressSelf: 40,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemPelvis", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') },
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemButt", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') },
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemVulvaPiercings", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') },
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemVulva", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') },
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemPenis", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') },
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemGlans", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasPanties", Func: actData.CustomPrerequisiteFuncs.get("lsccHasPanties") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    if (!InventoryGet(target, "Panties")) {
                        ChatRoomSendLocal(getNickname(target) + " " + getMessage('noUnderwear'), 5000);
                        return;
                    }

                    if (stealItem(target, "panties")) {
                        const isSelf = target.MemberNumber === Player.MemberNumber;
                        if (isSelf) {
                            chatSendCustomAction(getNickname(Player) + " " + getMessage('holdOwnUnderwear'));
                        } else {
                            chatSendCustomAction(getNickname(Player) + " " + getMessage('removedAndHoldUnderwear') + " " + getNickname(target) + getMessage('holdUnderwear'));
                        }
                    } else {
                        ChatRoomSendLocal(getMessage('removeFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Panties/Preview/Panties1.png")
        });

        // 6. Steal Socks
        AddActivity({
            Activity: {
                Name: "StealSocks",
                MaxProgress: 50,
                MaxProgressSelf: 50,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actStealSocks'), Name: "ItemFeet", SelfAllowed: false, TargetAction: getMessage('actStealSocksDesc') },
                { TargetLabel: getMessage('actStealSocks'), Name: "ItemLegs", SelfAllowed: false, TargetAction: getMessage('actStealSocksDesc') },
                { TargetLabel: getMessage('actStealSocks'), Name: "ItemBoots", SelfAllowed: false, TargetAction: getMessage('actStealSocksDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasSocks", Func: actData.CustomPrerequisiteFuncs.get("lsccHasSocks") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const hasSocks = InventoryGet(target, "Socks") || InventoryGet(target, "SocksRight") || InventoryGet(target, "SocksLeft");
                    if (!hasSocks) {
                        ChatRoomSendLocal(getNickname(target) + " " + getMessage('noSocks'), 5000);
                        return;
                    }

                    if (stealItem(target, "socks")) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('stoleSocks') + " " + getNickname(target) + getMessage('socksSuffix'));
                    } else {
                        ChatRoomSendLocal(getMessage('stealFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHood/Preview/Pantyhose.png")
        });

        // 7. Remove and Hold Socks
        AddActivity({
            Activity: {
                Name: "RemoveAndHoldSocks",
                MaxProgress: 40,
                MaxProgressSelf: 40,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actRemoveHoldSocks'), Name: "ItemFeet", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldSocksDesc'), TargetSelfAction: getMessage('actRemoveHoldSocksSelf') },
                { TargetLabel: getMessage('actRemoveHoldSocks'), Name: "ItemLegs", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldSocksDesc'), TargetSelfAction: getMessage('actRemoveHoldSocksSelf') },
                { TargetLabel: getMessage('actRemoveHoldSocks'), Name: "ItemBoots", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldSocksDesc'), TargetSelfAction: getMessage('actRemoveHoldSocksSelf') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasSocks", Func: actData.CustomPrerequisiteFuncs.get("lsccHasSocks") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const hasSocks = InventoryGet(target, "Socks") || InventoryGet(target, "SocksRight") || InventoryGet(target, "SocksLeft");
                    if (!hasSocks) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('noSocks'));
                        return;
                    }

                    if (stealItem(target, "socks")) {
                        const isSelf = target.MemberNumber === Player.MemberNumber;
                        if (isSelf) {
                            chatSendCustomAction(getNickname(Player) + " " + getMessage('holdOwnSocks'));
                        } else {
                            chatSendCustomAction(getNickname(Player) + " " + getMessage('removedAndHoldSocks') + " " + getNickname(target) + getMessage('holdSocks'));
                        }
                    } else {
                        ChatRoomSendLocal(getMessage('removeFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHood/Preview/Pantyhose.png")
        });

        // 8. Pluck Ahoge
        AddActivity({
            Activity: {
                Name: "PluckingHair_Razor",
                MaxProgress: 40,
                MaxProgressSelf: 40,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actPluckingHair'), Name: "ItemHead", SelfAllowed: true, TargetAction: getMessage('actPluckingHair'), TargetSelfAction: getMessage('actPluckingHair') },
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasAhoge", Func: actData.CustomPrerequisiteFuncs.get("lsccHasAhoge") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const hasAhoge = !!(InventoryGet(target, "额外头发_Luzi"));
                    if (!hasAhoge) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('hasAhoge'));
                        return;
                    }

                    if (pluckingHair(target)) {
                        const isSelf = target.MemberNumber === Player.MemberNumber;
                        if (isSelf) {
                            chatSendCustomAction(getNickname(Player) + " " + getMessage('pluckingOwnHair'));
                        } else {
                            chatSendCustomAction(getNickname(Player) + " " + getMessage('pluckingHair') + " " + getNickname(target) + getMessage('pluckingHairSuffix'));
                        }
                    } else {
                        ChatRoomSendLocal(getMessage('removeFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHood/Preview/Pantyhose.png")
        });

        // 9. Steal Bra
        AddActivity({
            Activity: {
                Name: "StealBra",
                MaxProgress: 50,
                MaxProgressSelf: 50,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actStealBra'), Name: "ItemBreast", SelfAllowed: false, TargetAction: getMessage('actStealBraDesc') },
                { TargetLabel: getMessage('actStealBra'), Name: "ItemNipples", SelfAllowed: false, TargetAction: getMessage('actStealBraDesc') },
                { TargetLabel: getMessage('actStealBra'), Name: "ItemNipplesPiercings", SelfAllowed: false, TargetAction: getMessage('actStealBraDesc') },
                { TargetLabel: getMessage('actStealBra'), Name: "ItemTorso", SelfAllowed: false, TargetAction: getMessage('actStealBraDesc') },
                { TargetLabel: getMessage('actStealBra'), Name: "ItemTorso2", SelfAllowed: false, TargetAction: getMessage('actStealBraDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasBra", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBra") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    if (!InventoryGet(target, "Bra")) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('noBra'));
                        return;
                    }
                    if (stealBra(target)) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('stealBra') + " " + getNickname(target) + getMessage('stealBraSuffix'));
                        sendPrankPacket({ type: "steal_bra", source: Player.MemberNumber, target: target.MemberNumber });
                    } else {
                        ChatRoomSendLocal(getMessage('stealFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Bra/Preview/Bra1.png")
        });

        // 10. Steal Hat
        AddActivity({
            Activity: {
                Name: "StealHat",
                MaxProgress: 40,
                MaxProgressSelf: 40,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actStealHat'), Name: "ItemHead", SelfAllowed: false, TargetAction: getMessage('actStealHatDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasHat", Func: actData.CustomPrerequisiteFuncs.get("lsccHasHat") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    if (!InventoryGet(target, "Hat")) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('noHat'));
                        return;
                    }
                    if (stealHat(target)) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('stealHat') + " " + getNickname(target) + getMessage('stealHatSuffix'));
                        sendPrankPacket({ type: "steal_hat", source: Player.MemberNumber, target: target.MemberNumber });
                    } else {
                        ChatRoomSendLocal(getMessage('stealFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Hat/Preview/WinterHat1.png")
        });

        // 11. Dye Hair
        AddActivity({
            Activity: {
                Name: "DyeHair",
                MaxProgress: 50,
                MaxProgressSelf: 50,
                Prerequisite: []
            },
            Targets: [{
                TargetLabel: getMessage('actDyeHair'),
                Name: "ItemHead",
                SelfAllowed: true,
                TargetAction: getMessage('actDyeHairDesc'),
                TargetSelfAction: getMessage('actDyeHairSelf')
            }],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    dyeHair(target);
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeOwnHair'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeHair') + " " + getNickname(target) + getMessage('dyeHairSuffix'));
                        sendPrankPacket({ type: "dye_hair", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHandheld/Preview/PotionBottle.png")
        });

        // 12. Rainbow Dye
        actData.CustomPrerequisiteFuncs.set("lsccCanInteract", actData.CustomPrerequisiteFuncs.get("lsccCanInteract"));
        AddActivity({
            Activity: {
                Name: "DyeClothes",
                MaxProgress: 50,
                MaxProgressSelf: 50,
                Prerequisite: []
            },
            Targets: [{
                TargetLabel: getMessage('actDyeClothes'),
                Name: "ItemHead",
                SelfAllowed: true,
                TargetAction: getMessage('actDyeClothesDesc'),
                TargetSelfAction: getMessage('actDyeClothesSelf')
            }],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    dyeClothes(target);
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeOwnClothes'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeClothes') + " " + getNickname(target) + getMessage('dyeClothesTarget'));
                        sendPrankPacket({ type: "dye_clothes", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHandheld/Preview/PotionBottle.png")
        });

        // 13. Steal Gloves
        AddActivity({
            Activity: {
                Name: "StealGloves",
                MaxProgress: 40,
                MaxProgressSelf: 40,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actStealGloves'), Name: "ItemHands", SelfAllowed: false, TargetAction: getMessage('actStealGlovesDesc') },
                { TargetLabel: getMessage('actStealGloves'), Name: "ItemHandheld", SelfAllowed: false, TargetAction: getMessage('actStealGlovesDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasGloves", Func: actData.CustomPrerequisiteFuncs.get("lsccHasGloves") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    if (!InventoryGet(target, "Gloves")) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('noGloves'));
                        return;
                    }
                    if (stealGloves(target)) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('stealGloves') + " " + getNickname(target) + getMessage('stealGlovesSuffix'));
                        sendPrankPacket({ type: "steal_gloves", source: Player.MemberNumber, target: target.MemberNumber });
                    } else {
                        ChatRoomSendLocal(getMessage('stealFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Gloves/Preview/Gloves1.png")
        });

        // 14. Headpat
        AddActivity({
            Activity: {
                Name: "Headpat",
                MaxProgress: 0,
                MaxProgressSelf: 0,
                Prerequisite: []
            },
            Targets: [{
                TargetLabel: getMessage('actHeadpat'),
                Name: "ItemHead",
                SelfAllowed: true,
                TargetAction: getMessage('actHeadpatDesc'),
                TargetSelfAction: getMessage('actHeadpatSelf')
            }],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('headpatSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('headpat') + " " + getNickname(target) + " " + getMessage('headpatSuffix'));
                        sendPrankPacket({ type: "headpat", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 15. Tickle
        AddActivity({
            Activity: {
                Name: "Tickle",
                MaxProgress: 30,
                MaxProgressSelf: 30,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actTickle'), Name: "ItemTorso", SelfAllowed: true, TargetAction: getMessage('actTickleDesc'), TargetSelfAction: getMessage('actTickleSelf') },
                { TargetLabel: getMessage('actTickle'), Name: "ItemFeet", SelfAllowed: true, TargetAction: getMessage('actTickleDesc'), TargetSelfAction: getMessage('actTickleSelf') },
                { TargetLabel: getMessage('actTickle'), Name: "ItemArms", SelfAllowed: true, TargetAction: getMessage('actTickleDesc'), TargetSelfAction: getMessage('actTickleSelf') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('tickleSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('tickle') + " " + getNickname(target) + getMessage('tickleSuffix'));
                        sendPrankPacket({ type: "tickle", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 14. Steal Shoes
        AddActivity({
            Activity: {
                Name: "StealShoes",
                MaxProgress: 40,
                MaxProgressSelf: 40,
                Prerequisite: []
            },
            Targets: [
                { TargetLabel: getMessage('actStealShoes'), Name: "ItemFeet", SelfAllowed: false, TargetAction: getMessage('actStealShoesDesc') },
                { TargetLabel: getMessage('actStealShoes'), Name: "ItemBoots", SelfAllowed: false, TargetAction: getMessage('actStealShoesDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasShoes", Func: actData.CustomPrerequisiteFuncs.get("lsccHasShoes") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    if (!InventoryGet(target, "Shoes")) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('noShoes'));
                        return;
                    }
                    if (stealShoes(target)) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('stealShoes') + " " + getNickname(target) + getMessage('stealShoesSuffix'));
                        sendPrankPacket({ type: "steal_shoes", source: Player.MemberNumber, target: target.MemberNumber });
                    } else {
                        ChatRoomSendLocal(getMessage('stealFailed'), 5000);
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Shoes/Preview/Heels1.png")
        });

        // 15. Restore Colors
        AddActivity({
            Activity: {
                Name: "ResetColors",
                MaxProgress: 30,
                MaxProgressSelf: 30,
                Prerequisite: []
            },
            Targets: [{
                TargetLabel: getMessage('actResetColors'),
                Name: "ItemHead",
                SelfAllowed: true,
                TargetAction: getMessage('actResetColorsDesc'),
                TargetSelfAction: getMessage('actResetColorsSelf')
            }],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    resetColors(target);
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('resetOwnColors'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('resetColors') + " " + getNickname(target) + getMessage('resetColorsSuffix'));
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHandheld/Preview/PotionBottle.png")
        });

        // 16. Bonk
        AddActivity({
            Activity: { Name: "Bonk", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actBonk'), Name: "ItemHead", SelfAllowed: true, TargetAction: getMessage('actBonkDesc'), TargetSelfAction: getMessage('actBonkSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('bonkSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('bonk') + " " + getNickname(target) + " " + getMessage('bonkSuffix'));
                        sendPrankPacket({ type: "bonk", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 18. Serenade
        AddActivity({
            Activity: { Name: "Serenade", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actSerenade'), Name: "ItemEars", SelfAllowed: true, TargetAction: getMessage('actSerenadeDesc'), TargetSelfAction: getMessage('actSerenadeSelf') },
                { TargetLabel: getMessage('actSerenade'), Name: "ItemMouth", SelfAllowed: true, TargetAction: getMessage('actSerenadeDesc'), TargetSelfAction: getMessage('actSerenadeSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('serenadeSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('serenade') + " " + getNickname(target) + " " + getMessage('serenadeSuffix'));
                        sendPrankPacket({ type: "serenade", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 19. Noogie
        AddActivity({
            Activity: { Name: "Noogie", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actNoogie'), Name: "ItemHead", SelfAllowed: true, TargetAction: getMessage('actNoogieDesc'), TargetSelfAction: getMessage('actNoogieSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('noogieSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('noogie') + " " + getNickname(target) + " " + getMessage('noogieSuffix'));
                        sendPrankPacket({ type: "noogie", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 20. Wedgie
        AddActivity({
            Activity: { Name: "Wedgie", MaxProgress: 40, MaxProgressSelf: 40, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actWedgie'), Name: "ItemButt", SelfAllowed: false, TargetAction: getMessage('actWedgieDesc') },
                { TargetLabel: getMessage('actWedgie'), Name: "ItemPelvis", SelfAllowed: false, TargetAction: getMessage('actWedgieDesc') },
                { TargetLabel: getMessage('actWedgie'), Name: "ItemPenis", SelfAllowed: false, TargetAction: getMessage('actWedgieDesc') },
                { TargetLabel: getMessage('actWedgie'), Name: "ItemGlans", SelfAllowed: false, TargetAction: getMessage('actWedgieDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    chatSendCustomAction(getNickname(Player) + " " + getMessage('wedgieAction') + " " + getNickname(target) + " " + getMessage('wedgieSuffix'));
                    sendPrankPacket({ type: "wedgie", source: Player.MemberNumber, target: target.MemberNumber });
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 22. Tease
        AddActivity({
            Activity: { Name: "Tease", MaxProgress: 30, MaxProgressSelf: 30, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actTease'), Name: "ItemEars", SelfAllowed: true, TargetAction: getMessage('actTeaseDesc'), TargetSelfAction: getMessage('actTeaseSelf') },
                { TargetLabel: getMessage('actTease'), Name: "ItemNeck", SelfAllowed: true, TargetAction: getMessage('actTeaseDesc'), TargetSelfAction: getMessage('actTeaseSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('teaseSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('teaseAction') + " " + getNickname(target) + " " + getMessage('teaseSuffix'));
                        sendPrankPacket({ type: "tease", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 23. Poke
        AddActivity({
            Activity: { Name: "Poke", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actPoke'), Name: "ItemArms", SelfAllowed: true, TargetAction: getMessage('actPokeDesc'), TargetSelfAction: getMessage('actPokeSelf') },
                { TargetLabel: getMessage('actPoke'), Name: "ItemHands", SelfAllowed: true, TargetAction: getMessage('actPokeDesc'), TargetSelfAction: getMessage('actPokeSelf') },
                { TargetLabel: getMessage('actPoke'), Name: "ItemTorso", SelfAllowed: true, TargetAction: getMessage('actPokeDesc'), TargetSelfAction: getMessage('actPokeSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('pokeSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('pokeAction') + " " + getNickname(target) + " " + getMessage('pokeSuffix'));
                        sendPrankPacket({ type: "poke", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 24. Spin
        AddActivity({
            Activity: { Name: "Spin", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actSpin'), Name: "ItemArms", SelfAllowed: true, TargetAction: getMessage('actSpinDesc'), TargetSelfAction: getMessage('actSpinSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('spinSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('spinAction') + " " + getNickname(target) + " " + getMessage('spinSuffix'));
                        logPrank(target, "spin");
                        sendPrankPacket({ type: "spin", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 25. Steal Collar
        AddActivity({
            Activity: { Name: "StealCollar", MaxProgress: 40, MaxProgressSelf: 40, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actStealCollar'), Name: "ItemNeck", SelfAllowed: false, TargetAction: getMessage('actStealCollarDesc') },
                { TargetLabel: getMessage('actStealCollar'), Name: "ItemNeckAccessories", SelfAllowed: false, TargetAction: getMessage('actStealCollarDesc') }
            ],
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccHasNecklace", Func: actData.CustomPrerequisiteFuncs.get("lsccHasNecklace") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    if (!InventoryGet(target, "Necklace")) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('noCollar'));
                        return;
                    }
                    takeSnapshot(target);
                    InventoryRemove(target, "Necklace");
                    ChatRoomCharacterUpdate(target);
                    chatSendCustomAction(getNickname(Player) + " " + getMessage('stealCollar') + " " + getNickname(target) + getMessage('stealCollarSuffix'));
                    logPrank(target, "steal_collar");
                    sendPrankPacket({ type: "steal_collar", source: Player.MemberNumber, target: target.MemberNumber });
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 26. Piggyback
        AddActivity({
            Activity: { Name: "Piggyback", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actPiggyback'), Name: "ItemTorso", SelfAllowed: true, TargetAction: getMessage('actPiggybackDesc'), TargetSelfAction: getMessage('actPiggybackSelf') },
                { TargetLabel: getMessage('actPiggyback'), Name: "ItemTorso2", SelfAllowed: true, TargetAction: getMessage('actPiggybackDesc'), TargetSelfAction: getMessage('actPiggybackSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('piggybackSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('piggybackAction') + " " + getNickname(target) + getMessage('piggybackSuffix'));
                        logPrank(target, "piggyback");
                        sendPrankPacket({ type: "piggyback", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 27. Dye One Item
        AddActivity({
            Activity: { Name: "DyeOneItem", MaxProgress: 30, MaxProgressSelf: 30, Prerequisite: [] },
            Targets: clothingTargets.map(t => ({
                TargetLabel: getMessage('actDyeOneItem'),
                Name: t,
                SelfAllowed: true,
                TargetAction: getMessage('actDyeOneItemDesc'),
                TargetSelfAction: getMessage('actDyeOneItemSelf')
            })),
            CustomPrereqs: [
                { Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") },
                { Name: "lsccHasBCItemPermission", Func: actData.CustomPrerequisiteFuncs.get("lsccHasBCItemPermission") },
                { Name: "lsccTargetHasClothing", Func: actData.CustomPrerequisiteFuncs.get("lsccTargetHasClothing") }
            ],
            CustomAction: {
                Func: (target, args, next) => {
                    const focusGroup = target.FocusGroup?.Name;
                    if (!focusGroup) return;
                    const dyeMap = {
                        "ItemNeck": ["Suit", "Cloth", "Bra"], "ItemNipples": ["Suit", "Cloth", "Bra"],
                        "ItemBreast": ["Suit", "Cloth", "Bra"], "ItemTorso": ["Suit", "Cloth", "Bra"],
                        "ItemNeckAccessories": ["Suit", "Cloth", "Bra"], "ItemNeckRestraints": ["Suit", "Cloth", "Bra"],
                        "ItemNipplesPiercings": ["Suit", "Cloth", "Bra"], "ItemTorso2": ["Suit", "Cloth", "Bra"],
                        "ItemHands": ["Gloves"], "ItemHandheld": ["Gloves"],
                        "ItemPelvis": ["ClothLower", "SuitLower", "Panties"],
                        "ItemButt": ["ClothLower", "SuitLower", "Panties"],
                        "ItemVulvaPiercings": ["ClothLower", "SuitLower", "Panties"],
                        "ItemVulva": ["ClothLower", "SuitLower", "Panties"],
                        "ItemPenis": ["ClothLower", "SuitLower", "Panties"],
                        "ItemBoots": ["Shoes", "Socks", "SocksRight", "SocksLeft"],
                        "ItemLegs": ["Socks", "SocksRight", "SocksLeft"],
                        "ItemFeet": ["Socks", "SocksRight", "SocksLeft"],
                        "ItemMouth": ["Mask"], "ItemMouth2": ["Mask"], "ItemMouth3": ["Mask"]
                    };
                    const priority = dyeMap[focusGroup];
                    if (!priority) return;
                    const dyeGroup = priority.find(g => InventoryGet(target, g));
                    if (!dyeGroup) {
                        chatSendCustomAction(getNickname(target) + " " + getMessage('nothingToRemove'));
                        return;
                    }
                    takeSnapshot(target);
                    const newColor = getRandomColor();
                    const bundle = ServerAppearanceBundle(target.Appearance).map(item => {
                        if (item.Group === dyeGroup) {
                            item.Color = Array.isArray(item.Color) ? item.Color.map(() => newColor) : newColor;
                        }
                        return item;
                    });
                    ServerSend("ChatRoomCharacterUpdate", {
                        ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                        ActivePose: target.ActivePose,
                        Appearance: bundle
                    });
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeOneItemSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('dyeOneItemAction') + " " + getNickname(target) + getMessage('dyeOneItemSuffix'));
                        logPrank(target, "dye_one_item");
                        sendPrankPacket({ type: "dye_one_item", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHandheld/Preview/PotionBottle.png")
        });

        // 28. High Five
        AddActivity({
            Activity: { Name: "HighFive", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actHighFive'), Name: "ItemHands", SelfAllowed: true, TargetAction: getMessage('actHighFiveDesc'), TargetSelfAction: getMessage('actHighFiveSelf') },
                { TargetLabel: getMessage('actHighFive'), Name: "ItemArms", SelfAllowed: true, TargetAction: getMessage('actHighFiveDesc'), TargetSelfAction: getMessage('actHighFiveSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('highFiveSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('highFiveAction') + " " + getNickname(target) + " " + getMessage('highFiveSuffix'));
                        sendPrankPacket({ type: "highfive", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });

        // 29. Trip
        AddActivity({
            Activity: { Name: "Trip", MaxProgress: 0, MaxProgressSelf: 0, Prerequisite: [] },
            Targets: [
                { TargetLabel: getMessage('actTrip'), Name: "ItemLegs", SelfAllowed: true, TargetAction: getMessage('actTripDesc'), TargetSelfAction: getMessage('actTripSelf') },
                { TargetLabel: getMessage('actTrip'), Name: "ItemFeet", SelfAllowed: true, TargetAction: getMessage('actTripDesc'), TargetSelfAction: getMessage('actTripSelf') }
            ],
            CustomPrereqs: [{ Name: "lsccCanInteract", Func: actData.CustomPrerequisiteFuncs.get("lsccCanInteract") }],
            CustomAction: {
                Func: (target, args, next) => {
                    const isSelf = target.MemberNumber === Player.MemberNumber;
                    if (isSelf) {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('tripSelf'));
                    } else {
                        chatSendCustomAction(getNickname(Player) + " " + getMessage('tripAction') + " " + getNickname(target) + getMessage('tripSuffix'));
                        logPrank(target, "trip");
                        sendPrankPacket({ type: "trip", source: Player.MemberNumber, target: target.MemberNumber });
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/Activity/Caress.png")
        });
    }

    // ===== Echo Clothing Integration =====

    /**
     * Returns true if the given character has Echo Clothing loaded on their client.
     * Echo Clothing broadcasts presence via the ECHO_INFO2 property.
     */
    function hasEchoClothing(character) {
        return !!(character?.["ECHO_INFO2"]?.["服装拓展"]);
    }

    /**
     * Initialise optional Echo Clothing cross-mod hooks.
     * - Registers this mod with Echo's CharacterTag system so Echo UI can show we're present.
     * - Subscribes to Echo's shared ActivityEvents bus to trigger prank reactions when an
     *   Echo player performs a compatible activity on us.
     * All Echo globals are optional: if Echo isn't loaded nothing breaks.
     */
    function initEchoIntegration() {
        try {
            // Register with Echo CharacterTag so Echo players can see this mod is active
            const echoGlobals = globalThis.__ECHO_MOD_GLOBALS__;
            if (echoGlobals?.["CharacterTag"]?.tag) {
                echoGlobals["CharacterTag"].tag("lscc's prank", { version: modversion });
                console.log("[prank] Registered with Echo CharacterTag");
            }

            // Subscribe to Echo's shared ActivityEvents bus if available
            const luziGlobals = globalThis.__BC_LUZI_GLOBALS__;
            if (luziGlobals) {
                const actEvents = luziGlobals["ActivityEvents@1.0.4"];
                if (actEvents?.on) {
                    // Map Echo activity names to our prank reaction types
                    const echoReactionMap = {
                        "Tickle":   "tickle",
                        "Headpat":  "headpat",
                        "Spank":    "bonk",
                        "Tease":    "tease",
                        "Noogie":   "noogie",
                        "Wedgie":   "wedgie",
                        "Serenade": "serenade",
                    };

                    actEvents.on("activity", (data) => {
                        try {
                            // Only react when we are the target and another player is the source
                            const targetNum = data?.target?.MemberNumber ?? data?.targetNumber;
                            const sourceChar = data?.source ?? data?.sourceCharacter;
                            if (targetNum !== Player.MemberNumber || !sourceChar) return;

                            const actName = data?.activity?.Name ?? data?.activityName;
                            const reactionType = actName && echoReactionMap[actName];
                            if (reactionType) {
                                prankReact(reactionType, getNickname(sourceChar));
                            }
                        } catch (e) {
                            // Ignore malformed event data
                        }
                    });
                    console.log("[prank] Subscribed to Echo ActivityEvents");
                }

                // Announce our presence on Echo's ChatRoomEvents bus so Echo clients know
                // this mod is active (mirrors what Echo itself does via ECHO_INFO2 packets)
                const chatEvents = luziGlobals["ChatRoomEvents@1.0.4"];
                if (chatEvents?.emit) {
                    chatEvents.emit("modPresence", { mod: "lscc's prank", version: modversion });
                }
            }
        } catch (e) {
            console.warn("[prank] Echo integration init error:", e);
        }
    }

    // ===== Hook System =====
    function setupHooks() {
        if (!modApi || !modApi.hookFunction) return;

        modApi.hookFunction("ChatRoomMessage", 4, (args, next) => {
            const msg = args[0];
            if (msg && msg.Type === "Hidden" && msg.Content === PRANK_PKT) {
                try {
                    const payload = JSON.parse(msg.Dictionary?.[0]?.Text || "{}");
                    handlePrankPacket(payload, msg.Sender);
                } catch(e) {
                    console.error("[prank] Failed to parse hidden packet:", e);
                }
                return;
            }
            // Quiz answer detection: check if a pending-quiz target typed the right answer
            if (msg && msg.Type === "Chat" && pendingQuizzes.size > 0) {
                const senderNum = msg.Sender;
                if (pendingQuizzes.has(senderNum)) {
                    const quiz = pendingQuizzes.get(senderNum);
                    const content = (msg.Content || "").toLowerCase().trim();
                    if (content.includes(quiz.answer.toLowerCase())) {
                        clearTimeout(quiz.timerId);
                        pendingQuizzes.delete(senderNum);
                        const src = ChatRoomCharacter ? ChatRoomCharacter.find(c => c.MemberNumber === senderNum) : null;
                        chatSendCustomAction((src ? getNickname(src) : "They") + " " + getMessage('quizCorrect'));
                    }
                }
            }
            return next(args);
        });

        modApi.hookFunction("ActivityCheckPrerequisite", 4, (args, next) => {
            const prereqName = args[0];
            if (actData.CustomPrerequisiteFuncs.has(prereqName)) {
                const func = actData.CustomPrerequisiteFuncs.get(prereqName);
                try {
                    return func(args[1], args[2], args[3]);
                } catch (error) {
                    console.error("[prank] Prerequisite error:", error);
                }
            }
            return next(args);
        });

        modApi.hookFunction("ServerSend", 4, (args, next) => {
            const message = args[0];
            const params = args[1];

            if (message === "ChatRoomChat" && params.Type === "Activity") {
                const activityName = params.Dictionary?.find(d => d.ActivityName)?.ActivityName;

                if (activityName && activityName.startsWith("lscc_")) {
                    const targetMemberNumber = params.Dictionary?.find(d => d.TargetCharacter)?.TargetCharacter;
                    const target = ChatRoomCharacter.find(c => c.MemberNumber === targetMemberNumber);

                    if (target && actData.CustomActionCallbacks.has(activityName)) {
                        const callback = actData.CustomActionCallbacks.get(activityName);
                        callback(target, args, next);
                        return;
                    }
                }
            }

            return next(args);
        });

        modApi.hookFunction("ElementButton.CreateForActivity", 4, (args, next) => {
            const activity = args[1];
            if (activity?.Activity?.Name?.startsWith("lscc_")) {
                args[4] = args[4] || {};
                const customImage = actData.CustomImages.get(activity.Activity.Name);
                if (customImage) {
                    args[4].image = customImage;
                }
            }
            return next(args);
        });

        if (GameVersion !== "R121") {
            modApi.hookFunction("PreferenceGetActivityFactor", 4, (args, next) => {
                if (typeof args[1] === "string" && args[1].indexOf("lscc_") === 0) {
                    return 2;
                }
                return next(args);
            });
        }
    }

    // ===== Initialization =====
    waitFor(() => typeof Player !== "undefined" && typeof Player.MemberNumber === "number" && typeof CommandCombine === "function")
        .then(() => {
        loadTrustList();
        // Register commands
        CommandCombine([
                { Tag: "steal", Description: "Steal panties", Action: (args) => stealPanties(args) },
                { Tag: "dissolve", Description: "Dissolve clothes", Action: (args) => spillObscenePotion(args) },
                { Tag: "teleport", Description: "Teleport", Action: (args) => openPortal(args) },
                { Tag: "give", Description: "Give held item to a player", Action: (args) => giveItem(args) },
                { Tag: "streak", Description: "Strip all your own clothes off", Action: () => streak() },
                { Tag: "swap", Description: "Swap outfits with a player", Action: (args) => swapOutfits(args) },
                { Tag: "copy", Description: "Copy a player's outfit", Action: (args) => copyOutfit(args) },
                { Tag: "stealhat", Description: "Steal a player's hat and wear it", Action: (args) => stealHatCmd(args) },
                { Tag: "stealbra", Description: "Steal a player's bra", Action: (args) => stealBraCmd(args) },
                { Tag: "stealgloves", Description: "Steal a player's gloves", Action: (args) => stealGlovesCmd(args) },
                { Tag: "stealshoes", Description: "Steal a player's shoes", Action: (args) => stealShoesCmd(args) },
                { Tag: "prank", Description: "Apply a random prank to a player", Action: (args) => applyRandomPrank(getPlayer((args || "").trim())) },
                { Tag: "roulette", Description: "Random prank on a random person in the room", Action: () => prankRoulette() },
                { Tag: "silentstrip", Description: "Strip a player's clothes silently", Action: (args) => silentStrip(args) },
                { Tag: "slowstrip", Description: "Gradually strip a player one item at a time", Action: (args) => slowStrip(args) },
                { Tag: "blackout", Description: "Turn all of a player's clothing black", Action: (args) => blackout(args) },
                { Tag: "loop", Description: "Keep pranking a player every 30s", Action: (args) => startLoop(args) },
                { Tag: "stoploop", Description: "Stop prank loop (omit name to stop all)", Action: (args) => stopLoop(args) },
                { Tag: "propose", Description: "Propose to a player", Action: (args) => propose(args) },
                { Tag: "adopt", Description: "Adopt a player as your child", Action: (args) => adopt(args) },
                { Tag: "flash", Description: "Flash a player", Action: (args) => flash(args) },
                { Tag: "undo", Description: "Restore a player's last outfit snapshot", Action: (args) => undoOutfit(args) },
                { Tag: "pranks", Description: "Show players with active prank loops", Action: () => showPranks() },
                { Tag: "mimic", Description: "Mirror a player's outfit every 3s", Action: (args) => startMimic(args) },
                { Tag: "stopmimic", Description: "Stop mirroring (omit name to stop all)", Action: (args) => stopMimic(args) },
                { Tag: "poke", Description: "Poke a player", Action: (args) => pokeCmd(args) },
                { Tag: "dare", Description: "Dare a player to do something", Action: (args) => dareCmd(args) },
                { Tag: "taunt", Description: "Taunt a player with a random remark", Action: (args) => tauntCmd(args) },
                { Tag: "crown", Description: "Crown a player with a random superlative title", Action: (args) => crownCmd(args) },
                { Tag: "gossip", Description: "Whisper a random rumor about a player to the room", Action: (args) => gossipCmd(args) },
                { Tag: "shrink", Description: "Cast a shrinking spell on a player", Action: (args) => shrinkCmd(args) },
                { Tag: "dye", Description: "Dye a player's outfit a solid color", Action: (args) => dyeColorCmd(args) },
                { Tag: "freeze", Description: "Lock a player's pose in place", Action: (args) => freezeCmd(args) },
                { Tag: "unfreeze", Description: "Stop freezing a player", Action: (args) => unfreezeCmd(args) },
                { Tag: "rename", Description: "Temporarily rename a player (local only)", Action: (args) => renameCmd(args) },
                { Tag: "unrename", Description: "Restore a player's original local name", Action: (args) => unrenameCmd(args) },
                { Tag: "countdown", Description: "Post a public countdown in chat", Action: (args) => countdownCmd(args) },
                { Tag: "quiz", Description: "Challenge a player with a trivia question", Action: (args) => quizCmd(args) },
                { Tag: "announce", Description: "Broadcast a formatted announcement", Action: (args) => announceCmd(args) },
                { Tag: "history", Description: "Show your prank history this session", Action: (args) => historyCmd(args) },
                { Tag: "stats", Description: "Show prank stats for this session", Action: () => statsCmd() },
                { Tag: "trust", Description: "Manage your prank-reaction trust list", Action: (args) => trustCmd(args) },
                { Tag: "untrust", Description: "Remove a player from your trust list", Action: (args) => untrustCmd(args) },
                { Tag: "list", Description: "Show all prank commands", Action: () => listCommands() },
                { Tag: "help", Description: "Show detailed help for a command", Action: (args) => helpCmd(args) }
            ]);

        // Wait for activity system
        waitFor(() => typeof ActivityFemale3DCG !== "undefined" && typeof ActivityDictionary !== "undefined")
            .then(() => {
            registerActivities();
            setupHooks();
            initEchoIntegration();
            chatSendLocal(getMessage('loaded'));
            checkForUpdates();
        })
            .catch(err => console.error("[prank] Activity registration failed:", err));
    })
        .catch(error => console.error("[prank] Initialization failed:", error));
})();
