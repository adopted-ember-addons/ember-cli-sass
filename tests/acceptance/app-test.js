import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | app');

test('app.scss is loaded', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok(!!this.$('#app-css').css('font-family'));
  });
});
test('outputPaths are supported', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok(!!this.$('#output-path-css').css('font-family'));
  });
});
test('includePaths are supported', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok(!!this.$('#include-path-css').css('animation-duration'));
  });
});
test('addons can inject styles', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok(!!this.$('h1').css('font-family'));
  });
});
