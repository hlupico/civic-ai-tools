const TREE_DATA = [
  {
    borough: 'Bronx',
    totalTrees: 85203,
    species: [
      { name: 'honeylocust', count: 9691 },
      { name: 'London planetree', count: 7511 },
      { name: 'pin oak', count: 6445 },
      { name: 'Callery pear', count: 4947 },
      { name: 'Japanese zelkova', count: 4638 },
      { name: 'cherry', count: 4092 },
      { name: 'littleleaf linden', count: 3917 },
      { name: 'Norway maple', count: 3376 },
      { name: 'ginkgo', count: 2685 },
      { name: 'Sophora', count: 2555 },
    ],
  },
  {
    borough: 'Brooklyn',
    totalTrees: 177293,
    species: [
      { name: 'London planetree', count: 34886 },
      { name: 'honeylocust', count: 16921 },
      { name: 'pin oak', count: 12343 },
      { name: 'Japanese zelkova', count: 9659 },
      { name: 'Callery pear', count: 9081 },
      { name: 'littleleaf linden', count: 8903 },
      { name: 'Norway maple', count: 6989 },
      { name: 'Sophora', count: 5989 },
      { name: 'cherry', count: 5706 },
      { name: 'ginkgo', count: 5595 },
    ],
  },
  {
    borough: 'Manhattan',
    totalTrees: 65423,
    species: [
      { name: 'honeylocust', count: 13176 },
      { name: 'Callery pear', count: 7297 },
      { name: 'ginkgo', count: 5859 },
      { name: 'pin oak', count: 4584 },
      { name: 'Sophora', count: 4453 },
      { name: 'London planetree', count: 4122 },
      { name: 'Japanese zelkova', count: 3596 },
      { name: 'littleleaf linden', count: 3333 },
      { name: 'American elm', count: 1698 },
      { name: 'American linden', count: 1583 },
    ],
  },
  {
    borough: 'Queens',
    totalTrees: 250551,
    species: [
      { name: 'London planetree', count: 31111 },
      { name: 'pin oak', count: 22610 },
      { name: 'honeylocust', count: 20290 },
      { name: 'Norway maple', count: 19407 },
      { name: 'Callery pear', count: 16547 },
      { name: 'cherry', count: 13497 },
      { name: 'littleleaf linden', count: 11902 },
      { name: 'Japanese zelkova', count: 8987 },
      { name: 'green ash', count: 7389 },
      { name: 'silver maple', count: 6116 },
    ],
  },
  {
    borough: 'Staten Island',
    totalTrees: 105318,
    species: [
      { name: 'Callery pear', count: 21059 },
      { name: 'London planetree', count: 9384 },
      { name: 'red maple', count: 7373 },
      { name: 'pin oak', count: 7203 },
      { name: 'cherry', count: 5115 },
      { name: 'sweetgum', count: 5010 },
      { name: 'honeylocust', count: 4186 },
      { name: 'Norway maple', count: 4127 },
      { name: 'silver maple', count: 4053 },
      { name: 'maple', count: 2611 },
    ],
  },
];

const statsContainer = document.getElementById('stats-summary');
const container = document.getElementById('borough-cards');

const formatCount = (value) => value.toLocaleString();

const computeSummaryStats = () => {
  const totalTrees = TREE_DATA.reduce((sum, borough) => sum + borough.totalTrees, 0);
  const speciesCounts = new Map();
  const speciesPresence = new Map();

  TREE_DATA.forEach((borough) => {
    borough.species.forEach(({ name, count }) => {
      speciesCounts.set(name, (speciesCounts.get(name) || 0) + count);
      speciesPresence.set(name, (speciesPresence.get(name) || 0) + 1);
    });
  });

  const topSpecies = [...speciesCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const commonSpecies = [...speciesPresence.entries()].filter(([, boroughCount]) => boroughCount === TREE_DATA.length).map(([name]) => name);

  return {
    totalTrees,
    topSpecies,
    commonSpeciesCount: commonSpecies.length,
    commonSpecies,
  };
};

const renderStats = () => {
  const { totalTrees, topSpecies, commonSpeciesCount, commonSpecies } = computeSummaryStats();
  const stats = [
    {
      title: `${formatCount(totalTrees)} total street trees`,
      description: 'Summed across all five boroughs in the 2015 Street Tree Census.',
    },
    {
      title: `${topSpecies[0]} is the most common species`,
      description: `${formatCount(topSpecies[1])} recorded street trees across borough top 10 lists.`,
    },
    {
      title: `${commonSpeciesCount} species appear in every borough top 10`,
      description: commonSpecies.join(', '),
    },
  ];

  const wrapper = document.createElement('div');
  wrapper.className = 'stats-grid';

  stats.forEach((stat) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <strong>${stat.title}</strong>
      <p>${stat.description}</p>
    `;
    wrapper.appendChild(card);
  });

  statsContainer.appendChild(wrapper);
};

const buildBoroughClass = (borough) => {
  return `borough-${borough.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
};

const renderCard = ({ borough, totalTrees, species }) => {
  const card = document.createElement('article');
  card.className = `card ${buildBoroughClass(borough)}`;

  const header = document.createElement('div');
  header.innerHTML = `
    <h2>${borough}</h2>
    <p>${formatCount(totalTrees)} total street trees</p>
  `;
  card.appendChild(header);

  const list = document.createElement('ol');
  list.className = 'species-list';
  list.type = '1';

  species.forEach((item) => {
    const percent = (item.count / totalTrees) * 100;
    const row = document.createElement('li');
    row.className = 'species-item';

    const meta = document.createElement('div');
    meta.className = 'species-meta';
    meta.innerHTML = `
      <span>${item.name}</span>
      <span>${formatCount(item.count)} · ${percent.toFixed(2)}%</span>
    `;

    const barWrapper = document.createElement('div');
    barWrapper.className = 'bar-wrapper';

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = `${Math.max(percent, 0.4)}%`;
    barWrapper.appendChild(bar);

    row.appendChild(meta);
    row.appendChild(barWrapper);
    list.appendChild(row);
  });

  card.appendChild(list);
  return card;
};

renderStats();
TREE_DATA.forEach((boroughData) => {
  container.appendChild(renderCard(boroughData));
});
