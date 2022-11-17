import React, { useState } from 'react';

// material-ui
import {
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { DefaultColumnFilter, renderFilterTypes as filterTypes } from 'utils/react-table';

// ==============================|| TABLE PAGINATION ||============================== //

interface TablePaginationProps {
  gotoPage: (value: number) => void;
  setPageSize: (value: number) => void;
  pageIndex: number;
  pageSize: number;
  rows: any[];
}

const TablePagination = ({ gotoPage, rows, setPageSize, pageSize, pageIndex }: TablePaginationProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    gotoPage(value - 1);
  };

  const handleChange = (event: SelectChangeEvent<number>) => {
    setPageSize(+event.target.value);
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ width: 'auto' }}>
      <Grid item>
        <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="secondary">
              Row per page
            </Typography>
            <FormControl sx={{ m: 1 }}>
              <Select
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                // @ts-ignore
                value={pageSize}
                onChange={handleChange}
                size="small"
                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="caption" color="secondary">
            Go to
          </Typography>
          <TextField
            size="small"
            type="number"
            // @ts-ignore
            value={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 0;
              gotoPage(page - 1);
            }}
            sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 } }}
          />
        </Stack>
      </Grid>
      <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
        <Pagination
          // @ts-ignore
          count={Math.ceil(rows.length / pageSize)}
          // @ts-ignore
          page={pageIndex + 1}
          onChange={handleChangePagination}
          color="primary"
          variant="combined"
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
};

// ==============================|| HEADER SORT ||============================== //

interface HeaderSortProps {
  column: any;
  sort?: boolean;
}

const HeaderSort = ({ column, sort }: HeaderSortProps) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ display: 'inline-flex' }}>
      <Box>{column.render('Header')}</Box>
      {!column.disableSortBy && (
        <Stack sx={{ color: 'secondary.light' }} {...(sort && { ...column.getHeaderProps(column.getSortByToggleProps()) })}>
          <CaretUpOutlined
            style={{
              fontSize: '0.625rem',
              color: column.isSorted && !column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
            }}
          />
          <CaretDownOutlined
            style={{
              fontSize: '0.625rem',
              marginTop: -2,
              color: column.isSortedDesc ? theme.palette.text.secondary : 'inherit'
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

const defaultColumn = { Filter: DefaultColumnFilter };
const getHeaderProps = (column: any) => column.getSortByToggleProps();

function ReactTable({ columns, data, initialState }: any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    // @ts-ignore
    page,
    prepareRow,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      defaultColumn,
      // @ts-ignore
      initialState,
      filterTypes
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <Table {...getTableProps()}>
      <TableHead sx={{ borderTopWidth: 2 }}>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <TableCell {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                <HeaderSort column={column} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {headerGroups.map((group: any) => (
          <TableRow {...group.getHeaderGroupProps()}>
            {group.headers.map((column: any) => (
              <TableCell {...column.getHeaderProps([{ className: column.className }])}>
                {column.canFilter ? column.render('Filter') : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {page.map((row: any, i: number) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell: any) => (
                <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
              ))}
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell sx={{ p: 2 }} colSpan={7}>
            <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

// react table with filtering, sorting and pagination
export const FSPTable: React.FC<{ data: any[]; columns: any[]; initialState?: {} }> = ({ data, columns, initialState }) => {
  return <ReactTable columns={columns} data={data} initialState={initialState} />;
};
