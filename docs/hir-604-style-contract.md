# HIR-604 style contract

- The Case Qualifier uses the named `--color-cq-*` palette tokens. Their values
  preserve the existing rendered colors, gradients, transparency, focus ring,
  and reduced-motion behavior.
- Its `960px` assessment breakpoint is intentional: the approved 960px view
  stacks the assessment, while the approved 980px view keeps the two-column
  layout. It remains a documented exception to the shared `980px` nav token.
- `FeatureStrip`, `process-section__*`, and `PricingSection` own the neutral
  shells shared by family and site/co-branded pages. Family copy, prices, FAQ
  data, `PricingCard`, and `BaseAccordion` remain unchanged.
- Family uses deliberate deep selectors for PricingSection's header and intro
  geometry; those elements are slotted through the child component boundary.
