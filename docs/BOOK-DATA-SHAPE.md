# Required `book` object shape

```ts
type Book = {
  id: string | number;          // required for deterministic ISBN + auto-open key
  title: string;                // required
  genre?: string;               // default "General"
  synopsis?: string;            // preferred
  subject?: string;             // fallback for synopsis
  cover_image_url?: string;     // front cover image URL
  series?: string;              // back-cover series line
  brand?: string;               // fallback for series
};
```

Minimal example:

```json
{
  "id": "ai-creator-os-ebook",
  "title": "AI Creator OS",
  "genre": "Business / Creator Economy",
  "synopsis": "The complete operating system that turns AutoGPT and proven creator systems into shippable digital products in 48 hours.",
  "cover_image_url": "https://example.com/cover.png",
  "series": "Plan Life Grateful"
}
```
