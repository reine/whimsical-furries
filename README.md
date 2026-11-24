# The Furries of Whimsical Forest

A cozy, whimsical theme for Claude. Install it as a Claude Code plugin and the
Claude desktop app takes on an orchid and lavender look built on Catppuccin
Macchiato, with a moonlit purple forest drifting behind your chats.

![The Furries of Whimsical Forest: a mock chat window with orchid and lavender text over a moonlit purple forest, with a mage cat in the bottom-left corner and a wizard cat in the bottom-right](docs/preview.png)

<sub>A mock-up: the conversation is made up.</sub>

- **A soft dark palette:** purple-tinted surfaces, orchid accents and links,
  lavender highlights and warm peach lamplight. Body text meets WCAG AA
  contrast, with no harsh pure black or white.
- **A living forest:** fireflies drift and twinkle, petals tumble down, mist
  rolls along the ground and a glowing path leads into the trees.
- **Two Furries for company:** a mage cat with a twinkling star wand in the
  bottom-left corner, and a wizard cat with a glowing lantern in the
  bottom-right. They bob, blink and swish their tails, and stay in their
  corners as the window resizes.
- **Readable over the art:** frosted panels and near-solid message bubbles
  keep your conversation clear.
- **A quiet night soundscape:** press the speaker in the session's title bar
  for a soft breeze and distant crickets on either side. Now and then a gust
  rustles the leaves, and a firefly drifts by with a low, warm chime. Gentle
  chimes also play when you send a message and when Claude finishes.
  Click the bare forest to play a note, low on the left and high on the right.
- **Or something more musical:** type `/furries-sound whimsical` for little
  ballet-style tunes in E minor: a celesta tiptoeing in staccato steps,
  pizzicato strings plucking underneath, a flute trilling now and then and a
  harp sweeping up, with playful chimes to match. `/furries-sound cozy`
  brings back the quiet night, and your choice is remembered for later
  sessions.

All artwork is original vector art and all music is original, both made for this theme.

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

- The theme is dark only and draws in the Claude desktop and mobile apps, not the terminal.
- The animation is slow and gentle. With Reduce Motion on, the scene shows as a still picture.

## License

The code is under the [MIT License](LICENSE). The artwork, everything in `art/`
plus `hooks/forest.ts` (generated from it) and `docs/preview.png`, and the
music in `hooks/sounds.ts` are under [CC BY-NC 4.0](art/LICENSE): share and
remix them with credit, but not for commercial use.

## Editing the art

The scene lives in `art/`: `forest.svg`, `cat-wizard.svg` and `cat-mage.svg`.
After editing any of them, run `python3 art/compose.py` to rebuild
`hooks/forest.ts`.
`python3 art/mockup.py` then draws the README's mock-up, `docs/mockup.svg`,
from the rebuilt scene; render it to `docs/preview.png` with any SVG viewer.
