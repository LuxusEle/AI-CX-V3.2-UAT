"""Sanity checks and handover hooks for Quotes.

- Compulsory checks run before DB writes and before PDF generation.
- Each function documents **what** it checks and **why** (handover ready).
"""
from typing import List, Dict

def check_lines_present(lines: List[Dict]):
    """Ensure at least one line exists and all have description and non-negative amounts.
    Fails fast for empty or invalid lines to avoid blank PDFs and wrong totals.
    """
    if not lines or len(lines) == 0:
        raise ValueError("Quote must contain at least one line item.")
    for i, l in enumerate(lines):
        if not l.get("description"):
            raise ValueError(f"Line {i+1}: description is required.")
        for k in ("unit_price","qty"):
            if l.get(k) is None or float(l.get(k)) < 0:
                raise ValueError(f"Line {i+1}: {k} must be >= 0.")

def check_totals_consistency(subtotal: float, total: float):
    """Ensure totals are non-negative and total >= subtotal.
    Guards against negative math and rounding bugs.
    """
    if subtotal < 0 or total < 0 or total < subtotal:
        raise ValueError("Totals invalid: total must be >= subtotal and non-negative.")
