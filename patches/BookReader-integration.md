# BookReader Integration – Whole Cover (All Features)

## 1. Import

```jsx
import BookCoverView from "@/components/BookCoverView";
```

## 2. State (add these)

```jsx
const [showWholeCover, setShowWholeCover] = useState(false);
const [autoOpened, setAutoOpened] = useState(false);
```

## 3. Auto-open on first visit to a finished book

Place this effect near your other useEffects:

```jsx
useEffect(() => {
  if (!book || autoOpened) return;
  // Only auto-open when the book looks finished (has cover + chapters)
  const isFinished =
    !!book.cover_image_url &&
    Array.isArray(book.chapters) &&
    book.chapters.length > 0;
  if (!isFinished) return;

  const key = `wholeCoverSeen:${book.id}`;
  try {
    if (!localStorage.getItem(key)) {
      setShowWholeCover(true);
      localStorage.setItem(key, "1");
      setAutoOpened(true);
    }
  } catch {
    // private mode / blocked storage – just open once this session
    setShowWholeCover(true);
    setAutoOpened(true);
  }
}, [book, autoOpened]);
```

## 4. Replace the cover hero section

```jsx
{/* Cover hero */}
<div className="flex flex-col sm:flex-row gap-6 mb-6">
  <div className="w-32 sm:w-40 aspect-[3/4] rounded-xl overflow-hidden bg-muted shrink-0 shadow-md">
    {book.cover_image_url ? (
      <Image
        src={book.cover_image_url}
        alt={book.title}
        className="w-full h-full"
        fittingType="fill"
      />
    ) : (
      <div className="w-full h-full grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )}
  </div>
  <div className="flex flex-col justify-end">
    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
      {book.genre}
    </p>
    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-display leading-tight">
      {book.title}
    </h1>
    <p className="text-sm text-muted-foreground mt-1">{book.subject}</p>
    {totalWords > 0 && (
      <p className="text-xs text-muted-foreground mt-3">
        {chapters.length} chapters · ~{totalWords.toLocaleString()} words
      </p>
    )}
    <Button
      variant="outline"
      size="sm"
      className="rounded-full mt-4 self-start"
      onClick={() => setShowWholeCover((v) => !v)}
    >
      {showWholeCover ? "Hide whole book" : "View whole book"}
    </Button>
  </div>
</div>

{/* Whole book (front + spine + back) – 3D interactive */}
<AnimatePresence>
  {showWholeCover && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden mb-12"
    >
      <BookCoverView book={book} size="md" interactive showExport />
    </motion.div>
  )}
</AnimatePresence>
```

## 5. Optional – Home page cards

Replace your existing book card with:

```jsx
import BookCardWithWholeCover from "@/components/BookCardWithWholeCover";

// inside map:
<BookCardWithWholeCover key={book.id} book={book} />
```

## 6. Dependency (for high-res PNG export)

```bash
npm install html2canvas
# or
pnpm add html2canvas
```

If you prefer zero new deps, the Print button still works via the browser print dialog.

## What you get

| Feature | Status |
|---------|--------|
| 3D tilt on hover | ✅ |
| Click / button flip front ↔ back | ✅ |
| High-res PNG export of full spread | ✅ |
| Print-optimized layout | ✅ |
| Whole-book on home card hover | ✅ |
| Auto-open first time on finished books | ✅ |
| Polished back-cover + ISBN barcode + series | ✅ |
| Mobile-safe sizing | ✅ |
