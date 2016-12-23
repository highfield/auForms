;
/**
    MIT License

    Copyright (c) 2016 Mario Vernari

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

/**
    config: array | object
        id: (string)
        label: (string)
        type: (string)
        conv: (string | function)
 */
var AuForms = (function () {
    "use strict";

    //unique-id generator
    var uid = (function () {
        var n = 0;
        return function () {
            return "auform_" + (++n);
        }
    })();


    //viewmodel pseudo-class
    function fviewmodel(fctx) {
        var exp = {};
        var vmx;
        fctx.id = fctx.cfg.id || uid();
        fctx.vm = exp;
        fctx.form._addVM(fctx.cfg.name, exp);

        exp.getId = function () {
            return fctx.id;
        }

        exp.build = function () {
            var fn = fctx.factory.items[fctx.cfg.type];
            vmx = (fn && fn(fctx)) || {};
            vmx && vmx.build && vmx.build();
        }

        exp.render = function (target) {
            vmx && vmx.render && vmx.render(target);
        }

        exp._hchanged = function (sender) {
            if (sender !== fctx.cfg.name && vmx && vmx.conv && _.isArray(fctx.cfg.watch)) {
                if (fctx.cfg.watch.indexOf(sender) >= 0) {
                    vmx.conv.toTarget && vmx.conv.toTarget();
                }
            }
        }

        exp._hvalid = function (valok) {
            fctx.section._hvalid(fctx.id, valok);
        }

        exp.dispose = function () {
            vmx && vmx.dispose && vmx.dispose();
            vmx = null;
            fctx.form._delVM(fctx.cfg.name, exp);
        }

        return exp;
    }


    //section pseudo-class
    function fsection(fctx, sctname) {
        function valUpdate(valok) {
            var dm = {};
            dm.id = sctname + "_valupdate";
            dm.exec = function () {
                fctx.form.validationUpdate && fctx.form.validationUpdate({
                    sctname: sctname,
                    valok: valok
                });
            };
            fctx.form._dispatcher.push(dm);
        }

        var exp = {};
        var vms = [], valids = {}, ovalok = true;

        exp.getName = function () {
            return sctname;
        }

        exp.build = function () {
            //align VMs
            var list = fctx.cfg;
            vms.splice(0);
            for (var i = 0; i < list.length; i++) {
                var vm = fviewmodel({
                    factory: fctx.factory,
                    form: fctx.form,
                    section: exp,
                    cfg: list[i]
                });
                vm.build();
                vms.push(vm);
            }
        }

        exp.render = function (target) {
            vms.forEach(function (vm) {
                vm.render(target);
            });
            valUpdate(ovalok);
        }

        exp.validate = function () {
            return ovalok;
        }

        exp._hchanged = function (sender) {
            vms.forEach(function (vm) {
                vm._hchanged(sender);
            });
        }

        exp._hvalid = function (vmid, valok) {
            //console.log("id=" + vmid + ": ok=" + valok);
            valids[vmid] = valok;
            valok = true;
            for (var k in valids) {
                valok &= valids[k];
            }
            if (valok !== ovalok) {
                ovalok = valok;
                valUpdate(ovalok);
            }
        }

        exp.dispose = function () {
            if (vms) {
                vms.forEach(function (vm) {
                    vm.dispose();
                });
                vms = valids = null;
            }
        }

        return exp;
    }


    //form pseudo-class
    function form(factory) {
        factory = factory || AuForms.JQFactory.get();

        var exp = {};
        var db = {}, odb = {}, prefs = {}, oprefs = {};
        var cfg = {}, sections = {}, vmlookup = {};

        exp._dispatcher = auDispatcher();
        exp.validationUpdate = null;

        exp.setData = function (data) {
            if (_.isArray(data)) throw new Error("Cannot pass an array as argument.");
            odb = data || {};
            exp.resetData();
        }

        exp.resetData = function () {
            db = _.cloneDeep(odb);
            prefs = _.cloneDeep(oprefs);
        }

        exp.getData = function () {
            return db;
        }

        exp.setPrefs = function (data) {
            if (_.isArray(data)) throw new Error("Cannot pass an array as argument.");
            oprefs = data || {};
            exp.resetData();
        }

        exp.getPrefs = function () {
            return prefs;
        }

        exp.setConfig = function (config, sctname) {
            if (sctname) {
                cfg.sections = cfg.sections || {};
                cfg.sections[sctname] = config || {};
            }
            else {
                cfg = config || {};
                cfg.sections = cfg.sections || {};
            }

            //align sections
            for (var k in cfg.sections) {
                sections[k] = sections[k] || fsection({
                    factory: factory,
                    form: exp,
                    cfg: cfg.sections[k]
                }, k);
            }
            for (var k in sections) {
                if (!cfg.sections[k]) {
                    sections[k].dispose();
                    delete sections[k];
                }
            }

            //align data
            exp.setData(db);

            //rebuild involveds
            for (var k in sections) {
                if (!sctname || sctname === k) sections[k].build();
            }
        }

        exp.render = function (target, sctname) {
            if (!target) throw new Error("Must specify a valid rendering target.");
            for (var k in sections) {
                if (!sctname || sctname === k) sections[k].render(target);
            }
        }

        exp.validate = function (sctname) {
            var valok = true;
            for (var k in sections) {
                if (!sctname || sctname === k) valok &= sections[k].validate();
            }
            return valok;
        }

        exp._addVM = function (name, vm) {
            if (name) vmlookup[name] = vm;
        }

        exp._delVM = function (name, vm) {
            if (name) delete vmlookup[name];
        }

        exp._hchanged = function (sender) {
            if (sender) {
                for (var k in sections) {
                    sections[k]._hchanged(sender);
                }
            }
        }

        exp.dispose = function () {
            for (var k in sections) {
                sections[k].dispose();
            }
        }

        return exp;
    }


    var makeButtons = (function () {
        /**
         * utility for allocation/creation of buttons/others, namely for the form footer
            example layout:
            {
                groups: [ (groups) ]
            }

            group:
            {
                items: [ (items) ]
            }

            item:
            {
                type: null | "button"
                elem: (optional) concrete jQuery element to arrange (specify null as type)
                options: object with parameters to build the requested type
            }

            options (button):       (see: https://nakupanda.github.io/bootstrap3-dialog/)
                id: optional, if id is set, you can use dialogInstance.getButton(id) to get the button later.
                label: the label to show as the button caption
                icon: optional, if set, the specified icon will be added to the button.
                cssClass: optional, additional css class to be added to the button.
                autospin: optinal, if it's true, after clicked the button a spinning icon appears.
                action: optional, if provided, the callback will be invoked after the button is clicked, and the dialog instance will be passed to the callback function.

            NOTES:
            - support from 1 up to 4 groups
            - groups are indexed from 0 (rightmost) to N-1 (leftmost)
            - groups are equally spaced to fit all the available width,
                except for a single group, which is right aligned
            - simply use a null for a totally empty group
         */
        function createItem(item, ctx) {
            var itype = item && item.type;
            var options = (item && item.options) || {};
            if (itype === 'button') {
                //create a button
                var btn = $('<button>').attr({
                    type: 'button',
                    id: options.id,
                });
                btn.addClass(options.cssClass || 'btn btn-default');
                if (options.icon) {
                    btn.append($('<span>').addClass(options.icon));
                }
                btn.text(options.label || '');
                if (_.isFunction(options.action)) {
                    btn.click(function () {
                        options.action(btn, item, ctx);
                    });
                }
                return btn;
            }
            else {
                //insert the specified element
                return item && item.elem;
            }
        }


        function createGroup(group, cls, ctx) {
            var ctr = $('<div>').addClass(cls);
            var items = (group && group.items) || [];
            var i = items.length;
            while (--i >= 0) {
                ctr.append(createItem(items[i], ctx));
            }
            return ctr;
        }


        var exp = {};

        exp.create = function (layout, ctx) {
            var ctr = $('<div>').addClass('row');
            var groups = (layout && layout.groups) || [];
            switch (groups.length) {
                case 1:
                    ctr.append(createGroup(groups[0], 'col-xs-12 text-right', ctx));
                    break;

                case 2:
                    ctr.append(createGroup(groups[1], 'col-xs-6', ctx));
                    ctr.append(createGroup(groups[0], 'col-xs-6 text-right', ctx));
                    break;

                case 3:
                    ctr.append(createGroup(groups[2], 'col-xs-4', ctx));
                    ctr.append(createGroup(groups[1], 'col-xs-4 text-center', ctx));
                    ctr.append(createGroup(groups[0], 'col-xs-4 text-right', ctx));
                    break;

                case 4:
                    ctr.append(createGroup(groups[3], 'col-xs-3', ctx));
                    ctr.append(createGroup(groups[2], 'col-xs-3 text-center', ctx));
                    ctr.append(createGroup(groups[1], 'col-xs-3 text-center', ctx));
                    ctr.append(createGroup(groups[0], 'col-xs-3 text-right', ctx));
                    break;
            }
            return ctr;
        }

        return exp;
    })();


    return {
        create: form,
        buttons: makeButtons
    }
})();


