(function ($) {
    "use strict";

    $.fn.fgTimeDropper = function (options) {
        return this.each(function () {
            var obj = TimeDropper();
            obj.init(options, this);
            $(this).data('fgTimeDropper', obj);
        });
    };


    $.fn.fgTimeDropper.options = {
        locale: null,
        mousewheel: false,
        init_animation: "fadein",
        primaryColor: "#1977CC",
        borderColor: "#1977CC",
        backgroundColor: "#FFF",
        textColor: '#555',
        //overlayContainer: null,
        modal: false,
        title: null
    }


    function TimeDropper() {

        function create() {
            container = $(
                '<div class="fg-time-wrap fg-time-n2' + (me.options.modal ? " fg-time-wrap-modal" : "") + '">' +
                '    <div class="fg-time-clock fg-time-init">' +
                '        <div class="fg-time-deg fg-time-n">' +
                '            <div class="fg-time-select">' +
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
                '        <div class="fg-time-lancette"><div/><div/></div>' +
                '        <div class="fg-time-time"></div>' +
                '        <div class="fg-time-pad fg-time-hour"></div>' +
                '        <div class="fg-time-pad fg-time-minute"></div>' +
                '    </div>' +
                '</div >'
            ).appendTo($('body'));

            if (me.options.modal && me.options.title) {
                $('<div>').addClass('fg-time-title').text(me.options.title).appendTo(container);
            }

            container.find('.fg-time-clock').css({
                'color': me.options.textColor,
                'background': me.options.backgroundColor,
                'box-shadow': '0 0 0 1px ' + me.options.borderColor + ',0 0 0 8px rgba(0, 0, 0, 0.05)'
            });
            container.find('.fg-time-pad-on').css({
                'border-bottom-color': me.options.primaryColor
            });
            container.find('.fg-time-clock:before').css({
                'border-color': me.options.borderColor,
                'background': me.options.backgroundColor,
            });
            container.find('.fg-time-select:after').css({
                'box-shadow': '0 0 0 1px ' + me.options.borderColor,
                'background': me.options.backgroundColor,
            });
            container.find('.fg-time-lancette').css({
                'border': '2px solid ' + me.options.primaryColor,
                'opacity': 0.1
            });
            container.find('.fg-time-lancette div:after').css({
                'background': me.options.primaryColor
            });
            container.find('.fg-time-bulletpoint div:after').css({
                'background': me.options.primaryColor,
                'opacity': 0.1
            });
            container.find('svg').attr('style', "stroke:" + me.options.borderColor);

            container.find('.fg-time-hour').on('click', function (e) {
                select('h');
            });
            container.find('.fg-time-minute').on('click', function (e) {
                select('m');
            });

            container.find('.fg-time-deg').on('touchstart mousedown', function (e) {
                e.preventDefault();
                drag = dragger();
                drag.begin();
            });

            if (me.options.mousewheel) {
                container.on('mousewheel', wheel);
            }

            $(document).on('touchend mouseup', mouseup);

            container.removeClass('fg-time-fadeout');
            container.addClass('fg-time-' + me.options.init_animation);

            overlay = $('<div>').addClass('fg-time-overlay').appendTo('body');
            overlay.on("click", overclick);

            var clock = container.children('.fg-time-clock');
            if (me.options.modal) {
                overlay.addClass("fg-time-overlay-modal");
            }
            else {
                var inputOffset = me.$elem.offset();
                var parentContainerOffset = container.parent().offset();
                clock.css({
                    'top': (inputOffset.top - parentContainerOffset.top + (me.$elem.outerHeight() - 8)),
                    'left': (inputOffset.left - parentContainerOffset.left + (me.$elem.outerWidth() / 2)) - (clock.outerWidth() / 2)
                });
            }

            if (clock.hasClass('fg-time-init')) {
                tmr_alert = setInterval(function () {
                    container.find('.fg-time-select').addClass('fg-time-alert');
                    setTimeout(function () {
                        container && container.find('.fg-time-select').removeClass('fg-time-alert');
                    }, 1000);
                }, 2000);
                clock.removeClass('fg-time-init');
            }
        }


        //TODO
        function wheel(e) {
            e.preventDefault();
            container.find('.fg-time-deg').removeClass('fg-time-n');
            if (e.originalEvent.wheelDelta > 0) {
                if (wheel_deg <= 360) {
                    if (e.originalEvent.wheelDelta <= 120) wheel_deg++
                    else if (e.originalEvent.wheelDelta > 120) wheel_deg = wheel_deg + 20;
                    if (wheel_deg > 360) wheel_deg = 0;
                }
            } else {
                if (wheel_deg >= 0) {
                    if (e.originalEvent.wheelDelta >= -120) wheel_deg--
                    else if (e.originalEvent.wheelDelta < -120) wheel_deg = wheel_deg - 20;
                    if (wheel_deg < 0) wheel_deg = 360;
                }
            }
            //init_deg = -1;
            //event_deg = wheel_deg;
            //rotation(wheel_deg);
        }


        function mouseup() {
            container.find('.fg-time-deg').addClass('fg-time-n');
            if (drag) drag.end();
            drag = null;
        }


        function overclick() {
            container.addClass('fg-time-fadeout').removeClass('fg-time-' + me.options.init_animation);
            overlay.addClass('fg-time-fadeout').removeClass('fg-time-' + me.options.init_animation);
            setTimeout(function () {
                clearInterval(tmr_alert);
                overlay.remove();
                $(document).off('touchend mouseup', mouseup);
                if (drag) drag.end();
                container.remove();
                container = overlay = drag = null;
            }, 300);
        }


        function select(sel) {
            selected = sel;
            updateAngles();
            update();
        }


        function updateAngles() {
            angles.hour = Math.round(hour * 360 / 24);
            angles.minute = Math.round(minute * 360 / 60);
            angles.knob = selected === 'm' ? angles.minute : angles.hour;
        }


        function updateTime() {
            hour = Math.round(angles.hour / 360 * 24) % 24;
            minute = Math.round(angles.minute / 360 * 60) % 60;
        }


        function update() {
            var lm = moment({ hour: hour, minute: minute });
            lm.locale(me.options.locale);
            var t = lm.format('LT');
            me.$elem.val(t).trigger("change");

            if (container) {
                container.find('.fg-time-time').text(t);

                var spans = container.find('.fg-time-pad').removeClass('fg-time-pad-on');
                spans.eq(selected === 'm' ? 1 : 0).addClass('fg-time-pad-on');

                container.find('.fg-time-deg').css('transform', 'rotate(' + angles.knob + 'deg)');

                var lanc = container.find('.fg-time-lancette div');
                lanc.eq(0).css('transform', 'rotate(' + angles.hour + 'deg)');
                lanc.eq(1).css('transform', 'rotate(' + angles.minute + 'deg)');
            }
        }


        function dragger() {
            var center, oangle, iangle;

            function handler(e) {
                var move = (isMobile && e.originalEvent.touches && e.originalEvent.touches[0]) || e;
                var a = center.y - move.pageY;
                var b = center.x - move.pageX;
                var deg = Math.atan2(a, b) * 180 / Math.PI;
                if (deg < 0) deg = 360 + deg;
                if (iangle < 0) iangle = deg;

                angles.knob = (360 + Math.floor((deg - iangle) + oangle)) % 360;
                if (selected === 'm') {
                    angles.minute = angles.knob;
                }
                else {
                    angles.hour = angles.knob;
                }
                updateTime();
                update();
            }

            return {
                begin: function (e) {
                    oangle = angles.knob;
                    iangle = -1;
                    container.find('.fg-time-deg').removeClass('fg-time-n');

                    var offset = container.offset();
                    center = {
                        y: offset.top + container.height() / 2,
                        x: offset.left + container.width() / 2
                    };

                    $(window).on('touchmove mousemove', handler);
                },

                end: function () {
                    $(window).off('touchmove mousemove', handler);
                }
            }
        }


        var me = {}, container, overlay, selected, drag, tmr_alert;
        var hour, minute, angles = {};
        var isMobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

        me.getHour = function () { return hour; }
        me.setHour = function (v) {
            hour = Math.max(0, Math.min(23, v));
            updateAngles();
            update();
        }

        me.getMinute = function () { return minute; }
        me.setMinute = function (v) {
            minute = Math.max(0, Math.min(59, v));
            updateAngles();
            update();
        }

        me.from = function (obj) {
            var lm = moment(obj);
            me.setHour(lm.hour());
            me.setMinute(lm.minute());
        }

        me.init = function (options, elem) {
            me.$elem = $(elem);
            me.options = $.extend({}, $.fn.fgTimeDropper.options, options);

            me.$elem.prop({
                'readonly': true
            }).addClass('fg-time-input');

            me.$elem.focus(function (e) {
                e.preventDefault();
                me.$elem.blur();
            });

            me.$elem.click(function (e) {
                create();
                select('h');
            });
        }

        return me;
    }

} (jQuery));