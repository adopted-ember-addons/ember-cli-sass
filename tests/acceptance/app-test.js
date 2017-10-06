import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | app');

test('app.scss is loaded', function(assert) {
  visit('/');

  andThen(() => {
    assert.ok(find('#app-css').css('font-family'));
  });
});
test('outputPaths are supported', function(assert) {
  visit('/');

  andThen(() => {
    assert.ok(find('#output-path-css').css('font-family'));
  });
});
test('includePaths are supported', function(assert) {
  visit('/');

  andThen(() => {
    assert.ok(find('#include-path-css').css('animation-duration'));
  });
});
test('addons can inject styles', function(assert) {
  visit('/');

  andThen(() => {
    assert.ok(find('h1').css('font-family'));
  });
});
