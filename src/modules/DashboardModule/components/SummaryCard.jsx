import React from 'react';
import { Row, Col, Spin, Tooltip } from 'antd';
import { TrendingUp, FileText, AlertCircle } from 'lucide-react';

// Custom money formatter that uses "PKR"
const moneyFormatter = ({ amount }) => {
  if (!amount && amount !== 0) return 'PKR 0';
  return `PKR ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
  })}`;
};

// Color mapping for different card types
const colorMap = {
  invoice: {
    bg: '#FFFFFF',
    accent: '#1E88E5',
    light: '#E3F2FD',
    border: '#BBDEFB',
  },
  quote: {
    bg: '#FFFFFF',
    accent: '#1565C0',
    light: '#C5CAE9',
    border: '#BBDEFB',
  },
  paid: {
    bg: '#FFFFFF',
    accent: '#43A047',
    light: '#E8F5E9',
    border: '#C8E6C9',
  },
  unpaid: {
    bg: '#FFFFFF',
    accent: '#E53935',
    light: '#FFEBEE',
    border: '#FFCDD2',
  },
};

const icons = {
  invoice: FileText,
  quote: FileText,
  paid: FileText,
  unpaid: AlertCircle,
};

export default function AnalyticSummaryCard({
  title = 'Invoices',
  data = 12500,
  prefix = 'This month',
  isLoading = false,
  type = 'invoice',
}) {
  const Icon = icons[type] || FileText;
  const colors = colorMap[type] || colorMap.invoice;

  return (
    <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
      <div
        style={{
          background: colors.bg,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          padding: '24px',
          minHeight: '160px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(13, 27, 42, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(13, 27, 42, 0.12)';
          e.currentTarget.style.borderColor = colors.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(13, 27, 42, 0.08)';
          e.currentTarget.style.borderColor = colors.border;
        }}
      >
        {/* Decorative accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: colors.accent,
          }}
        />

        {/* Background Icon */}
        <div
          style={{
            position: 'absolute',
            right: '-15px',
            top: '-15px',
            opacity: 0.08,
          }}
        >
          <Icon size={110} color={colors.accent} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div
              style={{
                background: colors.light,
                borderRadius: '10px',
                padding: '10px',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={20} color={colors.accent} />
            </div>
            <h3
              style={{
                color: '#1A1A1A',
                fontSize: '15px',
                margin: 0,
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              {title}
            </h3>
          </div>

          {/* Prefix */}
          <div
            style={{
              color: '#4F5B66',
              fontSize: '12px',
              marginBottom: '12px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {prefix}
          </div>

          {/* Main Value */}
          {isLoading ? (
            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              <Spin size="small" />
            </div>
          ) : (
            <Tooltip title={moneyFormatter({ amount: data })}>
              <div
                style={{
                  color: colors.accent,
                  fontSize: '28px',
                  fontWeight: '700',
                  marginTop: '8px',
                  letterSpacing: '-0.5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {moneyFormatter({ amount: data })}
              </div>
            </Tooltip>
          )}

          {/* Trend Indicator */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              color: colors.accent,
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            <TrendingUp size={15} style={{ marginRight: '6px' }} />
            <span>View Details</span>
          </div>
        </div>
      </div>
    </Col>
  );
}

// Demo component
export function CardDemo() {
  const cards = [
    { title: 'Invoices', data: 45280, prefix: 'This month', type: 'invoice' },
    { title: 'Quotes', data: 12450, prefix: 'This month', type: 'quote' },
    { title: 'Paid', data: 38920, prefix: 'This month', type: 'paid' },
    { title: 'Unpaid', data: 6360, prefix: 'Not paid', type: 'unpaid' },
  ];

  return (
    <div style={{ padding: '40px', background: '#F5F7FA', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#1A1A1A', marginBottom: '32px', fontSize: '28px', fontWeight: '700' }}>
          Dashboard Summary
        </h1>
        <Row gutter={[24, 24]}>
          {cards.map((card, index) => (
            <AnalyticSummaryCard key={index} {...card} />
          ))}
        </Row>
      </div>
    </div>
  );
}
