# Troubleshooting – Ebook Whole-Cover 10X

## Component does not appear
- Confirm you copied both JSX files into the correct path your aliases resolve (`@/components/...`).
- Check browser console for missing `Image` or `Button` imports. Replace with your own UI primitives if needed.

## Tilt / flip not working
- `interactive={true}` must be set (default).
- Parent must not have `overflow: hidden` that clips the 3D transform.
- On mobile, tilt is mouse-based; flip still works via click / keyboard.

## Export PNG fails
- Install peer: `npm i html2canvas`
- CORS: cover images must allow cross-origin or be same-origin.
- Fallback automatically opens print dialog.

## Auto-open not firing
- Follow `patches/BookReader-integration.md` exactly (localStorage key + useEffect).
- Clear `localStorage` key `wholeCoverSeen-{bookId}` to re-test.

## Validation fails in CI
```bash
node scripts/validate.mjs
```
Fix any FAIL lines (missing files or missing feature strings in source).

## Print looks wrong
- Print CSS hides everything except the spread. Ensure the component is mounted when printing.
