import React, { useState, useEffect, useMemo } from 'react';

// Bauhaus color palette
const colors = {
  skyBlue: '#87CEEB',
  turquoise: '#40E0D0',
  orange: '#FF6B35',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#F5F5F5'
};

// Move window size check outside component to avoid re-renders
const useWindowSize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
};

function App() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('shop'); // 'shop' or 'about'
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');
  const isMobile = useWindowSize();

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

  // Memoize expensive filtering and sorting
  const activeRecords = useMemo(() => 
    records.filter(r => !r.soldAt),
    [records]
  );
  
  const allGenres = useMemo(() => 
    ['ALL', ...new Set(activeRecords.flatMap(r => r.genre || []))].sort(),
    [activeRecords]
  );
  
  const filtered = useMemo(() => 
    selectedGenre === 'ALL' 
      ? activeRecords 
      : activeRecords.filter(r => (r.genre || []).includes(selectedGenre)),
    [activeRecords, selectedGenre]
  );
  
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'artist-az') {
        const normalize = str => (str || '').toLowerCase().replace(/^(a\s+|an\s+|the\s+)/i, '').trim();
        return normalize(a.artist).localeCompare(normalize(b.artist));
      }
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [filtered, sortBy]);

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
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '15px' : '0'
        }}>
          <img 
            src="/data/logo_vibrant.png"
            alt="Most Likely Records"
            loading="eager" // Logo should load immediately
            style={{
              height: '140px',
              cursor: 'pointer',
              backgroundColor: colors.white,
              padding: '10px',
              borderRadius: '8px',
              imageRendering: 'crisp-edges',
              filter: 'none',
              opacity: 1
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
                  }}
                >
                  SURPRISE ME
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '40px 20px'
          }}>
            <div style={{
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
          </div>
        </>
      )}

      {/* Modal */}
      {selectedRecord && (
        <RecordModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

// Separate RecordCard component to optimize re-renders
const RecordCard = React.memo(({ record, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.white,
        border: `3px solid ${colors.black}`,
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <img
        src={record.images?.cover}
        alt={`${record.artist} - ${record.title}`}
        loading="lazy" // LAZY LOAD GRID IMAGES
        style={{
          width: '100%',
          display: 'block',
          borderBottom: `3px solid ${colors.black}`
        }}
      />
      <div style={{ padding: '20px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '1.1rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {record.artist}
        </h3>
        <p style={{
          margin: '0 0 12px 0',
          fontSize: '0.9rem',
          fontWeight: '500',
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
            fontWeight: '700',
            color: colors.orange
          }}>
            ${record.price?.toFixed(2)}
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '4px 8px',
            backgroundColor: colors.skyBlue,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {record.condition?.media}
          </span>
        </div>
      </div>
    </div>
  );
});

// Separate modal component with lazy Spotify loading
function RecordModal({ record, onClose, isMobile }) {
  const [showSpotify, setShowSpotify] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.black}`,
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            backgroundColor: colors.orange,
            border: `3px solid ${colors.black}`,
            fontSize: '1.5rem',
            fontWeight: '700',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ×
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '40px',
          padding: '40px'
        }}>
          {/* Left: Images */}
          <div>
            <ImageGallery record={record} />
          </div>

          {/* Right: Details */}
          <div>
            <h2 style={{
              margin: '0 0 12px 0',
              fontSize: '1.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {record.artist}
            </h2>
            
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '1.2rem',
              fontWeight: '500',
              color: '#666'
            }}>
              {record.title}
            </h3>

            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: colors.orange,
              marginBottom: '30px'
            }}>
              ${record.price?.toFixed(2)}
            </div>

            {/* Condition */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px'
              }}>
                CONDITION
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: colors.skyBlue,
                  border: `2px solid ${colors.black}`,
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  MEDIA: {record.condition?.media}
                </span>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: colors.turquoise,
                  border: `2px solid ${colors.black}`,
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  SLEEVE: {record.condition?.sleeve}
                </span>
              </div>
            </div>

            {/* Description */}
            {record.descriptions?.short && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {record.descriptions.short}
                </p>
              </div>
            )}

            {/* Spotify - LAZY LOAD */}
            {record.spotify?.albumURL && (
              <div style={{ marginBottom: '20px' }}>
                {!showSpotify ? (
                  <button
                    onClick={() => setShowSpotify(true)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#1DB954',
                      color: colors.white,
                      border: `3px solid ${colors.black}`,
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    ▶ PREVIEW ON SPOTIFY
                  </button>
                ) : (
                  <iframe
                    src={`https://open.spotify.com/embed/album/${record.spotify.albumURL.split('/album/')[1]?.split('?')[0]}`}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="encrypted-media"
                    title="Spotify Player"
                    style={{
                      border: `3px solid ${colors.black}`
                    }}
                  />
                )}
              </div>
            )}

            {/* Purchase button */}
            <a
              href={`mailto:mostlikelyrecords@gmail.com?subject=Interested in ${record.artist} - ${record.title}`}
              style={{
                display: 'block',
                width: '100%',
                padding: '20px',
                backgroundColor: colors.orange,
                border: `3px solid ${colors.black}`,
                textAlign: 'center',
                color: colors.white,
                fontSize: '1.2rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              PURCHASE
            </a>
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
        loading="eager" // Modal images should load immediately when opened
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
                  loading="lazy" // Thumbnail images can lazy load
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

// about me
function AboutPage() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '90px 0px'
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
        lineHeight: '2.1',
        color: '#333',
        paddingBottom: '30px'
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

export default App;