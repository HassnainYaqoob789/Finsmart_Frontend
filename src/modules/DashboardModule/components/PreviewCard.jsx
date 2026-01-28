import { useMemo } from 'react';
import { Col, Spin } from 'antd';
import useLanguage from '@/locale/useLanguage';

const colours = {
  draft: '#8b5cf6',
  sent: '#3b82f6',
  pending: '#06b6d4',
  unpaid: '#f59e0b',
  overdue: '#ef4444',
  partially: '#10b981',
  paid: '#22c55e',
  declined: '#ef4444',
  accepted: '#22c55e',
  expired: '#6b7280',
};

const defaultStatistics = [
  { tag: 'draft', value: 0 },
  { tag: 'pending', value: 0 },
  { tag: 'sent', value: 0 },
  { tag: 'accepted', value: 0 },
  { tag: 'declined', value: 0 },
  { tag: 'expired', value: 0 },
];

const defaultInvoiceStatistics = [
  { tag: 'draft', value: 0 },
  { tag: 'pending', value: 0 },
  { tag: 'overdue', value: 0 },
  { tag: 'paid', value: 0 },
  { tag: 'unpaid', value: 0 },
  { tag: 'partially', value: 0 },
];

const PreviewState = ({ tag, value }) => {
  const translate = useLanguage();
  const color = colours[tag] || '#6b7280';
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '8px',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 10px ${color}40`
          }} />
          <span style={{ 
            color: '#1f2937',
            fontSize: '14px',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {translate(tag)}
          </span>
        </div>
        <span style={{ 
          color: color,
          fontSize: '16px',
          fontWeight: '700'
        }}>
          {value}%
        </span>
      </div>
      
      {/* Modern Progress Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: '#f3f4f6',
        borderRadius: '999px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: '999px',
          transition: 'width 1s ease',
          boxShadow: `0 0 10px ${color}60`
        }} />
      </div>
    </div>
  );
};

export default function PreviewCard({
  title = 'Preview',
  statistics = defaultStatistics,
  isLoading = false,
  entity = 'invoice',
}) {
  const statisticsMap = useMemo(() => {
    if (entity === 'invoice') {
      return defaultInvoiceStatistics.map((defaultStat) => {
        const matchedStat = Array.isArray(statistics)
          ? statistics.find((stat) => stat.tag === defaultStat.tag)
          : null;
        return matchedStat || defaultStat;
      });
    } else {
      return defaultStatistics.map((defaultStat) => {
        const matchedStat = Array.isArray(statistics)
          ? statistics.find((stat) => stat.tag === defaultStat.tag)
          : null;
        return matchedStat || defaultStat;
      });
    }
  }, [statistics, entity]);

  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 24 }}
      md={{ span: 12 }}
      lg={{ span: 12 }}
    >
      <div style={{ 
        padding: '28px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        height: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '28px',
        }}>
          <div style={{
            width: '4px',
            height: '24px',
            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '999px',
            marginRight: '12px'
          }} />
          <h3
            style={{
              color: '#1f2937',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div>
            {statisticsMap?.map((status, index) => (
              <PreviewState key={index} tag={status.tag} value={status?.value} />
            ))}
          </div>
        )}
      </div>
    </Col>
  );
}