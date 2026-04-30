import { describe, it, expect } from 'vitest'
import { waitForInspect } from '@vitest-redux-devtools/proxy'
import { addBy, increment, makeStore } from './counter.js'

describe('counter', () => {
  it('runs a few actions you can inspect in the panel', async () => {
    const store = makeStore()

    store.dispatch(increment())
    store.dispatch(addBy(5))
    store.dispatch(increment())
    expect(store.getState().counter.value).toBe(7)

    // Set a breakpoint above and click "Debug Test" in the Vitest extension.
    // The DevTools panel (open via "Redux DevTools: Open Panel") will show
    // the timeline. Or uncomment to hold the test open without a debugger:
    //
    //   await waitForInspect()
    void waitForInspect
  })
})
