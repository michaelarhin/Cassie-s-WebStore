# Architecture rules
- Keep the Coming Soon entry at `/` outside the shopping layout and the existing storefront at `/home` so the welcome page does not obstruct shop navigation.
- Use AutomaticTheme to apply the visitor's local-time theme globally through semantic CSS tokens so every page shares the same appearance.
- Use the shared ParallaxImage for scroll-driven photo depth and optional mouse movement; disable transforms for reduced-motion preferences to keep imagery accessible and consistently framed.