/**
 * CasePort Lead Scoring Engine
 *
 * Scores each applicant 0–100 based on their qualification answers.
 * Tiers: Platinum (80+), Gold (60–79), Silver (40–59), Disqualified (<40)
 *
 * Scoring philosophy:
 * - Practice focus alignment is the #1 signal (screen 1 + 2)
 * - Intake speed and infrastructure are the #2 signals (screens 5, 6, 7, 8, 9)
 * - Funding model readiness is the #3 signal (screen 10)
 * - Geographic coverage, capacity, and authority are supporting signals
 *
 * Option IDs map directly to formData.ts option IDs (e.g. '1a', '1b', '2a' etc.)
 */

export interface ScoringResult {
  score: number;
  tier: 'platinum' | 'gold' | 'silver' | 'disqualified';
  signals: Record<string, number>;
}

export function scoreApplication(answers: Record<string, string | string[]>): ScoringResult {
  const signals: Record<string, number> = {};
  let score = 0;

  // ─── Screen 1: Practice Focus (max 20 pts) ───────────────────────────────
  // Options: '1a' = PI core focus (pass), '1b' = PI secondary (soft-fail), '1c' = not PI (hard-stop)
  const s1 = answers[1] as string;
  if (s1 === '1a') {
    signals['practice_focus'] = 20;
  } else if (s1 === '1b') {
    signals['practice_focus'] = 8;
  } else {
    signals['practice_focus'] = 0;
  }
  score += signals['practice_focus'];

  // ─── Screen 2: Case Mix / Auto Accident Focus (max 10 pts) ───────────────
  // Options: '2a' = auto accidents core (pass), '2b' = not major focus (soft-fail), '2c' = no (hard-stop)
  const s2 = answers[2] as string;
  if (s2 === '2a') {
    signals['case_mix'] = 10;
  } else if (s2 === '2b') {
    signals['case_mix'] = 4;
  } else {
    signals['case_mix'] = 0;
  }
  score += signals['case_mix'];

  // ─── Screen 3: States (max 5 pts) ────────────────────────────────────────
  // Multi-select: scored by number of states selected
  const states = answers[3] as string[];
  if (Array.isArray(states)) {
    if (states.length >= 5) {
      signals['geographic_reach'] = 5;
    } else if (states.length >= 3) {
      signals['geographic_reach'] = 4;
    } else if (states.length >= 1) {
      signals['geographic_reach'] = 2;
    } else {
      signals['geographic_reach'] = 0;
    }
  } else {
    signals['geographic_reach'] = 0;
  }
  score += signals['geographic_reach'];

  // ─── Screen 4: Metros (max 3 pts) ────────────────────────────────────────
  // Multi-select: scored by number of metros entered
  const metros = answers[4] as string[];
  if (Array.isArray(metros) && metros.length >= 3) {
    signals['metro_coverage'] = 3;
  } else if (Array.isArray(metros) && metros.length >= 1) {
    signals['metro_coverage'] = 2;
  } else {
    signals['metro_coverage'] = 1;
  }
  score += signals['metro_coverage'];

  // ─── Screen 5: 10-Minute Response Consistency (max 12 pts) ───────────────
  // Options: '5a' = yes consistently (pass), '5b' = not always (soft-fail), '5c' = no (hard-stop)
  const s5 = answers[5] as string;
  if (s5 === '5a') {
    signals['response_consistency'] = 12;
  } else if (s5 === '5b') {
    signals['response_consistency'] = 5;
  } else {
    signals['response_consistency'] = 0;
  }
  score += signals['response_consistency'];

  // ─── Screen 6: Average First-Contact Time (max 10 pts) ───────────────────
  // Options: '6a' = under 5 min, '6b' = 5-10 min, '6c' = 11-30 min, '6d' = over 30 min
  const s6 = answers[6] as string;
  if (s6 === '6a') {
    signals['response_speed'] = 10;
  } else if (s6 === '6b') {
    signals['response_speed'] = 8;
  } else if (s6 === '6c') {
    signals['response_speed'] = 4;
  } else if (s6 === '6d') {
    signals['response_speed'] = 1;
  } else {
    signals['response_speed'] = 0;
  }
  score += signals['response_speed'];

  // ─── Screen 7: Intake Infrastructure (max 8 pts) ─────────────────────────
  // Options: '7a' = dedicated in-house, '7b' = shared, '7c' = outsourced, '7d' = callback/voicemail
  const s7 = answers[7] as string;
  if (s7 === '7a') {
    signals['intake_infrastructure'] = 8;
  } else if (s7 === '7b') {
    signals['intake_infrastructure'] = 6;
  } else if (s7 === '7c') {
    signals['intake_infrastructure'] = 4;
  } else if (s7 === '7d') {
    signals['intake_infrastructure'] = 1;
  } else {
    signals['intake_infrastructure'] = 0;
  }
  score += signals['intake_infrastructure'];

  // ─── Screen 8: % Contacted Within 10 Minutes (max 5 pts) ─────────────────
  // Options: '8a' = 80-100%, '8b' = 60-79%, '8c' = 40-59%, '8d' = under 40%
  const s8 = answers[8] as string;
  if (s8 === '8a') {
    signals['contact_rate'] = 5;
  } else if (s8 === '8b') {
    signals['contact_rate'] = 3;
  } else if (s8 === '8c') {
    signals['contact_rate'] = 2;
  } else if (s8 === '8d') {
    signals['contact_rate'] = 0;
  } else {
    signals['contact_rate'] = 0;
  }
  score += signals['contact_rate'];

  // ─── Screen 9: After-Hours Coverage (max 5 pts) ───────────────────────────
  // Options: '9a' = live after hours, '9b' = limited live, '9c' = next business day, '9d' = no coverage
  const s9 = answers[9] as string;
  if (s9 === '9a') {
    signals['after_hours'] = 5;
  } else if (s9 === '9b') {
    signals['after_hours'] = 3;
  } else if (s9 === '9c') {
    signals['after_hours'] = 1;
  } else {
    signals['after_hours'] = 0;
  }
  score += signals['after_hours'];

  // ─── Screen 10: Funding Model / Pre-Funded Wallet (max 15 pts) ───────────
  // This is the critical commercial signal — willingness to pre-fund
  // Options: '10a' = yes ready (pass), '10b' = open to it (soft-fail), '10c' = no (hard-stop)
  const s10 = answers[10] as string;
  if (s10 === '10a') {
    signals['funding_model'] = 15;
  } else if (s10 === '10b') {
    signals['funding_model'] = 7;
  } else {
    signals['funding_model'] = 0;
  }
  score += signals['funding_model'];

  // ─── Screen 11: Funding Activation Speed (max 4 pts) ─────────────────────
  // Options: '11a' = immediately, '11b' = within 3 days, '11c' = within 7 days, '11d' = longer
  const s11 = answers[11] as string;
  if (s11 === '11a') {
    signals['activation_speed'] = 4;
  } else if (s11 === '11b') {
    signals['activation_speed'] = 3;
  } else if (s11 === '11c') {
    signals['activation_speed'] = 2;
  } else {
    signals['activation_speed'] = 0;
  }
  score += signals['activation_speed'];

  // ─── Screen 12: Monthly Capacity (max 3 pts) ─────────────────────────────
  // Options: '12a' = 1-5, '12b' = 6-15, '12c' = 16-30, '12d' = 30+
  const s12 = answers[12] as string;
  if (s12 === '12d') {
    signals['capacity'] = 3;
  } else if (s12 === '12c') {
    signals['capacity'] = 3;
  } else if (s12 === '12b') {
    signals['capacity'] = 2;
  } else if (s12 === '12a') {
    signals['capacity'] = 1;
  } else {
    signals['capacity'] = 0;
  }
  score += signals['capacity'];

  // ─── Screen 13: Decision Authority (max 1 pt — tracking + soft signal) ───
  // Options: '13a' = I approve directly, '13b' = partner approves, '13c' = not decision-maker
  const s13 = answers[13] as string;
  if (s13 === '13a') {
    signals['decision_authority'] = 1;
  } else if (s13 === '13b') {
    signals['decision_authority'] = 1;
  } else {
    signals['decision_authority'] = 0;
  }
  score += signals['decision_authority'];

  // ─── Determine tier ──────────────────────────────────────────────────────
  let tier: 'platinum' | 'gold' | 'silver' | 'disqualified';
  if (score >= 75) {
    tier = 'platinum';
  } else if (score >= 55) {
    tier = 'gold';
  } else if (score >= 35) {
    tier = 'silver';
  } else {
    tier = 'disqualified';
  }

  return { score, tier, signals };
}
