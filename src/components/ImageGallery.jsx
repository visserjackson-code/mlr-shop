// src/components/ImageGallery.jsx
import { useMemo, useState, useEffect, useCallback } from "react";
import { BsRewind, BsFastForward } from "react-icons/bs";

export default function ImageGallery({ images = [], enableKeyboard = false }) {
  // Clean/validate images (avoid null/undefined)
  const cleaned = useMemo(() => images.filter(Boolean), [images]);

  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = cleaned.length > 0;
  const activeSrc = hasImages ? cleaned[activeIndex] : null;

  useEffect(() => {
    setActiveIndex(0);
  }, [cleaned.length]);

  const prev = useCallback(() => {
    if (!hasImages) return;
    setActiveIndex((idx) => (idx === 0 ? cleaned.length - 1 : idx - 1));
  }, [hasImages, cleaned.length]);

  const next = useCallback(() => {
    if (!hasImages) return;
    setActiveIndex((idx) => (idx === cleaned.length - 1 ? 0 : idx + 1));
  }, [hasImages, cleaned.length]);

  function select(i) {
    setActiveIndex(i);
  }

  useEffect(() => {
    if (!enableKeyboard) return;

    const onKeyDown = (e) => {
      // Don't hijack arrows while user is typing / focusing form controls
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableKeyboard, prev, next]);

  return (
    <div>
      {/* Main image */}
      <div className="zoomWrap mb-2">
        {hasImages ? (
          <img className="zoomImg w-100" src={activeSrc} alt="" />
        ) : (
          <div className="border rounded p-5 text-center text-muted">
            No images yet
          </div>
        )}
      </div>

      {/* Arrows */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          type="button"
          className="gallery-arrow prev"
          onClick={prev}
          disabled={!hasImages}
          aria-label="Previous image"
        >
          <BsRewind />
        </button>

        <div className="text-muted small">
          {hasImages ? `${activeIndex + 1} / ${cleaned.length}` : ""}
        </div>

        <button
          type="button"
          className="gallery-arrow next"
          onClick={next}
          disabled={!hasImages}
          aria-label="Next image"
        >
          <BsFastForward />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="d-flex gap-2 flex-wrap">
        {cleaned.map((src, i) => (
          <button
            key={src + i}
            type="button"
            className={`thumbBtn ${i === activeIndex ? "thumbActive" : ""}`}
            onClick={() => select(i)}
            aria-label={`Select image ${i + 1}`}
          >
            <img className="thumbImg" src={src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
