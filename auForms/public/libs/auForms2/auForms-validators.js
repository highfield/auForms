;
/**
    MIT License

    Copyright (c) 2017 Mario Vernari

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */

AuFormsValidators = (function ($) {
    "use strict";
    var xbag = {};


    //simple "required" validator
    xbag.required = function (vctx, params) {
        if (!params) return true;
        var v = vctx.value;
        if (_.isArray(v)) return v.length !== 0;
        return !!(v || "");
    }


    //simple generic-text validator
    xbag.text = function (vctx, params) {
        var s = vctx.value || "";
        var min = params.min || 0;
        var max = params.max || 1000000;
        if (s.length < min || s.length > max) return false;
        return true;
    }


    //simple email validator
    xbag.email = function (vctx, params) {
        //see: http://emailregex.com/
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var s = vctx.value || "";
        return re.test(s);
    }


    //simple numeric integer value validator
    xbag.int = function (vctx, params) {
        var s = vctx.value || "";
        var n = parseFloat(s);
        if (Number.isNaN(n) || !Number.isFinite(n)) return false;
        if (!Number.isInteger(n)) return false;
        if (_.isNumber(params.min) && n < params.min) return false;
        if (_.isNumber(params.max) && n > params.max) return false;
        return true;
    }


    //simple numeric float value validator
    xbag.float = function (vctx, params) {
        var s = vctx.value || "";
        var n = parseFloat(s);
        if (Number.isNaN(n) || !Number.isFinite(n)) return false;
        if (_.isNumber(params.min) && n < params.min) return false;
        if (_.isNumber(params.max) && n > params.max) return false;
        return true;
    }


    //simple checkbox bool value validator
    xbag.checked = function (vctx, params) {
        return !vctx.value === !params;
    }


    return xbag;
})(jQuery);
