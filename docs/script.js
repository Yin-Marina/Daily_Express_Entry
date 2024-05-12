async function fetchData() {
    try {
        // Fetch data from the specified JSON URL
        const ExpressEntryLink = 'https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json#/rounds';
        const response = await fetch(ExpressEntryLink + '/data.json');
        // Parse the response as JSON
        const data = await response.json();
        // Display the fetched data
        displayData(data);
    } catch (error) {
        // Handle any errors that occur during the fetch
        document.getElementById('data-container').innerHTML = '<div class="alert alert-danger" role="alert">Error loading data.</div>';
        console.error('Error fetching data:', error);
    }
}

// Function to display data on the webpage
function displayData(data) {
    const container = document.getElementById('data-container');
    // Check if the data has 'rounds' and it's an array with at least one item
    if (data.rounds && Array.isArray(data.rounds) && data.rounds.length > 0) {
        // Create a table for the first round
        container.innerHTML = createTable(data.rounds[0]);
    } else {
        // Otherwise, display a message indicating no data
        container.innerHTML = '<div class="alert alert-warning" role="alert">No rounds data available.</div>';
    }
}

// Function to create a Bootstrap-styled table from a round object
function createTable(round) {
    // Start building the table with Bootstrap classes
    let table = '<table class="table table-striped">';
    // Add table headers
    table += '<thead class="thead-dark"><tr>';
    table += '<th scope="col">Attribute</th><th scope="col">Value</th>';
    table += '</tr></thead>';
    // Start the table body
    table += '<tbody>';
    
    // Iterate over the round object properties
    Object.entries(round).forEach(([key, value]) => {
        table += '<tr>';
        table += `<td>${key}</td>`;
        table += `<td>${value}</td>`;
        table += '</tr>';
    });
    
    table += '</tbody></table>';
    // Return the completed table HTML
    return table;
}

// Call the fetchData function to load and display the data
fetchData();
