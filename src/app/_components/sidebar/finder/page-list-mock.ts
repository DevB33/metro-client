const pageList = [
  {
    pageId: 1,
    title: 'Page 1',
    icon: '🏠',
    children: [
      {
        pageId: 2,
        title: 'Page 2',
        icon: '📄',
        children: [
          {
            pageId: 3,
            title: 'Page 3',
            icon: '📄',
            children: [
              {
                pageId: 4,
                title: 'Page 4',
                icon: '📂',
                children: [],
              },
              {
                pageId: 5,
                title: 'Page 5',
                icon: '📂',
                children: [
                  {
                    pageId: 6,
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
        pageId: 7,
        title: 'Page 7',
        icon: '',
        children: [
          {
            pageId: 8,
            title: 'Page 8',
            icon: '📂',
            children: [
              {
                pageId: 9,
                title: 'Page 9',
                icon: '📄',
                children: [],
              },
              {
                pageId: 10,
                title: 'Page 10',
                icon: '📄',
                children: [
                  {
                    pageId: 11,
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
    pageId: 12,
    title: 'Page 12',
    icon: '',
    children: [
      {
        pageId: 13,
        title: 'Page 13',
        icon: '',
        children: [
          {
            pageId: 14,
            title: '이름이 엄청나게 긴 페이지',
            icon: '📄',
            children: [],
          },
          {
            pageId: 15,
            title: 'Page 15',
            icon: '📄',
            children: [
              {
                pageId: 16,
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
    pageId: 17,
    title: 'Page 17',
    icon: '',
    children: [
      {
        pageId: 18,
        title: 'Page 18',
        icon: '📂',
        children: [
          {
            pageId: 19,
            title: 'Page 19',
            icon: '📄',
            children: [],
          },
          {
            pageId: 20,
            title: 'Page 20',
            icon: '📄',
            children: [],
          },
        ],
      },
      {
        pageId: 21,
        title: 'Page 21',
        icon: '📄',
        children: [],
      },
    ],
  },
];

export default pageList;
