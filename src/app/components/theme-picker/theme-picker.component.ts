import { Component, OnInit } from '@angular/core';
import { ThemeOption } from './theme-option';
import { Store } from '@ngrx/store';
import { AppState, selectThemeState } from '../../state/app.state';
import { TOGGLE_DARK, SET_THEME } from '../../state/reducers/ui.reducer';
import { ThemeState } from '../../state/theme.state';

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit {
  tiles: ThemeOption[] = [
    {
      text: 'Indigo Pink',
      cols: 1,
      rows: 1,
      class: 'indigo-theme',
      secondary: 'indigo-pink',
      value: 0,
      isDark: false
    },
    {
      text: 'Deep Purple Amber',
      cols: 1,
      rows: 1,
      class: 'deep-purple-theme',
      secondary: 'purple-amber',
      value: 1,
      isDark: false
    },
    {
      text: 'Pink Blue Grey',
      cols: 1,
      rows: 1,
      class: 'pink-theme',
      secondary: 'pink-blue',
      value: 2,
      isDark: false
    },
    {
      text: 'Purple Green',
      cols: 1,
      rows: 1,
      class: 'purple-theme',
      secondary: 'purple-green',
      value: 3,
      isDark: false
    }
  ];

  // null first entry for default style
  styleThemes = [
    null,
    'deep-purple-amber-light-theme',
    'pink-blue-grey-light-theme',
    'purple-green-light-theme',
    'indigo-purple-dark-theme',
    'deep-purple-amber-dark-theme',
    'pink-blue-grey-dark-theme',
    'purple-green-dark-theme'
  ];

  useDark = false;
  currentThemeIndex: number;
  sliderBackground = 'lightgrey';

  constructor(private store: Store<AppState>) {
    this.currentThemeIndex = 0;
  }

  ngOnInit() {
    this.store.select(selectThemeState).subscribe(themeState => {
      this.useDark = themeState.isDark;
      this.currentThemeIndex = this.styleThemes.indexOf(themeState.themeName);
    });
  }

  changeTheme(theme: ThemeOption) {
    const themeIndexOffset =
      this.useDark === false ? 0 : this.styleThemes.length / 2;
    this.currentThemeIndex = theme.value + themeIndexOffset;
    this.notifyStateChange(SET_THEME);
  }

  toggleDark() {
    this.useDark = !this.useDark;
    const themeIndexOffset = this.styleThemes.length / 2;
    this.currentThemeIndex = this.useDark
      ? this.currentThemeIndex + themeIndexOffset
      : this.currentThemeIndex - themeIndexOffset;
    this.notifyStateChange(TOGGLE_DARK);
  }

  notifyStateChange(actionType: string) {
    const newState: ThemeState = {
      isDark: this.useDark,
      canClose: false, // change to true if you want the overlay to close on any state change
      themeName: this.styleThemes[this.currentThemeIndex]
    };
    this.store.dispatch({ type: actionType, payload: newState });
  }

  themeChecked(index: number) {
    index = this.useDark ? (index += this.styleThemes.length / 2) : index;
    return index === this.currentThemeIndex;
  }
}
