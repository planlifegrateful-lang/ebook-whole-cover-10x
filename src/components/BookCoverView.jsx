import React, { useRef, useState, useCallback } from "react";
import { Image } from "@/components/ui/image";
import { Loader2, Download, RotateCcw, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * BookCoverView – full front + spine + back cover spread
 * Features:
 *  - 3D perspective tilt on hover / touch
 *  - Click-to-flip (front ↔ back)
 *  - Print-ready / high-res PNG export of the entire spread
 *  - Polished back-cover typography + ISBN-style barcode placeholder
 *  - Series branding footer
 *  - Mobile-safe max width
 */
export default function BookCoverView({
  book,
  size = "md", // "sm" | "md" | "lg"
  interactive = true,
  showExport = true,
  className = "",
}) {
  const spreadRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [tilting, setTilting] = useState({ x: 0, y: 0 });
  const [exporting, setExporting] = useState(false);

  const hasCover = !!book?.cover_image_url;
  const title = book?.title || "Untitled";
  const genre = book?.genre || "General";
  const synopsis =
    book?.synopsis ||
    book?.subject ||
    "A story worth telling. Generated with EbookCreator AI.";
  const subject = book?.subject || "";
  const series = book?.series || book?.brand || "EbookCreator AI";

  // Generate a deterministic fake ISBN-13 from book id/title for visual polish
  const isbn = React.useMemo(() => {
    const seed = (book?.id || title)
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    const base = 9780000000000 + (seed % 1000000000);
    // Simple check digit (mod 10)
    const digits = String(base).slice(0, 12).split("").map(Number);
    let sum = 0;
    digits.forEach((d, i) => {
      sum += i % 2 === 0 ? d : d * 3;
    });
    const check = (10 - (sum % 10)) % 10;
    return `${String(base).slice(0, 3)}-${String(base).slice(3, 4)}-${String(base).slice(4, 9)}-${String(base).slice(9, 12)}-${check}`;
  }, [book?.id, title]);

  const sizeMap = {
    sm: { max: 260, spine: 14, font: "text-[8px]", title: "text-[11px]" },
    md: { max: 340, spine: 18, font: "text-[10px]", title: "text-sm" },
    lg: { max: 480, spine: 24, font: "text-xs", title: "text-base" },
  };
  const s = sizeMap[size] || sizeMap.md;

  const handleMove = useCallback(
    (e) => {
      if (!interactive || !spreadRef.current) return;
      const rect = spreadRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilting({ x: y * -12, y: x * 18 });
    },
    [interactive]
  );

  const handleLeave = useCallback(() => {
    setTilting({ x: 0, y: 0 });
  }, []);

  const exportSpread = useCallback(async () => {
    if (!spreadRef.current || exporting) return;
    setExporting(true);
    try {
      // Dynamic import so html2canvas is only loaded when needed
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(spreadRef.current, {
        scale: 3, // high-res
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${title.replace(/[^\w\s-]/g, "").trim() || "ebook"}-full-cover.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed", err);
      // Fallback: open print dialog focused on the spread
      window.print();
    } finally {
      setExporting(false);
    }
  }, [exporting, title]);

  const printSpread = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* 3D stage */}
      <div
        className="w-full flex justify-center"
        style={{ perspective: "1400px" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div
          ref={spreadRef}
          className="relative transition-transform duration-200 ease-out will-change-transform"
          style={{
            maxWidth: s.max,
            width: "100%",
            transform: interactive
              ? `rotateX(${tilting.x}deg) rotateY(${tilting.y + (flipped ? 180 : 0)}deg)`
              : flipped
              ? "rotateY(180deg)"
              : "none",
            transformStyle: "preserve-3d",
          }}
          onClick={() => interactive && setFlipped((v) => !v)}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={(e) => {
            if (interactive && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setFlipped((v) => !v);
            }
          }}
          aria-label={flipped ? "Show front cover" : "Show back cover"}
        >
          {/* FRONT FACE (back-cover | spine | front-cover) */}
          <div
            className="flex items-stretch w-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Back cover panel */}
            <div
              className="flex-1 aspect-[3/4] rounded-l-lg rounded-r-sm overflow-hidden shadow-xl border border-border/60 bg-gradient-to-br from-secondary via-secondary/90 to-secondary/70 flex flex-col p-4 sm:p-5"
              style={{ boxShadow: "inset 2px 0 8px rgba(0,0,0,0.06)" }}
            >
              <p className={`${s.font} uppercase tracking-[0.18em] text-muted-foreground font-medium`}>
                {genre}
              </p>
              <h3
                className={`font-display font-semibold tracking-tight leading-tight mt-1.5 ${s.title}`}
              >
                {title}
              </h3>
              {subject && (
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                  {subject}
                </p>
              )}

              <div className="mt-3 flex-1 overflow-hidden">
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-foreground/75 line-clamp-[11]">
                  {synopsis}
                </p>
              </div>

              {/* Barcode + series */}
              <div className="mt-auto pt-3 border-t border-border/40">
                <div className="flex items-end justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-muted-foreground tracking-wider">
                      {series}
                    </span>
                    <span className="text-[8px] font-mono text-muted-foreground/80">
                      ISBN {isbn}
                    </span>
                  </div>
                  {/* Visual barcode bars */}
                  <div
                    className="h-7 flex items-end gap-px opacity-70"
                    aria-hidden
                  >
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span
                        key={i}
                        className="bg-foreground/80"
                        style={{
                          width: i % 5 === 0 ? 1.5 : 1,
                          height: `${40 + ((i * 7) % 60)}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Spine */}
            <div
              className="shrink-0 bg-gradient-to-b from-primary via-primary to-primary/85 relative overflow-hidden shadow-inner"
              style={{
                width: s.spine,
                boxShadow:
                  "inset 3px 0 6px rgba(0,0,0,0.25), inset -2px 0 4px rgba(255,255,255,0.08)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className="text-primary-foreground font-display font-semibold tracking-[0.2em] whitespace-nowrap text-[9px] sm:text-[10px] opacity-95"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {title.length > 42 ? title.slice(0, 40) + "…" : title}
                </span>
              </div>
              {/* subtle edge highlight */}
              <div className="absolute inset-y-0 left-0 w-px bg-white/20" />
              <div className="absolute inset-y-0 right-0 w-px bg-black/20" />
            </div>

            {/* Front cover */}
            <div className="flex-1 aspect-[3/4] rounded-r-lg rounded-l-sm overflow-hidden shadow-xl bg-muted shrink-0 relative">
              {hasCover ? (
                <Image
                  src={book.cover_image_url}
                  alt={title}
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-muted">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* BACK FACE (mirrored for flip – shows front as primary after 180°) */}
          <div
            className="absolute inset-0 flex items-stretch"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex-1 aspect-[3/4] rounded-l-lg rounded-r-sm overflow-hidden shadow-xl bg-muted">
              {hasCover ? (
                <Image
                  src={book.cover_image_url}
                  alt={title}
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
              ) : (
                <div className="w-full h-full grid place-items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <div
              className="shrink-0 bg-gradient-to-b from-primary to-primary/85"
              style={{ width: s.spine }}
            />
            <div className="flex-1 aspect-[3/4] rounded-r-lg rounded-l-sm overflow-hidden shadow-xl bg-gradient-to-br from-secondary to-secondary/70 p-4 flex flex-col">
              <p className={`${s.font} uppercase tracking-[0.18em] text-muted-foreground`}>
                {genre}
              </p>
              <h3 className={`font-display font-semibold ${s.title} mt-1`}>
                {title}
              </h3>
              <p className="text-[10px] leading-relaxed text-foreground/70 mt-2 line-clamp-8">
                {synopsis}
              </p>
              <p className="text-[8px] text-muted-foreground mt-auto">
                {series}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {(interactive || showExport) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {interactive && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped((v) => !v);
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {flipped ? "Show front" : "Flip book"}
            </Button>
          )}
          {showExport && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  exportSpread();
                }}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Export PNG
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  printSpread();
                }}
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </Button>
            </>
          )}
        </div>
      )}

      {/* Print-only styles: hide chrome, force spread visible */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .book-cover-print-root, .book-cover-print-root * {
            visibility: visible !important;
          }
          .book-cover-print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
