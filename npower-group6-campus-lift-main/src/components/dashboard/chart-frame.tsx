import { cloneElement, type ReactElement, useEffect, useRef, useState } from "react";

export function ChartFrame({ children }: { children: ReactElement<{ width?: number; height?: number }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const read = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      if (next > 8) setWidth(next);
    };

    read();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(read) : null;
    ro?.observe(el);
    window.addEventListener("resize", read);
    const fallback = window.setTimeout(() => {
      if ((ref.current?.getBoundingClientRect().width ?? 0) > 8) read();
      else setWidth((w) => w || 640);
    }, 250);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", read);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className="h-60 w-full min-w-0">
      {width > 8 ? cloneElement(children, { width, height: 240 }) : (
        <div className="h-full w-full rounded-md bg-bg-subtle" aria-hidden />
      )}
    </div>
  );
}
