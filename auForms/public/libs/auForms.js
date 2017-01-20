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

/**

 */
var AuForms = (function ($) {
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
        function dispatch(actname, args) {
            var dm = {};
            dm.id = fctx.id + "_" + actname;
            dm.exec = function () {
                var hs = fctx.listeners[fctx.id] || [];
                hs.forEach(function (h) {
                    h(exp, args);
                });
            };
            fctx.dispatcher.push(dm);
        }

        function setVLoc(v, f) {
            if (v === vloc) return;
            vloc = v;
            if (f && fctx.layout.path) {
                _.set(fctx.form.getData(), fctx.layout.path, vloc);
            }
            if (fctx.vmx && fctx.vmx.updateTarget) {
                var vout = (conv && conv.toTarget) ? conv.toTarget(vloc) : vloc;
                fctx.vmx.updateTarget(vloc, vout);
            }
            //exp.updateTarget();
            dispatch('change', null);
        }

        function validHelp1(key, vctx, vdef) {
            var fn = fctx.factory.valids[key];
            return fn && fn(vctx, vdef);
        }

        function validHelper(vctx) {
            var valok = true;
            if (enabEff) {
                var vdefs = fctx.layout.validate;
                if (_.isObject(vdefs)) {
                    for (var k in vdefs) {
                        if (!validHelp1(k, vctx, vdefs[k])) {
                            valok = false;
                            break;
                        }
                    }
                }
            }
            fctx.iform.hvalid(fctx.id, valok);
            fctx.vmx && fctx.vmx.renderValidate && fctx.vmx.renderValidate(valok);
            return valok;
        }

        function enabHelper(e) {
            var p = fctx;
            while (e && (p = p.parent)) {
                e &= p.owner.enabled();
            }
            fctx.vmx && fctx.vmx.renderEnabled && fctx.vmx.renderEnabled(e);
            return e;
        }

        var exp = {}, int = { children: [], props: [] };
        fctx.id = fctx.layout.id || uid();
        fctx.owner = exp;
        fctx.iowner = int;

        var fi = fctx.factory.items[fctx.layout.type];
        fctx.vmx = (fi && fi(fctx)) || {};
        var xdfl = (fctx.vmx && fctx.vmx.defaults) || {};
        var vloc, enab = true, enabEff;

        var fc = fctx.factory.convs[fctx.layout.conv || fctx.layout.type];
        var conv = fc && fc(fctx);  //TODO cosa passare nella funzione?

        exp.getId = function () {
            return fctx.id;
        }

        exp.getParent = function () {
            return fctx.parent && fctx.parent.owner;
        }

        exp.render = function () {
            var tg = fctx.vmx && fctx.vmx.render && fctx.vmx.render();

            //refine common properties
            var margin = fctx.layout.margin || xdfl.margin;// || { top: 15, left: 0, bottom: 15, right: 0 };
            if (margin) {
                tg.css({
                    'margin-top': margin.top || 0,
                    'margin-right': margin.right || 0,
                    'margin-bottom': margin.bottom || 0,
                    'margin-left': margin.left || 0
                });
            }
            if (fctx.layout.halign) {
                tg.css({
                    'text-align': fctx.layout.halign
                });
            }

            //scan children
            var nodes = fctx.layout.nodes || [];
            if (nodes.length && !tg) {
                throw new Error("Undefined container to host child nodes: " + fctx.layout.type);
            }

            for (var i = 0; i < nodes.length; i++) {
                var cfctx = {
                    factory: fctx.factory,
                    dispatcher: fctx.dispatcher,
                    listeners: fctx.listeners,
                    form: fctx.form,
                    iform: fctx.iform,
                    section: fctx.section,
                    parent: fctx,
                    layout: nodes[i],
                    target: tg
                };
                var vm = fviewmodel(cfctx);
                int.children.push(cfctx);
                var ctg = vm.render();
                ctg && fctx.vmx && fctx.vmx.renderChild && fctx.vmx.renderChild(cfctx, ctg);
            }
            return tg;
        }

        exp.load = function () {
            if (fctx.layout.path) {
                var v = _.get(fctx.form.getData(), fctx.layout.path);
                setVLoc(v, false);
            }

            int.props.forEach(function (c) {
                c.owner.load();
            });

            int.children.forEach(function (c) {
                c.owner.load();
            });
        }

        int.load2 = function () {
            enabEff = enabHelper(enab);
            validHelper({ value: vloc });

            int.props.forEach(function (c) {
                c.iowner.load2();
            });
            int.children.forEach(function (c) {
                c.iowner.load2();
            });
        }

        exp.trig = function (args) {
            dispatch('trig', args);
        }

        exp.get = function () {
            return vloc;
        }

        exp.set = function (v) {
            setVLoc(v, true);
        }

        exp.enabled = function (v) {
            if (arguments.length) {
                enab = !!v;
                int.updateEnabled();
            }
            else {
                return enab;
            }
        }

        exp.enableChildren = function (v) {
            int.children.forEach(function (c) {
                c.owner.enabled(v);
            });
        }

        int.updateEnabled = function () {
            enabEff = enabHelper(enab);
            int.props.forEach(function (c) {
                c.iowner.updateEnabled();
            });
            int.children.forEach(function (c) {
                c.iowner.updateEnabled();
            });
            validHelper({ value: vloc });
        }

        exp.dispose = function () {
            fctx.vmx && fctx.vmx.dispose && fctx.vmx.dispose();
            fctx.vmx = null;
            fctx.iform.unreg(fctx);
        }

        int.hevt = function (vctx, e) {
            var dm = {};
            dm.id = fctx.id + "_" + e.type;
            dm.exec = function () {
                var valok = validHelper(vctx);
                if (valok) {
                    var vout = (conv && conv.toSource) ? conv.toSource(vctx.value) : vctx.value;
                    exp.set(vout);
                }
            };
            fctx.dispatcher.push(dm);
        }

        //int.scantree = function (fn) {
        //    fn();
        //    int.children.forEach(function (c) {
        //        c.iowner.scantree(fn);
        //    });
        //}

        fctx.iform.reg(fctx);
        return exp;
    }


    //section pseudo-class
    function fsection(fctx) {
        var exp = {}, int = { children: [] };

        exp.getName = function () {
            return fctx.name;
        }

        exp.render = function () {
            var cfctx = {
                factory: fctx.factory,
                dispatcher: fctx.dispatcher,
                listeners: fctx.listeners,
                form: fctx.form,
                iform: fctx.iform,
                section: exp,
                layout: fctx.layout,
                target: fctx.target
            };
            var vm = fviewmodel(cfctx);
            int.children.push(cfctx);
            vm.render();
        }

        exp.load = function () {
            int.children.forEach(function (c) {
                c.owner.load();
                c.iowner.load2();
            });
        }

        exp.dispose = function () {
            if (int.children) {
                int.children.forEach(function (c) {
                    c.owner.dispose();
                });
                int.children = null;
            }
        }

        return exp;
    }


    //form pseudo-class
    function form(factory) {
        function valUpdate(valok) {
            var dm = {};
            dm.id = "valupdate";
            dm.exec = function () {
                exp.validationUpdate && exp.validationUpdate({
                    valok: valok
                });
            };
            dispatcher.push(dm);
        }

        factory = factory || AuForms.JQFactory.get();

        var exp = {}, int = { lookup: {} };
        var db = {}, odb = {};
        var dataok = false, rendok = false;
        var sections = {}, listeners = {};
        var dispatcher = auDispatcher();
        var valids = {}, ovalok = true;

        exp.validationUpdate = null;

        exp.getFactory = function () {
            return factory;
        }

        exp.setData = function (data) {
            if (!_.isObject(data)) throw new Error("Data must be an object.");
            odb = data || {};
            dataok = true;
            exp.resetData();
        }

        exp.resetData = function () {
            db = _.cloneDeep(odb);
            exp.load();
        }

        exp.getData = function () {
            return db;
        }

        exp.render = function (layout, targets) {
            for (var sct in sections) {
                sections[sct].dispose();
                delete sections[sct];
            }
            for (var sct in layout) {
                var tg = targets[sct];
                if (!tg) throw new Error("Must specify a valid rendering target for: " + sct);
                sections[sct] = fsection({
                    factory: factory,
                    dispatcher: dispatcher,
                    listeners: listeners,
                    form: exp,
                    iform: int,
                    name: sct,
                    layout: layout[sct],
                    target: tg
                });
                sections[sct].render();
            }
            rendok = true;
            exp.load();
        }

        exp.load = function () {
            if (!dataok || !rendok) return;
            for (var k in sections) {
                sections[k].load();
            }
        }

        exp.validate = function () {
            var valok = true;
            for (var k in sections) {
                valok &= sections[k].validate();
            }
            return valok;
        }

        exp.on = function (source, handler) {
            if (!handler || !_.isString(source)) return;
            var asrc = source.split(' ');
            asrc.forEach(function (s) {
                listeners[s] = listeners[s] || [];
                listeners[s].push(handler);
            });
        }

        exp.off = function (source, handler) {
            //TODO
        }

        exp.getNode = function (id) {
            return int.lookup[id].owner;
        }

        exp.dispose = function () {
            for (var k in sections) {
                sections[k].dispose();
            }
        }

        int.reg = function (c) {
            if (c) int.lookup[c.id] = c;
        }

        int.unreg = function (c) {
            if (c) delete int.lookup[c.id];
        }

        int.select = function (fn) {
            var a = [];
            for (var k in int.lookup) {
                var c = int.lookup[k];
                if (!fn || fn(c)) a.push(c);
            }
            return a;
        }

        int.hvalid = function (vmid, valok) {
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

        return exp;
    }


    var buildPropViewmodel = function (fctx, target, propname) {
        var cfctx = {
            factory: fctx.factory,
            dispatcher: fctx.dispatcher,
            listeners: fctx.listeners,
            form: fctx.form,
            iform: fctx.iform,
            section: fctx.section,
            parent: fctx,
            layout: fctx.layout[propname],
            target: target,
            prophost: true
        };
        var vm = fviewmodel(cfctx);
        fctx.iowner.props.push(cfctx);
        return vm;
    }


    var buildFormContainer = function (fctx) {
        var outer = $("<div>").css({
            overflow: 'hidden',
            margin: 0
        }).appendTo(fctx.target);
        if (fctx.layout.bg) {
            outer.addClass(fctx.layout.bg);
        }

        var colh, colc = $('<div>');
        if (fctx.layout.label) colh = $('<div>').appendTo(outer);
        colc.appendTo(outer);
        var inner = $("<div>").attr({ id: fctx.id }).appendTo(colc);
        //if (!fctx.prophost) inner.addClass('form-group');
        if (fctx.layout.glcl) {
            if (colh) {
                colh.addClass('col-md-' + fctx.layout.glcl[0]).css({ margin: 0, padding: 0 });
                colc.addClass('col-md-' + fctx.layout.glcl[1]).css({ margin: 0, padding: 0 });
            }
            else {
                colc.addClass('col-md-' + fctx.layout.glcl[1] + ' col-md-offset-' + fctx.layout.glcl[0]).css({ /*margin: 0,*/ padding: 0 });
            }
        }

        if (fctx.layout.label) {
            if (_.isString(fctx.layout.label)) {
                $("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.layout.label).css({
                    'white-space': 'nowrap',
                    padding: 0
                }).appendTo(colh);
            }
            else {
                var vm = buildPropViewmodel(fctx, colh, 'label');
                var ctg = vm.render();
            }
        }
        return { outer: outer, inner: inner, label: colh };
    }


    var buildFormControl = function (fctx) {
        var outer = $("<div>").css({
            'overflow': 'hidden',
            margin: 0
        }).appendTo(fctx.target);
        if (fctx.layout.bg) {
            outer.addClass(fctx.layout.bg);
        }

        var colh = $('<div>').appendTo(outer), colc = $('<div>').appendTo(outer);
        var inner = $("<div>").appendTo(colc);
        if (!fctx.prophost) inner.addClass('form-group');
        if (fctx.layout.glcl) {
            colh.addClass('col-md-' + fctx.layout.glcl[0]).css({ margin: 0, padding: 0 });
            colc.addClass('col-md-' + fctx.layout.glcl[1]).css({ margin: 0, padding: 0 });
        }

        if (fctx.layout.label) {
            if (_.isString(fctx.layout.label)) {
                $("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.layout.label).css({
                    'white-space': 'nowrap',
                    padding: 0
                }).appendTo(colh);
            }
            else {
                var cfctx = {
                    factory: fctx.factory,
                    dispatcher: fctx.dispatcher,
                    listeners: fctx.listeners,
                    form: fctx.form,
                    iform: fctx.iform,
                    section: fctx.section,
                    parent: fctx,
                    layout: fctx.layout.label,
                    target: colh,
                    prophost: true
                };
                var vm = fviewmodel(cfctx);
                fctx.iowner.props.push(cfctx);
                var ctg = vm.render();
            }
        }
        return { outer: outer, inner: inner, label: colh };
    }


    return {
        create: form,
        helpers: {
            buildPropViewmodel: buildPropViewmodel,
            buildFormContainer: buildFormContainer,
            buildFormControl: buildFormControl
        }
    }
})(jQuery);


