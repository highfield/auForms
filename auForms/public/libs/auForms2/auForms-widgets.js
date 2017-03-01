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

AuFormsWidgets = (function ($) {
    "use strict";
    var xbag = {};

    /**
    *   Stack plug-in
    **/
    xbag.stack = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'bg', config);
        AuForms.FProp(me, 'inline', config);
        AuForms.FProp(me, 'overflow-y', config);
        AuForms.FProp(me, 'height', config);

        me.getHost = function () {
            return me._targets.outer;
        }

        me.build = function () {
            me._host.empty();
            var outer = $("<div>").css({
                'overflow-x': 'hidden',
                //margin: 0
            }).appendTo(me._host);

            var a = [];
            for (var i = 0; i < me._children.length; i++) {
                a.push($('<div>').appendTo(outer));
            }

            me._targets = {
                children: a,
                outer: outer
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._applyCssProp(me._targets.outer, 'bg');

                var oy = me._props['overflow-y'].get() || 'hidden';
                me._targets.outer.css('overflow-y', oy);

                me._targets.outer.css('height', me._props['height'].get());

                var d = me._props['inline'].get() ? 'inline' : 'block';
                me._targets.outer.css('display', d);
                me._targets.children.forEach(function (c) {
                    c.css('display', d);
                });
            }
        }

        return me;
    }


    /**
    *   Grid-layout plug-in
    **/
    xbag['grid-layout'] = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'bg', config);

        me.build = function () {
            me._host.empty();
            var outer = $("<div>").addClass('row auForms-row').css({
                'overflow': 'hidden',
            }).appendTo(me._host);

            var a = [];
            for (var i = 0; i < me._children.length; i++) {
                a.push($('<div>').appendTo(outer));
            }

            me._targets = {
                children: a,
                outer: outer
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._applyCssProp(me._targets.outer, 'bg');
            }
        }

        return me;
    }


    /**
    *   Panel plug-in
    **/
    xbag.panel = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'bg', config);

        me.build = function () {
            me._host.empty();
            var outer = $("<div>").addClass('panel').css({
                'overflow': 'hidden',
            }).appendTo(me._host);

            var header = $('<div>').addClass('panel-heading').appendTo(outer);
            var body = $('<div>').addClass('panel-body').appendTo(outer);

            me._targets = {
                children: body,
                header: header,
                outer: outer
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._applyCssProp(me._targets.outer, 'bg');
            }
        }

        return me;
    }


    /**
    *   Row plug-in
    **/
    xbag.row = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'bg', config);

        me.build = function () {
            me._host.empty();
            var row = $("<div>").addClass('row auForms-row').css({
                'overflow': 'hidden',
                //margin: 0
            }).appendTo(me._host);

            var colh = $('<div>').appendTo(row), colc = $('<div>').appendTo(row);
            //var inner = $("<div>").appendTo(colc);
            //if (!fctx.prophost) inner.addClass('form-group');
            if (config.gcols) {
                //outer.addClass('row');
                var c0 = me._fctx.form._cspan(config.gcols[0]), c1 = me._fctx.form._cspan(config.gcols[1]);
                colh.addClass('col-md-' + c0).css({ margin: 0, padding: 0, 'min-width': 160 });
                colc.addClass('col-md-' + c1).css({ margin: 0, padding: 0 });
            }
            me._targets = {
                header: colh,
                children: colc,
                outer: row
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._applyCssProp(me._targets.outer, 'bg');
            }
        }

        return me;
    }


    /**
    *   Host plug-in
    **/
    xbag.host = function (form, config) {
        var me = AuForms.FNode(form, config);

        me.getHost = function () {
            return me._targets.outer;
        }

        me.build = function () {
            me._host.empty();
            var outer = me._host;

            me._targets = {
                outer: outer
            };
        }

        return me;
    }


    /**
    *   Icon plug-in
    **/
    xbag.icon = function (form, config) {
        var me = AuForms.FNode(form, config), vold;

        AuForms.FProp(me, 'value', config);

        me.build = function () {
            me._host.empty();
            var outer = me._host;// $("<div>").appendTo(me._host);

            me._targets = {
                outer: outer
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                var vout = me._props['value'].get();
                if (vout != vold) {
                    vold = vout;
                    me._targets.outer.empty();
                    if (_.isString(vout) && vout.length) {
                        $('<i>').addClass(vout).appendTo(me._targets.outer);
                    }
                    else if (_.isObject(vout)) {
                        var cls = 'fa-stack ' + (vout.size || '');
                        var s = $('<div>').addClass(cls).appendTo(me._targets.outer);
                        (vout.icons || []).forEach(function (i) {
                            $('<i>').addClass(i).appendTo(s);
                        });
                    }
                }
            }
        }

        return me;
    }


    /**
    *   Label plug-in
    **/
    xbag.label = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'text', config);

        me.build = function () {
            me._host.empty();
            var outer = $("<label>").addClass('control-label').attr({ for: me._uid }).css({
                'white-space': 'nowrap',
                padding: 0
            }).appendTo(me._host);

            me._targets = {
                outer: outer
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.outer.text(me._props['text'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
            }
        }

        return me;
    }


    /**
    *   TextBlock plug-in
    **/
    xbag.textblock = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'text', config);

        me.build = function () {
            me._host.empty();
            var outer = $("<p>").attr({ id: me._uid }).addClass('form-control-static').appendTo(me._host);

            me._targets = {
                outer: outer
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.outer.text(me._props['text'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
            }
        }

        return me;
    }


    /**
    *   TextArea plug-in
    **/
    xbag.textarea = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'text', config, { bidi: true });

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            var inp = $("<textarea>").attr({ id: me._uid }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");

            inp.on('change blur keyup', function (e) {
                me._props['text'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.val(me._props['text'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('text');
        }

        return me;
    }


    /**
    *   TextBox plug-in
    **/
    xbag.textbox = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'text', config, { bidi: true });

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            if (config.pre) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(config.pre).appendTo(grp);
            }
            var inp = $("<input>").attr({ type: 'text', id: me._uid }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            if (config.post) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(config.post).appendTo(grp);
            }

            inp.on('change blur keyup', function (e) {
                me._props['text'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.val(me._props['text'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('text');
        }

        return me;
    }


    /**
    *   NumBox plug-in
    **/
    xbag.numbox = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            if (config.pre) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(config.pre).appendTo(grp);
            }
            var inp = $("<input>").attr({ type: 'number', id: me._uid }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            if (config.post) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(config.post).appendTo(grp);
            }

            inp.on('change blur keyup', function (e) {
                me._props['value'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.val(me._props['value'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   ColorBox plug-in
    **/
    xbag.colorbox = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });

        //NOT WORKING YET!!!
        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            var inp = $("<input>").attr({
                type: 'text', id: me._uid
            }).css({
                'min-width': 190
            }).addClass('pick-a-color form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");

            var opts = _.cloneDeep(config.options || {});
            opts.inlineDropdown = true;
            opts.showSavedColors = false;
            opts.showAdvanced = false;
            inp.pickAColor(opts);

            //super-hack :P
            grp.addClass('pick-a-color-markup').find('.color-menu--inline').css({
                'z-index': 20000,
                'position': 'relative',
                'left': 'auto',
                'float': 'right'
            }).detach().appendTo(grp);

            inp.on('change blur keyup', function (e) {
                me._props['value'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.val(me._props['value'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   Time-input plug-in
    **/
    xbag.fgtime = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').addClass('input-group').appendTo(me._host);
            var inp = $("<input>").attr({ type: 'text', id: me._uid }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            $('<span>').addClass('input-group-addon glyphicon glyphicon-time').css({
                top: 0,
                'font-size': '1.2em'
            }).appendTo(grp);

            var opts = _.cloneDeep(config.options || {});
            inp.timeDropper(opts);

            inp.on('change blur keyup', function (e) {
                me._props['value'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.val(me._props['value'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   Date-input plug-in
    **/
    xbag.fgdate = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').addClass('input-group').appendTo(me._host);
            var inp = $("<input>").attr({ type: 'text', id: me._uid }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            $('<span>').addClass('input-group-addon glyphicon glyphicon-calendar').css({
                top: 0,
                'font-size': '1.2em'
            }).appendTo(grp);

            var opts = config.options || {};
            for (var k in opts) {
                inp.attr("data-" + k, opts[k]);
            }
            inp.dateDropper(opts);

            inp.on('change blur keyup', function (e) {
                me._props['value'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.val(me._props['value'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   CheckBox plug-in
    **/
    xbag.checkbox = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'checked', config, { bidi: true });
        AuForms.FProp(me, 'text', config);

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').addClass("checkbox").appendTo(me._host);
            var inp = $("<input>").attr({ type: 'checkbox', id: me._uid }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            var tspan = $('<span>').css({
                'margin-left': 20
            }).appendTo(grp);

            if (inp.prettyCheckable) {
                inp.prettyCheckable();
                grp.css({
                    'margin-top': 3,
                    'margin-bottom': 0
                });
                //grp.css('margin-top', 3);
                //me._host.css('margin-bottom', 10);
                tspan.css({
                    'margin-left': 5,
                    position: 'absolute',
                    top: 5
                });
            }

            inp.on('change blur keyup', function (e) {
                var v = !!$(this).prop('checked');
                me._props['checked'].set(v);
            });

            me._targets = {
                outer: grp,
                inp: inp,
                tspan: tspan
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                if (me._targets.inp.prettyCheckable) {
                    me._targets.inp.prettyCheckable(me._props['checked'].get() ? 'check' : 'uncheck');
                    me._targets.inp.prettyCheckable(me._enabled() ? 'enable' : 'disable');
                }
                else {
                    me._targets.inp.prop('checked', !!me._props['checked'].get());
                    me._targets.inp.attr('disabled', me._enabled() ? null : '');
                }
                me._targets.tspan.text(me._props['text'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
            }
        }

        me.validate = function () {
            me._applyValidate('checked');
        }

        return me;
    }


    /**
    *   RadioBox plug-in
    **/
    xbag.radiobox = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'checked', config, { bidi: true });
        AuForms.FProp(me, 'value', config);
        AuForms.FProp(me, 'text', config);

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').addClass("radio").appendTo(me._host);
            var inp = $("<input>").attr({
                type: 'radio',
                name: config.group,
                id: me._uid
            }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            var tspan = $('<span>').css({
                'margin-left': 20
            }).appendTo(grp);

            if (inp.prettyCheckable) {
                inp.prettyCheckable();
                grp.css({
                    'margin-top': 3,
                    'margin-bottom': 0
                });
                tspan.css({
                    'margin-left': 5,
                    position: 'absolute',
                    top: 5
                });
            }

            inp.on('change blur keyup', function (e) {
                var v = !!$(this).prop('checked');
                me._props['checked'].set(v);

                var lk = form._fctx.lookup;
                for (var k in lk) {
                    var n = lk[k];
                    if (n._type === me._type && n._gname === me._gname && n._uid !== me._uid) {
                        n._props['checked'].set(!v);
                    }
                }
            });

            me._targets = {
                outer: grp,
                inp: inp,
                tspan: tspan
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                if (me._targets.inp.prettyCheckable) {
                    me._targets.inp.prettyCheckable(me._props['checked'].get() ? 'check' : 'uncheck');
                    me._targets.inp.prettyCheckable(me._enabled() ? 'enable' : 'disable');
                }
                else {
                    me._targets.inp.prop('checked', !!me._props['checked'].get());
                    me._targets.inp.attr('disabled', me._enabled() ? null : '');
                }
                me._targets.inp.attr('value', me._props['value'].get());
                me._targets.tspan.text(me._props['text'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
            }
        }

        me.validate = function () {
            me._applyValidate('checked');
        }

        return me;
    }


    /**
    *   Radio-button selector plug-in
    **/
    xbag.radioselect = function (form, config) {
        var me = AuForms.FNode(form, config);
        me._gname = AuForms.uidgen();

        AuForms.FProp(me, 'value', config, { bidi: true });

        me.build = function () {
            me._host.empty();
            var outer = $('<div>').appendTo(me._host);

            var inputs = [];
            config.enum.forEach(function (o) {
                var grp = $('<div>').addClass("radio").appendTo(outer);
                var inp = $("<input>").attr({
                    type: 'radio',
                    name: me._gname,
                    id: me._uid,
                    value: o.key
                }).addClass('form-control').appendTo(grp);
                if (config.readonly) inp.attr("readonly", "");

                var span = $('<span>').text(o.value).css({
                    'margin-left': 20
                }).appendTo(grp);

                if (inp.prettyCheckable) {
                    inp.prettyCheckable();
                    grp.css({
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

            inputs.forEach(function (inp) {
                inp.on('change blur keyup', function (e) {
                    inputs.forEach(function (inp) {
                        if (inp.prop('checked')) {
                            me._props['value'].set(inp.val());
                        }
                    });
                });
            });

            me._targets = {
                outer: outer,
                inputs: inputs
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);

                var vout = me._props['value'].get();
                me._targets.inputs.forEach(function (inp) {
                    if (inp.prettyCheckable) {
                        inp.prettyCheckable(me._enabled() ? 'enable' : 'disable');
                        inp.prettyCheckable(vout == inp.val() ? 'check' : 'uncheck');
                    }
                    else {
                        inp.attr('disabled', me._enabled() ? null : '');
                        inp.prop('checked', vout == inp.val());
                    }
                });
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   Drop-down list selector plug-in
    **/
    xbag.select = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });

        me.setOptions = function (list) {
            me._targets.inp.empty();
            (list || []).forEach(function (opt) {
                $("<option>").attr("value", opt.key).text(opt.value).appendTo(me._targets.inp);
            });
        }

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            var inp = $("<select>").attr({ id: me._uid }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            //(config.enum || []).forEach(function (opt) {
            //    $("<option>").attr("value", opt.key).text(opt.value).appendTo(inp);
            //});

            inp.on('change blur keyup', function (e) {
                me._props['value'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };

            me.setOptions(config.enum);
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.val(me._props['value'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   Drop-down enhanced list selector plug-in
    **/
    xbag.select2 = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });
        AuForms.FProp(me, 'controller', config);

        me.setOptions = function (list) {
            me._targets.inp.empty();
            (list || []).forEach(function (opt) {
                $("<option>").attr("value", opt.key).text(opt.value).appendTo(me._targets.inp);
            });
        }

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            var inp = $("<select>").attr({ id: me._uid }).addClass('form-control').css({
                'width': '100%'
            }).appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            //(config.enum || []).forEach(function (opt) {
            //    $("<option>").attr("value", opt.key).text(opt.value).appendTo(inp);
            //});
            inp.select2({
                theme: "bootstrap"
            });

            var dc = me._props['controller'].get();
            if (dc) {
                inp.select2({
                    ajax: {
                        delay: 250,
                        processResults: function (data) {
                            return {
                                results: data.items
                            };
                        },
                        transport: function (params, success, failure) {
                            var req = dc.load(params.data);
                            req.done(success);
                            req.fail(failure);
                            return req;
                        }
                    }
                });
            }
            else {
                inp.select2({ ajax: null });
            }

            inp.on('change blur keyup', function (e) {
                me._props['value'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };

            me.setOptions(config.enum);
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.attr('disabled', me._enabled() ? null : '');

                var dc = me._props['controller'].get();
                if (dc) {
                    var vout = me._props['value'].get();
                    if (me._targets.inp.val() != vout) {
                        me._targets.inp.empty();

                        var opt = $('<option>').attr('selected', '').val(vout);
                        $('<span>').text('...').appendTo(opt);
                        $('<span>').addClass('glyphicon glyphicon-hourglass').appendTo(opt);
                        $('<span>').text('...').appendTo(opt);
                        me._targets.inp.append(opt).trigger('change');

                        dc.load({ id: vout })
                            .done(function (data) {
                                opt.empty();
                                if (data.items.length) {
                                    var item = data.items[0];
                                    opt.text(item.text).val(vout);
                                }
                                else {
                                    $('<span>').text('*** ').appendTo(opt);
                                    $('<span>').addClass('glyphicon glyphicon-alert').appendTo(opt);
                                    $('<span>').text(' ***').appendTo(opt);
                                }
                                opt.removeData();
                                me._targets.inp.trigger('change');
                            })
                            .fail(function () {
                                $('<span>').text('*** ').appendTo(opt);
                                $('<span>').addClass('glyphicon glyphicon-alert').appendTo(opt);
                                $('<span>').text(' ***').appendTo(opt);
                                opt.removeData();
                                me._targets.inp.trigger('change');
                            });
                    }
                }
                else {
                    me._targets.inp.val(me._props['value'].get()).trigger('change');
                }
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   Drop-down list multi-selector plug-in
    **/
    xbag.multiselect = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });

        me.setOptions = function (list) {
            me._targets.inp.empty();
            (list || []).forEach(function (opt) {
                $("<option>").attr("value", opt.key).text(opt.value).appendTo(me._targets.inp);
            });
        }

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            var inp = $("<select>").attr({ id: me._uid, multiple: 'multiple' }).addClass('form-control').appendTo(grp);
            if (config.readonly) inp.attr("readonly", "");
            //(config.enum || []).forEach(function (opt) {
            //    $("<option>").attr("value", opt.key).text(opt.value).appendTo(inp);
            //});

            var opts = _.cloneDeep(config.options || {});
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
                me._props['value'].set($(this).val());
            });

            me._targets = {
                outer: grp,
                inp: inp
            };

            me.setOptions(config.enum);
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.inp.multiselect('select', me._props['value'].get());
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.inp.multiselect(me._enabled() ? 'enable' : 'disable');
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   Pill-style tab-selector plug-in
    **/
    xbag.pillselect = function (form, config) {
        function updateItems() {
            me._targets.outer.find('li').each(function () {
                var key = $(this).children('a').first().data('value');
                var bd = $(this).children('div').first();
                var sts = me._targets.items[key] || {};
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

        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'value', config, { bidi: true });

        me.build = function () {
            me._host.empty();
            var grp = $("<ul>").attr({ id: me._uid }).addClass('nav nav-pills').appendTo(me._host);

            var items = {};
            (config.enum || []).forEach(function (opt) {
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
                        form._fctx.eventProxy.trigger(me._uid, 'click', { key: key });
                    }
                });
            });

            me._targets = {
                outer: grp,
                items: items
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                updateItems();
                me._targets.outer.css('opacity', me._enabled() ? '' : 0.5);
                me._targets.outer.attr('disabled', me._enabled() ? null : '');
            }
        }

        me.validate = function () {
            me._applyValidate('value');
        }

        return me;
    }


    /**
    *   Button plug-in
    **/
    xbag.button = function (form, config) {
        var me = AuForms.FNode(form, config);

        AuForms.FProp(me, 'text', config);
        AuForms.FProp(me, 'icon', config);
        AuForms.FProp(me, 'cssClass', config);

        me.build = function () {
            me._host.empty();
            var outer = $('<button>').attr({
                type: 'button',
                id: me._uid,
            }).appendTo(me._host);

            outer.click(function (e) {
                form._fctx.eventProxy.trigger(me._uid, 'click');
            });

            me._targets = {
                outer: outer
            };
        }

        me.update = function () {
            if (me._applyVisible(me._targets.outer)) {
                me._targets.outer.attr('class', me._props['cssClass'].get() || 'btn btn-default');
                me._targets.outer.empty();
                var vtext = me._props['text'].get(), otext;
                var vicon = me._props['icon'].get(), oicon;
                if (vicon) oicon = $('<span>').addClass(vicon).appendTo(me._targets.outer);
                if (vtext) otext = $('<span>').text(vtext);
                if (otext && oicon) {
                    $('<div>').addClass('visible-md-inline-block visible-lg-inline-block').append(otext).css({
                        'margin-left': 4
                    }).appendTo(me._targets.outer);
                }
                else if (otext) {
                    otext.appendTo(me._targets.outer);
                }
                me._targets.outer.attr('disabled', me._enabled() ? null : '');
            }
        }

        return me;
    }

    return xbag;
})(jQuery);
