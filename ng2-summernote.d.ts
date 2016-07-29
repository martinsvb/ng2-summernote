import { ElementRef, EventEmitter, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
export declare class Ng2Summernote {
    private _elementRef;
    private _zone;
    private _http;
    height: number;
    minHeight: number;
    maxHeight: number;
    placeholder: string;
    focus: boolean;
    airMode: boolean;
    dialogsInBody: string;
    editable: boolean;
    lang: string;
    disableResizeEditor: string;
    serverImgUp: boolean;
    config: any;
    /** URL for upload server images */
    hostUpload: string;
    /** Uploaded images server folder */
    uploadFolder: string;
    change: EventEmitter<any>;
    private _config;
    private _value;
    constructor(_elementRef: ElementRef, _zone: NgZone, _http: Http);
    value: any;
    ngAfterViewInit(): void;
    /**
     * Value update process
     */
    updateValue(value: any): void;
    ngOnDestroy(): void;
    private _imageUpload(dataUpload);
    private _mediaDelete(fileUrl);
    /**
     * Set logical varibles from text input values
     *
     * @param any variable, logic varible for setting
     * @param boolean defaultValue, this value will be set if variable is not set
     *
     * @return boolean variable, finally setted variable value
     */
    private _setLogicVars(variable, defaultVal?);
    /**
     * Hanle error in console
     */
    private _errHandle(err);
    /**
     * Implements ControlValueAccessor
     */
    writeValue(value: any): void;
    onChange(_: any): void;
    onTouched(): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    _onChangeCallback(_: any): void;
    _onTouchedCallback(): void;
}
