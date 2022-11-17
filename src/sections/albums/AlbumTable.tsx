import { Chip, Stack } from '@mui/material';
import { FSPTable } from 'components/third-party/ReactTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import { IShow } from 'types/shows';

const columns = [
  {
    Header: 'Media',
    accessor: 'coverS3Url',
    Cell: ({ value }: { value: string }) => <img width="48px" src={value} alt="media cover" />,
    disableFilters: true,
    disableSortBy: true
  },
  { Header: 'Title', accessor: 'title' },
  {
    Header: 'Shows',
    accessor: 'shows',
    disableFilters: true,
    Cell: ({ value: shows }: { value: IShow[] }) => (
      <Stack direction="row" spacing={1}>
        {shows.map((show: IShow) => (
          <Chip
            key={show.id}
            variant="combined"
            avatar={<Avatar variant="square" alt={`${show.duration}`} src={show.coverS3Url} />}
            label={show.title}
            color="primary"
          />
        ))}
      </Stack>
    )
  }
];

const initialState = { filters: [{ id: 'mimetype', value: '' }], pageIndex: 0, pageSize: 10 };

const AlbumTable: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <MainCard content={false}>
      <ScrollX>
        <FSPTable columns={columns} data={data} initialState={initialState} />
      </ScrollX>
    </MainCard>
  );
};

export default AlbumTable;
