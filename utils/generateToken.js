exports.generateToken = (amount) => {
    try {
        const minAmount = 100;
        const maxDays = 1825; // 5 years in days
        const maxAmount = maxDays * minAmount;

        if (amount < minAmount || amount > maxAmount) {
            throw new Error(`Invalid amount. Amount should be between ${minAmount} and ${maxAmount}.`);
        }

        const days = Math.floor(amount / minAmount);
        const timestamp = Date.now();
        const uniqueFactor = Math.floor(Math.random() * 1000) % 100; // Additional unique factor limited to 2 digits
        const token = `${timestamp}${uniqueFactor}`.slice(-6) + days.toString().padStart(2, '0');
        const truncatedToken = token.slice(0, 8); // Truncate the token to maximum length of 8 characters

        return {
            token: truncatedToken,
            days
        };
    } catch (err) {
        console.log(err);
    }
};