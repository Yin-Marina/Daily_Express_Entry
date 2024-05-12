async function fetchData() {
    const ExpressEntryLink = "https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json#/rounds"

    try {
        const response = await fetch(ExpressEntryLink + '/data.json');
        const data = await response.json();
        displayData(data);
    } catch (error) {
        document.getElementById('data-container').innerHTML = '<div class="alert alert-danger" role="alert">Error loading data.</div>';
        console.error('Error fetching data:', error);
    }
}

function displayData(data) {
    const container = document.getElementById('data-container');
    if (Array.isArray(data)) {
        container.innerHTML = createTable(data);
    } else {
        container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    }
}

function createTable(data) {
    let table = '<table class="table table-striped">';
    table += '<thead class="thead-dark"><tr>';
    Object.keys(data[0]).forEach(key => {
        table += `<th scope="col">${key}</th>`;
    });
    table += '</tr></thead>';
    table += '<tbody>';
    data.forEach(item => {
        table += '<tr>';
        Object.values(item).forEach(value => {
            table += `<td>${value}</td>`;
        });
        table += '</tr>';
    });
    table += '</tbody></table>';
    return table;
}

fetchData();
