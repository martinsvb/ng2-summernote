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

## Usage example

Your component template example:
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

export class EditorComponent {
  data: any = 'EditorComponent';
  data2: any = '<p>EditorComponent2</p><p>Next paragraph</p>';
  hostUpload: string;
  uploadFolder: string;

  constructor(urlProvider: urlProvider) {
    this.hostUpload = "Some URL can be taken from provider here";
    this.uploadFolder = "Upload folder can be set here";
  }
}
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
