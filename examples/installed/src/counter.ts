import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value += 1
    },
    addBy(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

export const { increment, addBy } = counter.actions

export const makeStore = () =>
  configureStore({
    reducer: { counter: counter.reducer },
  })
