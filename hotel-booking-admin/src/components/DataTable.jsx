import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TablePagination,
  Box, TextField, InputAdornment, CircularProgress, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchRounded';
import InboxIcon from '@mui/icons-material/InboxOutlined';
import { useTranslation } from 'react-i18next';

/**
 * Generic server-driven data table.
 * @param columns [{ key, label, render?(row) }]
 * @param rows array of row objects
 * @param total total row count (for pagination)
 * @param page 1-indexed current page
 * @param limit rows per page
 * @param onPageChange (page) => void
 * @param onLimitChange (limit) => void
 * @param onSearch (search) => void
 * @param loading boolean
 */
export default function DataTable({
  columns,
  rows,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  onLimitChange,
  onSearch,
  loading,
  searchPlaceholder,
}) {
  const { t } = useTranslation();

  return (
    <Paper elevation={0}>
      {onSearch && (
        <Box sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder || t('common.search')}
            onChange={(e) => onSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ maxWidth: 320 }}
            fullWidth
          />
        </Box>
      )}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} color="secondary" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <InboxIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">{t('common.noResults')}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow key={row.id ?? idx} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render ? col.render(row) : row[col.key]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {onPageChange && (
        <TablePagination
          component="div"
          count={total}
          page={Math.max(page - 1, 0)}
          onPageChange={(e, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => onLimitChange?.(Number(e.target.value))}
          rowsPerPageOptions={[10, 20, 50]}
        />
      )}
    </Paper>
  );
}
