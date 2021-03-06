﻿import * as types from "utils/types";

export var RESOURCE_PREFIX = "res://";

export function escapeRegexSymbols(source: string): string {
    let escapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    return source.replace(escapeRegex, "\\$&");
}

export function convertString(value: any): any {
    var result;

    if (!types.isString(value)) {
        result = value;
    } else if (value.trim() === "") {
        result = value;
    } else {
        // Try to convert value to number.
        var valueAsNumber = +value;
        if (!isNaN(valueAsNumber)) {
            result = valueAsNumber;
        } else if (value && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
            result = value.toLowerCase() === "true" ? true : false;
        } else {
            result = value;
        }
    }

    return result;
}

export module layout {

    const MODE_SHIFT = 30;
    const MODE_MASK = 0x3 << MODE_SHIFT;

    export const UNSPECIFIED = 0 << MODE_SHIFT;
    export const EXACTLY = 1 << MODE_SHIFT;
    export const AT_MOST = 2 << MODE_SHIFT;

    export const MEASURED_HEIGHT_STATE_SHIFT = 0x00000010; /* 16 */
    export const MEASURED_STATE_TOO_SMALL = 0x01000000;
    export const MEASURED_STATE_MASK = 0xff000000;
    export const MEASURED_SIZE_MASK = 0x00ffffff;

    export function getMode(mode: number): string {
        switch (mode) {
            case layout.EXACTLY:
                return "Exact";

            case layout.AT_MOST:

                return "AtMost";

            default:
                return "Unspecified";
        }
    }

    export function getMeasureSpecMode(spec: number): number {
        return (spec & MODE_MASK);
    }

    export function getMeasureSpecSize(spec: number): number {
        return (spec & ~MODE_MASK);
    }

    export function measureSpecToString(measureSpec: number): string {
        let mode = getMeasureSpecMode(measureSpec);
        let size = getMeasureSpecSize(measureSpec);

        let text = "MeasureSpec: ";

        if (mode === UNSPECIFIED) {
            text += "UNSPECIFIED ";
        }
        else if (mode === EXACTLY) {
            text += "EXACTLY ";
        }
        else if (mode === AT_MOST) {
            text += "AT_MOST ";
        }
        else {
            text += mode + " ";
        }

        text += size;
        return text;
    }
}

export function isFileOrResourcePath(path: string): boolean {
    if (!types.isString(path)) {
        return false;
    }

    return path.indexOf("~/") === 0 ||  // relative to AppRoot
        path.indexOf("/") === 0 ||      // absolute path
        path.indexOf(RESOURCE_PREFIX) === 0;    // resource
}

export function isDataURI(uri: string): boolean {
    if (!types.isString(uri)) {
        return false;
    }

    var firstSegment = uri.trim().split(',')[0];

    return firstSegment && firstSegment.indexOf("data:") === 0 && firstSegment.indexOf('base64') >= 0;
}

export function mergeSort(arr, compareFunc) {
    if (arr.length < 2) {
        return arr;
    }

    let middle = arr.length / 2;
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);

    return merge(mergeSort(left, compareFunc), mergeSort(right, compareFunc), compareFunc);
}

export function merge(left, right, compareFunc) {
    let result = [];
    while(left.length && right.length) {
        if (compareFunc(left[0], right[0]) <= 0) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length) {
        result.push(left.shift());
    }

    while (right.length) {
        result.push(right.shift());
    }

    return result;
}