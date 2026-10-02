import React from 'react';

export default function Table({ columns, data, emptyMessage = 'No records found.' }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '32px 24px', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {columns.map((col) => (
              <th key={col.key} style={{
                padding: '11px 16px', textAlign: col.align || 'left',
                fontWeight: 600, color: '#374151', fontSize: '0.8125rem',
                whiteSpace: 'nowrap', letterSpacing: '.02em',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row._id || i} style={{
              borderBottom: '1px solid #f3f4f6',
              transition: 'background .12s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              {columns.map((col) => (
                <td key={col.key} style={{
                  padding: '13px 16px', color: '#374151',
                  textAlign: col.align || 'left', verticalAlign: 'middle',
                }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
