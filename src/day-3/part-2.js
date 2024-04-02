const path = './src/day-3/input-full.txt';
const file = Bun.file(path);

const rawInput = await file.text();
const inputLines = rawInput.split('\n');
const inputMatrix = inputLines.map((line) => line.split(''));

const digitRegex = /[0-9]/;

const foundNumbersMap = {};
const receivedNumbers = [];

inputMatrix.forEach((row, rowIndex) => {
  row.forEach((cell, cellIndex) => {
    // Check if contents of the cell is a gear
    if (cell === '*') {
      // Get coordinates of all cells around the symbol [[2,3], [2,4], ...]
      const searchCoordinates = getSearchCoordinates(rowIndex, cellIndex);
      const adjacentNumbers = [];

      // Go though the cells surrounding the symbol
      searchCoordinates.forEach(([searchRow, searchColumn]) => {
        const searchCellValue = inputMatrix[searchRow][searchColumn];

        if (isNumber(searchCellValue)) {
          const extractedNumber = extractNumber(inputMatrix[searchRow], searchColumn, searchRow);

          if (extractedNumber) {
            adjacentNumbers.push(extractedNumber);
          }
        }
      });

      if (adjacentNumbers.length === 2) {
        const [firstNumber, secondNumber] = adjacentNumbers;

        receivedNumbers.push(firstNumber * secondNumber);
      }
    }
  });
});

function isNumber(character) {
  return digitRegex.test(character);
}

function getSearchCoordinates(yCoordinate, xCoordinate) {
  const result = [];

  // Outer
  for (let y = yCoordinate - 1; y < yCoordinate + 2; y++) {
    const locationYExists = !!inputMatrix[y];

    if (locationYExists) {
      // Inner
      for (let x = xCoordinate - 1; x < xCoordinate + 2; x++) {
        const locationXExists = !!inputMatrix[y]?.[x];

        if (locationXExists) {
          if (y !== yCoordinate || x !== xCoordinate) {
            result.push([y, x]);
          }
        }
      }
    }
  }

  return result;
}

function extractNumber(inputArray, matchIndex, rowNumber) {
  const arrayLength = inputArray.length;

  let leftNumbers = '';
  let rightNumbers = '';

  if (Array.isArray(foundNumbersMap[rowNumber])) {
    if (foundNumbersMap[rowNumber].includes(matchIndex)) {
      return 0;
    }
  }

  // Setup array with the key of current row, to track matched numbers
  foundNumbersMap[rowNumber] = [];

  // Walk left
  for (let i = matchIndex; i >= 0; i--) {
    const currentItem = inputArray[i];

    if (isNumber(currentItem)) {
      leftNumbers = currentItem + leftNumbers;

      // Push current index of a digit, to be treated as resolved
      foundNumbersMap[rowNumber].push(i);
    } else {
      break;
    }
  }

  // Walk right
  for (let i = matchIndex + 1; i < arrayLength; i++) {
    const currentItem = inputArray[i];

    if (isNumber(currentItem)) {
      rightNumbers = rightNumbers + currentItem;

      // Push current index of a digit, to be treated as resolved
      foundNumbersMap[rowNumber].push(i);
    } else {
      break;
    }
  }

  return Number(leftNumbers + rightNumbers);
}

console.log(receivedNumbers.reduce((a, i) => a + i, 0));
