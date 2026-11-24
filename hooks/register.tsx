import type { Register, ThemeSetArgs, ThemeSound } from 'claude-code'

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

// A night in the forest, quiet enough to work beside for hours: a soft breeze,
// a low warm hum, far-off crickets on either side, leaves rustling now and
// then, and the odd firefly chime. Notes come from D major pentatonic so
// everything that overlaps stays in tune. The app plays it once the person
// presses the speaker in the session's title bar.
const PENTATONIC = ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'] as const

const SOUND: ThemeSound = {
  ambience: {
    reverb: 0.55,
    layers: [
      // breeze through the trees, swelling slowly
      // (brown noise, low-passed, so it rolls rather than hisses)
      { wave: 'brown', drone: true, gain: 0.07, filter: { type: 'lowpass', hz: 300, to: 650 }, tremolo: { hz: 0.07, depth: 0.5 } },
      // a faint, warm hum under it all
      { wave: 'sine', drone: true, notes: ['D3', 'A3'], gain: 0.02, tremolo: { hz: 0.1, depth: 0.3 } },
      // crickets, one far left and one far right, each chirp at one of a few
      // nearby pitches (in hertz, around A6 and B6) picked at random
      { wave: 'sine', notes: [1700, 1740, 1760, 1800, 1840], scatter: 0.35, gain: 0.025, pan: -0.7, attack: 0.03, release: 0.2, tremolo: { hz: 24, depth: 0.5 } },
      { wave: 'sine', notes: [1920, 1950, 1976, 2020, 2060], scatter: 0.28, gain: 0.022, pan: 0.7, attack: 0.03, release: 0.18, tremolo: { hz: 26, depth: 0.5 } },
      // leaves rustling: soft gusts of noise through the trees, one side then
      // the other, each one brightening or settling as it passes
      { wave: 'pink', scatter: 0.06, gain: 0.03, pan: -0.4, attack: 0.7, release: 1.6, filter: { type: 'bandpass', hz: 2400, to: 900 } },
      { wave: 'pink', scatter: 0.06, gain: 0.03, pan: 0.4, attack: 0.8, release: 1.4, filter: { type: 'bandpass', hz: 1100, to: 2200 } },
      // a firefly chime now and then: an octave below the cues, its strike
      // softened and its brightness filtered off so it glows rather than pings
      { wave: 'bell', notes: ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5'], scatter: 0.07, gain: 0.06, attack: 0.04, release: 2.6, filter: { type: 'lowpass', hz: 1400 } },
    ],
  },
  cues: {
    send: { reverb: 0.4, layers: [{ wave: 'bell', notes: ['A5', 'D6'], step: 0.08, gain: 0.22, release: 0.7 }] },
    done: { reverb: 0.5, layers: [{ wave: 'bell', notes: ['D5', 'F#5', 'A5'], step: 0.12, gain: 0.22, release: 1.2 }] },
    tool: { layers: [{ wave: 'sine', notes: ['B6'], gain: 0.05, attack: 0.004, release: 0.08 }] },
    ask: { reverb: 0.4, layers: [{ wave: 'bell', notes: ['E5', 'A5'], step: 0.15, gain: 0.24, release: 0.9 }] },
    error: { layers: [{ wave: 'triangle', notes: ['F#4', 'D4'], step: 0.18, gain: 0.18, release: 0.5, filter: { type: 'lowpass', hz: 1200 } }] },
    compact: { reverb: 0.5, layers: [{ wave: 'pink', gain: 0.14, attack: 0.3, release: 0.9, filter: { type: 'bandpass', hz: 400, to: 2000 } }] },
    // clicking the bare forest plays a note, low on the left, high on the right
    click: { reverb: 0.5, layers: [{ wave: 'bell', notes: PENTATONIC, gain: 0.2, release: 1.0 }] },
  },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    // A theme set before the app window attaches still stands and draws once
    // it does, so whether it is drawn yet needs no message. A build that takes
    // no sound or style refuses the whole set, so step down until one takes.
    for (const look of [{ ...LOOK, sound: SOUND }, LOOK, COLORS]) {
      try {
        await $.theme.set(look)
        break
      } catch (error) {
        $.ui.log(String(error))
      }
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
