import { calculateCrossover, CROSSOVER_TYPES } from './calculator.js';

function test() {
    console.log("Testing 1st Order Butterworth (3000Hz, 8 Ohm)");
    const results = calculateCrossover(8, 8, 3000, CROSSOVER_TYPES.BUTTERWORTH_1ST);

    // Results from image 2: C1 = 6.63 uF, L1 = 0.42 mH
    console.log("Calculated:", JSON.stringify(results, null, 2));

    const c1 = parseFloat(results.highPass.find(c => c.name === 'C1').value);
    const l1 = parseFloat(results.lowPass.find(c => c.name === 'L1').value);

    if (Math.abs(c1 - 6.63) < 0.05 && Math.abs(l1 - 0.42) < 0.05) {
        console.log("✅ 1st Order Butterworth test passed!");
    } else {
        console.error("❌ 1st Order Butterworth test failed!");
    }
}

test();
