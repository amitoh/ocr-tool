import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatFileUploadModule} from 'angular-material-fileupload';
import {AppComponent} from './app.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {MatButtonModule, MatProgressBarModule, MatToolbarModule} from '@angular/material';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {FileDropModule} from 'ngx-file-drop';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {HttpClientModule} from '@angular/common/http';
import {BytesPipe} from './bytes.pipe';
@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    NavBarComponent,
    BytesPipe
  ],
  imports: [
    BrowserModule,
    MatFileUploadModule,
    MatButtonModule,
    MatToolbarModule,
    FileDropModule,
    AngularFileUploaderModule,
    HttpClientModule,
    MatProgressBarModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
