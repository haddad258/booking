import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Paper, Typography, Grid, IconButton, Stack, Button, TextField, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/AddRounded';
import PageHeader from '../components/PageHeader';
import EntityDialog from '../components/EntityDialog';
import ImageUploader from '../components/ImageUploader';
import LocationMapPicker from '../components/LocationMapPicker';
import AmenitiesManager from '../components/AmenitiesManager';
import DescriptionsManager from '../components/DescriptionsManager';
import useToast from '../hooks/useToast';
import hotelService from '../services/hotel.service';
import amenityService from '../services/amenity.service';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [savingLocation, setSavingLocation] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const data = await hotelService.getById(id);
    setHotel(data);
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
    await hotelService.update(id, { amenityIds });
    await load();
  };

  const handleSaveDescription = async (payload) => {
    await hotelService.saveDescription(id, payload);
    await load();
  };

  const handleSetDefaultDescription = async (descriptionId) => {
    await hotelService.setDefaultDescription(id, descriptionId);
    await load();
  };

  const handleDeleteDescription = async (descriptionId) => {
    await hotelService.deleteDescription(id, descriptionId);
    await load();
  };

  const handleUpload = async (files) => {
    setUploading(true);
    try {
      await hotelService.uploadImages(id, files);
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
      await hotelService.removeImage(id, imageId);
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleSetCover = async (imageId) => {
    try {
      await hotelService.setCoverImage(id, imageId);
      toast.success('Cover image updated');
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleSaveLocation = async () => {
    setSavingLocation(true);
    try {
      await hotelService.update(id, location);
      toast.success('Location saved');
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSavingLocation(false);
    }
  };

  const openCreateRoom = () => {
    setEditingRoom(null);
    reset({ name: '', type: '', price: '', capacityAdults: 2, capacityChildren: 0, quantity: 1 });
    setRoomDialogOpen(true);
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    reset({
      name: room.name,
      type: room.type || '',
      price: room.price,
      capacityAdults: room.capacity_adults,
      capacityChildren: room.capacity_children,
      quantity: room.quantity,
    });
    setRoomDialogOpen(true);
  };

  const onSubmitRoom = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        capacityAdults: Number(values.capacityAdults),
        capacityChildren: Number(values.capacityChildren),
        quantity: Number(values.quantity),
      };
      if (editingRoom) {
        await hotelService.updateRoom(id, editingRoom.id, payload);
        toast.success('Room updated');
      } else {
        await hotelService.addRoom(id, payload);
        toast.success('Room added');
      }
      setRoomDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await hotelService.deleteRoom(id, roomId);
      toast.success('Room removed');
      load();
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !hotel) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/hotels')} sx={{ mb: 2 }}>
        Back to hotels
      </Button>

      <PageHeader title={hotel.name} subtitle={`${hotel.city}, ${hotel.country}`} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 2 }}>
            <AmenitiesManager
              amenities={hotel.amenities}
              allAmenities={allAmenities}
              onSave={handleSaveAmenities}
              onCatalogRefresh={loadAmenityCatalog}
              defaultType="hotel"
            />
          </Paper>

          <Paper elevation={0} sx={{ p: 2.5, mb: 2 }}>
            <DescriptionsManager
              descriptions={hotel.descriptions}
              onSave={handleSaveDescription}
              onSetDefault={handleSetDefaultDescription}
              onDelete={handleDeleteDescription}
            />
          </Paper>

          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>Rooms</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={openCreateRoom}>Add room</Button>
            </Box>
            <Stack spacing={1}>
              {hotel.rooms?.length ? (
                hotel.rooms.map((room) => (
                  <Box
                    key={room.id}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                  >
                    <Box>
                      <Typography fontWeight={600}>{room.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {room.capacity_adults} adults · {room.capacity_children} children · {room.quantity} units
                      </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography className="mono" fontWeight={700}>{Number(room.price).toFixed(2)} KWD</Typography>
                      <IconButton size="small" onClick={() => openEditRoom(room)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteRoom(room.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No rooms added yet.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Gallery</Typography>
            <ImageUploader
              images={hotel.images}
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
              disabled={savingLocation || (location.latitude === hotel.latitude && location.longitude === hotel.longitude)}
              onClick={handleSaveLocation}
            >
              Save location
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <EntityDialog
        open={roomDialogOpen}
        title={editingRoom ? 'Edit room' : 'Add room'}
        onClose={() => setRoomDialogOpen(false)}
        onSubmit={handleSubmit(onSubmitRoom)}
        loading={saving}
      >
        <TextField fullWidth label="Room name" {...register('name', { required: true })} />
        <TextField fullWidth label="Type" placeholder="Double, Suite…" {...register('type')} />
        <TextField fullWidth type="number" label="Price / night" {...register('price', { required: true })} />
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField fullWidth type="number" label="Adults" {...register('capacityAdults')} />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth type="number" label="Children" {...register('capacityChildren')} />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth type="number" label="Units" {...register('quantity')} />
          </Grid>
        </Grid>
      </EntityDialog>
    </Box>
  );
}
