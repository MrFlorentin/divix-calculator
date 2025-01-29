
document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');

    console.log('Fetching actual currencies...');

    fetch('assets/js/rates.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const currencies = data.exchange_rates;
            console.log('Currencies loaded:', currencies); // Log les devises chargées
            for (const code in currencies) {
                if (currencies.hasOwnProperty(code)) {
                    const currency = currencies[code];
                    const option = document.createElement('option');
                    option.value = code;
                    option.textContent = `${code} - ${currency.name}`;
                    currencySelect.appendChild(option);
                }
            }
        })
        .catch(error => console.error('Error while loading currencies:', error));
});