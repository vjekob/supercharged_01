const dataContainer = document.createElement("div");
dataContainer.className = "data";

const summaryContainer = document.createElement("div");
summaryContainer.className = "summary";

function initializeUI() {
    var controlAddIn = document.getElementById("controlAddIn");

    controlAddIn.appendChild(dataContainer);
    controlAddIn.appendChild(summaryContainer);
}

function emptyChildrenFrom(node) {
    while (node.firstChild)
        node.removeChild(node.firstChild);
}

function renderSummary(summary) {
    emptyChildrenFrom(summaryContainer);

    var summaryLabel = document.createElement("div");
    summaryLabel.className = "label";
    summaryLabel.innerText = "Payment summary";
    summaryContainer.appendChild(summaryLabel);

    if (!selected.length) {
        var summaryInfo = document.createElement("div");
        summaryInfo.className = "info";
        summaryInfo.innerText = "(no invoices selected)";
        summaryContainer.appendChild(summaryInfo);
        return;
    }

    var table = document.createElement("table");
    table.width = "80%";
    var thead = document.createElement("thead");
    table.appendChild(thead);

    var tr = document.createElement("tr");
    thead.appendChild(tr);

    var tdCurrency = document.createElement("td");
    tdCurrency.width = "30%";
    tdCurrency.innerText = "Currency";
    var tdAmount = document.createElement("td");
    tdAmount.width = "70%";
    tdAmount.innerText = "Amount";

    tr.appendChild(tdCurrency);
    tr.appendChild(tdAmount);

    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    Object.keys(summary).forEach(currency => {
        if (!summary[currency])
            return;

        var tr = document.createElement("tr");
        tbody.appendChild(tr);

        var tdCurrency = document.createElement("td");
        tdCurrency.innerText = currency;
        var tdAmount = document.createElement("td");
        tdAmount.className = "amount";
        tdAmount.innerText = numeral(summary[currency]).format("0,0.00");

        tr.appendChild(tdCurrency);
        tr.appendChild(tdAmount);
    });
    summaryContainer.appendChild(table);
}

function getEntry(entry) {
    let entryDiv = document.createElement("div");
    entryDiv.id = entry.entryNo;
    entryDiv.className = "entry";

    let dateCaption = document.createElement("div");
    dateCaption.className = "date";
    dateCaption.innerText = entry.documentDate;

    let customerCaption = document.createElement("div");
    customerCaption.className = "customer";

    let customerCaptionNo = document.createElement("div");
    customerCaptionNo.className = "no";
    customerCaptionNo.innerText = entry.customerNo;

    let customerCaptionName = document.createElement("div");
    customerCaptionName.className = "name";
    customerCaptionName.innerText = entry.customerName;

    customerCaption.appendChild(customerCaptionNo);
    customerCaption.appendChild(customerCaptionName);

    let amountDiv = document.createElement("div");
    amountDiv.className = "amount";

    if (entry.currency) {
        let amountCurrency = document.createElement("span");
        amountCurrency.className = "currency";
        amountCurrency.innerText = entry.currency;
        amountDiv.appendChild(amountCurrency);
    }

    let amountNumber = document.createElement("span");
    amountNumber.className = "number";
    amountNumber.innerText = numeral(entry.amount).format("0,0.00");
    amountDiv.appendChild(amountNumber);

    entryDiv.appendChild(dateCaption);
    entryDiv.appendChild(customerCaption);
    entryDiv.appendChild(amountDiv);

    return entryDiv;
}

function emptyDataContainer() {
    emptyChildrenFrom(dataContainer);
}

function addToDataContainer(entryDiv) {
    dataContainer.append(entryDiv);
}