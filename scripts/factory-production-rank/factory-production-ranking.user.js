// ==UserScript==
// @name         Factory Production Ranking
// @namespace    pbl0.github.io/rr-tools
// @version      0.3
// @description  Description
// @author       Pablo
// @match        https://rivalregions.com/info/regions
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://code.jquery.com/jquery-3.6.0.slim.min.js
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/factory-production-rank/factory-production-ranking.user.js
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
    if (location.href === 'https://rivalregions.com/info/regions') {
        info();
    }
}

function info() {
    const selectOptions = [
        { id: 0, text: 'Resource', cols: [], value: 0 },
        { id: 1, text: 'Oil', value: 1 },
        { id: 2, text: 'Ore', value: 2 },
        { id: 3, text: 'Uranium', value: 3 },
        { id: 4, text: 'Diamond', value: 4 },
    ];

    let options = '';
    for (item of selectOptions) {
        options += `<option value="${item.value}">${item.text}</option>`;
    }

    $('body').prepend(`
    <div id="menu">
    <strong>${GM_info.script.name} v${GM_info.script.version} by Pablo</strong> <br>
    <label>lvl</label>
        <input value="0" type="number" id="lvl" placeholder="lvl"></input>
        <label>exp</label>
        <input value="0" type="number" id="exp" placeholder="exp"></input>

        <label>Market price</label>
        <input value="0" type="number" id="price" placeholder="market price"></input>

        <select id="res">

        ${options}

        </select>
        <br>
        <span><strong>Notice:</strong> Factory salary% and Deptarments bonus% will change the final production</span>
        <br>
        <span style="font-size: 13px">More tools & scripts in <a href="https://rr-tools.eu">rr-tools.eu</a> </span>


    </div>

    `);

    loadSettings();

    $('input').each(function () {
        $(this).change(function () {
            saveSettings();
        });
    });

    $(
        'tr>td:nth-child(n+2):nth-child(-n+16), tr>th:nth-child(n+2):nth-child(-n+16)'
    ).each(function () {
        $(this).remove();
    });

    setTimeout(function () {
        $(
            'tr>td:nth-child(n+6):nth-child(-n+11), tr>th:nth-child(n+6):nth-child(-n+11)'
        ).each(function () {
            $(this).remove();
        });
    }, 500);
    $('tr>td:not(:first-child), tr>th:not(:first-child)').hide();

    $('tr>td:nth-child(n+2):nth-child(-n+5)').each(function () {
        const elem = $(this);

        if (elem.text() == 0) {
            elem.css('background-color', 'red');
        }
    });

    $('thead>tr').append('<th class="header">10E Prod</th>');
    $('thead>tr').append('<th class="header">300E Prod</th>');
    $('thead>tr').append('<th class="header">$</th>');

    $('#res').change(function () {
        const resId = Number($(this).val());

        let columns;

        switch (resId) {
            case 0:
                columns = [];
                break;
            case 1:
                columns = [2, 6, 12, 18, 22];
                break;

            case 2:
                columns = [3, 7, 12, 17, 24];
                break;
            case 3:
                columns = [4, 8, 12, 19, 26];
                break;
            case 4:
                columns = [5, 9, 12, 20, 28];
                break;

            default:
                break;
        }

        let tdcols = '';
        let thcols = '';

        for (item of columns) {

            tdcols += `,td:nth-child(${item})`;
            thcols += `,th:nth-child(${item})`;
        }
        $('tr>td:nth-child(33)').remove();
        $('tr>td:nth-child(34)').remove();
        $('tr>td:nth-child(35)').remove();
        $(
            'tr>td:not(:first-child), tr>th:not(:first-child, :nth-child(33), :nth-child(34), :nth-child(35))'
        ).hide();

        $(`td:nth-child(1),${tdcols},th:nth-child(1),${thcols}`).each(
            function () {
                $(this).show();
            }
        );

        setTimeout(function () {
            const resource = Number($('#res').val());
            const level = Number($('#lvl').val());
            const workExp = Number($('#exp').val());
            const price = Number($('#price').val());

            $('tbody>tr').each(function () {
                const row = $(this);
                const result = calc(row, resource, level, workExp);

                appendResult(row, result, price);
            });

            addSortEvent();
        }, 1000);
    });
}

function calc(row, resource, level, workExp) {
    const oilKoef = [0.65, 1];
    const oreKoef = [0.65, 1];
    const uraniumKoef = [0.75, 1];
    const diamondKoef = [0.75, 0.001];

    let koef1;
    let koef2;
    let resMaxRegionCol;
    let factoryLevelCol;
    let taxCol;

    switch (resource) {
        case 1:
            koef1 = oilKoef[0];
            koef2 = oilKoef[1];
            resMaxRegionCol = '6';
            factoryLevelCol = '22';
            taxCol = '18';
            break;
        case 2:
            koef1 = oreKoef[0];
            koef2 = oreKoef[1];
            resMaxRegionCol = '7';
            factoryLevelCol = '24';
            taxCol = '17';
            break;
        case 3:
            koef1 = uraniumKoef[0];
            koef2 = uraniumKoef[1];
            resMaxRegionCol = '8';
            factoryLevelCol = '26';
            taxCol = '19';
            break;
        case 4:
            koef1 = diamondKoef[0];
            koef2 = diamondKoef[1];
            resMaxRegionCol = '9';
            factoryLevelCol = '28';
            taxCol = '20';
            break;

        default:
            break;
    }

    const resMaxRegion = Number(
        row.find(`td:nth-child(${resMaxRegionCol})`).text()
    );
    const factoryLevel = Number(
        row.find(`td:nth-child(${factoryLevelCol})`).text()
    );
    const tax = Number(row.find(`td:nth-child(${taxCol})`).text());

    const grossProd =
        0.2 *
        Math.pow(level, 0.8) *
        Math.pow((resMaxRegion * koef1) / 10, 0.8) *
        Math.pow(factoryLevel, 0.8) *
        Math.pow(workExp / 10, 0.6) *
        1.2 *
        koef2;

    let netProd = Math.round(grossProd - grossProd * (tax / 100));
    return netProd;
}

function appendResult(row, result, price) {
    row.append(`<td title="${formatNumber(result)}">${result}</td>`);
    row.append(`<td title="${formatNumber(result * 30)}">${result * 30}</td>`);
    row.append(
        `<td title="${formatNumber(result * 30 * price)}">${
            result * 30 * price
        }</td>`
    );
}

function addSortEvent() {
    $('th').each(function () {
        $(this).unbind();
    });

    $('table').tablesorter();
}

function formatNumber(number) {
    return number.toLocaleString().replaceAll(',', '.');
}

function saveSettings() {
    const settings = {
        lvl: Number($('#lvl').val()),
        exp: Number($('#exp').val()),
        price: Number($('#price').val()),
    };

    GM_setValue('settings', settings);
}

function loadSettings() {
    const settings = GM_getValue('settings');

    if (settings) {
        $('#lvl').val(settings.lvl);
        $('#exp').val(settings.exp);
        $('#price').val(settings.price);
    }
}
