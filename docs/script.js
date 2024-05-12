async function fetchData() {
    try {
        const response = await fetch('https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json#/rounds/data.json');
        const data = await response.json();
        displayData(data);
    } catch (error) {
        document.getElementById('data-container').innerHTML = 'Error loading data.';
        console.error('Error fetching data:', error);
    }
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
}

fetchData();
