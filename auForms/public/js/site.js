
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
                                                link: '#'
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

var rightMenu = [
    {
        title: 'My Sidebar',
        id: 'sidebarID',
        icon: 'fa fa-home',
        items: []
    }];


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
    options_left.onItemClick = function () {
        console.log("item-click");
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

    $('#btnOpenWomen').click(function () {
        menul.multilevelpushmenu('expand', $('#women'));
    });

    $(window).on('resize', function () {
        menul.multilevelpushmenu('option', 'menuHeight', $(document).height() - 40);
        menul.multilevelpushmenu('redraw');
    });

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

    var menur = $('#menur').multilevelpushmenu(options_right);

    $('.mmenu-aux').click(function (e) {
        menur.multilevelpushmenu('expand');
    });



    var sample, sampleOptions = {}, viewTarget, viewTargetHandlers = {};

    viewTargetHandlers.page = function (fn) {
        var targets = {
            body: $('#fbody').empty(),
            footer: $('#ffoot').empty(),
            options: sampleOptions
        };
        fn(targets);
    }

    viewTargetHandlers.dialog = function (fn) {
        var targets = {
            body: $('<div>'),
            footer: null,
            options: sampleOptions
        };

        var dialog = new BootstrapDialog({
            message: function (dialogRef) {
                return targets.body;
            },
            closable: true
        });
        dialog.realize();
        targets.dialog = dialog;

        var f = dialog.getModalFooter();
        f.show();
        targets.footer = f.find('.bootstrap-dialog-footer');
        fn(targets);
        dialog.open();
    }


    $('#btnRemoveForm').click(function () {
        $('#fbody').empty();
        $('#ffoot').empty();
    });

    $('#btnShowForm').click(function () {
        var h = viewTargetHandlers[viewTarget || 'page'];
        h && h(function (targets) {
            var fn = sample && samplesFactory[sample];
            return fn && fn(targets);
        });
    });

    $('#sampleSelector').on('change', function () {
        sample = $(this).val();
    })

    $('#viewTarget').on('change', function () {
        viewTarget = $(this).val();
    })

    //$('#useDialog').on('change', function () {
    //    sampleOptions.useDialog = $(this).prop('checked');
    //})

    //$("#alarm").timeDropper();
    //$("#alarm").dateDropper();
});

var samplesFactory = {};


samplesFactory["buttonDemo_2+2"] = function (targets) {
    "use strict";

    var layout = { "body": {}, "footer": { "type": "hstack", "halign": "right", "nodes": [{ "type": "hstack", "margin": { "top": "0px", "right": "8px", "bottom": "0px", "left": "0px" }, "nodes": [{ "type": "button", "label": "Bottone 1", "icon": "glyphicon glyphicon-eye-open" }, { "type": "button", "label": "Bottone 2", "icon": "glyphicon glyphicon-thumbs-up" }] }, { "type": "hstack", "nodes": [{ "type": "button", "id": "c1", "label": "Close 1" }, { "type": "button", "id": "c2", "label": "Close 2" }] }] } };

    var form = AuForms.create();
    form.render(layout, targets);

    form.on('c1', function (sender, args) {
        if (targets.dialog) {
            targets.dialog.close();
        }
        else {
            alert('close 1!');
        }
    });

    form.on('c2', function (sender, args) {
        if (targets.dialog) {
            targets.dialog.close();
        }
        else {
            alert('close 2!');
        }
    });
}



samplesFactory["buttonDemo_1+2+1"] = function (target, options) {
    "use strict";

    var layout = {
        groups: [{
            items: [{
                type: "button",
                options: {
                    label: 'Bottone R',
                    icon: 'glyphicon glyphicon-eye-open'
                }
            }]
        }, {
                items: [{
                    type: "button",
                    options: {
                        label: 'Bottone M1',
                        icon: 'glyphicon glyphicon-eye-open'
                    }
                }, {
                        type: "button",
                        options: {
                            label: 'Bottone M2',
                            icon: 'glyphicon glyphicon-thumbs-up'
                        }
                    }]
            }, {
                items: [{
                    type: "button",
                    options: {
                        label: "Close 1",
                        action: function (b, m, c) {
                            if (c) {
                                c.close();
                            }
                            else {
                                alert('close!');
                            }
                        }
                    }
                }]
            }]
    }

    return {
        layout: layout
    }
}



