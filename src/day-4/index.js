const path = './src/day-4/input-full.txt';
const file = Bun.file(path);

const rawInput = await file.text();
const cardLines = rawInput.split('\n').map((it) => it.split(': ')[1]);

let total = 0;

cardLines.forEach((line) => {
  let score = 0;
  let points = 0;
  let [winningNumbers, actualNumbers] = line.split(' | ');

  winningNumbers = winningNumbers.split(' ').filter(Boolean).map(Number);
  actualNumbers = actualNumbers.split(' ').filter(Boolean).map(Number);

  actualNumbers.forEach((actualNumber) => {
    if (winningNumbers.includes(actualNumber)) {
      points++;
    }
  });

  if (!points) {
    return;
  } else if (points === 1) {
    score = 1;
  } else {
    score = 1;

    for (let i = 0; i < points - 1; i++) {
      score = score * 2;
    }
  }

  total += score;
});

console.log(total);
