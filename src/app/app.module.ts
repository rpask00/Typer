import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextFieldComponent } from './dashboard/text-field/text-field.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatsComponent } from './dashboard/stats/stats.component';
import { NavComponent } from './nav/nav.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllMaterialModule } from './all-material.module';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { PlayerslistComponent } from './multiplayer/playerslist/playerslist.component';
import { PlaygroundComponent } from './multiplayer/playground/playground.component';
import { UserThumbnailComponent } from './nav/user-thumbnail/user-thumbnail.component';
import { FieldComponent } from './dashboard/text-field/field/field.component';
import { ThumbnailComponent } from './multiplayer/playerslist/thumbnail/thumbnail.component';

@NgModule({
  declarations: [
    AppComponent,
    TextFieldComponent,
    DashboardComponent,
    StatsComponent,
    NavComponent,
    MultiplayerComponent,
    PlayerslistComponent,
    PlaygroundComponent,
    UserThumbnailComponent,
    FieldComponent,
    ThumbnailComponent,
  ],
  imports: [
    BrowserModule,
    AllMaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
