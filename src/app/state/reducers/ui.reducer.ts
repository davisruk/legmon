import { Action } from '@ngrx/store';
import { UIState } from '../ui.state';
import { ThemeState } from '../theme.state';
import { ActionWithPayload } from '../../core/core.action';

export const TOGGLE_DARK = '[Theme] Toggle Dark';
export const SET_THEME = '[Theme] Set Theme';
const initialState: UIState = {
  themeState: { isDark: false, canClose: false, themeName: null }
};

export function uiStateReducer(state: UIState = initialState, action: Action) {
  switch (action.type) {
    case TOGGLE_DARK:
      const toggleAction: ActionWithPayload<ThemeState> = <
        ActionWithPayload<ThemeState>
      >action;
      return { themeState: Object.assign({}, toggleAction.payload) };

    case SET_THEME:
      const setThemeAction: ActionWithPayload<ThemeState> = <
        ActionWithPayload<ThemeState>
      >action;
      return { themeState: Object.assign({}, setThemeAction.payload) };

    default:
      return state;
  }
}
