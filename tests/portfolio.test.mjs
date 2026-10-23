import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const js = readFileSync(join(root, 'script.js'), 'utf8');
const css = readFileSync(join(root, 'styles.css'), 'utf8');

test('homepage exposes every project without relying on JavaScript', () => {
  assert.equal((html.match(/data-project-card(?=\s|>)/g) || []).length, 6);
  for (const project of ['quadmates', 'transitops', 'transitops-m', 'neurosim', 'vision', 'staffflow']) {
    assert.ok(html.includes('projects/' + project + '.html'), project + ' case study must be linked');
  }
  assert.ok(html.includes('id="content"'));
  assert.ok(html.includes('id="projects"'));
  assert.ok(html.includes('id="contact"'));
  assert.ok(html.includes('href="resumes.html"'));
});

test('local resources and anchor targets resolve', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'duplicate id on homepage');
  const targets = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  for (const target of targets) {
    if (target.startsWith('#')) {
      assert.ok(ids.includes(target.slice(1)), 'unknown anchor: ' + target);
      continue;
    }
    if (/^(https?:|mailto:|data:)/.test(target)) continue;
    const url = target.split(/[?#]/)[0];
    assert.ok(existsSync(join(root, url)), 'missing relative resource: ' + target);
  }
});

test('accessible semantics and reduced-motion styles remain present', () => {
  assert.equal((html.match(/role="tab"/g) || []).length, 4);
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 4);
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(html.includes('class="skip-link"'));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes('@media (max-width: 600px)'));
  const outboundTags = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || [];
  assert.ok(outboundTags.length > 0);
  outboundTags.forEach(tag => assert.match(tag, /rel="[^"]*noopener noreferrer/));
});

function fakeElement(attributes = {}, dataset = {}) {
  const listeners = {};
  const classes = new Set();
  const element = {
    dataset,
    attributes: { ...attributes },
    hidden: false,
    tabIndex: 0,
    href: '',
    textContent: '',
    classList: {
      add(name) { classes.add(name); },
      toggle(name, value) {
        if (value === undefined ? !classes.has(name) : value) classes.add(name);
        else classes.delete(name);
      },
      contains(name) { return classes.has(name); }
    },
    setAttribute(name, value) { element.attributes[name] = String(value); },
    getAttribute(name) { return element.attributes[name] ?? null; },
    removeAttribute(name) { delete element.attributes[name]; },
    addEventListener(name, callback) { (listeners[name] ||= []).push(callback); },
    dispatch(name, extra = {}) {
      const event = { key: extra.key, preventDefault() { this.prevented = true; } };
      (listeners[name] || []).forEach(callback => callback(event));
      return event;
    },
    querySelectorAll() { return []; },
    focus() { element.focused = true; }
  };
  return element;
}

test('interactive explorer, filters and mobile navigation preserve semantics', () => {
  const tabNames = ['quadmates','transit','staff','neurosim'];
  const tabs = tabNames.map(name => fakeElement({
    'aria-controls':'panel-' + name,
    'aria-selected':name === 'quadmates' ? 'true' : 'false'
  }, {scene:name,case:'projects/' + name + '.html', live:name === 'neurosim' ? '' : 'https://example.com'}));
  tabs[0].classList.add('active');
  const panels = tabNames.map((name,i) => {
    const item = fakeElement();
    item.hidden = i !== 0;
    return item;
  });
  const elements = Object.fromEntries(tabNames.map((name,i) => ['panel-' + name,panels[i]]));
  for (const id of ['consoleTitle','consoleCopy','consoleCase','consoleLive','resultsCount','year','readingProgress','projectGrid']) {
    elements[id] = fakeElement();
  }
  elements.readingProgress.style = {};
  const menu = fakeElement();
  menu.hidden = true;
  const menuToggle = fakeElement({'aria-expanded':'false'});
  const menuLinks = [fakeElement(),fakeElement()];
  menu.querySelectorAll = () => menuLinks;
  elements.mobileNav = menu;
  elements.menuToggle = menuToggle;
  const filters = ['all','product','simulation','autonomy'].map(filter => fakeElement({}, {filter}));
  const cards = ['product','simulation','product','autonomy','simulation','autonomy']
    .map(category => fakeElement({}, {category}));
  const document = {
    documentElement: { classList:{ add() {} },scrollHeight: 2000 },
    getElementById(id) { return elements[id] || null; },
    querySelectorAll(selector) {
      if (selector === '.console-tab') return tabs;
      if (selector === '[data-filter]') return filters;
      if (selector === '[data-project-card]') return cards;
      return [];
    },
    addEventListener() {}
  };
  const window = {
    innerWidth: 390, innerHeight: 1000, scrollY: 0,
    addEventListener() {},
    requestAnimationFrame(callback) { callback(); }
  };
  vm.runInNewContext(js, { document, window, Date });
  assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
  tabs[3].dispatch('click');
  assert.equal(tabs[3].getAttribute('aria-selected'), 'true');
  assert.equal(panels[3].hidden, false);
  assert.equal(panels[0].hidden, true);
  assert.equal(elements.consoleLive.hidden, true, 'no invented live NeuroSim URL');
  tabs[3].dispatch('keydown', {key:'Home'});
  assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
  filters[3].dispatch('click');
  assert.equal(cards.filter(card => !card.hidden).length, 2);
  assert.equal(elements.projectGrid.classList.contains('is-filtered'), true);
  assert.equal(elements.resultsCount.textContent, 'Showing 2 projects');
  assert.equal(filters[3].getAttribute('aria-pressed'),'true');
  filters[0].dispatch('click');
  assert.equal(cards.filter(card => !card.hidden).length, 6);
  menuToggle.dispatch('click');
  assert.equal(menu.hidden, false);
  assert.equal(menuToggle.getAttribute('aria-expanded'),'true');
  menuLinks[0].dispatch('click');
  assert.equal(menu.hidden,true);
});
