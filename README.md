# lscc's Prank Mod

A userscript mod for [Bondage Club](https://www.bondageprojects.elementfx.com/) that adds a comprehensive prank system with slash commands and integrated in-game activities.

**Version:** 1.11.0

---

## Installation

1. Install a userscript manager (e.g. [Tampermonkey](https://www.tampermonkey.net/))
2. Install the script by opening `prank.js`or [Click here](https://khiles.github.io/prank/prank.user.js) in Tampermonkey
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
| `/poke [player]` | Poke a player |
| `/dare [player] [dare]` | Dare a player publicly (random dare if none given) |
| `/taunt [player]` | Taunt a player with a random remark |
| `/crown [player]` | Crown a player with a random superlative title |
| `/gossip [player]` | Whisper a random rumor about a player to the room |
| `/shrink [player]` | Cast a shrinking spell on a player ✨ |
| `/dye [player] [color\|#hex]` | Dye a player's entire outfit a solid color (random if omitted) |
| `/freeze [player]` | Lock a player's pose in place 🧊 |
| `/unfreeze [player]` | Stop freezing a player (omit name to stop all) |
| `/rename [player] [nickname]` | Temporarily rename a player locally (client-side only) |
| `/unrename [player]` | Restore a player's original local name |
| `/countdown [seconds]` | Post a public countdown in chat (1–60 seconds) |
| `/quiz [player]` | Challenge a player with a trivia question — prank them if they answer wrong! |
| `/announce [message]` | Broadcast a formatted announcement to the chat room |
| `/history [player]` | Show your prank history for this session (optionally filtered by player) |
| `/stats` | Show prank stats and a breakdown by type for this session |
| `/trust [player]` | Add a player to your trust list so you react to their pranks (show list if no args) |
| `/untrust [player]` | Remove a player from your trust list |
| `/list` | Print all available prank commands to local chat |
| `/help [command]` | Show detailed usage and an example for a single command |

### Examples

```
/prank Alice
/teleport MyRoom
/swap 12345
/dye Alice pink
/dye Alice #FF69B4
/countdown 5
/quiz Bob
/trust Alice
/help dye
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
| **Spin** | Grab the target and spin them around 🌀 |
| **Steal Collar** | Unclap the target's collar/necklace 📿 |
| **Piggyback** | Leap onto the target's back for a piggyback ride 🐎 |
| **Dye Item** | Splash paint on just one clothing slot at the focused body zone 🎨 |
| **High Five** | Give a satisfying high five 🙌 |
| **Trip** | Stick your foot out and trip the target 😄 |

---

## Permissions

The mod respects Bondage Club's built-in permission system. Most item-based actions require the target to allow item interactions. The game's standard "allow/deny" settings apply — you cannot prank someone who has locked their permissions.

### Trust List

Use `/trust [player]` to build a whitelist of players whose pranks will trigger visible reactions from your character. If the trust list is non-empty, pranks from players **not** on the list are silently ignored (no reaction emote is posted). Use `/trust` (no arguments) to see your current list, and `/untrust [player]` to remove someone. The list persists across sessions via `localStorage`.

---

## Notes

- **`/teleport`** sends a wormhole action in chat, leaves your current room, and joins the target room. If no room name is given it will prompt you.
- **`/loop`** pranks a player every 30 seconds. Use `/stoploop` or `/stoploop [player]` to cancel.
- **`/slowstrip`** removes one clothing item every 3 seconds until the player has nothing left.
- **`/freeze`** repeatedly re-applies the target's current pose to lock them in place. Requires item permissions. Use `/unfreeze` to release.
- **`/dye`** supports named colors (`red`, `green`, `blue`, `yellow`, `pink`, `purple`, `orange`, `white`, `black`, `cyan`, `teal`, `gold`, `silver`, `brown`, `lime`, `navy`) or any `#RRGGBB` hex code.
- **`/quiz`** picks a random trivia question and gives the target 30 seconds to answer in chat. If they get it right, no prank. If time runs out, a random prank is applied automatically.
- **`/rename`** changes the name shown locally on your screen only — no other players see it.
- **`/history`** shows the last 20 pranks you performed this session; filter by player name.
- **`/stats`** shows total prank count and a per-type breakdown.
- **`/announce`** posts a formatted 📢 announcement visible to everyone in the room.
- **`/countdown`** posts each tick as a public action message, ending with 💥.
- **Cut Clothes** activity requires the player to be holding scissors.
- The mod targets the 3D female character system used by Bondage Club.
- Set `PRANK_COOLDOWN_MS` (near the top of the script) to a positive number (e.g. `5000` for 5 seconds) to enable a per-player cooldown between item-affecting pranks.

---

## Dependencies

- [bcModSdk v1.2.0](https://github.com/Jomshir98/bondage-club-mod-sdk) — Bondage Club Mod SDK (loaded automatically by the script)

---

## Compatibility

Tested against Bondage Club R121 and nearby releases. The mod registers itself via bcModSdk and uses only official game APIs, so it should be compatible with other mods that also use the SDK.
