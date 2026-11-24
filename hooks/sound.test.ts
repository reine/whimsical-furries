import { expect, test } from 'claude-code/testing'

// The test kit has no theme to set, so a switch here meets the path a refused
// sound takes; whether the app plays a soundscape is checked by listening.
test('/furries-sound reports, refuses unknown names, and keeps the sound on a refusal', async ($, on) => {
  const store = new Map<string, unknown>([['soundscape', 'cozy']])
  on('store.get', (_, e) => ({ value: store.get(e.key) }))
  on('store.set', (_, e) => {
    store.set(e.key, e.value)
    return { value: undefined }
  })

  const run = async (args: string) => (await $.command.run({ command: 'furries-sound', args, origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })).text

  expect(await run('')).toContain('The soundscape is cozy')
  expect(await run('banjo')).toContain('no "banjo" soundscape')
  expect(await run(' Whimsical ')).toContain("couldn't play the whimsical soundscape, so cozy is still on")
  expect(store.get('soundscape')).toBe('cozy')
})
