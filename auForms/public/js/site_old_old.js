
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
        var target = $('#fbody').empty();
        var footer = $('#ffoot').empty();
        var info = fn(target);
        footer.append(AuForms.buttons.create(info.layout, null));
    }

    viewTargetHandlers.dialog = function (fn) {
        var target = $('<div>');
        var info = fn(target);

        var dialog = new BootstrapDialog({
            message: function (dialogRef) {
                return target;
            },
            closable: true
        });
        dialog.realize();
        var f = dialog.getModalFooter();
        f.show();
        f.find('.bootstrap-dialog-footer').append(AuForms.buttons.create(info.layout, dialog));
        dialog.open();
        //BootstrapDialog.show({
        //    title: 'Dialog title',
        //    message: target,
        //    buttons: [{
        //        label: 'Button 1',
        //        title: 'Mouse over Button 1'
        //    }, {
        //            label: 'Button 2',
        //            // no title as it is optional
        //            cssClass: 'btn-primary',
        //            action: function () {
        //                alert('Hi Orange!');
        //            }
        //        }, {
        //            icon: 'glyphicon glyphicon-ban-circle',
        //            label: 'Button 3',
        //            title: 'Mouse over Button 3',
        //            cssClass: 'btn-warning'
        //        }, {
        //            label: 'Close',
        //            action: function (dialogItself) {
        //                dialogItself.close();
        //            }
        //        }]
        //});
    }


    $('#btnRemoveForm').click(function () {
        $('#fbody').empty();
        $('#ffoot').empty();
    });

    $('#btnShowForm').click(function () {
        var h = viewTargetHandlers[viewTarget || 'page'];
        h && h(function (t) {
            var fn = sample && samplesFactory[sample];
            return fn && fn(t, sampleOptions);
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


samplesFactory["buttonDemo_2+2"] = function (target, options) {
    "use strict";

    var layout = {
        groups: [{
            items: [{
                type: "button",
                options: {
                    label: 'Bottone 1',
                    icon: 'glyphicon glyphicon-eye-open'
                }
            }, {
                    type: "button",
                    options: {
                        label: 'Bottone 2',
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
                }, {
                        type: "button",
                        options: {
                            label: "Close 2",
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
        },{
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


samplesFactory.basicText = function (target, options) {
    "use strict";

    var config = {
        sections: {
            main: [{
                type: "text",
                label: "Nome",
                name: "nome"
            }, {
                    type: "text",
                    label: "Cognome",
                    name: "cognome"
                }, {
                    type: "text",
                    label: "Messaggio",
                    watch: ["nome", "cognome"],
                    readonly: true,
                    conv: function (fctx) {
                        return {
                            toTarget: function () {
                                if (this.target) {
                                    var f = fctx.form;
                                    var s = f.getData().saluto + ' ';
                                    s += f.getData().nome + ' ';
                                    s += (f.getData().cognome || "") + ' ';
                                    this.target.val(s);
                                }
                            },
                        }
                    }
                }]
        }
    };

    var data = {
        saluto: "ciao",
        nome: "Tigro"
    };

    var fact = AuForms.JQFactory.get();
    var form = AuForms.create(fact);
    form.setConfig(config);
    form.setData(data);
    form.render(target);

    var layout = {
        groups: [{
            items: [{
                type: "button",
                options: {
                    label: "Close",
                    action: function (b, m, c) {
                        alert('close!');
                    }
                }
            }]
        }]
    }

    return {
        layout: layout
    }
}


samplesFactory.basicValidation = function (target, options) {
    "use strict";

    var config = {
        sections: {
            main: [{
                type: "text",
                label: "Nome",
                name: "nome",
                validate: {
                    required: true,
                    text: {}
                }
            }, {
                    type: "text",
                    label: "Cognome",
                    name: "cognome",
                    validate: {
                        text: {
                            minlength: 3,
                            maxlength: 10
                        }
                    }
                }, {
                    type: "text",
                    label: "E-Mail",
                    name: "e_mail",
                    validate: {
                        required: false,
                        email: {}
                    }
                }, {
                    type: "number",
                    label: "Peso (kg)",
                    name: "peso",
                    validate: {
                        required: true,
                        float: {
                            min: 0.1,
                            max: 20.0
                        }
                    }
                }, {
                    type: "number",
                    label: "Altezza (cm)",
                    name: "altezza",
                    validate: {
                        required: true,
                        int: {
                            min: 10,
                            max: 200
                        }
                    }
                }, {
                    type: "checkbox",
                    label: "Tigro è un porzèl!",
                    name: "conferma",
                    validate: {
                        checked: true
                    }
                }, {
                    type: "radio",
                    label: "Stato civile",
                    name: "stato_civile",
                    enum: [{ key: 'scap', value: 'Scapolo' }, { key: 'spos', value: 'Sposato' }, { key: 'div', value: 'Divorziato' }],
                    validate: {
                        checked: true,
                    }
                }, {
                    type: "select",
                    label: "Razza",
                    name: "razza",
                    enum: [{ key: 'sib', value: 'Siberiano' }, { key: 'eur', value: 'Europeo' }, { key: 'nor', value: 'Norvegese' }, { key: 'siam', value: 'Siamese' }, { key: 'abi', value: 'Abissino' }, { key: 'mc', value: 'Maine-coon' }],
                    validate: {
                        required: true,
                    }
                }, {
                    type: "multiselect",
                    label: "Disastri",
                    name: "disastri",
                    enum: [{ key: 'bicch', value: 'Bicchieri rotti' }, { key: 'albnat', value: 'Albero di Natale' }, { key: 'cusc', value: 'Cuscini' }, { key: 'div', value: 'Divano' }, { key: 'fiori', value: 'Fiori e piante' }, { key: 'cibo', value: 'Cibo per terra' }, { key: 'box', value: 'Scatole rovesciate' }, { key: 'h2o', value: 'Spruzzi d\'acqua in giro' }, { key: 'agg', value: 'Agguati' }, { key: 'betty', value: 'Zampate a Betty' }, { key: 'toys', value: 'Giocattoli sparsi per la casa' }],
                    validate: {
                        required: true,
                    }
                }, {
                    type: "fg_time",
                    label: "Orario di nascita",
                    name: "nato_ora",
                    conv: "text",
                    validate: {
                        required: true,
                    },
                    options: {
                        modal: true,
                        title: "Immettere l'orario di nascita"
                    }
                }, {
                    type: "fg_date",
                    label: "Data di nascita",
                    name: "nato_data",
                    conv: "text",
                    validate: {
                        required: true,
                    },
                    options: {
                        "large-mode": true,
                        "max-year": 2030,
                        "modal": true,
                        //"allow-drop-up": true
                        title: "Immettere la data di nascita"
                    }
                }, {
                    type: "fg_time",
                    label: "Orario di adozione",
                    name: "adoz_ora",
                    conv: "text",
                    validate: {
                        required: true,
                    },
                    options: {
                        modal: true,
                        title: "Immettere l'orario di adozione"
                    }
                }, {
                    type: "fg_date",
                    label: "Data di adozione",
                    name: "adoz_data",
                    conv: "text",
                    validate: {
                        required: true,
                    },
                    options: {
                        "large-mode": true,
                        "max-year": 2030,
                        "modal": true,
                        //"allow-drop-up": true
                        title: "Immettere la data di adozione"
                    }
                }]
        }
    };

    var data = {
        nome: "Tigro",
        cognome: "Porzèl",
        e_mail: "tigro@porzel.com",
        peso: 4.5,
        altezza: 35,
        conferma: true,
        stato_civile: 'scap',
        razza: 'nor',
        disastri: ['cusc', 'div']
    };

    var form = AuForms.create();
    form.setConfig(config);
    form.setData(data);
    form.render(target);

    //var btnres = $("<button>").addClass("btn btn-default").attr({ type: "button" }).css({ width: '100%' }).text("Reset");
    //btnres.click(function () {
    //    form.resetData();
    //    form.render($('#fbody').empty());
    //});

    //var btnsub = $("<button>").addClass("btn btn-default").attr({ type: "button" }).css({ width: '100%' }).text("Submit");
    //btnsub.click(function () {
    //    alert(JSON.stringify(form.getData()));
    //});

    //var ctr = $("<div>").addClass('row').appendTo($('#ffoot'));
    //$('<div>').addClass('col-xs-4').append(btnres).appendTo(ctr);
    //$('<div>').addClass('col-xs-4 col-xs-offset-4').append(btnsub).appendTo(ctr);

    form.validationUpdate = function (e) {
        console.log("valok=" + e.valok);
        //btnsub.attr({ disabled: (e.valok ? null : "disabled") });
        $('#sub1').attr({ disabled: (e.valok ? null : "disabled") });
    }

    var layout = {
        groups: [{
            items: [{
                type: "button",
                options: {
                    label: "Submit",
                    id: 'sub1',
                    action: function (b, m, c) {
                        alert(JSON.stringify(form.getData()));
                    }
                }
            }, {
                    type: "button",
                    options: {
                        label: "Reset",
                        action: function (b, m, c) {
                            form.resetData();
                            form.render(target.empty());
                        }
                    }
                }]
        }, {
                items: [{
                    type: "button",
                    options: {
                        label: "Close",
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

