
// Indian Rupee Formatting Functions for Flight Booking App

// 1. Basic rupee symbol display using Unicode
const RUPEE_SYMBOL = '₹';

// 2. Format number to Indian rupee format with proper comma placement
function formatToIndianRupee(amount) {
    // Convert to number if string
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Use Intl.NumberFormat for proper Indian locale formatting
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// 3. Alternative manual formatting for Indian number system
function manualIndianFormat(amount) {
    const str = amount.toString();
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);

    if (otherNumbers !== '') {
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
}

// 4. Flight booking specific formatting
function formatFlightPrice(price, includeSymbol = true) {
    const formattedAmount = formatToIndianRupee(price);
    return includeSymbol ? formattedAmount : formattedAmount.replace('₹', '');
}

// 5. Price comparison formatting for different currencies
function displayPriceWithComparison(inrPrice, originalPrice, originalCurrency) {
    return {
        inr: formatFlightPrice(inrPrice),
        original: `${originalCurrency} ${originalPrice}`,
        display: formatFlightPrice(inrPrice)
    };
}

// 6. Real-time price input formatting
function handlePriceInput(inputElement) {
    inputElement.addEventListener('input', function(e) {
        const value = e.target.value.replace(/[^\d]/g, '');
        if (value) {
            const formatted = manualIndianFormat(value);
            e.target.value = '₹ ' + formatted;
        }
    });
}

// Example usage:
console.log('Examples of rupee formatting:');
console.log('Basic amount: ' + formatFlightPrice(45000));
console.log('Large amount: ' + formatFlightPrice(125000));
console.log('Small amount: ' + formatFlightPrice(5500));
console.log('Manual format: ₹ ' + manualIndianFormat(234567));
