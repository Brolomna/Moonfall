// Houses in the village painting (public/village/*.webp, 941×1672), most prominent first. Generated from
// scripts/village-houses.json (outlines in painting pixels). All values are % of the painting.
//   clip: the house outline — its lit windows are revealed through it   x/y: where its owner's name hangs
//   cx/cy/w/h: the house's box, for the soft shadow over an abandoned house
export const PAINTING_RATIO = 941 / 1672;
export type House = { id: string; clip: string; x: number; y: number; cx: number; cy: number; w: number; h: number };
export const HOUSES: House[] = [
  { id: 'right-big', clip: 'polygon(73.33% 56.22%, 81.83% 43.06%, 91.39% 46.65%, 100.0% 47.85%, 100.0% 74.76%, 73.33% 74.76%)', x: 86.61, y: 60.41, cx: 86.66, cy: 58.91, w: 26.67, h: 31.7 },
  { id: 'left', clip: 'polygon(14.88% 41.87%, 24.65% 38.28%, 31.88% 45.45%, 31.88% 53.83%, 14.88% 53.83%)', x: 23.91, y: 52.93, cx: 23.38, cy: 46.05, w: 17.0, h: 15.55 },
  { id: 'right-upper', clip: 'polygon(68.54% 38.28%, 76.51% 33.49%, 85.02% 35.89%, 88.2% 41.87%, 80.77% 51.44%, 68.01% 51.44%)', x: 74.39, y: 47.85, cx: 78.11, cy: 42.46, w: 20.19, h: 17.94 },
  { id: 'low-center', clip: 'polygon(35.07% 57.42%, 42.51% 55.02%, 49.95% 58.61%, 49.95% 65.79%, 35.07% 65.79%)', x: 42.51, y: 66.09, cx: 42.51, cy: 60.41, w: 14.88, h: 10.77 },
  { id: 'center-left', clip: 'polygon(31.88% 45.45%, 37.19% 41.27%, 42.51% 47.85%, 42.51% 53.83%, 31.88% 53.83%)', x: 37.19, y: 54.13, cx: 37.19, cy: 47.55, w: 10.63, h: 12.56 },
  { id: 'center', clip: 'polygon(42.51% 47.85%, 49.95% 45.75%, 57.39% 49.64%, 57.39% 55.92%, 42.51% 55.92%)', x: 49.95, y: 56.22, cx: 49.95, cy: 50.84, w: 14.88, h: 10.17 },
  { id: 'far-left', clip: 'polygon(0.0% 26.91%, 6.38% 33.49%, 14.88% 45.45%, 15.94% 59.81%, 7.97% 59.81%, 7.97% 66.39%, 0.0% 66.39%)', x: 6.59, y: 58.91, cx: 7.97, cy: 46.65, w: 15.94, h: 39.47 },
  { id: 'right-lower', clip: 'polygon(58.45% 59.81%, 68.01% 57.12%, 74.39% 59.81%, 74.39% 71.77%, 58.98% 71.77%)', x: 66.42, y: 70.87, cx: 66.42, cy: 64.44, w: 15.94, h: 14.65 },
  { id: 'tower', clip: 'polygon(77.58% 31.1%, 83.42% 25.72%, 90.33% 31.1%, 90.33% 35.89%, 77.58% 35.89%)', x: 83.95, y: 35.89, cx: 83.95, cy: 30.8, w: 12.75, h: 10.17 },
  { id: 'low-left', clip: 'polygon(20.19% 53.83%, 31.88% 53.83%, 31.88% 61.0%, 20.19% 61.0%)', x: 26.04, y: 61.3, cx: 26.04, cy: 57.42, w: 11.69, h: 7.18 },
  { id: 'castle', clip: 'polygon(44.63% 34.09%, 53.13% 28.71%, 61.64% 33.49%, 63.76% 41.87%, 44.63% 41.87%)', x: 54.2, y: 42.17, cx: 54.2, cy: 35.29, w: 19.13, h: 13.16 },
  { id: 'mid-left', clip: 'polygon(29.76% 37.08%, 34.01% 33.49%, 38.26% 38.28%, 38.26% 43.06%, 29.76% 43.06%)', x: 34.01, y: 43.36, cx: 34.01, cy: 38.28, w: 8.5, h: 9.57 },
  { id: 'mid-right', clip: 'polygon(58.45% 43.66%, 63.76% 41.27%, 69.08% 43.66%, 69.08% 49.64%, 58.45% 49.64%)', x: 63.76, y: 49.94, cx: 63.76, cy: 45.45, w: 10.63, h: 8.37 },
  { id: 'back-left', clip: 'polygon(9.56% 37.08%, 15.94% 35.59%, 21.25% 41.27%, 14.88% 43.06%, 9.56% 43.06%)', x: 14.88, y: 43.36, cx: 15.41, cy: 39.32, w: 11.69, h: 7.48 },
];
