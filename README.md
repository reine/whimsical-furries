# The Furries of Whimsical Forest

A cozy, whimsical theme for the Claude desktop app. It recolors the app with an
orchid and lavender palette built on Catppuccin Macchiato, and puts a moonlit
violet forest behind the chat: drifting fireflies, falling petals, soft mist,
and two wizard cats keeping you company. A lady mage with a twinkling wand sits
in the bottom-left corner, and a wizard with a glowing lantern sits in the
bottom-right. Both stay pinned to their corners as the window resizes.

All artwork is original vector art, drawn for this theme.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install whimsical-furries --marketplace reine/whimsical-furries
```

Answer `y` to add the marketplace, then pick a scope (user is the usual choice).

Or from a shell:

```bash
claude plugin install whimsical-furries --marketplace reine/whimsical-furries
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt
box, then **Plugins**, **Add marketplace** with `reine/whimsical-furries`, then
**Add plugin**.

The theme appears in the desktop app once a session starts, after its first
message. Sessions that were already open pick it up after `/reload-plugins`.

## Turn it off

```bash
claude plugin disable whimsical-furries@whimsical-furries
```

Use `enable` to bring it back, or `uninstall` to remove it.

## Notes

- The theme is dark only and draws in the desktop and mobile apps, not the terminal.
- The animation is slow and gentle. With Reduce Motion on, the scene shows as a still picture.
- Message rows get near-solid backgrounds so text stays readable over the forest.

## Editing the art

The scene lives in `art/`: `forest.svg`, `cat-left.svg` (the wizard) and
`cat-lady.svg` (the lady mage). After editing any of them, run
`python3 art/compose.py` to rebuild `hooks/forest.ts`.
