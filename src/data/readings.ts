/*
  Fully invented sample readings, not real sensor output. Shaped to
  illustrate a detection event: a stable baseline, then a plume pushes
  turbidity past the CONAMA class 2 limit for two days, then recovery.
  Day labels are relative (Day 1..Day 14), not calendar dates, so the
  chart can't be mistaken for a real logged period. Labeled as sample
  data directly in DataSection and on the chart card.

  Regulatory limits below reflect commonly cited CONAMA Resolution
  357/2005 Class 2 freshwater thresholds (turbidity, dissolved oxygen,
  pH). These have not been verified against the primary resolution text
  in this project; confirm the exact figures before using them in
  compliance-facing communication.
*/

export const LIMIT_NTU = 100;
export const FLOOR_OXYGEN = 5.0;
export const LIMIT_MERCURY = 0.2;

export type Reading = {
  id: string;
  label: string;
  turbidity: number;
  oxygen: number;
  ph: number;
  mercury: number;
};

export const readings: Reading[] = [
  { id: "d1", label: "Day 1", turbidity: 24, oxygen: 6.8, ph: 7.1, mercury: 0.04 },
  { id: "d2", label: "Day 2", turbidity: 21, oxygen: 6.9, ph: 7.2, mercury: 0.04 },
  { id: "d3", label: "Day 3", turbidity: 28, oxygen: 6.7, ph: 7.0, mercury: 0.05 },
  { id: "d4", label: "Day 4", turbidity: 26, oxygen: 6.8, ph: 7.1, mercury: 0.04 },
  { id: "d5", label: "Day 5", turbidity: 34, oxygen: 6.5, ph: 6.9, mercury: 0.06 },
  { id: "d6", label: "Day 6", turbidity: 31, oxygen: 6.6, ph: 7.0, mercury: 0.05 },
  { id: "d7", label: "Day 7", turbidity: 29, oxygen: 6.6, ph: 7.0, mercury: 0.05 },
  { id: "d8", label: "Day 8", turbidity: 42, oxygen: 6.3, ph: 6.8, mercury: 0.07 },
  { id: "d9", label: "Day 9", turbidity: 38, oxygen: 6.4, ph: 6.9, mercury: 0.06 },
  { id: "d10", label: "Day 10", turbidity: 47, oxygen: 6.1, ph: 6.7, mercury: 0.09 },
  { id: "d11", label: "Day 11", turbidity: 148, oxygen: 4.6, ph: 6.2, mercury: 0.23 },
  { id: "d12", label: "Day 12", turbidity: 112, oxygen: 5.2, ph: 6.4, mercury: 0.18 },
  { id: "d13", label: "Day 13", turbidity: 74, oxygen: 5.9, ph: 6.7, mercury: 0.11 },
  { id: "d14", label: "Day 14", turbidity: 51, oxygen: 6.3, ph: 6.9, mercury: 0.07 },
];

export function isBreach(reading: Reading) {
  return (
    reading.turbidity > LIMIT_NTU ||
    reading.oxygen < FLOOR_OXYGEN ||
    reading.mercury > LIMIT_MERCURY
  );
}
