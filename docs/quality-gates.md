# Package quality gates

Before a release, run `npm run validate` and verify:

- the documented component imports resolve;
- keyboard flip controls work without a pointer;
- image failures have a usable fallback;
- print and PNG export do not expose private application data;
- reduced-motion preferences are respected;
- the consuming app receives the documented `book` shape;
- no customer content or credentials are included in the package.

A release is not complete until the integration patch and README match the shipped API.
