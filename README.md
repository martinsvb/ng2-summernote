# ng2-summernote

This component integrate summernote wysiwyg editor as directive to Angular 2.0 project.

## Install

- add "ng2-summernote" to your package.json, last version number allways begins commit name
- npm install
- if you use **SystemJS** add this configuration to map:

    map: {
      "ng2-summernote": "node_modules/ng2-summernote"
    }
- built lib is located in bundles

## Summernote source files
- copy necessary summernote files to dist js folder, gulp example:
```
gulp.task('summernote', (done: any) => {
  gulp.src([
    './node_modules/summernote/dist/font/*'
  ])
  .pipe(gulp.dest('./dist/dev/assets/fonts'))
  .pipe(gulp.dest('./dist/prod/assets/fonts'));

  gulp.src([
    './node_modules/summernote/dist/summernote.min.js',
    './node_modules/summernote/dist/lang/summernote-cs-CZ.min.js',
    './node_modules/summernote/dist/lang/summernote-sk-SK.min.js',
    './node_modules/summernote/dist/lang/summernote-hu-HU.min.js',
    './node_modules/summernote/dist/lang/summernote-pl-PL.min.js'
  ])
  .pipe(plugins.concat('summernote.js'))
  .pipe(gulp.dest('./dist/dev/js'))
  .pipe(gulp.dest('./dist/prod/js'));

  return gulp.src([
    './node_modules/summernote/dist/summernote.css'
  ])
  .pipe(plugins.replace('url("font', 'url("../assets/fonts'))
  .pipe(gulp.dest('./dist/dev/css'))
  .pipe(gulp.dest('./dist/prod/css'));
});
```
- add this script to your index.html:
```
<script src="/js/summernote.js"></script>
```
- now summernote is available in global space

## Access ng2-summernote in Angular 2 application
- example main app module:
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Summernote } from 'ng2-summernote/ng2-summernote';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    Ng2Summernote,
    AppComponent
  ],
  providers: [
    {
        provide: APP_BASE_HREF,
        useValue: '<%= APP_BASE %>'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
- Import in component:
```
import { Component } from '@angular/core';
import { Ng2Summernote } from 'ng2-summernote/ng2-summernote';

@Component({
  moduleId: module.id,
  selector: 'editor-example-component',
  templateUrl: 'editor-example.component.html'
})
export class EditorExampleComponent {

  // Editors ng-model bindings
  data: string = 'appendix';
  data2: string = 'content';
  
  // If you want add editors bindings to some model
  model: any = {
    data: this.data,
    data2: this.data2
  }
  
  // OnSubmit add current editors bindings to some model
  onSubmit() {
    this.model.data = this.data;
    this.model.data2 = this.data2;
  }
 }
```
- Component template example:
```
  <div class="row">
    <div class="col-md-6">
      <ng2-summernote [(ngModel)]="data" lang="cs-CZ" serverImgUp hostUpload="{{hostUpload}}" uploadFolder="{{uploadFolder}}"></ng2-summernote>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6">
      <ng2-summernote [(ngModel)]="data2" height="500" lang="cs-CZ"></ng2-summernote>
    </div>
  </div>
```
## Inputs

- you can set inputs standalone or put them to config input as json
- config input is stronger than standalone inputs, so never combine them
  (set config json object or standalone inputs)

```
@Input() height: number;
@Input() minHeight: number;
@Input() maxHeight: number;
@Input() placeholder: string;
@Input() focus: boolean;
@Input() airMode: boolean;
@Input() dialogsInBody: string;
@Input() editable: boolean;
@Input() lang: string;
@Input() disableResizeEditor: string;
@Input() serverImgUp: boolean;
@Input() config: any;

/** URL for upload server images */
@Input() hostUpload: string;

/** Uploaded images server folder */
@Input() uploadFolder: string = "";
```

## Upload Image URL

If you want upload image to some URL set serverImgUp input
and then set hostUpload - it's your upload server URL
Components awaits returned array with URL of uploaded file
example: ["http://some-url.com/images/uploadedImg.jpg"]
