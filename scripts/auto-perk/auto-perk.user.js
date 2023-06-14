// ==UserScript==
// @name        auto-perk
// @namespace   https://pablob.eu/
// @match       *://*rivalregions.com/
// @author      pablo
// @description Subite los stats bobo
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.6
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/auto-perk/auto-perk.user.js
// ==/UserScript==

/**
 * v0.0.5 - removed bug that caused infinite page-refreshing to many people. Many thanks to Itusil for finding the error & fixing it! 
 * v0.0.3 - added perk and url menu
 */

/**
 * ONLY WORKS WITH ENGLISH INTERFACE
 *
 * Perk:
 * 1 = strength
 * 2 = education
 * 3 = endurance
 *
 * Url:
 * 1 = money
 * 2 = gold
 *
 *
 */
//const $ = window.jQuery;
const firstTime = GM_getValue('first-time', true);

if (firstTime) {
    GM_setValue('perk', 2); // perk
    GM_setValue('url', 1); // url
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
    if (location.href.includes('#overview')) {
        mainPage();
    }
}

function mainPage() {
    if (firstTime) {
        GM_setValue('first-time', false);
    }
    var waitInterval = setInterval(() => {
        if ($('#index_perks_list').length) {
            addMenu();
            clearInterval(waitInterval);
            // to check if any perk is already active
            const countdownAmount = $(
                '#index_perks_list>div>div[perk]>.hasCountdown'
            ).length;
            if (countdownAmount === 0) {
                setTimeout(() => {
                    upgradePerk();
                }, 1000);
            } else {
                console.log('perk already active');

                setUpgradeTimeout();
            }
        }
    }, 1000);
}

function upgradePerk() {
    const perk = $('#myperk').val(); // GM_getValue('perk');
    const url = $('#myurl').val(); // GM_getValue('url');
    const realperk = perk;
    // console.log(perk, url)
    if (perk == '4'){
        let str = parseInt($('div.perk_item:nth-child(4) > .perk_source_2').text());
        let edu = parseInt($('div.perk_item:nth-child(5) > .perk_source_2').text());
        let end = parseInt($('div.perk_item:nth-child(6) > .perk_source_2').text());

        let strtime = Math.pow(str+1, 2)/2;
        let edutime = Math.pow(edu+1, 2);
        let endtime = Math.pow(end+1, 2);

        strtime = str<50?strtime/4:str<100?strtime/2:strtime;
        edutime = edu<50?edutime/4:str<100?edutime/2:edutime;
        endtime = end<50?endtime/4:str<100?endtime/2:endtime;

        if (edutime <= strtime && edutime <= endtime) {
            realperk = '2';
        } else if (strtime <= endtime ) {
            realperk = '1';
        } else {
            realperk = '3';
        }
    }
    $.ajax({
        url: '/perks/up/' + realperk + '/' + url,
        data: { c: c_html },
        type: 'POST',
        success: function (data) {
            console.log('perk upgraded', new Date().toLocaleString());
            // console.log(data);
            // ajax_action('main/content');

            location.reload();
        },
    });
}

function setUpgradeTimeout() {
    let nextPerkText = $('.ib_border>div>.tc>.small')
        .first()
        .text()
        .replace('New skill level: ', '');

    const tiempo = $('#index_perks_list>div>div[perk]>.hasCountdown').text();

    //Itusil
    //Cambiamos la forma de mirar cuanto queda, ahora sacamos el tiempo que ble queda a la perk y lo pasamos a ms
    let longitud = tiempo.length;
    let ms = 0;
    nextPerkText = '';
    if (tiempo.includes('d ')) {
        //Significará que es dd 'd' HH:mm:ss
        const tiempoSplitted = tiempo.split(' d ');

        const MHSArr = tiempoSplitted[1].split(':');
        const dias = tiempoSplitted[0];
        const horas = MHSArr[0];
        const mins = MHSArr[1];
        const segs = MHSArr[2];

        //Tiempo en ms
        ms = dias * 86400000 + horas * 3600000 + mins * 60000 + segs * 1000;
    } else {
        const MHSArr = tiempo.split(':');
        if (longitud > 5) {
            //Significará que es HH:mm:ss
            const horas = MHSArr[0];
            const mins = MHSArr[1];
            const segs = MHSArr[2];
            //Tiempo en ms
            ms = horas * 3600000 + mins * 60000 + segs * 1000;
        } else {
            //Significará que es mm:ss
            const mins = MHSArr[0];
            const segs = MHSArr[1];
            ms = mins * 60000 + segs * 1000;
        }
    }

    const timeout = ms;

    console.log(timeout)

    nextPerkText = 'Timer for next perk set in ' + tiempo;

    addDiv(nextPerkText);

    setTimeout(() => {
        upgradePerk();
    }, timeout + 60000);
}

function addDiv(nextPerkDate) {
    if ($('#my-div').length <= 0) {
        const perks = ['Stregth', 'Education', 'Endurance'];
        const urls = ['Money', 'Gold'];

        const div = `   <div id="my-div" class="perk_item ib_border hov pointer">
                            <div class="tc small">${nextPerkDate}</div>
                            <div class="tc small">${GM_info.script.name} v${GM_info.script.version} by ${GM_info.script.author}</div>
                            <div class="tc small">
                                <a target="blank_" href="https://github.com/pbl0/rr-scripts">More scripts</a>
                            </div>
                        </div>`;

        if (window.location.href.includes('#overview')) {
            $('#index_perks_list').append(div);
        }
    }
}

function addMenu() {
    if ($('#mymenu').length <= 0) {
        const perk = Number(GM_getValue('perk'));

        const url = Number(GM_getValue('url'));

        // console.log(perk, url)

        const input = `<div id="mymenu" class="perk_item ib_border hov pointer">
                            
                            <select id="myurl">
                                <option ${
                                    url == 1 ? 'selected' : ''
                                } value="1">Money</option>
                                <option ${
                                    url == 2 ? 'selected' : ''
                                } value="2">Gold</option>
                            </select>
                            <select id="myperk">
                                <option ${
                                    perk == 1 ? 'selected' : ''
                                } value="1">Stregth</option>
                                <option ${
                                    perk == 2 ? 'selected' : ''
                                } value="2">Education</option>
                                <option ${
                                    perk == 3 ? 'selected' : ''
                                } value="3">Endurance</option>
                                <option ${
                                    perk == 4 ? 'selected' : ''
                                } value="4">Best</option>
                            </select>
    
                        </div>`;
        $('#index_perks_list').append(input);

        $('#myurl').change(function () {
            GM_setValue('url', $(this).val());
        });
        $('#myperk').change(function () {
            GM_setValue('perk', $(this).val());
        });
    }
}
