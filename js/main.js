// wait for window to load
import itemEnum from "./item_enum.js";
import mobEnum from "./mob_enum.js";
import recipeEnum from "./recipe_enum.js";
let items = itemEnum();
let mobs = mobEnum();
let recipes = recipeEnum();
window.addEventListener("load", () => {
    // get the selectors
    const requirementSelector = document.getElementById("requirementSelector");
    const formatterSelector = document.getElementById("formatterSelector");
    const filterSelector = document.getElementById("filterSelector");
    const output = document.getElementById("output");
    const completionSlider = document.getElementById("completion");
    const ingameOutput = document.getElementById("ingameOutput");
    const subRequirementDiv = document.getElementById("subRequirementDiv");
    const subRequirementInput = document.getElementById("subRequirementInput");
    const copyButton = document.getElementById("copyButton");
    const subRequirementSelectItem = document.getElementById(
        "subRequirementSelect__item"
    );
    const subRequirementSelectMobKills = document.getElementById(
        "subRequirementSelect__mob-kills"
    );
    const subRequirementSelectRecipe = document.getElementById(
        "subRequirementSelect__recipe"
    );
    const selectors = document.querySelectorAll("[data-option]");

    // add event listeners
    requirementSelector.addEventListener("change", () => {
        updateOutput();
    });
    formatterSelector.addEventListener("change", () => {
        updateOutput();
    });
    filterSelector.addEventListener("change", () => {
        updateOutput();
    });
    completionSlider.addEventListener("input", () => {
        updateOutput();
    });
    subRequirementInput.addEventListener("input", () => {
        updateOutput();
    });
    subRequirementSelectItem.addEventListener("change", () => {
        updateOutput();
    });
    subRequirementSelectMobKills.addEventListener("change", () => {
        updateOutput();
    });
    subRequirementSelectRecipe.addEventListener("change", () => {
        updateOutput();
    });
    copyButton.addEventListener("click", () => {
        copyToClipboard();
    });

    var ingameTotal = 0;
    var ingameFilter = "";

    // update the output
    function updateOutput() {
        // get the values
        const requirement = requirementSelector.value || "money";
        const formatter = formatterSelector.value || "total";
        var filter = filterSelector.value || "simple";

        // get the data-hasSubReq attribute value
        const dataHasSubReq =
            requirementSelector.options[
                requirementSelector.selectedIndex
            ].getAttribute("data-hasSubReq");

        // get the data-subReq attribute value
        const dataSubReq =
            requirementSelector.options[
                requirementSelector.selectedIndex
            ].getAttribute("data-subReq");

        // get data-select attribute value
        const dataSelector =
            requirementSelector.options[
                requirementSelector.selectedIndex
            ].getAttribute("data-selector");

        var selected = [];

        if (dataHasSubReq == "true") {
            subRequirementDiv.style.display = "grid";
            if (dataSelector == "true") {
                subRequirementInput.style.display = "none";
                // loop through all select with data attribute data-option
                selectors.forEach((element) => {
                    var elementID = element.id.replace(
                        "subRequirementSelect__",
                        ""
                    );
                    if (elementID == dataSubReq) {
                        element.style.display = "block";
                        selected.push(
                            element.options[element.selectedIndex].value
                        );
                    } else {
                        element.style.display = "none";
                    }
                });

                var subRequirement = ", '" + selected + "'";
            } else {
                selectors.forEach((element) => {
                    element.style.display = "none";
                });
                subRequirementInput.style.display = "block";
                var subRequirement = ", '" + subRequirementInput.value + "'";
                var subRequirement = subRequirement.replace(/%/g, "");
            }
        } else {
            subRequirementDiv.style.display = "none";
            var subRequirement = "";
        }

        switch (formatter) {
            case "total":
                var ingameTotal = completionSlider.max;
                break;
            case "done":
                if (completionSlider.value == completionSlider.max) {
                    var ingameTotal = 1;
                } else {
                    var ingameTotal = 0;
                }
                break;
            case "progress":
                var ingameTotal = completionSlider.value;
                break;
            case "remaining":
                var ingameTotal = completionSlider.max - completionSlider.value;
                break;
            case "quotient":
                var ingameTotal = completionSlider.value / completionSlider.max;
                break;
            case "percent":
                var ingameTotal =
                    (completionSlider.value / completionSlider.max) * 100;
                break;
            default:
                var ingameTotal = completionSlider.value;
                break;
        }
        getRecommendedFilter();

        switch (filter) {
            case "none":
                var ingameTotal = Number(ingameTotal).toFixed(1);
                break;
            case "money":
                var ingameTotal = Number(ingameTotal)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                break;
            case "percent":
                var ingameTotal = Number(ingameTotal).toFixed(1);
                break;
            case "simple":
                var ingameTotal = Math.round(ingameTotal);
                break;
            case "shortmoney":
                const shortMoneyArray = [
                    "K",
                    "M",
                    "B",
                    "T",
                    "Q",
                    "Qu",
                    "S",
                    "Se",
                    "O",
                    "N",
                    "D",
                ];
                for (var i = 1; i < 15; i++) {
                    if (ingameTotal >= Math.pow(10, 3 * i)) {
                        var ingameTotal =
                            (ingameTotal / Math.pow(10, 3 * i)).toFixed(0) +
                            shortMoneyArray[i - 1];
                    }
                }
                break;

            default:
                var ingameTotal = Math.round(ingameTotal);
                break;
        }

        // check if filter is none
        if (filter == "none") {
            filter = "";
        } else {
            filter = "| " + filter;
        }

        // update the output
        output.innerHTML = `{{ rank.req('${requirement}'${subRequirement}).${formatter} ${filter} }}`;
        ingameOutput.innerHTML = ingameTotal;
    }

    importEnum(items, "item");
    importEnum(mobs, "mob-kills");
    importEnum(recipes, "recipe");
});

function copyToClipboard() {
    var copyText = document.getElementById("output");
    var button = document.getElementById("copyButton");
    navigator.clipboard.writeText(copyText.innerHTML);
    button.innerHTML = "Copied!";
    setTimeout(() => {
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          </svg>`;
    }, 500);
}

function importEnum(array, selectorID) {
    var selector = document.getElementById(
        "subRequirementSelect__" + selectorID
    );
    array.forEach((element) => {
        var lower = element.toLowerCase();
        var normalString = lower.replace(/_/g, " ");
        var capitalized = normalString.replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
        });
        var option = document.createElement("option");
        option.text = capitalized;
        option.value = lower;
        selector.add(option);
    });
    console.log(selectorID + " loaded");
}

function getRecommendedFilter() {
    // get the data-recommendedFormat attribute value
    const dataRecommendedFormat =
        formatterSelector.options[formatterSelector.selectedIndex].getAttribute(
            "data-recommendedFormat"
        ) || "simple";

    // update text of filterSelector
    Object.keys(filterSelector.options).forEach((element) => {
        var option = filterSelector.options[element];
        if (option.value == dataRecommendedFormat) {
            option.text = option.value + " (recommended)";
        } else {
            option.text = option.value;
        }
    });
}