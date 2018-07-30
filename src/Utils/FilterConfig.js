const Filters = () => {
  return [
    {
      label: 'Status',
      name: 'status',
      cql: 'status',
      values: ['Active', 'Inactive', 'Pending']
    },
  ];
};

const SearchableIndexes = [
  { label: 'All', value: 'all', makeQuery: term => `(id="${term}*" or po_number="${term}*" or create="${term}*" or comments="${term}*" or assined_to="${term}*")` },
  { label: 'ID', value: 'id', makeQuery: term => `(id="${term}*")` },
  { label: 'PO Number', value: 'po_number', makeQuery: term => `(po_number="${term}*")` },
  { label: 'Created', value: 'created', makeQuery: term => `(created="${term}*")` },
  { label: 'Comments', value: 'comments', makeQuery: term => `(comments="${term}*")` },
  { label: 'Assigned To', value: 'assigned_to', makeQuery: term => `(assigned_to="${term}*")` },
];

export { Filters, SearchableIndexes };
