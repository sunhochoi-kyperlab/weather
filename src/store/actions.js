import * as types from './actionTypes'

export function switchLoadingState ({commit}, /* boolean */args) {
  commit(types.SWITCH_LOADING_STATE, args)
}
export function abstractSet ({commit}, /* object */ args) {
  commit(types.ABSTRACT_SET, args)
}
