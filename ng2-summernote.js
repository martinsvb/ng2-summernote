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
                disableResizeEditor: this._setLogicVars(this.disableResizeEditor, false),
                callbacks: {
                    onChange: function (evt) {
                        _this.updateValue(evt);
                    },
                    onInit: function (evt) { }
                }
            };
            if (typeof this.serverImgUp !== 'undefined') {
                this._config.callbacks = {
                    onImageUpload: function (files) {
                        _this._imageUpload({ files: files, editable: _this.editable });
                    },
                    onMediaDelete: function (target) {
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
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXN1bW1lcm5vdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItc3VtbWVybm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBVU8sZUFBZSxDQUFDLENBQUE7QUFDdkIsc0JBQWdDLGdCQUFnQixDQUFDLENBQUE7QUFDakQscUJBQTRDLGVBQWUsQ0FBQyxDQUFBO0FBRTVELFFBQU8sNkJBQTZCLENBQUMsQ0FBQTtBQUlyQyxrQ0FBa0M7QUFDbEMsSUFBTSxvQ0FBb0MsR0FBRyxJQUFJLGVBQVEsQ0FDdkQseUJBQWlCLEVBQ2pCO0lBQ0UsV0FBVyxFQUFFLGlCQUFVLENBQUMsY0FBTSxPQUFBLGFBQWEsRUFBYixDQUFhLENBQUM7SUFDNUMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUNGLENBQUM7QUFRRjtJQTJCSSx1QkFDZ0MsV0FBdUIsRUFDM0MsS0FBYSxFQUNiLEtBQVc7UUFGUyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUMzQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQVp2QixvQ0FBb0M7UUFDM0IsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFFekIsV0FBTSxHQUFHLElBQUksbUJBQVksRUFBTyxDQUFDO0lBVXhDLENBQUM7SUFFSixzQkFBSSxnQ0FBSzthQUFULGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMvQixVQUFVLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDOzs7T0FOdUM7O0lBUXhDLHVDQUFlLEdBQWYsY0FBb0IsQ0FBQztJQUVyQjs7T0FFRztJ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LENBQUMsQ0FBQztJQUNsRCx5Q0FBaUIsR0FBakIsVUFBbUIsRUFBTyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRCx5Q0FBaUIsR0FBakIsVUFBbUIsQ0FBTSxJQUFHLENBQUM7SUFDN0IsMENBQWtCLEdBQWxCLGNBQXVCLENBQUM7SUF0THhCO1FBQUMsWUFBSyxFQUFFOztpREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztvREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztvREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztzREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztnREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztrREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOzt3REFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOzttREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOzsrQ0FBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOzs4REFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztzREFBQTtJQUNSO1FBQUMsWUFBSyxFQUFFOztpREFBQTtJQUdSO1FBQUMsWUFBSyxFQUFFOztxREFBQTtJQUdSO1FBQUMsWUFBSyxFQUFFOzt1REFBQTtJQUVSO1FBQUMsYUFBTSxFQUFFOztpREFBQTtJQWFUO1FBQUMsWUFBSyxFQUFFOzs4Q0FBQTtJQXhDWjtRQUFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFNBQVMsRUFBRSxDQUFDLG9DQUFvQyxDQUFDO1lBQ2pELFFBQVEsRUFBRSxrQ0FBZ0M7U0FDM0MsQ0FBQzttQkE4Qk8sYUFBTSxDQUFDLGlCQUFVLENBQUM7O3FCQTlCekI7SUEyTEYsb0JBQUM7QUFBRCxDQUFDLEFBekxELElBeUxDO0FBekxZLHFCQUFhLGdCQXlMekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBOZ1pvbmUsXHJcbiAgUHJvdmlkZXIsXHJcbiAgSW5qZWN0LFxyXG4gIGZvcndhcmRSZWZcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQge0h0dHAsIEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuXHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdG9Qcm9taXNlJztcclxuXHJcbmRlY2xhcmUgdmFyICQ6IGFueTtcclxuXHJcbi8vIENvbnRyb2wgVmFsdWUgYWNjZXNzb3IgcHJvdmlkZXJcclxuY29uc3QgTkcyU1VNTUVSTk9URV9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SID0gbmV3IFByb3ZpZGVyKFxyXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gIHtcclxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nMlN1bW1lcm5vdGUpLFxyXG4gICAgbXVsdGk6IHRydWVcclxuICB9XHJcbik7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25nMi1zdW1tZXJub3RlJyxcclxuICBwcm92aWRlcnM6IFtORzJTVU1NRVJOT1RFX0NPTlRST0xfVkFMVUVfQUNDRVNTT1JdLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInN1bW1lcm5vdGVcIj48L2Rpdj5gLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIE5nMlN1bW1lcm5vdGUge1xyXG5cclxuICAgIEBJbnB1dCgpIGhlaWdodDogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgbWluSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBASW5wdXQoKSBtYXhIZWlnaHQ6IG51bWJlcjtcclxuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBmb2N1czogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIGFpck1vZGU6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBkaWFsb2dzSW5Cb2R5OiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBlZGl0YWJsZTogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIGxhbmc6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGRpc2FibGVSZXNpemVFZGl0b3I6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIHNlcnZlckltZ1VwOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgY29uZmlnOiBhbnk7XHJcblxyXG4gICAgLyoqIFVSTCBmb3IgdXBsb2FkIHNlcnZlciBpbWFnZXMgKi9cclxuICAgIEBJbnB1dCgpIGhvc3RVcGxvYWQ6IHN0cmluZztcclxuXHJcbiAgICAvKiogVXBsb2FkZWQgaW1hZ2VzIHNlcnZlciBmb2xkZXIgKi9cclxuICAgIEBJbnB1dCgpIHVwbG9hZEZvbGRlcjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICBAT3V0cHV0KCkgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBhbnk7XHJcblxyXG4gICAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgQEluamVjdChFbGVtZW50UmVmKSBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgICAgIHByaXZhdGUgX3pvbmU6IE5nWm9uZSxcclxuICAgICAgICBwcml2YXRlIF9odHRwOiBIdHRwXHJcbiAgICApIHt9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfTtcclxuICAgIEBJbnB1dCgpIHNldCB2YWx1ZSh2KSB7XHJcbiAgICAgICAgaWYgKHYgIT09IHRoaXMuX3ZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdjtcclxuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmdBZnRlclZpZXdJbml0ICgpIHt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWYWx1ZSB1cGRhdGUgcHJvY2Vzc1xyXG4gICAgICovXHJcbiAgICB1cGRhdGVWYWx1ZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9vblRvdWNoZWRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSAoKSB7fVxyXG5cclxuICAgIHByaXZhdGUgX2ltYWdlVXBsb2FkKGRhdGFVcGxvYWQ6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhVXBsb2FkLmVkaXRhYmxlKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgIGRhdGEuYXBwZW5kKFwiZmlsZVwiLCBkYXRhVXBsb2FkLmZpbGVzWzBdKTtcclxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoXCJhY3Rpb25cIiwgXCJ1cGxvYWRcIik7XHJcbiAgICAgICAgICAgIGRhdGEuYXBwZW5kKFwiZm9sZGVyXCIsIHRoaXMudXBsb2FkRm9sZGVyKTtcclxuICAgICAgICAgICAgJC5wb3N0KHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIHVybDogdGhpcy5ob3N0VXBsb2FkLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogKHVwbG9hZGVkSW1nOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5zZXJ0SW1nID0gJCgnPGltZyBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHNyYz1cIicrdXBsb2FkZWRJbWdbMF0rJ1wiIC8+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmZpbmQoJy5zdW1tZXJub3RlJykuc3VtbWVybm90ZSgnaW5zZXJ0Tm9kZScsIGluc2VydEltZ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGxvYWRlZCBpbWFnZTogXCIgKyB1cGxvYWRlZEltZ1swXSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IChlcnI6IGFueSkgPT4geyB0aGlzLl9lcnJIYW5kbGUoZXJyKSB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tZWRpYURlbGV0ZShmaWxlVXJsOiBzdHJpbmcpIHtcclxuICAgICAgICBsZXQgZGF0YTogYW55ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBhY3Rpb246IFwiZGVsXCIsXHJcbiAgICAgICAgICAgIGZpbGU6IGZpbGVVcmxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgICAgICdBY2NlcHQnOiAnKi8qJyxcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzOiBoZWFkZXJzfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdCh0aGlzLmhvc3RVcGxvYWQsIGRhdGEsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudG9Qcm9taXNlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZTogYW55KSA9PiByZXNwb25zZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBhbnkpID0+IFByb21pc2UucmVqZWN0KGVyci5tZXNzYWdlIHx8IGVycikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGxvZ2ljYWwgdmFyaWJsZXMgZnJvbSB0ZXh0IGlucHV0IHZhbHVlc1xyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gYW55IHZhcmlhYmxlLCBsb2dpYyB2YXJpYmxlIGZvciBzZXR0aW5nXHJcbiAgICAgKiBAcGFyYW0gYm9vbGVhbiBkZWZhdWx0VmFsdWUsIHRoaXMgdmFsdWUgd2lsbCBiZSBzZXQgaWYgdmFyaWFibGUgaXMgbm90IHNldFxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIGJvb2xlYW4gdmFyaWFibGUsIGZpbmFsbHkgc2V0dGVkIHZhcmlhYmxlIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3NldExvZ2ljVmFycyh2YXJpYWJsZTogYW55LCBkZWZhdWx0VmFsPzogYm9vbGVhbikge1xyXG4gICAgICB2YXJpYWJsZSA9IHR5cGVvZiB2YXJpYWJsZSAhPT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogZmFsc2U7IFxyXG4gICAgICBpZiAoIXZhcmlhYmxlICYmIGRlZmF1bHRWYWwpIHZhcmlhYmxlID0gZGVmYXVsdFZhbDtcclxuXHJcbiAgICAgIHJldHVybiB2YXJpYWJsZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5sZSBlcnJvciBpbiBjb25zb2xlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2VyckhhbmRsZShlcnI6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3JcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yXHJcbiAgICAgKi9cclxuICAgIHdyaXRlVmFsdWUgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gTnVtYmVyKHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdGFibGUgPSB0aGlzLl9zZXRMb2dpY1ZhcnModGhpcy5lZGl0YWJsZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxhbmcgPSAkLnN1bW1lcm5vdGUubGFuZ1t0aGlzLmxhbmddID8gdGhpcy5sYW5nIDogJ2VuLVVTJ1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnID0gdGhpcy5jb25maWcgfHwge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCB8fCAyMDAsXHJcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6IE51bWJlcih0aGlzLm1pbkhlaWdodCkgfHwgdGhpcy5oZWlnaHQgfHwgMjAwLFxyXG4gICAgICAgICAgICAgICAgbWF4SGVpZ2h0OiBOdW1iZXIodGhpcy5tYXhIZWlnaHQpIHx8IHRoaXMuaGVpZ2h0IHx8IDUwMCxcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyIHx8ICdUZXh0Li4uJyxcclxuICAgICAgICAgICAgICAgIGZvY3VzOiB0aGlzLl9zZXRMb2dpY1ZhcnModGhpcy5mb2N1cywgZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgYWlyTW9kZTogdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuYWlyTW9kZSwgZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgZGlhbG9nc0luQm9keTogdGhpcy5fc2V0TG9naWNWYXJzKHRoaXMuZGlhbG9nc0luQm9keSwgZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IHRoaXMuZWRpdGFibGUsXHJcbiAgICAgICAgICAgICAgICBsYW5nOiB0aGlzLmxhbmcsXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlUmVzaXplRWRpdG9yOiB0aGlzLl9zZXRMb2dpY1ZhcnModGhpcy5kaXNhYmxlUmVzaXplRWRpdG9yLCBmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogKGV2dDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZ0KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uSW5pdDogKGV2dDogYW55KSA9PiB7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnNlcnZlckltZ1VwICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlnLmNhbGxiYWNrcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBvbkltYWdlVXBsb2FkOiAoZmlsZXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZVVwbG9hZCh7ZmlsZXM6IGZpbGVzLCBlZGl0YWJsZTogdGhpcy5lZGl0YWJsZX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb25NZWRpYURlbGV0ZTogKHRhcmdldDogW2FueV0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVVcmw6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXM6IGFueSA9IHRhcmdldFswXS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2ldLm5hbWUgPT0gXCJzcmNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVVcmwgPSBhdHRyaWJ1dGVzW2ldLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21lZGlhRGVsZXRlKGZpbGVVcmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzcDogYW55KSA9PiB7IGNvbnNvbGUubG9nKHJlc3AuanNvbigpKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnI6IGFueSkgPT4geyB0aGlzLl9lcnJIYW5kbGUoZXJyLmpzb24oKSkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuZmluZCgnLnN1bW1lcm5vdGUnKS5zdW1tZXJub3RlKHRoaXMuX2NvbmZpZyk7XHJcbiAgICAgICAgICAgICQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KS5maW5kKCcuc3VtbWVybm90ZScpLnN1bW1lcm5vdGUoJ2NvZGUnLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25DaGFuZ2UgKF86IGFueSkge31cclxuICAgIG9uVG91Y2hlZCAoKSB7fVxyXG4gICAgcmVnaXN0ZXJPbkNoYW5nZSAoZm46IGFueSkgeyB0aGlzLm9uQ2hhbmdlID0gZm47IH1cclxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkIChmbjogYW55KSB7IHRoaXMub25Ub3VjaGVkID0gZm47IH1cclxuICAgIF9vbkNoYW5nZUNhbGxiYWNrIChfOiBhbnkpIHt9XHJcbiAgICBfb25Ub3VjaGVkQ2FsbGJhY2sgKCkge31cclxufVxyXG4iXX0=