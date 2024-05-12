
async function fetchData() {
    try {
        const ExpressEntryLink = 'https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json#/rounds';
        const response = await fetch(ExpressEntryLink + '/data.json');
        const data = await response.json();
        displayData(data);
        //displayRecentRounds(data.rounds);
    } catch (error) {
        document.getElementById('data-container').innerHTML = '<div class="alert alert-danger" role="alert">Error loading data.</div>';
        document.getElementById('recent-rounds').innerHTML = '<div class="alert alert-danger" role="alert">Error loading rounds data.</div>';
        console.error('Error fetching data:', error);
    }
}

function displayData(data) {
    const container = document.getElementById('data-container');
    if (data.rounds && Array.isArray(data.rounds) && data.rounds.length > 0) {
        container.innerHTML = createTable(data.rounds[0]);
    } else {
        container.innerHTML = '<div class="alert alert-warning" role="alert">No rounds data available.</div>';
    }
}

function displayRecentRounds(rounds) {
    const container = document.getElementById('recent-rounds');
    if (rounds && Array.isArray(rounds) && rounds.length > 0) {
        container.innerHTML = createRecentRoundsTable(rounds.slice(0, 10)); // Display only the latest 10 rounds
    } else {
        container.innerHTML = '<div class="alert alert-warning" role="alert">No recent rounds available.</div>';
    }
}

function createRecentRoundsTable(rounds) {
    let table = '<table class="table table-bordered">';
    table += '<thead class="thead-light"><tr><th>Date</th><th>Name</th><th>Size</th><th>CRS</th></tr></thead>';
    table += '<tbody>';
    rounds.forEach(round => {
        table += `<tr><td>${round.drawDate}</td><td>${round.drawName}</td><td>${round.drawSize}</td><td>${round.drawCRS}</td></tr>`;
    });
    table += '</tbody></table>';
    return table;
}

fetchData();
