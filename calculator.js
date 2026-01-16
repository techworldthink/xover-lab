/**
 * Crossover calculation utility.
 */

export const CROSSOVER_TYPES = {
    BUTTERWORTH_1ST: '1st Order Butterworth',
    BUTTERWORTH_2ND: '2nd Order Butterworth',
    LINKWITZ_RILEY_2ND: '2nd Order Linkwitz-Riley',
    BESSEL_2ND: '2nd Order Bessel',
    BUTTERWORTH_3RD: '3rd Order Butterworth',
    LINKWITZ_RILEY_4TH: '4th Order Linkwitz-Riley'
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
    const omega = 2 * pi * f;

    switch (type) {
        case CROSSOVER_TYPES.BUTTERWORTH_1ST:
            // High Pass C1 = 1 / (omega * rh)
            const c1_1 = 1 / (omega * rh);
            // Low Pass L1 = rl / omega
            const l1_1 = rl / omega;

            result.highPass.push({ name: 'C1', value: (c1_1 * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L1', value: (l1_1 * 1e3).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.BUTTERWORTH_2ND:
            const sqrt2 = Math.sqrt(2);
            // C1 = 1 / (sqrt(2) * omega * rh)
            const c1_2b = 1 / (sqrt2 * omega * rh);
            // L1 = rh / (sqrt(2) * omega)
            const l1_2b = rh / (sqrt2 * omega);
            // C2 = 1 / (sqrt(2) * omega * rl)
            const c2_2b = 1 / (sqrt2 * omega * rl);
            // L2 = rl / (sqrt(2) * omega)
            const l2_2b = rl / (sqrt2 * omega);

            result.highPass.push({ name: 'C1', value: (c1_2b * 1e6).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'L1', value: (l1_2b * 1e3).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C2', value: (c2_2b * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L2', value: (l2_2b * 1e3).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.LINKWITZ_RILEY_2ND:
            // C1 = 1 / (2 * omega * rh)
            const c1_lr = 1 / (2 * omega * rh);
            // L1 = rh / (0.5 * omega)
            const l1_lr = rh / (0.5 * omega);
            // C2 = 1 / (2 * omega * rl)
            const c2_lr = 1 / (2 * omega * rl);
            // L2 = rl / (0.5 * omega)
            const l2_lr = rl / (0.5 * omega);

            result.highPass.push({ name: 'C1', value: (c1_lr * 1e6).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'L1', value: (l1_lr * 1e3).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C2', value: (c2_lr * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L2', value: (l2_lr * 1e3).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.BESSEL_2ND:
            const sqrt3 = Math.sqrt(3);
            // C1 = 1 / (sqrt(3) * omega * rh)
            const c1_bs = 1 / (sqrt3 * omega * rh);
            // L1 = (sqrt(3) * rh) / omega
            const l1_bs = (sqrt3 * rh) / omega;
            // C2 = 1 / (sqrt(3) * omega * rl)
            const c2_bs = 1 / (sqrt3 * omega * rl);
            // L2 = (sqrt(3) * rl) / omega
            const l2_bs = (sqrt3 * rl) / omega;

            result.highPass.push({ name: 'C1', value: (c1_bs * 1e6).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'L1', value: (l1_bs * 1e3).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C2', value: (c2_bs * 1e6).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L2', value: (l2_bs * 1e3).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.BUTTERWORTH_3RD:
            // HP: C1=1/(1.5*omega*R), L2=R/(1.33*omega), C3=1/(0.5*omega*R)
            result.highPass.push({ name: 'C1', value: (1e6 / (1.5 * omega * rh)).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'L2', value: (1e3 * (rh / (1.333 * omega))).toFixed(2), unit: 'mH' });
            result.highPass.push({ name: 'C3', value: (1e6 / (0.5 * omega * rh)).toFixed(2), unit: 'uF' });

            // LP: L1=1.5*R/omega, C2=1/(1.33*omega*R), L3=0.5*R/omega
            result.lowPass.push({ name: 'L1', value: (1e3 * (1.5 * rl / omega)).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C2', value: (1e6 / (1.333 * omega * rl)).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'L3', value: (1e3 * (0.5 * rl / omega)).toFixed(2), unit: 'mH' });
            break;

        case CROSSOVER_TYPES.LINKWITZ_RILEY_4TH:
            // HP: C1=1/(1.2*omega*R), C2=1/(0.48*omega*R), L3=R/(0.83*omega), L4=R/(2.08*omega) ? No, use established constants.
            // Using standard constants for passive LR4 (very complex for passive, often two sections)
            // C1 = 0.0844/fR, C2 = 0.1688/fR, L3 = 0.1000R/f, L4 = 0.2000R/f
            result.highPass.push({ name: 'C1', value: (84400 / (f * rh)).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'C2', value: (168800 / (f * rh)).toFixed(2), unit: 'uF' });
            result.highPass.push({ name: 'L3', value: (100 * rh / f).toFixed(2), unit: 'mH' });
            result.highPass.push({ name: 'L4', value: (200 * rh / f).toFixed(2), unit: 'mH' });

            // LP: L1=0.3000R/f, L2=0.1500R/f, C3=0.2110/fR, C4=0.1055/fR
            result.lowPass.push({ name: 'L1', value: (318 * rl / f).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'L2', value: (159 * rl / f).toFixed(2), unit: 'mH' });
            result.lowPass.push({ name: 'C3', value: (212000 / (f * rl)).toFixed(2), unit: 'uF' });
            result.lowPass.push({ name: 'C4', value: (106000 / (f * rl)).toFixed(2), unit: 'uF' });
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
 * Calculates a 3-Way Crossover.
 */
export function calculate3Way(rw, rm, rt, flz, fhz, type) {
    // We use the selected type for both crossover points
    const woofer = calculateCrossover(rw, rw, flz, type).lowPass;
    const tweeter = calculateCrossover(rt, rt, fhz, type).highPass;

    // Midrange is a Bandpass (HP at flz, LP at fhz)
    const midHP = calculateCrossover(rm, rm, flz, type).highPass;
    const midLP = calculateCrossover(rm, rm, fhz, type).lowPass;

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
