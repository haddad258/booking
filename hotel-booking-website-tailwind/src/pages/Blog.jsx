import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../utils/blogData';
import Badge from '../components/ui/Badge';

export default function Blog() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);

  const filtered = BLOG_POSTS.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display mb-6 text-3xl font-semibold text-ink sm:text-4xl">{t('nav.blog')}</h1>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <input
          placeholder="Search articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mr-2 min-w-[220px] rounded-xl border border-brand-800/15 px-3.5 py-2 text-sm outline-none focus:border-gold-400"
        />
        {BLOG_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? null : c)}
            className={[
              'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition',
              category === c ? 'border-brand-800 bg-brand-800 text-white' : 'border-brand-800/20 text-ink/70 hover:bg-brand-50',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <RouterLink key={post.slug} to={`/blog/${post.slug}`} className="hover-lift block overflow-hidden rounded-2xl border border-brand-800/10 bg-white">
            <div className="h-44 overflow-hidden"><img src={post.image} alt="" className="h-full w-full object-cover" /></div>
            <div className="p-4">
              <Badge color="gold" className="mb-2">{post.category}</Badge>
              <h3 className="font-display mb-1 text-lg font-semibold text-ink">{post.title}</h3>
              <p className="mb-2 text-sm text-ink/60">{post.excerpt}</p>
              <p className="text-xs text-ink/40">{format(new Date(post.date), 'MMM d, yyyy')}</p>
            </div>
          </RouterLink>
        ))}
        {filtered.length === 0 && <p className="text-ink/50">No articles match your search.</p>}
      </div>
    </div>
  );
}
