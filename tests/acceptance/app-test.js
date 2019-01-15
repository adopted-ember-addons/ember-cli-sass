import { module, test } from 'qunit';
import { visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

let getCSS = function(el, prop) {
  let style = window.getComputedStyle(el);
  return style.getPropertyValue(prop);
}

module('Acceptance | app', function(hooks) {
  setupApplicationTest(hooks);

  test('app.scss is loaded', async function(assert) {
    await visit('/');
  
    assert.ok(getCSS(find('#app-css'), 'font-family'));
  });
  test('outputPaths are supported', async function(assert) {
    await visit('/');
  
    assert.ok(getCSS(find('#output-path-css'), 'font-family'));
  });
  test('includePaths are supported', async function(assert) {
    await visit('/');
  
    assert.ok(getCSS(find('#include-path-css'), 'animation-duration'));
  });
  test('addons can inject styles', async function(assert) {
    await visit('/');
  
    assert.ok(getCSS(find('h1'), 'font-family'));
  });
});


