;
var AuSettings = (function () {
    "use strict";

    function InhItem(fname, options) {
        options = options || {};
        var me = {};

        me.getFieldName = function () { return fname; }
        me.getDescription = function () { return options.description || fname; }
        me.getOrder = function () { return options.order || 0; }
        me.getMeta = function () { return options.meta || {}; }

        me.apply = function (value) {
            options.changed && options.changed(value);
        }

        return me;
    }


    function InhBag() {
        var me = {}, items = {};
        var levels = {}, ilev = [];

        me.addItem = function (item) {
            var n = item.getFieldName();
            if (items[n]) throw new Error('Duplicate item name: ' + n);
            items[n] = item;
        }

        me.getItems = function (pred) {
            var a = [];
            for (var k in items) {
                if (!pred || pred(items[k])) {
                    a.push({
                        k: k,
                        o: items[k].getOrder()
                    });
                }
            }
            var b = _.sortBy(a, function (x) {
                return x.o;
            });
            return _.map(b, function (x) {
                return items[x.k];
            });
        }

        me.addLevel = function (name, order) {
            if (!name) throw new Error('Invalid level name');
            if (levels[name]) throw new Error('Duplicate level name: ' + name);
            for (var k in levels) {
                if (levels[k].order === order) throw new Error('The level order must be unique: ' + name);
            }
            levels[name] = {
                name: name,
                order: order,
                data: {}
            }

            var a = [];
            for (var k in levels) {
                a.push(levels[k]);
            }
            ilev = _.sortBy(a, function (x) {
                return x.order;
            });
        }

        me.getPrevLevelName = function (name) {
            if (!name || !levels[name]) throw new Error('Invalid level name: ' + name);
            for (var i = 0; i < ilev.length; i++) {
                if (ilev[i].name === name) {
                    if (--i < 0) return null;
                    return ilev[i].name;
                }
            }
        }

        me.getNextLevelName = function (name) {
            if (!name || !levels[name]) throw new Error('Invalid level name: ' + name);
            for (var i = 0; i < ilev.length; i++) {
                if (ilev[i].name === name) {
                    if (++i >= ilev.length) return null;
                    return ilev[i].name;
                }
            }
        }

        me.setLevelData = function (name, data) {
            if (!name || !levels[name]) throw new Error('Invalid level name: ' + name);
            if (data != null && !_.isObject(data)) throw new Error('The provided data must be an object');
            levels[name].data = data || {};
        }

        me.getLevelData = function (name) {
            if (!name || !levels[name]) throw new Error('Invalid level name: ' + name);
            return levels[name].data;
        }

        me.getLevelValues = function (name) {
            if (!name || !levels[name]) throw new Error('Invalid level name: ' + name);
            var data = {};
            for (var k in items) {
                data[k] = me.getFieldValue(k, name);
            }
            return data;
        }

        me.getFieldValue = function (fname, lastLevel) {
            if (!fname || !items[fname]) throw new Error('Invalid field name: ' + fname);
            if (ilev.length === 0) throw new Error('No level defined');

            var result = {}, f;
            for (var i = 0; i < ilev.length; i++) {
                var l = ilev[i], ldata = levels[l.name].data;
                var entry = ldata[fname];
                if (entry && (entry.hasv || !f)) {
                    result.value = entry.value;
                    result.hasv = true;
                }
                f = true;
                if (l.name === lastLevel) break;
            }
            return result;
        }

        me.apply = function () {
            for (var k in items) {
                items[k].apply(me.getFieldValue(k));
            }
        }

        return me;
    }


    return {
        InhItem: InhItem,
        InhBag: InhBag
    }
})();
