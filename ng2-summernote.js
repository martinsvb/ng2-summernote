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
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return Ng2Summernote; }),
                    multi: true
                }
            ],
            template: "<div class=\"summernote\"></div>",
        }),
        __param(0, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone, http_1.Http])
    ], Ng2Summernote);
    return Ng2Summernote;
}());
exports.Ng2Summernote = Ng2Summernote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXN1bW1lcm5vdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItc3VtbWVybm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBU08sZUFBZSxDQUFDLENBQUE7QUFDdkIsc0JBQWdDLGdCQUFnQixDQUFDLENBQUE7QUFDakQscUJBQTRDLGVBQWUsQ0FBQyxDQUFBO0FBRTVELFFBQU8sNkJBQTZCLENBQUMsQ0FBQTtBQWdCckM7SUEyQkksdUJBQ2dDLFdBQXVCLEVBQzNDLEtBQWEsRUFDYixLQUFXO1FBRlMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDM0MsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLFVBQUssR0FBTCxLQUFLLENBQU07UUFadkIsb0NBQW9DO1FBQzNCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBRXpCLFdBQU0sR0FBRyxJQUFJLG1CQUFZLEVBQU8sQ0FBQztJQVV4QyxDQUFDO0lBRUosc0JBQUksZ0NBQUs7YUFBVCxjQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDL0IsVUFBVSxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0wsQ0FBQzs7O09BTnVDOztJQVF4Qyx1Q0FBZSxHQUFmLGNBQW9CLENBQUM7SUFFckI7O09BRUc7SUFDSCxtQ0FBVyxHQUFYLFVBQWEsS0FBVTtRQUF2QixpQkFRQztRQVBHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ1gsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFFcEIsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixL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Q29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBOZ1pvbmUsXHJcbiAgSW5qZWN0LFxyXG4gIGZvcndhcmRSZWZcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQge0h0dHAsIEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuXHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdG9Qcm9taXNlJztcclxuXHJcbmRlY2xhcmUgdmFyICQ6IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmcyLXN1bW1lcm5vdGUnLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nMlN1bW1lcm5vdGUpLFxyXG4gICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICB9XHJcbiAgXSxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzdW1tZXJub3RlXCI+PC9kaXY+YCxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBOZzJTdW1tZXJub3RlIHtcclxuXHJcbiAgICBASW5wdXQoKSBoZWlnaHQ6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIG1pbkhlaWdodDogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgbWF4SGVpZ2h0OiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZm9jdXM6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBhaXJNb2RlOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgZGlhbG9nc0luQm9keTogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBsYW5nOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBkaXNhYmxlUmVzaXplRWRpdG9yOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBzZXJ2ZXJJbWdVcDogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIGNvbmZpZzogYW55O1xyXG5cclxuICAgIC8qKiBVUkwgZm9yIHVwbG9hZCBzZXJ2ZXIgaW1hZ2VzICovXHJcbiAgICBASW5wdXQoKSBob3N0VXBsb2FkOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFVwbG9hZGVkIGltYWdlcyBzZXJ2ZXIgZm9sZGVyICovXHJcbiAgICBASW5wdXQoKSB1cGxvYWRGb2xkZXI6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgQE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIHByaXZhdGUgX2NvbmZpZzogYW55O1xyXG5cclxuICAgIHByaXZhdGUgX3ZhbHVlOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIEBJbmplY3QoRWxlbWVudFJlZikgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICBwcml2YXRlIF96b25lOiBOZ1pvbmUsXHJcbiAgICAgICAgcHJpdmF0ZSBfaHR0cDogSHR0cFxyXG4gICAgKSB7fVxyXG5cclxuICAgIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH07XHJcbiAgICBASW5wdXQoKSBzZXQgdmFsdWUodikge1xyXG4gICAgICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHY7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCAoKSB7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFsdWUgdXBkYXRlIHByb2Nlc3NcclxuICAgICAqL1xyXG4gICAgdXBkYXRlVmFsdWUgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3kgKCkge31cclxuXHJcbiAgICBwcml2YXRlIF9pbWFnZVVwbG9hZChkYXRhVXBsb2FkOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YVVwbG9hZC5lZGl0YWJsZSkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImZpbGVcIiwgZGF0YVVwbG9hZC5maWxlc1swXSk7XHJcbiAgICAgICAgICAgIGRhdGEuYXBwZW5kKFwiYWN0aW9uXCIsIFwidXBsb2FkXCIpO1xyXG4gICAgICAgICAgICBkYXRhLmFwcGVuZChcImltYWdlXCIsIFwicmVzaXplTm9UaHVtYlwiKTtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoXCJmb2xkZXJcIiwgdGhpcy51cGxvYWRGb2xkZXIpO1xyXG4gICAgICAgICAgICAkLnBvc3Qoe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB0aGlzLmhvc3RVcGxvYWQsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAodXBsb2FkZWRJbWc6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnNlcnRJbWcgPSAkKCc8aW1nIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgc3JjPVwiJyArIHVwbG9hZGVkSW1nLmRhdGFbMF0uZmlsZU5hbWUgKyAnXCIgLz4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuZmluZCgnLnN1bW1lcm5vdGUnKS5zdW1tZXJub3RlKCdpbnNlcnROb2RlJywgaW5zZXJ0SW1nWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwbG9hZGVkIGltYWdlOiBcIiArIHVwbG9hZGVkSW1nLmRhdGFbMF0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiAoZXJyOiBhbnkpID0+IHsgdGhpcy5fZXJySGFuZGxlKGVycikgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbWVkaWFEZWxldGUoZmlsZVVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IGRhdGE6IGFueSA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgYWN0aW9uOiBcImRlbFwiLFxyXG4gICAgICAgICAgICBmaWxlOiBmaWxlVXJsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xyXG4gICAgICAgICAgICAnQWNjZXB0JzogJyovKicsXHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7aGVhZGVyczogaGVhZGVyc30pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QodGhpcy5ob3N0VXBsb2FkLCBkYXRhLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRvUHJvbWlzZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2U6IGFueSkgPT4gcmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogYW55KSA9PiBQcm9taXNlLnJlamVjdChlcnIubWVzc2FnZSB8fCBlcnIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBsb2dpY2FsIHZhcmlibGVzIGZyb20gdGV4dCBpbnB1dCB2YWx1ZXNcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGFueSB2YXJpYWJsZSwgbG9naWMgdmFyaWJsZSBmb3Igc2V0dGluZ1xyXG4gICAgICogQHBhcmFtIGJvb2xlYW4gZGVmYXVsdFZhbHVlLCB0aGlzIHZhbHVlIHdpbGwgYmUgc2V0IGlmIHZhcmlhYmxlIGlzIG5vdCBzZXRcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiBib29sZWFuIHZhcmlhYmxlLCBmaW5hbGx5IHNldHRlZCB2YXJpYWJsZSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9zZXRMb2dpY1ZhcnModmFyaWFibGU6IGFueSwgZGVmYXVsdFZhbD86IGJvb2xlYW4pIHtcclxuICAgICAgdmFyaWFibGUgPSB0eXBlb2YgdmFyaWFibGUgIT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IGZhbHNlOyBcclxuICAgICAgaWYgKCF2YXJpYWJsZSAmJiBkZWZhdWx0VmFsKSB2YXJpYWJsZSA9IGRlZmF1bHRWYWw7XHJcblxyXG4gICAgICByZXR1cm4gdmFyaWFibGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGFubGUgZXJyb3IgaW4gY29uc29sZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9lcnJIYW5kbGUoZXJyOiBhbnkpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yXCIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvclxyXG4gICAgICovXHJcbiAgICB3cml0ZVZhbHVlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IE51bWJlcih0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVkaXRhYmxlID0gdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuZWRpdGFibGUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sYW5nID0gJC5zdW1tZXJub3RlLmxhbmdbdGhpcy5sYW5nXSA/IHRoaXMubGFuZyA6ICdlbi1VUydcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuY29uZmlnIHx8IHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQgfHwgMjAwLFxyXG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0OiBOdW1iZXIodGhpcy5taW5IZWlnaHQpIHx8IHRoaXMuaGVpZ2h0IHx8IDIwMCxcclxuICAgICAgICAgICAgICAgIG1heEhlaWdodDogTnVtYmVyKHRoaXMubWF4SGVpZ2h0KSB8fCB0aGlzLmhlaWdodCB8fCA1MDAsXHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlciB8fCAnVGV4dC4uLicsXHJcbiAgICAgICAgICAgICAgICBmb2N1czogdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuZm9jdXMsIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGFpck1vZGU6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmFpck1vZGUsIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGRpYWxvZ3NJbkJvZHk6IHRoaXMuX3NldExvZ2ljVmFycyh0aGlzLmRpYWxvZ3NJbkJvZHksIGZhbHNlKSxcclxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlLFxyXG4gICAgICAgICAgICAgICAgbGFuZzogdGhpcy5sYW5nLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZVJlc2l6ZUVkaXRvcjogdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuZGlzYWJsZVJlc2l6ZUVkaXRvciwgZmFsc2UpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuY2FsbGJhY2tzID0ge1xyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6IChldnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZ0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvbkluaXQ6IChldnQ6IGFueSkgPT4ge31cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zZXJ2ZXJJbWdVcCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5jYWxsYmFja3Mub25JbWFnZVVwbG9hZCA9IChmaWxlczogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW1hZ2VVcGxvYWQoe2ZpbGVzOiBmaWxlcywgZWRpdGFibGU6IHRoaXMuZWRpdGFibGV9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25maWcuY2FsbGJhY2tzLm9uTWVkaWFEZWxldGUgPSAodGFyZ2V0OiBbYW55XSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlVXJsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXM6IGFueSA9IHRhcmdldFswXS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tpXS5uYW1lID09IFwic3JjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVVcmwgPSBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lZGlhRGVsZXRlKGZpbGVVcmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwOiBhbnkpID0+IHsgY29uc29sZS5sb2cocmVzcC5qc29uKCkuZGF0YSkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IGFueSkgPT4geyB0aGlzLl9lcnJIYW5kbGUoZXJyKSB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5maW5kKCcuc3VtbWVybm90ZScpLnN1bW1lcm5vdGUodGhpcy5fY29uZmlnKTtcclxuICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmZpbmQoJy5zdW1tZXJub3RlJykuc3VtbWVybm90ZSgnY29kZScsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkNoYW5nZSAoXzogYW55KSB7fVxyXG4gICAgb25Ub3VjaGVkICgpIHt9XHJcbiAgICByZWdpc3Rlck9uQ2hhbmdlIChmbjogYW55KSB7IHRoaXMub25DaGFuZ2UgPSBmbjsgfVxyXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQgKGZuOiBhbnkpIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxyXG4gICAgX29uQ2hhbmdlQ2FsbGJhY2sgKF86IGFueSkge31cclxuICAgIF9vblRvdWNoZWRDYWxsYmFjayAoKSB7fVxyXG59XHJcbiJdfQ==