import React, { useState } from "react";
import { Link } from "react-router-dom"; // or your router
import { Image } from "@/components/ui/image";
import { Loader2 } from "lucide-react";
import BookCoverView from "@/components/BookCoverView";

/**
 * Book card that reveals the full whole-book spread on hover (desktop)
 * and on long-press / tap (mobile). Click still navigates to the reader.
 */
export default function BookCardWithWholeCover({ book, onOpen }) {
  const [showSpread, setShowSpread] = useState(false);
  const hasCover = !!book?.cover_image_url;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowSpread(true)}
      onMouseLeave={() => setShowSpread(false)}
    >
      <Link
        to={`/book/${book.id}`}
        onClick={(e) => {
          if (onOpen) {
            e.preventDefault();
            onOpen(book);
          }
        }}
        className="block rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="aspect-[3/4] bg-muted relative">
          {hasCover ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-full object-cover"
              fittingType="fill"
            />
          ) : (
            <div className="w-full h-full grid place-items-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {/* subtle overlay label */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs font-medium line-clamp-2">
              {book.title}
            </p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {book.genre}
          </p>
          <h3 className="font-display font-semibold text-sm leading-tight mt-0.5 line-clamp-2">
            {book.title}
          </h3>
        </div>
      </Link>

      {/* Hover / focus whole-book popover */}
      {showSpread && hasCover && (
        <div
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-3 w-[min(340px,90vw)] pointer-events-none hidden md:block"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))" }}
        >
          <div className="bg-background/95 backdrop-blur rounded-xl p-3 border border-border">
            <BookCoverView
              book={book}
              size="sm"
              interactive={false}
              showExport={false}
            />
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              Hover to preview · Click to open
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
