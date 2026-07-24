import { useMemo, useState } from 'react';
import { Filter, SlidersHorizontal, Search, ArrowRight, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { categoryConfig, catalogProducts } from '../data/catalog';
import './shop-pages.css';

export default function Category() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [fabricFilter, setFabricFilter] = useState('all');
  const [pieceFilter, setPieceFilter] = useState('all');
  const [stitchedFilter, setStitchedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const label = id?.replaceAll('-', ' ') || 'collection';

  const fabricOptions = ['all', 'lawn', 'chiffon', 'silk', 'karandi'];
  const pieceOptions = ['all', '1 pc', '2 pcs', '3 pcs'];
  const stitchedOptions = ['all', 'stitched', 'unstitched'];

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const categoryKey = id || 'new-arrivals';

    const scoped = catalogProducts.filter((product) => {
      const matchesCategory =
        categoryKey === 'monochrome'
          ? ['black', 'white', 'charcoal', 'ivory', 'grey'].some((shade) => product.color.toLowerCase().includes(shade))
          : categoryKey === 'sale'
            ? product.originalPrice > product.price
            : product.categoryKey === categoryKey;

      const matchesSearch =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.fabric.toLowerCase().includes(term) ||
        product.color.toLowerCase().includes(term);

      const matchesFabric = fabricFilter === 'all' || product.fabric.toLowerCase() === fabricFilter;
      const matchesPiece = pieceFilter === 'all' || product.piece === pieceFilter;
      const matchesStitched = stitchedFilter === 'all' || product.stitchedType === stitchedFilter;

      return matchesCategory && matchesSearch && matchesFabric && matchesPiece && matchesStitched;
    });

    const sorted = [...scoped];

    if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'discount') sorted.sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price));
    if (sortBy === 'stock') sorted.sort((a, b) => b.stock - a.stock);

    return sorted;
  }, [fabricFilter, id, pieceFilter, searchTerm, sortBy, stitchedFilter]);

  const categoryMeta = categoryConfig[id] || categoryConfig['new-arrivals'];

  return (
    <section className="container shop-shell">
      <div className="shop-hero reveal">
        <div>
          <p className="shop-kicker">Pakistani Womenswear / {label}</p>
          <h1 className="shop-title">{categoryMeta.title}</h1>
          <p className="shop-note">{categoryMeta.subtitle}.</p>
        </div>

      </div>

      <div className="shop-toolbar reveal delay-1">
        <label className="search-shell">
          <Search size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search lawn, chiffon, color, or style"
          />
        </label>

        <div className="toolbar-actions">
          <button type="button" className="toolbar-chip toolbar-button mobile-filter-trigger" onClick={() => setFiltersOpen(true)}>
            <Filter size={15} />
            <span>Filters</span>
          </button>
          <div className="toolbar-chip muted">
            <SlidersHorizontal size={15} />
            <span>{filteredProducts.length} products</span>
          </div>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="sort-select">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
            <option value="stock">Best Stock</option>
          </select>
        </div>
      </div>

      <div className="shop-layout reveal delay-2">
        <aside className="shop-sidebar shop-sidebar-desktop">
          {renderFilters()}
        </aside>

        <div className="shop-results">
          <div className="result-head">
            <div>
              <p className="shop-kicker">Browse Results</p>
              <h2>{filteredProducts.length} selected styles</h2>
            </div>
          </div>

          <div className="category-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>No styles matched your filters.</h3>
              <p>Try switching fabric, piece count, or sort order to discover more pieces.</p>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="filters-drawer" role="dialog" aria-modal="true" aria-label="Category filters">
          <div className="filters-backdrop" onClick={() => setFiltersOpen(false)} />
          <div className="filters-panel">
            <div className="filters-panel-head">
              <div>
                <p className="shop-kicker">Refine Selection</p>
                <h2>Filters</h2>
              </div>
              <button type="button" className="search-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            {renderFilters(true)}
          </div>
        </div>
      )}
    </section>
  );

  function renderFilters(isDrawer = false) {
    return (
      <>
        <div className="filter-panel">
          <h2>Fabric</h2>
          <div className="filter-chip-group">
            {fabricOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-chip ${fabricFilter === option ? 'active' : ''}`}
                onClick={() => setFabricFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-panel">
          <h2>Piece Count</h2>
          <div className="filter-chip-group">
            {pieceOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-chip ${pieceFilter === option ? 'active' : ''}`}
                onClick={() => setPieceFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-panel">
          <h2>Stitched Type</h2>
          <div className="filter-chip-group">
            {stitchedOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-chip ${stitchedFilter === option ? 'active' : ''}`}
                onClick={() => setStitchedFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-panel filter-panel-note">
          <h2>Why this is better</h2>
          <p>
            Less clutter, stronger hierarchy, faster selection, and a more premium visual language for Pakistani fashion shoppers.
          </p>
          <div className="filters-actions">
            <Link to="/" className="sidebar-link" onClick={() => isDrawer && setFiltersOpen(false)}>
              Return Home <ArrowRight size={13} />
            </Link>
            <button type="button" className="filters-clear" onClick={() => {
              setFabricFilter('all');
              setPieceFilter('all');
              setStitchedFilter('all');
              setSortBy('featured');
              setSearchTerm('');
            }}>
              Clear Filters
            </button>
          </div>
        </div>
      </>
    );
  }
}
