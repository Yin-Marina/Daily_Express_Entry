document.addEventListener('DOMContentLoaded', function () {
    async function fetchData() {
        try {
            const response = await fetch('https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();


            const dataContainer = document.getElementById('data-container');
            if (dataContainer) {
                displayData(data);
                displayCECChart(data);
            } else {
                console.log('Element with id "data-container" not found');
            }

            const recentRoundsContainer = document.getElementById('recent-rounds');
            if (recentRoundsContainer) {
                displayRecentRounds(data.rounds);
            } else {
                console.log('Element with id "recent-rounds" not found');
            }

            displayChart(data);  // Call to display the chart using fetched data

        } catch (error) {
            console.log('Error fetching data:', error);
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
        // Extract the necessary data from JSON for the chart
        const drawDates = data.rounds.map(round => round.drawDate);
        const drawSizes = data.rounds.map(round => parseInt(round.drawSize));
        const drawCRS = data.rounds.map(round => parseInt(round.drawCRS));

        // Create the bar chart using Plotly
        const trace1 = {
            x: drawDates,  // X-axis data (draw dates)
            y: drawSizes,  // Y-axis data for Draw Sizes
            name: 'Draw Size',
            type: 'bar',
            marker: {
                color: 'rgba(75, 192, 192, 0.7)',
                line: {
                    color: 'rgba(75, 192, 192, 1)',
                    width: 1.5
                }
            }
        };

        const trace2 = {
            x: drawDates,  // X-axis data (draw dates)
            y: drawCRS,    // Y-axis data for CRS Scores
            name: 'CRS Score',
            type: 'scatter',  // 
            mode: 'lines+markers',  // Line with markers
            line: {
                color: 'rgba(153, 102, 255, 1)',
                width: 2
            },
            marker: {
                color: 'rgba(153, 102, 255, 1)',
                size: 8
            }
        };

        // Layout for the chart with autosizing
        const layout = {
            title: 'Express Entry Draws Comparison (Line Chart)',
            autosize: true,  // Allow the chart to automatically size itself
            height: 800,     // Set the minimum height to 800px
            xaxis: {
                title: 'Draw Date',
                tickangle: -45
            },
            yaxis: {
                title: 'Values',
                showgrid: true,
                zeroline: true
            }
        };

        // Data array containing both traces
        const chartData = [trace1, trace2];

        // Render the chart in the 'drawChart' div
        Plotly.newPlot('drawChart', chartData, layout);
    }
    function displayCECChart(data) {
        // Display filtered rounds where drawText2 contains "Canadian Experience Class"
        const CECfilteredRounds = data.rounds.filter(round => round.drawText2.includes("Canadian Experience Class"));
        console.log('CEC Filtered Rounds:', CECfilteredRounds);

        // Extract the necessary data from the array for the chart
        const drawDates = CECfilteredRounds.map(round => round.drawDate);
        const drawSizes = CECfilteredRounds.map(round => parseInt(round.drawSize));
        const drawCRS = CECfilteredRounds.map(round => parseInt(round.drawCRS));

        // Create the bar chart using Plotly
        const trace1 = {
            x: drawDates,  // X-axis data (draw dates)
            y: drawSizes,  // Y-axis data for Draw Sizes
            name: 'Draw Size',
            type: 'bar',
            marker: {
                color: 'rgba(75, 192, 192, 0.7)',
                line: {
                    color: 'rgba(75, 192, 192, 1)',
                    width: 1.5
                }
            }
        };

        const trace2 = {
            x: drawDates,  // X-axis data (draw dates)
            y: drawCRS,    // Y-axis data for CRS Scores
            name: 'CRS Score',
            type: 'scatter',  // 
            mode: 'lines+markers',  // Line with markers
            line: {
                color: 'rgba(153, 102, 255, 1)',
                width: 2
            },
            marker: {
                color: 'rgba(153, 102, 255, 1)',
                size: 8
            }
        };

        // Layout for the chart with autosizing
        const layout = {
            title: 'Express Entry Draws Comparison (Line Chart)',
            autosize: true,  // Allow the chart to automatically size itself
            height: 800,     // Set the minimum height to 800px
            xaxis: {
                title: 'Draw Date',
                tickangle: -45
            },
            yaxis: {
                title: 'Values',
                showgrid: true,
                zeroline: true
            }
        };

        // Data array containing both traces
        const chartData = [trace1, trace2];

        // Render the chart in the 'drawChart' div
        Plotly.newPlot('drawCECChart', chartData, layout);
    }



    // Fetch data when DOM is fully loaded
    fetchData();
});