samplesFactory.basicText = function (targets) {
    "use strict";

    var layout = { "body": { "type": "vstack", "nodes": [{ "type": "textbox", "id": "nome", "path": "nome", "label": "Nome" }, { "type": "textbox", "id": "cognome", "path": "cognome", "label": "Cognome" }, { "type": "textbox", "id": "msg1", "conv": "ucase", "label": "Messaggio 1" }, { "type": "textblock", "id": "msg2", "conv": "lcase", "label": "Messaggio 2" }] }, "footer": { "type": "hstack", "halign": "right", "nodes": [{ "type": "button", "id": "close", "label": "Close" }] } };

    var form = AuForms.create();
    form.getFactory().convs.ucase = function (fctx) {
        return {
            toTarget: function (vraw) {
                return vraw.toUpperCase();
            }
        }
    }

    form.getFactory().convs.lcase = function (fctx) {
        return {
            toTarget: function (vraw) {
                return vraw.toLowerCase();
            }
        }
    }

    form.render(layout, targets);

    form.on('nome cognome', function (sender, args) {
        var s = form.getData().saluto + ' ';
        s += form.getData().nome + ' ';
        s += (form.getData().cognome || "");
        form.getNode('msg1').set(s);
        form.getNode('msg2').set(s);
    });

    form.on('close', function (sender, args) {
        if (targets.dialog) {
            targets.dialog.close();
        }
        else {
            alert('close!');
        }
    });

    var data = {
        saluto: "ciao",
        nome: "Tigro"
    };
    form.setData(data);
}



samplesFactory.basicValidation = function (targets) {
    "use strict";

    var layout = { "body": { "type": "vstack", "nodes": [{ "type": "checkbox", "id": "global_enable", "text": "Abilitazione generale" }, { "type": "vstack", "id": "global_ctr", "nodes": [{ "type": "textblock", "glcl": [4, 8], "label": "Famiglia", "text": "Felidi" }, { "type": "textbox", "glcl": [4, 8], "path": "nome", "label": "Nome", "validate": { "required": true } }, { "type": "textbox", "glcl": [4, 8], "path": "cognome", "label": "Cognome", "validate": { "text": { "min": 3, "max": 10 } } }, { "type": "textbox", "bg": "bg-info", "glcl": [4, 8], "path": "e_mail", "label": "E-Mail", "pre": "@", "validate": { "required": true, "email": {} } }, { "type": "numbox", "bg": "bg-info", "glcl": [4, 8], "path": "peso", "label": "Peso", "post": "kg", "validate": { "required": true, "float": { "min": 0.1, "max": 20.0 } } }, { "type": "numbox", "bg": "bg-info", "glcl": [4, 8], "path": "lungh", "label": "Lunghezza", "post": "cm", "validate": { "required": true, "int": { "min": 10, "max": 200 } } }, { "type": "checkbox", "glcl": [4, 8], "path": "conferma", "label": "Constatazione", "text": "Tigro l'é un porzèl", "validate": { "checked": true } }, { "type": "radio", "glcl": [4, 8], "path": "stato_civile", "label": "Stato civile", "validate": { "required": true }, "enum": [{ "key": "scap", "value": "Scapolo" }, { "key": "spos", "value": "Sposato" }, { "key": "div", "value": "Divorziato" }] }, { "type": "select", "glcl": [4, 8], "path": "razza", "label": "Razza", "validate": { "required": true }, "enum": [{ "key": "sib", "value": "Siberiano" }, { "key": "eur", "value": "Europeo" }, { "key": "nor", "value": "Norvegese delle foreste" }, { "key": "siam", "value": "Siamese" }, { "key": "mc", "value": "Maine-coon" }, { "key": "rag", "value": "Rag-doll" }, { "key": "bir", "value": "Birmano" }, { "key": "per", "value": "Persiano" }] }, { "type": "multiselect", "glcl": [4, 8], "path": "disastri", "label": "Disastri commessi", "validate": { "required": true }, "enum": [{ "key": "bicch", "value": "Bicchieri rotti" }, { "key": "albnat", "value": "Albero di Natale svenuto" }, { "key": "cusc", "value": "Cuscini" }, { "key": "div", "value": "Divano" }, { "key": "fiori", "value": "Fiori e piante" }, { "key": "cibo", "value": "Cibo per terra" }, { "key": "box", "value": "Scatole rovesciate" }, { "key": "h2o", "value": "Spruzzi d'acqua in giro" }, { "key": "agg", "value": "Agguati" }, { "key": "betty", "value": "Zampate a Betty" }, { "key": "toys", "value": "Giocattoli sparsi per la casa" }] }, { "type": "fgtime", "glcl": [4, 8], "path": "nato_ora", "label": "Orario di nascita", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di nascita" } }, { "type": "fgdate", "glcl": [4, 8], "path": "nato_data", "label": "Data di nascita", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di nascita" } }, { "type": "fgtime", "glcl": [4, 8], "path": "adoz_ora", "label": "Orario di adozione", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di adozione" } }, { "type": "fgdate", "glcl": [4, 8], "path": "adoz_data", "label": "Data di adozione", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di adozione" } }, { "type": "grid-layout", "bg": "bg-info", "glcl": [4, 8], "nodes": [{ "type": "fgdate", "gl-col": "6", "path": "vacc_data", "label": "Data di vaccinazione", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di vaccinazione" } }, { "type": "fgtime", "gl-col": "6", "path": "vacc_ora", "label": "Orario di vaccinazione", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di vaccinazione" } }] }, { "type": "grid-layout", "bg": "bg-warning", "glcl": [4, 8], "label": "Data/ora castrazione", "nodes": [{ "type": "fgdate", "gl-col": "6", "path": "castr_data", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di castrazione" } }, { "type": "fgtime", "gl-col": "6", "path": "castr_ora", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di castrazione" } }] }, { "type": "textarea", "glcl": [4, 8], "path": "note", "label": "Note" }] }] }, "footer": { "type": "hstack", "halign": "right", "nodes": [{ "type": "hstack", "margin": { "top": "0px", "right": "32px", "bottom": "0px", "left": "0px" }, "nodes": [{ "type": "button", "id": "close", "label": "Close" }] }, { "type": "hstack", "nodes": [{ "type": "button", "id": "reset", "label": "Reset" }, { "type": "button", "id": "submit", "label": "Submit" }] }] } };

    var form = AuForms.create();
    form.render(layout, targets);

    form.on('reset', function (sender, args) {
        form.resetData();
    });

    form.on('submit', function (sender, args) {
        alert(JSON.stringify(form.getData()));
    });

    form.on('close', function (sender, args) {
        if (targets.dialog) {
            targets.dialog.close();
        }
        else {
            alert('close!');
        }
    });

    form.on('global_enable', function (sender, args) {
        var e = sender.get();
        form.getNode('global_ctr').enabled(e);
    });

    form.getNode('global_ctr').enabled(form.getNode('global_enable').get());

    form.validationUpdate = function (e) {
        console.log("valok=" + e.valok);
        form.getNode('submit').enabled(e.valok);
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
        note: "Povero martire di Betty..."
    };
    form.setData(data);
}



