// ==UserScript==
// @name        Power Calculator
// @namespace   https://pablobls.tech/
// @match       *://rivalregions.com/*
// @author      Pablo
// @description Small userscript that adds blur effect to RivalRegions game overlay in PC version
// @version     0.0.1
// @downloadURL https://github.com/pbl0/power-plant/raw/master/power-plant.user.js
// ==/UserScript==

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
        calcAndShow();
    }
}

function calcAndShow() {
    const loadInterval = setInterval(() => {
        if ($('div.small.imp.tc>span').length) {
            clearInterval(loadInterval);
            let sum = 0;
            let powerPlants = 0;
            $('span.tip.white.pointer.dot.small').each(function () {
                const excludedBuildings = [
                    'Military academy',
                    'House fund',
                    'Power plant',
                ];

                let item = $(this).text().split(': ');

                if (!excludedBuildings.includes(item[0])) {
                    sum += Number(item[1].split('/')[1] || item[1]);
                    console.log(item[0], item[1].split('/')[1] || item[1]);
                } else if (item[0] == excludedBuildings[2]) {
                    powerPlants = Number(item[1]);
                }
            });

            const result = Math.floor(powerPlants - sum / 5);

            let text;
            let cssClass;
            let sign;

            if (result > 0) {
                text = 'surplus';
                cssClass = 'uranium';
                sign = '+';
            } else {
                text = 'deficit';
                cssClass = 'ore';
                sign = '';
            }

            // console.log(Math.floor(result) + "plants surplus/deficit");
            $('.imp.tc.small')
                .first()
                .append(
                    `<span class="tip ${cssClass} pointer">${
                        sign + result
                    } plant ${text}</span>`
                );
        }
    }, 500);
}
