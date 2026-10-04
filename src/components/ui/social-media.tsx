import React from "react";
import { cn } from "@/lib/utils";

/**
 * SocialTooltip (21st.dev · ravikatiyar162), adaptado:
 * el ícono es un componente (no <img>) para que se ponga blanco cuando el color sube,
 * el relleno acepta degradados (Instagram), funciona con teclado y la etiqueta puede ir arriba.
 */

export interface SocialItem {
  href: string;
  ariaLabel: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Cualquier valor CSS de fondo: color o degradado. */
  color: string;
  external?: boolean;
}

export interface SocialTooltipProps extends React.HTMLAttributes<HTMLUListElement> {
  items: SocialItem[];
  tooltipPosition?: "top" | "bottom";
  size?: "md" | "lg";
}

const SocialTooltip = React.forwardRef<HTMLUListElement, SocialTooltipProps>(
  ({ className, items, tooltipPosition = "bottom", size = "md", ...props }, ref) => {
    const baseIconStyles = cn(
      "relative flex items-center justify-center rounded-full bg-paper/90 ring-1 ring-ink/10 overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:ring-transparent group-focus-within:ring-transparent",
      size === "lg" ? "w-14 h-14" : "w-12 h-12",
    );
    const baseSvgStyles =
      "relative z-10 w-6 h-6 text-ink transition-colors duration-300 ease-in-out group-hover:text-white group-focus-within:text-white";
    const baseFilledStyles =
      "absolute bottom-0 left-0 w-full h-0 transition-all duration-300 ease-in-out group-hover:h-full group-focus-within:h-full";
    const baseTooltipStyles = cn(
      "pointer-events-none absolute left-1/2 -translate-x-1/2 px-2.5 py-1.5 text-xs font-normal tracking-wide text-white whitespace-nowrap rounded-md opacity-0 invisible transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible",
      tooltipPosition === "bottom"
        ? "bottom-[-36px] group-hover:bottom-[-44px] group-focus-within:bottom-[-44px]"
        : "top-[-36px] group-hover:top-[-44px] group-focus-within:top-[-44px]",
    );

    return (
      <ul ref={ref} className={cn("flex items-center justify-center gap-3", className)} {...props}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.ariaLabel} className="relative group">
              <a
                href={item.href}
                aria-label={item.ariaLabel}
                className={baseIconStyles}
                {...(item.external !== false ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <div className={baseFilledStyles} style={{ background: item.color }} />
                <Icon className={baseSvgStyles} />
              </a>
              <div className={baseTooltipStyles} style={{ background: item.color }} aria-hidden="true">
                {item.tooltip}
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
);

SocialTooltip.displayName = "SocialTooltip";

export { SocialTooltip };

export default SocialTooltip;
