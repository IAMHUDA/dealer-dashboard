import React from 'react';

const Table = ({ headers, data, renderRow, loading }) => {
  return (
    <div style={{ 
      width: '100%', 
      overflowX: 'auto',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--glass-border)',
      backgroundColor: 'rgba(30, 41, 59, 0.3)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
            {headers.map((header, idx) => (
              <th key={idx} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="loader" style={{ margin: '0 auto' }}></div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr 
                key={idx} 
                style={{ 
                  borderBottom: idx === data.length - 1 ? 'none' : '1px solid var(--glass-border)',
                  transition: 'var(--transition)'
                }}
                className="table-row"
              >
                {renderRow(item)}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>{`
        .table-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};

export default Table;
