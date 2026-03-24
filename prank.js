// ==UserScript==
// @name         lscc - Prank
// @namespace    https://lscclisu.dev/
// @version      1.5.1
// @description  lscc's prank on her friends
// @author       lscc
// @include      /^https:\/\/(www\.)?bondage(projects\.elementfx|-(europe|asia))\.com\/.*/
// @icon         
// @grant        none
// @require      https://github.com/Jomshir98/bondage-club-mod-sdk/releases/download/v1.2.0/bcmodsdk.js
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
    const modversion = "1.5.1";

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
            actDyeHairSelf: "SourceCharacter dyes their own hair in wild colors"
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
        if (typeof ChatRoomMessage === "function") {
            ChatRoomMessage({ Content: message, Type: "LocalMessage" }, timeout);
        } else {
            console.log("Local: " + message);
        }
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

            const noClothesFilter = (item) => !appearanceGroupNames.includes(item.Group);
            const appearance = ServerAppearanceBundle(target.Appearance).filter(noClothesFilter);

            ServerSend("ChatRoomCharacterUpdate", {
                ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                ActivePose: target.ActivePose,
                Appearance: appearance
            });

            chatSendCustomAction(getNickname(Player) + " " + getMessage('dissolveClothes') + " " + getNickname(target) + getMessage('dissolveClothesTarget'));
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
        InventoryRemove(target, "Bra");
        ChatRoomCharacterUpdate(target);
        return true;
    }

    function stealHat(target) {
        const hat = InventoryGet(target, "Hat");
        if (!hat) return false;
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

            const playerBundle = ServerAppearanceBundle(Player.Appearance);
            const targetBundle = ServerAppearanceBundle(target.Appearance);

            const playerClothes = playerBundle.filter(i => clothingGroups.includes(i.Group));
            const playerOther   = playerBundle.filter(i => !clothingGroups.includes(i.Group));
            const targetClothes = targetBundle.filter(i => clothingGroups.includes(i.Group));
            const targetOther   = targetBundle.filter(i => !clothingGroups.includes(i.Group));

            ServerSend("ChatRoomCharacterUpdate", {
                ID: Player.ID === 0 ? Player.OnlineID : Player.AccountName.replace("Online-", ""),
                ActivePose: Player.ActivePose,
                Appearance: [...playerOther, ...targetClothes]
            });

            ServerSend("ChatRoomCharacterUpdate", {
                ID: target.ID === 0 ? target.OnlineID : target.AccountName.replace("Online-", ""),
                ActivePose: target.ActivePose,
                Appearance: [...targetOther, ...playerClothes]
            });

            chatSendCustomAction(getNickname(Player) + " " + getMessage('swapOutfits') + " " + getNickname(target) + " " + getMessage('swapOutfitsSuffix'));
        } catch (error) {
            console.error("Error in swapOutfits:", error);
        }
    }

    function dyeClothes(target) {
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
                ID: Player.ID === 0 ? Player.OnlineID : Player.AccountName.replace("Online-", ""),
                ActivePose: Player.ActivePose,
                Appearance: appearance
            });

            chatSendCustomAction(getNickname(Player) + " " + getMessage('streakAction'));
        } catch (error) {
            console.error("Error in streak:", error);
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

        const clothingTargets = [
            "ItemNeck", "ItemNipples", "ItemBreast", "ItemTorso",
            "ItemNeckAccessories", "ItemNeckRestraints", "ItemNipplesPiercings", "ItemTorso2",
            "ItemHands", "ItemHandheld", "ItemPelvis", "ItemButt", "ItemVulvaPiercings", "ItemVulva",
            "ItemBoots", "ItemLegs", "ItemFeet", "ItemMouth", "ItemMouth2", "ItemMouth3"
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
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemButt", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') },
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemVulvaPiercings", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') },
                { TargetLabel: getMessage('actStealPanties'), Name: "ItemVulva", SelfAllowed: false, TargetAction: getMessage('actStealPantiesDesc') }
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
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemButt", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') },
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemVulvaPiercings", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') },
                { TargetLabel: getMessage('actRemoveHoldPanties'), Name: "ItemVulva", SelfAllowed: true, TargetAction: getMessage('actRemoveHoldPantiesDesc'), TargetSelfAction: getMessage('actRemoveHoldPantiesSelf') }
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
                { TargetLabel: getMessage('actStealBra'), Name: "ItemTorso", SelfAllowed: false, TargetAction: getMessage('actStealBraDesc') }
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
                    }
                }
            },
            CustomImage: ImagePathHelper.getAssetURL("Female3DCG/ItemHandheld/Preview/PotionBottle.png")
        });
    }

    // ===== Hook System =====
    function setupHooks() {
        if (!modApi || !modApi.hookFunction) return;

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
    waitFor(() => typeof Player !== "undefined" && typeof Player.MemberNumber === "number")
        .then(() => {
        // Register commands
        if (typeof CommandCombine === "function") {
            CommandCombine([
                { Tag: "steal", Description: "Steal panties", Action: (args) => stealPanties(args) },
                { Tag: "dissolve", Description: "Dissolve clothes", Action: (args) => spillObscenePotion(args) },
                { Tag: "teleport", Description: "Teleport", Action: (args) => openPortal(args) },
                { Tag: "give", Description: "Give held item to a player", Action: (args) => giveItem(args) },
                { Tag: "streak", Description: "Strip all your own clothes off", Action: () => streak() },
                { Tag: "swap", Description: "Swap outfits with a player", Action: (args) => swapOutfits(args) }
            ]);
        }

        // Wait for activity system
        waitFor(() => typeof ActivityFemale3DCG !== "undefined" && typeof ActivityDictionary !== "undefined")
            .then(() => {
            registerActivities();
            setupHooks();
            chatSendLocal(getMessage('loaded'));
        })
            .catch(err => console.error("[prank] Activity registration failed:", err));
    })
        .catch(error => console.error("[prank] Initialization failed:", error));
})();
