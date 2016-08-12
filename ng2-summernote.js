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
                    var insertImg = $('<img style="width: 100%;" src="' + uploadedImg.data[0] + '" />');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXN1bW1lcm5vdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItc3VtbWVybm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBVU8sZUFBZSxDQUFDLENBQUE7QUFDdkIsc0JBQWdDLGdCQUFnQixDQUFDLENBQUE7QUFDakQscUJBQTRDLGVBQWUsQ0FBQyxDQUFBO0FBRTVELFFBQU8sNkJBQTZCLENBQUMsQ0FBQTtBQUlyQyxrQ0FBa0M7QUFDbEMsSUFBTSxvQ0FBb0MsR0FBRyxJQUFJLGVBQVEsQ0FDdkQseUJBQWlCLEVBQ2pCO0lBQ0UsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLGFBQWEsRUFBYixDQUFhLENBQUM7SUFDNUMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUNGLENBQUM7QUFRRjtJQTJCSSx1QkFDZ0MsV0FBdUIsRUFDM0MsS0FBYSxFQUNiLEtBQVc7UUFGUyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUMzQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQVp2QixvQ0FBb0M7UUFDM0IsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFFekIsV0FBTSxHQUFHLElBQUksbUJBQVksRUFBTyxDQUFDO0lBVXhDLENBQUM7SUFFSixzQkFBSSxnQ0FBSzthQUFULGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMvQixVQUFVLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDOzs7T0FOdUM7O0lBUXhDLHVDQUFlLEdBQWYsY0FBb0IsQ0FBQztJQUVyQjs7T0FFRztJ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dCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgTmdab25lLFxyXG4gIFByb3ZpZGVyLFxyXG4gIEluamVjdCxcclxuICBmb3J3YXJkUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHtIdHRwLCBIZWFkZXJzLCBSZXF1ZXN0T3B0aW9uc30gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcblxyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XHJcblxyXG5kZWNsYXJlIHZhciAkOiBhbnk7XHJcblxyXG4vLyBDb250cm9sIFZhbHVlIGFjY2Vzc29yIHByb3ZpZGVyXHJcbmNvbnN0IE5HMlNVTU1FUk5PVEVfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUiA9IG5ldyBQcm92aWRlcihcclxuICBOR19WQUxVRV9BQ0NFU1NPUixcclxuICB7XHJcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZzJTdW1tZXJub3RlKSxcclxuICAgIG11bHRpOiB0cnVlXHJcbiAgfVxyXG4pO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZzItc3VtbWVybm90ZScsXHJcbiAgcHJvdmlkZXJzOiBbTkcyU1VNTUVSTk9URV9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SXSxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzdW1tZXJub3RlXCI+PC9kaXY+YCxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZzJTdW1tZXJub3RlIHtcclxuXHJcbiAgICBASW5wdXQoKSBoZWlnaHQ6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIG1pbkhlaWdodDogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgbWF4SGVpZ2h0OiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZm9jdXM6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBhaXJNb2RlOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgZGlhbG9nc0luQm9keTogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBsYW5nOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBkaXNhYmxlUmVzaXplRWRpdG9yOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBzZXJ2ZXJJbWdVcDogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIGNvbmZpZzogYW55O1xyXG5cclxuICAgIC8qKiBVUkwgZm9yIHVwbG9hZCBzZXJ2ZXIgaW1hZ2VzICovXHJcbiAgICBASW5wdXQoKSBob3N0VXBsb2FkOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFVwbG9hZGVkIGltYWdlcyBzZXJ2ZXIgZm9sZGVyICovXHJcbiAgICBASW5wdXQoKSB1cGxvYWRGb2xkZXI6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgQE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIHByaXZhdGUgX2NvbmZpZzogYW55O1xyXG5cclxuICAgIHByaXZhdGUgX3ZhbHVlOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIEBJbmplY3QoRWxlbWVudFJlZikgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF96b25lOiBOZ1pvbmUsXHJcbiAgICAgICAgcHJpdmF0ZSBfaHR0cDogSHR0cFxyXG4gICAgKSB7fVxyXG5cclxuICAgIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH07XHJcbiAgICBASW5wdXQoKSBzZXQgdmFsdWUodikge1xyXG4gICAgICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHY7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCAoKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFsdWUgdXBkYXRlIHByb2Nlc3NcclxuICAgICAqL1xyXG4gICAgdXBkYXRlVmFsdWUgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3kgKCkge31cclxuXHJcbiAgICBwcml2YXRlIF9pbWFnZVVwbG9hZChkYXRhVXBsb2FkOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YVVwbG9hZC5lZGl0YWJsZSkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImZpbGVcIiwgZGF0YVVwbG9hZC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgIGRhdGEuYXBwZW5kKFwiYWN0aW9uXCIsIFwidXBsb2FkXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImZvbGRlclwiLCB0aGlzLnVwbG9hZEZvbGRlcik7XHJcbiAgICAgICAgICAgICQucG9zdCh7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHRoaXMuaG9zdFVwbG9hZCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ICh1cGxvYWRlZEltZzogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluc2VydEltZyA9ICQoJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiBzcmM9XCInK3VwbG9hZGVkSW1nLmRhdGFbMF0rJ1wiIC8+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmZpbmQoJy5zdW1tZXJub3RlJykuc3VtbWVybm90ZSgnaW5zZXJ0Tm9kZScsIGluc2VydEltZ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGxvYWRlZCBpbWFnZTogXCIgKyB1cGxvYWRlZEltZy5kYXRhWzBdKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogKGVycjogYW55KSA9PiB7IHRoaXMuX2VyckhhbmRsZShlcnIpIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21lZGlhRGVsZXRlKGZpbGVVcmw6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBkYXRhOiBhbnkgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIGFjdGlvbjogXCJkZWxcIixcclxuICAgICAgICAgICAgZmlsZTogZmlsZVVybFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcclxuICAgICAgICAgICAgJ0FjY2VwdCc6ICcqLyonLFxyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnM6IGhlYWRlcnN9KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wb3N0KHRoaXMuaG9zdFVwbG9hZCwgZGF0YSwgb3B0aW9ucylcclxuICAgICAgICAgICAgICAgIC50b1Byb21pc2UoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlOiBhbnkpID0+IHJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IGFueSkgPT4gUHJvbWlzZS5yZWplY3QoZXJyLm1lc3NhZ2UgfHwgZXJyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgbG9naWNhbCB2YXJpYmxlcyBmcm9tIHRleHQgaW5wdXQgdmFsdWVzXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBhbnkgdmFyaWFibGUsIGxvZ2ljIHZhcmlibGUgZm9yIHNldHRpbmdcclxuICAgICAqIEBwYXJhbSBib29sZWFuIGRlZmF1bHRWYWx1ZSwgdGhpcyB2YWx1ZSB3aWxsIGJlIHNldCBpZiB2YXJpYWJsZSBpcyBub3Qgc2V0XHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4gYm9vbGVhbiB2YXJpYWJsZSwgZmluYWxseSBzZXR0ZWQgdmFyaWFibGUgdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc2V0TG9naWNWYXJzKHZhcmlhYmxlOiBhbnksIGRlZmF1bHRWYWw/OiBib29sZWFuKSB7XHJcbiAgICAgIHZhcmlhYmxlID0gdHlwZW9mIHZhcmlhYmxlICE9PSAndW5kZWZpbmVkJyA/IHRydWUgOiBmYWxzZTsgXHJcbiAgICAgIGlmICghdmFyaWFibGUgJiYgZGVmYXVsdFZhbCkgdmFyaWFibGUgPSBkZWZhdWx0VmFsO1xyXG5cclxuICAgICAgcmV0dXJuIHZhcmlhYmxlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmxlIGVycm9yIGluIGNvbnNvbGVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZXJySGFuZGxlKGVycjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvclwiKTtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3JcclxuICAgICAqL1xyXG4gICAgd3JpdGVWYWx1ZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBOdW1iZXIodGhpcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lZGl0YWJsZSA9IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmVkaXRhYmxlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubGFuZyA9ICQuc3VtbWVybm90ZS5sYW5nW3RoaXMubGFuZ10gPyB0aGlzLmxhbmcgOiAnZW4tVVMnXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcgPSB0aGlzLmNvbmZpZyB8fCB7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0IHx8IDIwMCxcclxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogTnVtYmVyKHRoaXMubWluSGVpZ2h0KSB8fCB0aGlzLmhlaWdodCB8fCAyMDAsXHJcbiAgICAgICAgICAgICAgICBtYXhIZWlnaHQ6IE51bWJlcih0aGlzLm1heEhlaWdodCkgfHwgdGhpcy5oZWlnaHQgfHwgNTAwLFxyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucGxhY2Vob2xkZXIgfHwgJ1RleHQuLi4nLFxyXG4gICAgICAgICAgICAgICAgZm9jdXM6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmZvY3VzLCBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBhaXJNb2RlOiB0aGlzLl9zZXRMb2dpY1ZhcnModGhpcy5haXJNb2RlLCBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBkaWFsb2dzSW5Cb2R5OiB0aGlzLl9zZXRMb2dpY1ZhcnModGhpcy5kaWFsb2dzSW5Cb2R5LCBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogdGhpcy5lZGl0YWJsZSxcclxuICAgICAgICAgICAgICAgIGxhbmc6IHRoaXMubGFuZyxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVSZXNpemVFZGl0b3I6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmRpc2FibGVSZXNpemVFZGl0b3IsIGZhbHNlKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNhbGxiYWNrcyA9IHtcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAoZXZ0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGV2dCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25Jbml0OiAoZXZ0OiBhbnkpID0+IHt9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2VydmVySW1nVXAgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWcuY2FsbGJhY2tzLm9uSW1hZ2VVcGxvYWQgPSAoZmlsZXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlVXBsb2FkKHtmaWxlczogZmlsZXMsIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNhbGxiYWNrcy5vbk1lZGlhRGVsZXRlID0gKHRhcmdldDogW2FueV0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZVVybDogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzOiBhbnkgPSB0YXJnZXRbMF0uYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbaV0ubmFtZSA9PSBcInNyY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlVXJsID0gYXR0cmlidXRlc1tpXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZWRpYURlbGV0ZShmaWxlVXJsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzcDogYW55KSA9PiB7IGNvbnNvbGUubG9nKHJlc3AuanNvbigpLmRhdGEpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBhbnkpID0+IHsgdGhpcy5fZXJySGFuZGxlKGVycikgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuZmluZCgnLnN1bW1lcm5vdGUnKS5zdW1tZXJub3RlKHRoaXMuX2NvbmZpZyk7XHJcbiAgICAgICAgICAgICQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5maW5kKCcuc3VtbWVybm90ZScpLnN1bW1lcm5vdGUoJ2NvZGUnLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25DaGFuZ2UgKF86IGFueSkge31cclxuICAgIG9uVG91Y2hlZCAoKSB7fVxyXG4gICAgcmVnaXN0ZXJPbkNoYW5nZSAoZm46IGFueSkgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cclxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkIChmbjogYW55KSB7IHRoaXMub25Ub3VjaGVkID0gZm47IH1cclxuICAgIF9vbkNoYW5nZUNhbGxiYWNrIChfOiBhbnkpIHt9XHJcbiAgICBfb25Ub3VjaGVkQ2FsbGJhY2sgKCkge31cclxufVxyXG4iXX0=