/**
 * Crossover calculation utility.
 */

export const CROSSOVER_TYPES = {
    BUTTERWORTH_1ST: '1st Order Butterworth',
    BUTTERWORTH_2ND: '2nd Order Butterworth',
    LINKWITZ_RILEY_2ND: '2nd Order Linkwitz-Riley',
    BESSEL_2ND: '2nd Order Bessel'
};

/**
 * Calculates crossover component values.
 * 
 * @param {number} rh - Tweeter impedance (Ohms)
 * @param {number} rl - Woofer impedance (Ohms)
 * @param {number} f - Crossover frequency (Hz)
 * @param {string} type - Crossover type from CROSSOVER_TYPES
 * @returns {object} Calculated components with units
 */
export function calculateCrossover(rh, rl, f, type) {
    const result = {
        highPass: [],
        lowPass: []
    };

    const pi = Math.PI;

    switch (type) {
        case CROSSOVER_TYPES.BUTTERWORTH_1ST:
            // High Pass C1 = 1 / (2 * pi * rh * f)
            const c1_1 = 1 / (2 * pi * rh * f);
            // Low Pass L1 = rl / (2 * pi * f)
            const l1_1 = rl / (2 * pi * f);

            result.highPass.push({ name: 'C1', value: (c1_1 * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L1', value: (l1_1 * 1e3).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.BUTTERWORTH_2ND:
            const sqrt2 = Math.sqrt(2);
            // C1 = 1 / (2 * sqrt(2) * pi * rh * f)
            const c1_2b = 1 / (2 * sqrt2 * pi * rh * f);
            // L1 = rh / (2 * sqrt(2) * pi * f)
            const l1_2b = rh / (2 * sqrt2 * pi * f);
            // C2 = 1 / (2 * sqrt(2) * pi * rl * f)
            const c2_2b = 1 / (2 * sqrt2 * pi * rl * f);
            // L2 = rl / (2 * sqrt(2) * pi * f)
            const l2_2b = rl / (2 * sqrt2 * pi * f);

            result.highPass.push({ name: 'C1', value: (c1_2b * 1e6).toFixed(2), unit: 'uF' }); // Note: standard 2nd order HP has C in series, L in parallel
            result.highPass.push({ name: 'L1', value: (l1_2b * 1e3).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C2', value: (c2_2b * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L2', value: (l2_2b * 1e3).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.LINKWITZ_RILEY_2ND:
            // C1 = 1 / (4 * pi * rh * f)
            const c1_lr = 1 / (4 * pi * rh * f);
            // L1 = rh / (pi * f)
            const l1_lr = rh / (pi * f);
            // C2 = 1 / (4 * pi * rl * f)
            const c2_lr = 1 / (4 * pi * rl * f);
            // L2 = rl / (pi * f)
            const l2_lr = rl / (pi * f);

            result.highPass.push({ name: 'C1', value: (c1_lr * 1e6).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'L1', value: (l1_lr * 1e3).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C2', value: (c2_lr * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L2', value: (l2_lr * 1e3).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.BESSEL_2ND:
            const sqrt3 = Math.sqrt(3);
            // C1 = 1 / (2 * sqrt(3) * pi * rh * f)
            const c1_bs = 1 / (2 * sqrt3 * pi * rh * f);
            // L1 = (sqrt(3) * rh) / (2 * pi * f)
            const l1_bs = (sqrt3 * rh) / (2 * pi * f);
            // C2 = 1 / (2 * sqrt(3) * pi * rl * f)
            const c2_bs = 1 / (2 * sqrt3 * pi * rl * f);
            // L2 = (sqrt(3) * rl) / (2 * pi * f)
            const l2_bs = (sqrt3 * rl) / (2 * pi * f);

            result.highPass.push({ name: 'C1', value: (c1_bs * 1e6).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'L1', value: (l1_bs * 1e3).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C2', value: (c2_bs * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L2', value: (l2_bs * 1e3).toFixed(2), unit: 'mH' });
            break;
    }

    return result;
}
