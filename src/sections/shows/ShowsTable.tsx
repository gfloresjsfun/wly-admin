import { FSPTable } from 'components/third-party/ReactTable';
import { SelectColumnFilter } from 'utils/react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { useMemo } from 'react';
import { Box, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const initialState = { filters: [{ id: 'mimetype', value: '' }], pageIndex: 0, pageSize: 10 };

const ShowsTable: React.FC<{ data: any[] }> = ({ data }) => {
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
            <IconButton>
              <Delete color="error" />
            </IconButton>
          </Box>
        ),
        disableFilters: true,
        disableSortBy: true
      }
    ],
    []
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
