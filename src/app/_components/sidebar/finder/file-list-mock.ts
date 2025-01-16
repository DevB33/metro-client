const fileList = [
  {
    docsId: 1,
    title: 'Page 1',
    icon: '🏠',
    children: [
      {
        docsId: 2,
        title: 'Page 2',
        icon: '📄',
        children: [
          {
            docsId: 3,
            title: 'Page 3',
            icon: '📄',
            children: [
              {
                docsId: 4,
                title: 'Page 4',
                icon: '📂',
                children: [],
              },
              {
                docsId: 5,
                title: 'Page 5',
                icon: '📂',
                children: [
                  {
                    docsId: 6,
                    title: 'Page 6',
                    icon: '📄',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        docsId: 7,
        title: 'Page 7',
        icon: '📂',
        children: [
          {
            docsId: 8,
            title: 'Page 8',
            icon: '📂',
            children: [
              {
                docsId: 9,
                title: 'Page 9',
                icon: '📄',
                children: [],
              },
              {
                docsId: 10,
                title: 'Page 10',
                icon: '📄',
                children: [
                  {
                    docsId: 11,
                    title: 'Page 11',
                    icon: '📂',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    docsId: 12,
    title: 'Page 12',
    icon: '🏠',
    children: [
      {
        docsId: 13,
        title: 'Page 13',
        icon: '📂',
        children: [
          {
            docsId: 14,
            title: 'Page 14',
            icon: '📄',
            children: [],
          },
          {
            docsId: 15,
            title: 'Page 15',
            icon: '📄',
            children: [
              {
                docsId: 16,
                title: 'Page 16',
                icon: '📂',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    docsId: 17,
    title: 'Page 17',
    icon: '📂',
    children: [
      {
        docsId: 18,
        title: 'Page 18',
        icon: '📂',
        children: [
          {
            docsId: 19,
            title: 'Page 19',
            icon: '📄',
            children: [],
          },
          {
            docsId: 20,
            title: 'Page 20',
            icon: '📄',
            children: [],
          },
        ],
      },
      {
        docsId: 21,
        title: 'Page 21',
        icon: '📄',
        children: [],
      },
    ],
  },
];

export default fileList;
