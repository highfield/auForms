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
function auDispatcher() {
    "use strict";

    var exp = {};
    var tmr, qt = {}, qp = {}, uid = 0;

    function enqueue(q, msg) {
        msg.id = msg.id || ("M" + (uid++));
        msg.n = msg.n || 0;
        q[msg.id] = msg;
    }

    function disposer(id) {
        return function () {
            delete qp[id];
        }
    }

    function process() {
        //console.log("qp+qt=" + qp.length + "+" + qt.length);
        //move to the process queue
        for (var id in qt) {
            if (qp[id] && qp[id].cb) continue;
            enqueue(qp, qt[id]);
        }
        qt = {};

        //process messages
        var qc = {};
        for (var id in qp) qc[id] = qp[id];
        for (var id in qc) {
            var msg = qc[id];
            if (msg.n) {
                msg.n--;
            }
            else if (!msg.cb) {
                msg.cb = new disposer(msg.id);
                if (!msg.exec(msg.cb)) {
                    msg.cb();
                }
            }
        }

        if (Object.keys(qp).length || Object.keys(qt).length) {
            tmr = setTimeout(process, 50);
        }
        else {
            console.log("dispatcher empty.");
            tmr = null;
        }
    }

    exp.push = function (msg) {
        //enqueue as temporary
        enqueue(qt, msg);

        //console.log("push: " + JSON.stringify(msg));
        if (!tmr) tmr = setTimeout(process, 50);
    };

    return exp;
}

