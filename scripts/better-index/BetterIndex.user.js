// ==UserScript==
// @name        BetterIndex
// @namespace   https://pablob.eu/
// @match       https://m.rivalregions.com/
// @match       https://rivalregions.com/
// @version     1.1.0
// @author      Pablo
// @description Index list
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/better-index/BetterIndex.user.js
// ==/UserScript==

/**
 * Use ViolentMonkey or Bromite
 * 
 * v1.1.0 - Major update: Port to bromite, entire refactor, remove jQuery usage and GM_values.
 * v1.0.4 - Minor fixes.
 * v1.0.3 - Visual fix.
 * v1.0.2 - Add/Remove button to add custom regions, change of custom region color.
 */

var myRegions = getLocalStorageItem('myregions');

if (!myRegions) {
    myRegions = [];
    setLocalStorageItem('myregions', JSON.stringify(myRegions));
}


setTimeout(() => {
    console.log('betterIndex')
    window.addEventListener('popstate', listener);
    const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
    };

    listener();
}, 1000);

function listener() {
    if (location.href.includes('#listed/country/-2/')) {
        filterRegions();
    } else if (location.href.includes('#map/details/')) {
        regionPage();
    }
}

function filterRegions() {
    var tableInterval = setInterval(function () {
        var tableList = document.querySelector('#table_list');
        if (tableList) {
            clearInterval(tableInterval);
            tableList.style.borderCollapse = 'collapse';
            var indiex = 1;
            var listLevels = Array.from(
                document.querySelectorAll(
                    'tr.list_link.header_buttons_hover>.list_level.tip.yellow'
                )
            ).reverse();
            listLevels.forEach(function (level) {
                var text = level.innerText;
                var parent = level.parentElement;
                if (text > indiex || text === '11') {
                    indiex += 1;
                    var rat = Math.floor(level.getAttribute('rat'));
                    parent.insertAdjacentHTML('beforeend', '<td>' + rat + '</td>');
                } else if (myRegions.includes(level.parentElement.getAttribute('user'))) {
                    parent.style.color = '#54bb38';
                    var rat = Math.floor(level.getAttribute('rat'));
                    parent.insertAdjacentHTML('beforeend', '<td>' + rat + '</td>');
                } else {
                    parent.remove();
                }
            });
        }
    }, 500);
}

function addClickEvents() {
    var indexInterval = setInterval(function () {
        var mobBoxSlide = document.querySelector(
            'div.mob_box_swipe_i_1.no_outline.slick-slide.slick-current.slick-active'
        );
        if (mobBoxSlide) {
            clearInterval(indexInterval);
            var mobBoxInner = mobBoxSlide.querySelector(
                '.mob_box_inner.mob_box_4_clean.float_left.imp.tc'
            );
            mobBoxInner.addEventListener('click', function () {
                slide_header(mobBoxInner.getAttribute('action'));
            });
        }
    }, 500);
}

function getMyRegions() {
    myRegions = getLocalStorageItem('myregions');
}

function saveMyRegions() {
    setLocalStorageItem('myregions', myRegions);
}

function removeRegion() {
    var regionId = location.href.split('details/')[1];
    myRegions = myRegions.filter(function (e) {
        return e !== regionId;
    });
}

function addRegion() {
    var regionId = location.href.split('details/')[1];
    myRegions.push(regionId);
}

function regionPage() {
    if (location.href.includes('//m.')) {
        // addClickEvents(); // No longer needed. Links were added to the base game.
        addButton(true);
    } else {
        var betterIndex = document.querySelector('#better-index');
        if (betterIndex) {
            betterIndex.remove();
        }
        addButton(false);
    }
}

function addButton(mobile) {
    let selector;
    if (mobile) {
        selector = '#region_details_after > div > div';
    } else {
        selector = 'div.small.imp.tc>span';
    }

    var buttonInterval = setInterval(function () {
        var elements = document.querySelectorAll(selector);
        if (elements.length) {
            clearInterval(buttonInterval);
            const regionId = location.href.split('details/')[1];
            let addRemoveText;
            let addRemoveFunc;
            let color;
            if (myRegions.includes(regionId)) {
                addRemoveFunc = removeRegion;
                addRemoveText = 'BetterIndex Remove';
                color = 'red';
            } else {
                addRemoveText = 'BetterIndex Add';
                addRemoveFunc = addRegion;
                color = 'green';
            }
            if (mobile) {
                mobileButton(addRemoveText, color);
            } else {
                pcButton(addRemoveText, color);
            }

            var betterIndex = document.getElementById('better-index');
            betterIndex.addEventListener('click', function () {
                addRemoveFunc();
                saveMyRegions();
                setTimeout(() => {
                    location.reload();
                }, 500);

            });
        }
    }, 500);
}

function mobileButton(addRemoveText, color) {
    var detailsAfter = document.getElementById('region_details_after');
    detailsAfter.insertAdjacentHTML(
        'beforeend',
        `<div class="details_act_in"><div class="button_${color} tip region_details_move_map float_left" id="better-index">${addRemoveText}</div></div>`
    );
}

function pcButton(addRemoveText, color) {
    var impTcSmall = document.querySelector('.imp.tc.small');
    var span = document.createElement('span');
    span.innerHTML = `<div class="button_${color} region_details_move" id="better-index">${addRemoveText}</div>`;
    impTcSmall.appendChild(span);
}

function getLocalStorageItem(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (error) {
        return []; s
    }


}

function setLocalStorageItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}