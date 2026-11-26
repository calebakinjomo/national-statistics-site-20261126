// Page views for the Meridia statistics portal. Each view returns HTML; the
// router in main.js renders it and wires up the charts and controls.
import {
  COUNTRY, YEARS, SERIES, GDP_PER_CAPITA, HEADLINES, SECTORS, REGIONS,
  AGE_GROUPS, HEALTH, EDUCATION, PARTNERS, RELEASES, RELEASE_TOPICS, yearRows,
} from './data.js';
const fmtInt = (v) => v.toLocaleString('en-US');
const fmtMoney = (v) => '$' + v.toFixed(1) + 'bn';
const fmtPct = (v) => v.toFixed(1) + '%';

function kpiCards() {
  return HEADLINES.map((h) => `
    <article class="kpi">
      <div class="kpi-label">${h.label}</div>
      <div class="kpi-value">${h.value}</div>
      <div class="kpi-change"><span class="delta good">${h.change}</span> ${h.changeNote}</div>
      <canvas class="spark" data-spark="${h.id}" width="220" height="36" aria-hidden="true"></canvas>
      <div class="kpi-detail">${h.detail}</div>
    </article>`).join('');
}

function releaseItem(r) {
  const d = new Date(r.date + 'T00:00:00');
  const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return `
    <article class="release">
      <div class="release-date">${label}</div>
      <h3><a href="#/releases">${r.title}</a></h3>
      <p>${r.summary}</p>
      <span class="tag">${r.topic}</span>
    </article>`;
}

function chartCard(id, title, subtitle, tabs, height) {
  const tabHtml = tabs
    ? `<div class="tabs" role="tablist">${tabs.map((t, i) =>
        `<button type="button" class="tab${i === 0 ? ' active' : ''}" data-chart-tab="${t.id}" role="tab" aria-selected="${i === 0}">${t.label}</button>`).join('')}</div>`
    : '';
  return `
    <section class="card chart-card">
      <div class="card-head"><h2>${title}</h2>${tabHtml}</div>
      <p class="card-sub">${subtitle}</p>
      <div class="chart-wrap"><canvas id="${id}" data-height="${height || 280}"></canvas></div>
      <p class="card-note">Hover a point for the exact value. Source: Meridia National Statistics Office.</p>
    </section>`;
}

function statTable(rows) {
  return `<table class="data-table"><tbody>${rows.map((r) =>
    `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td class="muted">${r[2] || ''}</td></tr>`).join('')}</tbody></table>`;
}

export function homeView() {
  return `
  <section class="hero">
    <div class="hero-text">
      <p class="eyebrow">National Statistics Office · ${COUNTRY.fullName}</p>
      <h1>Meridia in numbers</h1>
      <p class="lede">Official statistics on the people, the economy and the society of Meridia —
        8.41 million people, a $62.4 billion economy, and the stories the numbers tell.</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/data">Explore the data</a>
        <a class="btn" href="#/releases">Latest releases</a>
      </div>
    </div>
    <div class="hero-side">
      <div class="hero-stat"><span>Next release</span><strong>Consumer Price Index — November 2026</strong><em>10 December 2026</em></div>
      <div class="hero-stat"><span>Capital</span><strong>Aldgate City</strong><em>Population 1.86m</em></div>
      <div class="hero-stat"><span>Currency</span><strong>Merid (MD)</strong><em>MD 14.6 = US$1</em></div>
    </div>
  </section>

  <section class="kpi-grid" aria-label="Headline indicators">${kpiCards()}</section>

  <div class="grid-2">
    ${chartCard('home-gdp', 'Gross domestic product', 'Real GDP and GDP per person, 2015–2025. The economy grew 3.8% in 2025 after the 2020 contraction.',
      [{ id: 'gdp', label: 'GDP ($bn)' }, { id: 'percapita', label: 'GDP per person ($)' }, { id: 'growth', label: 'Growth (%)' }])}
    <section class="card">
      <div class="card-head"><h2>Latest releases</h2><a class="card-link" href="#/releases">All releases →</a></div>
      ${RELEASES.slice(0, 4).map(releaseItem).join('')}
    </section>
  </div>

  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>Population by region, 2025</h2><a class="card-link" href="#/people">People →</a></div>
      <p class="card-sub">Aldgate, home to the capital, holds just over a quarter of Meridia’s people.</p>
      <div class="chart-wrap"><canvas id="home-regions" data-height="240"></canvas></div>
    </section>
    <section class="card">
      <div class="card-head"><h2>At a glance</h2></div>
      ${statTable([
        ['Area', '184,200 km²', '6 regions'],
        ['Population density', '46 people per km²', 'Aldgate 412 · Fellshore 48'],
        ['Median age', '32.4 years', 'Up from 29.8 in 2015'],
        ['Urban population', '71.3%', '5.99 million people'],
        ['Labour force', '4.62 million', 'Participation rate 68.4%'],
        ['Exports of goods &amp; services', '$18.9bn', '30.3% of GDP'],
      ])}
    </section>
  </div>

  <p class="disclaimer">All figures on this site are illustrative sample data for the fictional Republic of Meridia,
  published to demonstrate a national statistics portal. They describe no real country.</p>`;
}

