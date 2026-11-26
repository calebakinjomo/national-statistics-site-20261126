// Router and wiring for the Meridia statistics portal. Hash routes only, no
// network: every page is rendered from the data in data.js.
import { lineChart, barChart, hbarChart, sparkline, COLORS } from './charts.js';
import {
  YEARS, SERIES, GDP_PER_CAPITA, REGIONS, AGE_GROUPS, SECTORS, PARTNERS,
  HEADLINES, RELEASES, yearRows,
  homeView, economyView, peopleView, healthView, educationView, tradeView,
  dataView, releasesView,
} from './views.js';

const ROUTES = {
  '': homeView, economy: economyView, people: peopleView, health: healthView,
  education: educationView, trade: tradeView, data: dataView, releases: releasesView,
};
const TITLES = {
  '': 'Meridia in numbers', economy: 'The economy', people: 'The people',
  health: 'Health', education: 'Education', trade: 'Trade',
  data: 'Key figures, 2015–2025', releases: 'Latest releases',
};

const app = document.getElementById('app');
const fmtMoney = (v) => '$' + v.toFixed(1) + 'bn';
const fmtPct = (v) => v.toFixed(1) + '%';
const fmtPlain = (v) => String(Math.round(v));
const fmtDollars = (v) => '$' + Math.round(v).toLocaleString('en-US');

function drawSparklines() {
  for (const h of HEADLINES) {
    const canvas = document.querySelector(`canvas[data-spark="${h.id}"]`);
    if (canvas) sparkline(canvas, h.spark, COLORS.blue);
  }
}

function gdpChart(canvasId, mode) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (mode === 'percapita') {
    lineChart(canvas, YEARS, [{ label: 'GDP per person', values: GDP_PER_CAPITA, color: COLORS.teal }], fmtDollars);
  } else if (mode === 'growth') {
    lineChart(canvas, YEARS, [{ label: 'Real GDP growth', values: SERIES.gdpGrowth, color: COLORS.gold }], fmtPct);
  } else {
    lineChart(canvas, YEARS, [{ label: 'GDP', values: SERIES.gdp, color: COLORS.blue }], fmtMoney);
  }
}

function pricesChart(canvasId, mode) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (mode === 'unemployment') {
    lineChart(canvas, YEARS, [{ label: 'Unemployment', values: SERIES.unemployment, color: COLORS.red }], fmtPct);
  } else {
    lineChart(canvas, YEARS, [{ label: 'Inflation', values: SERIES.inflation, color: COLORS.gold }], fmtPct);
  }
}

function drawChartsFor(route) {
  if (route === '') {
    gdpChart('home-gdp', 'gdp');
    const regions = document.getElementById('home-regions');
    if (regions) {
      barChart(regions, REGIONS.map((r) => r.name), REGIONS.map((r) => r.population),
        (v) => (v / 1000).toFixed(2) + 'm', COLORS.teal);
    }
  }
  if (route === 'economy') {
    gdpChart('econ-gdp', 'gdp');
    pricesChart('econ-prices', 'inflation');
    const sectors = document.getElementById('econ-sectors');
    if (sectors) {
      hbarChart(sectors, SECTORS.map((s) => ({ label: s.name, value: s.share })),
        (v) => v.toFixed(1) + '%', COLORS.blue);
    }
  }
  if (route === 'people') {
    const canvas = document.getElementById('people-pop');
    if (canvas) {
      lineChart(canvas, YEARS, [{ label: 'Population', values: SERIES.population, color: COLORS.blue }],
        (v) => v.toFixed(2) + 'm');
    }
    const age = document.getElementById('people-age');
    if (age) {
      hbarChart(age, AGE_GROUPS.map((a) => ({ label: a.group, value: a.share })),
        (v) => v.toFixed(1) + '%', COLORS.teal);
    }
  }
  if (route === 'health') {
    const canvas = document.getElementById('health-life');
    if (canvas) {
      lineChart(canvas, YEARS, [{ label: 'Life expectancy', values: SERIES.lifeExpectancy, color: COLORS.teal }],
        (v) => v.toFixed(1) + ' yrs');
    }
    const infant = document.getElementById('health-infant');
    if (infant) {
      barChart(infant, [2015, 2017, 2019, 2021, 2023, 2025],
        [12.4, 11.6, 11.0, 10.6, 10.1, 9.8], (v) => v.toFixed(1), COLORS.blue);
    }
  }
  if (route === 'education') {
    const enrol = document.getElementById('edu-enrol');
    if (enrol) {
      barChart(enrol, ['Primary', 'Secondary', 'Tertiary'], [98.7, 91.2, 54.8],
        (v) => v.toFixed(1) + '%', COLORS.teal);
    }
  }
  if (route === 'trade') {
    const canvas = document.getElementById('trade-flow');
    if (canvas) {
      lineChart(canvas, YEARS, [
        { label: 'Exports', values: SERIES.exports, color: COLORS.teal },
        { label: 'Imports', values: SERIES.imports, color: COLORS.blue },
      ], fmtMoney);
    }
    const partners = document.getElementById('trade-partners');
    if (partners) {
      barChart(partners, PARTNERS.map((p) => p.name), PARTNERS.map((p) => p.exports),
        fmtMoney, COLORS.blue);
    }
  }
}

