/**
 * Stand-in data until the Perch sensor hardware is talking to the app. Shape it
 * however the real sensor payload ends up looking, then swap this file for the
 * live source — screens only depend on the `Plant` type.
 */

export type Reading = {
  /** Soil moisture, 0–100 %. */
  moisture: number;
  /** Light, in lux. */
  light: number;
  /** Air temperature, °F. */
  temperature: number;
  /** Relative humidity, 0–100 %. */
  humidity: number;
};

export type Plant = {
  id: string;
  name: string;
  species: string;
  emoji: string;
  /** Days since the seed went in. */
  daysOld: number;
  reading: Reading;
};

export const MOCK_PLANTS: Plant[] = [
  { id: '1', name: 'Basil', species: 'Ocimum basilicum', emoji: '🌿', daysOld: 21, reading: { moisture: 64, light: 12000, temperature: 72, humidity: 48 } },
  { id: '2', name: 'Sunflower', species: 'Helianthus annuus', emoji: '🌻', daysOld: 34, reading: { moisture: 38, light: 18000, temperature: 74, humidity: 41 } },
  { id: '3', name: 'Cherry Tomato', species: 'Solanum lycopersicum', emoji: '🍅', daysOld: 28, reading: { moisture: 71, light: 15000, temperature: 73, humidity: 52 } },
  { id: '4', name: 'Mint', species: 'Mentha spicata', emoji: '🌱', daysOld: 15, reading: { moisture: 22, light: 6000, temperature: 70, humidity: 55 } },
  { id: '5', name: 'Marigold', species: 'Tagetes erecta', emoji: '🌼', daysOld: 19, reading: { moisture: 55, light: 14000, temperature: 71, humidity: 46 } },
  { id: '6', name: 'Venus Flytrap', species: 'Dionaea muscipula', emoji: '🪴', daysOld: 42, reading: { moisture: 82, light: 9000, temperature: 75, humidity: 68 } },
];

export type Status = 'good' | 'warn' | 'bad';

/** Rough moisture health. Placeholder thresholds — tune per species later. */
export function moistureStatus(moisture: number): Status {
  if (moisture < 30) return 'bad';
  if (moisture < 45) return 'warn';
  return 'good';
}
