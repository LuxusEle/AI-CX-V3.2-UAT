# PDF Template Mapping

This generator mirrors a standard 2-page format:
- Header (company block + QUOTE + number/date)
- Bill To
- Items table (description, unit, qty, amount)
- Subtotal and Total
- Bank details block
- Terms & Conditions page

Edit the bank and terms in `apps/api/src/routers/quotes.py` → `quote_pdf()`
or load them from DB later (CompanyProfile + Terms).

> The layout structure was designed to reflect your provided sample (sections like Quote/Invoice number, totals, bank block, and a dedicated Terms page).
