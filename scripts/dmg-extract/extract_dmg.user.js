// ==UserScript==
// @name         DMG Extract
// @namespace    https://pablob.eu/
// @version      0.2
// @description  Extract dmg from fronts in rival regions
// @author       Pablo
// @match        *://rivalregions.com/*
// @match        http://localhost:4200/dmg-tool
// @match        *://rr-tools.eu/*
// @grant GM_setValue
// @grant GM_getValue
// @require https://code.jquery.com/jquery-3.6.0.slim.min.js
// @downloadURL https://github.com/pbl0/rr-scripts/raw/main/scripts/dmg-extract/extract_dmg.user.js
// ==/UserScript==

(function () {
  "use strict";
  $(document).ready(function () {
    window.addEventListener("popstate", listener);

    const pushUrl = (href) => {
      history.pushState({}, "", href);
      window.dispatchEvent(new Event("popstate"));
    };

    listener();
  });

  function listener() {
    const currentHash = location.hash;
    if (
      currentHash.includes("partydamage") ||
      currentHash.includes("#war/damage")
    ) {
      if ($("#startButton").length == 0) {
        $("#header_slide").append('<button id="startButton">Extract</button>');
        $("#startButton").click(function () {
          start();
        });
      }
    } else if (location.href.includes("rivalregions.com")) {
      if ($("#startButton").length > 0) {
        $("#startButton").remove();
      }

      if ($("#start-msg").length > 0) {
        $("#start-msg").remove();
      }
    } else if (location.href.includes("/dmg-tool")) {
      calcPage();
    }
  }

  function calcPage() {
    let newFrontAdded = false;
    const modelo = JSON.parse(localStorage.getItem("dmgToolModelo")) || {
      partyFronts: [],
      soldierFronts: [],
    };

    const gmModelo = GM_getValue("fronts") || {
      partyFronts: [],
      soldierFronts: [],
    };

    for (let front of gmModelo.partyFronts) {
      if (modelo["partyFronts"] != undefined && modelo["partyFronts"] != []) {
        const found = modelo["partyFronts"].filter(
          (el) => el.name == front.name
        );

        if (found.length == 0) {
          modelo["partyFronts"].push(front);
          newFrontAdded = true;
        }
      }
    }

    for (let front of gmModelo.soldierFronts) {
      if (
        modelo["soldierFronts"] != undefined &&
        modelo["soldierFronts"] != []
      ) {
        const found = modelo["soldierFronts"].filter(
          (el) => el.name == front.name
        );

        if (found.length == 0) {
          modelo["soldierFronts"].push(front);
          newFrontAdded = true;
        }
      }
    }

    if (newFrontAdded) {
      localStorage.setItem("dmgToolModelo", JSON.stringify(modelo));

      GM_setValue("fronts", {
        partyFronts: [],
        soldierFronts: [],
      });

      window.location.reload();
    }
  }

  function isParty() {
    return $("#table_list>thead").text().trim().includes("Party");
  }

  function start() {
    $("#startButton").remove();
    $("#header_slide").append(
      '<span class="yellow" id="start-msg">Please wait...</span>'
    );
    let count = 0;
    var timer = setInterval(function () {
      try {
        if (location.hash.includes("/partydamage/")) {
          throw "party";
        } else if ($("#list_last").attr("style") === undefined) {
          throw "end";
        }
        $("#list_last").trigger("click");
        console.log("click");
      } catch (e) {
        clearInterval(timer);

        const newFrontData = extractTable();

        console.log(newFrontData);

        const newFront = {
          name: location.hash,
          data: newFrontData[0],
        };

        const fronts = GM_getValue("fronts") || {
          partyFronts: [],
          soldierFronts: [],
        };

        const frontList = newFrontData[1] ? "partyFronts" : "soldierFronts";

        fronts[frontList].push(newFront);

        GM_setValue("fronts", fronts);

        setTimeout(() => {
          // Ends here
          $("#start-msg").text("Damage extraction finished!");
        }, 1000);
      }
    }, 3000);
  }

  function extractTable() {
    let frontList = [];
    const isAParty = isParty();
    $("#table_list>tbody>tr").each(function () {
      let row = {};
      const frontArr = $(this).text().trim().replaceAll("\t", "").split("\n");
      $(this).attr("action");

      row.name = frontArr[0]
        .replace("Defending side", "")
        .replace("Attacking side", "");

      if (isAParty) {
        row.dmg = stringToNumber(frontArr[1]);
        if (frontArr[0].includes("Defending side")) {
          row.side = "Defending";
        } else if (frontArr[0].includes("Attacking side")) {
          row.side = "Attacking";
        }
      } else {
        row.dmg = stringToNumber(frontArr[2]);
      }

      frontList.push(row);
    });

    return [frontList, isAParty];
  }

  function stringToNumber(numString) {
    return Number(numString.replaceAll(".", ""));
  }
})();
