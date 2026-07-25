import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Grid, Card, CardActionArea, CardContent, Box, Typography, TextField, Chip, Stack } from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../utils/blogData';

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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>{t('nav.blog')}</Typography>

      <Stack direction="row" spacing={1.5} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
        <TextField size="small" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mr: 2, minWidth: 220 }} />
        {BLOG_CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c}
            onClick={() => setCategory(category === c ? null : c)}
            color={category === c ? 'secondary' : 'default'}
            variant={category === c ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {filtered.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.slug}>
            <Card>
              <CardActionArea component={RouterLink} to={`/blog/${post.slug}`}>
                <Box sx={{ height: 180, backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <CardContent>
                  <Chip label={post.category} size="small" sx={{ mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{post.excerpt}</Typography>
                  <Typography variant="caption" color="text.secondary">{format(new Date(post.date), 'MMM d, yyyy')}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {filtered.length === 0 && <Grid item xs={12}><Typography color="text.secondary">No articles match your search.</Typography></Grid>}
      </Grid>
    </Container>
  );
}
