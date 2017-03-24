
var leftMenu = [
    {
        title: 'All Categories',
        id: 'menuID',
        icon: 'fa fa-home',
        items: [
            {
                name: 'Devices',
                id: 'itemID',
                icon: 'fa fa-laptop',
                link: '#',
                items: [
                    {
                        title: 'Devices',
                        icon: 'fa fa-laptop',
                        items: [
                            {
                                name: 'Mobile Phones',
                                icon: 'fa fa-phone',
                                link: '#',
                                items: [
                                    {
                                        title: 'Mobile Phones',
                                        icon: 'fa fa-phone',
                                        link: '#',
                                        items: [
                                            {
                                                name: 'Super Smart Phone',
                                                link: '#'
                                            },
                                            {
                                                name: 'Thin Magic Mobile',
                                                link: 'p',
                                                id: 'mytag'
                                            },
                                            {
                                                name: 'Performance Crusher',
                                                link: '#'
                                            },
                                            {
                                                name: 'Futuristic Experience',
                                                link: '#'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'Televisions',
                                icon: 'fa fa-desktop',
                                link: '#',
                                items: [
                                    {
                                        title: 'Televisions',
                                        icon: 'fa fa-desktop',
                                        link: '#',
                                        items: [
                                            {
                                                name: 'Flat Super Screen',
                                                link: '#'
                                            },
                                            {
                                                name: 'Gigantic LED',
                                                link: '#'
                                            },
                                            {
                                                name: 'Power Eater',
                                                link: '#'
                                            },
                                            {
                                                name: '3D Experience',
                                                link: '#'
                                            },
                                            {
                                                name: 'Classic Comfort',
                                                link: '#'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'Cameras',
                                icon: 'fa fa-camera-retro',
                                link: '#',
                                items: [
                                    {
                                        title: 'Cameras',
                                        icon: 'fa fa-camera-retro',
                                        link: '#',
                                        items: [
                                            {
                                                name: 'Smart Shot',
                                                link: '#'
                                            },
                                            {
                                                name: 'Power Shooter',
                                                link: '#'
                                            },
                                            {
                                                name: 'Easy Photo Maker',
                                                link: '#'
                                            },
                                            {
                                                name: 'Super Pixel',
                                                link: '#'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Magazines',
                icon: 'fa fa-book',
                link: '#',
                items: [
                    {
                        title: 'Magazines',
                        icon: 'fa fa-book',
                        items: [
                            {
                                name: 'National Geographics',
                                link: '#'
                            },
                            {
                                name: 'Scientific American',
                                link: '#'
                            },
                            {
                                name: 'The Spectator',
                                link: '#'
                            },
                            {
                                name: 'Rambler',
                                link: '#'
                            },
                            {
                                name: 'Physics World',
                                link: '#'
                            },
                            {
                                name: 'The New Scientist',
                                link: '#'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Store',
                icon: 'fa fa-shopping-cart',
                link: '#',
                items: [
                    {
                        title: 'Store',
                        icon: 'fa fa-shopping-cart',
                        items: [
                            {
                                name: 'Clothes',
                                icon: 'fa fa-tags',
                                link: '#',
                                items: [
                                    {
                                        title: 'Clothes',
                                        icon: 'fa fa-tags',
                                        items: [
                                            {
                                                name: 'Women\'s Clothing',
                                                icon: 'fa fa-female',
                                                link: '#',
                                                items: [
                                                    {
                                                        title: 'Women\'s Clothing',
                                                        icon: 'fa fa-female',
                                                        id: 'women',
                                                        items: [
                                                            {
                                                                name: 'Tops',
                                                                link: '#',
                                                                icon: 'fa fa-user'
                                                            },
                                                            {
                                                                name: 'Dresses',
                                                                link: '#'
                                                            },
                                                            {
                                                                name: 'Trousers',
                                                                link: '#',
                                                                icon: 'fa fa-bomb'
                                                            },
                                                            {
                                                                name: 'Shoes',
                                                                link: '#',
                                                                id: 'women_shoes'
                                                            },
                                                            {
                                                                name: 'Sale',
                                                                link: '#'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                name: 'Men\'s Clothing',
                                                icon: 'fa fa-male',
                                                link: '#',
                                                items: [
                                                    {
                                                        title: 'Men\'s Clothing',
                                                        icon: 'fa fa-male',
                                                        items: [
                                                            {
                                                                name: 'Shirts',
                                                                link: '#'
                                                            },
                                                            {
                                                                name: 'Trousers',
                                                                link: '#'
                                                            },
                                                            {
                                                                name: 'Shoes',
                                                                link: '#'
                                                            },
                                                            {
                                                                name: 'Sale',
                                                                link: '#'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'Jewelry',
                                link: '#'
                            },
                            {
                                name: 'Music',
                                link: '#',
                                icon: 'fa fa-music'
                            },
                            {
                                name: 'Grocery',
                                link: '#'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Collections',
                link: '#'
            },
            {
                name: 'Credits',
                link: '#'
            }
        ]
    }
];


$(document).ready(function () {
    var options_left = {
        menuID: 'multilevelpushmenu_left',
        container: $('#menul'),
        menu: leftMenu,
        collapsed: true,
        fullCollapse: true,
        menuWidth: 150,
        menuHeight: $(document).height() - 40,
        durationSlideOut: 200,
        durationSlideDown: 200,
        //mode: 'cover',
    };

    var sts = "closed";
    options_left.onExpandMenuStart = function () {
        sts = "opening";
        showOverlay(true);
    };
    options_left.onExpandMenuEnd = function () {
        sts = "opened";
    };
    options_left.onCollapseMenuStart = function () { sts = "closing"; };
    options_left.onCollapseMenuEnd = function () {
        sts = "closed";
        var exp = menul.multilevelpushmenu('menuexpanded', $('#menuID'));
        if (!exp) showOverlay(false);
    };
    options_left.onItemClick = function (e, lev, item, st) {
        var a = item.children('a');
        console.log("item-click: " + a.attr('href'));
        //menul.multilevelpushmenu('collapse');
    };
    options_left.onGroupItemClick = function (e, lev, item, st) {
        console.log("group-click");
        //menul.multilevelpushmenu('collapse');
    };

    var menul = $('#menul').multilevelpushmenu(options_left);

    $('.mmenu-main').click(function (e) {
        //$('#menul').multilevelpushmenu('expand');
        if (sts === "closed") {
            menul.multilevelpushmenu('expand');
        }
        else if (sts == "opened") {
            menul.multilevelpushmenu('collapse');
        }
    });

    $('#page-overlay').click(function () {
        menul.multilevelpushmenu('collapse');
    });

    function showOverlay(val) {
        $('#page-overlay').css({ display: val ? "block" : "none" });
    }

    $('#women_shoes').addClass('multilevelpushmenu_selected');

    //$('#btnOpenWomen').click(function () {
    //    menul.multilevelpushmenu('expand', $('#women'));
    //});

    $(window).on('resize', function () {
        menul.multilevelpushmenu('option', 'menuHeight', $(document).height() - 40);
        menul.multilevelpushmenu('redraw');
    });


    /*
    var rightMenu = [
        {
            //title: 'My Sidebar',
            id: 'sidebarID',
            //icon: 'fa fa-home',
            items: []
        }];

    var options_right = {
        menuID: 'multilevelpushmenu_right',
        container: $('#menur'),
        menu: rightMenu,
        collapsed: true,
        fullCollapse: true,
        groupIcon: 'fa fa-angle-right',
        menuWidth: 300,
        direction: 'rtl',
    };

    options_right.onExpandMenuEnd = function () {
        $('#sidebarID').css({
            'background': 'transparent',
            //'visibility': 'hidden',
            //'pointer-events': 'none'
        });
    };

    var menur = $('#menur').multilevelpushmenu(options_right);
    var $menur = $('<div>').css({
        margin: 10
    }).appendTo($('#multilevelpushmenu_right'));

    $('.mmenu-aux').click(function (e) {
        if (menur.multilevelpushmenu('menuexpanded', $('#sidebarID'))) {
            menur.multilevelpushmenu('collapse');
        }
        else {
            menur.multilevelpushmenu('expand');
        }
    });
    */

    var menur = $('#menur').addClass('sidebar right').sidebar({
        side: 'right',
        closed: true
    });;

    var $menur = $('<div>').css({
        //margin: 10
    }).appendTo($('#menur'));

    $('.mmenu-aux').click(function (e) {
        menur.trigger('sidebar:toggle');
    });

    $('#menur').css({
        'overflow-y': 'auto'
    }).perfectScrollbar();



    var viewTargetHandlers = {}, selectorCache = {};

    viewTargetHandlers.page = function (fn) {
        var targets = {
            body: $('#fbody').empty(),
            header: $('#fhead').empty(),
            footer: $('#ffoot').empty()
        };
        fn(targets);
    }

    viewTargetHandlers.dialog = function (fn) {
        var opts = {
            closable: true,
            sizex: 'size-wide',
            sizey: '95%'
        }
        var dialog = AuForms.dialog(opts);
        fn(dialog);
        dialog.open();
    }

    viewTargetHandlers.sidebar = function (fn) {
        $menur.empty();
        var targets = {
            header: $('<div>').appendTo($menur),
            body: $('<div>').appendTo($menur),
            footer: $('<div>').appendTo($menur)
        };

        var options = {
            forceRowStacked: true
        };
        fn(targets, options);
    }


    function temp() {
        viewTargetHandlers.page(function (targets) {
            //var layout = { "type": "form", "body": { "type": "stack", "nodes": [{ "type": "row", "header": "Nome", "nodes": [{ "type": "textbox", "id": "nome", "text": { "path": "nome", "validate": {} } }] }, { "type": "row", "header": "Cognome", "nodes": [{ "type": "textbox", "id": "cognome", "text": { "path": "cognome", "validate": {} } }] }, { "type": "row", "header": "Messaggio 1", "nodes": [{ "type": "textbox", "id": "msg1", "readonly": true }] }, { "type": "row", "header": "Messaggio 2", "nodes": [{ "type": "textblock", "id": "msg2" }] }] }, "footer": { "type": "stack", "halign": "right", "nodes": [{ "type": "button", "id": "close", "text": "Close" }] } };
            //var form = AuForms.Form(targets, {});
            //form.layout(AuFormsWidgets).load(layout);

            //form.getNode('msg1').prop('text').setConv({
            //    toTarget: function (vraw) {
            //        return vraw.toUpperCase();
            //    }
            //});

            //form.getNode('msg2').prop('text').setConv({
            //    toTarget: function (vraw) {
            //        return vraw.toLowerCase();
            //    }
            //});

            //form.on('nome.text cognome.text', function (args) {
            //    var s = form.getData().saluto + ' ';
            //    s += form.getData().nome + ' ';
            //    s += (form.getData().cognome || "");
            //    form.getNode('msg1').prop('text').setRaw(s);
            //    form.getNode('msg2').prop('text').setRaw(s);
            //});

            //form.on('close', function (args) {
            //    if (targets.close) {
            //        targets.close();
            //    }
            //    else {
            //        alert('close!');
            //    }
            //});

            //var data = {
            //    saluto: "ciao",
            //    nome: "Tigro"
            //};
            //form.load(data);
        });
        return 1;
    }


    $('#btnShowSelector').click(function () {
        //if (temp()) return;
        var opts = {
            closable: true,
            //sizex: 'size-wide',
            //sizey: '95%'
        }
        var dialog = AuForms.dialog(opts);

        var layout = { "type": "form", "body": { "type": "stack", "nodes": [{ "type": "row", "header": "Esempio", "nodes": [{ "type": "select", "value": { "path": "sampleSelector" }, "enum": [{ "key": "", "value": "(none)" }, { "key": "buttonDemo_2+2", "value": "buttonDemo 2+2" }, { "key": "basicText", "value": "basicText" }, { "key": "basicValidation", "value": "basicValidation" }, { "key": "panels", "value": "panels" }, { "key": "basicWizard", "value": "basicWizard" }, { "key": "dynamicLayout", "value": "dynamicLayout" }, { "key": "iconery", "value": "iconery" }, { "key": "settingsL1", "value": "settingsL1" }, { "key": "settingsL2", "value": "settingsL2" }, { "key": "userPrefs", "value": "userPrefs" }] }] }, { "type": "row", "header": "Target", "nodes": [{ "type": "select", "value": { "path": "viewTarget" }, "enum": [{ "key": "page", "value": "page" }, { "key": "dialog", "value": "dialog" }, { "key": "sidebar", "value": "sidebar" }] }] }, { "type": "panel", "bg": "panel-info", "header": "Preferenze", "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Separatore decimale", "nodes": [{ "type": "select", "value": { "path": "decimale" }, "enum": [{ "key": ".", "value": ". (punto)" }, { "key": ",", "value": ", (virgola)" }] }] }, { "type": "row", "gcols": [4, 8], "header": "Separatore migliaia", "nodes": [{ "type": "select", "value": { "path": "migliaia" }, "enum": [{ "key": "", "value": "(nessuno)" }, { "key": " ", "value": "(spazio)" }, { "key": ".", "value": ". (punto)" }, { "key": ",", "value": ", (virgola)" }] }] }, { "type": "row", "gcols": [4, 8], "header": "Formato data/ora", "nodes": [{ "type": "select", "value": { "path": "dataora" }, "enum": [{ "key": "", "value": "Default (Inglese USA)" }, { "key": "it", "value": "Italia" }, { "key": "de", "value": "Germania" }, { "key": "fr", "value": "Francia" }, { "key": "es", "value": "Spagna" }, { "key": "hu", "value": "Ungheria" }, { "key": "zh-cn", "value": "Cina" }, { "key": "ar", "value": "Arabo" }] }] }] }] }] }, "footer": { "type": "stack", "halign": "right", "inline": true, "nodes": [{ "type": "button", "id": "btnOpenWomen", "text": "Open 'Women'" }, { "type": "button", "id": "btnRemoveForm", "text": "Remove" }, { "type": "button", "id": "btnShowForm", "text": "Show" }] } };
        var form = AuForms.Form(dialog, {});
        form.layout(AuFormsWidgets).load(layout);

        form.on('btnShowForm.click', function (args) {
            selectorCache = form.getData();
            AuForms.formats.numeric = wNumb({
                mark: selectorCache.decimale,
                thousand: selectorCache.migliaia
            });

            AuForms.formats.datetime = {
                locale: selectorCache.dataora
            }

            var h = viewTargetHandlers[selectorCache.viewTarget || 'page'];
            h && h(function (targets, options) {
                var sample = selectorCache.sampleSelector;
                var fn = sample && samplesFactory[sample];
                return fn && fn(targets, options || {});
            });
            dialog.close();
        });

        form.on('btnRemoveForm.click', function (args) {
            $('#fbody').empty();
            $('#fhead').empty();
            $('#ffoot').empty();
            dialog.close();
        });

        form.on('btnOpenWomen.click', function (args) {
            menul.multilevelpushmenu('expand', $('#women'));
            dialog.close();
        });

        form.load(selectorCache);
        dialog.open();
    });


    //tabs demo
    $('#btnTabsDemo').click(function () {
        var ctr = $('<div>').addClass('container').css('height','100%').appendTo('.au-null');
        var tp = AuForms.TabPanel(ctr);

        (function () {
            var opts = {
                caption: 'Tab 1'
            };
            opts.onshow = function () {
                var a = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'.split('.');
                var h = $('<h3>');
                a.forEach(function (s) {
                    h.append($('<p>').text(s));
                });
                return h;
            }
            tp.add(AuForms.TabItem(opts));
        })();

        (function () {
            var opts = {
                caption: 'Tab 2'
            };
            opts.onshow = function () {
                var a = 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'.split('.');
                var h = $('<h3>');
                a.forEach(function (s) {
                    h.append($('<p>').text(s));
                });
                return h;
            }
            tp.add(AuForms.TabItem(opts));
        })();

        (function () {
            var opts = {
                caption: 'Tab 3'
            };
            opts.onshow = function () {
                var a = 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.'.split('.');
                var h = $('<h3>');
                a.forEach(function (s) {
                    h.append($('<p>').text(s));
                });
                return h;
            }
            tp.add(AuForms.TabItem(opts));
        })();

        tp.setSelected(0);
    });


    //define the fictional settings model
    mySettings.addLevel('app', 0);
    mySettings.addLevel('domain', 10);
    mySettings.addLevel('user', 20);

    mySettings.addItem(AuSettings.InhItem('cognome', {
        description: 'Cognome',
        order: 10,
        meta: { presenter: ZText }
    }));

    mySettings.addItem(AuSettings.InhItem('nome', {
        description: 'Nome',
        order: 9,
        meta: { presenter: ZText }
    }));

    mySettings.addItem(AuSettings.InhItem('conferma', {
        description: "L'é un porzèl",
        order: 20,
        meta: { presenter: ZCheck }
    }));

    mySettings.addItem(AuSettings.InhItem('razza', {
        description: "Razza",
        order: 17,
        meta: { presenter: ZSelect }
    }));

    mySettings.addItem(AuSettings.InhItem('peso', {
        description: "Peso",
        order: 15,
        meta: { presenter: ZNum }
    }));

    //set-up some inheritable items as fictional settings
    mySettings.setLevelData('app', {
        nome: { value: 'Tigro' },
        cognome: { value: 'Porzèl' },
        peso: { value: 5.5 },
        razza: { value: 'mc' },
        conferma: { value: true },
    });


    //var dtpOptions = {
    //    lang: 'it',
    //    large: true
    //}
    //$('#dtp1').fgDateDropper(dtpOptions);
});


var mySettings = AuSettings.InhBag();
var samplesFactory = {};


samplesFactory["buttonDemo_2+2"] = function (targets, options) {
    "use strict";

    var layout = { "type": "form", "body": {}, "footer": { "type": "stack", "halign": "right", "inline": true, "nodes": [{ "type": "stack", "margin": "0px 32px 0px 0px", "inline": true, "nodes": [{ "type": "button", "text": "Bottone 1", "icon": "glyphicon glyphicon-eye-open" }, { "type": "button", "text": "Bottone 2", "icon": "glyphicon glyphicon-thumbs-up" }] }, { "type": "stack", "inline": true, "nodes": [{ "type": "button", "id": "c1", "margin": "0px 8px 0px 0px", "text": "Close 1" }, { "type": "button", "id": "c2", "text": "Close 2" }] }] } };

    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    form.on('c1.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close 1!');
        }
    });

    form.on('c2.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close 2!');
        }
    });
}



samplesFactory.basicText = function (targets, options) {
    "use strict";

    var layout = { "type": "form", "body": { "type": "stack", "nodes": [{ "type": "row", "header": "Nome", "nodes": [{ "type": "textbox", "id": "nome", "text": { "path": "nome", "validate": {} } }] }, { "type": "row", "header": "Cognome", "nodes": [{ "type": "textbox", "id": "cognome", "text": { "path": "cognome", "validate": {} } }] }, { "type": "row", "header": "Messaggio 1", "nodes": [{ "type": "textbox", "id": "msg1", "readonly": true }] }, { "type": "row", "header": "Messaggio 2", "nodes": [{ "type": "textblock", "id": "msg2" }] }] }, "footer": { "type": "stack", "halign": "right", "nodes": [{ "type": "button", "id": "close", "text": "Close" }] } };
    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    form.getNode('msg1').prop('text').setConv({
        toTarget: function (vraw) {
            return vraw.toUpperCase();
        }
    });

    form.getNode('msg2').prop('text').setConv({
        toTarget: function (vraw) {
            return vraw.toLowerCase();
        }
    });

    form.on('nome.text cognome.text', function (args) {
        var s = form.getData().saluto + ' ';
        s += form.getData().nome + ' ';
        s += (form.getData().cognome || "");
        form.getNode('msg1').prop('text').setRaw(s);
        form.getNode('msg2').prop('text').setRaw(s);
    });

    form.on('close.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close!');
        }
    });

    var data = {
        saluto: "ciao",
        nome: "Tigro"
    };
    form.load(data);
}



samplesFactory.basicValidation = function (targets, options) {
    "use strict";

    function updateEnable() {
        var e = form.getNode('global_enable').prop('checked').get();
        form.getNode('global_ctr').prop('enabled').set(e);
    }

    var layout = { "type": "form", "body": { "type": "stack", "overflow-y": "auto", "height": "100%", "nodes": [{ "type": "row", "nodes": [{ "type": "checkbox", "id": "global_enable", "text": "Abilitazione generale" }] }, { "type": "stack", "id": "global_ctr", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Famiglia", "nodes": [{ "type": "textblock", "text": "Felidi" }] }, { "type": "row", "gcols": [4, 8], "header": "Nome", "nodes": [{ "type": "textbox", "text": { "path": "nome", "validate": { "required": true } } }] }, { "type": "row", "gcols": [4, 8], "header": "Cognome", "nodes": [{ "type": "textbox", "text": { "path": "cognome", "validate": { "text": { "min": 3, "max": 10 } } } }] }, { "type": "row", "gcols": [4, 8], "header": "E-Mail", "nodes": [{ "type": "textbox", "pre": "@", "text": { "path": "e_mail", "validate": { "required": true, "email": {} } } }] }, { "type": "row", "gcols": [4, 8], "header": "Peso", "nodes": [{ "type": "numbox", "post": "kg", "value": { "path": "peso", "validate": { "required": true, "float": { "min": 0.1, "max": 20.0 } } } }] }, { "type": "row", "gcols": [4, 8], "header": "Lunghezza", "nodes": [{ "type": "numbox", "post": "cm", "value": { "path": "lungh", "validate": { "required": true, "int": { "min": 10, "max": 200 } } } }] }, { "type": "row", "gcols": [4, 8], "header": "Colore", "nodes": [{ "type": "colorbox", "value": { "path": "colore", "validate": { "required": true } } }] }, { "type": "row", "gcols": [4, 8], "header": "Constatazione", "nodes": [{ "type": "checkbox", "text": "Tigro l'é un porzèl", "checked": { "path": "conferma", "validate": { "checked": true } } }] }, { "type": "row", "gcols": [4, 8], "header": "Stato civile", "nodes": [{ "type": "radioselect", "value": { "path": "stato_civile", "validate": { "required": true } }, "enum": [{ "key": "scap", "value": "Scapolo" }, { "key": "spos", "value": "Sposato" }, { "key": "div", "value": "Divorziato" }] }] }, { "type": "row", "gcols": [4, 8], "header": "Razza", "nodes": [{ "type": "select", "value": { "path": "razza", "validate": { "required": true } }, "enum": [{ "key": "sib", "value": "Siberiano" }, { "key": "eur", "value": "Europeo" }, { "key": "nor", "value": "Norvegese delle foreste" }, { "key": "siam", "value": "Siamese" }, { "key": "mc", "value": "Maine-coon" }, { "key": "rag", "value": "Rag-doll" }, { "key": "bir", "value": "Birmano" }, { "key": "per", "value": "Persiano" }] }] }, { "type": "row", "gcols": [4, 8], "header": "Disastri commessi", "nodes": [{ "type": "multiselect", "value": { "path": "disastri", "validate": { "required": true } }, "enum": [{ "key": "bicch", "value": "Bicchieri rotti" }, { "key": "albnat", "value": "Albero di Natale svenuto" }, { "key": "cusc", "value": "Cuscini" }, { "key": "div", "value": "Divano" }, { "key": "fiori", "value": "Fiori e piante" }, { "key": "cibo", "value": "Cibo per terra" }, { "key": "box", "value": "Scatole rovesciate" }, { "key": "h2o", "value": "Spruzzi d'acqua in giro" }, { "key": "agg", "value": "Agguati" }, { "key": "betty", "value": "Zampate a Betty" }, { "key": "toys", "value": "Giocattoli sparsi per la casa" }] }] }, { "type": "row", "gcols": [4, 8], "header": "Regione di nascita", "nodes": [{ "type": "select2", "id": "regione", "value": { "path": "regione", "validate": { "required": true } }, "enum": [] }] }, { "type": "row", "gcols": [4, 8], "header": "Città di nascita", "nodes": [{ "type": "select2", "id": "citta", "value": { "path": "citta", "validate": { "required": true } }, "enum": [] }] }, { "type": "row", "gcols": [4, 8], "header": "Orario di nascita", "nodes": [{ "type": "fgtime", "value": { "path": "nato_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di nascita" } }] }, { "type": "row", "gcols": [4, 8], "header": "Data di nascita", "nodes": [{ "type": "fgdate", "value": { "path": "nato_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di nascita" } }] }, { "type": "row", "gcols": [4, 8], "header": "Data/ora di adozione", "nodes": [{ "type": "fgdatetime", "value": { "path": "adoz_dt", "validate": { "required": true } }, "options": { "title": "Immettere la data/ora di adozione" } }] }, { "type": "row", "gcols": [4, 8], "nodes": [{ "type": "grid-layout", "bg": "bg-info", "nodes": [{ "type": "row", "gcols": [6, 6], "header": "Data di vaccinazione", "nodes": [{ "type": "fgdate", "value": { "path": "vacc_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di vaccinazione" } }] }, { "type": "row", "gcols": [6, 6], "header": "Orario di vaccinazione", "nodes": [{ "type": "fgtime", "value": { "path": "vacc_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di vaccinazione" } }] }] }] }, { "type": "row", "gcols": [4, 8], "header": "Data/ora castrazione", "nodes": [{ "type": "grid-layout", "bg": "bg-warning", "nodes": [{ "type": "row", "nodes": [{ "type": "fgdate", "value": { "path": "castr_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di castrazione" } }] }, { "type": "row", "nodes": [{ "type": "fgtime", "value": { "path": "castr_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di castrazione" } }] }] }] }, { "type": "row", "gcols": [4, 8], "header": "Note", "nodes": [{ "type": "textarea" }] }] }] }, "footer": { "type": "stack", "halign": "right", "inline": true, "nodes": [{ "type": "stack", "margin": "0,32,0,0", "inline": true, "nodes": [{ "type": "button", "id": "close", "text": "Close" }] }, { "type": "stack", "inline": true, "nodes": [{ "type": "button", "id": "reset", "text": "Reset" }, { "type": "button", "id": "submit", "text": "Submit" }] }] } };

    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    form.on('reset.click', function (args) {
        form.reload();
    });

    form.on('submit.click', function (args) {
        alert(JSON.stringify(form.getData()));
    });

    form.on('close.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close!');
        }
    });

    form.on('global_enable.checked', function (args) {
        updateEnable();
    });
    updateEnable();

    form.on('.errors', function (args) {
        var valok = !form.getHasErrors();
        console.log("valok=" + valok);
        form.getNode('submit').prop('enabled').set(valok);
    });

    var ccr = AuForms.controllers.ajax('/regioni');
    var nr = form.getNode('regione');
    nr.prop('controller').set(ccr);

    var ccc = AuForms.controllers.ajax('/citta');
    form.getNode('citta').prop('controller').set(ccc);
    ccc.onFilter = function (filter) {
        filter.regione = nr.prop('value').get();
    }

    var data = {
        nome: "Tigro",
        cognome: "Porzèl",
        e_mail: "tigro@porzel.com",
        peso: 4.5,
        lungh: 80,
        conferma: true,
        stato_civile: 'scap',
        razza: 'mc',
        disastri: ['cusc', 'div'],
        note: "Povero martire di Betty...",
        citta: 26,
        nato_ora: '2016-05-12T11:14:39+01:00',
        nato_data: '2016-05-12T11:14:39+01:00',
        adoz_dt: '2016-06-22T16:15:14Z'
    };
    form.load(data);
}



samplesFactory.panels = function (targets, options) {
    "use strict";

    function enablePanels() {
        'p1 p2 p3 p4'.split(' ').forEach(function (id) {
            var node = form.getNode(id);
            var checked = node.prop('checked').get();
            console.log(id + '=' + checked)
            while (node && node.getType() !== 'panel') node = node.getParent();
            node.getChildren().forEach(function (c) {
                c.prop('enabled').set(checked);
            });
        });
    }

    var layout = { "type": "form", "body": { "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": { "type": "radiobox", "id": "r1", "text": "Razza", "value": "R", "group": "vacanze", "font": { "bold": true } }, "nodes": [{ "type": "select", "id": "s1", "value": { "path": "razza", "validate": { "required": true } }, "enum": [{ "key": "", "value": "- - -" }, { "key": "sib", "value": "Siberiano" }, { "key": "eur", "value": "Europeo" }, { "key": "nor", "value": "Norvegese delle foreste" }, { "key": "siam", "value": "Siamese" }, { "key": "mc", "value": "Maine-coon" }, { "key": "rag", "value": "Rag-doll" }, { "key": "bir", "value": "Birmano" }, { "key": "per", "value": "Persiano" }] }] }, { "type": "row", "gcols": [4, 8], "header": { "type": "radiobox", "id": "r2", "text": "Disastri commessi", "value": "D", "group": "vacanze", "font": { "bold": true } }, "nodes": [{ "type": "multiselect", "id": "s2", "value": { "path": "disastri", "validate": { "required": true } }, "enum": [{ "key": "bicch", "value": "Bicchieri rotti" }, { "key": "albnat", "value": "Albero di Natale svenuto" }, { "key": "cusc", "value": "Cuscini" }, { "key": "div", "value": "Divano" }, { "key": "fiori", "value": "Fiori e piante" }, { "key": "cibo", "value": "Cibo per terra" }, { "key": "box", "value": "Scatole rovesciate" }, { "key": "h2o", "value": "Spruzzi d'acqua in giro" }, { "key": "agg", "value": "Agguati" }, { "key": "betty", "value": "Zampate a Betty" }, { "key": "toys", "value": "Giocattoli sparsi per la casa" }] }] }, { "type": "panel", "bg": "panel-info", "gcols": [4, 8], "header": "Pannello semplice", "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Nome", "nodes": [{ "type": "textbox", "text": { "path": "nome", "validate": { "required": true } } }] }, { "type": "row", "gcols": [4, 8], "header": "Cognome", "nodes": [{ "type": "textbox", "text": { "path": "cognome", "validate": { "text": { "min": 3, "max": 10 } } } }] }, { "type": "row", "gcols": [4, 8], "header": "E-Mail", "nodes": [{ "type": "textbox", "bg": "bg-info", "pre": "@", "text": { "path": "e_mail", "validate": { "required": true, "email": {} } } }] }] }] }, { "type": "panel", "bg": "panel-info", "gcols": [4, 8], "header": "Pannello nidificato", "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "header": "Peso", "nodes": [{ "type": "numbox", "bg": "bg-info", "post": "kg", "value": { "path": "peso", "validate": { "required": true, "float": { "min": 0.1, "max": 20.0 } } } }] }, { "type": "row", "header": "Lunghezza", "nodes": [{ "type": "numbox", "bg": "bg-info", "post": "cm", "value": { "path": "lungh", "validate": { "required": true, "int": { "min": 10, "max": 200 } } } }] }, { "type": "panel", "bg": "panel-default", "header": "Pannello interno", "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Constatazione", "nodes": [{ "type": "checkbox", "text": "Tigro l'é un porzèl" }] }, { "type": "row", "gcols": [4, 8], "header": "Stato civile", "nodes": [{ "type": "radioselect", "enum": [{ "key": "scap", "value": "Scapolo" }, { "key": "spos", "value": "Sposato" }, { "key": "div", "value": "Divorziato" }] }] }] }] }] }] }, { "type": "panel", "bg": "panel-default", "gcols": [4, 8], "header": { "type": "radiobox", "id": "p1", "text": "Istante di nascita", "value": "P1", "group": "istanti" }, "nodes": [{ "type": "row", "header": "Orario", "nodes": [{ "type": "fgtime", "value": { "path": "nato_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di nascita" } }] }, { "type": "row", "header": "Data", "nodes": [{ "type": "fgdate", "value": { "path": "nato_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di nascita" } }] }] }, { "type": "panel", "bg": "panel-success", "gcols": [4, 8], "header": { "type": "radiobox", "id": "p2", "text": "Istante di adozione", "value": "P2", "group": "istanti" }, "nodes": [{ "type": "row", "header": "Orario", "nodes": [{ "type": "fgtime", "value": { "path": "adoz_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di adozione" } }] }, { "type": "row", "header": "Data", "nodes": [{ "type": "fgdate", "value": { "path": "adoz_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di adozione" } }] }] }, { "type": "panel", "bg": "panel-info", "gcols": [4, 8], "header": { "type": "radiobox", "id": "p3", "text": "Istante di vaccinazione", "value": "P3", "group": "istanti" }, "nodes": [{ "type": "grid-layout", "bg": "bg-info", "nodes": [{ "type": "row", "gcols": [6, 6], "header": "Data", "nodes": [{ "type": "fgdate", "value": { "path": "vacc_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di vaccinazione" } }] }, { "type": "row", "gcols": [6, 6], "header": "Orario", "nodes": [{ "type": "fgtime", "value": { "path": "vacc_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di vaccinazione" } }] }] }] }, { "type": "panel", "bg": "panel-danger", "gcols": [4, 8], "header": { "type": "radiobox", "id": "p4", "text": "Istante di castrazione", "value": "P4", "group": "istanti" }, "nodes": [{ "type": "grid-layout", "bg": "bg-warning", "nodes": [{ "type": "row", "gcols": [6, 6], "nodes": [{ "type": "fgdate", "value": { "path": "castr_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di castrazione" } }] }, { "type": "row", "gcols": [6, 6], "nodes": [{ "type": "fgtime", "value": { "path": "castr_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di castrazione" } }] }] }] }] }, "footer": { "type": "stack", "halign": "right", "inline": true, "nodes": [{ "type": "stack", "margin": "0,32,0,0", "inline": true, "nodes": [{ "type": "button", "id": "close", "text": "Close" }] }, { "type": "stack", "inline": true, "nodes": [{ "type": "button", "id": "reset", "text": "Reset" }, { "type": "button", "id": "submit", "text": "Submit" }] }] } };

    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    form.on('reset.click', function (args) {
        form.reload();
    });

    form.on('submit.click', function (args) {
        alert(JSON.stringify(form.getData()));
    });

    form.on('close.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close!');
        }
    });


    form.on('p1 p2 p3 p4', function (args) {
        enablePanels();
    });
    enablePanels();

    form.on('.errors', function (args) {
        var valok = !form.getHasErrors();
        console.log("valok=" + valok);
        form.getNode('submit').prop('enabled').set(valok);
    });

    var data = {
    };
    form.load(data);
}



samplesFactory.basicWizard = function (targets, options) {
    "use strict";

    var layout = { "type": "form", "header": { "type": "stack", "inline": true, "nodes": [{ "type": "pillselect", "id": "pill", "enum": [{ "key": "ident", "icon": "glyphicon glyphicon-italic", "value": "Identità" }, { "key": "quest", "icon": "glyphicon glyphicon-question-sign", "value": "Domanda" }, { "key": "success", "icon": "glyphicon glyphicon-ok", "value": "Riassunto" }] }] }, "body": { "type": "stack", "nodes": [{ "type": "stack", "id": "page1", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Nome", "nodes": [{ "type": "textbox", "id": "nome", "text": { "path": "nome" } }] }, { "type": "row", "gcols": [4, 8], "header": "Cognome", "nodes": [{ "type": "textbox", "id": "cognome", "text": { "path": "cognome" } }] }] }, { "type": "stack", "id": "page2", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Peso", "nodes": [{ "type": "numbox", "post": "kg", "value": { "path": "peso", "validate": { "required": true, "float": { "min": 0.1, "max": 20.0 } } } }] }, { "type": "row", "gcols": [4, 8], "header": "Lunghezza", "nodes": [{ "type": "numbox", "post": "cm", "value": { "path": "lungh", "validate": { "required": true, "int": { "min": 10, "max": 200 } } } }] }] }, { "type": "stack", "id": "page3", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Constatazione", "nodes": [{ "type": "checkbox", "text": "Tigro l'é un porzèl", "checked": { "path": "conferma" } }] }] }, { "type": "stack", "id": "page4", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Errore", "nodes": [{ "type": "textblock", "id": "msgerr", "text": "Devi confermare che Tigro è un porzèl!" }] }] }, { "type": "stack", "id": "page5", "overflow-y": "auto", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Messaggio 1", "nodes": [{ "type": "textbox", "id": "msg1", "text": { "conv": "ucase" }, "readonly": true }] }, { "type": "row", "gcols": [4, 8], "header": "Messaggio 2", "nodes": [{ "type": "textblock", "id": "msg2", "text": { "conv": "lcase" } }] }, { "type": "row", "gcols": [4, 8], "header": "Riassunto", "nodes": [{ "type": "host", "id": "riass1" }] }, { "type": "host", "id": "riass2", "gcols": [4, 8] }] }] }, "footer": { "type": "stack", "halign": "right", "inline": true, "nodes": [{ "type": "button", "id": "close", "margin": "0,8,0,0", "text": "Close" }, { "type": "stack", "margin": "0,8,0,0", "inline": true, "nodes": [{ "type": "button", "id": "prev", "text": "Prev", "icon": "glyphicon glyphicon-arrow-left" }, { "type": "button", "id": "next", "text": "Next", "icon": "glyphicon glyphicon-arrow-right" }] }, { "type": "button", "id": "submit", "text": "Submit" }] } };

    options.converters = {};
    options.converters.ucase = {
        toTarget: function (vraw) {
            return vraw.toUpperCase();
        }
    };
    options.converters.lcase = {
        toTarget: function (vraw) {
            return vraw.toLowerCase();
        }
    };

    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    form.on('nome.text cognome.text', function (args) {
        var s = form.getData().saluto + ' ';
        s += form.getData().nome + ' ';
        s += (form.getData().cognome || "");
        form.getNode('msg1').prop('text').setRaw(s);
        form.getNode('msg2').prop('text').setRaw(s);
    });

    form.on('close.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close!');
        }
    });

    var wcfg = {
        prev: 'prev',
        next: 'next',
        submit: 'submit',
        selector: 'pill',
        pages: [
            { id: 'page1', next: 'page2', pill: 'ident' },
            { id: 'page2', prev: 'page1', next: 'page3', pill: 'ident' },
            { id: 'page3', prev: 'page2', next: true, pill: 'quest' },
            { id: 'page4', prev: 'page3' },
            { id: 'page5', prev: 'page3', submit: true, pill: 'success' },
        ]
    };

    var wiz = AuForms.wizard(form, wcfg);

    wiz.on('next', function (args) {
        if (args.destId === 'page5') {
            var f = form.getData().conferma;
            if (!f) args.destId = null;
        }
        else if (args.currId === 'page3') {
            var f = form.getData().conferma;
            args.destId = f ? 'page5' : 'page4';
        }
    });

    wiz.on('enter', function (args) {
        if (args.pageId === 'page5') {
            var tt = {
                "cols": [
                    {
                        "id": "c0",
                        "title": "Campo",
                        "bg": "rgba(0,0,0,0.1)"
                    },
                    {
                        "id": "c1",
                        "title": "Descrizione",
                        "width": "60%"
                    }
                ],
                "rows": [
                    {
                        "cells": {
                            "c0": {
                                "v": "Generale",
                                "b": true
                            }
                        },
                        "bg": "#d9edf7"
                    },
                    {
                        "cells": {
                            "c0": {
                                "v": "Nome"
                            },
                            "c1": {
                                "v": form.getData().nome
                            }
                        },
                        "bg": "#d9edf7"
                    },
                    {
                        "cells": {
                            "c0": {
                                "v": "Cognome"
                            },
                            "c1": {
                                "v": form.getData().cognome
                            }
                        },
                        "bg": "#d9edf7"
                    },
                    {
                        "cells": {
                            "c0": {
                                "v": "Peso"
                            },
                            "c1": {
                                "v": form.getData().peso
                            }
                        },
                        "bg": "#d9edf7"
                    },
                    {
                        "cells": {
                            "c0": {
                                "v": "Lunghezza"
                            },
                            "c1": {
                                "v": form.getData().lungh
                            }
                        },
                        "bg": "#d9edf7"
                    },
                    {
                    },
                    {
                        "cells": {
                            "c0": {
                                "v": "Conclusioni",
                                "b": true
                            }
                        },
                        "bg": "#dff0d8"
                    },
                    {
                        "cells": {
                            "c1": {
                                "v": "Tigro l'é un porzèl!"
                            }
                        },
                        "bg": "#d9edf7"
                    }
                ]
            };

            var n1 = form.getNode('riass1');
            AuForms.table(n1.getHost().empty(), tt);

            var n2 = form.getNode('riass2');
            AuForms.table(n2.getHost().empty(), tt);
        }
    });


    form.on('submit.click', function (args) {
        alert(JSON.stringify(form.getData()));
    });

    var f = false;
    form.on('.ready', function (args) {
        if (f) return;
        wiz.start('page1');
        f = true;
    });

    form.on('.errors', function (args) {
        var valok = !form.getHasErrors();
        console.log("valok=" + valok);
        wiz.setValid(valok);
    });

    var data = {
        saluto: "ciao",
        nome: "Tigro"
    };
    form.load(data);
}



samplesFactory.userPrefs = function (targets, options) {
    "use strict";

    var layout = { "type": "form", "body": { "type": "stack", "nodes": [{ "type": "row", "header": "Nome", "nodes": [{ "type": "textbox", "id": "nome", "text": { "path": "nome", "validate": {} } }] }, { "type": "row", "header": "Cognome", "nodes": [{ "type": "textbox", "id": "cognome", "text": { "path": "cognome", "validate": {} } }] }, { "type": "row", "header": "Messaggio 1", "nodes": [{ "type": "textbox", "id": "msg1", "readonly": true }] }, { "type": "row", "header": "Messaggio 2", "nodes": [{ "type": "textblock", "id": "msg2" }] }] }, "footer": { "type": "stack", "halign": "right", "nodes": [{ "type": "button", "id": "close", "text": "Close" }] } };
    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);
}



samplesFactory.dynamicLayout = function (targets, options) {
    "use strict";

    var layout = { "type": "form", "body": { "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Scelta layout", "nodes": [{ "type": "radioselect", "id": "layout", "value": { "validate": { "required": true } }, "enum": [{ "key": "simple", "value": "Pannello semplice" }, { "key": "nested", "value": "Pannello nidificato" }, { "key": "stacked", "value": "Pannelli impilati" }] }] }, { "type": "panel", "id": "simple", "visible": false, "gcols": [4, 8], "bg": "panel-info", "header": "Pannello semplice", "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Nome", "nodes": [{ "type": "textbox", "text": { "path": "nome", "validate": { "required": true } } }] }, { "type": "row", "gcols": [4, 8], "header": "Cognome", "nodes": [{ "type": "textbox", "text": { "path": "cognome", "validate": { "text": { "min": 3, "max": 10 } } } }] }, { "type": "row", "gcols": [4, 8], "header": "E-Mail", "nodes": [{ "type": "textbox", "pre": "@", "text": { "path": "e_mail", "validate": { "required": true, "email": {} } } }] }] }] }, { "type": "panel", "id": "nested", "visible": false, "gcols": [4, 8], "bg": "panel-info", "header": "Pannello nidificato", "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "header": "Peso", "nodes": [{ "type": "numbox", "post": "kg", "value": { "path": "peso", "validate": { "required": true, "float": { "min": 0.1, "max": 20.0 } } } }] }, { "type": "row", "header": "Lunghezza", "nodes": [{ "type": "numbox", "post": "cm", "value": { "path": "lungh", "validate": { "required": true, "int": { "min": 10, "max": 200 } } } }] }, { "type": "panel", "bg": "panel-default", "header": "Pannello interno", "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "Constatazione", "nodes": [{ "type": "checkbox", "text": "Tigro l'é un porzèl", "checked": { "path": "conferma", "validate": { "checked": true } } }] }, { "type": "row", "gcols": [4, 8], "header": "Stato civile", "nodes": [{ "type": "radioselect", "enum": [{ "key": "scap", "value": "Scapolo" }, { "key": "spos", "value": "Sposato" }, { "key": "div", "value": "Divorziato" }] }] }] }] }] }] }, { "type": "stack", "id": "stacked", "visible": false, "gcols": [4, 8], "nodes": [{ "type": "panel", "bg": "panel-default", "header": { "type": "radiobox", "id": "p1", "text": "Istante di nascita", "value": "P1", "group": "istanti" }, "nodes": [{ "type": "row", "header": "Orario", "nodes": [{ "type": "fgtime", "value": { "path": "nato_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di nascita" } }] }, { "type": "row", "header": "Data", "nodes": [{ "type": "fgdate", "value": { "path": "nato_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di nascita" } }] }] }, { "type": "panel", "bg": "panel-success", "header": { "type": "radiobox", "id": "p2", "text": "Istante di adozione", "value": "P2", "group": "istanti" }, "nodes": [{ "type": "row", "header": "Orario", "nodes": [{ "type": "fgtime", "value": { "path": "adoz_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di adozione" } }] }, { "type": "row", "header": "Data", "nodes": [{ "type": "fgdate", "value": { "path": "adoz_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di adozione" } }] }] }, { "type": "panel", "bg": "panel-info", "header": { "type": "radiobox", "id": "p3", "text": "Istante di vaccinazione", "value": "P3", "group": "istanti" }, "nodes": [{ "type": "grid-layout", "bg": "bg-info", "nodes": [{ "type": "row", "gcols": [6, 6], "header": "Data", "nodes": [{ "type": "fgdate", "value": { "path": "vacc_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di vaccinazione" } }] }, { "type": "row", "gcols": [6, 6], "header": "Orario", "nodes": [{ "type": "fgtime", "value": { "path": "vacc_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di vaccinazione" } }] }] }] }, { "type": "panel", "bg": "panel-danger", "header": { "type": "radiobox", "id": "p4", "text": "Istante di castrazione", "value": "P4", "group": "istanti" }, "nodes": [{ "type": "grid-layout", "bg": "bg-warning", "nodes": [{ "type": "row", "gcols": [6, 6], "nodes": [{ "type": "fgdate", "value": { "path": "castr_data", "validate": { "required": true } }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di castrazione" } }] }, { "type": "row", "gcols": [6, 6], "nodes": [{ "type": "fgtime", "value": { "path": "castr_ora", "validate": { "required": true } }, "options": { "modal": true, "title": "Immettere l'orario di castrazione" } }] }] }] }] }] }, "footer": { "type": "stack", "halign": "right", "inline": true, "nodes": [{ "type": "stack", "margin": "0,32,0,0", "inline": true, "nodes": [{ "type": "button", "id": "close", "text": "Close" }] }, { "type": "stack", "inline": true, "nodes": [{ "type": "button", "id": "reset", "text": "Reset" }, { "type": "button", "id": "submit", "text": "Submit" }] }] } };

    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    form.on('reset.click', function (args) {
        form.reload();
    });

    form.on('submit.click', function (args) {
        alert(JSON.stringify(form.getData()));
    });

    form.on('close.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close!');
        }
    });


    form.on('layout.value', function (args) {
        var layout = form.getNode('layout').prop('value').get();
        ['simple', 'nested', 'stacked'].forEach(function (k) {
            var n = form.getNode(k);
            n.prop('visible').set(k === layout);
        });
    });


    form.on('.errors', function (args) {
        var valok = !form.getHasErrors();
        console.log("valok=" + valok);
        form.getNode('submit').prop('enabled').set(valok);
    });
}



samplesFactory.iconery = function (targets, options) {
    "use strict";

    var layout = { "type": "form", "body": { "type": "stack", "nodes": [{ "type": "row", "gcols": [4, 8], "header": "A", "nodes": [{ "type": "icon", "value": { "path": "a" } }] }, { "type": "row", "gcols": [4, 8], "header": "B", "nodes": [{ "type": "icon", "value": { "path": "b" } }] }, { "type": "row", "gcols": [4, 8], "header": "C", "nodes": [{ "type": "icon", "value": { "path": "c" } }] }, { "type": "stack", "gcols": [4, 8], "inline": true, "nodes": [{ "type": "icon", "value": { "path": "a" } }, { "type": "icon", "value": { "path": "b" } }, { "type": "icon", "value": { "path": "c" } }] }, { "type": "panel", "gcols": [4, 8], "bg": "panel-info", "header": { "type": "row", "header": "Scelta icona", "nodes": [{ "type": "radioselect", "id": "icona", "value": { "validate": { "required": true } }, "enum": [{ "key": "a", "value": "A" }, { "key": "b", "value": "B" }, { "key": "c", "value": "C" }] }] }, "nodes": [{ "type": "stack", "nodes": [{ "type": "row", "header": "value", "nodes": [{ "type": "textbox", "id": "iconValue" }] }, { "type": "button", "id": "update", "text": "Update" }] }] }] }, "footer": { "type": "stack", "halign": "right", "nodes": [{ "type": "icon", "margin": "0px 0px 30px 0px", "value": "fa fa-camera-retro fa-3x text-info" }, { "type": "button", "id": "close", "text": "Close" }] } };

    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    form.on('close.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close!');
        }
    });


    form.on('icona.value', function (args) {
        var key = form.getNode('icona').prop('value').get();
        var icon = form.getData()[key];
        var s = _.isObject(icon) ? JSON.stringify(icon) : icon;
        form.getNode('iconValue').prop('text').set(s);
    });

    form.on('update.click', function (args) {
        var key = form.getNode('icona').prop('value').get();
        var t = form.getNode('iconValue').prop('text').get();
        var icon = t[0] === '{' ? JSON.parse(t) : t;
        form.getData()[key] = icon;
        form.render(AuForms.RenderLevel.update);
    });

    var data = {
        a: "fa fa-camera-retro fa-3x text-info",
        b: "fa fa-spinner fa-spin fa-3x fa-fw",
        c: ""
    };
    form.load(data);

}



samplesFactory.settingsL1 = function (targets, options) {
    "use strict";
    settings_common(targets, options, 'domain');
}

samplesFactory.settingsL2 = function (targets, options) {
    "use strict";
    settings_common(targets, options, 'user');
}


function settings_common(targets, options, level) {
    "use strict";

    var az = [], prevLevel = mySettings.getPrevLevelName(level);
    var layout = {
        "type": "form",
        "body": {
            "type": "stack",
            "overflow-y": "auto",
            "height": "100%",
            "nodes": []
        },
        "footer": {
            "type": "stack",
            "halign": "right",
            "inline": true,
            "nodes": [
                {
                    "type": "button",
                    "id": "save",
                    "text": "Save",
                    "margin": "0px 30px 0px 0px",
                }, {
                    "type": "button",
                    "id": "close",
                    "text": "Close"
                }]
        }
    };

    mySettings.getItems().forEach(function (i) {
        var z = i.getMeta().presenter();
        layout.body.nodes.push(z.getLayout(i));
        az.push(z);
    });

    var form = AuForms.Form(targets, options);
    form.layout(AuFormsWidgets).load(layout);

    az.forEach(function (z) {
        z.manage(form);
    });

    var data = {
        dd: mySettings.getLevelValues(prevLevel),
        cd: mySettings.getLevelData(level)
    };
    form.load(data);
    console.log(data);

    form.on('save.click', function (args) {
        var fd = form.getData();
        console.log(fd);
        mySettings.setLevelData(level, fd.cd);
        var ld = mySettings.getLevelData(level);
        console.log(ld);
    });

    form.on('close.click', function (args) {
        if (targets.close) {
            targets.close();
        }
        else {
            alert('close!');
        }
    });
}


function ZText() {
    var me = AuForms.InhItemPresenterBase();
    me.getHost = function (custom, path) {
        return {
            type: 'textbox',
            text: { path: path }
        };
    }
    return me;
}

function ZNum() {
    var me = AuForms.InhItemPresenterBase();
    me.getHost = function (custom, path) {
        return {
            type: 'numbox',
            value: { path: path }
        };
    }
    return me;
}

function ZCheck() {
    var me = AuForms.InhItemPresenterBase();
    me.getHost = function (custom, path) {
        return {
            type: 'checkbox',
            checked: { path: path }
        };
    }
    return me;
}

function ZSelect() {
    var me = AuForms.InhItemPresenterBase();
    me.getHost = function (custom, path) {
        return {
            type: 'select',
            value: { path: path },
            'enum': [
                { "key": "sib", "value": "Siberiano" },
                { "key": "eur", "value": "Europeo" },
                { "key": "nor", "value": "Norvegese delle foreste" },
                { "key": "siam", "value": "Siamese" },
                { "key": "mc", "value": "Maine-coon" },
                { "key": "rag", "value": "Rag-doll" },
                { "key": "bir", "value": "Birmano" },
                { "key": "per", "value": "Persiano" }
            ]
        };
    }
    return me;
}
