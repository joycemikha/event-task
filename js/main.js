document.addEventListener("DOMContentLoaded", function () {
    const data = {
        "customers": [
            { "id": 1, "name": "Ahmed Ali" },
            { "id": 2, "name": "Aya Elsayed" },
            { "id": 3, "name": "Mina Adel" },
            { "id": 4, "name": "Sarah Reda" },
            { "id": 5, "name": "Mohamed Sayed" }
        ],
        "transactions": [
            { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
            { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
            { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
            { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
            { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
            { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
            { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
            { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
            { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
        ]
    };

    const tableBody = document.querySelector("#customerTable tbody");
    let chart;

    function displayData(filteredData) {
        tableBody.innerHTML = "";
        filteredData.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.customer.name}</td>
                <td>${item.date}</td>
                <td>${item.amount}</td>
            `;
            row.addEventListener('click', () => displayGraph(filteredData));
            tableBody.appendChild(row);
        });
    }

    function filterTable() {
        const nameFilter = document.getElementById("filterName").value.toLowerCase();
        const amountFilter = parseInt(document.getElementById("filterAmount").value);

        const filteredData = data.transactions
            .map(transaction => {
                const customer = data.customers.find(c => c.id === transaction.customer_id);
                return { ...transaction, customer };
            })
            .filter(item => {
                const nameMatch = item.customer.name.toLowerCase().includes(nameFilter);
                const amountMatch = isNaN(amountFilter) || item.amount == amountFilter;
                return nameFilter ? nameMatch : amountMatch;
            });

        displayData(filteredData);
        displayGraph(filteredData);
    }

    function displayGraph(filteredData) {
        const dates = [...new Set(filteredData.map(item => item.date))];
        console.log()
        const amounts = dates.map(date => {
            return filteredData
                .filter(item => item.date === date)
                .reduce((sum, item) => sum + item.amount, 0);
        });

        const ctx = document.getElementById('transactionChart').getContext('2d');
        if (chart) {
            chart.destroy();
        }
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `Total Transactions`,
                    data: amounts,
                    borderColor: 'rgba(3, 75, 48, 1)',
                    backgroundColor: 'rgba(163, 213, 195, .5)',
                    fill: true,
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount'
                        }
                    }
                }
            }
        });
    }

    filterTable();

    document.getElementById("filterButton").addEventListener("click", filterTable);
});
