const test = require('node:test');
const assert = require('node:assert');
const { buildInfo } = require('../src/version');

test('buildInfo acorta el SHA a 7 caracteres', () => {
  const info = buildInfo('abcdef1234567890', '2026-01-01T00:00:00Z');
  assert.strictEqual(info.shortSha, 'abcdef1');
  assert.strictEqual(info.version, '1.0.0+abcdef1');
});

test('buildInfo usa "local" cuando no hay SHA', () => {
  const info = buildInfo(undefined, '2026-01-01T00:00:00Z');
  assert.strictEqual(info.shortSha, 'local');
});

test('buildInfo conserva la fecha provista', () => {
  const info = buildInfo('abc', '2026-01-01T00:00:00Z');
  assert.strictEqual(info.builtAt, '2026-01-01T00:00:00Z');
});
