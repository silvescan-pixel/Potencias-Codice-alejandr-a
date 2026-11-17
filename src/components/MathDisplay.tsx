import React from 'react';

interface MathPowerProps {
  base: React.ReactNode;
  exp: React.ReactNode;
  className?: string;
  expClassName?: string;
}

/**
 * Renders a power in traditional mathematical notation: base with raised superscript exponent.
 */
export const MathPower: React.FC<MathPowerProps> = ({
  base,
  exp,
  className = '',
  expClassName = '',
}) => (
  <span className={`inline-flex items-baseline font-mono-math ${className}`}>
    <span>{base}</span>
    <sup className={`text-[0.72em] leading-none ml-[1px] font-bold relative -top-[0.42em] ${expClassName}`}>
      {exp}
    </sup>
  </span>
);

interface MathFractionProps {
  numerator: React.ReactNode;
  denominator: React.ReactNode;
  className?: string;
}

/**
 * Renders a genuine stacked mathematical fraction with a horizontal division bar.
 */
export const MathFraction: React.FC<MathFractionProps> = ({
  numerator,
  denominator,
  className = '',
}) => (
  <span className={`inline-flex flex-col items-center justify-center align-middle font-mono-math leading-tight ${className}`}>
    <span className="px-2 pb-1 border-b-2 border-current">{numerator}</span>
    <span className="px-2 pt-1">{denominator}</span>
  </span>
);

/**
 * Parses a mathematical string expression containing `^` (including nested parentheses/brackets
 * like `[(7^4)^12]^0`, `(-2)^-3`, `2^(2^2)`, `(-6)^x`) and renders it using genuine HTML <sup>
 * superscripts so `^` never appears in the user interface.
 */
function parseMathTokens(input: string, keyPrefix = 'm'): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  // Map Unicode superscripts back to normal characters if nested inside ^ parsing
  const normalizeSupChars = (s: string) =>
    s
      .replace(/⁰/g, '0')
      .replace(/¹/g, '1')
      .replace(/²/g, '2')
      .replace(/³/g, '3')
      .replace(/⁴/g, '4')
      .replace(/⁵/g, '5')
      .replace(/⁶/g, '6')
      .replace(/⁷/g, '7')
      .replace(/⁸/g, '8')
      .replace(/⁹/g, '9');

  const str = normalizeSupChars(input);

  while (i < str.length) {
    const caretIdx = str.indexOf('^', i);
    if (caretIdx === -1) {
      nodes.push(<React.Fragment key={`${keyPrefix}-t-${i}`}>{str.slice(i)}</React.Fragment>);
      break;
    }

    if (caretIdx > i) {
      nodes.push(<React.Fragment key={`${keyPrefix}-p-${i}`}>{str.slice(i, caretIdx)}</React.Fragment>);
    }

    // Extract exponent right after `^`
    let expStart = caretIdx + 1;
    if (expStart >= str.length) {
      i = expStart;
      break;
    }

    let expContent = '';
    let nextIdx = expStart;

    if (str[expStart] === '(') {
      // Balanced parentheses exponent: e.g. ^(k+m) or ^(2^2)
      let depth = 0;
      let j = expStart;
      while (j < str.length) {
        if (str[j] === '(') depth++;
        else if (str[j] === ')') {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      expContent = str.slice(expStart + 1, j);
      nextIdx = j + 1;
    } else {
      // Match optional leading minus + digits/letters (e.g. -3, 12, x, n)
      let j = expStart;
      if (str[j] === '-' || str[j] === '+') j++;
      while (j < str.length && /[a-zA-Z0-9]/.test(str[j])) {
        j++;
      }
      expContent = str.slice(expStart, j);
      nextIdx = j;
    }

    nodes.push(
      <sup
        key={`${keyPrefix}-sup-${caretIdx}`}
        className="text-[0.72em] leading-none ml-[1px] font-bold relative -top-[0.42em]"
      >
        {parseMathTokens(expContent, `${keyPrefix}-s${caretIdx}`)}
      </sup>
    );

    i = nextIdx;
  }

  return nodes;
}

interface FormatMathProps {
  expr: string;
  className?: string;
}

export const FormatMath: React.FC<FormatMathProps> = ({ expr, className = '' }) => {
  return <span className={`font-mono-math ${className}`}>{parseMathTokens(expr)}</span>;
};
