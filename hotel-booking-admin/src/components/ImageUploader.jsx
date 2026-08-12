import { Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useRef } from 'react';
import { resolveImageUrl } from '../lib/media';

export default function ImageUploader({ images = [], onUpload, onRemove, uploading }) {
  const inputRef = useRef(null);

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) onUpload(e.target.files);
          e.target.value = '';
        }}
      />
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        size="small"
        sx={{ mb: 1.5 }}
      >
        Upload images
      </Button>

      {images.length > 0 && (
        <ImageList cols={4} rowHeight={100} gap={8}>
          {images.map((img, index) => (
            <ImageListItem key={img.id} sx={{ borderRadius: 1, overflow: 'hidden' }}>
              <img src={resolveImageUrl(img.url)} alt={`Gallery image ${index + 1}`} style={{ height: 100, objectFit: 'cover' }} />
              <ImageListItemBar
                sx={{ background: 'rgba(0,0,0,0.4)' }}
                position="top"
                actionIcon={
                  <IconButton size="small" sx={{ color: '#fff' }} onClick={() => onRemove(img.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                actionPosition="right"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}
