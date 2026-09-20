# Case statuses

Allowed transitions for navigation requests. There are no clinical states.

```text
received
  → being-routed
      → provider-contacted
          → provider-response-received
              → closed
      → closed
```

| From | Allowed to | Forbidden |
| --- | --- | --- |
| received | being-routed | closed, provider-contacted, any clinical label |
| being-routed | provider-contacted, closed | skipping to provider-response-received |
| provider-contacted | provider-response-received, closed | received |
| provider-response-received | closed | re-open without a new request |
| closed | (none) | — |

Implementation: `src/lib/case-status.ts`.

Correction listings use a separate machine: see `src/lib/corrections.ts`.
