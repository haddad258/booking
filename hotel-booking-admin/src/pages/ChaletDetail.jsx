import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Grid, Button, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import PageHeader from '../components/PageHeader';
import ImageUploader from '../components/ImageUploader';
import LocationMapPicker from '../components/LocationMapPicker';
import AmenitiesManager from '../components/AmenitiesManager';
import DescriptionsManager from '../components/DescriptionsManager';
import useToast from '../hooks/useToast';
import chaletService from '../services/chalet.service';
import amenityService from '../services/amenity.service';

export default function ChaletDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [chalet, setChalet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [savingLocation, setSavingLocation] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);

  const load = async () => {
    setLoading(true);
    const data = await chaletService.getById(id);
    setChalet(data);
    setLocation({ latitude: data.latitude, longitude: data.longitude });
    setLoading(false);
  };

  const loadAmenityCatalog = async () => {
    const res = await amenityService.list();
    setAllAmenities(res.data || []);
  };

  useEffect(() => {
    load();
    loadAmenityCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveAmenities = async (amenityIds) => {
    await chaletService.update(id, { amenityIds });
    await load();
  };

  const handleSaveDescription = async (payload) => {
    await chaletService.saveDescription(id, payload);
    await load();
  };

  const handleSetDefaultDescription = async (descriptionId) => {
    await chaletService.setDefaultDescription(id, descriptionId);
    await load();
  };

  const handleDeleteDescription = async (descriptionId) => {
    await chaletService.deleteDescription(id, descriptionId);
    await load();
  };

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

  const handleSetCover = async (imageId) => {
    try {
      await chaletService.setCoverImage(id, imageId);
      toast.success('Cover image updated');
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleSaveLocation = async () => {
    setSavingLocation(true);
    try {
      await chaletService.update(id, location);
      toast.success('Location saved');
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSavingLocation(false);
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
          <Paper elevation={0} sx={{ p: 2.5, mb: 2 }}>
            <AmenitiesManager
              amenities={chalet.amenities}
              allAmenities={allAmenities}
              onSave={handleSaveAmenities}
              onCatalogRefresh={loadAmenityCatalog}
              defaultType="chalet"
            />
          </Paper>

          <Paper elevation={0} sx={{ p: 2.5 }}>
            <DescriptionsManager
              descriptions={chalet.descriptions}
              onSave={handleSaveDescription}
              onSetDefault={handleSetDefaultDescription}
              onDelete={handleDeleteDescription}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Gallery</Typography>
            <ImageUploader
              images={chalet.images}
              onUpload={handleUpload}
              onRemove={handleRemoveImage}
              onSetCover={handleSetCover}
              uploading={uploading}
            />
          </Paper>

          <Paper elevation={0} sx={{ p: 2.5 }}>
            <LocationMapPicker
              latitude={location.latitude}
              longitude={location.longitude}
              onChange={setLocation}
            />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ mt: 1.5 }}
              disabled={savingLocation || (location.latitude === chalet.latitude && location.longitude === chalet.longitude)}
              onClick={handleSaveLocation}
            >
              Save location
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
