
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
        menuHeight: $(document).height()-40,
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
});
