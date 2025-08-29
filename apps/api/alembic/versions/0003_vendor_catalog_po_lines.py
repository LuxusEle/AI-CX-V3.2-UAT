from alembic import op
import sqlalchemy as sa

revision = '0003_vendor_catalog_po_lines'
down_revision = '0002_quotes'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('vendor_catalog',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('vendor_id', sa.Integer, sa.ForeignKey('vendors.id'), nullable=False),
        sa.Column('sku', sa.String(100), nullable=False),
        sa.Column('description', sa.String(255)),
        sa.Column('uom', sa.String(20), server_default='unit'),
        sa.Column('unit_cost', sa.Numeric(12,2), server_default='0'),
        sa.Column('currency', sa.String(10), server_default='LKR'),
        sa.Column('lead_days', sa.Integer, server_default='7'),
        sa.Column('min_order_qty', sa.Numeric(12,2), server_default='0'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

    op.create_table('purchase_order_lines',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('po_id', sa.Integer, sa.ForeignKey('purchase_orders.id', ondelete="CASCADE"), nullable=False),
        sa.Column('sku', sa.String(100)),
        sa.Column('description', sa.String(255)),
        sa.Column('qty', sa.Numeric(12,2), server_default='0'),
        sa.Column('unit_cost', sa.Numeric(12,2), server_default='0'),
        sa.Column('line_total', sa.Numeric(12,2), server_default='0'),
        sa.Column('expected_date', sa.Date, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('purchase_order_lines')
    op.drop_table('vendor_catalog')
