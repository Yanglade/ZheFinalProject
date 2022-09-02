const initialData = {
  tasks: {
    'task-1': {id: 'task-1', content: 'Take out garbage', named: true, details: {image_url: null}},
    'task-2': {id: 'task-2', content: 'Watch my favorite show', named: true},
    'task-3': {id: 'task-3', content: 'Charge my phone', named: true},
    'task-4': {id: 'task-4', content: 'Cook dinner', named: true},
  },

  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      named: true,
      taskIds: ['task-1','task-2', 'task-3', 'task-4'],
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