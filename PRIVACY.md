# Melvin Privacy Rules

This repository is public. Treat it as product code and sample data only.

## Never commit

- real SRM employee names tied to rosters, trucks, shifts, schedules, or performance
- personal phone numbers, staff contact lists, or direct manager/contact details
- customer names, jobsite details, tickets, PODs, orders, invoices, or account notes
- dispatch screenshots, schedule screenshots, workbook exports, CSV exports, or copied board data
- plant contact sheets, live route sheets, addresses, coordinates, GPS data, or Samsara exports
- company GPT transcripts containing private SRM data

## Allowed in this public repo

- placeholder contacts such as `DISPATCH_OFFICE_PHONE`
- synthetic sample drivers such as `Driver 01`
- fictional sample customers
- generic plant codes and generic workflow examples when they are not tied to live people or orders
- product code, UI scaffolds, tests, and documentation that do not reveal private operations

## Where real data belongs

Real SRM data should stay in one of these places only:

- local untracked files on Shane's machine
- company-approved GPT/chat surfaces
- a private repository or private storage location with access controls
- a future encrypted local backend/database

When in doubt, do not commit the file. Use placeholders first, then wire real data through local/private config later.
