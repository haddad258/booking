import { useParams, Link as RouterLink } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { BLOG_POSTS } from '../utils/blogData';
import Badge from '../components/ui/Badge';

export default function BlogDetail() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-xl text-ink">Article not found.</p>
        <RouterLink to="/blog" className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
          <ArrowLeftIcon className="h-4 w-4" /> Back to blog
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <RouterLink to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeftIcon className="h-4 w-4" /> Back to blog
      </RouterLink>
      <Badge color="gold" className="mb-3">{post.category}</Badge>
      <h1 className="font-display mb-2 text-3xl font-semibold text-ink sm:text-4xl">{post.title}</h1>
      <p className="mb-6 text-sm text-ink/50">{format(new Date(post.date), 'MMMM d, yyyy')}</p>
      <div className="mb-8 h-72 overflow-hidden rounded-2xl sm:h-96"><img src={post.image} alt="" className="h-full w-full object-cover" /></div>
      <p className="whitespace-pre-line leading-8 text-ink/80">{post.content}</p>
    </div>
  );
}
