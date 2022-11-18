import { FSPTable } from 'components/third-party/ReactTable';
import { SelectColumnFilter } from 'utils/react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { useCallback, useMemo } from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useConfirm } from 'material-ui-confirm';
import { deleteShow } from '_api/shows';
import { useQueryClient } from '@tanstack/react-query';
import { IShow } from 'types/shows';

const initialState = { filters: [{ id: 'mimetype', value: '' }], pageIndex: 0, pageSize: 10 };

const ShowsTable: React.FC<{ data: any[] }> = ({ data }) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const handleDelete = useCallback(
    async (id) => {
      try {
        await confirm({ description: "You're going to delete this item." });
        await deleteShow(id);
        queryClient.setQueriesData(['shows'], (shows: IShow[] = []) => [...shows.filter(({ id: showId }) => showId !== id)]);
      } catch (e) {
        console.log(e);
      }
    },
    [confirm, queryClient]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Media',
        accessor: 'coverS3Url',
        Cell: ({ value }: { value: string }) => <img width="48px" src={value} alt="media cover" />,
        disableFilters: true,
        disableSortBy: true
      },
      { Header: 'Title', accessor: 'title' },
      { Header: 'Type', accessor: 'mimetype', Filter: SelectColumnFilter },
      { Header: 'Duration', accessor: 'duration', disableFilters: true },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ value }: { value: string }) => (
          <Box width="100%" display="flex" flexDirection="row" justifyContent="flex-start">
            <IconButton component={Link} to={`${value}/edit`}>
              <Edit color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDelete(value)}>
              <Delete color="error" />
            </IconButton>
          </Box>
        ),
        disableFilters: true,
        disableSortBy: true
      }
    ],
    [handleDelete]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <FSPTable columns={columns} data={data} initialState={initialState} />
      </ScrollX>
    </MainCard>
  );
};

export default ShowsTable;
