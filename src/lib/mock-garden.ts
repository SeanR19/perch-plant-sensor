/**
 * Stand-in numbers for the home screen until the Perch sensors are talking to
 * the app. Screens only depend on the `Garden` type, so swap this for the live
 * source later.
 */

export type Garden = {
  /** Overall health score, 0–100. */
  health: number;
  plants: number;
  thriving: number;
  needCare: number;
  tasks: { completed: number; total: number };
};

export const MOCK_GARDEN: Garden = {
  health: 86,
  plants: 6,
  thriving: 4,
  needCare: 2,
  tasks: { completed: 2, total: 3 },
};
