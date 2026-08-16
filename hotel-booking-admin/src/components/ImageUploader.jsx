import { Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar, Chip, Tooltip } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorderRounded';
import { useRef } from 'react';
import { resolveImageUrl } from '../lib/media';

/**
 * @param onSetCover optional (imageId) => void — when provided, each image
 *   gets a "set as cover" star toggle (Phase 3: is_cover was previously
 *   only ever set automatically on the very first upload, with no way to
 *   change it afterward).
 */
export default function ImageUploader({ images = [], onUpload, onRemove, onSetCover, uploading }) {
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
            <ImageListItem key={img.id} sx={{ borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
              <img src={resolveImageUrl(img.url)} alt={`Gallery image ${index + 1}`} style={{ height: 100, objectFit: 'cover' }} />
              {img.is_cover && (
                <Chip
                  label="Cover"
                  size="small"
                  color="secondary"
                  sx={{ position: 'absolute', bottom: 4, left: 4, height: 20, fontSize: '0.65rem' }}
                />
              )}
              <ImageListItemBar
                sx={{ background: 'rgba(0,0,0,0.4)' }}
                position="top"
                actionIcon={
                  <Box sx={{ display: 'flex' }}>
                    {onSetCover && (
                      <Tooltip title={img.is_cover ? 'Cover image' : 'Set as cover'}>
                        <IconButton size="small" sx={{ color: '#fff' }} onClick={() => onSetCover(img.id)} disabled={img.is_cover}>
                          {img.is_cover ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    )}
                    <IconButton size="small" sx={{ color: '#fff' }} onClick={() => onRemove(img.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
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
