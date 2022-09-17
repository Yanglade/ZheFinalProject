const initialData = {
  tasks: {
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      named: true,
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'Progress',
      named: true,
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      named: true,
      taskIds: [],
    },
  },

  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export default initialData;