// Chart tabs: each .tab switches the chart drawn in its card.
function wireTabs(route) {
  document.querySelectorAll('[data-chart-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('.tabs');
      group.querySelectorAll('.tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      const mode = button.dataset.chartTab;
      const card = button.closest('.chart-card');
      const canvas = card.querySelector('canvas');
      if (route === '' || route === 'economy') {
        if (canvas.id === 'home-gdp' || canvas.id === 'econ-gdp') gdpChart(canvas.id, mode);
        if (canvas.id === 'econ-prices') pricesChart(canvas.id, mode);
      }
      if (route === 'people' && canvas.id === 'people-pop') {
        if (mode === 'life') {
          lineChart(canvas, YEARS, [{ label: 'Life expectancy', values: SERIES.lifeExpectancy, color: COLORS.teal }],
            (v) => v.toFixed(1) + ' yrs');
        } else {
          lineChart(canvas, YEARS, [{ label: 'Population', values: SERIES.population, color: COLORS.blue }],
            (v) => v.toFixed(2) + 'm');
        }
      }
      if (route === 'health' && canvas.id === 'health-life') {
        lineChart(canvas, YEARS, [{ label: 'Life expectancy', values: SERIES.lifeExpectancy, color: COLORS.teal }],
          (v) => v.toFixed(1) + ' yrs');
      }
      if (route === 'trade' && canvas.id === 'trade-flow') {
        if (mode === 'exports') {
          lineChart(canvas, YEARS, [{ label: 'Exports', values: SERIES.exports, color: COLORS.teal }], fmtMoney);
        } else if (mode === 'imports') {
          lineChart(canvas, YEARS, [{ label: 'Imports', values: SERIES.imports, color: COLORS.blue }], fmtMoney);
        } else {
          lineChart(canvas, YEARS, [
            { label: 'Exports', values: SERIES.exports, color: COLORS.teal },
            { label: 'Imports', values: SERIES.imports, color: COLORS.blue },
          ], fmtMoney);
        }
      }
    });
  });
}

function wireRegionSelect() {
  const select = document.getElementById('region-select');
  const detail = document.getElementById('region-detail');
  const table = document.getElementById('regions-table');
  if (!select || !detail) return;
  const show = (index) => {
    const r = REGIONS[index];
    detail.textContent = `${r.name} — population ${r.population.toLocaleString('en-US')},000 ` +
      `(${(r.population / 84.12).toFixed(1)}% of Meridia), density ${r.density} people per km², ` +
      `${r.urban.toFixed(1)}% urban. Regional capital: ${r.capital}.`;
    if (table) {
      table.querySelectorAll('tbody tr').forEach((row) => {
        row.classList.toggle('highlight', row.dataset.region === r.name);
      });
    }
  };
  select.addEventListener('change', () => show(Number(select.value)));
}

