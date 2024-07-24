export function formatAmount(amount, currency) {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
    });

    return formatter.format(amount);
}