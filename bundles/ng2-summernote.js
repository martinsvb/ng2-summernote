System.registerDynamic("ng2-summernote", ["@angular/core", "@angular/forms", "@angular/http", "rxjs/add/operator/toPromise"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var core_1 = $__require('@angular/core');
  var forms_1 = $__require('@angular/forms');
  var http_1 = $__require('@angular/http');
  $__require('rxjs/add/operator/toPromise');
  var NG2SUMMERNOTE_CONTROL_VALUE_ACCESSOR = new core_1.Provider(forms_1.NG_VALUE_ACCESSOR, {
    useExisting: core_1.forwardRef(function() {
      return Ng2Summernote;
    }),
    multi: true
  });
  var Ng2Summernote = (function() {
    function Ng2Summernote(_elementRef, _zone, _http) {
      this._elementRef = _elementRef;
      this._zone = _zone;
      this._http = _http;
      this.uploadFolder = "";
      this.change = new core_1.EventEmitter();
    }
    Object.defineProperty(Ng2Summernote.prototype, "value", {
      get: function() {
        return this._value;
      },
      set: function(v) {
        if (v !== this._value) {
          this._value = v;
          this._onChangeCallback(v);
        }
      },
      enumerable: true,
      configurable: true
    });
    ;
    Ng2Summernote.prototype.ngAfterViewInit = function() {};
    Ng2Summernote.prototype.updateValue = function(value) {
      var _this = this;
      this._zone.run(function() {
        _this._value = value;
        _this.onChange(value);
        _this._onTouchedCallback();
        _this.change.emit(value);
      });
    };
    Ng2Summernote.prototype.ngOnDestroy = function() {};
    Ng2Summernote.prototype._imageUpload = function(dataUpload) {
      var _this = this;
      if (dataUpload.editable) {
        var data = new FormData();
        data.append("file", dataUpload.files[0]);
        data.append("action", "upload");
        data.append("folder", this.uploadFolder);
        $.post({
          data: data,
          type: "POST",
          url: this.hostUpload,
          cache: false,
          contentType: false,
          processData: false,
          success: function(uploadedImg) {
            var insertImg = $('<img style="width: 100%;" src="' + uploadedImg[0] + '" />');
            $(_this._elementRef.nativeElement).find('.summernote').summernote('insertNode', insertImg[0]);
            console.log("Uploaded image: " + uploadedImg[0]);
          },
          error: function(err) {
            _this._errHandle(err);
          }
        });
      }
    };
    Ng2Summernote.prototype._mediaDelete = function(fileUrl) {
      var data = JSON.stringify({
        action: "del",
        file: fileUrl
      });
      var headers = new http_1.Headers({
        'Accept': '*/*',
        'Content-Type': 'application/json'
      });
      var options = new http_1.RequestOptions({headers: headers});
      return this._http.post(this.hostUpload, data, options).toPromise().then(function(response) {
        return response;
      }).catch(function(err) {
        return Promise.reject(err.message || err);
      });
    };
    Ng2Summernote.prototype._setLogicVars = function(variable, defaultVal) {
      variable = typeof variable !== 'undefined' ? true : false;
      if (!variable && defaultVal)
        variable = defaultVal;
      return variable;
    };
    Ng2Summernote.prototype._errHandle = function(err) {
      console.error("Error");
      console.log(err);
    };
    Ng2Summernote.prototype.writeValue = function(value) {
      var _this = this;
      if (value) {
        this._value = value;
        this.height = Number(this.height);
        this.editable = this._setLogicVars(this.editable, true);
        this.lang = $.summernote.lang[this.lang] ? this.lang : 'en-US';
        this._config = this.config || {
          height: this.height || 200,
          minHeight: Number(this.minHeight) || this.height || 200,
          maxHeight: Number(this.maxHeight) || this.height || 500,
          placeholder: this.placeholder || 'Text...',
          focus: this._setLogicVars(this.focus, false),
          airMode: this._setLogicVars(this.airMode, false),
          dialogsInBody: this._setLogicVars(this.dialogsInBody, false),
          editable: this.editable,
          lang: this.lang,
          disableResizeEditor: this._setLogicVars(this.disableResizeEditor, false)
        };
        this._config.callbacks = {
          onChange: function(evt) {
            _this.updateValue(evt);
          },
          onInit: function(evt) {}
        };
        if (typeof this.serverImgUp !== 'undefined') {
          this._config.callbacks.onImageUpload = function(files) {
            _this._imageUpload({
              files: files,
              editable: _this.editable
            });
          };
          this._config.callbacks.onMediaDelete = function(target) {
            var fileUrl;
            var attributes = target[0].attributes;
            for (var i = 0; i < attributes.length; i++) {
              if (attributes[i].name == "src") {
                fileUrl = attributes[i].value;
              }
            }
            _this._mediaDelete(fileUrl).then(function(resp) {
              console.log(resp.json());
            }).catch(function(err) {
              _this._errHandle(err.json());
            });
          };
        }
        $(this._elementRef.nativeElement).find('.summernote').summernote(this._config);
        $(this._elementRef.nativeElement).find('.summernote').summernote('code', value);
      }
    };
    Ng2Summernote.prototype.onChange = function(_) {};
    Ng2Summernote.prototype.onTouched = function() {};
    Ng2Summernote.prototype.registerOnChange = function(fn) {
      this.onChange = fn;
    };
    Ng2Summernote.prototype.registerOnTouched = function(fn) {
      this.onTouched = fn;
    };
    Ng2Summernote.prototype._onChangeCallback = function(_) {};
    Ng2Summernote.prototype._onTouchedCallback = function() {};
    __decorate([core_1.Input(), __metadata('design:type', Number)], Ng2Summernote.prototype, "height", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Number)], Ng2Summernote.prototype, "minHeight", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Number)], Ng2Summernote.prototype, "maxHeight", void 0);
    __decorate([core_1.Input(), __metadata('design:type', String)], Ng2Summernote.prototype, "placeholder", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Boolean)], Ng2Summernote.prototype, "focus", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Boolean)], Ng2Summernote.prototype, "airMode", void 0);
    __decorate([core_1.Input(), __metadata('design:type', String)], Ng2Summernote.prototype, "dialogsInBody", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Boolean)], Ng2Summernote.prototype, "editable", void 0);
    __decorate([core_1.Input(), __metadata('design:type', String)], Ng2Summernote.prototype, "lang", void 0);
    __decorate([core_1.Input(), __metadata('design:type', String)], Ng2Summernote.prototype, "disableResizeEditor", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Boolean)], Ng2Summernote.prototype, "serverImgUp", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Object)], Ng2Summernote.prototype, "config", void 0);
    __decorate([core_1.Input(), __metadata('design:type', String)], Ng2Summernote.prototype, "hostUpload", void 0);
    __decorate([core_1.Input(), __metadata('design:type', String)], Ng2Summernote.prototype, "uploadFolder", void 0);
    __decorate([core_1.Output(), __metadata('design:type', Object)], Ng2Summernote.prototype, "change", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Object)], Ng2Summernote.prototype, "value", null);
    Ng2Summernote = __decorate([core_1.Component({
      selector: 'ng2-summernote',
      providers: [NG2SUMMERNOTE_CONTROL_VALUE_ACCESSOR],
      template: "<div class=\"summernote\"></div>"
    }), __param(0, core_1.Inject(core_1.ElementRef)), __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone, http_1.Http])], Ng2Summernote);
    return Ng2Summernote;
  }());
  exports.Ng2Summernote = Ng2Summernote;
  return module.exports;
});
