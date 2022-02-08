// ==UserScript==
// @name        BetterIndex
// @namespace   https://pablobls.tech/
// @match       *://*rivalregions.com/
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0.3
// @author      Pablo
// @description Index list
// @downloadURL https://github.com/pbl0/BetterIndexRR/raw/main/BetterIndex.user.js
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// ==/UserScript==

/**
 * v1.0.2 - Add/Remove button to add custom regions, change of custom region color
 * v1.0.3 - Visual fix
 */

var myRegions = GM_getValue('myregions');

if (!myRegions) {
    GM_setValue('myregions', []);
    myRegions = [];
}

$(document).ready(function () {
    window.addEventListener('popstate', listener);

    const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
    };

    listener();
});

function listener() {
    if (location.href.includes('#listed/country/-2/')) {
        filterRegions();
    } else if (location.href.includes('#map/details/')) {
        regionPage();
    }
}

function filterRegions() {
    var tableInterval = setInterval(function () {
        if ($('#table_list').length) {
            clearInterval(tableInterval);
            $('#table_list').css('border-collapse', 'collapse');
            var indiex = 1;
            $(
                $('tr.list_link.header_buttons_hover>.list_level.tip.yellow')
                    .get()
                    .reverse()
            ).each(function () {
                if ($(this).text() > indiex || $(this).text() == '11') {
                    indiex += 1;
                    $(this)
                        .parent()
                        .append(
                            '<td>' + Math.floor($(this).attr('rat')) + '</td>'
                        );
                } else if (myRegions.includes($(this).parent().attr('user'))) {
                    $(this).parent().css('color', '#54bb38');
                    $(this)
                        .parent()
                        .append(
                            '<td>' + Math.floor($(this).attr('rat')) + '</td>'
                        );
                } else {
                    $(this).parent().remove();
                }
            });
        }
    }, 500);
}

function addClickEvents() {
    var indexInterval = setInterval(function () {
        if (
            $(
                'div.mob_box_swipe_i_1.no_outline.slick-slide.slick-current.slick-active'
            ).length
        ) {
            clearInterval(indexInterval);
            $(
                '.mob_box_swipe_i_1.no_outline.slick-slide.slick-current.slick-active>.mob_box_inner.mob_box_4_clean.float_left.imp.tc'
            ).click(function () {
                slide_header($(this).attr('action'));
            });
        }
    }, 500);
}

function getMyRegions() {
    myRegions = GM_getValue('myregions');
}

function saveMyRegions() {
    GM_setValue('myregions', myRegions);
}

function removeRegion() {
    const regionId = location.href.split('details/')[1];
    myRegions = myRegions.filter((e) => e !== regionId);
}

function addRegion() {
    const regionId = location.href.split('details/')[1];
    myRegions.push(regionId);
}

function regionPage() {
    if (location.href.includes('//m.')) {
        addClickEvents();
        addButton(true)
    } else {
        $('#better-index').remove();
        addButton(false);
    }
}

function addButton(mobile) {
    let selector;
    if (mobile){
        console.log('si')
        selector = '#region_details_after > div > div';
    } else {
        selector = 'div.small.imp.tc>span';
    }

    var buttonInterval = setInterval(() => {
        if ($(selector).length) {
            clearInterval(buttonInterval);
            const regionId = location.href.split('details/')[1];
            let addRemoveText;
            let addRemoveFunc;
            if (myRegions.includes(regionId)) {
                addRemoveFunc = removeRegion;
                addRemoveText = 'BetterIndex Remove';
                color = 'red'
            } else {
                addRemoveText = 'BetterIndex Add';
                addRemoveFunc = addRegion;
                color = 'green'
            }
            if (mobile){
                mobileButton(addRemoveText, color)
            } else{
                pcButton(addRemoveText, color)
            }


            $('#better-index').click(function () {
                addRemoveFunc();
                saveMyRegions();
                location.reload();
            });
        }
    }, 500);
}

function mobileButton(addRemoveText, color) {
    

    $('#region_details_after').append(
        `<div class="details_act_in"><div class="button_${color} tip region_details_move_map float_left" id="better-index">${addRemoveText}</div></div>`
    );
}
function pcButton(addRemoveText, color) {
    $('.imp.tc.small')
    .first()
    .append(
        `<span><div class="button_${color} region_details_move" id="better-index">${addRemoveText}</div></span>`
    );
}