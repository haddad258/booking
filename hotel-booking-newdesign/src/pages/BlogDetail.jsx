import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import { format } from 'date-fns';
import { BLOG_POSTS } from '../utils/blogData';

export default function BlogDetail() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5">Article not found.</Typography>
        <Button component={RouterLink} to="/blog" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>Back to blog</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button component={RouterLink} to="/blog" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>Back to blog</Button>
      <Chip label={post.category} size="small" sx={{ mb: 2 }} />
      <Typography variant="h3" fontWeight={700} gutterBottom>{post.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{format(new Date(post.date), 'MMMM d, yyyy')}</Typography>
      <Box sx={{ height: 360, borderRadius: 3, backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center', mb: 4 }} />
      <Typography sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>{post.content}</Typography>
    </Container>
  );
}
