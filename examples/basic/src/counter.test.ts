import { describe, it, expect } from 'vitest'
import { waitForInspect } from '@vitest-redux-devtools/proxy'
import { addBy, increment, makeStore } from './counter.js'

describe('counter', () => {
  it('increments and adds', async () => {
    const store = makeStore()
    store.dispatch(increment())
    store.dispatch(addBy(5))
    store.dispatch(increment())
    expect(store.getState().counter.value).toBe(7)

    // Drop a breakpoint above and click "Debug this test" — the panel will
    // show the timeline. Or uncomment the next line to hold the test open
    // until you press resume in the panel.
    // await waitForInspect()
    void waitForInspect
  })
})
