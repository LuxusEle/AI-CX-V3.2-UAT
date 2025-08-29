"""PDF rendering utilities for Quotes/Estimates.

This module mirrors the structure of the provided sample:
- Header block: company + 'QUOTE' or 'INVOICE' label and number/date
- Parties: Bill To / Project info
- Items table: description, unit price, qty, line total
- Totals summary with currency
- Bank details block
- Terms & Conditions page

Data source: Quote + QuoteLines + CompanyProfile-like dict.
Data sinks: Returns bytes to be downloaded or stored to S3.

All drawing measurements are in points (1/72 inch).
"""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib import colors
from io import BytesIO

def _draw_header(c, company, quote):
    c.setFont("Helvetica-Bold", 18)
    c.drawString(25*mm, 275*mm, company.get("name","Your Company"))
    c.setFont("Helvetica", 9)
    c.drawString(25*mm, 270*mm, company.get("address","Address"))
    c.drawString(25*mm, 266*mm, company.get("phone","Phone"))
    c.drawString(25*mm, 262*mm, company.get("email","Email"))

    c.setFont("Helvetica-Bold", 22)
    c.drawRightString(200*mm, 275*mm, "QUOTE")
    c.setFont("Helvetica", 10)
    c.drawRightString(200*mm, 270*mm, f"Quote # {quote.get('number','')}")
    c.drawRightString(200*mm, 266*mm, f"Issue Date {quote.get('issue_date','')}")
    c.drawRightString(200*mm, 262*mm, f"Due Date {quote.get('due_date','')}")

def _draw_billto(c, customer):
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(25*mm, 252*mm, "Bill To")
    c.setFont("Helvetica", 10)
    y = 248*mm
    for line in [customer.get("name",""), customer.get("address",""), customer.get("city",""), customer.get("country","")]:
        if line:
            c.drawString(25*mm, y, line); y -= 5*mm

def _draw_items_table(c, lines, currency):
    top = 240*mm
    left = 25*mm
    right = 200*mm
    row_h = 8*mm

    # Header
    c.setFillColor(colors.lightgrey)
    c.rect(left, top, right-left, row_h, stroke=0, fill=1)
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(left+2*mm, top+3*mm, "ITEM & DESCRIPTION")
    c.drawRightString(right-55*mm, top+3*mm, "UNIT")
    c.drawRightString(right-25*mm, top+3*mm, "QTY")
    c.drawRightString(right-2*mm, top+3*mm, "AMOUNT")

    y = top - row_h
    c.setFont("Helvetica", 10)
    for l in lines:
        if y < 60*mm:  # stop before totals area
            break
        c.drawString(left+2*mm, y+2*mm, l["description"][:90])
        c.drawRightString(right-55*mm, y+2*mm, f"{currency}{float(l['unit_price']):,.2f}")
        c.drawRightString(right-25*mm, y+2*mm, f"{float(l['qty']):.2f}")
        amt = float(l["unit_price"]) * float(l["qty"])
        c.drawRightString(right-2*mm, y+2*mm, f"{currency}{amt:,.2f}")
        y -= row_h

def _draw_totals(c, subtotal, total, currency):
    right = 200*mm
    base_y = 70*mm
    c.setFont("Helvetica", 10)
    c.drawRightString(right-25*mm, base_y+10*mm, "Sub Total")
    c.drawRightString(right-2*mm, base_y+10*mm, f"{currency}{float(subtotal):,.2f}")
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(right-25*mm, base_y+2*mm, "Total")
    c.drawRightString(right-2*mm, base_y+2*mm, f"{currency}{float(total):,.2f}")

def _draw_bank(c, bank):
    c.setFont("Helvetica-Bold", 10)
    c.drawString(25*mm, 40*mm, bank.get("title","BANK DETAILS"))
    c.setFont("Helvetica", 9)
    y = 35*mm
    for line in bank.get("lines", []):
        c.drawString(25*mm, y, line); y -= 5*mm

def _draw_terms_page(c, terms):
    c.showPage()
    c.setFont("Helvetica-Bold", 14)
    c.drawString(25*mm, 280*mm, "Terms & Conditions")
    c.setFont("Helvetica", 9)
    y = 270*mm
    for t in terms:
        for para in t.split("\n"):
            if not para: 
                y -= 5*mm; continue
            c.drawString(25*mm, y, f"- {para}")
            y -= 6*mm
            if y < 20*mm:
                c.showPage()
                y = 270*mm

def render_quote_pdf(company, customer, quote, lines, bank, terms):
    """Return PDF bytes for a quote.

    Args:
      company: dict with name/address/phone/email
      customer: dict with name/address/city/country
      quote: dict with number/issue_date/due_date/currency/subtotal/total
      lines: list of dicts with description/unit_price/qty
      bank: dict with title and lines[]
      terms: list[str] paragraphs

    Returns: bytes
    """
    buff = BytesIO()
    c = canvas.Canvas(buff, pagesize=A4)
    _draw_header(c, company, quote)
    _draw_billto(c, customer)
    _draw_items_table(c, lines, quote.get("currency",""))
    _draw_totals(c, quote.get("subtotal",0), quote.get("total",0), quote.get("currency",""))
    _draw_bank(c, bank)
    _draw_terms_page(c, terms)
    c.save()
    return buff.getvalue()
