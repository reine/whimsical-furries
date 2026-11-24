import type { Register, ThemeSetArgs } from 'claude-code'

import { FOREST } from './forest'
import { makeColors } from './make-colors.js'

// The Furries of Whimsical Forest. Catppuccin Macchiato, its gray-blues tinted violet, with an orchid accent
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

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    // A theme set before the app window attaches still stands and draws once
    // it does, so whether it is drawn yet needs no message.
    try {
      await $.theme.set(LOOK)
    } catch (error) {
      $.ui.log(String(error))
      await $.theme.set(COLORS)
    }
    $.ui.status(undefined)

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={FOREST} alt="A moonlit violet forest with fireflies drifting over a glowing path" isInteractive />
  })
}
