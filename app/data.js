// Meridia — illustrative sample statistics for the fictional Republic of Meridia.
// Every figure is invented for this demonstration portal and is internally
// consistent (for example GDP per capita equals GDP divided by population).
// Nothing here describes a real country.

export const COUNTRY = {
  name: 'Meridia',
  fullName: 'Republic of Meridia',
  capital: 'Aldgate City',
  currency: 'merid',
  currencyCode: 'MD',
  currencyPerUsd: 14.6,
  areaKm2: 184200,
  regionsCount: 6,
  updated: '25 November 2026',
  nextRelease: 'Consumer Price Index — November 2026 · 10 December 2026',
};

// Annual series, 2015-2025. Population in millions, GDP in US$ billions,
// exports/imports in US$ billions, rates in percent, life expectancy in years.
export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const SERIES = {
  population: [7.685, 7.76, 7.835, 7.912, 7.99, 8.05, 8.13, 8.21, 8.29, 8.35, 8.412],
  gdp: [41.2, 43.0, 44.8, 46.9, 48.5, 47.1, 51.3, 54.6, 57.8, 60.1, 62.4],
  gdpGrowth: [2.8, 4.4, 4.2, 4.7, 3.4, -2.9, 8.9, 6.4, 5.9, 4.0, 3.8],
  inflation: [2.1, 2.8, 3.4, 4.0, 3.6, 1.9, 3.8, 6.1, 5.4, 4.7, 4.2],
  unemployment: [8.9, 8.4, 7.9, 7.5, 7.1, 9.4, 8.2, 7.6, 7.2, 7.0, 6.8],
  lifeExpectancy: [72.8, 73.0, 73.2, 73.5, 73.8, 73.9, 74.1, 74.3, 74.4, 74.5, 74.6],
  exports: [12.4, 13.1, 13.8, 14.6, 15.2, 13.9, 15.8, 16.9, 17.6, 18.2, 18.9],
  imports: [14.8, 15.5, 16.2, 17.1, 17.8, 16.4, 18.2, 19.4, 20.1, 20.7, 21.3],
};

// GDP per capita in US$, derived from GDP and population so the two agree.
export const GDP_PER_CAPITA = SERIES.gdp.map(
  (g, i) => Math.round((g * 1000) / SERIES.population[i]),
);

// Headline indicators shown on the home page (latest year: 2025).
export const HEADLINES = [
  {
    id: 'population', label: 'Population', value: '8.41m', change: '+0.7%',
    changeNote: 'on 2024', detail: '2025 mid-year estimate', spark: SERIES.population,
    format: (v) => v.toFixed(2) + 'm',
  },
  {
    id: 'gdp', label: 'GDP', value: '$62.4bn', change: '+3.8%',
    changeNote: 'real growth, 2025', detail: '$7,417 per person', spark: SERIES.gdp,
    format: (v) => '$' + v.toFixed(1) + 'bn',
  },
  {
    id: 'inflation', label: 'Inflation (CPI)', value: '4.2%', change: '-0.5 pts',
    changeNote: 'on 2024', detail: 'October 2026: 4.0%', spark: SERIES.inflation,
    format: (v) => v.toFixed(1) + '%',
  },
  {
    id: 'unemployment', label: 'Unemployment', value: '6.8%', change: '-0.2 pts',
    changeNote: 'on 2024', detail: 'Q3 2026: 6.6%', spark: SERIES.unemployment,
    format: (v) => v.toFixed(1) + '%',
  },
  {
    id: 'life', label: 'Life expectancy', value: '74.6 yrs', change: '+0.1 yrs',
    changeNote: 'on 2024', detail: 'Women 77.2 · Men 72.1', spark: SERIES.lifeExpectancy,
    format: (v) => v.toFixed(1) + ' yrs',
  },
  {
    id: 'trade', label: 'Exports', value: '$18.9bn', change: '+3.8%',
    changeNote: 'on 2024', detail: 'Trade balance: −$2.4bn', spark: SERIES.exports,
    format: (v) => '$' + v.toFixed(1) + 'bn',
  },
];

// GDP by sector, 2025 (% of gross value added).
export const SECTORS = [
  { name: 'Services', share: 58.2 },
  { name: 'Industry', share: 26.9 },
  { name: 'Agriculture & fishing', share: 14.9 },
];

// Population by region, 2025 (thousands). Sums to 8,412 thousand.
// Shares shown elsewhere divide by 84.12 — the total in hundreds of
// thousands — so population / 84.12 gives the percentage share.
export const REGIONS = [
  { name: 'Aldgate', population: 2140, density: 412, urban: 88.4, capital: 'Aldgate City' },
  { name: 'Branton', population: 1860, density: 238, urban: 81.2, capital: 'Branton' },
  { name: 'Caerwyn', population: 1420, density: 96, urban: 64.7, capital: 'Caerwyn' },
  { name: 'Dunmere', population: 1180, density: 74, urban: 58.9, capital: 'Dunmere' },
  { name: 'Eastvale', population: 960, density: 61, urban: 52.3, capital: 'Eastvale' },
  { name: 'Fellshore', population: 852, density: 48, urban: 47.8, capital: 'Port Fell' },
];

