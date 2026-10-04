/**
 * En Italiana el "1" se confunde con una "I" ("100" se lee "IOO").
 * En títulos con números, los dígitos van en Instrument Serif.
 */
export function withDigits(text: string) {
  return text.split(/(\d[\d,.:]*)/).map((part, i) =>
    /\d/.test(part) ? (
      <span key={i} className="font-serif">
        {part}
      </span>
    ) : (
      part
    ),
  )
}
