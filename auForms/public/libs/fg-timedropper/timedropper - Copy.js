(function ($) {
    "use strict";

    $.fn.timeDropper = function (options, callbackFnk) {
        return $(this).each(function () {

            var
                _td_input = $(this),
                _td_widget,
                _td_options = $.extend({

                    format: 'h:mm a',
                    autoswitch: false,
                    meridians: false,
                    mousewheel: false,
                    setCurrentTime: false,
                    init_animation: "fadein",
                    primaryColor: "#1977CC",
                    borderColor: "#1977CC",
                    backgroundColor: "#FFF",
                    textColor: '#555',
                    //overlayContainer: null,
                    modal: false,
                    title: null
                }, options);


            var _td_mobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))


            var _td_num = function (n) {
                return n < 10 ? '0' + n : n
            };


            var _td_color = function (col, amt) {
                var usePound = false;
                if (col[0] == "#") {
                    col = col.slice(1);
                    usePound = true;
                }

                var num = parseInt(col, 16);

                var r = (num >> 16) + amt;
                if (r > 255) r = 255;
                else if (r < 0) r = 0;

                var b = ((num >> 8) & 0x00FF) + amt;
                if (b > 255) b = 255;
                else if (b < 0) b = 0;

                var g = (num & 0x0000FF) + amt;
                if (g > 255) g = 255;
                else if (g < 0) g = 0;

                return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
            };


            var _td_init = function (ctx) {
                var d = new Date(), h, m;
                var _td_span_h = ctx._td_c.find('.td-time span:first');
                var _td_span_m = ctx._td_c.find('.td-time span:last');

                var usecurr = !_td_input.val().length || _td_options.setCurrentTime;
                if (!usecurr) {
                    var reg = /\d+/g, am;
                    var st = _td_input.val().split(':');

                    if (st) {
                        h = st[0].match(reg);
                        m = st[1].match(reg);
                        if (_td_input.val().indexOf("am") != -1 || _td_input.val().indexOf("AM") != -1 || _td_input.val().indexOf("pm") != -1 || _td_input.val().indexOf("PM") != -1) {
                            if (_td_input.val().indexOf("am") != -1 || _td_input.val().indexOf("AM") != -1) am = true;
                            else am = false;

                            if (!am) {
                                if (h < 13) {
                                    h = parseInt(h) + 12;
                                    if (h == 24) h = 0;
                                }
                            } else if (h == 12) h = 0;
                        } else if (h == 24) h = 0;
                    } else {
                        usecurr = true;
                    }
                }
                if (usecurr) {
                    if (!parseInt(_td_span_h.text())) h = _td_num(d.getHours());
                    else h = _td_num(_td_span_h.text());
                    if (!parseInt(_td_span_m.text())) m = _td_num(d.getMinutes());
                    else m = _td_num(_td_span_m.text());
                }

                _td_span_h.attr('data-id', h).text(h);
                _td_span_m.attr('data-id', m).text(m);

                ctx._td_event_deg = Math.round((h * 360 / 23));

                ctx._td_c.find('.td-lancette div:first').css('transform', 'rotate(' + Math.round((m * 360 / 59)) + 'deg)');

                _td_rotation(ctx, ctx._td_event_deg);
                ctx._td_wheel_deg = ctx._td_event_deg;
                ctx._td_init_deg = -1;
            }

            var _td_create = function (ctx) {
                ctx._td_parentContainer = $('body');

                var ctr = $(
                    '<div class="td-wrap td-n2' + (_td_options.modal ? " td-wrap-modal" : "") + '">' +// id="td-clock-' + _td_id + '">' +
                    '    <div class="td-clock td-init">' +
                    '        <div class="td-deg td-n">' +
                    '            <div class="td-select">' +
                    '                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 35.4" enable-background="new 0 0 100 35.4" xml:space="preserve">' +
                    '                    <g fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">' +
                    '                        <path d="M98.1,33C85.4,21.5,68.5,14.5,50,14.5S14.6,21.5,1.9,33"/>' +
                    '                        <line x1="1.9" y1="33" x2="1.9" y2="28.6"/>' +
                    '                        <line x1="1.9" y1="33" x2="6.3" y2="33"/>' +
                    '                        <line x1="98.1" y1="33" x2="93.7" y2="33"/>' +
                    '                        <line x1="98.1" y1="33" x2="98.1" y2="28.6"/>' +
                    '                    </g>' +
                    '                </svg>' +
                    '            </div>' +
                    '        </div>' +
                    '        <div class="td-medirian">' +
                    '            <span class="td-icon-am td-n">AM</span>' +
                    '            <span class="td-icon-pm td-n">PM</span>' +
                    '        </div>' +
                    '        <div class="td-lancette"><div>' +
                    '        </div>' +
                    '            <div>' +
                    '            </div>' +
                    '        </div>' +
                    '        <div class="td-time">' +
                    '            <span class="on"></span>: <span></span>' +
                    '        </div>' +
                    '    </div>' +
                    '</div >'
                );
                ctx._td_container = ctr.appendTo(ctx._td_parentContainer);

                if (_td_options.modal && _td_options.title) {
                    $('<div>').addClass('td-title').text(_td_options.title).appendTo(ctr);
                }

                var ck = ctx._td_c = ctr.find('.td-clock');

                ck.css({
                    'color': _td_options.textColor,
                    'background': _td_options.backgroundColor,
                    'box-shadow': '0 0 0 1px ' + _td_options.borderColor + ',0 0 0 8px rgba(0, 0, 0, 0.05)'
                });
                ctr.find('.td-clock .td-time span.on').css({
                    'color': _td_options.primaryColor
                });
                ctr.find('.td-clock:before').css({
                    'border-color': _td_options.borderColor,
                    'background': _td_options.backgroundColor,
                });
                ctr.find('.td-select:after').css({
                    'box-shadow': '0 0 0 1px ' + _td_options.borderColor,
                    'background': _td_options.backgroundColor,
                });
                ctr.find('.td-lancette').css({
                    'border': '2px solid ' + _td_options.primaryColor,
                    'opacity': 0.1
                });
                ctr.find('.td-lancette div:after').css({
                    'background': _td_options.primaryColor
                });
                ctr.find('.td-bulletpoint div:after').css({
                    'background': _td_options.primaryColor,
                    'opacity': 0.1
                });
                ck.find('svg').attr('style', "stroke:" + _td_options.borderColor);
            }


            var _td_define_deg = function (ctx) {
                var o = ctx._td_c.find('.td-time span.on');
                var v = parseInt(o.attr('data-id'));
                var deg = (o.index() == 0) ? Math.round(v * 360 / 23) : Math.round(v * 360 / 59);

                ctx._td_init_deg = -1;
                ctx._td_event_deg = deg;
                ctx._td_wheel_deg = deg;
            };


            var _td_rotation = function (ctx, deg) {
                var t = ctx._td_c.find('.td-time span.on');

                var value = t.attr('data-id');
                if (!value) value = 0;

                var h = Math.round((deg * 23 / 360));
                var m = Math.round((deg * 59 / 360));

                if (t.index() == 0) {
                    t.attr('data-id', _td_num(h));

                    if (_td_options.meridians) {
                        if (h >= 12 && h < 24) {
                            ctx._td_c.find('.td-icon-pm').addClass('td-on');
                            ctx._td_c.find('.td-icon-am').removeClass('td-on');
                        } else {
                            ctx._td_c.find('.td-icon-am').addClass('td-on');
                            ctx._td_c.find('.td-icon-pm').removeClass('td-on');
                        }

                        if (h > 12) h = h - 12;
                        if (h == 0) h = 12;
                    }

                    t.text(_td_num(h));

                } else {
                    t.attr('data-id', _td_num(m)).text(_td_num(m));
                }

                ctx._td_wheel_deg = deg;
                ctx._td_c.find('.td-deg').css('transform', 'rotate(' + (deg) + 'deg)');

                if (t.index() == 0) {
                    var c = Math.round((h * 360 / 12));
                    ctx._td_c.find('.td-lancette div:last').css('transform', 'rotate(' + (c) + 'deg)');
                } else {
                    ctx._td_c.find('.td-lancette div:first').css('transform', 'rotate(' + (deg) + 'deg)');
                }

                var _td_h = ctx._td_c.find('.td-time span:first').attr('data-id');
                var _td_m = ctx._td_c.find('.td-time span:last').attr('data-id');

                var pm = Math.round(_td_h) >= 12 && Math.round(_td_h) < 24;
                var h = Math.round(_td_h) - (pm ? 12 : 0);
                if (h == 0) h = 12;

                var a = pm ? 'pm' : 'am';
                var A = a.toUpperCase();

                var str = _td_options.format
                    .replace(/\b(H)\b/g, Math.round(_td_h))
                    .replace(/\b(h)\b/g, Math.round(h))
                    .replace(/\b(m)\b/g, Math.round(_td_m))
                    .replace(/\b(HH)\b/g, _td_num(Math.round(_td_h)))
                    .replace(/\b(hh)\b/g, _td_num(Math.round(h)))
                    .replace(/\b(mm)\b/g, _td_num(Math.round(_td_m)))
                    .replace(/\b(a)\b/g, a)
                    .replace(/\b(A)\b/g, A);

                _td_input.val(str);
                _td_input.trigger("change");
            };


            var dragger = function (ctx) {
                var exp = {};
                var a, b, deg, tmp, offset, center;

                function hnd(e) {
                    var move = (_td_mobile && e.originalEvent.touches && e.originalEvent.touches[0]) || e;
                    a = center.y - move.pageY;
                    b = center.x - move.pageX;
                    deg = Math.atan2(a, b) * 180 / Math.PI;
                    if (deg < 0) deg = 360 + deg;

                    if (ctx._td_init_deg == -1) ctx._td_init_deg = deg;

                    tmp = Math.floor((deg - ctx._td_init_deg) + ctx._td_event_deg);

                    if (tmp < 0) tmp = 360 + tmp;
                    else if (tmp > 360) tmp = tmp % 360;

                    _td_rotation(ctx, tmp);
                }

                exp.begin = function (e) {
                    _td_define_deg(ctx);
                    clearInterval(ctx._td_alert);

                    ctx._td_c.find('.td-deg').removeClass('td-n');
                    ctx._td_c.find('.td-select').removeClass('td-rubber');

                    offset = ctx._td_c.offset();
                    center = {
                        y: offset.top + ctx._td_c.height() / 2,
                        x: offset.left + ctx._td_c.width() / 2
                    };

                    $(window).on('touchmove mousemove', hnd);

                    ctx._td_c.removeClass('td-rubber');
                }

                exp.end = function () {
                    $(window).off('touchmove mousemove', hnd);
                }

                return exp;
            }


            var widgeter = function (ctx) {
                var exp = {};
                var drag;

                function fnup() {
                    if (_td_options.autoswitch) {
                        ctx._td_c.find('.td-time span').toggleClass('on');
                        ctx._td_c.find('.td-time span.on').click();
                    }

                    ctx._td_c.find('.td-deg').addClass('td-n');
                    ctx._td_c.find('.td-select').addClass('td-rubber');
                    if (drag) drag.end();
                }

                function fnovl() {
                    ctx._td_container.addClass('td-fadeout').removeClass('td-' + _td_options.init_animation);
                    ctx._td_overlay.addClass('td-fadeout').removeClass('td-' + _td_options.init_animation);
                    ctx._td_event = setTimeout(function () {
                        ctx._td_container.removeClass('td-show');
                        ctx._td_overlay.remove();
                        if (ctx.closed) ctx.closed();
                    }, 300);
                }

                exp.begin = function () {
                    clearInterval(ctx._td_event);

                    _td_create(ctx);

                    ctx._td_init_deg = -1;
                    ctx._td_event_deg = 0;
                    ctx._td_wheel_deg = 0;

                    ctx._td_c.find('.td-time span').on('click', function (e) {
                        var o = $(this);
                        ctx._td_c.find('.td-time span').removeClass('on');
                        o.addClass('on');

                        var v = parseInt(o.attr('data-id'));
                        var deg = (o.index() == 0) ? Math.round((v * 360 / 23)) : Math.round((v * 360 / 59));

                        ctx._td_init_deg = -1;
                        ctx._td_event_deg = deg;
                        ctx._td_wheel_deg = deg;
                        _td_rotation(ctx, deg);
                    });

                    ctx._td_c.find('.td-deg').on('touchstart mousedown', function (e) {
                        e.preventDefault();
                        drag = dragger(ctx);
                        drag.begin();
                    });

                    if (_td_options.mousewheel) {
                        ctx._td_c.on('mousewheel', function (e) {
                            e.preventDefault();
                            ctx._td_c.find('.td-deg').removeClass('td-n');

                            if (e.originalEvent.wheelDelta > 0) {
                                if (ctx._td_wheel_deg <= 360) {
                                    if (e.originalEvent.wheelDelta <= 120) ctx._td_wheel_deg++
                                    else if (e.originalEvent.wheelDelta > 120) ctx._td_wheel_deg = ctx._td_wheel_deg + 20;
                                    if (ctx._td_wheel_deg > 360) ctx._td_wheel_deg = 0;
                                }
                            } else {
                                if (ctx._td_wheel_deg >= 0) {
                                    if (e.originalEvent.wheelDelta >= -120) ctx._td_wheel_deg--
                                    else if (e.originalEvent.wheelDelta < -120) ctx._td_wheel_deg = ctx._td_wheel_deg - 20;
                                    if (ctx._td_wheel_deg < 0) ctx._td_wheel_deg = 360;
                                }
                            }

                            ctx._td_init_deg = -1;
                            ctx._td_event_deg = ctx._td_wheel_deg;
                            _td_rotation(ctx._td_wheel_deg);
                        });
                    }

                    _td_init(ctx);
                    $(document).on('touchend mouseup', fnup);

                    ctx._td_container.removeClass('td-fadeout');
                    ctx._td_container.addClass('td-show').addClass('td-' + _td_options.init_animation);

                    ctx._td_overlay = $('<div>').addClass('td-overlay').appendTo('body');
                    ctx._td_overlay.on("click", fnovl);

                    if (_td_options.modal) {
                        ctx._td_overlay.addClass("td-overlay-modal");
                    }
                    else {
                        var inputOffset = _td_input.offset();
                        var parentContainerOffset = ctx._td_parentContainer.offset();
                        _td_c.css({
                            'top': (inputOffset.top - parentContainerOffset.top + (_td_input.outerHeight() - 8)),
                            'left': (inputOffset.left - parentContainerOffset.left + (_td_input.outerWidth() / 2)) - (ctx._td_c.outerWidth() / 2)
                        });
                    }

                    if (ctx._td_c.hasClass('td-init')) {
                        ctx._td_alert = setInterval(function () {
                            ctx._td_c.find('.td-select').addClass('td-alert');
                            setTimeout(function () {
                                ctx._td_c.find('.td-select').removeClass('td-alert');
                            }, 1000);
                        }, 2000);
                        ctx._td_c.removeClass('td-init');
                    }
                }

                exp.end = function () {
                    $(document).off('touchend mouseup', fnup);
                    if (drag) drag.end();
                    ctx._td_container.remove();
                }

                return exp;
            }


            _td_input.prop({
                'readonly': true
            }).addClass('td-input');


            _td_input.focus(function (e) {
                e.preventDefault();
                _td_input.blur();
            });


            _td_input.click(function (e) {
                var ctx = {};
                _td_widget = widgeter(ctx);
                _td_widget.begin();
                ctx.closed = function () {
                    _td_widget.end();
                    _td_widget = null;
                }
            });

            //if (!_td_options.modal) {
            //    $(window).on('resize', function () {

            //        _td_define_deg();

            //        var inputOffset = _td_input.offset();
            //        var parentContainerOffset = _td_parentContainer.offset();
            //        _td_c.css({
            //            'top': (inputOffset.top - parentContainerOffset.top + (_td_input.outerHeight() - 8)),
            //            'left': (inputOffset.left - parentContainerOffset.left + (_td_input.outerWidth() / 2)) - (_td_c.outerWidth() / 2)
            //        });
            //    });
            //}

        });
    };
} (jQuery));