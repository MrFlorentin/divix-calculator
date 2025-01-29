document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');
    const convertedCurrencySelect = document.getElementById('converted-currency-select');
    const amountInput = document.getElementById('amount');
    const convertButton = document.getElementById('convert-button');
    const resultDisplay = document.getElementById('result');
    let exchangeRates = {};

    fetch('assets/js/rates.json') // Fetching the JSON file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => { // Parsing the JSON data
            exchangeRates = data.exchange_rates;
            console.log('Currencies loaded:', exchangeRates);
            for (const code in exchangeRates) { // Loop through the exchange rates
                if (exchangeRates.hasOwnProperty(code)) { // Check if the property is not inherited
                    const currency = exchangeRates[code];
                    const option = document.createElement('option');
                    option.value = code;
                    option.textContent = `${code} - ${currency.name}`;
                    currencySelect.appendChild(option.cloneNode(true));
                    convertedCurrencySelect.appendChild(option);
                }
            }
        })
        .catch(error => console.error('Error while loading currencies:', error));

    convertButton.addEventListener('click', function() { // Event listener for the convert button
        const amount = parseFloat(amountInput.value); // Parse the amount to a float
        const fromCurrency = currencySelect.value;
        const toCurrency = convertedCurrencySelect.value;

        if (isNaN(amount)) {
            resultDisplay.textContent = 'Please enter a valid amount';
            return;
        }

        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
            resultDisplay.textContent = 'Please select valid currencies';
            return;
        }

        // Conversion formula
        const fromRate = exchangeRates[fromCurrency].rate;
        const toRate = exchangeRates[toCurrency].rate;
        const convertedAmount = (amount / fromRate) * toRate;

        resultDisplay.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    });
});