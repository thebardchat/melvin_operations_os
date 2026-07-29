# Next Build Plan

## Highest priority

Protect real SRM information while moving Melvin toward current concrete mixer and CSR work.

## Immediate tasks

1. Build browser-local export/backup for calls, callbacks, order changes, and issues. - DONE
2. Add PWA manifest and service worker so the app remains usable offline.
3. Add mixer status update controls: available, loading, on job, returning, down, off duty. - DONE
4. Add end-of-day carry-forward so unresolved callbacks/issues show on the next Today Board.
5. Add company GPT safe-copy templates that redact private details by default.

## Privacy acceptance criteria

- No real employee names are committed.
- No real phone numbers are committed.
- No customer/job/order/POD/ticket details are committed.
- No screenshots, workbooks, CSV exports, or dispatch board captures are committed.
- Demo data is clearly labeled as sample or fictional.

## Backlog alignment

- NW-001 shared roster dashboard remains open and should be designed as private/local or access-controlled, not public GitHub data.
- NW-002 shared truck token resolution remains open and should not expose real truck/driver assignments publicly.
- NW-003 dispatcher intake can be handled through printable/private forms first.
- NW-005 company GPT/backlog automation should depend on sanitized or approved company-context input only.
