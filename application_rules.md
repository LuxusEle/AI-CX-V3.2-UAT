# Nexus ERP Application Rules

This document outlines the key business rules and validations enforced within the Nexus ERP system.

## 1. Quote and Estimation Rules

*   **QT-R1: Line Items Required:** A quote must contain at least one line item. (Source: `apps/api/src/rules/quotes.py:check_lines_present()`)
*   **QT-R2: Line Item Description:** Each line item within a quote requires a description. (Source: `apps/api/src/rules/quotes.py:check_lines_present()`)
*   **QT-R3: Non-Negative Line Amounts:** Unit price and quantity for quote line items must be non-negative. (Source: `apps/api/src/rules/quotes.py:check_lines_present()`)
*   **QT-R4: Totals Consistency:** Quote subtotal and total must be non-negative, and the total must be greater than or equal to the subtotal. (Source: `apps/api/src/rules/quotes.py:check_totals_consistency()`)
*   **QT-R5: BOM Cost Estimation:** BOM items are priced by applying waste percentages and computing subtotals, with an optional margin for selling price. (Source: `apps/api/src/services/bom_service.py:price_bom()`)

## 2. Purchase Order (PO) Rules

*   **PO-R1: Vendor Required:** A Purchase Order must be associated with a vendor. (Source: `apps/api/src/rules/po.py:check_po_before_create()`)
*   **PO-R2: Line Items Required:** A Purchase Order must include at least one line item. (Source: `apps/api/src/rules/po.py:check_po_before_create()`)
*   **PO-R3: Positive Quantity:** Each line item in a Purchase Order must have a quantity greater than zero. (Source: `apps/api/src/rules/po.py:check_po_before_create()`)
*   **PO-R4: Non-Negative Unit Cost:** Each line item in a Purchase Order must have a unit cost greater than or equal to zero. (Source: `apps/api/src/rules/po.py:check_po_before_create()`)
*   **PO-R5: BOM to PO Splitting:** BOM items are split into Purchase Orders based on preferred vendor per SKU, as defined in the Vendor Catalog. (Source: `apps/api/src/services/po_service.py:split_bom_into_pos()`)

## 3. Bill of Materials (BOM) Rules

*   **BOM-R1: Item Name Required:** Each BOM item must have a name. (Source: `apps/api/src/rules/bom.py:check_bom_item()`)
*   **BOM-R2: Positive Quantity:** Each BOM item must have a quantity greater than zero. (Source: `apps/api/src/rules/bom.py:check_bom_item()`)
*   **BOM-R3: Valid Waste Percentage:** The waste percentage for a BOM item must be between 0 and 50 (inclusive). (Source: `apps/api/src/rules/bom.py:check_bom_item()`)
*   **BOM-R4: Vendor Mapping:** For BOM items intended for auto-splitting into POs, a vendor mapping must be found in the Vendor Catalog. (Source: `apps/api/src/rules/bom.py:check_vendor_mapping()`)

## 4. General Application Rules

*   **APP-R1: Multi-Tenancy:** The application supports multi-tenancy, with operations often requiring an `X-Tenant-ID` header. (Source: `apps/api/src/models/*`, `apps/web/app/(auth)/login/page.tsx`, `apps/web/app/clients/page.tsx`)
*   **APP-R2: Authentication:** User authentication is required for accessing most application features, managed via JWT tokens. (Source: `apps/api/src/routers/auth.py`, `apps/api/src/services/security.py`, `apps/web/app/(auth)/login/page.tsx`)
*   **APP-R3: PDF Generation:** The system can generate PDF documents for quotes. (Source: `apps/api/src/services/pdf.py`, `apps/web/app/quotes/page.tsx`)
*   **APP-R4: AI Integration (Planned):** The system has provisions for AI/RAG integration for BOM validation and cost estimation. (Source: `apps/api/src/services/ai_agent.py`)