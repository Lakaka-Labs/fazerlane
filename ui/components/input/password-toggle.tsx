"use client";

import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  /** Whether the field it controls is currently showing plain text. */
  visible: boolean;
  onToggle: () => void;
  /**
   * Names the field this toggle belongs to. Forms that carry both a password
   * and a confirmation render two of these, and "Show password" twice gives a
   * screen reader no way to tell them apart.
   */
  label?: string;
}

/**
 * Reveals or hides the password field beside it.
 *
 * A real <button> rather than a clickable <span>: the span this replaces could
 * not be focused or activated from a keyboard, and announced nothing. The state
 * rides on `aria-pressed` because the only other signal is the Eye/EyeOff icon
 * swap, which is shape alone.
 */
export function PasswordToggle({
  visible,
  onToggle,
  label = "password",
}: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={visible}
      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
      className={`border-border focus-visible:ring-brand-text/25 flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-solid px-2 transition-colors duration-200 ease-linear focus-visible:ring-2 focus-visible:outline-none ${
        visible ? "bg-transparent" : "bg-border"
      }`}
    >
      {visible ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
    </button>
  );
}
