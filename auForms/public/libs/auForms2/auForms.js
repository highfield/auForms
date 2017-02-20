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


    //definitions
    var ntFNode = {}, ntFSection = {};
    var RenderLevel = (function () {
        var me = {
            build: 0,
            update: 1,
            validate: 2,
            ready: 3
        };
        var a = ['build', 'update', 'validate', 'ready'];

        me.check = function (v) { return v >= 0 && v <= 3; }
        me.enum = function () { return a.slice(0); }
        return me;
    })();


    //form-property pseudo class
    function FProp(owner, name, config, cb) {
        function setValid(v) {
            if (v === valok) return;
            valok = v;
        }

        cb = cb || function () {
            owner.render(RenderLevel.update);
        };

        var me = {}, initok, vraw, vout, spath, conv, bidi, valids = [], valok = true;
        me.getName = function () { return name; }
        me.isValid = function () { return valok; }
        me.getConv = function () { return conv; }
        me.setConv = function (v) { conv = v; }

        me.get = function () { return vout; }
        me.set = function (v) {
            if (!initok || vout === v) return;
            vout = v;
            if (bidi) {
                if (!me.validate()) return;

                var vr = conv ? conv.toSource(vout) : vout;
                if (vraw === vr) return;
                vraw = vr;
            }
            else {
                vraw = vout;
            }
            cb();
        }

        me.getRaw = function () { return vraw; }
        me.setRaw = function (vr) {
            if (vraw === vr) return;
            vraw = vr;
            if (initok) {
                vout = conv ? conv.toTarget(vraw) : vraw;
            }
        }

        me.load = function () {
            if (!initok || !spath) return;
            vraw = _.get(owner._fctx.data, spath);
            vout = conv ? conv.toTarget(vraw) : vraw;
        }

        me.save = function () {
            if (!initok || !spath || !bidi) return;
            _.set(owner._fctx.data, spath, vraw);
        }

        me.validate = function () {
            var ok = true;
            for (var i = 0; i < valids.length; i++) {
                ok &= !!valids[i].fn(valids[i].p);
                if (!ok) break;
            }
            setValid(ok);
            return ok;
        }

        me.addValidator = function (fn, params) {
            valids.push({
                fn: fn, p: params
            });
        }

        me.init = function () {
            if (initok) return;
            var cfg = config[name];
            if (_.isObject(cfg)) {
                var opts = me._fctx.options;
                spath = cfg.path;
                conv = opts.converters[cfg.conv];
                bidi = _.isObject(cfg.validate);
                if (bidi) {
                    for (var k in cfg.validate) {
                        valids.push({
                            fn: opts.validators[k], p: cfg.validate[k]
                        });
                    }
                }
            }
            else if (cfg != null) {
                vraw = vout = cfg;
            }
            initok = true;
        }

        owner._props[name] = me;
        return me;
    }


    //form-node pseudo-base class
    function FBase(ntype, config) {
        var me = {
            _type: config.type,
            _fctx: null,
            _parent: null,
            _header: null,
            _children: [],
            _props: {},
            _rlev: RenderLevel.build,
            _initLk: false,
            _initProps: false
        };

        me.getParent = function () { return me._parent; }
        me.getChildren = function () { return me._children.slice(0); }
        me.prop = function (name) { return me._props[name]; }

        FProp(me, 'margin', config);

        me._attach = function (p) {
            me._parent = p;
            return me;
        }

        me._detach = function () {
            if (me._initLk) delete me._fctx.lookup[me._uid];
            me._initLk = false;
            me._parent = null;
            return me;
        }

        me.getHeader = function () { return me._header; }
        me.setHeader = function (n) {
            if (me._header) {
                me._header._detach();
                me._header = null;
            }
            if (n) {
                if (n._nt !== ntype) throw new Error("Invalid node type.");
                n._attach(me);
                me._header = n;
            }
        }

        me.add = function (n) {
            if (!n || n._nt !== ntype) throw new Error("Invalid node type.");
            n._attach(me);
            me._children.push(n);
        }

        me.remove = function (x) {
            if (!me._parent) return;
            if (arguments.length === 0) {
                me._parent && me._parent.remove(me);
            }
            else if (_.isInteger(x)) {
                if (x >= 0 && x < me._children.length) {
                    var k = me._children[x]._detach()._uid;
                    me._children.splice(x, 1);
                }
            }
            else if (_.isString(x)) {
                //TODO rimozione per id
            }
            else if (_.isObject(x)) {
                var i = me._children.indexOf(x);
                if (i >= 0) {
                    me._children[i]._detach();
                    me._children.splice(i, 1);
                }
            }
        }

        FProp(me, 'enabled', config).setRaw(config.enabled != null ? !!config.enabled : true);
        me._enabled = function () {
            var ena = me._props['enabled'].get();
            return me._parent ? (ena && me._parent._enabled()) : ena;
        }

        FProp(me, 'visible', config).setRaw(config.visible != null ? !!config.visible : true);
        me._visible = function () {
            var vis = me._props['visible'].get();
            return me._parent ? (vis && me._parent._visible()) : vis;
        }

        me.render = function (lev) {
            if (me._fctx && RenderLevel.check(lev) && lev <= me._rlev) {
                me._rlev = lev;
                me._fctx.form._rtrigger();
            }
        }
        me._render = function (fctx, plev) {
            me._fctx = fctx;
            if (me._uid && !me._initLk) {
                var lk = me._fctx.lookup;
                if (lk[me._uid]) throw new Error("Duplicate ID:" + me._uid);
                lk[me._uid] = me;
                me._initLk = true;
            }
            if (!me._initProps) {
                for (var k in me._props) {
                    me._props[k].init();
                }
                me._initProps = true;
            }

            var ra = RenderLevel.enum();
            for (var l = Math.min(me._rlev, plev); l < ra.length; l++) {
                var fn = me[ra[l]];
                fn && fn();
                if (l === RenderLevel.build) {
                    var targets = me._targets || {};
                    if (me._header) me._header._host = targets.header || me._host;
                    if (_.isArray(targets.children)) {
                        for (var i = 0; i < me._children.length; i++) {
                            var h = i < targets.children.length ? targets.children[i] : me._host;
                            me._children[i]._host = h;
                        }
                    }
                    else {
                        me._children.forEach(function (c) {
                            c._host = targets.children || me._host;
                        });
                    }
                }
                else if (l === RenderLevel.update) {
                    me._host.css('margin', me._props['margin'].get());
                }
                me._header && me._header._render(fctx, l);
                me._children.forEach(function (c) {
                    c._render(fctx, l);
                });
            }
        }

        return me;
    }


    //form-node pseudo-class
    function FNode(config) {
        config = config || {};
        var me = FBase(ntFNode, config);
        Object.defineProperty(me, '_nt', { value: ntFNode, writable: false });

        me._uid = config.id || uid();
        me.getId = function () { return me._uid; }

        me.isValid = function () {
        }

        //var value = config.v;
        //me.get = function () { return value; }
        //me.set = function (v) {
        //    if (value !== v) {
        //        value = v;
        //        me.render(RenderLevel.update);
        //    }
        //}

        //exp.dispose = function () {
        //}

        return me;
    }


    //form-section pseudo-class
    function FSection(name, config) {
        if (!name || !_.isString(name)) throw new Error("Invalid name: " + name);
        var me = FBase(ntFNode, config);
        me._type = 'section';
        Object.defineProperty(me, '_nt', { value: ntFSection, writable: false });

        me._sname = name;
        me.getName = function () { return me._sname; }

        return me;
    }


    //form pseudo-class
    function Form(targets, options) {
        function layout(form, factory) {
            var me = {};
            me.empty = function () { form.empty(); }
            me.load = function (obj) {
                me.empty();
                if (!obj || (obj.type && obj.type !== 'form')) throw new Error('Invalid layout.');
                if (!obj.type) return;
                for (var k in obj) {
                    if (k === 'type' || !obj[k].type) continue;
                    var sct = FSection(k, obj[k]);
                    form.add(sct);
                    sct.add(me.convert(obj[k]));
                }
            }

            me.convert = function (obj) {
                var fn = factory[obj.type];
                if (!_.isFunction(fn)) throw new Error('Plug-in type not supported:' + obj.type);
                var n = fn(obj);
                if (!_.isObject(n)) throw new Error('Invalid plug-in instance:' + obj.type);
                if (_.isObject(obj.header)) {
                    n.setHeader(me.convert(obj.header));
                }
                else if (_.isString(obj.header)) {
                    n.setHeader(me.convert({ type: 'label', text: obj.header }));
                }
                (obj.nodes || []).forEach(function (c) {
                    n.add(me.convert(c));
                });
                return n;
            }

            return me;
        }

        var me = FBase(ntFSection, { type: 'form' });
        var odata = {}, evtreg = {};

        me._fctx = {
            form: me,
            options: options || {},
            lookup: {},
            data: {},
            dispatcher: AuDispatcher()
        };
        me._cspan = function (c) {
            return me._fctx.options.forceLabelStacked ? 12 : c;
        }
        me._rtrigger = function () {
            me._fctx.dispatcher.push({
                exec: me._render
            });
        }

        me.getData = function () { return me._fctx.data; }

        me.load = function (data) {
            odata = data || {};
            me._fctx.data = _.cloneDeep(odata);
            me.render(RenderLevel.update);
        }

        me.reload = function () {
            me.load(odata);
        }

        me.getNode = function (id) {
            return me._fctx.lookup[id];
        }

        me.getSection = function (name) {
            for (var i = 0; i < me._children.length; i++) {
                var c = me._children[i];
                if (name === c.getName()) return c;
            }
        }

        me.empty = function () {
            //TODO
            me.render(RenderLevel.build);
        }

        me.layout = function (factory) {
            return layout(me, factory);
        }

        me._render = function () {
            if (me._rlev === RenderLevel.build) {
                me._children.forEach(function (c) {
                    c._host = targets[c._sname];
                });
            }
            var ra = RenderLevel.enum();
            for (var l = me._rlev; l < ra.length; l++) {
                me._children.forEach(function (c) {
                    c._render(me._fctx, l);
                });
            }
            me._rlev = RenderLevel.ready;
        }

        me.on = function (s, h) {
        }

        me.off = function (s, h) {
        }

        me.dispose = function () {
            //TODO
        }

        return me;
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


    /*
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
            foptions: fctx.foptions,
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
            outer.addClass('row');
            var c0 = fctx.foptions.cspan(fctx.layout.glcl[0]), c1 = fctx.foptions.cspan(fctx.layout.glcl[1]);
            if (colh) {
                colh.addClass('col-md-' + c0).css({ margin: 0, padding: 0, 'min-width': 160 });
                colc.addClass('col-md-' + c1).css({ margin: 0, padding: 0 });
            }
            else {
                colc.addClass('col-md-' + c1 + ' col-md-offset-' + fctx.layout.glcl[0]).css({
                    //margin: 0,
                    padding: 0
                });
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

    var buildFormControl = function (node) {
        node._host.empty();
        var outer = $("<div>").css({
            'overflow': 'hidden',
            margin: 0
        }).appendTo(node._host);
        //if (fctx.layout.bg) {
        //    outer.addClass(fctx.layout.bg);
        //}

        var colh = $('<div>').appendTo(outer), colc = $('<div>').appendTo(outer);
        var inner = $("<div>").appendTo(colc);
        if (!fctx.prophost) inner.addClass('form-group');
        if (fctx.layout.glcl) {
            outer.addClass('row');
            var c0 = fctx.foptions.cspan(fctx.layout.glcl[0]), c1 = fctx.foptions.cspan(fctx.layout.glcl[1]);
            colh.addClass('col-md-' + c0).css({ margin: 0, padding: 0, 'min-width': 160 });
            colc.addClass('col-md-' + c1).css({ margin: 0, padding: 0 });
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
                    foptions: fctx.foptions,
                    prophost: true
                };
                var vm = fviewmodel(cfctx);
                fctx.iowner.props.push(cfctx);
                var ctg = vm.render();
            }
        }
        return { outer: outer, inner: inner, label: colh };
    }
    */

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
        ntFNode: ntFNode,
        ntFSection: ntFSection,
        RenderLevel: RenderLevel,
        FProp: FProp,
        FBase: FBase,
        FNode: FNode,
        FSection: FSection,
        Form: Form,
        dialog: dialog,
        wizard: wizard,
        controllers: {
            ajax: ajaxController
        },
        //helpers: {
        //    buildPropViewmodel: buildPropViewmodel,
        //    buildFormContainer: buildFormContainer,
        //    buildFormControl: buildFormControl
        //}
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