export function economyView() {
  return `
  <section class="page-head">
    <p class="eyebrow">Section · Economy</p>
    <h1>The economy</h1>
    <p class="lede">GDP, prices and jobs: Meridia’s economy grew 3.8% in 2025, inflation eased to 4.2%,
    and unemployment fell to its lowest in a decade.</p>
  </section>
  <section class="kpi-grid small" aria-label="Economy indicators">
    <article class="kpi"><div class="kpi-label">GDP, 2025</div><div class="kpi-value">$62.4bn</div><div class="kpi-detail">Real growth 3.8%</div></article>
    <article class="kpi"><div class="kpi-label">GDP per person</div><div class="kpi-value">$7,417</div><div class="kpi-detail">Up $214 on 2024</div></article>
    <article class="kpi"><div class="kpi-label">Inflation (CPI)</div><div class="kpi-value">4.2%</div><div class="kpi-detail">October 2026: 4.0%</div></article>
    <article class="kpi"><div class="kpi-label">Unemployment</div><div class="kpi-value">6.8%</div><div class="kpi-detail">Q3 2026: 6.6%</div></article>
  </section>
  <div class="grid-2">
    ${chartCard('econ-gdp', 'GDP and growth', 'Gross domestic product in current US dollars, 2015–2025.',
      [{ id: 'gdp', label: 'GDP ($bn)' }, { id: 'percapita', label: 'GDP per person ($)' }, { id: 'growth', label: 'Growth (%)' }])}
    ${chartCard('econ-prices', 'Prices and jobs', 'Consumer price inflation and the unemployment rate, 2015–2025.',
      [{ id: 'inflation', label: 'Inflation (%)' }, { id: 'unemployment', label: 'Unemployment (%)' }])}
  </div>
  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>GDP by sector, 2025</h2></div>
      <p class="card-sub">Share of gross value added. Services dominate; agriculture still employs one in five workers.</p>
      <div class="chart-wrap"><canvas id="econ-sectors" data-height="130"></canvas></div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Key economic indicators</h2></div>
      ${statTable([
        ['Government debt', '41.2% of GDP', '$25.7bn'],
        ['Budget balance', '−1.8% of GDP', 'Deficit $1.1bn'],
        ['Policy interest rate', '5.25%', 'Held since June 2026'],
        ['Exchange rate', 'MD 14.6 per US$1', 'Average, 2025'],
        ['Foreign reserves', '$9.4bn', '6.1 months of imports'],
        ['Investment (gross fixed capital)', '22.6% of GDP', '$14.1bn'],
      ])}
    </section>
  </div>`;
}

