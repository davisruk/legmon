import { metaReducers } from './meta-reducers';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatSlideToggleModule,
  MatFormFieldModule,
  MatSelectModule,
  MatMenuModule,
  MatGridListModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppNavComponent } from 'src/app/components/app-nav/app-nav.component';
import { ThemePickerComponent } from 'src/app/components/theme-picker/theme-picker.component';
import { LoginComponent } from '../components/login/login.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';
import { LandingComponent } from '../components/landing/landing.component';
import { MainContentComponent } from '../components/main-content/main-content.component';
import { AuthenticationService } from '../services/authentication.service';
import { AuthEffects } from '../state/effects/auth-effects';
import { ServerListComponent } from '../components/server-list/server-list.component';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from '../state/app.state';
import { AuthGuardService } from '../services/auth-guard.service';
import { environment } from '../../environments/environment';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';
import { RouterCustomSerializer } from '../state/router.state';
import { RouterEffects } from '../state/effects/nav-effects';
import { ServersEffects } from '../state/effects/servers-effects';
import { CdkTableModule } from '@angular/cdk/table';
import { ServersStatusPageComponent } from '../components/servers-status-page/servers-status-page.component';
import { ServerDetailComponent } from '../components/server-detail/server-detail.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    LayoutModule,
    CdkTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatGridListModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([AuthEffects, RouterEffects, ServersEffects]),
    RouterModule.forRoot([
      { path: 'log-in', component: LoginComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: '', component: LandingComponent },
      {
        path: 'content',
        component: MainContentComponent,
        canActivate: [AuthGuardService]
        // all app routes should go as children off Main Content to keep the side panel and nav bar eg.
        // children: [
        //  { path: 'patients', component: PatientListComponent },
        //  { path: 'prescriptions', component: PrescriptionListComponent }
        // ]
      },
      { path: '**', redirectTo: 'content' }
    ]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' })
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatGridListModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppNavComponent,
    LandingComponent,
    ThemePickerComponent,
    MainContentComponent,
    ServerListComponent,
    ServersStatusPageComponent,
    FlexLayoutModule
  ],
  declarations: [
    AppNavComponent,
    ThemePickerComponent,
    ServerListComponent,
    LandingComponent,
    LoginComponent,
    SignUpComponent,
    MainContentComponent,
    ServersStatusPageComponent,
    ServerDetailComponent
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: RouterCustomSerializer }
  ],
  entryComponents: [ThemePickerComponent]
})
export class CoreModule {}
