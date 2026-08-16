import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TablePagination,
  Box, TextField, InputAdornment, Typography, Skeleton, Button,
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
 * @param emptyAction optional { label, onClick } rendered as a CTA button in the empty state,
 *   e.g. { label: 'Add hotel', onClick: openCreate } — turns "nothing here" into a next step.
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
  emptyAction,
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
              // Skeleton rows matching the real table's shape (same column
              // count, a handful of rows at varying widths) rather than a
              // single centered spinner — avoids the layout "pop" when data
              // arrives and reads as considerably more polished on
              // repeated navigations between list pages.
              Array.from({ length: 6 }).map((_, rowIdx) => (
                <TableRow key={`skeleton-${rowIdx}`}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={col.key}>
                      <Skeleton
                        variant="text"
                        width={colIdx === 0 ? '70%' : `${40 + ((rowIdx * 13 + colIdx * 7) % 40)}%`}
                        height={22}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 7 }}>
                  <InboxIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1.5, opacity: 0.6 }} />
                  <Typography color="text.secondary" sx={{ mb: emptyAction ? 2 : 0 }}>
                    {t('common.noResults')}
                  </Typography>
                  {emptyAction && (
                    <Button variant="outlined" color="secondary" size="small" onClick={emptyAction.onClick}>
                      {emptyAction.label}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow
                  key={row.id ?? idx}
                  hover
                  sx={{ transition: 'background-color 120ms ease' }}
                >
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