export function peopleView() {
  return `
  <section class="page-head">
    <p class="eyebrow">Section · People</p>
    <h1>The people</h1>
    <p class="lede">8.41 million people live in Meridia’s six regions. The population is young —
    a median age of 32.4 — and growing by about 0.7% a year.</p>
  </section>
  <div class="grid-2">
    ${chartCard('people-pop', 'Population growth', 'Mid-year population, 2015–2025, and the annual growth rate.',
      [{ id: 'pop', label: 'Population (m)' }, { id: 'life', label: 'Life expectancy (yrs)' }])}
    <section class="card">
      <div class="card-head"><h2>Age structure, 2025</h2></div>
      <p class="card-sub">Share of the population in each age group. Children under 15 are 22.4% of Meridia.</p>
      <div class="chart-wrap"><canvas id="people-age" data-height="200"></canvas></div>
    </section>
  </div>
  <section class="card">
    <div class="card-head"><h2>Regions of Meridia</h2>
      <label class="select-label">Highlight a region
        <select id="region-select">${REGIONS.map((r, i) => `<option value="${i}">${r.name}</option>`).join('')}</select>
      </label>
    </div>
    <p class="card-sub">Population, density and urban share by region, 2025. Choose a region to see its detail.</p>
    <div class="table-wrap"><table class="data-table sortable" id="regions-table">
      <thead><tr><th>Region</th><th>Population</th><th>Share</th><th>Density (per km²)</th><th>Urban</th><th>Regional capital</th></tr></thead>
      <tbody>${REGIONS.map((r) => `<tr data-region="${r.name}"><td>${r.name}</td><td>${fmtInt(r.population * 1000)}</td><td>${(r.population / 84.12).toFixed(1)}%</td><td>${r.density}</td><td>${r.urban.toFixed(1)}%</td><td>${r.capital}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="card-note" id="region-detail">Aldgate — population 2,140,000 (25.4% of Meridia), density 412 people per km², 88.4% urban. Regional capital: Aldgate City.</p>
  </section>`;
}

export function healthView() {
  return `
  <section class="page-head">
    <p class="eyebrow">Section · Health</p>
    <h1>Health</h1>
    <p class="lede">Meridians live longer than ever: life expectancy reached 74.6 years in 2025,
    and infant mortality has fallen by a fifth since 2015.</p>
  </section>
  <div class="grid-2">
    ${chartCard('health-life', 'Life expectancy', 'Life expectancy at birth, 2015–2025. Women live 5.1 years longer than men on average.',
      [{ id: 'life', label: 'All (yrs)' }])}
    <section class="card">
      <div class="card-head"><h2>Health in 2025</h2></div>
      ${statTable(HEALTH.map((h) => [h.label, h.value, h.note]))}
    </section>
  </div>
  <section class="card">
    <div class="card-head"><h2>Health spending and outcomes</h2></div>
    <p class="card-sub">Health spending was 6.1% of GDP in 2025. The chart shows the two series that matter most to families:
    how long people live, and how many infants survive their first year.</p>
    <div class="chart-wrap"><canvas id="health-infant" data-height="240"></canvas></div>
    <p class="card-note">Infant mortality, per 1,000 live births: 12.4 (2015) · 11.6 (2017) · 11.0 (2019) · 10.6 (2021) · 10.1 (2023) · 9.8 (2025). Source: Meridia National Statistics Office, Vital Statistics 2025.</p>
  </section>`;
}

export function educationView() {
  return `
  <section class="page-head">
    <p class="eyebrow">Section · Education</p>
    <h1>Education</h1>
    <p class="lede">Nearly every child in Meridia is in primary school, nine in ten finish secondary,
    and more than half of young adults now enter tertiary education.</p>
  </section>
  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>Enrolment, 2025/26</h2></div>
      <p class="card-sub">Net enrolment rates by level of education.</p>
      <div class="chart-wrap"><canvas id="edu-enrol" data-height="220"></canvas></div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Education in 2025/26</h2></div>
      ${statTable(EDUCATION.map((e) => [e.label, e.value, e.note]))}
    </section>
  </div>
  <section class="card">
    <div class="card-head"><h2>Students and teachers</h2></div>
    <p class="card-sub">Meridia’s schools, 2025/26 school year.</p>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Level</th><th>Schools</th><th>Students</th><th>Teachers</th><th>Pupil–teacher ratio</th></tr></thead>
      <tbody>
        <tr><td>Pre-primary</td><td>2,140</td><td>386,000</td><td>18,900</td><td>20 : 1</td></tr>
        <tr><td>Primary</td><td>4,820</td><td>1,210,000</td><td>50,400</td><td>24 : 1</td></tr>
        <tr><td>Secondary</td><td>1,960</td><td>1,040,000</td><td>57,800</td><td>18 : 1</td></tr>
        <tr><td>Tertiary</td><td>86</td><td>412,000</td><td>28,600</td><td>14 : 1</td></tr>
      </tbody>
    </table></div>
  </section>`;
}

export function tradeView() {
  const totalExports = PARTNERS.reduce((s, p) => s + p.exports, 0);
  return `
  <section class="page-head">
    <p class="eyebrow">Section · Trade</p>
    <h1>Trade</h1>
    <p class="lede">Meridia exported $18.9bn of goods and services in 2025 and imported $21.3bn.
    Ostara is its largest trading partner, taking 21.8% of exports.</p>
  </section>
  <section class="kpi-grid small" aria-label="Trade indicators">
    <article class="kpi"><div class="kpi-label">Exports, 2025</div><div class="kpi-value">$18.9bn</div><div class="kpi-detail">30.3% of GDP</div></article>
    <article class="kpi"><div class="kpi-label">Imports, 2025</div><div class="kpi-value">$21.3bn</div><div class="kpi-detail">34.1% of GDP</div></article>
    <article class="kpi"><div class="kpi-label">Trade balance</div><div class="kpi-value">−$2.4bn</div><div class="kpi-detail">Deficit narrowed from −$2.5bn</div></article>
    <article class="kpi"><div class="kpi-label">Largest partner</div><div class="kpi-value">Ostara</div><div class="kpi-detail">21.8% of exports</div></article>
  </section>
  <div class="grid-2">
    ${chartCard('trade-flow', 'Exports and imports', 'Trade in goods and services, US$ billions, 2015–2025.',
      [{ id: 'both', label: 'Exports vs imports' }, { id: 'exports', label: 'Exports' }, { id: 'imports', label: 'Imports' }])}
    <section class="card">
      <div class="card-head"><h2>Trading partners, 2025</h2></div>
      <p class="card-sub">Exports and imports by partner, US$ billions.</p>
      <div class="chart-wrap"><canvas id="trade-partners" data-height="240"></canvas></div>
    </section>
  </div>
  <section class="card">
    <div class="card-head"><h2>Trade by partner</h2></div>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Partner</th><th>Exports ($bn)</th><th>Share of exports</th><th>Imports ($bn)</th><th>Balance ($bn)</th></tr></thead>
      <tbody>${PARTNERS.map((p) => `<tr><td>${p.name}</td><td>${p.exports.toFixed(2)}</td><td>${(100 * p.exports / totalExports).toFixed(1)}%</td><td>${p.imports.toFixed(2)}</td><td>${(p.exports - p.imports).toFixed(2)}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="card-note">Totals may not sum due to rounding. Source: Meridia National Statistics Office, Trade in Goods — September 2026.</p>
  </section>`;
}

export function dataView() {
  const rows = yearRows();
  return `
  <section class="page-head">
    <p class="eyebrow">Data explorer</p>
    <h1>Key figures, 2015–2025</h1>
    <p class="lede">Every headline indicator in one table. Sort any column, search, or narrow the years —
    then download the table as a CSV file.</p>
  </section>
  <section class="card">
    <div class="explorer-controls">
      <label class="control">Search
        <input type="search" id="explorer-search" placeholder="e.g. 2020" aria-label="Search the table">
      </label>
      <label class="control">From year
        <select id="explorer-from">${YEARS.map((y) => `<option${y === 2015 ? ' selected' : ''}>${y}</option>`).join('')}</select>
      </label>
      <label class="control">To year
        <select id="explorer-to">${YEARS.map((y) => `<option${y === 2025 ? ' selected' : ''}>${y}</option>`).join('')}</select>
      </label>
      <button type="button" class="btn primary" id="explorer-download">Download CSV</button>
      <span class="control-note" id="explorer-count">${rows.length} years shown</span>
    </div>
    <div class="table-wrap"><table class="data-table sortable" id="explorer-table">
      <thead><tr>
        <th data-sort="year">Year</th><th data-sort="population">Population (m)</th>
        <th data-sort="gdp">GDP ($bn)</th><th data-sort="gdpPerCapita">GDP per person ($)</th>
        <th data-sort="gdpGrowth">GDP growth (%)</th><th data-sort="inflation">Inflation (%)</th>
        <th data-sort="unemployment">Unemployment (%)</th><th data-sort="lifeExpectancy">Life expectancy (yrs)</th>
        <th data-sort="exports">Exports ($bn)</th><th data-sort="imports">Imports ($bn)</th>
      </tr></thead>
      <tbody>${rows.map((r) => `<tr>
        <td>${r.year}</td><td>${r.population.toFixed(3)}</td><td>${r.gdp.toFixed(1)}</td>
        <td>${fmtInt(r.gdpPerCapita)}</td><td>${r.gdpGrowth.toFixed(1)}</td><td>${r.inflation.toFixed(1)}</td>
        <td>${r.unemployment.toFixed(1)}</td><td>${r.lifeExpectancy.toFixed(1)}</td>
        <td>${r.exports.toFixed(1)}</td><td>${r.imports.toFixed(1)}</td>
      </tr>`).join('')}</tbody>
    </table></div>
    <p class="card-note">Click a column heading to sort. GDP per person is GDP divided by population, so the columns always agree.
    Source: Meridia National Statistics Office. Figures are illustrative sample data for the fictional Republic of Meridia.</p>
  </section>`;
}

export function releasesView() {
  return `
  <section class="page-head">
    <p class="eyebrow">News</p>
    <h1>Latest releases</h1>
    <p class="lede">Every statistical release from the National Statistics Office, newest first.
    Filter by topic to find what you need.</p>
  </section>
  <div class="filter-chips" role="group" aria-label="Filter releases by topic">
    ${RELEASE_TOPICS.map((t, i) => `<button type="button" class="chip${i === 0 ? ' active' : ''}" data-topic="${t}">${t}</button>`).join('')}
  </div>
  <section class="release-list" id="release-list">
    ${RELEASES.map(releaseItem).join('')}
  </section>
  <p class="card-note" id="release-count">${RELEASES.length} releases shown.</p>`;
}

export { YEARS, SERIES, GDP_PER_CAPITA, REGIONS, AGE_GROUPS, SECTORS, PARTNERS, HEADLINES, RELEASES, yearRows, fmtMoney, fmtPct };
