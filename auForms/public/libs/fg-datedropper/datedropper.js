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
            container = $('<div>').addClass('fg-date').addClass(me.options.theme || 'primary').appendTo('body');
            if (me.options.modal) container.addClass('fg-date-modal');
            if (me.options.fx) container.addClass('picker-fxs');
            if (me.options.large && me.options['large-default']) container.addClass('picker-lg');
            picker = $('<div>').addClass('picker').appendTo(container);

            if (me.options.modal && me.options.title) {
                $('<div>').addClass('fg-date-title').text(me.options.title).appendTo(picker);
            }

            for (var k in pickers[id].key) {
                $('<ul>').addClass('pick pick-' + k).attr('data-k',k).appendTo(picker);
                picker_render_ul(k);
            }

            if (me.options.large) {
                //calendar
                var cc = $('<div>').addClass('pick-lg').insertBefore(picker.find('.pick-d'));
                var uh = $('<ul>').addClass('pick-lg-h').appendTo(cc);
                var ub = $('<ul>').addClass('pick-lg-b').appendTo(cc);

                var ml = moment();
                ml.locale(me.options.lang);
                for (var i = 0; i < 7; i++) {
                    $('<li>').text(ml.localeData().weekdaysShort()[i]).appendTo(uh)
                }
                for (var i = 0; i < 42; i++) {
                    $('<li>').appendTo(ub)
                }
            }

            //buttons
            var pb = $('<div>').addClass('pick-btns').appendTo(picker);
            $('<div>').addClass('pick-submit').appendTo(pb);
            if (me.options.large) {
                $('<div>').addClass('pick-btn pick-btn-sz').appendTo(pb);
            }
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
            $(document)[mode](csse.t, '.picker-modal-overlay', hHideModalOverlay);
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
            if (!me.$elem.is(e.target) && !picker.is(e.target) && picker.has(e.target).length === 0) {
                picker_hide();
                pick_dragged = null;
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
            current.d = $(this).attr('data-value');
            picker_ul_transition('d', $(this).attr('data-value'));
            picker_ctrl = true;
        }

        function hLargeMode() {
            picker_large_onoff();
        }

        function hJump() {
            e.preventDefault();
            pick_dragged = null;

            var k = $(this).closest('ul').data('k');
            var i = current.y + jump * ($(this).hasClass('pick-arw-r') ? 1 : -1);
            var jumped_array = get_jumped('y', jump);
            if (i > jumped_array[jumped_array.length - 1]) i = jumped_array[0];
            if (i < jumped_array[0]) i = jumped_array[jumped_array.length - 1];
            current.y = i;
            picker_ul_transition('y', current.y);
            picker_ctrl = true;
        }

        function hDefaultArrow() {
            e.preventDefault();
            pick_dragged = null;
            var k = $(this).closest('ul').data('k');
            picker_ul_turn(k, ($(this).hasClass('pick-arw-r') ? 'right' : 'left'));
            picker_ctrl = true;
        }

        function hJump2a() {
            is_click = true;
        }

        function hJump2b() {
            if (is_click) {
                $(this).closest('ul').toggleClass('pick-jump');
                var jumped = get_closest_jumped(current.y, get_jumped('y', jump));
                current.y = jumped;
                picker_ul_transition('y', current.y);
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
            pick_dragged = $(this);
            if (pick_dragged) {
                var k = pick_dragged.data('k');
                pick_drag_offset = is_touch() ? e.originalEvent.touches[0].pageY : e.pageY;
                pick_drag_temp = get_current(k);
            }
        }

        function hMouseMoveOnUL(e) {
            is_click = false;

            if (pick_dragged) {
                e.preventDefault();
                var
                    k = pick_dragged.data('k');
                o = is_touch() ? e.originalEvent.touches[0].pageY : e.pageY;
                o = pick_drag_offset - o;
                o = Math.round(o * .026);
                i = pick_drag_temp + o;
                var
                    int = get_clear(k, i);
                if (int != pickers[picker.id].key[k].current)
                    picker_values_increase(k, int);

                picker_ctrl = true;
            }
        }

        function hMouseUpOnUL() {
            if (pick_dragged)
                pick_dragged = null,
                    pick_drag_offset = null,
                    pick_drag_temp = null;
            if (picker)
                picker_set();
        }

        function hSubmit() {
            picker_hide();
        }

        function hResize() {
            if (picker) {
                picker_offset();
                is_fx_mobile();
            }
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
            if (me.options.lock) {
                if (me.options.lock == 'from') {
                    if (unix_current < unix_today) {
                        picker_alert();
                        picker.addClass('picker-lkd');
                        return true;
                    }
                    else {
                        picker.removeClass('picker-lkd');
                        return false;
                    }
                }
                if (me.options.lock == 'to') {
                    if (unix_current > unix_today) {
                        picker_alert();
                        picker.addClass('picker-lkd');
                        return true;
                    }
                    else {
                        picker.removeClass('picker-lkd');
                        return false;
                    }
                }
            }

            if (pickers[picker.id].disabledays) {
                if (pickers[picker.id].disabledays.indexOf(unix_current) != -1) {
                    picker_alert();
                    picker.addClass('picker-lkd');
                    return true;
                }
                else {
                    picker.removeClass('picker-lkd');
                    return false;
                }
            }
        }


        function get_jumped(k, val) {
            var a = [], key_values = pickers[picker.id].key[k];
            for (var i = key_values.min; i <= key_values.max; i++) {
                if (i % val == 0) a.push(i);
            }
            return a;
        }


        function get_closest_jumped(k, val) {
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


        function get_clear(k, val) {
            var key_values = pickers[picker.id].key[k];
            if (n > key_values.max)
                return get_clear(k, (n - key_values.max) + (key_values.min - 1));
            else if (n < key_values.min)
                return get_clear(k, (n + 1) + (key_values.max - key_values.min));
            else
                return n;
        }


        function get_ul(k) {
            return picker.find('ul.pick[data-k="' + k + '"]');
        }


        function get_eq(k, d) {
            var o = [];
            get_ul(k).find('li').each(function () {
                o.push($(this).attr('value'));
            });

            if (d == 'last')
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
            if (!picker.hasClass('picker-modal')) {
                var left = me.$elem.offset().left + me.$elem.outerWidth() / 2;
                var top = me.$elem.offset().top + me.$elem.outerHeight();
                picker.css({
                    'left': left,
                    'top': top
                });
            }
        }


        function picker_show() {
            picker.addClass('picker-focus');
        }


        function picker_hide() {
            if (!is_locked()) {
                picker.removeClass('picker-focus');
                if (picker.hasClass('picker-modal'))
                    $('.picker-modal-overlay').addClass('tohide');
                picker.remove();    //MV
                delete pickers[picker.id];  //MV
                picker = null;
            }
            picker_ctrl = false;
        }


        function picker_render_ul(k) {
            var ul = get_ul(k);
            var key_values = pickers[picker.id].key[k];

            //CURRENT VALUE
            pickers[picker.id].key[k].current = key_values.today < key_values.min && key_values.min || key_values.today;

            var ml = moment();
            ml.locale(me.options.lang);
            for (i = key_values.min; i <= key_values.max; i++) {
                var
                    html = i;

                if (k == 'm')
                    html = ml.localeData().monthsShort()[i - 1];

                html += k == 'd' ? '<span></span>' : '';

                $('<li>', {
                    value: i,
                    html: html
                })
                    .appendTo(ul)
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
            })
                .appendTo(ul);

            if (k == 'y') {

                //PREV BUTTON
                $('<div>', {
                    class: 'pick-arw pick-arw-s2 pick-arw-l',
                    html: $('<i>', {
                        class: 'pick-i-l'
                    })
                })
                    .appendTo(ul);

                //NEXT BUTTON
                $('<div>', {
                    class: 'pick-arw pick-arw-s2 pick-arw-r',
                    html: $('<i>', {
                        class: 'pick-i-r'
                    })
                })
                    .appendTo(ul);

            }

            picker_ul_transition(k, get_current(k));
        }


        function picker_render_calendar() {
            var
                index = 0,
                w = get_picker_els('.pick-lg-b');

            w.find('li')
                .empty()
                .removeClass('pick-n pick-b pick-a pick-v pick-lk pick-sl pick-h')
                .attr('data-value', '');

            var
                _C = new Date(get_current_full()),
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
            var
                m = get_current('m'),
                y = get_current('y'),
                l = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));

            pickers[picker.id].key['d'].max = [31, (l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

            if (get_current('d') > pickers[picker.id].key['d'].max) {
                pickers[picker.id].key['d'].current = pickers[picker.id].key['d'].max;
                picker_ul_transition('d', get_current('d'));
            }

            var ml = moment();
            ml.locale(pickers[picker.id].lang);
            get_picker_els('.pick-d li')
                .removeClass('pick-wke')
                .each(function () {
                    var
                        d = new Date(m + "/" + $(this).attr('value') + "/" + y).getDay();

                    $(this)
                        .find('span')
                        .html(ml.localeData().weekdays()[d]);
                    //.html(i18n[pickers[picker.id].lang].weekdays.full[d]);

                    if (d == 0 || d == 6)
                        $(this).addClass('pick-wke');

                });

            if (picker.element.hasClass('picker-lg')) {
                get_picker_els('.pick-lg-b li').removeClass('pick-wke');
                get_picker_els('.pick-lg-b li.pick-v')
                    .each(function () {
                        var
                            d = new Date(m + "/" + $(this).attr('data-value') + "/" + y).getDay();
                        if (d == 0 || d == 6)
                            $(this).addClass('pick-wke');

                    });
            }
        }


        function picker_set() {
            if (picker.element.hasClass('picker-lg'))
                picker_render_calendar();
            picker_fills();
            input_change_value();
        }


        function picker_ul_transition(k, i) {
            var
                ul = get_ul(k);

            ul.find('li').removeClass('pick-sl pick-bfr pick-afr');

            if (i == get_eq(k, 'last')) {
                var li = ul.find('li[value="' + get_eq(k, 'first') + '"]');
                li.clone().insertAfter(ul.find('li[value=' + i + ']'));
                li.remove();
            }
            if (i == get_eq(k, 'first')) {
                var li = ul.find('li[value="' + get_eq(k, 'last') + '"]');
                li.clone().insertBefore(ul.find('li[value=' + i + ']'));
                li.remove();
            }

            ul.find('li[value=' + i + ']').addClass('pick-sl');
            ul.find('li.pick-sl').nextAll('li').addClass('pick-afr');
            ul.find('li.pick-sl').prevAll('li').addClass('pick-bfr');
        }


        function picker_values_increase(k, v) {
            switch (k) {
                case 'd':
                    break;
            }
            var key_values = pickers[picker.id].key[k];

            if (v > key_values.max) {
                if (k == 'd')
                    picker_ul_turn('m', 'right');
                if (k == 'm')
                    picker_ul_turn('y', 'right');
                v = key_values.min;
            }
            if (v < key_values.min) {
                if (k == 'd')
                    picker_ul_turn('m', 'left');
                if (k == 'm')
                    picker_ul_turn('y', 'left');
                v = key_values.max;
            }
            pickers[picker.id].key[k].current = v;
            picker_ul_transition(k, v);
        }


        function picker_ul_turn(k, dir) {
            var v = current[k] + dir;
            picker_values_increase(k, v);
        }


        function picker_alert() {
            picker.addClass('picker-rmbl');
        }


        function input_change_value() {
            if (!is_locked() && picker_ctrl) {
                var ml = moment({ year: current.y, month: current.m, day: current.d });
                ml.locale(pickers[picker.id].lang);
                var str = ml.format('ll');
                me.$elem.val(str).change();
                picker_ctrl = false;
            }
        }


        /**
         * Exposed object
         */

        var me = {}, container, picker;
        var is_click = false, picker_ctrl = false, pick_dragged = null, pick_drag_offset = null, pick_drag_temp = null;
        var current, jump;
        var isMobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

        me.init = function (options, elem) {
            me.$elem = $(elem);
            me.options = $.extend({}, $.fn.fgDateDropper.options, options);

            me.$elem.prop({
                'readonly': true
            }).addClass('fg-date-input');

            me.$elem.focus(function (e) {
                e.preventDefault();
                me.$elem.blur();
            });

            me.$elem.click(function (e) {
                create();
            });
        }

        return me;
    }

} (jQuery));