AuForms.JQFactory = (function () {
    "use strict";

    /**
     * Converters
     */
    var fconvs = {};

    //base template for converters
    fconvs.base = function (fctx) {
        return {
            target: null,
            toTarget: $.noop(),
            toSource: $.noop()
        }
    }

    //simple text-to-field converter
    fconvs.text = function (fctx) {
        var cv = fconvs.base(fctx);
        cv.toTarget = function () {
            if (fctx.cfg.name && this.target) {
                var v = fctx.form.getData()[fctx.cfg.name] || '';
                this.target.val(v);
            }
        };

        cv.toSource = function () {
            if (fctx.cfg.name && this.target) {
                fctx.form.getData()[fctx.cfg.name] = this.target.val();
            }
        };

        return cv;
    }

    //simple number-to-field converter
    fconvs.number = function (fctx) {
        var cv = fconvs.base(fctx);
        cv.toTarget = function () {
            if (fctx.cfg.name && this.target) {
                var v = fctx.form.getData()[fctx.cfg.name] || 0;
                this.target.val(v);
            }
        };

        cv.toSource = function () {
            if (fctx.cfg.name && this.target) {
                fctx.form.getData()[fctx.cfg.name] = parseFloat(this.target.val());
            }
        };

        return cv;
    }

    //simple checkbox-to-field converter
    fconvs.checkbox = function (fctx) {
        var cv = fconvs.base(fctx);
        cv.toTarget = function () {
            if (fctx.cfg.name && this.target) {
                var v = fctx.form.getData()[fctx.cfg.name];
                this.target.prop('checked', !!v);
            }
        };

        cv.toSource = function () {
            if (fctx.cfg.name && this.target) {
                fctx.form.getData()[fctx.cfg.name] = this.target.prop('checked');
            }
        };

        return cv;
    }

    //simple radio-to-field converter
    fconvs.radio = function (fctx) {
        var cv = fconvs.base(fctx);
        cv.toTarget = function () {
            if (fctx.cfg.name && _.isArray(this.target)) {
                var v = fctx.form.getData()[fctx.cfg.name];
                this.target.forEach(function (t) {
                    t.prop('checked', v == t.val());
                });
            }
        };

        cv.toSource = function () {
            if (fctx.cfg.name && _.isArray(this.target)) {
                var v;
                for (var i = 0; i < this.target.length; i++) {
                    if (this.target[i].prop('checked')) {
                        fctx.form.getData()[fctx.cfg.name] = this.target[i].val();
                        break;
                    }
                }
            }
        };

        return cv;
    }

    //simple select-to-field converter
    fconvs.select = function (fctx) {
        var cv = fconvs.base(fctx);
        cv.toTarget = function () {
            if (fctx.cfg.name && this.target) {
                var v = fctx.form.getData()[fctx.cfg.name] || '';
                this.target.val(v);
            }
        };

        cv.toSource = function () {
            if (fctx.cfg.name && this.target) {
                fctx.form.getData()[fctx.cfg.name] = this.target.val();
            }
        };

        return cv;
    }

    //custom multiselect-to-field converter
    fconvs.multiselect = function (fctx) {
        var cv = fconvs.base(fctx);
        cv.toTarget = function () {
            if (fctx.cfg.name && this.target) {
                var v = fctx.form.getData()[fctx.cfg.name] || [];
                this.target.multiselect('select', v);
            }
        };

        cv.toSource = function () {
            if (fctx.cfg.name && this.target) {
                fctx.form.getData()[fctx.cfg.name] = this.target.val();
            }
        };

        return cv;
    }


    /**
     * Validators
     */
    var fvalids = {};

    //simple "required" validator
    fvalids.required = function (elem, params) {
        if (!params) return true;
        var v = elem.val();
        if (_.isArray(v)) return v.length !== 0;
        return !!(v || "");
    }

    //simple generic-text validator
    fvalids.text = function (elem, params) {
        var s = elem.val() || "";
        //if (!!params.required && s.length === 0) return false;
        var min = params.minlength || 0;
        var max = params.maxlength || 1000000;
        if (s.length < min || s.length > max) return false;
        return true;
    }

    //simple email validator
    fvalids.email = function (elem, params) {
        //see: http://emailregex.com/
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var s = elem.val() || "";
        //if (!params.required && s.length === 0) return true;
        return re.test(s);
    }

    //simple numeric integer value validator
    fvalids.int = function (elem, params) {
        var s = elem.val() || "";
        //if (!!params.required && s.length == 0) return false;
        var n = parseFloat(s);
        if (Number.isNaN(n) || !Number.isFinite(n)) return false;
        if (!Number.isInteger(n)) return false;
        if (_.isNumber(params.min) && n < params.min) return false;
        if (_.isNumber(params.max) && n > params.max) return false;
        return true;
    }

    //simple numeric float value validator
    fvalids.float = function (elem, params) {
        var s = elem.val() || "";
        //if (!!params.required && s.length == 0) return false;
        var n = parseFloat(s);
        if (Number.isNaN(n) || !Number.isFinite(n)) return false;
        if (_.isNumber(params.min) && n < params.min) return false;
        if (_.isNumber(params.max) && n > params.max) return false;
        return true;
    }

    //simple checkbox bool value validator
    fvalids.checked = function (elem, params) {
        if (_.isArray(elem)) {
            var b = false;
            for (var i = 0; i < elem.length; i++) {
                if (elem[i].prop('checked')) {
                    b = true;
                    break;
                }
            }
            return b === !!params;
        }
        else {
            return !elem.prop('checked') === !params;
        }
    }


    /**
     * (ViewModel) items
     */
    var fitems = {};

    //base template for viewmodels
    fitems.base = function (fctx) {

        function valHelp1(key, params, target) {
            if (_.isFunction(params)) {
                return params(target, null);
            }
            else {
                var fn = fvalids[key];
                return fn && fn(target, params);
            }
        }

        function valHelper(obj, target) {
            if (!_.isObject(obj.validate)) return true;
            for (var k in obj.validate) {
                if (!valHelp1(k, obj.validate[k], target)) return false;
            }
            return true;
        }

        function subscribe(target, evtname) {
            var arr = _.isArray(target) ? target : [target];
            arr.forEach(function (t) {
                t.on(evtname, function () {
                    var dm = {};
                    dm.id = fctx.id + "_" + evtname;
                    dm.exec = function () {
                        var valok = valHelper(obj, target);
                        if (valok) {
                            obj.conv.toSource && obj.conv.toSource();
                            //console.log(JSON.stringify(form.getData()));
                            fctx.form._hchanged(fctx.cfg.name);
                        }
                        fctx.vm._hvalid(valok);
                        obj.renderValidate && obj.renderValidate(target, valok);
                    };
                    fctx.form._dispatcher.push(dm);
                });
            });
        }

        var obj = {};

        obj.build = function () {
            var cv = fctx.cfg.conv || fctx.cfg.type;
            if (_.isString(cv)) cv = fconvs[cv];
            obj.conv = cv && cv(fctx);

            obj.validate = fctx.cfg.validate;
        }

        obj.renderCore = null;
        obj.render = function (target) {
            var res = obj.renderCore && obj.renderCore(target);
            if (res) {
                if (obj.conv) {
                    obj.conv.target = res.elemInp;
                    obj.conv.toTarget && obj.conv.toTarget();
                    var valok = valHelper(obj, res.elemInp);
                    fctx.vm._hvalid(valok);
                    obj.renderValidate && obj.renderValidate(res.elemInp, valok);
                    (res.events || []).forEach(function (evtname) {
                        subscribe(res.elemInp, evtname);
                    });
                }
                fctx.form._hchanged(fctx.cfg.name);
            }
        }

        obj.validate = null;
        obj.renderValidate = null;
        return obj;
    }

    //simple boxed text-input viewmodel
    fitems.text = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var ctr = $("<div>").addClass("form-group");
            if (fctx.cfg.label) {
                ctr.append($("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.cfg.label));
            }
            var inp = $("<input>").attr({ type: 'text', id: fctx.id }).addClass('form-control');
            if (fctx.cfg.readonly) inp.attr("readonly", "");
            target.append(ctr.append(inp));

            return {
                elemInp: inp,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            if (valok) {
                target.parent().removeClass('has-error');
            }
            else {
                target.parent().addClass('has-error');
            }
        }
        return obj;
    }

    //simple boxed numeric-input viewmodel
    fitems.number = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var ctr = $("<div>").addClass("form-group");
            if (fctx.cfg.label) {
                ctr.append($("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.cfg.label));
            }
            var inp = $("<input>").attr({ type: 'number', id: fctx.id }).addClass('form-control');
            if (fctx.cfg.readonly) inp.attr("readonly", "");
            target.append(ctr.append(inp));

            return {
                elemInp: inp,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            if (valok) {
                target.parent().removeClass('has-error');
            }
            else {
                target.parent().addClass('has-error');
            }
        }
        return obj;
    }

    //simple checkbox-input viewmodel
    fitems.checkbox = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var outer = $('<div>');
            var inner = $("<div>").addClass("checkbox");
            var inp = $("<input>").attr({ type: 'checkbox', id: fctx.id });
            if (fctx.cfg.readonly) inp.attr("readonly", "");
            $("<label>").appendTo(inner).append(inp).append(fctx.cfg.label);
            target.append(outer.append(inner));

            return {
                elemInp: inp,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            var outer = target.parent().parent();
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }
        return obj;
    }

    //simple checkbox-input viewmodel
    fitems.radio = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var inputs = [];
            var outer = $('<div>');
            if (fctx.cfg.label) {
                $('<label>').addClass('control-label').appendTo(outer).text(fctx.cfg.label);
                $('<div>').addClass('radio hide').appendTo(outer);
            }
            (fctx.cfg.enum || []).forEach(function (kv) {
                var inner = $("<div>").addClass("radio").appendTo(outer);
                var inp = $("<input>").attr({
                    type: 'radio',
                    name: fctx.id + '_' + fctx.cfg.name,
                    id: fctx.id + '_' + kv.key,
                    value: kv.key
                });
                if (fctx.cfg.readonly) inp.attr("readonly", "");
                $("<label>").appendTo(inner).append(inp).append(kv.value);
                //outer.append(inner);
                inputs.push(inp);
            });
            target.append(outer);

            return {
                elemInp: inputs,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            var first = _.isArray(target) ? target[0] : target;
            var outer = first.parent().parent().parent();
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }
        return obj;
    }

    //simple dropdown selector input viewmodel
    fitems.select = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var ctr = $("<div>").addClass("form-group");
            if (fctx.cfg.label) {
                ctr.append($("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.cfg.label));
            }
            var inp = $("<select>").attr({ id: fctx.id }).addClass('form-control');
            if (fctx.cfg.readonly) inp.attr("readonly", "");
            (fctx.cfg.enum || []).forEach(function (kv) {
                $("<option>").attr("value", kv.key).text(kv.value).appendTo(inp);
            });
            target.append(ctr.append(inp));

            return {
                elemInp: inp,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            if (valok) {
                target.parent().removeClass('has-error');
            }
            else {
                target.parent().addClass('has-error');
            }
        }
        return obj;
    }

    //custom dropdown multi-selector input viewmodel
    fitems.multiselect = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var ctr = $("<div>").addClass("form-group");
            if (fctx.cfg.label) {
                ctr.append($("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.cfg.label));
            }
            var inp = $("<select>").attr({ id: fctx.id, multiple: "multiple" }).addClass('form-control');
            if (fctx.cfg.readonly) inp.attr("readonly", "");
            (fctx.cfg.enum || []).forEach(function (kv) {
                $("<option>").attr("value", kv.key).text(kv.value).appendTo(inp);
            });
            target.append(ctr.append(inp));
            inp.multiselect(fctx.cfg.options);

            $('#' + fctx.id).parent().css("display", "block");

            return {
                elemInp: inp,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            var outer = target.parent().parent();
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }

            var btn = target.parent().find('.btn-group > .btn');
            btn.attr("style", "border-color:" + (valok ? 'auto' : "#a94442"));
        }
        return obj;
    }

    //custom dropdown time input viewmodel
    fitems.fg_time = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var ctr = $("<div>").addClass("form-group");
            if (fctx.cfg.label) {
                ctr.append($("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.cfg.label));
            }
            var inp = $("<input>").attr({ type: 'text', id: fctx.id }).addClass('form-control');
            if (fctx.cfg.readonly) inp.attr("readonly", "");
            target.append(ctr.append(inp));
            var opts = _.cloneDeep(fctx.cfg.options || {});
            opts.overlayContainer = target;
            inp.timeDropper(opts);

            return {
                elemInp: inp,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            if (valok) {
                target.parent().removeClass('has-error');
            }
            else {
                target.parent().addClass('has-error');
            }
        }
        return obj;
    }

    //custom dropdown date input viewmodel
    fitems.fg_date = function (fctx) {
        var obj = fitems.base(fctx);
        obj.renderCore = function (target) {
            var ctr = $("<div>").addClass("form-group");
            if (fctx.cfg.label) {
                ctr.append($("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.cfg.label));
            }
            var inp = $("<input>").attr({ type: 'text', id: fctx.id }).addClass('form-control');
            if (fctx.cfg.readonly) inp.attr("readonly", "");
            target.append(ctr.append(inp));
            for (var k in fctx.cfg.options) {
                inp.attr("data-" + k, fctx.cfg.options[k]);
            }
            inp.dateDropper(fctx.cfg.options);

            return {
                elemInp: inp,
                events: ["change", /*"keypress",*/ "blur", "keyup"]
            }
        }

        obj.renderValidate = function (target, valok) {
            if (valok) {
                target.parent().removeClass('has-error');
            }
            else {
                target.parent().addClass('has-error');
            }
        }
        return obj;
    }


    /**
     * Interface
     */
    var exp = {};

    exp.get = function () {
        var obj = {
            valids: {},
            convs: {},
            items: {}
        };
        for (var k in fvalids) obj.valids[k] = fvalids[k];
        for (var k in fconvs) obj.convs[k] = fconvs[k];
        for (var k in fitems) obj.items[k] = fitems[k];
        return obj;
    }

    return exp;
})();
