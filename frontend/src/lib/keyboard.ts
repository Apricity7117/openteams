export type KeyboardEventWithImeState = Pick<
  KeyboardEvent,
  'isComposing' | 'keyCode'
>;

export type EnterKeyboardEvent = KeyboardEventWithImeState &
  Pick<KeyboardEvent, 'key'>;

export function isImeComposingKeyDown(
  event: KeyboardEventWithImeState,
): boolean {
  return event.isComposing || event.keyCode === 229;
}

export function isImeComposingEnterKeyDown(
  event: EnterKeyboardEvent,
): boolean {
  return event.key === 'Enter' && isImeComposingKeyDown(event);
}

export function shouldHandleEnterKeyDown(
  event: EnterKeyboardEvent,
): boolean {
  return event.key === 'Enter' && !isImeComposingEnterKeyDown(event);
}
