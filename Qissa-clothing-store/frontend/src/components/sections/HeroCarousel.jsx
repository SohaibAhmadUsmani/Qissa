import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './hero-carousel.css';

const images = [
  '/assets/images/banner-1.webp',
  '/assets/images/banner-2.webp',
  '/assets/images/banner-3.webp',
];

const INTERVAL = 2000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setActive((index + images.length) % images.length);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [isPaused, next]);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Qissa Wear banner ${i + 1}`}
          className={`hero-carousel-image ${i === active ? 'hero-carousel-image-active' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <button
        type="button"
        className="hero-carousel-arrow hero-carousel-arrow-left"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>

      <button
        type="button"
        className="hero-carousel-arrow hero-carousel-arrow-right"
        onClick={next}
        aria-label="Next slide"
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>

      <div className="hero-carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`hero-carousel-dot ${i === active ? 'hero-carousel-dot-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
