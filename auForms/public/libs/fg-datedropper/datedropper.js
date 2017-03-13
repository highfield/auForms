(function ($) {

    $.fn.fgDateDropper = function (options) {
        return this.each(function () {
            var obj = DateDropper();
            obj.init(options, this);
            $(this).data('fgDateDropper', obj);
        });
    };


    $.fn.fgDateDropper.options = {
        locale: null,
        //mousewheel: false,
        //init_animation: "fadein",
        //primaryColor: "#1977CC",
        //borderColor: "#1977CC",
        //backgroundColor: "#FFF",
        //textColor: '#555',
        ////overlayContainer: null,
        //modal: false,
        title: null
    }


    function DateDropper() {

        function create() {
            picker = $('<div>').addClass('fg-date').addClass(me.options.theme || 'primary').appendTo('body');
            if (me.options.modal) picker.addClass('fg-date-modal');
            if (me.options.fx) picker.addClass('picker-fxs');
            if (me.options.large && me.options['large-default']) picker.addClass('picker-lg');
            var inner = $('<div>').addClass('picker').appendTo(picker);

            if (me.options.modal && me.options.title) {
                $('<div>').addClass('fg-date-title').text(me.options.title).appendTo(picker);
            }

            ['m', 'd', 'y'].forEach(function (k) {
                $('<ul>').addClass('pick pick-' + k).attr('data-k', k).appendTo(inner);
                picker_render_ul(k);
            });

            if (me.options.large) {
                //calendar
                var cc = $('<div>').addClass('pick-lg').insertBefore(picker.find('.pick-d'));
                var uh = $('<ul>').addClass('pick-lg-h').appendTo(cc);
                var ub = $('<ul>').addClass('pick-lg-b').appendTo(cc);

                for (var i = 0; i < 7; i++) {
                    $('<li>').text(dttemp.localeData().weekdaysShort()[i]).appendTo(uh)
                }
                for (var i = 0; i < 42; i++) {
                    $('<li>').appendTo(ub)
                }
            }

            //buttons
            var pb = $('<div>').addClass('pick-btns').appendTo(inner);
            $('<div>').addClass('pick-submit').appendTo(pb);
            if (me.options.large) {
                $('<div>').addClass('pick-btn pick-btn-sz').appendTo(pb);
            }

            hookevents('on');
        }


        function hookevents(mode) {
            // CSS EVENT DETECT
            var csse = {
                t: 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
                a: 'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend'
            };
            var picker_node_el = '.fg-date.picker-focus';
            var ui_event;
            if (isMobile) {
                ui_event = {
                    i: 'touchstart',
                    m: 'touchmove',
                    e: 'touchend'
                }
            }
            else {
                ui_event = {
                    i: 'mousedown',
                    m: 'mousemove',
                    e: 'mouseup'
                }
            }

            $(document)[mode]('click', hClosePicker);
            $(document)[mode](csse.a, picker_node_el + '.picker-rmbl', hLockAnimation);
            $(document)[mode](csse.t, '.fg-date-modal-overlay', hHideModalOverlay);
            $(document)[mode](ui_event.i, picker_node_el + ' .pick-lg li.pick-v', hLargeModeDay);
            $(document)[mode]('click', picker_node_el + ' .pick-btn-sz', hLargeMode);

            $(document)[mode](ui_event.i, picker_node_el + ' .pick-arw.pick-arw-s2', hJump);
            $(document)[mode](ui_event.i, picker_node_el + ' .pick-arw.pick-arw-s1', hDefaultArrow);
            $(document)[mode](ui_event.i, picker_node_el + ' ul.pick.pick-y li', hJump2a);
            $(document)[mode](ui_event.e, picker_node_el + ' ul.pick.pick-y li', hJump2b);

            $(document)[mode](ui_event.i, picker_node_el + ' ul.pick.pick-d li', hToggleCalendar1a);
            $(document)[mode](ui_event.e, picker_node_el + ' ul.pick.pick-d li', hToggleCalendar1b);

            $(document)[mode](ui_event.i, picker_node_el + ' ul.pick', hMouseDownOnUL);
            $(document)[mode](ui_event.m, hMouseMoveOnUL);
            $(document)[mode](ui_event.e, hMouseUpOnUL);

            $(document)[mode](ui_event.i, picker_node_el + ' .pick-submit', hSubmit);
            $(window)[mode]('resize', hResize);
        }


        function hClosePicker(e) {
            if (drag) return;
            if (!me.$elem.is(e.target) && !picker.is(e.target) && picker.has(e.target).length === 0) {
                picker_hide();
                drag = null;
            }
        }

        function hLockAnimation() {
            if (picker.hasClass('picker-rmbl')) $(this).removeClass('picker-rmbl');
        }

        function hHideModalOverlay() {
            $(this).remove();
        }

        function hLargeModeDay() {
            picker.find('.pick-lg-b li').removeClass('pick-sl');
            $(this).addClass('pick-sl');
            dttemp.date($(this).attr('data-value'));
            picker_ul_transition('d', $(this).attr('data-value'));
        }

        function hLargeMode() {
            picker_large_onoff();
        }

        function hJump(e) {
            e.preventDefault();
            drag = null;

            var k = $(this).closest('ul').data('k');
            var i = dttemp.year() + me.options.jump * ($(this).hasClass('pick-arw-r') ? 1 : -1);
            var jumped_array = get_jumped('y', me.options.jump);
            if (i > jumped_array[jumped_array.length - 1]) i = jumped_array[0];
            if (i < jumped_array[0]) i = jumped_array[jumped_array.length - 1];
            dttemp.year(i);
            picker_ul_transition('y', dttemp.year());
        }

        function hDefaultArrow(e) {
            e.preventDefault();
            drag = null;
            var k = $(this).closest('ul').data('k');
            picker_ul_turn(k, ($(this).hasClass('pick-arw-r') ? 1 : -1));
        }

        function hJump2a() {
            is_click = true;
        }

        function hJump2b() {
            if (is_click) {
                $(this).closest('ul').toggleClass('pick-jump');
                var jumped = get_closest_jumped(dttemp.year(), get_jumped('y', jump));
                dttemp.year(jumped);
                picker_ul_transition('y', dttemp.year());
                is_click = false;
            }
        }

        function hToggleCalendar1a() {
            is_click = true;
        }

        function hToggleCalendar1b() {
            if (is_click) {
                picker_large_onoff();
                is_click = false;
            }
        }

        function hMouseDownOnUL(e) {
            var el = $(this);
            if (el) {
                drag = {
                    el: el,
                    k: el.data('k'),
                    offset: isMobile ? e.originalEvent.touches[0].pageY : e.pageY,
                    d: dttemp.date(),
                    m: dttemp.month(),
                    y: dttemp.year()
                };
                drag.init = get_current(drag.k);
            }
        }

        function hMouseMoveOnUL(e) {
            is_click = false;
            if (drag) {
                e.preventDefault();
                var o = isMobile ? e.originalEvent.touches[0].pageY : e.pageY;
                o = Math.round((drag.offset - o) * .026);
                dttemp.set({ year: drag.y, month: drag.m, date: drag.d });
                picker_ul_turn(drag.k, o);
            }
        }

        function hMouseUpOnUL() {
            if (drag) {
                setTimeout(function () {
                    drag = null;
                }, 100);
            }
        }

        function hSubmit() {
            dtcurr = dttemp;
            picker_hide();
            input_change_value();
        }

        function hResize() {
            picker_offset();
            is_fx_mobile();
        }


        /**
         * Support functions
         */

        function is_fx_mobile() {
            if (picker && me.options.fx && !me.options.fxmobile) {
                if ($(window).width() < 480)
                    picker.removeClass('picker-fxs');
                else
                    picker.addClass('picker-fxs')
            }
        }


        function is_locked() {
            return false;
            //if (me.options.lock) {
            //    if (me.options.lock == 'from') {
            //        if (unix_current < unix_today) {
            //            picker_alert();
            //            picker.addClass('picker-lkd');
            //            return true;
            //        }
            //        else {
            //            picker.removeClass('picker-lkd');
            //            return false;
            //        }
            //    }
            //    if (me.options.lock == 'to') {
            //        if (unix_current > unix_today) {
            //            picker_alert();
            //            picker.addClass('picker-lkd');
            //            return true;
            //        }
            //        else {
            //            picker.removeClass('picker-lkd');
            //            return false;
            //        }
            //    }
            //}

            //if (pickers[picker.id].disabledays) {
            //    if (pickers[picker.id].disabledays.indexOf(unix_current) != -1) {
            //        picker_alert();
            //        picker.addClass('picker-lkd');
            //        return true;
            //    }
            //    else {
            //        picker.removeClass('picker-lkd');
            //        return false;
            //    }
            //}
        }


        function get_current(k) {
            switch (k) {
                case 'd': return dttemp.date();
                case 'm': return dttemp.month() + 1;
                case 'y': return dttemp.year();
            }
        }


        function set_current(k, v) {
            switch (k) {
                case 'd': dttemp.date(v); break;
                case 'm': dttemp.month(v - 1); break;
                case 'y': dttemp.year(v); break;
            }
        }


        function get_jumped(k, val) {
            var a = [];
            for (var i = LT[k].min; i <= LT[k].max; i++) {
                if (i % val == 0) a.push(i);
            }
            return a;
        }


        function get_closest_jumped(int, arr) {
            var c = arr[0];
            var d = Math.abs(int - c);
            for (var i = 0; i < arr.length; i++) {
                var n = Math.abs(int - arr[i]);
                if (n < d) {
                    d = n;
                    c = arr[i];
                }
            }
            return c;
        }


        function get_ul(k) {
            return picker.find('ul.pick[data-k="' + k + '"]');
        }


        function get_eq(k, d) {
            var o = [];
            get_ul(k).find('li').each(function () {
                o.push($(this).attr('value'));
            });

            if (d === 'last')
                return o[o.length - 1];
            else
                return o[0];
        }


        function picker_large_onoff() {
            if (me.options.large) {
                picker.toggleClass('picker-lg');
                picker_render_calendar();
            }
        }


        function picker_offset() {
            if (!picker.hasClass('fg-date-modal')) {
                var left = me.$elem.offset().left + me.$elem.outerWidth() / 2;
                var top = me.$elem.offset().top + me.$elem.outerHeight();
                picker.css({
                    'left': left,
                    'top': top
                });
            }
        }


        function picker_show() {
            if (picker.hasClass('picker-lg')) picker_render_calendar();
            picker_fills();
            picker.addClass('picker-focus');
        }


        function picker_hide() {
            if (!is_locked()) {
                picker.removeClass('picker-focus');
                if (picker.hasClass('fg-date-modal')) {
                    $('.fg-date-modal-overlay').remove();
                }
                hookevents('off');
                picker.remove();
                picker = null;
            }
        }


        function picker_render_ul(k) {
            var ul = get_ul(k);
            for (var i = LT[k].min; i <= LT[k].max; i++) {
                var html = i;
                switch (k) {
                    case 'd': html += '<span></span>'; break;
                    case 'm': html = moment.monthsShort()[i - 1]; break;
                }
                $('<li>', {
                    value: i,
                    html: html
                }).appendTo(ul);
            }

            //PREV BUTTON
            var prev = $('<div>').addClass('pick-arw pick-arw-s1 pick-arw-l').appendTo(ul);
            $('<i>').addClass('pick-i-l').appendTo(prev);

            //NEXT BUTTON
            $('<div>', {
                class: 'pick-arw pick-arw-s1 pick-arw-r',
                html: $('<i>', {
                    class: 'pick-i-r'
                })
            }).appendTo(ul);

            if (k === 'y') {
                //PREV BUTTON
                $('<div>', {
                    class: 'pick-arw pick-arw-s2 pick-arw-l',
                    html: $('<i>', {
                        class: 'pick-i-l'
                    })
                }).appendTo(ul);

                //NEXT BUTTON
                $('<div>', {
                    class: 'pick-arw pick-arw-s2 pick-arw-r',
                    html: $('<i>', {
                        class: 'pick-i-r'
                    })
                }).appendTo(ul);
            }

            picker_ul_transition(k, get_current(k));
        }


        function picker_render_calendar() {
            var index = 0;
            var w = picker.find('.pick-lg-b');
            w.find('li')
                .empty()
                .removeClass('pick-n pick-b pick-a pick-v pick-lk pick-sl pick-h')
                .attr('data-value', '');

            var
                //_C = new Date(get_current_full()),
                _S = new Date(get_current_full()),
                _L = new Date(get_current_full()),
                _NUM = function (d) {
                    var
                        m = d.getMonth(),
                        y = d.getFullYear();
                    var l = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));
                    return [31, (l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
                };

            _L.setMonth(_L.getMonth() - 1);
            _S.setDate(1);

            var
                o = _S.getDay() - 1;
            if (o < 0)
                o = 6;
            if (i18n[pickers[picker.id].lang].gregorian) {
                o--;
                if (o < 0)
                    o = 6;
            }

            //before
            for (var i = _NUM(_L) - o; i <= _NUM(_L); i++) {
                w.find('li').eq(index)
                    .html(i)
                    .addClass('pick-b pick-n pick-h');
                index++;
            }
            //current
            for (var i = 1; i <= _NUM(_S); i++) {
                w.find('li').eq(index)
                    .html(i)
                    .addClass('pick-n pick-v')
                    .attr('data-value', i);
                index++;
            }
            //after
            if (w.find('li.pick-n').length < 42) {
                var
                    e = 42 - w.find('li.pick-n').length;
                for (var i = 1; i <= e; i++) {
                    w.find('li').eq(index).html(i)
                        .addClass('pick-a pick-n pick-h');
                    index++;
                }
            }
            if (pickers[picker.id].lock) {
                if (pickers[picker.id].lock === 'from') {
                    if (get_current('y') <= get_today('y')) {
                        if (get_current('m') == get_today('m')) {
                            get_picker_els('.pick-lg .pick-lg-b li.pick-v[data-value="' + get_today('d') + '"]')
                                .prevAll('li')
                                .addClass('pick-lk')
                        }
                        else {
                            if (get_current('m') < get_today('m')) {
                                get_picker_els('.pick-lg .pick-lg-b li')
                                    .addClass('pick-lk')
                            }
                            else if (get_current('m') > get_today('m') && get_current('y') < get_today('y')) {
                                get_picker_els('.pick-lg .pick-lg-b li')
                                    .addClass('pick-lk')
                            }
                        }
                    }
                }
                else {
                    if (get_current('y') >= get_today('y')) {
                        if (get_current('m') == get_today('m')) {
                            get_picker_els('.pick-lg .pick-lg-b li.pick-v[data-value="' + get_today('d') + '"]')
                                .nextAll('li')
                                .addClass('pick-lk')
                        }
                        else {
                            if (get_current('m') > get_today('m')) {
                                get_picker_els('.pick-lg .pick-lg-b li')
                                    .addClass('pick-lk')
                            }
                            else if (get_current('m') < get_today('m') && get_current('y') > get_today('y')) {
                                get_picker_els('.pick-lg .pick-lg-b li')
                                    .addClass('pick-lk')
                            }
                        }
                    }
                }
            }
            if (pickers[picker.id].disabledays) {
                $.each(pickers[picker.id].disabledays, function (i, v) {
                    if (v && is_date(v)) {
                        var
                            d = new Date(v * 1000);
                        if (d.getMonth() + 1 == get_current('m') && d.getFullYear() == get_current('y'))
                            get_picker_els('.pick-lg .pick-lg-b li.pick-v[data-value="' + d.getDate() + '"]')
                                .addClass('pick-lk');
                    }
                });
            }

            get_picker_els('.pick-lg-b li.pick-v[data-value=' + get_current('d') + ']').addClass('pick-sl');
        }


        function picker_fills() {
            var m = get_current('m');
            var y = get_current('y');
            LT.d.max = dttemp.daysInMonth();;

            picker.find('.pick-d li')
                .removeClass('pick-wke')
                .each(function () {
                    var d = new Date(m + "/" + $(this).attr('value') + "/" + y).getDay();
                    $(this).find('span').html(moment.weekdays()[d]);
                    if (d === 0 || d === 6) $(this).addClass('pick-wke');

                });

            if (picker.hasClass('picker-lg')) {
                picker.find('.pick-lg-b li').removeClass('pick-wke');
                picker.find('.pick-lg-b li.pick-v')
                    .each(function () {
                        var d = new Date(m + "/" + $(this).attr('data-value') + "/" + y).getDay();
                        if (d == 0 || d == 6) $(this).addClass('pick-wke');

                    });
            }
        }


        function picker_ul_transition(k, i) {
            var ul = get_ul(k);
            ul.find('li').removeClass('pick-sl pick-bfr pick-afr');

            if (i === get_eq(k, 'last')) {
                var li = ul.find('li[value="' + get_eq(k, 'first') + '"]');
                li.clone().insertAfter(ul.find('li[value=' + i + ']'));
                li.remove();
            }
            if (i === get_eq(k, 'first')) {
                var li = ul.find('li[value="' + get_eq(k, 'last') + '"]');
                li.clone().insertBefore(ul.find('li[value=' + i + ']'));
                li.remove();
            }

            ul.find('li[value=' + i + ']').addClass('pick-sl');
            ul.find('li.pick-sl').nextAll('li').addClass('pick-afr');
            ul.find('li.pick-sl').prevAll('li').addClass('pick-bfr');
        }


        function picker_ul_turn(k, dir) {
            var mk = k === 'm' ? 'M' : k;
            var temp = dttemp.clone();
            temp.add(dir, mk);
            temp = moment.max(temp, dtmin.clone());
            dttemp = moment.min(temp, dtmax.clone());

            ['d', 'm', 'y'].forEach(function (kk) {
                picker_ul_transition(kk, get_current(kk));
            });
            console.log(dttemp.toISOString());
        }


        function picker_alert() {
            picker.addClass('picker-rmbl');
        }


        function input_change_value() {
            var str = dtcurr.format('ll');
            me.$elem.val(str).change();
        }


        /**
         * Exposed object
         */

        var me = {}, picker;
        var is_click = false, drag;
        var dtcurr, dttemp, dtmin, dtmax;
        var isMobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        var LT = {
            d: { min: 1, max: 31 },
            m: { min: 1, max: 12 },
            y: { min: 1, max: 9999 }
        }

        me.init = function (options, elem) {
            me.$elem = $(elem);
            me.options = $.extend({}, $.fn.fgDateDropper.options, options);

            dtmin = moment(me.options.min || { year: 2000 }, null, me.options.lang);
            dtmax = moment(me.options.max || { year: 2050 }, null, me.options.lang);
            LT.y.min = dtmin.year();
            LT.y.max = dtmax.year();

            me.$elem.prop({
                'readonly': true
            }).addClass('fg-date-input');

            me.$elem.focus(function (e) {
                e.preventDefault();
                me.$elem.blur();
            });

            me.$elem.click(function (e) {
                dttemp = dtcurr.clone();
                create();
                is_fx_mobile();
                picker_offset();
                picker_show();

                if (picker.hasClass('fg-date-modal')) {
                    $('body').append('<div class="fg-date-modal-overlay"></div>')
                }
            });

            dtcurr = moment();
            dtcurr.locale(me.options.lang);
            input_change_value();
        }

        return me;
    }

} (jQuery));
