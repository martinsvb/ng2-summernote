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
            data.append("folder", this.uploadFolder);
            $.post({
                data: data,
                type: "POST",
                url: this.hostUpload,
                cache: false,
                contentType: false,
                processData: false,
                success: function (uploadedImg) {
                    var insertImg = $('<img style="width: 100%;" src="' + uploadedImg[0] + '" />');
                    $(_this._elementRef.nativeElement).find('.summernote').summernote('insertNode', insertImg[0]);
                    console.log("Uploaded image: " + uploadedImg[0]);
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
                        .then(function (resp) { console.log(resp.json()); })
                        .catch(function (err) { _this._errHandle(err.json()); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXN1bW1lcm5vdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItc3VtbWVybm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBVU8sZUFBZSxDQUFDLENBQUE7QUFDdkIsc0JBQWdDLGdCQUFnQixDQUFDLENBQUE7QUFDakQscUJBQTRDLGVBQWUsQ0FBQyxDQUFBO0FBRTVELFFBQU8sNkJBQTZCLENBQUMsQ0FBQTtBQUlyQyxrQ0FBa0M7QUFDbEMsSUFBTSxvQ0FBb0MsR0FBRyxJQUFJLGVBQVEsQ0FDdkQseUJBQWlCLEVBQ2pCO0lBQ0UsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLGFBQWEsRUFBYixDQUFhLENBQUM7SUFDNUMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUNGLENBQUM7QUFRRjtJQTJCSSx1QkFDZ0MsV0FBdUIsRUFDM0MsS0FBYSxFQUNiLEtBQVc7UUFGUyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUMzQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQVp2QixvQ0FBb0M7UUFDM0IsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFFekIsV0FBTSxHQUFHLElBQUksbUJBQVksRUFBTyxDQUFDO0lBVXhDLENBQUM7SUFFSixzQkFBSSxnQ0FBSzthQUFULGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMvQixVQUFVLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDOzs7T0FOdUM7O0lBUXhDLHVDQUFlLEdBQWYsY0FBb0IsQ0FBQztJQUVyQjs7T0FFRztJ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clxuICBPdXRwdXQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgTmdab25lLFxyXG4gIFByb3ZpZGVyLFxyXG4gIEluamVjdCxcclxuICBmb3J3YXJkUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHtIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcblxyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XHJcblxyXG5kZWNsYXJlIHZhciAkOiBhbnk7XHJcblxyXG4vLyBDb250cm9sIFZhbHVlIGFjY2Vzc29yIHByb3ZpZGVyXHJcbmNvbnN0IE5HMlNVTU1FUk5PVEVfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUiA9IG5ldyBQcm92aWRlcihcclxuICBOR19WQUxVRV9BQ0NFU1NPUixcclxuICB7XHJcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZzJTdW1tZXJub3RlKSxcclxuICAgIG11bHRpOiB0cnVlXHJcbiAgfVxyXG4pO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZzItc3VtbWVybm90ZScsXHJcbiAgcHJvdmlkZXJzOiBbTkcyU1VNTUVSTk9URV9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SXSxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzdW1tZXJub3RlXCI+PC9kaXY+YCxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZzJTdW1tZXJub3RlIHtcclxuXHJcbiAgICBASW5wdXQoKSBoZWlnaHQ6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIG1pbkhlaWdodDogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgbWF4SGVpZ2h0OiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZm9jdXM6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBhaXJNb2RlOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgZGlhbG9nc0luQm9keTogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBsYW5nOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBkaXNhYmxlUmVzaXplRWRpdG9yOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBzZXJ2ZXJJbWdVcDogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIGNvbmZpZzogYW55O1xyXG5cclxuICAgIC8qKiBVUkwgZm9yIHVwbG9hZCBzZXJ2ZXIgaW1hZ2VzICovXHJcbiAgICBASW5wdXQoKSBob3N0VXBsb2FkOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFVwbG9hZGVkIGltYWdlcyBzZXJ2ZXIgZm9sZGVyICovXHJcbiAgICBASW5wdXQoKSB1cGxvYWRGb2xkZXI6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgQE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIHByaXZhdGUgX2NvbmZpZzogYW55O1xyXG5cclxuICAgIHByaXZhdGUgX3ZhbHVlOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIEBJbmplY3QoRWxlbWVudFJlZikgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF96b25lOiBOZ1pvbmUsXHJcbiAgICAgICAgcHJpdmF0ZSBfaHR0cDogSHR0cFxyXG4gICAgKSB7fVxyXG5cclxuICAgIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH07XHJcbiAgICBASW5wdXQoKSBzZXQgdmFsdWUodikge1xyXG4gICAgICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHY7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCAoKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFsdWUgdXBkYXRlIHByb2Nlc3NcclxuICAgICAqL1xyXG4gICAgdXBkYXRlVmFsdWUgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3kgKCkge31cclxuXHJcbiAgICBwcml2YXRlIF9pbWFnZVVwbG9hZChkYXRhVXBsb2FkOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YVVwbG9hZC5lZGl0YWJsZSkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImZpbGVcIiwgZGF0YVVwbG9hZC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgIGRhdGEuYXBwZW5kKFwiYWN0aW9uXCIsIFwidXBsb2FkXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImZvbGRlclwiLCB0aGlzLnVwbG9hZEZvbGRlcik7XHJcbiAgICAgICAgICAgICQucG9zdCh7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHRoaXMuaG9zdFVwbG9hZCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ICh1cGxvYWRlZEltZzogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluc2VydEltZyA9ICQoJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiBzcmM9XCInK3VwbG9hZGVkSW1nWzBdKydcIiAvPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5maW5kKCcuc3VtbWVybm90ZScpLnN1bW1lcm5vdGUoJ2luc2VydE5vZGUnLCBpbnNlcnRJbWdbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBsb2FkZWQgaW1hZ2U6IFwiICsgdXBsb2FkZWRJbWdbMF0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiAoZXJyOiBhbnkpID0+IHsgdGhpcy5fZXJySGFuZGxlKGVycikgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbWVkaWFEZWxldGUoZmlsZVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IGRhdGE6IGFueSA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgYWN0aW9uOiBcImRlbFwiLFxyXG4gICAgICAgICAgICBmaWxlOiBmaWxlVXJsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xyXG4gICAgICAgICAgICAnQWNjZXB0JzogJyovKicsXHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7aGVhZGVyczogaGVhZGVyc30pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QodGhpcy5ob3N0VXBsb2FkLCBkYXRhLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRvUHJvbWlzZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2U6IGFueSkgPT4gcmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogYW55KSA9PiBQcm9taXNlLnJlamVjdChlcnIubWVzc2FnZSB8fCBlcnIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBsb2dpY2FsIHZhcmlibGVzIGZyb20gdGV4dCBpbnB1dCB2YWx1ZXNcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGFueSB2YXJpYWJsZSwgbG9naWMgdmFyaWJsZSBmb3Igc2V0dGluZ1xyXG4gICAgICogQHBhcmFtIGJvb2xlYW4gZGVmYXVsdFZhbHVlLCB0aGlzIHZhbHVlIHdpbGwgYmUgc2V0IGlmIHZhcmlhYmxlIGlzIG5vdCBzZXRcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiBib29sZWFuIHZhcmlhYmxlLCBmaW5hbGx5IHNldHRlZCB2YXJpYWJsZSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9zZXRMb2dpY1ZhcnModmFyaWFibGU6IGFueSwgZGVmYXVsdFZhbD86IGJvb2xlYW4pIHtcclxuICAgICAgdmFyaWFibGUgPSB0eXBlb2YgdmFyaWFibGUgIT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IGZhbHNlOyBcclxuICAgICAgaWYgKCF2YXJpYWJsZSAmJiBkZWZhdWx0VmFsKSB2YXJpYWJsZSA9IGRlZmF1bHRWYWw7XHJcblxyXG4gICAgICByZXR1cm4gdmFyaWFibGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFubGUgZXJyb3IgaW4gY29uc29sZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9lcnJIYW5kbGUoZXJyOiBhbnkpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yXCIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvclxyXG4gICAgICovXHJcbiAgICB3cml0ZVZhbHVlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IE51bWJlcih0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRhYmxlID0gdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuZWRpdGFibGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sYW5nID0gJC5zdW1tZXJub3RlLmxhbmdbdGhpcy5sYW5nXSA/IHRoaXMubGFuZyA6ICdlbi1VUydcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuY29uZmlnIHx8IHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQgfHwgMjAwLFxyXG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0OiBOdW1iZXIodGhpcy5taW5IZWlnaHQpIHx8IHRoaXMuaGVpZ2h0IHx8IDIwMCxcclxuICAgICAgICAgICAgICAgIG1heEhlaWdodDogTnVtYmVyKHRoaXMubWF4SGVpZ2h0KSB8fCB0aGlzLmhlaWdodCB8fCA1MDAsXHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlciB8fCAnVGV4dC4uLicsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuZm9jdXMsIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGFpck1vZGU6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmFpck1vZGUsIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmRpYWxvZ3NJbkJvZHksIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlLFxyXG4gICAgICAgICAgICAgICAgbGFuZzogdGhpcy5sYW5nLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZVJlc2l6ZUVkaXRvcjogdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuZGlzYWJsZVJlc2l6ZUVkaXRvciwgZmFsc2UpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2FsbGJhY2tzID0ge1xyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6IChldnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZ0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbkluaXQ6IChldnQ6IGFueSkgPT4ge31cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zZXJ2ZXJJbWdVcCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jYWxsYmFja3Mub25JbWFnZVVwbG9hZCA9IChmaWxlczogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW1hZ2VVcGxvYWQoe2ZpbGVzOiBmaWxlcywgZWRpdGFibGU6IHRoaXMuZWRpdGFibGV9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWcuY2FsbGJhY2tzLm9uTWVkaWFEZWxldGUgPSAodGFyZ2V0OiBbYW55XSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlVXJsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXM6IGFueSA9IHRhcmdldFswXS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tpXS5uYW1lID09IFwic3JjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVVcmwgPSBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lZGlhRGVsZXRlKGZpbGVVcmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwOiBhbnkpID0+IHsgY29uc29sZS5sb2cocmVzcC5qc29uKCkpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBhbnkpID0+IHsgdGhpcy5fZXJySGFuZGxlKGVyci5qc29uKCkpIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmZpbmQoJy5zdW1tZXJub3RlJykuc3VtbWVybm90ZSh0aGlzLl9jb25maWcpO1xyXG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuZmluZCgnLnN1bW1lcm5vdGUnKS5zdW1tZXJub3RlKCdjb2RlJywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uQ2hhbmdlIChfOiBhbnkpIHt9XHJcbiAgICBvblRvdWNoZWQgKCkge31cclxuICAgIHJlZ2lzdGVyT25DaGFuZ2UgKGZuOiBhbnkpIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XHJcbiAgICByZWdpc3Rlck9uVG91Y2hlZCAoZm46IGFueSkgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XHJcbiAgICBfb25DaGFuZ2VDYWxsYmFjayAoXzogYW55KSB7fVxyXG4gICAgX29uVG91Y2hlZENhbGxiYWNrICgpIHt9XHJcbn1cclxuIl19