samplesFactory.panels = function (targets) {
    "use strict";

    var layout = { "body": { "type": "vstack", "nodes": [{ "type": "select", "id": "s1", "glcl": [4, 8], "path": "razza", "validate": { "required": true }, "enum": [{ "key": "", "value": "- - -" }, { "key": "sib", "value": "Siberiano" }, { "key": "eur", "value": "Europeo" }, { "key": "nor", "value": "Norvegese delle foreste" }, { "key": "siam", "value": "Siamese" }, { "key": "mc", "value": "Maine-coon" }, { "key": "rag", "value": "Rag-doll" }, { "key": "bir", "value": "Birmano" }, { "key": "per", "value": "Persiano" }], "label": { "type": "radio", "id": "r1", "label": "", "group": "vacanze", "font": { "bold": true }, "enum": [{ "key": "R", "value": "Razza" }] } }, { "type": "multiselect", "id": "s2", "glcl": [4, 8], "path": "disastri", "validate": { "required": true }, "enum": [{ "key": "bicch", "value": "Bicchieri rotti" }, { "key": "albnat", "value": "Albero di Natale svenuto" }, { "key": "cusc", "value": "Cuscini" }, { "key": "div", "value": "Divano" }, { "key": "fiori", "value": "Fiori e piante" }, { "key": "cibo", "value": "Cibo per terra" }, { "key": "box", "value": "Scatole rovesciate" }, { "key": "h2o", "value": "Spruzzi d'acqua in giro" }, { "key": "agg", "value": "Agguati" }, { "key": "betty", "value": "Zampate a Betty" }, { "key": "toys", "value": "Giocattoli sparsi per la casa" }], "label": { "type": "radio", "id": "r2", "group": "vacanze", "font": { "bold": true }, "enum": [{ "key": "D", "value": "Disastri commessi" }] } }, { "type": "panel", "bg": "panel-info", "glcl": [4, 8], "header": "Pannello semplice", "nodes": [{ "type": "vstack", "nodes": [{ "type": "textbox", "glcl": [4, 8], "path": "nome", "label": "Nome", "validate": { "required": true } }, { "type": "textbox", "glcl": [4, 8], "path": "cognome", "label": "Cognome", "validate": { "text": { "min": 3, "max": 10 } } }, { "type": "textbox", "bg": "bg-info", "glcl": [4, 8], "path": "e_mail", "label": "E-Mail", "pre": "@", "validate": { "required": true, "email": {} } }] }] }, { "type": "panel", "bg": "panel-info", "glcl": [4, 8], "header": "Pannello nidificato", "nodes": [{ "type": "vstack", "nodes": [{ "type": "numbox", "bg": "bg-info", "path": "peso", "label": "Peso", "post": "kg", "validate": { "required": true, "float": { "min": 0.1, "max": 20.0 } } }, { "type": "numbox", "bg": "bg-info", "path": "lungh", "label": "Lunghezza", "post": "cm", "validate": { "required": true, "int": { "min": 10, "max": 200 } } }, { "type": "panel", "header": "Pannello interno", "nodes": [{ "type": "vstack", "nodes": [{ "type": "checkbox", "glcl": [4, 8], "path": "conferma", "label": "Constatazione", "text": "Tigro l'é un porzèl", "validate": { "checked": true } }, { "type": "radio", "glcl": [4, 8], "path": "stato_civile", "label": "Stato civile", "validate": { "required": true }, "enum": [{ "key": "scap", "value": "Scapolo" }, { "key": "spos", "value": "Sposato" }, { "key": "div", "value": "Divorziato" }] }] }] }] }] }, { "type": "panel", "glcl": [4, 8], "header": { "type": "radio", "id": "p1", "group": "istanti", "enum": [{ "key": "P1", "value": "Istante di nascita" }] }, "nodes": [{ "type": "fgtime", "path": "nato_ora", "label": "Orario", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di nascita" } }, { "type": "fgdate", "path": "nato_data", "label": "Data", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di nascita" } }] }, { "type": "panel", "glcl": [4, 8], "header": { "type": "radio", "id": "p2", "group": "istanti", "enum": [{ "key": "P2", "value": "Istante di adozione" }] }, "nodes": [{ "type": "fgtime", "path": "adoz_ora", "label": "Orario", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di adozione" } }, { "type": "fgdate", "path": "adoz_data", "label": "Data", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di adozione" } }] }, { "type": "panel", "glcl": [4, 8], "header": { "type": "radio", "id": "p3", "group": "istanti", "enum": [{ "key": "P3", "value": "Istante di vaccinazione" }] }, "nodes": [{ "type": "grid-layout", "bg": "bg-info", "nodes": [{ "type": "fgdate", "gl-col": "6", "path": "vacc_data", "label": "Data", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di vaccinazione" } }, { "type": "fgtime", "gl-col": "6", "path": "vacc_ora", "label": "Orario", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di vaccinazione" } }] }] }, { "type": "panel", "glcl": [4, 8], "header": { "type": "radio", "id": "p4", "group": "istanti", "enum": [{ "key": "P4", "value": "Istante di castrazione" }] }, "nodes": [{ "type": "grid-layout", "bg": "bg-warning", "nodes": [{ "type": "fgdate", "gl-col": "6", "path": "castr_data", "validate": { "required": true }, "options": { "modal": true, "large-mode": true, "max-year": 2030, "title": "Immettere la data di castrazione" } }, { "type": "fgtime", "gl-col": "6", "path": "castr_ora", "validate": { "required": true }, "options": { "modal": true, "title": "Immettere l'orario di castrazione" } }] }] }] }, "footer": { "type": "hstack", "halign": "right", "nodes": [{ "type": "hstack", "margin": { "top": "0px", "right": "32px", "bottom": "0px", "left": "0px" }, "nodes": [{ "type": "button", "id": "close", "label": "Close" }] }, { "type": "hstack", "nodes": [{ "type": "button", "id": "reset", "label": "Reset" }, { "type": "button", "id": "submit", "label": "Submit" }] }] } };

    var form = AuForms.create();
    form.render(layout, targets);

    form.on('reset', function (sender, args) {
        form.resetData();
    });

    form.on('submit', function (sender, args) {
        alert(JSON.stringify(form.getData()));
    });

    form.on('close', function (sender, args) {
        if (targets.dialog) {
            targets.dialog.close();
        }
        else {
            alert('close!');
        }
    });

    function enablePanels() {
        'p1 p2 p3 p4'.split(' ').forEach(function (id) {
            var node = form.getNode(id);
            console.log(id+'='+node.get())
            node.getParent().enableChildren(node.get());
        });
    }
    enablePanels();

    form.on('p1 p2 p3 p4', function (sender, args) {
        enablePanels();
    });

    form.validationUpdate = function (e) {
        console.log("valok=" + e.valok);
        $('#submit').attr({ disabled: (e.valok ? null : "disabled") });
    }

    var data = {
    };
    form.setData(data);
}

