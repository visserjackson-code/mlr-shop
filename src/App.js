import React, { useState, useEffect } from 'react';

function App() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/records.json')
      .then(res => res.json())
      .then(data => {
        const recordsArray = data.records || [];
        setRecords(recordsArray.filter(r => r.status === 'active'));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load records:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading records...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#8a9199',
        padding: '30px 20px',
        textAlign: 'center',
        borderBottom: '3px solid #ff6b6b'
      }}>
        <img 
          src="/logo.jpg" 
          alt="Most Likely Records"
          style={{
            maxWidth: '600px',
            width: '90%',
            height: 'auto',
            margin: '0 auto',
            display: 'block',
            filter: 'brightness(1.05) contrast(1.1)'
          }}
        />
        <p style={{ 
          margin: '16px 0 0 0', 
          color: '#1a1a1a',
          fontWeight: '500',
          fontSize: '1.1rem',
          textShadow: '0 1px 2px rgba(255,255,255,0.3)'
        }}>
          Records are meant to be played!
        </p>
      </header>

      {/* Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {records.map(record => (
          <RecordCard
            key={record.id}
            record={record}
            onClick={() => setSelectedRecord(record)}
          />
        ))}
      </div>

      {records.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <h2>No records available right now</h2>
          <p>Check back soon!</p>
        </div>
      )}

      {/* Modal */}
      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}

function RecordCard({ record, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <img
        src={record.images?.cover || 'https://via.placeholder.com/300'}
        alt={`${record.artist} - ${record.title}`}
        style={{
          width: '100%',
          aspectRatio: '1',
          objectFit: 'cover',
          display: 'block'
        }}
      />
      <div style={{ padding: '16px' }}>
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#000'
        }}>
          {record.artist}
        </h3>
        <p style={{
          margin: '0 0 12px 0',
          fontSize: '0.95rem',
          color: '#666'
        }}>
          {record.title}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#000'
          }}>
            ${record.price?.toFixed(2)}
          </span>
          {record.isColored && (
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              COLORED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordModal({ record, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
        overflowY: 'auto'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          ×
        </button>

        <div style={{ padding: '30px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '30px'
          }}>
            {/* Image */}
            <div>
              <img
                src={record.images?.cover || 'https://via.placeholder.com/400'}
                alt={`${record.artist} - ${record.title}`}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
            </div>

            {/* Details */}
            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '1.8rem',
                fontWeight: '700'
              }}>
                {record.artist}
              </h2>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '1.3rem',
                fontWeight: '400',
                color: '#666'
              }}>
                {record.title}
              </h3>

              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#000'
              }}>
                ${record.price?.toFixed(2)}
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>Condition:</strong> {record.condition?.media || 'N/A'} / {record.condition?.sleeve || 'N/A'}
                </p>
                {record.sealed && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>
                    <strong>Sealed:</strong> Yes
                  </p>
                )}
                {record.year && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>
                    <strong>Year:</strong> {record.year}
                  </p>
                )}
                {record.isLimited && (
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#ff6b6b', fontWeight: '600' }}>
                    LIMITED EDITION
                  </p>
                )}
              </div>

              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#333',
                marginBottom: '24px'
              }}>
                {record.descriptions?.short || record.description || ''}
              </p>

              {/* PayPal Button */}
              <div style={{
                padding: '20px',
                backgroundColor: '#0070ba',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: '0 0 12px 0',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '1.1rem'
                }}>
                  Ready to buy?
                </p>
                <a
                  href="https://venmo.com/Jackson-Visser"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    backgroundColor: '#ffc439',
                    color: '#000',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    fontSize: '1.1rem'
                  }}
                >
                  {/* Pay with Venmo */}
                </a>
                <p style={{
                  margin: '12px 0 0 0',
                  fontSize: '0.85rem',
                  color: '#fff',
                  opacity: 0.9
                }}>
                  After payment, email confirmation to{' '}
                  <a href="mailto:visserjackson@gmail.com" style={{ color: '#ffc439' }}>
                    visserjackson@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Extended Description */}
          {record.descriptions?.medium && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#555'
              }}>
                {record.descriptions.medium}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;