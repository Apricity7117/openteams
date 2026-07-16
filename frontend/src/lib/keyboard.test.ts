import assert from 'node:assert/strict';
import {
  isImeComposingEnterKeyDown,
  isImeComposingKeyDown,
  shouldHandleEnterKeyDown,
  type EnterKeyboardEvent,
} from './keyboard';

const keyboardEvent = (
  overrides: Partial<EnterKeyboardEvent> = {},
): EnterKeyboardEvent => ({
  isComposing: false,
  key: 'Enter',
  keyCode: 13,
  ...overrides,
});

assert.equal(isImeComposingKeyDown(keyboardEvent({ isComposing: true })), true);
assert.equal(isImeComposingKeyDown(keyboardEvent({ keyCode: 229 })), true);
assert.equal(isImeComposingKeyDown(keyboardEvent()), false);
assert.equal(
  isImeComposingEnterKeyDown(keyboardEvent({ isComposing: true })),
  true,
);
assert.equal(
  isImeComposingEnterKeyDown(keyboardEvent({ key: 'a', isComposing: true })),
  false,
);
assert.equal(shouldHandleEnterKeyDown(keyboardEvent({ isComposing: true })), false);
assert.equal(shouldHandleEnterKeyDown(keyboardEvent({ keyCode: 229 })), false);
assert.equal(shouldHandleEnterKeyDown(keyboardEvent({ key: 'a' })), false);
assert.equal(shouldHandleEnterKeyDown(keyboardEvent()), true);

console.log('IME keyboard guards: PASS');
