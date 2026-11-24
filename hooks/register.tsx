import type { Register, ThemeSetArgs } from 'claude-code'

import { FOREST } from './forest'
import { makeColors } from './make-colors.js'
import { COZY, WHIMSICAL } from './sounds'

// The Furries of Whimsical Forest. Catppuccin Macchiato, its gray-blues tinted purple, with an orchid accent
// and lavender secondary. Dark only; no pure black or white.
const { theme, problems } = makeColors({
  label: 'The Furries of Whimsical Forest',
  only: 'dark',
  roles: {
    accent: '#c58af0', // orchid: links, buttons, keywords
    pro: '#b7bdf8', // lavender: secondary highlights, literals
    warning: '#f5a97f', // peach lamplight
    success: '#a6da95',
    danger: '#ed8796',
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1f1b30',
        'surface-1': '#25203a',
        'surface-2': '#2a2540',
        'surface-3': '#2f2946',
        'text-primary': '#e4dcf7',
        'text-secondary': '#c5bce0',
        'text-muted': '#a69dc4',
      },
    },
  },
})

const COLORS: ThemeSetArgs = { colors: theme }

// The moonlit forest behind everything, with panels frosted over it and
// near-solid message rows so text always sits on the theme's own surfaces.
const LOOK: ThemeSetArgs = {
  ...COLORS,
  backdrop: { scene: 'forest', glass: { blur: 14, tint: '#1f1b30', opacity: 0.62 } },
  style: {
    AssistantMessage: { backgroundColor: '#1f1b30eb', radius: 14, padding: 14 },
    UserMessage: { backgroundColor: '#2f2946f2', radius: 14, padding: 12 },
    ToolUse: { backgroundColor: '#1f1b30e6', radius: 8, paddingX: 8 },
  },
}

const SOUNDS = { cozy: COZY, whimsical: WHIMSICAL } as const
type SoundName = keyof typeof SOUNDS
const isSoundName = (value: unknown): value is SoundName => typeof value === 'string' && value in SOUNDS

// Sets the whole look with the named sound. A build that takes no sound or
// style refuses the whole set, so step down until one takes. Resolves to the
// sound's refusal, if it was refused.
const apply = async (set: (look: ThemeSetArgs) => Promise<unknown>, log: (line: string) => void, name: SoundName) => {
  let refusal: string | undefined
  for (const look of [{ ...LOOK, sound: SOUNDS[name] }, LOOK, COLORS]) {
    try {
      await set(look)
      return refusal
    } catch (error) {
      refusal ??= String(error)
      log(String(error))
    }
  }
  return refusal
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    // A theme set before the app window attaches still stands and draws once
    // it does, so whether it is drawn yet needs no message.
    const saved = await $.store.get('soundscape')
    const name = isSoundName(saved) ? saved : 'cozy'
    const set = (look: ThemeSetArgs) => $.theme.set(look)
    const log = (line: string) => $.ui.log(line)

    // A whimsical sound the app refuses falls back to the cozy one.
    if ((await apply(set, log, name)) !== undefined && name !== 'cozy') {
      await apply(set, log, 'cozy')
    }
    $.ui.status(undefined)

    await $.command.register({
      name: 'furries-sound',
      description: 'Pick the Whimsical Forest soundscape: cozy or whimsical',
      argumentHint: 'cozy | whimsical',
      immediate: true,
    })

    return next(e)
  })

  // /furries-sound [cozy | whimsical]: switches the soundscape now and
  // remembers it for later sessions. With no choice, says which is on.
  on('command.run', { command: 'furries-sound' }, async ($, e) => {
    const saved = await $.store.get('soundscape')
    const current: SoundName = isSoundName(saved) ? saved : 'cozy'
    const choice = e.args.trim().toLowerCase()

    if (choice === '') {
      return { text: `The soundscape is ${current}. Use /furries-sound cozy or /furries-sound whimsical to switch.` }
    }

    if (!isSoundName(choice)) {
      return { text: `There's no "${choice}" soundscape. Pick cozy or whimsical.` }
    }

    const set = (look: ThemeSetArgs) => $.theme.set(look)
    const log = (line: string) => $.ui.log(line)
    const refusal = await apply(set, log, choice)

    if (refusal !== undefined) {
      await apply(set, log, current)

      return { text: `The app couldn't play the ${choice} soundscape, so ${current} is still on. It said: ${refusal}` }
    }

    await $.store.set('soundscape', choice)

    return { text: `Switched to the ${choice} soundscape. If the speaker in the title bar is off, press it to listen.` }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={FOREST} alt="A moonlit purple forest with fireflies drifting over a glowing path" isInteractive />
  })
}
