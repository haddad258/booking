import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Grid, Stack, Button, CircularProgress, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import PageHeader from '../components/PageHeader';
import ImageUploader from '../components/ImageUploader';
import useToast from '../hooks/useToast';
import chaletService from '../services/chalet.service';

export default function ChaletDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [chalet, setChalet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await chaletService.getById(id);
    setChalet(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpload = async (files) => {
    setUploading(true);
    try {
      await chaletService.uploadImages(id, files);
      toast.success('Images uploaded');
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await chaletService.removeImage(id, imageId);
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !chalet) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/chalets')} sx={{ mb: 2 }}>
        Back to chalets
      </Button>

      <PageHeader title={chalet.name} subtitle={`${chalet.city}, ${chalet.country}`} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Amenities</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {chalet.amenities?.length ? (
                chalet.amenities.map((a) => <Chip key={a.id} label={a.name} size="small" />)
              ) : (
                <Typography variant="body2" color="text.secondary">No amenities assigned yet.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Gallery</Typography>
            <ImageUploader images={chalet.images} onUpload={handleUpload} onRemove={handleRemoveImage} uploading={uploading} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
