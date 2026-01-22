import React, { useState, useEffect } from 'react';

// Bauhaus color palette
const colors = {
  skyBlue: '#87CEEB',
  turquoise: '#40E0D0',
  orange: '#FF6B35',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#F5F5F5'
};

function App() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('shop'); // 'shop' or 'about'
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');

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

  const activeRecords = records.filter(r => !r.soldAt);
  
  // Get unique genres
  const allGenres = ['ALL', ...new Set(activeRecords.flatMap(r => r.genre || []))].sort();
  
  // Filter
  const filtered = selectedGenre === 'ALL' 
    ? activeRecords 
    : activeRecords.filter(r => (r.genre || []).includes(selectedGenre));
  
  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'artist-az') {
      const normalize = str => (str || '').toLowerCase().replace(/^(a\s+|an\s+|the\s+)/i, '').trim();
      return normalize(a.artist).localeCompare(normalize(b.artist));
    }
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '1.5rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        LOADING...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.gray,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: colors.black,
        padding: '20px 0',
        borderBottom: `4px solid ${colors.orange}`
      }}>
        <div style={{ 
  maxWidth: '1400px', 
  margin: '0 auto', 
  padding: '0 20px',
  display: 'flex',
  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: window.innerWidth < 768 ? '15px' : '0'
}}>
         <img 
  src="/data/logo_vibrant.png"  // Use the new vibrant version
  alt="Most Likely Records"
  style={{
    height: '140px',
    cursor: 'pointer',
    backgroundColor: colors.white,
    padding: '10px',
    borderRadius: '8px',
    imageRendering: 'crisp-edges',  // Prevent any softening
    filter: 'none',  // Ensure no filters are applied
    opacity: 1  // Force full opacity
  }}
  onClick={() => setPage('shop')}
