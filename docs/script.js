document.addEventListener('DOMContentLoaded', function() {
    async function fetchData() {
        try {
            // Replace with your actual JSON URL
            const response = await fetch('https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json#/rounds');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayData(data);
            displayRecentRounds(data.rounds);
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

    function createTable(round) {
        let table = '<table class="table table-striped">';
        table += '<thead class="thead-dark"><tr>';
        table += '<th scope="col">Attribute</th><th scope="col">Value</th>';
        table += '</tr></thead>';
        table += '<tbody>';
        
        Object.entries(round).forEach(([key, value]) => {
            table += '<tr>';
            table += `<td>${key}</td>`;
            if ((key === 'drawNumberURL' || key === 'mitext' || key === 'DrawText1') && typeof value === 'string') {
                // Modify the href attribute by prepending "https://www.canada.ca" if it starts with "/"
                value = value.replace(/href='\/(.*?)'/g, 'href=\'https://www.canada.ca/$1\'');
            }
            table += `<td>${value}</td>`;
            table += '</tr>';
        });
        
        table += '</tbody></table>';
        return table;
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
});


// JSON data

  
  // Extract relevant data
  const drawDates = data.rounds.map(round => round.drawDate);
  const drawSizes = data.rounds.map(round => parseInt(round.drawSize));
  const drawCRS = data.rounds.map(round => parseInt(round.drawCRS));
  
  // Create the chart
  const ctx = document.getElementById('drawChart').getContext('2d');
  const drawChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: drawDates,
          datasets: [
              {
                  label: 'Draw Size',
                  data: drawSizes,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              },
              {
                  label: 'CRS Score',
                  data: drawCRS,
                  backgroundColor: 'rgba(153, 102, 255, 0.2)',
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 1
              }
          ]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  
