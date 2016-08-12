"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
// Control Value accessor provider
var NG2SUMMERNOTE_CONTROL_VALUE_ACCESSOR = new core_1.Provider(forms_1.NG_VALUE_ACCESSOR, {
    useExisting: core_1.forwardRef(function () { return Ng2Summernote; }),
    multi: true
});
var Ng2Summernote = (function () {
    function Ng2Summernote(_elementRef, _zone, _http) {
        this._elementRef = _elementRef;
        this._zone = _zone;
        this._http = _http;
        /** Uploaded images server folder */
        this.uploadFolder = "";
        this.change = new core_1.EventEmitter();
    }
    Object.defineProperty(Ng2Summernote.prototype, "value", {
        get: function () { return this._value; },
        set: function (v) {
            if (v !== this._value) {
                this._value = v;
                this._onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Ng2Summernote.prototype.ngAfterViewInit = function () { };
    /**
     * Value update process
     */
    Ng2Summernote.prototype.updateValue = function (value) {
        var _this = this;
        this._zone.run(function () {
            _this._value = value;
            _this.onChange(value);
            _this._onTouchedCallback();
            _this.change.emit(value);
        });
    };
    Ng2Summernote.prototype.ngOnDestroy = function () { };
    Ng2Summernote.prototype._imageUpload = function (dataUpload) {
        var _this = this;
        if (dataUpload.editable) {
            var data = new FormData();
            data.append("file", dataUpload.files[0]);
            data.append("action", "upload");
            data.append("image", "resizeNoThumb");
            data.append("folder", this.uploadFolder);
            $.post({
                data: data,
                type: "POST",
                url: this.hostUpload,
                cache: false,
                contentType: false,
                processData: false,
                success: function (uploadedImg) {
                    var insertImg = $('<img style="width: 100%;" src="' + uploadedImg.data[0].fileName + '" />');
                    $(_this._elementRef.nativeElement).find('.summernote').summernote('insertNode', insertImg[0]);
                    console.log("Uploaded image: " + uploadedImg.data[0]);
                },
                error: function (err) { _this._errHandle(err); }
            });
        }
    };
    Ng2Summernote.prototype._mediaDelete = function (fileUrl) {
        var data = JSON.stringify({
            action: "del",
            file: fileUrl
        });
        var headers = new http_1.Headers({
            'Accept': '*/*',
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(this.hostUpload, data, options)
            .toPromise()
            .then(function (response) { return response; })
            .catch(function (err) { return Promise.reject(err.message || err); });
    };
    /**
     * Set logical varibles from text input values
     *
     * @param any variable, logic varible for setting
     * @param boolean defaultValue, this value will be set if variable is not set
     *
     * @return boolean variable, finally setted variable value
     */
    Ng2Summernote.prototype._setLogicVars = function (variable, defaultVal) {
        variable = typeof variable !== 'undefined' ? true : false;
        if (!variable && defaultVal)
            variable = defaultVal;
        return variable;
    };
    /**
     * Hanle error in console
     */
    Ng2Summernote.prototype._errHandle = function (err) {
        console.error("Error");
        console.log(err);
    };
    /**
     * Implements ControlValueAccessor
     */
    Ng2Summernote.prototype.writeValue = function (value) {
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
                onChange: function (evt) {
                    _this.updateValue(evt);
                },
                onInit: function (evt) { }
            };
            if (typeof this.serverImgUp !== 'undefined') {
                this._config.callbacks.onImageUpload = function (files) {
                    _this._imageUpload({ files: files, editable: _this.editable });
                };
                this._config.callbacks.onMediaDelete = function (target) {
                    var fileUrl;
                    var attributes = target[0].attributes;
                    for (var i = 0; i < attributes.length; i++) {
                        if (attributes[i].name == "src") {
                            fileUrl = attributes[i].value;
                        }
                    }
                    _this._mediaDelete(fileUrl)
                        .then(function (resp) { console.log(resp.json().data); })
                        .catch(function (err) { _this._errHandle(err); });
                };
            }
            $(this._elementRef.nativeElement).find('.summernote').summernote(this._config);
            $(this._elementRef.nativeElement).find('.summernote').summernote('code', value);
        }
    };
    Ng2Summernote.prototype.onChange = function (_) { };
    Ng2Summernote.prototype.onTouched = function () { };
    Ng2Summernote.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    Ng2Summernote.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    Ng2Summernote.prototype._onChangeCallback = function (_) { };
    Ng2Summernote.prototype._onTouchedCallback = function () { };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Ng2Summernote.prototype, "height", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Ng2Summernote.prototype, "minHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Ng2Summernote.prototype, "maxHeight", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Ng2Summernote.prototype, "placeholder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Ng2Summernote.prototype, "focus", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Ng2Summernote.prototype, "airMode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Ng2Summernote.prototype, "dialogsInBody", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Ng2Summernote.prototype, "editable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Ng2Summernote.prototype, "lang", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Ng2Summernote.prototype, "disableResizeEditor", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Ng2Summernote.prototype, "serverImgUp", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2Summernote.prototype, "config", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Ng2Summernote.prototype, "hostUpload", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Ng2Summernote.prototype, "uploadFolder", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Ng2Summernote.prototype, "change", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Ng2Summernote.prototype, "value", null);
    Ng2Summernote = __decorate([
        core_1.Component({
            selector: 'ng2-summernote',
            providers: [NG2SUMMERNOTE_CONTROL_VALUE_ACCESSOR],
            template: "<div class=\"summernote\"></div>",
        }),
        __param(0, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone, http_1.Http])
    ], Ng2Summernote);
    return Ng2Summernote;
}());
exports.Ng2Summernote = Ng2Summernote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXN1bW1lcm5vdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItc3VtbWVybm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBVU8sZUFBZSxDQUFDLENBQUE7QUFDdkIsc0JBQWdDLGdCQUFnQixDQUFDLENBQUE7QUFDakQscUJBQTRDLGVBQWUsQ0FBQyxDQUFBO0FBRTVELFFBQU8sNkJBQTZCLENBQUMsQ0FBQTtBQUlyQyxrQ0FBa0M7QUFDbEMsSUFBTSxvQ0FBb0MsR0FBRyxJQUFJLGVBQVEsQ0FDdkQseUJBQWlCLEVBQ2pCO0lBQ0UsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLGFBQWEsRUFBYixDQUFhLENBQUM7SUFDNUMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUNGLENBQUM7QUFRRjtJQTJCSSx1QkFDZ0MsV0FBdUIsRUFDM0MsS0FBYSxFQUNiLEtBQVc7UUFGUyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUMzQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQVp2QixvQ0FBb0M7UUFDM0IsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFFekIsV0FBTSxHQUFHLElBQUksbUJBQVksRUFBTyxDQUFDO0lBVXhDLENBQUM7SUFFSixzQkFBSSxnQ0FBSzthQUFULGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMvQixVQUFVLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDOzs7T0FOdUM7O0lBUXhDLHVDQUFlLEdBQWYsY0FBb0IsQ0FBQztJQUVyQjs7T0FFRztJ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cUJBQWEsZ0JBeUx6QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIE5nWm9uZSxcclxuICBQcm92aWRlcixcclxuICBJbmplY3QsXHJcbiAgZm9yd2FyZFJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7SHR0cCwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5cclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xyXG5cclxuZGVjbGFyZSB2YXIgJDogYW55O1xyXG5cclxuLy8gQ29udHJvbCBWYWx1ZSBhY2Nlc3NvciBwcm92aWRlclxyXG5jb25zdCBORzJTVU1NRVJOT1RFX0NPTlRST0xfVkFMVUVfQUNDRVNTT1IgPSBuZXcgUHJvdmlkZXIoXHJcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAge1xyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmcyU3VtbWVybm90ZSksXHJcbiAgICBtdWx0aTogdHJ1ZVxyXG4gIH1cclxuKTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmcyLXN1bW1lcm5vdGUnLFxyXG4gIHByb3ZpZGVyczogW05HMlNVTU1FUk5PVEVfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUl0sXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic3VtbWVybm90ZVwiPjwvZGl2PmAsXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgTmcyU3VtbWVybm90ZSB7XHJcblxyXG4gICAgQElucHV0KCkgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSBtaW5IZWlnaHQ6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIG1heEhlaWdodDogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGZvY3VzOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgYWlyTW9kZTogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIGRpYWxvZ3NJbkJvZHk6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGVkaXRhYmxlOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgbGFuZzogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZGlzYWJsZVJlc2l6ZUVkaXRvcjogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgc2VydmVySW1nVXA6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBjb25maWc6IGFueTtcclxuXHJcbiAgICAvKiogVVJMIGZvciB1cGxvYWQgc2VydmVyIGltYWdlcyAqL1xyXG4gICAgQElucHV0KCkgaG9zdFVwbG9hZDogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBVcGxvYWRlZCBpbWFnZXMgc2VydmVyIGZvbGRlciAqL1xyXG4gICAgQElucHV0KCkgdXBsb2FkRm9sZGVyOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBwcml2YXRlIF9jb25maWc6IGFueTtcclxuXHJcbiAgICBwcml2YXRlIF92YWx1ZTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBASW5qZWN0KEVsZW1lbnRSZWYpIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBfem9uZTogTmdab25lLFxyXG4gICAgICAgIHByaXZhdGUgX2h0dHA6IEh0dHBcclxuICAgICkge31cclxuXHJcbiAgICBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9O1xyXG4gICAgQElucHV0KCkgc2V0IHZhbHVlKHYpIHtcclxuICAgICAgICBpZiAodiAhPT0gdGhpcy5fdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2O1xyXG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZUNhbGxiYWNrKHYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQgKCkge31cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZhbHVlIHVwZGF0ZSBwcm9jZXNzXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZVZhbHVlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX29uVG91Y2hlZENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlLmVtaXQodmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25EZXN0cm95ICgpIHt9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW1hZ2VVcGxvYWQoZGF0YVVwbG9hZDogYW55KSB7XHJcbiAgICAgICAgaWYgKGRhdGFVcGxvYWQuZWRpdGFibGUpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoXCJmaWxlXCIsIGRhdGFVcGxvYWQuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImFjdGlvblwiLCBcInVwbG9hZFwiKTtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBcInJlc2l6ZU5vVGh1bWJcIik7XHJcbiAgICAgICAgICAgIGRhdGEuYXBwZW5kKFwiZm9sZGVyXCIsIHRoaXMudXBsb2FkRm9sZGVyKTtcclxuICAgICAgICAgICAgJC5wb3N0KHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdGhpcy5ob3N0VXBsb2FkLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogKHVwbG9hZGVkSW1nOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5zZXJ0SW1nID0gJCgnPGltZyBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHNyYz1cIicgKyB1cGxvYWRlZEltZy5kYXRhWzBdLmZpbGVOYW1lICsgJ1wiIC8+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmZpbmQoJy5zdW1tZXJub3RlJykuc3VtbWVybm90ZSgnaW5zZXJ0Tm9kZScsIGluc2VydEltZ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGxvYWRlZCBpbWFnZTogXCIgKyB1cGxvYWRlZEltZy5kYXRhWzBdKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogKGVycjogYW55KSA9PiB7IHRoaXMuX2VyckhhbmRsZShlcnIpIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21lZGlhRGVsZXRlKGZpbGVVcmw6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBkYXRhOiBhbnkgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIGFjdGlvbjogXCJkZWxcIixcclxuICAgICAgICAgICAgZmlsZTogZmlsZVVybFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcclxuICAgICAgICAgICAgJ0FjY2VwdCc6ICcqLyonLFxyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnM6IGhlYWRlcnN9KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wb3N0KHRoaXMuaG9zdFVwbG9hZCwgZGF0YSwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50b1Byb21pc2UoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlOiBhbnkpID0+IHJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IGFueSkgPT4gUHJvbWlzZS5yZWplY3QoZXJyLm1lc3NhZ2UgfHwgZXJyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgbG9naWNhbCB2YXJpYmxlcyBmcm9tIHRleHQgaW5wdXQgdmFsdWVzXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBhbnkgdmFyaWFibGUsIGxvZ2ljIHZhcmlibGUgZm9yIHNldHRpbmdcclxuICAgICAqIEBwYXJhbSBib29sZWFuIGRlZmF1bHRWYWx1ZSwgdGhpcyB2YWx1ZSB3aWxsIGJlIHNldCBpZiB2YXJpYWJsZSBpcyBub3Qgc2V0XHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4gYm9vbGVhbiB2YXJpYWJsZSwgZmluYWxseSBzZXR0ZWQgdmFyaWFibGUgdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc2V0TG9naWNWYXJzKHZhcmlhYmxlOiBhbnksIGRlZmF1bHRWYWw/OiBib29sZWFuKSB7XHJcbiAgICAgIHZhcmlhYmxlID0gdHlwZW9mIHZhcmlhYmxlICE9PSAndW5kZWZpbmVkJyA/IHRydWUgOiBmYWxzZTsgXHJcbiAgICAgIGlmICghdmFyaWFibGUgJiYgZGVmYXVsdFZhbCkgdmFyaWFibGUgPSBkZWZhdWx0VmFsO1xyXG5cclxuICAgICAgcmV0dXJuIHZhcmlhYmxlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmxlIGVycm9yIGluIGNvbnNvbGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZXJySGFuZGxlKGVycjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvclwiKTtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3JcclxuICAgICAqL1xyXG4gICAgd3JpdGVWYWx1ZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBOdW1iZXIodGhpcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0YWJsZSA9IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmVkaXRhYmxlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubGFuZyA9ICQuc3VtbWVybm90ZS5sYW5nW3RoaXMubGFuZ10gPyB0aGlzLmxhbmcgOiAnZW4tVVMnXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcgPSB0aGlzLmNvbmZpZyB8fCB7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0IHx8IDIwMCxcclxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogTnVtYmVyKHRoaXMubWluSGVpZ2h0KSB8fCB0aGlzLmhlaWdodCB8fCAyMDAsXHJcbiAgICAgICAgICAgICAgICBtYXhIZWlnaHQ6IE51bWJlcih0aGlzLm1heEhlaWdodCkgfHwgdGhpcy5oZWlnaHQgfHwgNTAwLFxyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucGxhY2Vob2xkZXIgfHwgJ1RleHQuLi4nLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmZvY3VzLCBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBhaXJNb2RlOiB0aGlzLl9zZXRMb2dpY1ZhcnModGhpcy5haXJNb2RlLCBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBkaWFsb2dzSW5Cb2R5OiB0aGlzLl9zZXRMb2dpY1ZhcnModGhpcy5kaWFsb2dzSW5Cb2R5LCBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogdGhpcy5lZGl0YWJsZSxcclxuICAgICAgICAgICAgICAgIGxhbmc6IHRoaXMubGFuZyxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVSZXNpemVFZGl0b3I6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmRpc2FibGVSZXNpemVFZGl0b3IsIGZhbHNlKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNhbGxiYWNrcyA9IHtcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZXZ0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGV2dCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25Jbml0OiAoZXZ0OiBhbnkpID0+IHt9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2VydmVySW1nVXAgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWcuY2FsbGJhY2tzLm9uSW1hZ2VVcGxvYWQgPSAoZmlsZXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlVXBsb2FkKHtmaWxlczogZmlsZXMsIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNhbGxiYWNrcy5vbk1lZGlhRGVsZXRlID0gKHRhcmdldDogW2FueV0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZVVybDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzOiBhbnkgPSB0YXJnZXRbMF0uYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbaV0ubmFtZSA9PSBcInNyY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlVXJsID0gYXR0cmlidXRlc1tpXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZWRpYURlbGV0ZShmaWxlVXJsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzcDogYW55KSA9PiB7IGNvbnNvbGUubG9nKHJlc3AuanNvbigpLmRhdGEpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBhbnkpID0+IHsgdGhpcy5fZXJySGFuZGxlKGVycikgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuZmluZCgnLnN1bW1lcm5vdGUnKS5zdW1tZXJub3RlKHRoaXMuX2NvbmZpZyk7XHJcbiAgICAgICAgICAgICQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5maW5kKCcuc3VtbWVybm90ZScpLnN1bW1lcm5vdGUoJ2NvZGUnLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25DaGFuZ2UgKF86IGFueSkge31cclxuICAgIG9uVG91Y2hlZCAoKSB7fVxyXG4gICAgcmVnaXN0ZXJPbkNoYW5nZSAoZm46IGFueSkgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cclxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkIChmbjogYW55KSB7IHRoaXMub25Ub3VjaGVkID0gZm47IH1cclxuICAgIF9vbkNoYW5nZUNhbGxiYWNrIChfOiBhbnkpIHt9XHJcbiAgICBfb25Ub3VjaGVkQ2FsbGJhY2sgKCkge31cclxufVxyXG4iXX0=