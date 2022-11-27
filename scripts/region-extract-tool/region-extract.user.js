// ==UserScript==
// @name        Region Extract Tool
// @namespace   https://rr-tools.eu/
// @match       *://rivalregions.com/*
// @match       *://rr-tools.eu/*
// @author      Pablo
// @description
// @grant GM_setValue
// @grant GM_getValue
// @version     0.4
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/region-extract-tool/region-extract.user.js
// @require https://code.jquery.com/jquery-3.6.0.slim.min.js
// ==/UserScript==

/**
 *  IMPORTANT: ONLY WORKS ON ENGLISH INTERFACE OF RIVALREGIONS
 */

 $(document).ready(function () {
    window.addEventListener('popstate', listener);

    const pushUrl = (href) => {
        history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
    };

    listener();
});

function listener() {

    if (location.href.includes('#map/details/')) {
        regionPage();
    } else if (location.href.includes('/region-cost')) {
        calcPage();
    }
}

function regionPage() {
    const loadInterval = setInterval(() => {
        if ($('div.small.imp.tc>span').length) {
            clearInterval(loadInterval);
            $('.imp.tc.small')
                .first()
                .append(
                    `<span class=""><button id="my-extract-button">Extract</button></span>`
                );

            $('#my-extract-button').click(function () {
                extractRegion();
            });
        }
    }, 500);
}

function calcPage() {
    const loadInterval = setInterval(() => {
        const region = GM_getValue('my-region');
        console.log(region.buildings);
        if ($('div.container.box').length) {
            clearInterval(loadInterval);
            $(
                'app-buildings'
            ).append(
                `<a id="my-load-button" class="pt-3 button is-primary">${region.regionName}</a>`
            );
            $('#my-load-button').click(function () {
                const regionCostModelo = JSON.parse(
                    localStorage.getItem('regionCostModelo')
                );
                // console.log(regionCostModelo.buildings)
                regionCostModelo.buildings = region.buildings;

                localStorage.setItem(
                    'regionCostModelo',
                    JSON.stringify(regionCostModelo)
                );

                location.reload();
            });
        }
    }, 500);
}

function extractRegion() {
    buildingsHtml = $('div.imp.tc.small>span.tip.white.pointer.dot.small');

    myRegion = new Region();

    buildingsHtml.each(function () {
        const nameAndAmount = $(this).text().split(':');
        const name = nameAndAmount[0].trim();
        const amount = nameAndAmount[1].trim();

        switch (name) {
            case 'Hospital':
                myRegion.buildings['1'] = Number(amount);
                break;
            case 'Military base':
                myRegion.buildings['2'] = Number(amount);
                break;
            case 'School':
                myRegion.buildings['3'] = Number(amount);
                break;
            case 'Missile system':
                myRegion.buildings['4'] = Number(amount);
                break;
            case 'Sea port':
                myRegion.buildings['5'] = Number(amount);
                break;
            case 'Power plant':
                myRegion.buildings['6'] = Number(amount);
                break;
            case 'Spaceport':
                myRegion.buildings['7'] = Number(amount);
                break;
            case 'Airport':
                myRegion.buildings['8'] = Number(amount);
                break;
            case 'House fund':
                myRegion.buildings['9'] = Number(amount);
                break;

            default:
                break;
        }
    });

    myRegion.regionName = $('.white.slide_title').text().split(' and')[0];

    console.log(myRegion);



    GM_setValue('my-region', myRegion);
}

class Region {
    regionName = "";
    buildings = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
    };
}
