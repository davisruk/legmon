import { ThemeState } from './theme.state';

export class UIState {
    themeState: ThemeState;
}

export const getThemeNameState = (state: ThemeState): string => state.themeName;
export const getCloseState = (state: ThemeState): boolean => state.canClose;
export const getThemeState = (state: UIState): ThemeState => state.themeState;
