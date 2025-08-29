from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0001_init'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table('tenants',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), server_default='user'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('clients',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255)),
        sa.Column('phone', sa.String(50)),
        sa.Column('address', sa.Text),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('projects',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('client_id', sa.Integer, sa.ForeignKey('clients.id')),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('status', sa.String(50), server_default='draft'),
        sa.Column('start_date', sa.Date),
        sa.Column('end_date', sa.Date),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('bom_items',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('project_id', sa.Integer, sa.ForeignKey('projects.id', ondelete="CASCADE"), nullable=False),
        sa.Column('sku', sa.String(100)),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('qty', sa.Float, nullable=False),
        sa.Column('unit_cost', sa.Numeric(12,2), server_default='0'),
        sa.Column('waste_pct', sa.Numeric(5,2), server_default='0'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('vendors',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('contact', sa.String(255)),
        sa.Column('payment_terms', sa.String(255)),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('purchase_orders',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('vendor_id', sa.Integer, sa.ForeignKey('vendors.id')),
        sa.Column('project_id', sa.Integer, sa.ForeignKey('projects.id')),
        sa.Column('status', sa.String(50), server_default='draft'),
        sa.Column('total', sa.Numeric(12,2), server_default='0'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('audit_logs',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, nullable=False),
        sa.Column('actor_user_id', sa.Integer),
        sa.Column('action', sa.String(100)),
        sa.Column('target', sa.String(100)),
        sa.Column('payload', sa.JSON),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('audit_logs')
    op.drop_table('purchase_orders')
    op.drop_table('vendors')
    op.drop_table('bom_items')
    op.drop_table('projects')
    op.drop_table('clients')
    op.drop_table('users')
    op.drop_table('tenants')
