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
            dispatch('change', {});
        }

        function validHelp1(key, vctx, vdef) {
            var fn = fctx.factory.valids[key];
            return fn && fn(vctx, vdef);
        }

        function validHelper(vctx) {
            var valok = true;
            if (enabEff && dispEff) {
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

        function dispHelper(e) {
            var p = fctx;
            while (e && (p = p.parent)) {
                e &= p.owner.display();
            }
            fctx.vmx && fctx.vmx.renderDisplay && fctx.vmx.renderDisplay(e);
            return e;
        }

        var exp = {}, int = { children: [], props: [] };
        fctx.id = fctx.layout.id || uid();
        fctx.owner = exp;
        fctx.iowner = int;

        var fi = fctx.factory.items[fctx.layout.type];
        fctx.vmx = (fi && fi(fctx)) || {};
        var xdfl = (fctx.vmx && fctx.vmx.defaults) || {};
        var vloc, enab = true, enabEff, disp = true, dispEff;

        var fc = fctx.factory.convs[fctx.layout.conv || fctx.layout.type];
        var conv = fc && fc(fctx);  //TODO cosa passare nella funzione?

        exp.getId = function () {
            return fctx.id;
        }

        exp.getParent = function () {
            return fctx.parent && fctx.parent.owner;
        }

        exp.getVM = function () {
            return fctx.vmx;
        }

        exp.getLayout = function () {
            return fctx.layout;
        }

        exp.getController = function () {
            return fctx.datactl;
        }

        exp.setController = function (dc) {
            fctx.datactl = dc;
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
            fctx.vmx && fctx.vmx.onload && fctx.vmx.onload();
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
            dispEff = dispHelper(disp);
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

        exp.display = function (v) {
            if (arguments.length) {
                disp = !!v;
                int.updateDisplay();
            }
            else {
                return disp;
            }
        }

        int.updateDisplay = function () {
            dispEff = dispHelper(disp);
            int.props.forEach(function (c) {
                c.iowner.updateDisplay();
            });
            int.children.forEach(function (c) {
                c.iowner.updateDisplay();
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
        var dispatcher = AuDispatcher();
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
            var c = int.lookup[id];
            return c && c.owner;
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


    function dialog(options) {
        function trigResize() {
            var dm = {};
            dm.id = 'resize';
            dm.exec = function () {
                hresize();
            };
            dispatcher.push(dm);
        }

        function hresize() {
            if (sizey) {
                var wh = $(window).height();
                var ah = wh * sizey / 100;
                console.log('wh=' + wh + '; ah=' + ah);

                var mh = dlg.getModalHeader();
                var mf = dlg.getModalFooter();
                var bh = ah - mh.height() - mf.height() - 60;
                //console.log('mh=' + mh.height() + '; mf=' + mf.height());

                var md = dlg.getModalDialog();
                md.css({
                    'height': ah,
                    'margin-top': (wh - ah) / 2,
                    'margin-bottom': (wh - ah) / 2,
                });

                var mb = dlg.getModalBody().css({
                    'height': bh
                });
                mb.find('.bootstrap-dialog-body').css({
                    'height': '100%'
                });
                mb.find('.bootstrap-dialog-message').css({
                    'height': '100%',
                    'overflow-y': 'auto'
                });
            }
        }

        options = options || {
            closable: true
        };

        var exp = {
            body: $('<div>'),
            header: null,
            footer: null,
        }

        var dispatcher = AuDispatcher();
        var sizex, sizey, opened;

        if (_.isString(options.sizex)) {
            if (options.sizex.substring(0, 5) === 'size-') {
                options.size = options.sizex;
            }
            else {
                sizex = options.sizex;
            }
        }
        if (_.isString(options.sizey)) {
            var l = options.sizey.length;
            if (l >= 2 && options.sizey[l - 1] === '%') {
                sizey = parseInt(options.sizey.substring(0, l - 1));
            }
        }

        options.message = function (dref) {
            return exp.body;
        }

        options.onshown = function (dref) {
            trigResize();
        }

        options.onhidden = function (dref) {
            exp.close();
        }

        var dlg = new BootstrapDialog(options);
        dlg.realize();

        var h = dlg.getModalHeader();
        h.show();
        exp.header = $('<div>').addClass('au-dialog-header').appendTo(h.find('.bootstrap-dialog-header'));
        if (options.closable === false) {
            exp.header.css({
                width: '100%'
            });
        }

        var f = dlg.getModalFooter();
        f.show();
        exp.footer = f.find('.bootstrap-dialog-footer');

        exp.open = function () {
            if (!dlg || opened) return;
            opened = true;
            if (exp.header.children().length) dlg.setTitle('');
            if (sizex || sizey) $(window).on('resize', trigResize);
            dlg.open();
        }

        exp.close = function () {
            if (dlg) {
                if (opened) {
                    if (sizex || sizey) $(window).off('resize', trigResize);
                    dlg.close();
                    opened = false;
                    console.log('close');
                }
                dlg = null;
            }
        }

        return exp;
    }


    function wizard(form, cfg) {
        function update() {
            var p = getPage(pgid);
            cfg.pages.forEach(function (z) {
                var n = form.getNode(z.id);
                if (n) n.display(p && z.id === pgid);
            });

            if (cfg.prev) {
                var n = form.getNode(cfg.prev);
                if (n) n.enabled(p && !!p.prev);
            }
            if (cfg.next) {
                var n = form.getNode(cfg.next);
                if (n) n.enabled(p && !!p.next && valok);
            }
            if (cfg.submit) {
                var n = form.getNode(cfg.submit);
                if (n) n.enabled(p && !!p.submit && valok);
            }
            if (cfg.selector && p && p.pill) {
                var n = form.getNode(cfg.selector);
                if (n) {
                    var vm = n.getVM();
                    vm.getKeys().forEach(function (k) {
                        var sts = vm.getStatus(k);
                        sts.enabled = sts.active = sts.error = sts.success = false;
                        seq.forEach(function (id) {
                            var p = getPage(id);
                            if (p.pill === k) {
                                sts.enabled = true;
                                if (id === pgid) {
                                    sts.active = true;
                                    if (!valok) sts.error = true;
                                }
                            }
                        });
                        if (sts.enabled && !sts.active && !sts.error) sts.success = true;
                    });
                    vm.updateTarget();
                }
            }
        }

        function getPage(id) {
            if (!_.isString(id)) return null;
            for (var i = 0; i < cfg.pages.length; i++) {
                if (cfg.pages[i].id === id) return cfg.pages[i];
            }
        }

        cfg = cfg || {};
        cfg.pages = cfg.pages || [];

        if (cfg.prev) {
            form.on(cfg.prev, function (sender, args) {
                var p = getPage(pgid);
                var x0 = seq.indexOf(pgid);
                var a = {
                    id: getPage(p.prev) && p.prev,
                    trim: false
                };

                if (!a.id) {
                    a.id = pgid;
                    exp.onPrev && exp.onPrev(a);
                }
                if (a.id) {
                    a.x1 = seq.indexOf(a.id);
                    if (a.x1 < 0 || x0 <= a.x1) a.id = null;
                }
                if (a.id && a.trim) seq.splice(a.x1 + 1);
                if (a.id) {
                    pgid = a.id;
                    update();
                }
            });
        }
        if (cfg.next) {
            form.on(cfg.next, function (sender, args) {
                var p = getPage(pgid);
                var x0 = seq.indexOf(pgid);
                var a = {
                    id: getPage(p.next) && p.next,
                    trim: false
                };

                if (!a.id) {
                    a.id = pgid;
                    exp.onNext && exp.onNext(a);
                }
                if (a.id) {
                    a.x1 = seq.indexOf(a.id);
                    if (a.x1 >= 0 && x0 >= a.x1) {
                        a.id = null;
                    }
                    else if (a.x1 >= 0 && a.x1 > x0 + 1) {
                        a.trim = true;
                    }
                }
                if (a.id && a.trim) seq.splice(x0 + 1);

                if (a.id) {
                    pgid = a.id;
                    if (seq.indexOf(a.id) < 0) seq.push(a.id);
                    update();
                }
            });
        }
        if (cfg.selector) {
            form.on(cfg.selector, function (sender, args) {
                var x0 = seq.indexOf(pgid);

                var x1 = -1, id;
                for (var i = 0; i < seq.length; i++) {
                    var p = getPage(seq[i]);
                    if (p.pill === args.key) {
                        x1 = i;
                        id = p.id;
                        break;
                    }
                }

                if (x1 === x0) return;
                if (x1 < x0) {
                    pgid = id;
                    update();
                }
                else {
                    var n = form.getNode(cfg.selector);
                    var vm = n.getVM();
                    var sts = vm.getStatus(args.key);
                    if (!sts.enabled || sts.error) return;
                    pgid = id;
                    update();
                }
            });
        }

        var pgid, valok = true, seq = [];
        var exp = {};

        exp.getPageId = function () {
            return pgid;
        }

        exp.start = function (id) {
            if (!pgid && getPage(id)) {
                pgid = id;
                seq.push(id);
                update();
            }
        }

        exp.onPrev = $.noop;
        exp.onNext = $.noop;

        exp.setValid = function (v) {
            valok = v;
            update();
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


    function ajaxController(url) {
        var exp = {};

        exp.onFilter = $.noop;

        exp.load = function (filter) {
            exp.onFilter(filter);
            return $.ajax({
                type: "GET",
                url: url,
                data: filter,
                dataType: 'json'
            });
            //var $request = $.ajax(params);
            //$request.done(this.ls.done);
            //$request.fail(this.ls.fail);
            //return $request;
        }

        return exp;
    }


    return {
        create: form,
        dialog: dialog,
        wizard: wizard,
        controllers: {
            ajax: ajaxController
        },
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

            if (fctx.layout.halign) {
                outer.parent().css({
                    'text-align': fctx.layout.halign
                });
            }
            //var tg = $('<div>').css({
            //    id: fctx.id,
            //}).appendTo(fctx.target);
            return ctl.inner;
        }

        exp.renderChild = function (cfctx, ctg) {
            cfctx.desDisplay = 'inline';
            ctg.css({
                display: 'inline'
            }).parent().css({
                display: 'inline'
            }).parent().css({
                //display: 'inline'
            });
        }

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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
            cfctx.desDisplay = 'block';
            ctg.css({
                //display: 'block'
            });
        }

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
            //console.log("disp=" + outer.css('display'))
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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


    //enhanced dropdown selector input viewmodel
    fitems.select2 = function (fctx) {
        var exp = {}, outer, inp;

        exp.getWidget = function () {
            return inp;
        }

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            inp = $("<select>").addClass('form-control').attr({ id: fctx.id }).css({
                'width': '100%'
            }).appendTo(ctl.inner);
            if (fctx.layout.readonly) inp.attr("readonly", "");
            if (fctx.layout.options && fctx.layout.options.multiple) inp.attr("multiple", "multiple");
            (fctx.layout.enum || []).forEach(function (opt) {
                $("<option>").attr("value", opt.key).text(opt.value).appendTo(inp);
            });
            inp.select2({
                theme: "bootstrap"
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
                inp.prop('disabled', false);
                inp.css('opacity', '');
            }
            else {
                inp.prop('disabled', true);
                inp.css('opacity', 0.5);
            }
        }

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
        }

        exp.renderValidate = function (valok) {
            if (valok) {
                outer.removeClass('has-error');
            }
            else {
                outer.addClass('has-error');
            }
        }

        exp.onload = function () {
            if (fctx.datactl) {
                inp.select2({
                    ajax: {
                        delay: 250,
                        processResults: function (data) {
                            return {
                                results: data.items
                            };
                        },
                        transport: function (params, success, failure) {
                            var req = fctx.datactl.load(params.data);
                            req.done(success);
                            req.fail(failure);
                            return req;
                        }
                    }
                });
            }
            else {
                inp.select2({
                    ajax: null
                });
            }
        }

        exp.updateTarget = function (vraw, vusr) {
            if (fctx.datactl) {
                inp.empty();
                //var $option = $('<option selected>...</option>').val(vusr);
                var opt = $('<option>').attr('selected', '').val(vusr);
                $('<span>').text('...').appendTo(opt);
                $('<span>').addClass('glyphicon glyphicon-hourglass').appendTo(opt);
                $('<span>').text('...').appendTo(opt);
                inp.append(opt).trigger('change');

                fctx.datactl
                    .load({ id: vusr })
                    .done(function (data) {
                        opt.empty();
                        if (data.items.length) {
                            var item = data.items[0];
                            opt.text(item.text).val(vusr);
                        }
                        else {
                            $('<span>').text('*** ').appendTo(opt);
                            $('<span>').addClass('glyphicon glyphicon-alert').appendTo(opt);
                            $('<span>').text(' ***').appendTo(opt);
                        }
                        opt.removeData();
                        inp.trigger('change');
                    })
                    .fail(function () {
                        $('<span>').text('*** ').appendTo(opt);
                        $('<span>').addClass('glyphicon glyphicon-alert').appendTo(opt);
                        $('<span>').text(' ***').appendTo(opt);
                        opt.removeData();
                        inp.trigger('change');
                    });
            }
            else {
                inp.val(vusr).trigger('change');
            }
        }

        return exp;
    }


    //simple pill-items selector input viewmodel
    fitems.pillselect = function (fctx) {
        function updateItems() {
            if (!grp) return;
            grp.find('li').each(function () {
                var key = $(this).children('a').first().data('value');
                var bd = $(this).children('div').first();
                var sts = items[key] || {};
                if (!sts.enabled) {
                    $(this).addClass('au-pill-disabled disabled');
                    bd.removeClass('au-pill-active');
                }
                else {
                    $(this).removeClass('au-pill-disabled disabled');
                    if (sts.active) {
                        bd.addClass('au-pill-active');
                    }
                    else {
                        bd.removeClass('au-pill-active');
                    }
                }

                if (sts.error) {
                    $(this).addClass('au-pill-error');
                    $(this).removeClass('au-pill-success');
                }
                else {
                    $(this).removeClass('au-pill-error');
                    if (sts.success) {
                        $(this).addClass('au-pill-success');
                    }
                    else {
                        $(this).removeClass('au-pill-success');
                    }
                }
            });
        }

        var exp = {}, outer, grp, items = {};

        exp.getKeys = function () {
            return Object.keys(items);
        }

        exp.getStatus = function (key) {
            return items[key];
        }

        exp.render = function () {
            var ctl = AuForms.helpers.buildFormControl(fctx);
            outer = ctl.outer;
            grp = $("<ul>").attr({ id: fctx.id }).addClass('nav nav-pills').appendTo(ctl.inner);
            //if (fctx.layout.readonly) inp.attr("readonly", "");
            (fctx.layout.enum || []).forEach(function (opt) {
                items[opt.key] = {};
                var li = $('<li>').attr('role', 'presentation').addClass('au-pill').appendTo(grp);
                $('<div>').addClass('au-pill-border').appendTo(li);
                var a = $('<a>').attr({
                    'href': '#',
                    'data-value': opt.key
                }).css({
                    'padding': '8px 12px'
                }).appendTo(li);

                var icon, label;
                if (opt.icon) icon = $('<span>').addClass(opt.icon).appendTo(a);
                if (opt.value) label = $('<span>').text(opt.value);
                if (label && icon) {
                    $('<div>').addClass('visible-md-inline-block visible-lg-inline-block').append(label).css({
                        'margin-left': 4
                    }).appendTo(a);
                }
                else if (label) {
                    label.appendTo(a);
                }

                a.click(function (e) {
                    var key = $(this).data('value');
                    if (items[key].enabled) {
                        fctx.owner.trig({
                            source: e,
                            key: key
                        });
                    }
                });
            });
            return outer;
        }

        exp.renderEnabled = function (e) {
            if (e) {
                grp.attr('disabled', null);
                grp.css('opacity', '');
            }
            else {
                grp.attr('disabled', '');
                grp.css('opacity', 0.5);
            }
        }

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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
            updateItems();
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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
                fctx.owner.trig({
                    source: e
                });
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

        exp.renderDisplay = function (e) {
            outer.css('display', e ? (fctx.desDisplay || '') : 'none');
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
