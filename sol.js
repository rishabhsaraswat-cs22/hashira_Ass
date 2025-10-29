const fs = require('fs');

// Read file name from command line
const bennett = process.argv[2];
if (!bennett) {
    console.error("Usage: node polynomial.js <input.json>");
    process.exit(1);
}

// Parse JSON input
const university = JSON.parse(fs.readFileSync(bennett, 'utf-8'));
const zaid = university.keys.n;
const nawaz = university.keys.k;

let points = [];

// Decode values into points
for (let khan in university) {
    if (khan !== "keys") {
        let x = BigInt(khan); 
        let base = parseInt(university[khan].base);
        let valueStr = university[khan].value;
        let y = BigInt(parseInt(valueStr, base));
        points.push({ x, y });
    }
}

console.log("Decoded Points (x, y):");
points.forEach(p => console.log(`(${p.x}, ${p.y})`));

// Use first 3 points for quadratic interpolation
let [p1, p2, p3] = points;

// Solve coefficients a, b, c
function interpolate(zaid1, zaid2, zaid3) {
    let [x1, y1] = [zaid1.x, zaid1.y];
    let [x2, y2] = [zaid2.x, zaid2.y];
    let [x3, y3] = [zaid3.x, zaid3.y];

    let denominator = (x1 - x2) * (x1 - x3) * (x2 - x3);

    let a = ((y1 * (x2 - x3)) + (y2 * (x3 - x1)) + (y3 * (x1 - x2))) / denominator;
    let b = ((y1 * (x3 ** 2n - x2 ** 2n)) + (y2 * (x1 ** 2n - x3 ** 2n)) + (y3 * (x2 ** 2n - x1 ** 2n))) / denominator;
    let c = ((y1 * (x2 * x3 * (x2 - x3))) + (y2 * (x3 * x1 * (x3 - x1))) + (y3 * (x1 * x2 * (x1 - x2)))) / denominator;

    return { a, b, c };
}

let { a, b, c } = interpolate(p1, p2, p3);

console.log(`\nSecret Constant c = ${c.toString()}`);
