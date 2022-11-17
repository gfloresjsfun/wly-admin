import { FSPTable } from 'components/third-party/ReactTable';
import { SelectColumnFilter } from 'utils/react-table';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';

const columns = [
  {
    Header: 'Media',
    accessor: 'coverS3Url',
    Cell: ({ value }: { value: string }) => <img width="48px" src={value} alt="media cover" />,
    disableFilters: true,
    disableSortBy: true
  },
  { Header: 'Title', accessor: 'title' },
  { Header: 'Type', accessor: 'mimetype', Filter: SelectColumnFilter },
  { Header: 'Duration', accessor: 'duration', disableFilters: true }
];

const initialState = { filters: [{ id: 'mimetype', value: '' }], pageIndex: 0, pageSize: 10 };

const ShowsTable: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <MainCard content={false}>
      <ScrollX>
        <FSPTable columns={columns} data={data} initialState={initialState} />
      </ScrollX>
    </MainCard>
  );
};

export default ShowsTable;
