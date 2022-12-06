// react
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Column, Row, useExpanded, useGroupBy, useTable } from 'react-table';
// mui
import { Stack, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// custom
import ScrollX from 'components/ScrollX';
// utils
import { useControlledState } from 'utils/react-table';
// types
import { ISuggestion } from 'types/suggestions';
import { IPainPoint } from 'types/painPoints';
// others
import { DownOutlined, GroupOutlined, RightOutlined, UngroupOutlined } from '@ant-design/icons';

function ReactTable({ columns, data }: { columns: Column<IPainPoint>[]; data: IPainPoint[] }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, toggleAllRowsExpanded } = useTable<IPainPoint>(
    {
      columns,
      data,
      autoResetExpanded: false,
      // @ts-ignore
      initialState: { groupBy: ['group'] }
    },
    useGroupBy,
    useExpanded,
    (hooks) => {
      hooks.useControlledState.push(useControlledState);
      hooks.visibleColumns.push((columns, { instance }) => {
        // @ts-ignore
        if (!instance.state.groupBy.length) {
          return columns;
        }
        return [
          {
            id: 'expander',
            // @ts-ignore
            Header: ({ allColumns, state: { groupBy } }) =>
              groupBy.map((columnId: any) => {
                const column: any = allColumns.find((d) => d.id === columnId);
                const groupIcon = column.isGrouped ? <UngroupOutlined /> : <GroupOutlined />;

                return (
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    {...column.getHeaderProps()}
                    sx={{
                      display: 'inline-flex',
                      '&:not(:last-of-type)': { mr: 1.5 }
                    }}
                  >
                    {column.canGroupBy ? (
                      <Box
                        sx={{
                          color: column.isGrouped ? 'error.main' : 'primary.main',
                          fontSize: '1rem'
                        }}
                        {...column.getGroupByToggleProps()}
                      >
                        {groupIcon}
                      </Box>
                    ) : null}
                    <Typography variant="subtitle1">{column.render('Header')}</Typography>
                  </Stack>
                );
              }),
            Cell: ({ row }: { row: any }) => {
              if (row.canExpand) {
                const groupedCell = row.allCells.find((d: any) => d.isGrouped);
                const collapseIcon = row.isExpanded ? <DownOutlined /> : <RightOutlined />;

                return (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        pl: row.depth * 2,
                        pr: 1.25,
                        fontSize: '0.75rem',
                        color: 'text.secondary'
                      }}
                      {...row.getToggleRowExpandedProps()}
                    >
                      {collapseIcon}
                    </Box>
                    {groupedCell.render('Cell')} ({row.subRows.length})
                  </Stack>
                );
              }
              return null;
            }
          },
          ...columns
        ];
      });
    }
  );

  useEffect(() => {
    toggleAllRowsExpanded();
  }, [toggleAllRowsExpanded]);

  const rowElms = useMemo(
    () =>
      rows.map((row: any) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()}>
            {row.cells.map((cell: any) => {
              let bgcolor = 'background.paper';
              if (cell.isAggregated) bgcolor = 'warning.lighter';
              if (cell.isGrouped) bgcolor = 'success.lighter';
              if (cell.isPlaceholder) bgcolor = 'error.lighter';

              return (
                <TableCell {...cell.getCellProps([{ className: cell.column.className }])} sx={{ bgcolor }}>
                  {/* eslint-disable-next-line */}
                  {cell.isAggregated ? cell.render('Aggregated') : cell.isPlaceholder ? null : cell.render('Cell')}
                </TableCell>
              );
            })}
          </TableRow>
        );
      }),
    [rows, prepareRow]
  );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup, i: number) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any, index: number) => {
              const groupIcon = column.isGrouped ? <UngroupOutlined /> : <GroupOutlined />;
              return (
                <TableCell key={`group-header-cell-${index}`} {...column.getHeaderProps([{ className: column.className }])}>
                  <Stack direction="row" spacing={1.15} alignItems="center" sx={{ display: 'inline-flex' }}>
                    {column.canGroupBy ? (
                      <Box
                        sx={{
                          color: column.isGrouped ? 'error.main' : 'primary.main',
                          fontSize: '1rem'
                        }}
                        {...column.getGroupByToggleProps()}
                      >
                        {groupIcon}
                      </Box>
                    ) : null}
                    <Box>{column.render('Header')}</Box>
                  </Stack>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>{rowElms}</TableBody>
    </Table>
  );
}

const PainPointTable: React.FC<{ items: IPainPoint[]; onItemDelete: (id: string) => void }> = ({ items, onItemDelete }) => {
  const columns = useMemo<Column<IPainPoint>[]>(
    () => [
      {
        Header: 'Group',
        accessor: 'group',
        aggregate: 'count',
        Aggregated: ({ value }: { value: number }) => `${value} pain points`,
        disableGroupBy: true
      },
      {
        Header: 'Name',
        accessor: 'name',
        disableGroupBy: true
      },
      {
        Header: 'Description',
        accessor: 'description',
        disableGroupBy: true
      },
      {
        Header: 'Suggestions',
        accessor: 'suggestions',
        Cell: ({ value: suggestions }: { value: ISuggestion[] }) => {
          return Array.isArray(suggestions) ? (
            <Stack direction="row" spacing={1}>
              {suggestions.map(({ title }) => (
                <Chip label={title} />
              ))}
            </Stack>
          ) : null;
        },
        disableGroupBy: true
      },
      {
        Header: 'Actions',
        Cell: ({ row }: { row: Row<IPainPoint> }) => {
          if (row.isGrouped) return null;

          const { id } = row.original;

          return (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton aria-label="edit" size="small" color="primary" component={Link} to={`${id}/edit`}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="delete" size="small" color="error" onClick={() => onItemDelete(id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          );
        },
        disableGroupBy: true
      }
    ],
    [onItemDelete]
  );

  return (
    <ScrollX>
      <ReactTable columns={columns} data={items} />
    </ScrollX>
  );
};

export default PainPointTable;
