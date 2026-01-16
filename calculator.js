/**
 * Crossover calculation utility.
 */

export const CROSSOVER_TYPES = {
    BUTTERWORTH_1ST: '1st Order Butterworth',
    BUTTERWORTH_2ND: '2nd Order Butterworth',
    LINKWITZ_RILEY_2ND: '2nd Order Linkwitz-Riley',
    BESSEL_2ND: '2nd Order Bessel'
};

export const DESIGN_INTENTS = {
    FLAT: 'Flat / Reference',
    WARM: 'Warm',
    BRIGHT: 'Bright',
    VOCAL: 'Vocal Forward'
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

/**
 * Calculates L-Pad (tweeter attenuation) resistors.
 */
export function calculateLPad(rh, db) {
    const k = Math.pow(10, db / 20);
    const r1 = rh * (k - 1) / k;
    const r2 = rh / (k - 1);
    return {
        r1: r1.toFixed(2),
        r2: r2.toFixed(2)
    };
}

/**
 * Calculates Zobel Network (impedance compensation) components.
 * re: DC resistance, le: voice coil inductance (mH)
 */
export function calculateZobel(re, le) {
    const rz = 1.25 * re;
    const cz = (le / 1000) / Math.pow(rz, 2); // Convert le mH to H
    return {
        rz: rz.toFixed(2),
        cz: (cz * 1e6).toFixed(2) // Convert to uF
    };
}

/**
 * Calculates a 3-Way Crossover (Butterworth 2nd Order).
 */
export function calculate3Way(rw, rm, rt, flz, fhz) {
    // Simplification: We use the 2-way logic for the cross points
    const woofer = calculateCrossover(rw, rw, flz, CROSSOVER_TYPES.BUTTERWORTH_2ND).lowPass;
    const tweeter = calculateCrossover(rt, rt, fhz, CROSSOVER_TYPES.BUTTERWORTH_2ND).highPass;

    // Midrange is a Bandpass (HP at flz, LP at fhz)
    const midHP = calculateCrossover(rm, rm, flz, CROSSOVER_TYPES.BUTTERWORTH_2ND).highPass;
    const midLP = calculateCrossover(rm, rm, fhz, CROSSOVER_TYPES.BUTTERWORTH_2ND).lowPass;

    return {
        woofer,
        midrange: [...midHP, ...midLP],
        tweeter
    };
}

/**
 * Validates driver safety and returns warning messages.
 */
export function validateSafety(rh, rl, f, fs, type) {
    const warnings = [];

    // Fc vs Fs Check
    if (fs && f < 2 * fs) {
        warnings.push({
            type: 'hazard',
            message: `CRITICAL: Crossover frequency (${f}Hz) is less than 2x Tweeter Fs (${fs}Hz). This risk damaging the tweeter at high volumes.`
        });
    } else if (fs && f < 2.5 * fs) {
        warnings.push({
            type: 'warning',
            message: `Caution: Crossover frequency is close to Tweeter resonance. Consider a steeper slope or higher Fc for better longevity.`
        });
    }

    // Slope Hazard Check
    if (type === CROSSOVER_TYPES.BUTTERWORTH_1ST && f < 3000) {
        warnings.push({
            type: 'hazard',
            message: `DANGER: 1st-order slope is very shallow. At ${f}Hz, this provides minimal protection for most tweeters. Use at least 2nd-order or raise Fc.`
        });
    }

    return warnings;
}

/**
 * Adjusts component values based on design intent.
 */
export function getIntentGuidance(intent) {
    switch (intent) {
        case DESIGN_INTENTS.WARM:
            return "Tip: For a 'Warm' sound, add an L-Pad to attenuate the tweeter by 1.5 - 2.0 dB.";
        case DESIGN_INTENTS.BRIGHT:
            return "Tip: For a 'Bright' sound, reduce tweeter L-Pad attenuation or slightly lower the tweeter's crossover point.";
        case DESIGN_INTENTS.VOCAL:
            return "Tip: To bring vocals forward, ensure the midrange (in 3-way) or the overlap region is flat and not recessed.";
        default:
            return "Standard reference alignment selected.";
    }
}
