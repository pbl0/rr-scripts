// ==UserScript==
// @name        residency-script
// @namespace   https://pablob.eu/
// @match       *://rivalregions.com/
// @author      pablo
// @description Export residencies or work permits in a region or state.
// @version     0.1
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/residency/residency.user.js
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
    let loadUrls = ['#listed/residency', '#listed/permits_']
    let willLoad = false;
    loadUrls.forEach((url)=>{
        if (location.href.includes(url)){
            willLoad = true;
        }
    })
    if (willLoad){
        addButton();
    }
}

function addButton(){
    $('#header_slide')
    .prepend(
        `<span><div class="button_green region_details_move" id="scrape-button">Download CSV</div></span>`
    );

    $('#scrape-button').click(function (){
        download();
    })
}

function removeButton(){
    $('#scrape-button').remove();
}

function download() {
    let baseUrl = 'https://rivalregions.com/#';
    let residencias = [];
    document.querySelectorAll('tr>td.list_name.pointer.small').forEach((item) => {
        let profileName = item.previousSibling.previousSibling.innerText
        let profileUrl = baseUrl + item.getAttribute('action');
        let profile = {
            name: profileName,
            url: profileUrl
        }
        residencias.push(profile)
    })
    let b = downloadFile(residencias)
    let url = window.URL.createObjectURL(b);
    let a = document.createElement("a");

    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = location.hash.replace('#', '');
    a.click();
    window.URL.revokeObjectURL(url);
}



function downloadFile(array) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(array[0]);
    let csv = array.map((row) => header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    return blob = new Blob([csvArray], { type: 'text/csv' });
}
