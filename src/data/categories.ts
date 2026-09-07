import { Category } from '../types';
import { ADDITIONAL_CATEGORIES } from './additionalCategories';

const BASE_CATEGORIES: Category[] = [
  {
    id: 'sports',
    name: 'SPORTS',
    bannerColor: 'bg-emerald-600',
    accentColor: 'text-emerald-700',
    description: 'Athletic competitions, pitch battles, and Olympic games',
    items: [
      'Football',     'Rugby',        'Athletics',   'Swimming',
      'Hockey',       'Tennis',       'Badminton',   'Golf',
      'Squash',       'Gymnastics',   'Trampolining','Cycling',
      'Volleyball',   'Cricket',      'Baseball',    'Basketball',
    ],
    clueBank: {
      'Football': ['Pitch', 'Cleats', 'Goalmouth', 'Keeper', 'Offside', 'Striker', 'Corner'],
      'Rugby': ['Scrum', 'Oval', 'Tackle', 'Try', 'Haka', 'Flanker', 'Maul'],
      'Athletics': ['Track', 'Sprint', 'Baton', 'Decathlon', 'Hurdles', 'Starting Blocks'],
      'Swimming': ['Chlorine', 'Goggles', 'Lanes', 'Freestyle', 'Butterfly', 'Flip-turn'],
      'Hockey': ['Puck', 'Stick', 'Ice', 'Slapshot', 'Faceoff', 'Helmet', 'Zamboni'],
      'Tennis': ['Wimbledon', 'Deuce', 'Racket', 'Ace', 'Net', 'Serve', 'Clay'],
      'Badminton': ['Shuttlecock', 'Feathers', 'Smash', 'Court', 'Lightweight', 'Rally'],
      'Golf': ['Fairway', 'Tee', 'Bunker', 'Birdie', 'Putter', 'Caddie', 'Links'],
      'Squash': ['Wall', 'Enclosed', 'Squash-ball', 'Rubber', 'Sweatbox', 'Boast'],
      'Gymnastics': ['Chalk', 'Vault', 'Beam', 'Somersault', 'Parallel', 'Leotard'],
      'Trampolining': ['Springs', 'Bounce', 'Gravity', 'Canvas', 'Twist', 'Tuck'],
      'Cycling': ['Peloton', 'Gears', 'Spokes', 'Tour', 'Velodrome', 'Pedal', 'Jersey'],
      'Volleyball': ['Spike', 'Dig', 'Rotation', 'Beach', 'Set', 'Block', 'Antenna'],
      'Cricket': ['Wicket', 'Pitch', 'Bowler', 'Ashes', 'Crease', 'Boundary', 'Century'],
      'Baseball': ['Diamond', 'Strike', 'Homerun', 'Innings', 'Bunt', 'Glove', 'Mound'],
      'Basketball': ['Dunk', 'Hoop', 'Backboard', 'Rebound', 'Crossover', 'Court', 'Draft'],
    },
    foxClueBank: [
      'Sweat', 'Athlete', 'Championship', 'Tournament', 'Referee',
      'Stamina', 'Trophy', 'Fitness', 'Defense', 'Spectator',
      'Endurance', 'Captain', 'Drills', 'Whistle', 'Warmup'
    ]
  },
  {
    id: 'bands',
    name: 'BANDS',
    bannerColor: 'bg-rose-600',
    accentColor: 'text-rose-700',
    description: 'Iconic music groups and legendary pop & rock sensations',
    items: [
      'The Beatles',          'The Rolling Stones', 'AC/DC',               'Nirvana',
      'Backstreet Boys',     'One Direction',      'Guns N\' Roses',      'Queen',
      'The Beach Boys',       'Red Hot Chili Peppers', 'KISS',              'Jackson 5',
      'ABBA',                 'The Eagles',         'The Who',             'U2',
    ],
    clueBank: {
      'The Beatles': ['Abbey', 'Fab-Four', 'Yellow-Submarine', 'Liverpool', 'Yesterday', 'Penny-Lane'],
      'The Rolling Stones': ['Tongue', 'Mick', 'Satisfaction', 'Lips', 'Wild-Horses', 'Strut'],
      'AC/DC': ['Thunderbolt', 'Highway', 'Angus', 'Schoolboy', 'Voltage', 'Bells'],
      'Nirvana': ['Grunge', 'Seattle', 'Teen-Spirit', 'Cobain', 'Flannel', 'Bleach'],
      'Backstreet Boys': ['Boyband', 'Millennium', 'Harmonies', 'Orlando', 'Choreography'],
      'One Direction': ['X-Factor', 'Styles', 'Boyband', 'Midnight', 'Up-All-Night'],
      'Guns N\' Roses': ['Appetite', 'Slash', 'Top-Hat', 'Jungle', 'Bandana', 'Sweet-Child'],
      'Queen': ['Freddie', 'Rhapsody', 'Crown', 'Mustache', 'Bohemian', 'Wembley', 'Stadium'],
      'The Beach Boys': ['Surfing', 'California', 'Good-Vibrations', 'Harmonies', 'Sand'],
      'Red Hot Chili Peppers': ['Flea', 'Californication', 'Slap-Bass', 'Funk-Rock', 'Under-The-Bridge'],
      'KISS': ['Facepaint', 'Tongue', 'Pyrotechnics', 'Platform-Boots', 'Starchild'],
      'Jackson 5': ['Motown', 'Afro', 'Brothers', 'ABC', 'Gary-Indiana', 'Prodigy'],
      'ABBA': ['Sweden', 'Disco', 'Dancing-Queen', 'Waterloo', 'Eurovision', 'Spandex'],
      'The Eagles': ['California', 'Hotel', 'Harmonies', 'Desperado', 'Acoustic', 'Canyon'],
      'The Who': ['Wandsworth', 'Pinball', 'Smash-Guitar', 'Quadrophenia', 'Windmill'],
      'U2': ['Bono', 'Shades', 'Dublin', 'Joshua', 'Edge', 'Anthemic'],
    },
    foxClueBank: [
      'Vocalist', 'Guitarist', 'Concert', 'Album', 'Harmony',
      'Encore', 'Backstage', 'Headliner', 'Drummer', 'Chorus',
      'Hitmaker', 'Touring', 'Vinyl', 'Rockstars', 'Festival'
    ]
  },
  {
    id: 'zoo',
    name: 'ZOO / ANIMALS',
    bannerColor: 'bg-amber-600',
    accentColor: 'text-amber-700',
    description: 'Wild creatures, savanna giants, and exotic wonders',
    items: [
      'Elephant',    'Giraffe',     'Koala',       'Tiger',
      'Lion',        'Leopard',     'Meerkat',     'Buffalo',
      'Ostrich',     'Owl',         'Eagle',       'Parrot',
      'Scorpion',    'Alligator',   'Zebra',       'Gorilla',
    ],
    clueBank: {
      'Elephant': ['Trunk', 'Tusks', 'Memory', 'Ivory', 'Ears', 'Matriarch', 'Herd'],
      'Giraffe': ['Neck', 'Spotted', 'Canopy', 'Acacia', 'Tallest', 'Tongue'],
      'Koala': ['Eucalyptus', 'Marsupial', 'Pouch', 'Australia', 'Sleepy', 'Furry'],
      'Tiger': ['Stripes', 'Bengal', 'Apex', 'Prowl', 'Orange-Black', 'Siberian'],
      'Lion': ['Mane', 'Roar', 'Pride', 'Savanna', 'King', 'Predator'],
      'Leopard': ['Spots', 'Rosettes', 'Tree-Climber', 'Stealth', 'Nocturnal', 'Speed'],
      'Meerkat': ['Sentinel', 'Burrow', 'Standing', 'Clan', 'Mound', 'Lookout'],
      'Buffalo': ['Horns', 'Stampede', 'Plains', 'Wallow', 'Beast', 'Charge'],
      'Ostrich': ['Flightless', 'Plumes', 'Speedy', 'Buried', 'Eggs', 'Savanna'],
      'Owl': ['Nocturnal', 'Hoot', 'Wisdom', 'Swivel', 'Talons', 'Feathers'],
      'Eagle': ['Talon', 'Majestic', 'Soar', 'Sharp-Eyed', 'Aerrie', 'Beak'],
      'Parrot': ['Mimic', 'Plumage', 'Pirate', 'Tropical', 'Beak', 'Squawk'],
      'Scorpion': ['Stinger', 'Pincers', 'Venom', 'Desert', 'Exoskeleton', 'Night'],
      'Alligator': ['Swamp', 'Jaws', 'Reptile', 'Sunbathing', 'Snout', 'Scales'],
      'Zebra': ['Monochrome', 'Stripes', 'Herd', 'Savanna', 'Dazzle', 'Hooves'],
      'Gorilla': ['Silverback', 'Troop', 'Primate', 'Chest-Beating', 'Jungle', 'Knuckles'],
    },
    foxClueBank: [
      'Wild', 'Enclosure', 'Habitat', 'Carnivore', 'Herbivore',
      'Fauna', 'Claws', 'Paws', 'Camouflage', 'Keeper',
      'Safari', 'Exotic', 'Tail', 'Fur', 'Instinct'
    ]
  },
  {
    id: 'historical_figures',
    name: 'HISTORICAL FIGURES',
    bannerColor: 'bg-violet-600',
    accentColor: 'text-violet-700',
    description: 'Legends, conquerors, philosophers, and trailblazers',
    items: [
      'Jesus',                 'Napoleon',           'Stalin',              'Hitler',
      'Darwin',                'Martin Luther King Jr.', 'Pocahontas',      'Einstein',
      'Christopher Columbus',  'Mother Teresa',      'Ulysses S. Grant',    'Caesar',
      'Mozart',                'Cleopatra',          'Buddha',              'Churchill',
    ],
    clueBank: {
      'Jesus': ['Nazareth', 'Apostles', 'Parables', 'Galilee', 'Cross', 'Miracles'],
      'Napoleon': ['Bicorn', 'Waterloo', 'Corsica', 'Emperor', 'Exile', 'Hand-in-Coat'],
      'Stalin': ['Kremlin', 'Mustache', 'Gulag', 'Steel', 'Soviet', 'Five-Year'],
      'Hitler': ['Bunker', 'Reich', 'Dictator', 'Mustache', 'Infamous', 'Axis'],
      'Darwin': ['Finches', 'Galapagos', 'Evolution', 'Origin', 'Beagle', 'Natural-Selection'],
      'Martin Luther King Jr.': ['Dream', 'Selma', 'Preacher', 'Civil-Rights', 'Montgomery', 'Nobel'],
      'Pocahontas': ['Powhatan', 'Virginia', 'Colonial', 'Jamestown', 'Folklore', 'Feathers'],
      'Einstein': ['Relativity', 'Physics', 'Princeton', 'Formula', 'Genius', 'Patent-Clerk'],
      'Christopher Columbus': ['Nina', '1492', 'Navigator', 'Santa-Maria', 'Genoa', 'New-World'],
      'Mother Teresa': ['Calcutta', 'Nobel', 'Sari', 'Compassion', 'Hospice', 'Nuns'],
      'Ulysses S. Grant': ['Union', 'General', 'Civil-War', 'President', 'West-Point', 'Cigar'],
      'Caesar': ['Ides', 'Senate', 'Toga', 'Gaul', 'Emperor', 'Rubicon', 'Laurel'],
      'Mozart': ['Salzburg', 'Prodigy', 'Requiem', 'Harpsichord', 'Amadeus', 'Symphony'],
      'Cleopatra': ['Nile', 'Pharaoh', 'Asp', 'Alexandria', 'Dynasty', 'Kohl'],
      'Buddha': ['Bodhi', 'Enlightenment', 'Nirvana', 'Lotus', 'Ascetic', 'Meditation'],
      'Churchill': ['Bulldog', 'Cigar', 'Speech', 'Blitz', 'Downing', 'Victory-Sign'],
    },
    foxClueBank: [
      'Leader', 'History', 'Monument', 'Biography', 'Ancient',
      'Epoch', 'Revolution', 'Legacy', 'Chronicle', 'Famous',
      'Tome', 'Century', 'Statue', 'Influence', 'Impact'
    ]
  },
  {
    id: 'food',
    name: 'FOOD & CUISINE',
    bannerColor: 'bg-orange-600',
    accentColor: 'text-orange-700',
    description: 'Delectable dishes, street food, and global delicacies',
    items: [
      'Pizza',       'Sushi',       'Tacos',       'Curry',
      'Burger',      'Croissant',   'Pasta',       'Paella',
      'Ramen',       'Pancake',     'Dim Sum',     'Steak',
      'Chocolate',   'Ice Cream',   'Falafel',     'Cheese',
    ],
    clueBank: {
      'Pizza': ['Crust', 'Mozzarella', 'Oven', 'Pepperoni', 'Slice', 'Delivery'],
      'Sushi': ['Nori', 'Wasabi', 'Raw-Fish', 'Roll', 'Chopsticks', 'Ginger'],
      'Tacos': ['Tortilla', 'Salsa', 'Guacamole', 'Carnitas', 'Crispy', 'Lime'],
      'Curry': ['Spices', 'Turmeric', 'Naan', 'Simmer', 'Sauce', 'Aromatic'],
      'Burger': ['Bun', 'Patty', 'Pickles', 'Sesame', 'Grill', 'Fries'],
      'Croissant': ['Flaky', 'Butter', 'Pastry', 'Layers', 'Bakery', 'Crescent'],
      'Pasta': ['Al-Dente', 'Semolina', 'Colander', 'Marinara', 'Boil', 'Fork'],
      'Paella': ['Saffron', 'Rice', 'Pan', 'Valencia', 'Seafood', 'Socarrat'],
      'Ramen': ['Broth', 'Noodles', 'Slurp', 'Egg', 'Chashu', 'Bowl'],
      'Pancake': ['Syrup', 'Stack', 'Skillet', 'Batter', 'Fluffy', 'Breakfast'],
      'Dim Sum': ['Bamboo', 'Steamer', 'Dumpling', 'Teahouse', 'Cart', 'Bite-Sized'],
      'Steak': ['Ribeye', 'Sizzle', 'Medium-Rare', 'Butcher', 'Sear', 'Charcoal'],
      'Chocolate': ['Cocoa', 'Truffle', 'Sweet', 'Melting', 'Bar', 'Fudge'],
      'Ice Cream': ['Scoop', 'Cone', 'Gelato', 'Waffle', 'Sundae', 'Freezer'],
      'Falafel': ['Chickpea', 'Tahini', 'Pita', 'Fried', 'Cumin', 'Herbs'],
      'Cheese': ['Wedge', 'Rind', 'Aged', 'Dairy', 'Cheddar', 'Fondue'],
    },
    foxClueBank: [
      'Flavor', 'Kitchen', 'Appetite', 'Culinary', 'Savory',
      'Recipe', 'Chef', 'Delicious', 'Meal', 'Gourmet',
      'Dinner', 'Tasting', 'Plated', 'Hungry', 'Menu'
    ]
  }
];

export const CATEGORIES: Category[] = [...BASE_CATEGORIES, ...ADDITIONAL_CATEGORIES];

export const BOT_NAMES = [
  'Detective Hazel',
  'Captain Sterling',
  'Dr. Watson',
  'Inspector Clouseau',
  'Professor Plum',
  'Lady Eleanor',
  'Agent Foxglove',
  'Sergeant Cooper'
];

export const BOT_AVATARS = [
  '🦊', '🕵️‍♂️', '🦉', '🐱', '🎩', '🦔', '🦁', '🐻', '🐼', '🐰'
];
