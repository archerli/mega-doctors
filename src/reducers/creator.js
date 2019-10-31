import { ADD, MINUS } from '../constants/creator'

import { INITIAL_STATE, MINE } from './initialState'

export const creator = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        num: state.num + 1
      }
    case MINUS:
      return {
        ...state,
        num: state.num - 1
      }
    default:
      return state
  }
}

export const mine = (state = MINE, action) => {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        name: action.payload.name
      }
    case MINUS:
      return {
        ...state,
        num: state.num - 1
      }
    default:
      return state
  }
}
