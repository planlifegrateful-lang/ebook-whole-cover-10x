# 60-Second Install (10/10)

1. Copy `src/components/BookCoverView.jsx` into your app (overwrite existing).
2. Copy `src/components/BookCardWithWholeCover.jsx` into your app.
3. Open `patches/BookReader-integration.md` and paste the state, useEffect, and hero JSX into your BookReader.
4. Optional: `npm i html2canvas` for high-res PNG export.
5. On library/home page replace book cards with `<BookCardWithWholeCover book={book} />`.

Done. Whole-book view is live with 3D tilt, flip, export, auto-open, and polished back cover.
