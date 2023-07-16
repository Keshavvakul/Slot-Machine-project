// 1. Deposite some money
// 2. Determine no of lines to bet on
// 3. Collect bet amount
// 4. Spin the slot machine
// 5. Check if user won
// 6. Give user his price
// 7. Play again or handel a situation in which user has no money left

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,                     // These are the symbols and number of symbols in each wheel of the slot machine
    B: 4,                     // As you may see A is my most valuable symbol and D is the symbol that is present the most.
    C: 6,
    D: 8,
}

const SYMBOL_VALUES = {
    A: 5,                     // These are the symbols and their multipliers.
    B: 4,                     
    C: 3,
    D: 2,
}

const deposite = () => {
    while (true) {
        const depositeAmount = prompt("Enter total deposite amount: ");   // The deposite amount is in string, convert it into number
        const numberDepositeAmount = parseFloat(depositeAmount);          // Next check if the number entered is a valid number

        if (isNaN(numberDepositeAmount) || numberDepositeAmount <= 0) {
            console.log("Please enter a valid deposite amount");
                } else {
                    return numberDepositeAmount;
            }
    } 
};

const lines = () => {
    while (true) {
        const linesToBet = prompt(`Enter number of lines to bet on (1-${ROWS}): `);   // The lines to bet is in string, convert it into number
        const numberLinesToBet = parseFloat(linesToBet);                        // Next check if the number entered is a valid number

        if (isNaN(numberLinesToBet) || numberLinesToBet <= 0 || numberLinesToBet > ROWS) {
            console.log("Please enter a valid number of lines to bet ");
                } else {
                    return numberLinesToBet;
            }
    }
}

const getBet = (balance, lines) => {
    while (true) {
        const betAmount = prompt("Enter bet amount per line: ");                // It is amount per line
        const numberBetAmount = parseFloat(betAmount);

        if (isNaN(numberBetAmount) || numberBetAmount <=0 || numberBetAmount > (balance/lines)) {    // Balance / lines is the max amount you can bet as per your balance and number of lines
            console.log("Please enter a valid bet amount per line");
        } else {
            return numberBetAmount;
        }
    }
}

const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {         // Object.entries(SYMBOLS_COUNT) retrieves key-value pairs from SYMBOLS_COUNT and stores them in destructuring assignment [symbol, count]
        for(let i = 0; i < count; i++) {
            symbols.push(symbol)                    // Here i am pushing symbols into an array so that we can have structured data in the form of array.
        }
    }
    
    const reels = [];
    for(let i = 0; i < COLS; i++) {
        reels.push([]);     // Pushing array in reels array to make nested arrays, and we are doing it so that number of nested arrays are equal to number of columns.
        const reelsSymbols = [...symbols];         // Using spread operator we can creat a copy of the symbols array so that main array is not affected.
        for(let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelsSymbols.length)
            const selectedSymbol = reelsSymbols[randomIndex]
            reels[i].push(selectedSymbol)         // Pushing the selected symbol onto the reels arry list corresponding to the selected index(i).
            reelsSymbols.splice(randomIndex, 1)   // Removing the randomly selected symbol from the the reelsSymbols array using splice method and 1 suggests number of symbols to be removed.
        }
    }
    return reels;
}

const transpose = (reels) => {
    const rows = [];

    for(i = 0; i < ROWS; i++){
        rows.push([]);
        for(j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printRows = (rows) => {
    for(const row of rows) {
        const stringFromRow = row.join(' | ');
        console.log(stringFromRow);
    }

}

/*
# Another method to convert rows array into string.

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = ""
        for(const [i, symbol] of rows.entries()) {
            rowString += symbol
            if (i < rows.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}
*/

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for(let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols) {
            if(symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if(allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
};

const game = () => {
    let balance = deposite();

    while(true){
        console.log(`your balance is $ ${balance}`);
        const linesToBet = lines();
        const bet = getBet(balance, linesToBet);
        balance -= bet * linesToBet;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, linesToBet);
        balance += winnings;
        console.log("You won: $" + winnings.toString());

        if(balance <= 0) {
            console.log("You are out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n) : " );
        if(playAgain != "y") break;

    }
    console.log(`Thanks for playing, Your winnings are ${balance}`);
}

game();
    

