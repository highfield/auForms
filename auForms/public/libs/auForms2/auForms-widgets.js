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
    var wbag = {};

    wbag.stack = function (config) {
        var me = AuForms.FNode(config);

        AuForms.FProp(me, 'background', config.bg);
        AuForms.FProp(me, 'inline', config.inline);

        me.build = function () {
            me._host.empty();
            var outer = $("<div>").css({
                'overflow': 'hidden',
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
            var bg = me._props['background'].get();
            if (bg) {
                me._targets.outer.addClass(bg);
            }
            else {
                me._targets.outer.removeClass(bg);
            }

            var d = me._props['inline'].get() ? 'inline' : 'block';
            me._targets.outer.css('display', d);
            me._targets.children.forEach(function (c) {
                c.css('display', d);
            });
        }

        return me;
    }


    wbag.row = function (config) {
        var me = AuForms.FNode(config);

        AuForms.FProp(me, 'background', config.bg);

        me.build = function () {
            me._host.empty();
            var row = $("<div>").addClass('row auForms-row').css({
                'overflow': 'hidden',
                //margin: 0
            }).appendTo(me._host);

            var colh = $('<div>').appendTo(row), colc = $('<div>').appendTo(row);
            //var inner = $("<div>").appendTo(colc);
            //if (!fctx.prophost) inner.addClass('form-group');
            if (config.glcl) {
                //outer.addClass('row');
                var c0 = me._fctx.form._cspan(config.glcl[0]), c1 = me._fctx.form._cspan(config.glcl[1]);
                colh.addClass('col-md-' + c0).css({ margin: 0, padding: 0, 'min-width': 160 });
                colc.addClass('col-md-' + c1).css({ margin: 0, padding: 0 });
            }
            me._targets = {
                header: colh,
                children: colc,
                row: row
            };
        }

        me.update = function () {
            var bg = me._props['background'].get();
            if (bg) {
                me._targets.row.addClass(bg);
            }
            else {
                me._targets.row.removeClass(bg);
            }
        }

        return me;
    }


    wbag.label = function (config) {
        var me = AuForms.FNode(config);

        AuForms.FProp(me, 'text', config.text);

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
            me._targets.outer.text(me._props['text'].get());
            me._targets.outer.css('opacity', me._enabled ? '' : 0.5);
        }

        return me;
    }


    wbag.textblock = function (config) {
        var me = AuForms.FNode(config);

        AuForms.FProp(me, 'text', config.text);

        me.build = function () {
            me._host.empty();
            var outer = $("<p>").attr({ id: me._uid }).addClass('form-control-static').appendTo(me._host);

            me._targets = {
                outer: outer
            };
        }

        me.update = function () {
            me._targets.outer.text(me._props['text'].get());
            me._targets.outer.css('opacity', me._enabled ? '' : 0.5);
            me._targets.outer.css('visibility', me._visible ? 'visible' : 'collapsed');
        }

        return me;
    }


    wbag.textbox = function (config) {
        var me = AuForms.FNode(config);

        AuForms.FProp(me, 'text', config.text);

        me.build = function () {
            me._host.empty();
            var grp = $('<div>').appendTo(me._host);
            if (config.pre) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(config.pre).appendTo(grp);
            }
            var inp = $("<input>").attr({ type: 'text', id: me._uid }).addClass('form-control').appendTo(grp);
            //if (fctx.layout.readonly) inp.attr("readonly", "");
            if (config.post) {
                grp.addClass('input-group');
                $('<span>').addClass('input-group-addon').text(config.post).appendTo(grp);
            }

            me._targets = {
                outer: grp
            };
        }

        me.update = function () {
            me._targets.outer.text(me._props['text'].get());
            me._targets.outer.css('opacity', me._enabled ? '' : 0.5);
            me._targets.outer.css('visibility', me._visible ? 'visible' : 'collapsed');
        }

        return me;
    }


    wbag.button = function (config) {
        var me = AuForms.FNode(config);

        AuForms.FProp(me, 'text', config.text);
        AuForms.FProp(me, 'icon', config.icon);
        AuForms.FProp(me, 'cssClass', config.cssClass);

        me.build = function () {
            me._host.empty();
            var outer = $('<button>').attr({
                type: 'button',
                id: me._uid,
            }).appendTo(me._host);

            me._targets = {
                outer: outer
            };
        }

        me.update = function () {
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
        }

        return me;
    }

    return wbag;
})(jQuery);
