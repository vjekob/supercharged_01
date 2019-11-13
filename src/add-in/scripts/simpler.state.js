var selected = [];
var summary = {};

function calculateSummary(entry, action) {
    const currency = entry.currency || "LCY";
    summary = {...summary, [currency]: summary[currency] || 0 };

    switch (action) {
        case SUMMARY_ACTION.REMOVE:
            summary[currency] -= entry.amount;
            break;
        case SUMMARY_ACTION.ADD:
            summary[currency] += entry.amount;
            break;
    }
}

function updateSummary(entry, action) {
    calculateSummary(entry, action);
    renderSummary(summary);
}

// TODO: This one is still pretty ugly
function entryClicked(entryDiv, entry) {
    if (selected.includes(entry)) {
        entryDiv.classList.remove("selected");
        selected = selected.filter(e => e !== entry);
        updateSummary(entry, SUMMARY_ACTION.REMOVE)
    } else {
        entryDiv.classList.add("selected");
        selected.push(entry);
        updateSummary(entry, SUMMARY_ACTION.ADD);
    }
}