function sortState(table) {
  const headers = table.querySelectorAll('th[data-sort]');
  headers.forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      const body = table.querySelector('tbody');
      const rows = [...body.querySelectorAll('tr')];
      const ascending = th.dataset.dir !== 'asc';
      headers.forEach((h) => { delete h.dataset.dir; h.textContent = h.textContent.replace(/ [▲▼]$/, ''); });
      th.dataset.dir = ascending ? 'asc' : 'desc';
      th.textContent = th.textContent + (ascending ? ' ▲' : ' ▼');
      const index = [...th.parentElement.children].indexOf(th);
      rows.sort((a, b) => {
        const av = Number(a.children[index].textContent.replace(/[^0-9.\-]/g, '')) || a.children[index].textContent;
        const bv = Number(b.children[index].textContent.replace(/[^0-9.\-]/g, '')) || b.children[index].textContent;
        if (typeof av === 'number' && typeof bv === 'number') return ascending ? av - bv : bv - av;
        return ascending ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
      rows.forEach((row) => body.appendChild(row));
    });
  });
}

function wireExplorer() {
  const table = document.getElementById('explorer-table');
  if (!table) return;
  const search = document.getElementById('explorer-search');
  const from = document.getElementById('explorer-from');
  const to = document.getElementById('explorer-to');
  const count = document.getElementById('explorer-count');
  const rows = yearRows();
  const apply = () => {
    const q = (search.value || '').trim().toLowerCase();
    const lo = Number(from.value);
    const hi = Number(to.value);
    let shown = 0;
    table.querySelectorAll('tbody tr').forEach((tr, i) => {
      const r = rows[i];
      const ok = r.year >= lo && r.year <= hi &&
        (!q || tr.textContent.toLowerCase().includes(q));
      tr.style.display = ok ? '' : 'none';
      if (ok) shown += 1;
    });
    count.textContent = `${shown} year${shown === 1 ? '' : 's'} shown`;
  };
  search.addEventListener('input', apply);
  from.addEventListener('change', apply);
  to.addEventListener('change', apply);
  sortState(table);
  document.getElementById('explorer-download').addEventListener('click', () => {
    const header = ['Year', 'Population (m)', 'GDP ($bn)', 'GDP per person ($)', 'GDP growth (%)',
      'Inflation (%)', 'Unemployment (%)', 'Life expectancy (yrs)', 'Exports ($bn)', 'Imports ($bn)'];
    const visible = rows.filter((r) => r.year >= Number(from.value) && r.year <= Number(to.value));
    const lines = [header.join(',')].concat(visible.map((r) => [
      r.year, r.population.toFixed(3), r.gdp.toFixed(1), r.gdpPerCapita,
      r.gdpGrowth.toFixed(1), r.inflation.toFixed(1), r.unemployment.toFixed(1),
      r.lifeExpectancy.toFixed(1), r.exports.toFixed(1), r.imports.toFixed(1),
    ].join(',')));
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meridia-key-figures-2015-2025.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

function wireReleases() {
  const list = document.getElementById('release-list');
  if (!list) return;
  const count = document.getElementById('release-count');
  document.querySelectorAll('[data-topic]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-topic]').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const topic = chip.dataset.topic;
      const items = [...list.children];
      let shown = 0;
      items.forEach((item) => {
        const tag = item.querySelector('.tag').textContent;
        const ok = topic === 'All' || tag === topic;
        item.style.display = ok ? '' : 'none';
        if (ok) shown += 1;
      });
      count.textContent = `${shown} release${shown === 1 ? '' : 's'} shown.`;
    });
  });
}

function render() {
  const route = (location.hash || '#/').replace(/^#\/?/, '').split('/')[0];
  const view = ROUTES[route] || homeView;
  const key = ROUTES[route] ? route : '';
  app.innerHTML = view();
  document.title = `Meridia National Statistics — ${TITLES[key]}`;
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href').replace(/^#\/?/, '');
    a.classList.toggle('active', href === key);
    if (href === key) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  drawSparklines();
  drawChartsFor(key);
  wireTabs(key);
  wireRegionSelect();
  wireExplorer();
  wireReleases();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
