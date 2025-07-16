const SWR_KEYS = {
  USER_INFO: 'userInfo',
  NOTE_LIST: 'noteList',
  blockList: (id: string | number) => `blockList-${id}`,
  noteMetadata: (id: string | number) => `noteMetadata-${id}`,
};

export default SWR_KEYS;
