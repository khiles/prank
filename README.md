# lscc's Prank Mod

A userscript mod for [Bondage Club](https://www.bondageprojects.elementfx.com/) that adds a comprehensive prank system with slash commands and integrated in-game activities.

**Version:** 1.6.0

---

## Installation

1. Install a userscript manager (e.g. [Tampermonkey](https://www.tampermonkey.net/))
2. Install the script by opening `prank.js`or [Click here](https://khiles.github.io/prank/prank.user.js)) in Tampermonkey
3. Navigate to Bondage Club — the mod loads automatically

---

## Slash Commands

Type these in the chat box. `[player]` is the player's name or member number. Names are case-insensitive and partial matches work.

| Command | Description |
|---|---|
| `/steal [player]` | Steal panties from a target player |
| `/dissolve [player]` | Splash a magic potion to dissolve all of a player's clothes |
| `/teleport [room]` | Open a portal and teleport yourself to another room |
| `/give [player]` | Give your currently held item to a player |
| `/streak` | Strip all of your own clothes off |
| `/swap [player]` | Swap outfits with a player |
| `/copy [player]` | Copy a player's outfit and wear it yourself |
| `/stealhat [player]` | Steal a player's hat and wear it yourself |
| `/stealbra [player]` | Steal a player's bra |
| `/stealgloves [player]` | Steal a player's gloves |
| `/stealshoes [player]` | Steal a player's shoes |
| `/prank [player]` | Apply a random prank to a player |
| `/roulette` | Apply a random prank to a random person in the room |
| `/silentstrip [player]` | Strip a player's clothes off without sending a chat message |
| `/slowstrip [player]` | Gradually strip a player one item at a time (every 3 seconds) |
| `/blackout [player]` | Turn all of a player's clothing black |
| `/loop [player]` | Repeatedly prank a player every 30 seconds |
| `/stoploop [player]` | Stop a prank loop for a player (omit name to stop all loops) |
| `/propose [player]` | Propose to a player |
| `/adopt [player]` | Adopt a player as your child |
| `/flash [player]` | Flash a player |
| `/undo [player]` | Restore a player's outfit to before the last prank (omit for self) |
| `/pranks` | Show which players currently have active prank loops |
| `/mimic [player]` | Start mirroring a player's outfit every 3 seconds |
| `/stopmimic [player]` | Stop mirroring a player (omit name to stop all) |
| `/list` | Print all available prank commands to local chat |

### Examples

```
/prank Alice
/teleport MyRoom
/swap 12345
/stoploop
```

---

## In-Game Activities

These appear in the interaction menu when you click on another character. They integrate with Bondage Club's activity system and respect the game's permission settings.

| Activity | Description |
|---|---|
| **Cut Clothes** | Cut off clothing using scissors (requires holding scissors) |
| **Remove Clothes** | Remove clothing from various body areas |
| **Dissolve Clothes** | Splash a potion to instantly remove all clothes |
| **Steal Panties** | Steal and hold the target's panties as a handheld item |
| **Take Panties** | Remove and hold panties |
| **Steal Socks** | Steal socks from the target |
| **Take Socks** | Remove and hold socks |
| **Pluck Ahoge** | Remove a special hair item |
| **Steal Bra** | Remove the target's bra |
| **Steal Hat** | Steal a hat and wear it yourself |
| **Dye Hair** | Change the target's hair to a random color |
| **Rainbow Dye** | Change all clothing colors to random colors |
| **Steal Gloves** | Remove and take the target's gloves |
| **Headpat** | Give a gentle headpat |
| **Tickle** | Tickle the target |
| **Steal Shoes** | Remove and take the target's shoes |
| **Restore Colors** | Reset all clothing colors back to default |
| **Bonk** | Bonk on the head with a rolled-up newspaper |
| **Serenade** | Sing an off-key love song |
| **Noogie** | Give a noogie |
| **Wedgie** | Give a wedgie |
| **Tease** | Whisper something that makes them blush |

---

## Permissions

The mod respects Bondage Club's built-in permission system. Most item-based actions require the target to allow item interactions. The game's standard "allow/deny" settings apply — you cannot prank someone who has locked their permissions.

---

## Notes

- **`/teleport`** sends a wormhole action in chat, leaves your current room, and joins the target room. If no room name is given it will prompt you.
- **`/loop`** pranks a player every 30 seconds. Use `/stoploop` or `/stoploop [player]` to cancel.
- **`/slowstrip`** removes one clothing item every 3 seconds until the player has nothing left.
- **Cut Clothes** activity requires the player to be holding scissors.
- The mod targets the 3D female character system used by Bondage Club.

---

## Dependencies

- [bcModSdk v1.2.0](https://github.com/Jomshir98/bondage-club-mod-sdk) — Bondage Club Mod SDK (loaded automatically by the script)

---

## Compatibility

Tested against Bondage Club R121 and nearby releases. The mod registers itself via bcModSdk and uses only official game APIs, so it should be compatible with other mods that also use the SDK.
