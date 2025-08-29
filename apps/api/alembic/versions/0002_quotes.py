from alembic import op
import sqlalchemy as sa

revision = '0002_quotes'
down_revision = '0001_init'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('quotes',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('project_id', sa.Integer, sa.ForeignKey('projects.id')),
        sa.Column('client_id', sa.Integer, sa.ForeignKey('clients.id')),
        sa.Column('number', sa.String(50), unique=True),
        sa.Column('issue_date', sa.Date),
        sa.Column('due_date', sa.Date),
        sa.Column('currency', sa.String(10), server_default='LKR'),
        sa.Column('subtotal', sa.Numeric(12,2), server_default='0'),
        sa.Column('total', sa.Numeric(12,2), server_default='0'),
        sa.Column('notes', sa.String(2000)),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now())
    )
    op.create_table('quote_lines',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('tenant_id', sa.Integer, sa.ForeignKey('tenants.id', ondelete="CASCADE"), nullable=False),
        sa.Column('quote_id', sa.Integer, sa.ForeignKey('quotes.id', ondelete="CASCADE"), nullable=False),
        sa.Column('description', sa.String(1000), nullable=False),
        sa.Column('unit_price', sa.Numeric(12,2), server_default='0'),
        sa.Column('qty', sa.Numeric(12,2), server_default='1'),
        sa.Column('line_total', sa.Numeric(12,2), server_default='0')
    )

def downgrade():
    op.drop_table('quote_lines')
    op.drop_table('quotes')
