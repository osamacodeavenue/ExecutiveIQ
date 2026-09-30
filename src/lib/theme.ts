export const C = {
  ink: '#17181C',
  ink2: '#4A4D55',
  muted: '#6B6E76',
  brand: '#2B59C3',
  brandDark: '#1F4499',
  good: '#1B7F4C',
  goodInk: '#17683F',
  bad: '#C0392B',
  badInk: '#A8321F',
  warn: '#C98A1B',
  warnInk: '#855000',
  amber: '#D99A1E',
  orange: '#D98A1E',
  stone: '#A39E92',
  paleBlue: '#D5DCEB',
  paleLine: '#E3E0D8',
} as const;

/** Text colour matching a bar colour: red and green bars get their darker ink variant. */
export const inkFor = (c: string) => (c === C.bad ? C.badInk : c === C.good ? C.goodInk : C.ink);
