// ==UserScript==
// @name        RefillGoldScript
// @namespace   https://pablob.eu/
// @match       *://m.rivalregions.com/
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.9
// @author      Pablo
// @description just refills da gold
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/refill-gold/mobile/RefillGold.user.js
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// ==/UserScript==

/**
 * v0.0.8 -> small fix
 * v0.0.7 -> Fix on request
 * */

// State ID of your state:
const myState = GM_getValue('myState'); //  "3006";
// Hours it should wait for next refill ( default 2 ):
const hours = GM_getValue('hours');
// If gold level is below this it will refill (only works in your current region) ( default 250 ):
const threshold = GM_getValue('threshold');

const showTable = GM_getValue('table', true);

var tabla;

// First time
if (!myState) {
    GM_setValue('myState', '3006');
    const myState = GM_getValue('myState');
}
if (!hours) {
    GM_setValue('hours', 2);
    const hours = GM_getValue('hours');
}
if (!threshold) {
    GM_setValue('threshold', 250);
    const threshold = GM_getValue('threshold');
}

var autoRefillInterval;
const timePassed = hours * 3600000;
$(document).ready(function () {
    window.addEventListener('popstate', listener);

    const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
    };

    listener();
});

function listener() {
    if (location.href.includes('#main')) {
        mainPage();
        console.log('#main');
    }
    let lastRefill = localStorage.getItem('last_refill');
    if (
        JSON.parse(localStorage.getItem('is_my_state')) &&
        (lastRefill == null || c() - lastRefill > timePassed)
    ) {
        refill_gold();

        addTable();
    }

    if (autoRefillInterval !== undefined) {
        clearInterval(autoRefillInterval);
        console.log('autoRefill is off');
        autoRefillInterval = undefined;
    }
}

function refill_gold() {
    // Fetch

    fetch('https://m.rivalregions.com/parliament/donew/42/0/0', {
        headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'sec-ch-ua': '"Chromium";v="91", " Not;A Brand";v="99"',
            'sec-ch-ua-mobile': '?1',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://m.rivalregions.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `tmp_gov='0'&c=${c_html}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            // console.log(response);
            response.text().then((text) => {
                console.log(text);
                if (text == 'no 2') {
                    localStorage.setItem('is_my_state', false);
                    console.log('wrong state');
                } else if (text == 'ok') {
                    localStorage.setItem('last_refill', c());
                    console.log('gold refilled');
                    deleteTable();
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

function workPage() {
    var total = $(
        'div.mob_box_inner.mob_box_5_clean.float_left.imp.tc> div.yellow.small_box'
    ).text();
    if (
        $('.mslide.yellow').html() < threshold &&
        JSON.parse(localStorage.getItem('is_my_state')) &&
        total != '2500/2500'
    ) {
        refill_gold();
    }
}

function mainPage() {
    var mainPageInterval = setInterval(function () {
        if ($('#mob_box_region_1').length && !$('#my_mob_box').length) {
            clearInterval(mainPageInterval);

            if (
                $('#mob_box_region_2')
                    .attr('action')
                    .replace('map/state_details/', '') == myState
            ) {
                if (!$('#my_refill').length) {
                    addMenu(true);
                    $('#my_refill').click(refill_gold);
                    $('#auto_refill').click(autoRefill);
                }

                localStorage.setItem('is_my_state', true);
            } else {
                addMenu(false);
                localStorage.setItem('is_my_state', false);
            }
        }
    });
}

function addMenu(isOn) {
    let lastRefill = new Date(
        JSON.parse(localStorage.getItem('last_refill'))
    ).toLocaleString();
    var buttonColor;
    var buttonText;
    if (isOn) {
        buttonColor = 'link';
        buttonText = 'Refill now';
        if (showTable) {
            addTable();
        }
    } else {
        buttonColor = 'white';
        buttonText = 'Not your state';
        // autoRefillButton = "";
    }
    const myVersion = GM_info.script.version;
    $('.mob_box.mob_box_region_s').append(
        `<div id="my_refill" class="button_${buttonColor} index_auto pointer mslide">${buttonText}</div>
		<div class="tiny">Last refill: ${lastRefill} (state:${myState})
		<span class='addit_2'> Script by @pablobls (v${myVersion}) </span>
		</div>`
    );
}

function autoRefill() {
    console.log('auto refill on');
    $('#auto_refill').removeClass('button_green').addClass('button_white');
    autoRefillInterval = setInterval(function () {
        refill_gold();
    }, timePassed);
}

function refillFromTable() {
    var doRefill = false;
    $('#list_tbody>tr').each(function () {
        // console.log($(this).text());

        var limitLeft = $(this).find('td:nth-child(6)').text();

        if (limitLeft > 0) {
            var explored = $(this).find('td:nth-child(3)').text();
            if (explored <= threshold) {
                doRefill = true;
                console.log($(this).text());
            }
        }
    });

    if (doRefill) {
        console.log('Refill (table)');
        refill_gold();
    } else {
        console.log('No Refill (table)');
    }
}
function addTable() {
    // Fetch
    if (!tabla) {
        fetch(`/listed/stateresources/${myState}?c=${c_html}`, {
            method: 'GET',
        })
            .then((response) => {
                // console.log(response);
                response.text().then((text) => {
                    const html = $.parseHTML(text);
                    tabla = $(html).find('table');
                    $('.mob_box.mob_box_region_s').after(tabla);
                    refillFromTable();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        //console.log('table from cache', tabla)
        $('.mob_box.mob_box_region_s').after(tabla);
        // refillFromTable();
    }
}

function deleteTable() {
    tabla = null;
}
