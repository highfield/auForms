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
    var uidgen = (function () {
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


    //form event manager
    function FEvent(options) {
        function evsub(s, h) {
            var p = s.split('.');
            var uid = p[0];
            var nentry = reg[uid] || (reg[uid] = {});
            var pname = (options.composite && p.length) > 1 ? p[1] : any;
            var hentry = nentry[pname] || (nentry[pname] = []);
            hentry.push(h);
        }

        var me = {}, reg = {}, any = '*';
        options = options || {};

        me.trigger = function (uid, pname, args) {
            if (uid == null) return;
            var nentry = reg[uid];
            if (!nentry) return;
            if (options.composite) {
                var e = _.merge({ uid: uid, pname: pname }, args);
                (nentry[any] || []).forEach(function (h) { h(e); });
                if (pname) {
                    (nentry[pname] || []).forEach(function (h) { h(e); });
                }
            }
            else {
                (nentry[any] || []).forEach(function (h) { h(args); });
            }
        }

        me.sub = function (src, hnd) {
            if (!src) return;
            var asrc = src.split(' ');
            asrc.forEach(function (s) { evsub(s, hnd); });
        }

        me.unsub = function (src, hnd) {
            //TODO
        }

        me.drop = function (uid) {
            //TODO
        }

        return me;
    }


    //form-property pseudo class
    function FProp(owner, name, config, defaults) {
        function setValid(v) {
            if (v === valok) return;
            valok = v;
            owner.render && owner.render(RenderLevel.validate);
        }

        function hchanged() {
            owner._fctx && owner._fctx.eventProxy.trigger(owner._uid, name);
            owner.render && owner.render(RenderLevel.update);
        }

        var me = {}, initok, vraw, vout, spath, conv, bidi, valids = [], valok = true;

        defaults = defaults || {};
        if (defaults.vraw != null) vraw = defaults.vraw;
        if (defaults.bidi != null) bidi = defaults.bidi;

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
                me.save();
            }
            else {
                vraw = vout;
            }
            hchanged();
        }

        me.getRaw = function () { return vraw; }
        me.setRaw = function (vr) {
            if (vraw === vr) return;
            vraw = vr;
            if (initok) {
                vout = conv ? conv.toTarget(vraw) : vraw;
                hchanged();
            }
        }

        me.load = function () {
            if (!initok || !spath) return;
            var vr = _.get(owner._fctx.data, spath);
            me.setRaw(vr);
        }

        me.save = function () {
            if (!initok || !spath || !bidi) return;
            _.set(owner._fctx.data, spath, vraw);
        }

        me.validate = function () {
            var ok = true;
            if (owner._visible() && owner._enabled()) {
                var vctx = { value: vout };
                for (var i = 0; i < valids.length; i++) {
                    ok = !!valids[i].fn(vctx, valids[i].p);
                    if (!ok) break;
                }
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
                var opts = owner._fctx.options;
                spath = cfg.path;
                conv = cfg.conv && opts.converters[cfg.conv];
                if (cfg.bidi != null) bidi = !!cfg.bidi;
                if (_.isObject(cfg.validate)) {
                    bidi = true;
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
            else {
                vout = vraw;
            }
            initok = true;
        }

        owner._props[name] = me;
        me.init();
        return me;
    }


    //form-node pseudo-base class
    function FBase(form, ntype, config) {
        var me = {
            _type: config.type,
            _fctx: form && form._fctx,
            _parent: null,
            _header: null,
            _children: [],
            _props: {},
            _rlev: RenderLevel.build
        };

        me.getType = function () { return me._type; }
        me.getParent = function () { return me._parent; }
        me.getChildren = function () { return me._children.slice(0); }
        me.prop = function (name) { return me._props[name]; }

        FProp(me, 'margin', config);

        me._attach = function (p) {
            if (!form) return;
            me._parent = p;
            if (me._uid) {
                if (me._fctx.lookup[me._uid]) throw new Error("Duplicate ID:" + me._uid);
                me._fctx.lookup[me._uid] = me;
            }
        }

        me._detach = function () {
            if (!form) return;
            if (me._uid) delete me._fctx.lookup[me._uid];
            me._parent = null;
        }

        me.getHeader = function () { return me._header; }
        me.setHeader = function (n) {
            if (!form) return;
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

        FProp(me, 'enabled', config, { vraw: config.enabled != null ? !!config.enabled : true });
        me._enabled = function () {
            var ena = me._props['enabled'].get();
            return me._parent ? (ena && me._parent._enabled()) : ena;
        }

        FProp(me, 'visible', config, { vraw: config.visible != null ? !!config.visible : true });
        me._visible = function () {
            var vis = me._props['visible'].get();
            return me._parent ? (vis && me._parent._visible()) : vis;
        }

        me._applyVisible = function (el) {
            me._visible() ? el.show() : el.hide();
            return me._visible();
        }

        me._applyValidate = function (pname) {
            var valok = me._props[pname].isValid();
            var el = me._host.closest('.auForms-row');
            valok ? el.removeClass('has-error') : el.addClass('has-error');
        }

        me._applyCssProp = function (el, pname) {
            var vold = el.data('css-' + pname);
            var vnew = me._props[pname].get();
            if (vold == vnew) return;
            if (vold) el.removeClass(vold);
            if (vnew) el.addClass(vnew);
            el.data('css-' + pname, vnew);
        }

        me.render = function (lev) {
            if (RenderLevel.check(lev) && lev <= me._rlev) {
                me._rlev = lev;
                me._fctx.form._rtrigger();
            }
        }
        me._render = function (plev) {
            var ra = RenderLevel.enum();
            for (var l = Math.min(me._rlev, plev); l < ra.length; l++) {
                var fn = me[ra[l]];
                if (l === RenderLevel.build) {
                    fn && fn();
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
                    for (var k in me._props) {
                        me._props[k].load();
                    }
                    fn && fn();
                }
                else if (l === RenderLevel.validate) {
                    var valid = true;
                    for (var k in me._props) {
                        if (!me._props[k].validate()) valid = false;
                    }
                    if (me._uid) {
                        if (valid) {
                            delete me._fctx.invalids[me._uid];
                        }
                        else {
                            me._fctx.invalids[me._uid] = 1;
                        }
                    }
                    fn && fn();
                }
                me._header && me._header._render(l);
                me._children.forEach(function (c) {
                    c._render(l);
                });
                me._rlev = l;
            }
        }

        return me;
    }


    //form-node pseudo-class
    function FNode(form, config) {
        config = config || {};
        var me = FBase(form, ntFNode, config);
        Object.defineProperty(me, '_nt', { value: ntFNode, writable: false });

        me._uid = config.id || uidgen();
        me.getId = function () { return me._uid; }

        me.isValid = function () {
        }

        return me;
    }


    //form-section pseudo-class
    function FSection(form, name, config) {
        if (!name || !_.isString(name)) throw new Error("Invalid name: " + name);
        var me = FBase(form, ntFNode, config);
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
                    var sct = FSection(form, k, obj[k]);
                    form.add(sct);
                    sct.add(me.convert(obj[k]));
                }
                form.render(RenderLevel.build);
            }

            me.convert = function (obj) {
                var fn = factory[obj.type];
                if (!_.isFunction(fn)) throw new Error('Plug-in type not supported:' + obj.type);
                var n = fn(form, obj);
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

        function setHasErrors(v) {
            v = !!v;
            if (hasErrors !== v) {
                hasErrors = v;
                me._fctx.eventProxy.trigger('', 'errors');
            }
        }

        var me = FBase(null, ntFSection, { type: 'form' });
        var odata = {}, hasErrors = false;

        me._fctx = {
            form: me,
            options: options || {},
            lookup: {},
            data: {},
            dispatcher: AuDispatcher(),
            eventProxy: FEvent({ composite: true }),
            invalids: {}
        };
        me._fctx.options.converters = me._fctx.options.converters || {};
        me._fctx.options.validators = me._fctx.options.validators || AuFormsValidators;
        me._cspan = function (c) {
            return me._fctx.options.forceRowStacked ? 12 : c;
        }
        me._rtrigger = function () {
            me._fctx.dispatcher.push({
                exec: me._render
            });
        }

        me.getData = function () { return me._fctx.data; }
        me.getHasErrors = function () { return hasErrors; }

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
                    c._render(l);
                });
            }
            me._rlev = RenderLevel.ready;
            setHasErrors(Object.keys(me._fctx.invalids).length);
            me._fctx.eventProxy.trigger('', 'ready');
        }

        me.on = function (src, hnd) {
            me._fctx.eventProxy.sub(src, hnd);
        }

        me.off = function (src, hnd) {
            me._fctx.eventProxy.unsub(src, hnd);
        }

        me.dispose = function () {
            //TODO
        }

        return me;
    }


    function FDelay(callback, delay) {
        var me = {}, tmr;

        me.restart = function () {
            me.cancel();
            tmr = setTimeout(function () {
                tmr = null;
                callback();
            }, delay);
        }

        me.cancel = function () {
            if (tmr) clearTimeout(tmr);
            tmr = null;
        }

        return me;
    }


    function FTimedSemaphore(delay) {
        var me = {}, tmr, fbusy = false;
        me.isBusy = function () { return fbusy; }

        me.restart = function () {
            me.cancel();
            fbusy = true;
            tmr = setTimeout(me.cancel, delay || 500);
        }

        me.cancel = function () {
            if (tmr) clearTimeout(tmr);
            tmr = null;
            fbusy = false;
        }

        return me;
    }


    function dialog(options) {
        function trigResize() {
            var dm = {};
            dm.id = 'resize';
            dm.exec = hresize;
            dispatcher.push(dm);
        }

        function hresize() {
            if (sizey) {
                var wh = $(window).height();
                var ah = wh * sizey / 100;
                //console.log('wh=' + wh + '; ah=' + ah);

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
                    'overflow': 'hidden'
                    //'overflow-y': 'auto'
                });
            }
        }

        options = options || {
            closable: true
        };

        var me = {
            body: $('<div>').css('height', '100%'),
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
            return me.body;
        }

        options.onshown = function (dref) {
            trigResize();
        }

        options.onhidden = function (dref) {
            me.close();
        }

        var dlg = new BootstrapDialog(options);
        dlg.realize();

        var h = dlg.getModalHeader();
        h.show();
        me.header = $('<div>').addClass('au-dialog-header').appendTo(h.find('.bootstrap-dialog-header'));
        if (options.closable === false) {
            me.header.css({
                width: '100%'
            });
        }

        var f = dlg.getModalFooter();
        f.show();
        me.footer = f.find('.bootstrap-dialog-footer');

        me.open = function () {
            if (!dlg || opened) return;
            opened = true;
            if (me.header.children().length) dlg.setTitle('');
            if (sizex || sizey) $(window).on('resize', trigResize);
            dlg.open();
        }

        me.close = function () {
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

        return me;
    }


    function wizard(form, cfg) {
        function initPages() {
            for (var i = 0, f = false; i < cfg.pages.length; i++) {
                var n = form.getNode(cfg.pages[i].id);
                if (!n) continue;
                var el = n.getHost();
                while (el.css('height') !== '100%') {
                    el.css('height', '100%');
                    if (f) break;
                    el = el.parent();
                }
                f = true;
            }
        }

        function update() {
            var p = getPage(pgid);
            cfg.pages.forEach(function (z) {
                var n = form.getNode(z.id);
                if (n) {
                    var vis = p && z.id === pgid;
                    n.prop('visible').set(vis);
                    n.getHost().parent().css('height', vis ? '100%' : '');
                }
            });

            if (cfg.prev) {
                var n = form.getNode(cfg.prev);
                if (n) n.prop('enabled').set(p && !!p.prev);
            }
            if (cfg.next) {
                var n = form.getNode(cfg.next);
                if (n) n.prop('enabled').set(p && !!p.next && valok);
            }
            if (cfg.submit) {
                var n = form.getNode(cfg.submit);
                if (n) n.prop('enabled').set(p && !!p.submit && valok);
            }
            if (cfg.selector && p && p.pill) {
                var n = form.getNode(cfg.selector);
                if (n && n.getType() === 'pillselect' && n._targets && n._targets.items) {
                    var free = true;
                    for (var k in n._targets.items) {
                        var sts = n._targets.items[k];
                        sts.enabled = sts.active = sts.error = sts.success = false;
                        seq.forEach(function (id) {
                            var p = getPage(id);
                            if (p.pill === k) {
                                sts.enabled = free;
                                if (id === pgid) {
                                    sts.active = true;
                                    if (!valok) {
                                        sts.error = true;
                                        free = false;
                                    }
                                }
                            }
                        });
                        if (sts.enabled && !sts.active && !sts.error) sts.success = true;
                    }
                    n.render(RenderLevel.update);
                }
            }
        }

        function getPage(id) {
            if (!_.isString(id)) return null;
            for (var i = 0; i < cfg.pages.length; i++) {
                if (cfg.pages[i].id === id) return cfg.pages[i];
            }
        }

        function backward(destId) {
            var a = {
                currId: pgid,
                trim: false
            };
            if (_.isString(destId)) a.destId = destId;
            eventProxy.trigger('prev', null, a);
            if (!_.isString(a.destId)) a.destId = null;
            if (a.destId) {
                var x0 = seq.indexOf(pgid);
                a.x1 = seq.indexOf(a.destId);
                if (a.x1 < 0 || x0 <= a.x1) a.destId = null;
            }
            if (a.destId && a.trim) seq.splice(a.x1 + 1);
            if (a.destId) {
                pgid = a.destId;
                update();
                eventProxy.trigger('enter', null, { pageId: pgid });
            }
        }

        function forward(destId) {
            var a = {
                currId: pgid,
                trim: false
            };
            if (_.isString(destId)) a.destId = destId;
            eventProxy.trigger('next', null, a);
            if (!_.isString(a.destId)) a.destId = null;
            if (a.destId) {
                var x0 = seq.indexOf(pgid);
                a.x1 = seq.indexOf(a.destId);
                if (a.x1 >= 0 && x0 >= a.x1) {
                    a.destId = null;
                }
                else if (a.x1 >= 0 && a.x1 > x0 + 1) {
                    //a.trim = true;
                }
            }
            if (a.destId && a.trim) seq.splice(x0 + 1);
            if (a.destId) {
                pgid = a.destId;
                if (seq.indexOf(a.destId) < 0) seq.push(a.destId);
                update();
                eventProxy.trigger('enter', null, { pageId: pgid });
            }
        }

        cfg = cfg || {};
        cfg.pages = cfg.pages || [];

        if (cfg.prev) {
            form.on(cfg.prev + '.click', function (args) {
                var p = getPage(pgid);
                backward(getPage(p.prev) && p.prev);
            });
        }
        if (cfg.next) {
            form.on(cfg.next + '.click', function (args) {
                var p = getPage(pgid);
                forward(getPage(p.next) && p.next);
            });
        }
        if (cfg.selector) {
            form.on(cfg.selector + '.click', function (args) {
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

                var n = form.getNode(cfg.selector);
                if (n && n.getType() === 'pillselect' && n._targets && n._targets.items) {
                    var sts = n._targets.items[args.key];
                    if (!sts || !sts.enabled || sts.error) return;
                    if (x1 < x0) {
                        backward(id);
                    }
                    else {
                        forward(id);
                    }
                }
            });
        }

        var pgid, valok = true, seq = [];
        var me = {}, eventProxy = FEvent();

        me.getPageId = function () { return pgid; }

        me.start = function (id) {
            if (!pgid && getPage(id)) {
                pgid = id;
                seq.push(id);
                initPages();
                update();
                eventProxy.trigger('enter', null, { pageId: pgid });
            }
        }

        me.on = function (src, hnd) {
            eventProxy.sub(src, hnd);
        }

        me.off = function (src, hnd) {
            eventProxy.unsub(src, hnd);
        }

        me.setValid = function (v) {
            valok = v;
            update();
        }

        return me;
    }


    function table(ctr, layout, options) {
        ctr.empty();

        layout = layout || {};
        options = options || {};

        var cols = layout.cols || [];
        var rows = layout.rows || [];
        if (cols.length === 0) return;
        if (!options.showHeader && !rows.length) return;

        var thead, table = $('<table>').addClass('table table-condensed').appendTo(ctr);
        if (options.showHeader) {
            thead = $('<thead>').appendTo(table);
            var tr = $('<tr>').appendTo(thead);

            for (var x = 0; x < cols.length; x++) {
                var c = cols[x];
                var tc = $('<th>').text(c.title || c.id).appendTo(tr);
                if (c.width) tc.attr('width', c.width);
            }
        }

        var tbody = $('<tbody>').appendTo(table);
        for (var y = 0; y < rows.length; y++) {
            var r = rows[y], cells = r.cells || {};
            var tr = $('<tr>').appendTo(tbody);
            if (r.bg) tr.css('background-color', r.bg);

            for (var x = 0; x < cols.length; x++) {
                var colId = cols[x].id, cl = cells[colId] || {};
                var tc = $('<td>').appendTo(tr);
                if (r === 0 && !thead) {
                    if (cols[x].width) tc.attr('width', cols[x].width);
                }
                if (cols[x].bg) tc.css('background-color', cols[x].bg);
                if (cl && cl.v) {
                    if (cl.b) {
                        tc.append($('<b>').text(cl.v));
                    }
                    else {
                        tc.text(cl.v);
                    }
                }
                else {
                    tc.html('&nbsp;');
                }
            }
        }
    }


    function ajaxController(url) {
        var me = {};

        me.onFilter = $.noop;

        me.load = function (filter) {
            me.onFilter(filter);
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

        return me;
    }


    return {
        uidgen: uidgen,
        ntFNode: ntFNode,
        ntFSection: ntFSection,
        RenderLevel: RenderLevel,
        FProp: FProp,
        FBase: FBase,
        FNode: FNode,
        FSection: FSection,
        Form: Form,
        FDelay: FDelay,
        FTimedSemaphore: FTimedSemaphore,
        dialog: dialog,
        wizard: wizard,
        table: table,
        controllers: {
            ajax: ajaxController
        }
    }
})(jQuery);