/>
          <nav style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setPage('shop')}
              style={{
                background: 'none',
                border: 'none',
                color: page === 'shop' ? colors.turquoise : colors.white,
                fontSize: '1rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              SHOP
            </button>
            <button
              onClick={() => setPage('about')}
              style={{
                background: 'none',
                border: 'none',
                color: page === 'about' ? colors.turquoise : colors.white,
                fontSize: '1rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              ABOUT
            </button>
          </nav>
        </div>
      </header>

      {page === 'about' ? (
        <AboutPage />
      ) : (
        <>
          {/* Filters */}
          <div style={{
            backgroundColor: colors.white,
            padding: '30px 0',
            borderBottom: `2px solid ${colors.skyBlue}`
          }}>
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}>
                  GENRE
                </label>
                <select
                  value={selectedGenre}
                  onChange={e => setSelectedGenre(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${colors.black}`,
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {allGenres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}>
                  SORT BY
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${colors.black}`,
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <option value="default">DEFAULT</option>
                  <option value="artist-az">ARTIST A-Z</option>
                  <option value="price-low">PRICE: LOW-HIGH</option>
                  <option value="price-high">PRICE: HIGH-LOW</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}>
                  FEELING LUCKY?
                </label>
                <button
                  onClick={() => {
                    const randomIndex = Math.floor(Math.random() * sorted.length);
                    if (sorted[randomIndex]) {
                      setSelectedRecord(sorted[randomIndex]);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${colors.black}`,
                    backgroundColor: colors.skyBlue,
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    animation: 'spin 2s linear infinite',
                    fontSize: '1.2rem'
                  }}>
                    💿
                  </span>
                  RANDOM
                  <style>{`
                    @keyframes spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '40px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {sorted.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                onClick={() => setSelectedRecord(record)}
              />
            ))}
          </div>

          {sorted.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              fontSize: '1.2rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              NO RECORDS FOUND
            </div>
          )}

          {selectedRecord && (
            <RecordModal
              record={selectedRecord}
              onClose={() => setSelectedRecord(null)}
            />
          )}
        </>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: colors.black,
        borderTop: `4px solid ${colors.turquoise}`,
        padding: '40px 20px',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <img 
            src="/data/logo_vibrant.png" 
            alt="Most Likely Records"
            style={{
              height: '120px',
              backgroundColor: colors.white,
              padding: '15px',
              border: `3px solid ${colors.orange}`,
              borderRadius: '8px'
            }}
          />
          <div style={{
            color: colors.white,
            fontSize: '0.85rem',
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
              MOST LIKELY RECORDS
            </p>
            <p style={{ margin: '0', color: colors.gray }}>
              Richmond, VA • <a href="mailto:visserjackson@gmail.com" style={{ color: colors.turquoise, textDecoration: 'none' }}>visserjackson@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '60px 20px'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '30px',
        color: colors.black
      }}>
        ABOUT
      </h1>

      <div style={{
        fontSize: '1.1rem',
        lineHeight: '1.8',
        color: '#333'
      }}>
        <p style={{ marginBottom: '20px' }}>
Most Likely Records is a curated vinyl shop run by me,
 Jackson—a longtime music fan who's relatively new to vinyl collecting.
  I focus on hip-hop (particularly underground and alternative scenes like
   Griselda and early Southern rap), post-punk and new wave classics (Joy Division, The Cure),
    and the occasional unexpected find (Pokémon soundtracks, Trans-Siberian Orchestra).
     The collection prioritizes cult favorites, limited pressings, and records
      with strong personal appeal over mass market hits.
       Most records are one-of-one—once they're gone, they're gone.
        I've been running this online and offline for 6 months and am gauging whether it becomes a sustainable side hustle,
         a significant income stream, or if I'll pivot back to local hand-to-hand sales and trades.
         Your purchases directly inform that decision.
</p>
        <p style={{ marginBottom: '20px' }}>
          Every record here has been carefully selected and graded honestly. All records are stored vertically in a climate-controlled home environment away from direct sunlight. I'm based in Richmond, Virginia, and ship within the US.
        </p>

        <p style={{ marginBottom: '20px' }}>
          If you have questions about a specific record, want more photos, or need help with anything, just email me at <a href="mailto:visserjackson@gmail.com" style={{ color: colors.orange, fontWeight: '600' }}>visserjackson@gmail.com</a>.
        </p>

        <div style={{
          marginTop: '40px',
          padding: '30px',
          backgroundColor: colors.skyBlue,
          border: `3px solid ${colors.black}`
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '20px',
            color: colors.black
          }}>
            HOW TO BUY
          </h2>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Browse the shop and click on any record for details</li>
            <li>Pay via Venmo (scan QR code or click the payment link)</li>
            <li>Email me confirmation at visserjackson@gmail.com</li>
            <li>I'll ship within 1-2 business days and send tracking</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function RecordCard({ record, onClick }) {
  const hasCoverImage = record?.images?.cover;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        backgroundColor: colors.white,
        border: `3px solid ${colors.black}`,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: '100%',
        aspectRatio: '1',
        backgroundColor: colors.gray,
        borderBottom: `3px solid ${colors.black}`,
        overflow: 'hidden'
      }}>
        {hasCoverImage ? (
          <img
            src={record.images.cover}
            alt={`${record.artist} - ${record.title}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: '#999'
          }}>
            NO IMAGE
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        <h2 style={{
          margin: '0 0 6px 0',
          fontSize: '1.1rem',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: colors.black
        }}>
          {record.artist}
        </h2>

        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '0.9rem',
          fontWeight: '400',
          color: '#666',
          lineHeight: '1.3'
        }}>
          {record.title}
        </h3>

        <div style={{
          fontSize: '1.5rem',
          fontWeight: '900',
          color: colors.orange,
          marginBottom: '12px'
        }}>
          ${record.price?.toFixed(2)}
        </div>

        <VinylColorDisplay record={record} />

        <div style={{
          marginTop: '8px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#666'
        }}>
          {record.condition?.media || 'N/A'} / {record.condition?.sleeve || 'N/A'}
          {record.sealed && <span style={{ marginLeft: '8px', color: colors.turquoise }}>• SEALED</span>}
        </div>

        <LimitedBadge record={record} />
      </div>
    </div>
  );
}

function VinylColorDisplay({ record }) {
  const displayMode = record?.colorDisplay?.mode || 'standardBlack';
  const discs = record?.colorDisplay?.discs || [];

  if (displayMode === 'standardBlack') {
    return null;
  }

  if (displayMode === 'singleDisc' && discs.length > 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px'
      }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: discs[0].hex,
            border: `2px solid ${colors.black}`,
            flexShrink: 0
          }}
        />
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          color: '#666'
        }}>
          {discs[0].name}
        </span>
      </div>
    );
  }

  if (displayMode === 'multiDisc' && discs.length > 0) {
    return (
      <div style={{
        marginTop: '8px'
      }}>
        {discs.map((disc, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: disc.hex,
                border: `2px solid ${colors.black}`,
                flexShrink: 0
              }}
            />
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '600',
              color: '#666'
            }}>
              {disc.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (displayMode === 'blend' && discs.length > 0) {
    const gradientColors = discs.map(d => d.hex).join(', ');
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px'
      }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${gradientColors})`,
            border: `2px solid ${colors.black}`,
            flexShrink: 0
          }}
        />
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          color: '#666'
        }}>
          Color Blend
        </span>
      </div>
    );
  }

  return null;
}

