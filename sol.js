const fs = require('fs');

// Ensure input file is provided
const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: node solver.js <input.json>");
  process.exit(1);
}

// Read and parse JSON file
const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
const totalPoints = data.keys.n;
const requiredRoots = data.keys.k;

// Step 1: Decode the values from their bases
let coordinates = [];

for (const key in data) {
  if (key !== "keys") {
    const x = BigInt(key);
    const base = parseInt(data[key].base);
    const valueStr = data[key].value;
    const y = BigInt(parseInt(valueStr, base));
    coordinates.push({ x, y });
  }
}

// Display converted points
console.log("Decoded Points:");
coordinates.forEach(pt => console.log(`(${pt.x}, ${pt.y})`));

// Step 2: Pick first 3 points for quadratic polynomial
const [pt1, pt2, pt3] = coordinates;

// Step 3: Function to compute coefficients a, b, c
function findCoefficients(p1, p2, p3) {
  const [x1, y1] = [p1.x, p1.y];
  const [x2, y2] = [p2.x, p2.y];
  const [x3, y3] = [p3.x, p3.y];

  const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);

  const a =
    ((y1 * (x2 - x3)) +
     (y2 * (x3 - x1)) +
     (y3 * (x1 - x2))) / denom;

  const b =
    ((y1 * (x3 ** 2n - x2 ** 2n)) +
     (y2 * (x1 ** 2n - x3 ** 2n)) +
     (y3 * (x2 ** 2n - x1 ** 2n))) / denom;

  const c =
    ((y1 * (x2 * x3 * (x2 - x3))) +
     (y2 * (x3 * x1 * (x3 - x1))) +
     (y3 * (x1 * x2 * (x1 - x2)))) / denom;

  return { a, b, c };
}

// Step 4: Calculate the coefficients
const { a, b, c } = findCoefficients(pt1, pt2, pt3);

// Step 5: Display only the constant term
console.log(`\nSecret Constant (c) = ${c.toString()}`);
