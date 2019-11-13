const Simpler = {
    initialize: () => {
        initializeUI();
    }
};

function SendData(data) {
    // TODO: ... and this one is pretty ugly, too
    data.forEach(entry => {
        var entryDiv = getEntry(entry);
        entryDiv.addEventListener("click", () => entryClicked(entryDiv, entry));
        addToDataContainer(entryDiv);
    });
    renderSummary(summary);
}
