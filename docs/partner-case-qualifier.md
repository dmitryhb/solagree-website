# Partner Case Qualifier

The Case Qualifier is an approved-partner tool and is intentionally separate
from the public Solagree consumer quiz.

- Route: `/partner-tools/case-qualifier-7h3m9k`
- Indexing: `noindex, nofollow`
- Discovery: no homepage, navigation, footer, or sitemap link
- Static hosting: explicitly prerendered because the crawler cannot discover it
- State: stored under `solagree.case-qualifier.session.v1`, independently from
  the public quiz
- Figma: https://www.figma.com/design/AbFRWs6JeFsD6LNGIYdAmG?node-id=19-3

The unlisted URL is not an authentication boundary. If access must be
restricted beyond link sharing, add a portal-authenticated route instead of
relying on obscurity.
