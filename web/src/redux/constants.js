const initialUser = {
  email: null,
  subscription: 'basic',
  isVerified: false,
};

const initialWeighing = {
  date: Date.now(),
  auto: {
    id: null,
    driver: '',
  },
  crop: {
    name: '',
    source: '',
    destination: '',
  },
  weighing: {
    tare: null,
    brutto: null,
    netto: null,
    isIncoming: true,
  },
  harvesters: [],
  addedBy: initialUser.email,
};

const initialStore = {
  user: initialUser,
  weighings: initialWeighing,
};

export const CONST = {
  initialUser,
  initialWeighing,
  initialStore,
  BASE_URL: 'https://vital-agro-api.onrender.com',
  icon: {
    clear: '❌',
    delete: '🗑',
    add: '➕',
    working: '🛠',
    search: '🔎',
    pin: '📌',
  },
};
