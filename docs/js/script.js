document.addEventListener('DOMContentLoaded', function () {
    async function loadLocalData() {
        try {
            console.log("Fetching JSON data...");
            const response = await fetch('https://yin-marina.github.io/Daily_Express_Entry/json/ee_rounds_123_en.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("JSON Data Loaded:", data);
    
            // Check if elements exist before calling display functions
            if (document.getElementById('data-container')) {
                displayData(data);
            } else {
                console.warn('Skipping: Element with id "data-container" not found.');
            }
    
            if (document.getElementById('recent-rounds')) {
                displayRecentRounds(data.rounds);
            } else {
                console.warn('Skipping: Element with id "recent-rounds" not found.');
            }
    
            if (document.getElementById('drawChart')) {
                displayChart(data);
            } else {
                console.warn('Skipping: Element with id "drawChart" not found.');
            }
    
            displayPoolDistribution(data); // This will still run
    
        } catch (error) {
            console.error('Error loading local JSON file:', error);
            document.getElementById('pool-distribution-container').innerHTML =
                '<div class="alert alert-danger">⚠️ Error loading data. Check if the JSON file exists.</div>';
        }
    }
  
    function displayPoolDistribution(data) {
        console.log("Updating Pool Distribution Table...");
    
        const poolTableContainer = document.getElementById('pool-distribution-container');
    
        if (!poolTableContainer) {
            console.error("Error: 'pool-distribution-container' not found.");
            return;
        }
    
        if (!data.rounds || data.rounds.length === 0) {
            poolTableContainer.innerHTML = '<div class="alert alert-warning">⚠️ No pool distribution data available.</div>';
            return;
        }
    
        const latestRound = data.rounds[0];
        console.log("Latest Round Data:", latestRound);  // Debugging log
    
        const drawDistributionAsOn = latestRound.drawDistributionAsOn || "N/A";
        const dd2 = latestRound.dd2 || "N/A";
    
        let tableHTML = `<h3>Pool Distribution as of ${drawDistributionAsOn}</h3>`;
        tableHTML += `<table class="table table-bordered">
                        <thead class="thead-dark">
                            <tr><th>Date</th><th>CRS 601-1200</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>${drawDistributionAsOn}</td><td>${dd2}</td></tr>
                        </tbody>
                      </table>`;
    
        poolTableContainer.innerHTML = tableHTML;
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
            container.innerHTML = createRecentRoundsTable(rounds.slice(0, 10)); // Display latest 10 rounds
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

    function displayChart(data) {
        const drawDates = data.rounds.map(round => round.drawDate);
        const drawSizes = data.rounds.map(round => parseInt(round.drawSize));
        const drawCRS = data.rounds.map(round => parseInt(round.drawCRS));

        const trace1 = {
            x: drawDates,
            y: drawSizes,
            name: 'Draw Size',
            type: 'bar',
            marker: {
                color: 'rgba(75, 192, 192, 0.7)',
                line: { color: 'rgba(75, 192, 192, 1)', width: 1.5 }
            }
        };

        const trace2 = {
            x: drawDates,
            y: drawCRS,
            name: 'CRS Score',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: 'rgba(153, 102, 255, 1)', width: 2 },
            marker: { color: 'rgba(153, 102, 255, 1)', size: 8 }
        };

        const layout = {
            title: 'Express Entry Draws Comparison (Line Chart)',
            autosize: true,
            height: 800,
            xaxis: { title: 'Draw Date', tickangle: -45 },
            yaxis: { title: 'Values', showgrid: true, zeroline: true }
        };

        Plotly.newPlot('drawChart', [trace1, trace2], layout);
    }

    function displayCECChart(data) {
        const CECfilteredRounds = data.rounds.filter(round => round.drawText2.includes("Canadian Experience Class"));
        console.log('CEC Filtered Rounds:', CECfilteredRounds);

        const drawDates_CEC = CECfilteredRounds.map(round => round.drawDate);
        const drawSizes_CEC = CECfilteredRounds.map(round => parseInt(round.drawSize));
        const drawCRS_CEC = CECfilteredRounds.map(round => parseInt(round.drawCRS));

        const CEC_trace1 = {
            x: drawDates_CEC,
            y: drawSizes_CEC,
            name: 'Draw Size',
            type: 'bar',
            marker: {
                color: 'rgba(75, 192, 192, 0.7)',
                line: { color: 'rgba(75, 192, 192, 2)', width: 1.5 }
            }
        };

        const CEC_trace2 = {
            x: drawDates_CEC,
            y: drawCRS_CEC,
            name: 'CRS Score',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: 'rgba(153, 102, 255, 1)', width: 2 },
            marker: { color: 'rgba(153, 102, 255, 1)', size: 8 }
        };

        const CEC_layout = {
            title: 'Canadian Experience Class Express Entry Draws Comparison (Line Chart)',
            autosize: true,
            height: 800,
            xaxis: { title: 'Draw Date', tickangle: -45 },
            yaxis: { title: 'Values', showgrid: true, zeroline: true }
        };

        Plotly.newPlot('drawCECChart', [CEC_trace1, CEC_trace2], CEC_layout);
    }

    // Load local data when the DOM is fully loaded
    loadLocalData();
});