AuForms.JQFactory = (function ($) {
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



    /**
     * Validators
     */
    var fvalids = {};

    //simple "required" validator
    fvalids.required = function (vctx, params) {
        if (!params) return true;
        var v = vctx.value;
        if (_.isArray(v)) return v.length !== 0;
        return !!(v || "");
    }

    //simple generic-text validator
    fvalids.text = function (vctx, params) {
        var s = vctx.value || "";
        var min = params.min || 0;
        var max = params.max || 1000000;
        if (s.length < min || s.length > max) return false;
        return true;
    }

    //simple email validator
    fvalids.email = function (vctx, params) {
        //see: http://emailregex.com/
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var s = vctx.value || "";
        return re.test(s);
    }

    //simple numeric integer value validator
    fvalids.int = function (vctx, params) {
        var s = vctx.value || "";
        var n = parseFloat(s);
        if (Number.isNaN(n) || !Number.isFinite(n)) return false;
        if (!Number.isInteger(n)) return false;
        if (_.isNumber(params.min) && n < params.min) return false;
        if (_.isNumber(params.max) && n > params.max) return false;
        return true;
    }

    //simple numeric float value validator
    fvalids.float = function (vctx, params) {
        var s = vctx.value || "";
        var n = parseFloat(s);
        if (Number.isNaN(n) || !Number.isFinite(n)) return false;
        if (_.isNumber(params.min) && n < params.min) return false;
        if (_.isNumber(params.max) && n > params.max) return false;
        return true;
    }

    //simple checkbox bool value validator
    fvalids.checked = function (vctx, params) {
        return !vctx.value === !params;
    }


    /**
     * (ViewModel) items
     */
    var fitems = {};

    fitems.hstack = function (fctx) {
        var exp = {}, outer;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormContainer(fctx);
            outer = ctl.outer;
            if (ctl.label) {
                ctl.label.css({
                    display: 'block',
                    'margin': '0px 0px 5px 0px'
                });
            }
            //var tg = $('<div>').css({
            //    id: fctx.id,
            //}).appendTo(fctx.target);
            return ctl.inner;
        }

        exp.renderChild = function (cfctx, ctg) {
            ctg.css({
                display: 'inline'
            }).parent().css({
                display: 'inline'
            }).parent().css({
                display: 'inline'
            });
        }

        return exp;
    }


    fitems.vstack = function (fctx) {
        var exp = {}, outer;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormContainer(fctx);
            outer = ctl.outer;
            if (ctl.label) {
                ctl.label.css({
                    display: 'block',
                    'margin': '0px 0px 5px 0px'
                });
            }
            //var tg = $('<div>').css({
            //    id: fctx.id,
            //}).appendTo(fctx.target);
            return ctl.inner;
        }

        exp.renderChild = function (cfctx, ctg) {
            ctg.css({
                display: 'block'
            });
        }

        return exp;
    }


    fitems['grid-layout'] = function (fctx) {
        var exp = {}, outer;

        exp.defaults = {};
        exp.defaults.margin = { top: -15, right: 0, bottom: 0, left: 0 };

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormContainer(fctx);
            outer = ctl.outer;
            ctl.inner.addClass('row');
            if (ctl.label) {
                ctl.label.css({
                    display: 'block',
                    'margin': '0px 0px 5px 0px'
                });
            }
            //var tg = $('<div>').addClass('row').css({
            //    id: fctx.id
            //}).appendTo(fctx.target);
            //if (fctx.layout.label) {
            //    $("<label>").addClass('control-label').attr({ for: fctx.id }).text(fctx.layout.label).css({
            //        display: 'block',
            //        'margin-top': 15,
            //        'margin-bottom': -10
            //    }).appendTo(tg);
            //}
            return ctl.inner;
        }

        exp.renderChild = function (cfctx, ctg) {
            ctg.addClass('col-xs-' + cfctx.layout['gl-col']).css({
                'padding': 0,
                'margin': '15px 0px 0px 0px'
            });
        }

        return exp;
    }


    fitems.panel = function (fctx) {
        var exp = {}, outer;

        exp.render = function () {
            outer = $('<div>').addClass('panel').appendTo(fctx.target);
            outer.addClass(fctx.layout.bg || 'panel-default');

            if (fctx.layout.header) {
                if (_.isString(fctx.layout.header)) {
                    var h = $('<div>').addClass('panel-heading').appendTo(outer);
                    $('<h3>').addClass('panel-title').text(fctx.layout.header).appendTo(h);
                }
                else if (fctx.layout.header) {
                    var h = $('<div>').addClass('panel-heading').appendTo(outer);
                    var vm = AuForms.helpers.buildPropViewmodel(fctx, h, 'header');
                    //var cfctx = {
                    //    factory: fctx.factory,
                    //    dispatcher: fctx.dispatcher,
                    //    listeners: fctx.listeners,
                    //    form: fctx.form,
                    //    iform: fctx.iform,
                    //    section: fctx.section,
                    //    parent: fctx.owner,
                    //    layout: fctx.layout.header,
                    //    target: h,
                    //    prophost: true
                    //};
                    //var vm = fviewmodel(cfctx);
                    //fctx.iowner.propvms.push(vm);
                    var ctg = vm.render();
                }
            }
            var inner = $('<div>').addClass('panel-body').appendTo(outer);
            return inner;
        }

        exp.renderChild = function (cfctx, ctg) {
            ctg.css({
                display: 'block'
            });
        }

        return exp;
    }


    //simple text-block viewmodel
    fitems.textblock = function (fctx) {
        var exp = {}, outer, inp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            inp = $("<p>").attr({ id: fctx.id }).addClass('form-control-static').appendTo(ctl.inner);
            if (fctx.layout.text) inp.text(fctx.layout.text);
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                inp.css('opacity', '');
            }
            else {
                inp.css('opacity', 0.5);
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.text(vusr);
        }

        return exp;
    }


    //simple boxed text-input viewmodel
    fitems.textbox = function (fctx) {
        var exp = {}, outer, inp, grp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            grp = $('<div>').appendTo(ctl.inner);
            if (fctx.layout.pre) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(fctx.layout.pre).appendTo(grp);
            }
            inp = $("<input>").attr({ type: 'text', id: fctx.id }).addClass('form-control').appendTo(grp);
            if (fctx.layout.readonly) inp.attr("readonly", "");
            if (fctx.layout.post) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(fctx.layout.post).appendTo(grp);
            }

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: $(this).val()
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                inp.attr('disabled', null);
                grp.css('opacity', '');
            }
            else {
                inp.attr('disabled', '');
                grp.css('opacity', 0.5);
            }
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.val(vusr);
        }

        return exp;
    }


    //simple boxed numeric-input viewmodel
    fitems.numbox = function (fctx) {
        var exp = {}, outer, inp, grp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            grp = $('<div>').appendTo(ctl.inner);
            if (fctx.layout.pre) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(fctx.layout.pre).appendTo(grp);
            }
            inp = $("<input>").attr({ type: 'number', id: fctx.id }).addClass('form-control').appendTo(grp);
            if (fctx.layout.readonly) inp.attr("readonly", "");
            if (fctx.layout.post) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(fctx.layout.post).appendTo(grp);
            }

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: $(this).val()
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                inp.attr('disabled', null);
                grp.css('opacity', '');
            }
            else {
                inp.attr('disabled', '');
                grp.css('opacity', 0.5);
            }
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.val(vusr);
        }

        return exp;
    }


    //simple boxed text-area viewmodel
    fitems.textarea = function (fctx) {
        var exp = {}, outer, inp, grp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            grp = $('<div>').appendTo(ctl.inner);
            if (fctx.layout.pre) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(fctx.layout.pre).appendTo(grp);
            }
            inp = $("<textarea>").attr({ type: 'text', id: fctx.id }).addClass('form-control').appendTo(grp);
            if (fctx.layout.readonly) inp.attr("readonly", "");
            if (fctx.layout.post) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(fctx.layout.post).appendTo(grp);
            }

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: $(this).val()
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                inp.attr('disabled', null);
                grp.css('opacity', '');
            }
            else {
                inp.attr('disabled', '');
                grp.css('opacity', 0.5);
            }
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.val(vusr);
        }

        return exp;
    }


    //simple checkbox-input viewmodel
    fitems.checkbox = function (fctx) {
        var exp = {}, outer, inp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            var inner = $("<div>").addClass("checkbox").css({
                'margin-top': 0
            }).appendTo(ctl.inner);
            inp = $("<input>").attr({ type: 'checkbox', id: fctx.id }).css({
                'margin-left': 0
            }).appendTo(inner);
            if (fctx.layout.readonly) inp.attr("readonly", "");

            var span;
            if (fctx.layout.text) {
                span = $('<span>').text(fctx.layout.text).css({
                    'margin-left': 20
                }).appendTo(inner);
            }
            if (inp.prettyCheckable) {
                inp.prettyCheckable();
                inner.css('margin-top', 3);
                ctl.inner.css('margin-bottom', 10);
                if (span) {
                    span.css({
                        'margin-left': 5,
                        position: 'absolute',
                        top: 5
                    });
                }
            }

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: !!$(this).prop('checked')
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (inp.prettyCheckable) {
                inp.prettyCheckable(e ? 'enable' : 'disable');
            }
            else {
                inp.attr('disabled', e ? null : '');
            }
            inp.closest('.checkbox').css('opacity', e ? '' : 0.5);
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            if (inp.prettyCheckable) {
                inp.prettyCheckable(vusr ? 'check' : 'uncheck');
            }
            else {
                inp.prop('checked', !!vusr);
            }
        }

        return exp;
    }


    //simple radio-buttons input viewmodel
    fitems.radio = function (fctx) {
        function getter(c, e) {
            var vctx = { value: null };
            var arr = c.vmx.getInputs();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].prop('checked')) {
                    vctx.value = arr[i].val();
                    break;
                }
            }
            c.iowner.hevt(vctx, e);
        }

        var exp = {}, outer, inputs;

        exp.getInputs = function () {
            return inputs;
        }

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            inputs = [];
            var opts = fctx.layout.enum || [];
            if (opts.length) {
                opts.forEach(function (opt) {
                    var inner = $("<div>").addClass("radio").appendTo(ctl.inner);
                    var inp = $("<input>").attr({
                        type: 'radio',
                        name: fctx.layout.group || (fctx.id + '_' + fctx.layout.name),
                        id: fctx.id + '_' + opt.key,
                        value: opt.key
                    });
                    if (fctx.layout.readonly) inp.attr("readonly", "");
                    var label = $("<label>").appendTo(inner).append(inp);
                    var span = $('<span>').text(opt.value).css({
                        'margin-left': 20
                    }).appendTo(label);

                    var f = fctx.layout.font;
                    if (f) {
                        if (f.bold === false) {
                            span.css('font-weight', 400);
                        }
                        else if (f.bold === true) {
                            span.css('font-weight', 700);
                        }
                    }

                    if (inp.prettyCheckable) {
                        inp.prettyCheckable();
                        label.css('padding-left', 0);
                        inner.css({
                            'margin-top': 0,
                            'margin-bottom': 0
                        });
                        span.css({
                            'margin-left': 5,
                            position: 'absolute',
                            top: 5
                        });
                    }
                    inputs.push(inp);
                });
            }

            inputs.forEach(function (inp) {
                inp.on('change blur keyup', function (e) {
                    if (fctx.layout.group) {
                        var arr = fctx.iform.select(function (c) {
                            return c.layout.group === fctx.layout.group;
                        });
                        arr.forEach(function (c) {
                            getter(c, e);
                        });
                    }
                    else {
                        getter(fctx, e);
                        //var vctx = { value: null };
                        //for (var i = 0; i < inputs.length; i++) {
                        //    if (inputs[i].prop('checked')) {
                        //        vctx.value = inputs[i].val();
                        //        break;
                        //    }
                        //}
                        //fctx.iowner.hevt(vctx, e);
                    }
                });
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            inputs.forEach(function (inp) {
                if (inp.prettyCheckable) {
                    inp.prettyCheckable(e ? 'enable' : 'disable');
                }
                else {
                    inp.attr('disabled', e ? null : '');
                }
                inp.closest('.radio').css('opacity', e ? '' : 0.5);
            });
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inputs.forEach(function (inp) {
                if (inp.prettyCheckable) {
                    inp.prettyCheckable(vusr == inp.val() ? 'check' : 'uncheck');
                }
                else {
                    inp.prop('checked', vusr == inp.val());
                }
            });
        }

        return exp;
    }


    //simple dropdown selector input viewmodel
    fitems.select = function (fctx) {
        var exp = {}, outer, inp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            inp = $("<select>").attr({ id: fctx.id }).addClass('form-control').appendTo(ctl.inner);
            if (fctx.layout.readonly) inp.attr("readonly", "");
            (fctx.layout.enum || []).forEach(function (opt) {
                $("<option>").attr("value", opt.key).text(opt.value).appendTo(inp);
            });

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: $(this).val()
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                inp.attr('disabled', null);
                inp.css('opacity', '');
            }
            else {
                inp.attr('disabled', '');
                inp.css('opacity', 0.5);
            }
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.val(vusr);
        }

        return exp;
    }


    //custom multiselect-to-field converter
    fitems.multiselect = function (fctx) {
        var exp = {}, outer, inp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            inp = $("<select>").addClass('form-control').attr({
                id: fctx.id,
                multiple: "multiple"
            }).appendTo(ctl.inner);
            if (fctx.layout.readonly) inp.attr("readonly", "");
            (fctx.layout.enum || []).forEach(function (opt) {
                $("<option>").attr("value", opt.key).text(opt.value).appendTo(inp);
            });
            var opts = _.cloneDeep(fctx.layout.options || {});
            opts.onInitialized = function (s, c) {
                c.parent().css("display", "block");
                var ul = c.find('.multiselect-container').css({
                    'position': 'relative',
                    float: 'none',
                    'margin-top': 36,
                    'padding': '10px 0px'
                });
                ul.find('li').css({
                    'margin': '3px 0px'
                });
            }
            inp.multiselect(opts);

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: $(this).val()
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            inp.multiselect(e ? 'enable' : 'disable');
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
            var btn = outer.find('.btn-group > .btn');
            btn.attr("style", "border-color:" + (valok ? 'auto' : "#a94442"));
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.multiselect('select', vusr);
        }

        return exp;
    }


    //custom dropdown time input viewmodel
    fitems.fgtime = function (fctx) {
        var exp = {}, outer, inp, grp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            grp = $('<div>').addClass('input-group').appendTo(ctl.inner);
            inp = $("<input>").attr({ type: 'text', id: fctx.id }).addClass('form-control fg-mv-picker').appendTo(grp);
            if (fctx.layout.readonly) inp.attr("readonly", "");
            $('<span>').addClass('input-group-addon glyphicon glyphicon-time').css({
                top: 0,
                'font-size': '1.2em'
            }).appendTo(grp);

            var opts = _.cloneDeep(fctx.layout.options || {});
            inp.timeDropper(opts);

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: $(this).val()
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                inp.attr('disabled', null);
                grp.css('opacity', '');
            }
            else {
                inp.attr('disabled', '');
                grp.css('opacity', 0.5);
            }
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.val(vusr);
        }

        return exp;
    }


    //custom dropdown time input viewmodel
    fitems.fgdate = function (fctx) {
        var exp = {}, outer, inp, grp;

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            grp = $('<div>').addClass('input-group').appendTo(ctl.inner);
            inp = $("<input>").attr({ type: 'text', id: fctx.id }).addClass('form-control fg-mv-picker').appendTo(grp);
            //if (fctx.layout.readonly) inp.attr("readonly", "");
            $('<span>').addClass('input-group-addon glyphicon glyphicon-calendar').css({
                top: 0,
                'font-size': '1.2em'
            }).appendTo(grp);

            for (var k in fctx.layout.options) {
                inp.attr("data-" + k, fctx.layout.options[k]);
            }
            inp.dateDropper(fctx.layout.options);

            inp.on('change blur keyup', function (e) {
                var vctx = {
                    value: $(this).val()
                };
                fctx.iowner.hevt(vctx, e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                inp.attr('disabled', null);
                grp.css('opacity', '');
            }
            else {
                inp.attr('disabled', '');
                grp.css('opacity', 0.5);
            }
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            inp.val(vusr);
        }

        return exp;
    }


    //custom button viewmodel
    fitems.button = function (fctx) {
        var exp = {}, outer;

        exp.defaults = {};
        exp.defaults.margin = { top: 0, right: 0, bottom: 0, left: 0 };

        exp.render = function () {
            outer = $('<button>').attr({
                type: 'button',
                id: fctx.id,
            }).appendTo(fctx.target);

            outer.addClass(fctx.layout.cssClass || 'btn btn-default');

            var icon, label;
            if (fctx.layout.icon) icon = $('<span>').addClass(fctx.layout.icon).appendTo(outer);
            if (fctx.layout.label) label = $('<span>').text(fctx.layout.label);
            if (label && icon) {
                $('<div>').addClass('visible-md-inline-block visible-lg-inline-block').append(label).css({
                    'margin-left': 4
                }).appendTo(outer);
            }
            else if (label) {
                label.appendTo(outer);
            }

            outer.click(function (e) {
                fctx.owner.trig(e);
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                outer.attr('disabled', null);
            }
            else {
                outer.attr('disabled', '');
            }
        }

        return exp;
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
})(jQuery);
