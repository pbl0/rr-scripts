// ==UserScript==
// @name        BlurOverlayRR
// @namespace   https://pablob.eu/
// @match       *://rivalregions.com/
// @author      Pablo
// @description Small userscript that adds blur effect to RivalRegions game overlay in PC version
// @version      0.0.2
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/blur-overlay/blur-overlay-rr.user.js
// ==/UserScript==

const BLUR = "10";

(function() {
    'use strict';
    $(document).ready(()=> {
    // select the target node
    var target = document.querySelector('#header_slide');

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var filterVal;
            if ($("#header_slide").height() <= 0){
                filterVal = 'blur(0px)';
            } else{
                filterVal = 'blur('+ BLUR + 'px)';
            }

            $("#content")
                .css('filter',filterVal)
                .css('webkitFilter',filterVal)
                .css('mozFilter',filterVal)
                .css('oFilter',filterVal)
                .css('msFilter',filterVal);
            $("#header_menu")
                .css('filter',filterVal)
                .css('webkitFilter',filterVal)
                .css('mozFilter',filterVal)
                .css('oFilter',filterVal)
                .css('msFilter',filterVal);
        });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    })

    


})();
