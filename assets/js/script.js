document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');
    const convertedCurrencySelect = document.getElementById('converted-currency-select');
    const amountInput = document.getElementById('amount');
    const convertButton = document.getElementById('convert-button');
    const resultDisplay = document.getElementById('result');
    let exchangeRates = {};

    // Fetch exchange rates and populate the currency selects
    fetch('assets/js/rates.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Netwofrk response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            exchangeRates = data.exchange_rates;
            console.log('Currencies loaded:', exchangeRates);
            fillCurrencySelects(exchangeRates, currencySelect, convertedCurrencySelect);
        })
        .catch(error => console.error('Error while loading currencies:', error));

    // Event listener for the convert button
    convertButton.addEventListener('click', function() {
        convertCurrency(amountInput, currencySelect, convertedCurrencySelect, resultDisplay, exchangeRates);
    });
});

/**
 * Fill the currency select elements with options based on the provided exchange rates.
 * 
 * @param {Object} currencies - An object containing currency codes and their corresponding exchange rates and names.
 * @param {HTMLSelectElement} currencySelect - The main currency select element.
 * @param {HTMLSelectElement} convertedCurrencySelect - The converted currency select element.
 */
function fillCurrencySelects(currencies, currencySelect, convertedCurrencySelect) {
    for (const code in currencies) {
        if (currencies.hasOwnProperty(code)) {
            const currency = currencies[code];
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} - ${currency.name}`;
            currencySelect.appendChild(option.cloneNode(true));
            convertedCurrencySelect.appendChild(option);
        }
    }
}

/**
 * Converts the entered amount from one currency to another based on the selected exchange rates.
 * 
 * @param {HTMLInputElement} amountInput - The input element for the amount to be converted.
 * @param {HTMLSelectElement} currencySelect - The main currency select element.
 * @param {HTMLSelectElement} convertedCurrencySelect - The converted currency select element.
 * @param {HTMLElement} resultDisplay - The element where the result will be displayed.
 * @param {Object} exchangeRates - An object containing the exchange rates.
 */
function convertCurrency(amountInput, currencySelect, convertedCurrencySelect, resultDisplay, exchangeRates) {
    const amount = parseFloat(amountInput.value);
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

    if (fromCurrency === toCurrency) {
        resultDisplay.textContent = 'Please select different currencies';
        return;
    }

    const fromRate = exchangeRates[fromCurrency].rate;
    const toRate = exchangeRates[toCurrency].rate;

    const fromCountry = exchangeRates[fromCurrency].country;
    const fromFlag = exchangeRates[fromCurrency].flag;

    const toCountry = exchangeRates[toCurrency].country;
    const toFlag = exchangeRates[toCurrency].flag;

    const convertedAmount = (amount / fromRate) * toRate;

    const formattedAmount = amount.toLocaleString();
    const formattedConvertedAmount = convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDisplay.innerHTML = `If you travel from <strong>${fromCountry}</strong> ${fromFlag} to <strong>${toCountry}</strong> ${toFlag},<br><strong>${formattedAmount} ${fromCurrency}</strong> will be converted to <strong>${formattedConvertedAmount} ${toCurrency}</strong>.`;
}