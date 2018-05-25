import { NgModule } from '@angular/core';
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
  MatInputModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppNavComponent } from 'src/app/components/app-nav/app-nav.component';
import { ThemePickerComponent } from 'src/app/components/theme-picker/theme-picker.component';
import { ContentComponent } from 'src/app/components/content/content.component';
import { LoginComponent } from '../components/login/login.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';
import { LandingComponent } from '../components/landing/landing.component';
import { MainContentComponent } from '../components/main-content/main-content.component';
import { AuthenticationService } from '../services/authentication.service';
import { AuthEffects } from '../state/effects/auth-effects';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
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
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatDividerModule,
    StoreModule.forRoot(reducers, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([AuthEffects, RouterEffects]),
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
    BrowserModule,
    BrowserAnimationsModule,
    AppNavComponent,
    LandingComponent,
    ThemePickerComponent,
    MainContentComponent,
    FlexLayoutModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ContentComponent
  ],
  declarations: [
    AppNavComponent,
    ThemePickerComponent,
    ContentComponent,
    LandingComponent,
    LoginComponent,
    SignUpComponent,
    MainContentComponent
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: RouterCustomSerializer }
  ],
  entryComponents: [ThemePickerComponent]
})
export class CoreModule {}
