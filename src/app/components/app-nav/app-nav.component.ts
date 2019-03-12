import { Component, ViewChild, OnInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
  MediaMatcher
} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MenuItem } from '../../model/menu-item.model';
import { MatSidenav } from '@angular/material/sidenav';
import { Md5 } from 'ts-md5';
import {
  ThemePickerOverlayService,
  ThemePickerOverlayRef
} from '../theme-picker/theme-picker-overlay.service';
import { MatButton } from '@angular/material';
import { Store } from '@ngrx/store';
import { AppState, selectThemeCanCloseState } from '../../state/app.state';
import * as auth from '../../state/actions/auth-actions';
import * as NavActions from '../../state/actions/nav-actions';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css']
})
export class AppNavComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;
  @ViewChild('themeButton') themeButton: MatButton;
  isHandSet: Observable<BreakpointState>;
  showToolbarButton = false;
  sidebarMenu: MenuItem[];
  toolbarMenu: MenuItem[] = [
    { title: 'Documentation', routerLink: [''] },
    { title: 'About', routerLink: [''] }
  ];
  initSideMenu: MenuItem[] = [
    {
      title: 'Import Servers',
      routerLink: ['/content/servers-import']
    },
    { title: 'Server Status', routerLink: ['/content/servers-status'] },
    { title: 'User Maintenance', routerLink: ['/content'] }
  ];
  appTitle = 'LegMon';
  overlayRef: ThemePickerOverlayRef;
  themeCloseState: boolean;
  gravatarHash: string;
  imageInfo: Object;
  imageUrl: string;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private themePickerService: ThemePickerOverlayService,
    private store: Store<AppState>
  ) {
    this.isHandSet = this.breakpointObserver.observe(
      Breakpoints.HandsetPortrait
    );
    this.isHandSet.subscribe((breakState: BreakpointState) => {
      this.sidebarMenu = breakState.matches
        ? this.initSideMenu.concat(this.toolbarMenu)
        : this.initSideMenu;
      this.showToolbarButton = breakState.matches;
    });

    this.gravatarHash = Md5.hashStr('rich@davisfamily.eu').toString();
    this.imageUrl = `'https://www.gravatar.com/avatar/${
      this.gravatarHash
    }?s=50'`;
    this.imageInfo = {
      'border-radius': '50%',
      width: '50px',
      height: '50px',
      'background-image': 'url(' + this.imageUrl + ')',
      'background-repeat': 'no-repeat'
    };
  }

  ngOnInit(): void {
    this.store.select(selectThemeCanCloseState).subscribe(canClose => {
      this.themeCloseState = canClose;
      if (this.overlayRef) {
        this.closeOverlay();
      }
    });

    this.themePickerService.backDropClicked.subscribe(
      _ => (this.overlayRef = null)
    );

    // default page is Server Status so forward on
    this.store.dispatch(
      new NavActions.Go({
        path: ['content/servers-status']
      })
    );
  }

  handleMenuButtonClick() {
    this.drawer.toggle();
    this.showToolbarButton = !this.drawer.opened;
  }

  toggleThemePicker() {
    if (!this.overlayRef) {
      this.overlayRef = this.themePickerService.open(
        this.themeButton._elementRef
      );
    } else {
      this.closeOverlay();
    }
  }

  logout() {
    this.store.dispatch(new auth.Logout({}));
  }

  closeOverlay() {
    if (this.themeCloseState) {
      this.overlayRef.close();
      this.overlayRef = null;
    }
  }
}
