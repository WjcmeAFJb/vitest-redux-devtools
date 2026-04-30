import { describe, it, expect } from 'vitest'
import { waitForInspect } from '@vitest-redux-devtools/proxy'

/**
 * Demo of the `connect()` API for non-Redux integrations. The browser
 * extension exposes the same surface, so anything that already targets
 * `window.__REDUX_DEVTOOLS_EXTENSION__.connect(...)` (MobX, Zustand,
 * hand-rolled stores) works against this proxy unchanged.
 */
describe('custom store via connect()', () => {
  it('streams a tiny non-Redux store into the panel', async () => {
    const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
      name: 'CustomStore',
    })

    let state = { count: 0, label: 'idle' }
    devtools.init(state)

    const update = (action: { type: string; [k: string]: unknown }, patch: Partial<typeof state>) => {
      state = { ...state, ...patch }
      devtools.send(action, state)
    }

    update({ type: 'SET_LABEL', label: 'ready' }, { label: 'ready' })
    update({ type: 'INCREMENT' }, { count: state.count + 1 })
    update({ type: 'INCREMENT' }, { count: state.count + 1 })
    update({ type: 'BUMP', by: 10 }, { count: state.count + 10 })

    expect(state.count).toBe(12)

    // Listen for time-travel commands from the panel.
    devtools.subscribe((msg: any) => {
      if (msg.type === 'DISPATCH' && msg.payload?.type === 'JUMP_TO_STATE') {
        state = JSON.parse(msg.state)
      }
    })

    // Hold the test open so you can inspect / time-travel in the panel.
    // Comment out if you'd rather run the test without blocking.
    void waitForInspect
    // await waitForInspect()

    devtools.disconnect()
  }, 10 * 60_000)
})