// Population by age group, 2025 (% of population).
export const AGE_GROUPS = [
  { group: '0–14', share: 22.4 },
  { group: '15–24', share: 16.8 },
  { group: '25–44', share: 28.6 },
  { group: '45–64', share: 20.7 },
  { group: '65+', share: 11.5 },
];

// Health indicators, 2025.
export const HEALTH = [
  { label: 'Life expectancy at birth', value: '74.6 years', note: 'Women 77.2 · Men 72.1' },
  { label: 'Infant mortality', value: '9.8 per 1,000 live births', note: 'Down from 12.4 in 2015' },
  { label: 'Physicians', value: '2.9 per 1,000 people', note: '24,400 registered physicians' },
  { label: 'Hospital beds', value: '3.4 per 1,000 people', note: '28,600 beds nationwide' },
  { label: 'Health spending', value: '6.1% of GDP', note: '$3.8bn in 2025' },
  { label: 'Smoking prevalence (adults)', value: '18.2%', note: 'Men 24.6% · Women 12.1%' },
];

// Education indicators, 2025/26 school year.
export const EDUCATION = [
  { label: 'Adult literacy', value: '96.4%', note: 'Ages 15 and over' },
  { label: 'Primary enrolment (net)', value: '98.7%', note: '1.21m pupils' },
  { label: 'Secondary enrolment (net)', value: '91.2%', note: '1.04m pupils' },
  { label: 'Tertiary enrolment (gross)', value: '54.8%', note: '412,000 students' },
  { label: 'Pupil–teacher ratio, primary', value: '24 : 1', note: '50,400 primary teachers' },
  { label: 'Education spending', value: '4.8% of GDP', note: '$3.0bn in 2025' },
];

// Trade partners, 2025 (US$ billions, share of total exports).
export const PARTNERS = [
  { name: 'Ostara', exports: 4.12, imports: 4.68 },
  { name: 'Velka', exports: 3.28, imports: 3.41 },
  { name: 'Norland', exports: 2.74, imports: 2.96 },
  { name: 'Sardia', exports: 2.21, imports: 2.53 },
  { name: 'Ildar', exports: 1.86, imports: 1.74 },
  { name: 'Other partners', exports: 4.69, imports: 5.98 },
];

// Latest statistical releases.
export const RELEASES = [
  { date: '2026-11-25', title: 'Consumer Price Index — October 2026', topic: 'Economy', summary: 'Annual inflation eased to 4.0% in October, from 4.2% in September, as food prices rose more slowly.' },
  { date: '2026-11-18', title: 'Labour Force Survey — Q3 2026', topic: 'People', summary: 'Unemployment fell to 6.6% in the third quarter; employment rose by 41,000 on the quarter.' },
  { date: '2026-11-12', title: 'Gross Domestic Product — Q3 2026, first estimate', topic: 'Economy', summary: 'GDP grew 0.9% on the quarter and 3.6% on the year, led by services and construction.' },
  { date: '2026-11-05', title: 'Population Estimates 2025', topic: 'People', summary: 'Meridia’s population reached 8.41 million at mid-2025, up 0.7% on the year.' },
  { date: '2026-10-28', title: 'Trade in Goods — September 2026', topic: 'Trade', summary: 'Exports of $1.62bn and imports of $1.81bn left a goods deficit of $0.19bn in September.' },
  { date: '2026-10-21', title: 'Education Statistics 2025/26', topic: 'Education', summary: 'Primary enrolment reached 98.7% and tertiary enrolment 54.8% in the new school year.' },
  { date: '2026-10-14', title: 'Health Accounts 2025', topic: 'Health', summary: 'Health spending was 6.1% of GDP in 2025, $452 per person, up 5.2% in real terms.' },
  { date: '2026-10-07', title: 'Regional GDP 2024', topic: 'Economy', summary: 'Aldgate produced 34.1% of national GDP in 2024; Fellshore grew fastest, at 5.2%.' },
  { date: '2026-09-30', title: 'Consumer Price Index — September 2026', topic: 'Economy', summary: 'Annual inflation was 4.2% in September, unchanged from August.' },
  { date: '2026-09-23', title: 'Vital Statistics 2025', topic: 'Health', summary: 'Births 118,400, deaths 71,200; life expectancy at birth 74.6 years.' },
];

export const RELEASE_TOPICS = ['All', 'Economy', 'People', 'Health', 'Education', 'Trade'];

// Key figures table rows: one row per year, used by the data explorer.
export function yearRows() {
  return YEARS.map((year, i) => ({
    year,
    population: SERIES.population[i],
    gdp: SERIES.gdp[i],
    gdpPerCapita: GDP_PER_CAPITA[i],
    gdpGrowth: SERIES.gdpGrowth[i],
    inflation: SERIES.inflation[i],
    unemployment: SERIES.unemployment[i],
    lifeExpectancy: SERIES.lifeExpectancy[i],
    exports: SERIES.exports[i],
    imports: SERIES.imports[i],
  }));
}