function VinylColorDisplayLarge({ record }) {
  const displayMode = record?.colorDisplay?.mode || 'standardBlack';
  const discs = record?.colorDisplay?.discs || [];

  if (displayMode === 'standardBlack') {
    return null;
  }

  if (displayMode === 'singleDisc' && discs.length > 0) {
    return (
      <div style={{
        padding: '12px',
        backgroundColor: colors.gray,
        border: `2px solid ${colors.black}`,
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: discs[0].hex,
            border: `3px solid ${colors.black}`,
            flexShrink: 0
          }}
        />
        <div>
          <div style={{
            fontSize: '0.9rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '2px'
          }}>
            {discs[0].name}
          </div>
          {discs[0].note && (
            <div style={{
              fontSize: '0.75rem',
              color: '#666',
              fontStyle: 'italic'
            }}>
              {discs[0].note}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (displayMode === 'multiDisc' && discs.length > 0) {
    return (
      <div style={{
        padding: '12px',
        backgroundColor: colors.gray,
        border: `2px solid ${colors.black}`,
        marginTop: '12px'
      }}>
        {discs.map((disc, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: i < discs.length - 1 ? '12px' : '0'
          }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: disc.hex,
                border: `3px solid ${colors.black}`,
                flexShrink: 0
              }}
            />
            <div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {disc.name}
              </div>
              {disc.note && (
                <div style={{
                  fontSize: '0.7rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {disc.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayMode === 'blend' && discs.length > 0) {
    const gradientColors = discs.map(d => d.hex).join(', ');
    return (
      <div style={{
        padding: '12px',
        backgroundColor: colors.gray,
        border: `2px solid ${colors.black}`,
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${gradientColors})`,
            border: `3px solid ${colors.black}`,
            flexShrink: 0
          }}
        />
        <div style={{
          fontSize: '0.9rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Color Blend
        </div>
      </div>
    );
  }

  return null;
}

function LimitedBadge({ record }) {
  if (!record?.isLimited) return null;

  const hasNumber = record.limitedNumber && record.limitedTotal;
  const hasRetailer = record.limitedRetailer;
  const hasDetails = record.limitedDetails;

  return (
    <div style={{
      marginTop: '8px',
      padding: '6px 10px',
      backgroundColor: colors.orange,
      border: `2px solid ${colors.black}`,
      display: 'inline-block',
      fontSize: '0.7rem',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: colors.white
    }}>
      {hasNumber ? `LIMITED #${record.limitedNumber}/${record.limitedTotal}` : 
       hasRetailer ? `LIMITED (${record.limitedRetailer})` :
       hasDetails ? 'LIMITED EDITION' :
       'LIMITED'}
    </div>
  );
}

function SpotifyEmbed({ albumURL }) {
  if (!albumURL) return null;

  const embedURL = albumURL.replace('/album/', '/embed/album/');

  return (
    <div style={{
      border: `2px solid ${colors.black}`,
      overflow: 'hidden',
      height: '352px'
    }}>
      <iframe
        src={embedURL}
        width="100%"
        height="352"
        frameBorder="0"
        allow="encrypted-media"
        title="Spotify Player"
        style={{ display: 'block' }}
      />
    </div>
  );
}

function RecordModal({ record, onClose }) {
  useEffect(() => {
    const onEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: colors.white,
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `4px solid ${colors.black}`,
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            backgroundColor: colors.black,
            color: colors.white,
            border: 'none',
            fontSize: '1.5rem',
            fontWeight: '700',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        <div style={{ padding: '10px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '10px'
          }}>
            <ImageGallery record={record} />

            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '2rem',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {record.artist}
              </h2>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '1.1rem',
                fontWeight: '400',
                color: '#666'
              }}>
                {record.title}
              </h3>

              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                marginBottom: '20px',
                color: colors.black
              }}>
                ${record.price?.toFixed(2)}
              </div>

              <VinylColorDisplayLarge record={record} />

              <div style={{
                padding: '16px',
                backgroundColor: colors.gray,
                border: `2px solid ${colors.black}`,
                marginTop: '16px',
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>
                  <strong>CONDITION:</strong> {record.condition?.media || 'N/A'} / {record.condition?.sleeve || 'N/A'}
                </p>
                {record.sealed && <p style={{ margin: '0 0 8px 0' }}><strong>SEALED</strong></p>}
                {record.year && <p style={{ margin: '0 0 8px 0' }}><strong>YEAR:</strong> {record.year}</p>}
                <LimitedBadge record={record} />
              </div>

              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#333'
              }}>
                {record.descriptions?.short || record.description || ''}
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {record.descriptions?.medium && (
              <div style={{
                padding: '20px',
                backgroundColor: colors.gray,
                border: `2px solid ${colors.black}`,
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#555'
              }}>
                {record.descriptions.medium}
              </div>
            )}

            <SpotifyEmbed albumURL={record.spotify?.albumURL} />
          </div>

          <div style={{
            padding: '30px',
            backgroundColor: colors.turquoise,
            border: `4px solid ${colors.black}`,
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '1.5rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: colors.black
            }}>
              READY TO BUY?
            </h3>

            <div style={{
              backgroundColor: colors.white,
              border: `3px solid ${colors.black}`,
              padding: '16px',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              <img 
                src="/data/venmo-qr.jpg" 
                alt="Venmo QR Code"
                style={{
                  width: '200px',
                  height: '200px',
                  display: 'block'
                }}
              />
            </div>

            <a
              href={`https://venmo.com/u/Jackson-Visser?txn=pay&amount=${record.price}&note=${encodeURIComponent(record.artist + ' - ' + record.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                backgroundColor: colors.orange,
                color: colors.white,
                textDecoration: 'none',
                fontWeight: '900',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: `3px solid ${colors.black}`,
                marginBottom: '16px'
              }}
            >
              PAY ${record.price?.toFixed(2)}
            </a>

            <p style={{
              margin: '0 0 8px 0',
              fontSize: '0.9rem',
              color: colors.black,
              fontWeight: '600'
            }}>
              Scan QR or click button • Then email confirmation
            </p>

            <p style={{ margin: '0', fontSize: '0.85rem', color: colors.black }}>
              <a href="mailto:visserjackson@gmail.com" style={{ color: colors.black, fontWeight: '700' }}>
                visserjackson@gmail.com
              </a>
            </p>

            <p style={{ margin: '16px 0 0 0', fontSize: '0.85rem', color: colors.black, fontStyle: 'italic' }}>
              Don't have Venmo? Email to arrange payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ record }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    record?.images?.cover,
    record?.images?.back,
    record?.images?.disc,
    ...(record?.images?.others ? Object.values(record.images.others) : [])
  ].filter(Boolean);

  useEffect(() => {
    setActiveIndex(0);
  }, [record?.id]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex(idx => (idx === 0 ? images.length - 1 : idx - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex(idx => (idx === images.length - 1 ? 0 : idx + 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div style={{
        width: '100%',
        aspectRatio: '1',
        backgroundColor: colors.gray,
        border: `3px solid ${colors.black}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        textTransform: 'uppercase'
      }}>
        NO IMAGES
      </div>
    );
  }

  return (
    <div>
      <img
        src={images[activeIndex]}
        alt=""
        style={{
          width: '100%',
          border: `3px solid ${colors.black}`,
          display: 'block',
          marginBottom: '12px'
        }}
      />

      {images.length > 1 && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <button
              onClick={() => setActiveIndex(idx => (idx === 0 ? images.length - 1 : idx - 1))}
              style={{
                background: colors.black,
                color: colors.white,
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: '700'
              }}
            >
              «
            </button>

            <span style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {activeIndex + 1} / {images.length}
            </span>

            <button
              onClick={() => setActiveIndex(idx => (idx === images.length - 1 ? 0 : idx + 1))}
              style={{
                background: colors.black,
                color: colors.white,
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: '700'
              }}
            >
              »
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: '60px',
                  height: '60px',
                  padding: 0,
                  border: `3px solid ${i === activeIndex ? colors.orange : colors.black}`,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  backgroundColor: 'transparent'
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
