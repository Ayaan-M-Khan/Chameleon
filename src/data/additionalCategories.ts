import { Category } from '../types';

export const ADDITIONAL_CATEGORIES: Category[] = [
  {
    id: 'fast_food',
    name: 'FAST FOOD CHAINS',
    bannerColor: 'bg-amber-500',
    accentColor: 'text-amber-600',
    description: 'Iconic drive-thrus, burgers, tacos, and fast casual giants',
    items: [
      "McDonald's", "Subway", "Taco Bell", "KFC",
      "Wendy's", "Burger King", "Domino's", "Pizza Hut",
      "Starbucks", "Chipotle", "Chick-fil-A", "Dunkin'",
      "Dairy Queen", "Popeyes", "Five Guys", "Panda Express"
    ],
    clueBank: {
      "McDonald's": ['Golden-Arches', 'Big-Mac', 'Happy-Meal', 'Drive-Thru', 'Nuggets', 'Clown'],
      "Subway": ['Footlong', 'Sandwich', 'BMT', 'Eat-Fresh', 'Deli', 'Sub'],
      "Taco Bell": ['Crunchwrap', 'Burrito', 'Baja-Blast', 'Bell', 'Fiesta', 'Nachos'],
      "KFC": ['Colonel', 'Bucket', 'Crispy', 'Gravy', 'Secret-Spices', 'Drumstick'],
      "Wendy's": ['Square-Patty', 'Frosty', 'Dave', 'Pigtails', 'Baconator', 'Fresh-Never-Frozen'],
      "Burger King": ['Whopper', 'Crown', 'Flame-Broiled', 'Have-It-Your-Way', 'Onion-Rings'],
      "Domino's": ['Delivery', 'Tracker', 'Pepperoni', 'Crust', 'Blue-Red-Tile', 'Speedy'],
      "Pizza Hut": ['Red-Roof', 'Pan-Pizza', 'Stuffed-Crust', 'Book-It', 'Personal-Pan'],
      "Starbucks": ['Frappuccino', 'Green-Apron', 'Siren', 'Espresso', 'Venti', 'Barista'],
      "Chipotle": ['Burrito-Bowl', 'Foil', 'Guacamole', 'Carnitas', 'Peppers', 'Cilantro-Rice'],
      "Chick-fil-A": ['Waffle-Fries', 'Closed-Sunday', 'Cow', 'Polynesian', 'Pickles', 'Chicken-Sandwich'],
      "Dunkin'": ['Munchkins', 'Iced-Coffee', 'Donut-Holes', 'Boston-Kreme', 'America-Runs'],
      "Dairy Queen": ['Blizzard', 'Upside-Down', 'Soft-Serve', 'Dip-Cone', 'Grill-Chill'],
      "Popeyes": ['Louisiana', 'Spicy-Chicken', 'Biscuits', 'Bayou', 'Cajun', 'Flaky'],
      "Five Guys": ['Peanuts', 'Brown-Bag', 'Greasy', 'Free-Toppings', 'Burgers', 'Cajun-Fries'],
      "Panda Express": ['Orange-Chicken', 'Chow-Mein', 'Wok', 'Fortune-Cookie', 'Fried-Rice', 'Bamboo']
    },
    foxClueBank: [
      'Takeout', 'Franchise', 'Counter', 'Combo', 'Packaging',
      'Value-Meal', 'Napkins', 'Fountain-Drink', 'Menu-Board', 'Fryer',
      'Condiments', 'Drive-Thru', 'Fast', 'Bite', 'Order'
    ]
  },
  {
    id: 'fruits',
    name: 'FRUITS',
    bannerColor: 'bg-emerald-500',
    accentColor: 'text-emerald-600',
    description: 'Sweet, tangy, tropical, and juicy orchard harvests',
    items: [
      'Apple', 'Banana', 'Strawberry', 'Orange',
      'Watermelon', 'Pineapple', 'Grape', 'Mango',
      'Blueberry', 'Peach', 'Lemon', 'Kiwi',
      'Cherry', 'Coconut', 'Avocado', 'Lime'
    ],
    clueBank: {
      'Apple': ['Cider', 'Core', 'Orchard', 'Crisp', 'Red-Delicious', 'Stem'],
      'Banana': ['Peel', 'Yellow', 'Potassium', 'Bunch', 'Curved', 'Monkeys'],
      'Strawberry': ['Seeds-Outside', 'Shortcake', 'Red', 'Berry', 'Stem', 'Summer'],
      'Orange': ['Citrus', 'Pulp', 'Peel', 'Segment', 'Vitamin-C', 'Juice'],
      'Watermelon': ['Rind', 'Picnic', 'Seeds', 'Green-Pink', 'Hydration', 'Slices'],
      'Pineapple': ['Spiky', 'Tropical', 'Crown', 'Yellow', 'Sweet-Sour', 'Hawaii'],
      'Grape': ['Vine', 'Bunch', 'Wine', 'Raisin', 'Purple', 'Seedless'],
      'Mango': ['Pit', 'Tropical', 'Juicy', 'Smoothie', 'Chutney', 'Orange-Flesh'],
      'Blueberry': ['Muffin', 'Pancake', 'Antioxidant', 'Tiny', 'Indigo', 'Cobbler'],
      'Peach': ['Fuzzy', 'Cobbler', 'Pit', 'Georgia', 'Sweet', 'Stone-Fruit'],
      'Lemon': ['Sour', 'Yellow', 'Zest', 'Lemonade', 'Wedge', 'Acidic'],
      'Kiwi': ['Fuzzy-Brown', 'Green-Flesh', 'Black-Seeds', 'New-Zealand', 'Tart'],
      'Cherry': ['Stem', 'Twin', 'Sundae-Topping', 'Pit', 'Dark-Red', 'Tart'],
      'Coconut': ['Palm-Tree', 'Husk', 'Milk', 'Shell', 'Tropical', 'White-Meat'],
      'Avocado': ['Guacamole', 'Pit', 'Toast', 'Creamy', 'Green', 'Salad'],
      'Lime': ['Cocktails', 'Green', 'Citrus', 'Margarita', 'Zest', 'Key-Pie']
    },
    foxClueBank: [
      'Ripe', 'Orchard', 'Sweet', 'Juice', 'Vitamins',
      'Smoothie', 'Produce', 'Skin', 'Harvest', 'Fruity',
      'Market', 'Fresh', 'Bite', 'Seed', 'Tropical'
    ]
  },
  {
    id: 'movie_franchises',
    name: 'MOVIE FRANCHISES',
    bannerColor: 'bg-indigo-600',
    accentColor: 'text-indigo-700',
    description: 'Blockbuster cinematic sagas, heroes, space epics, and magical realms',
    items: [
      'Harry Potter', 'Star Wars', 'Marvel (MCU)', 'Jurassic Park',
      'Lord of the Rings', 'Batman', 'Shrek', 'Toy Story',
      'James Bond', 'Fast & Furious', 'Spider-Man', 'Transformers',
      'The Matrix', 'Pirates of the Caribbean', 'The Hunger Games', 'Indiana Jones'
    ],
    clueBank: {
      'Harry Potter': ['Wand', 'Hogwarts', 'Spells', 'Gryffindor', 'Scar', 'Quidditch'],
      'Star Wars': ['Lightsaber', 'Jedi', 'Skywalker', 'Galactic', 'Force', 'Vader'],
      'Marvel (MCU)': ['Avengers', 'Thanos', 'Infinity-Stones', 'Comics', 'Superheroes', 'Assemble'],
      'Jurassic Park': ['Dinosaurs', 'Amber', 'Isla-Nublar', 'T-Rex', 'Fossils', 'Cloning'],
      'Lord of the Rings': ['One-Ring', 'Hobbits', 'Mordor', 'Gandalf', 'Fellowship', 'Precious'],
      'Batman': ['Gotham', 'Batmobile', 'Joker', 'Cape', 'Billionaire', 'Batcave'],
      'Shrek': ['Ogre', 'Swamp', 'Donkey', 'Layers', 'Fiona', 'Far-Far-Away'],
      'Toy Story': ['Woody', 'Buzz', 'Andy', 'Infinity', 'Playroom', 'Cowboy'],
      'James Bond': ['007', 'Martini', 'Aston-Martin', 'MI6', 'Tuxedo', 'License-To-Kill'],
      'Fast & Furious': ['Quarter-Mile', 'Cars', 'Family', 'Nitrous', 'Drifting', 'Heist'],
      'Spider-Man': ['Web-Shooter', 'Peter', 'Spider-Sense', 'Great-Responsibility', 'Wall-Crawler'],
      'Transformers': ['Autobots', 'Optimus', 'Decepticons', 'Cybertron', 'Camaro', 'Disguise'],
      'The Matrix': ['Red-Pill', 'Neo', 'Bullet-Time', 'Simulation', 'Morpheus', 'Trenchcoat'],
      'Pirates of the Caribbean': ['Black-Pearl', 'Jack-Sparrow', 'Compass', 'Rum', 'Skeleton', 'Plank'],
      'The Hunger Games': ['Mockingjay', 'Katniss', 'District-12', 'Bow-Arrow', 'Arena', 'Tribute'],
      'Indiana Jones': ['Whip', 'Fedora', 'Archaeology', 'Boulder', 'Lost-Ark', 'Snakes']
    },
    foxClueBank: [
      'Sequel', 'Blockbuster', 'Cinematic', 'Director', 'Soundtrack',
      'Protagonist', 'Box-Office', 'Action', 'Trilogy', 'Premiere',
      'Popcorn', 'Hollywood', 'Stunt', 'Villain', 'Theater'
    ]
  },
  {
    id: 'household_items',
    name: 'EVERYDAY HOUSEHOLD ITEMS',
    bannerColor: 'bg-sky-600',
    accentColor: 'text-sky-700',
    description: 'Common furniture, electronics, and kitchen essentials in every room',
    items: [
      'Refrigerator', 'Microwave', 'Toaster', 'Couch',
      'Television', 'Bed', 'Mirror', 'Lamp',
      'Blender', 'Vacuum Cleaner', 'Washing Machine', 'Clock',
      'Pillow', 'Scissors', 'Trash Can', 'Desk'
    ],
    clueBank: {
      'Refrigerator': ['Freezer', 'Condiments', 'Cold', 'Magnets', 'Crisper', 'Chilled'],
      'Microwave': ['Turntable', 'Beep', 'Reheat', 'Door-Latch', 'Quick-Cook', 'Leftovers'],
      'Toaster': ['Crumb-Tray', 'Slots', 'Pop-Up', 'Crisp-Bread', 'Browning', 'Lever'],
      'Couch': ['Cushions', 'Living-Room', 'Sofa', 'Comfortable', 'Upholstery', 'Lounging'],
      'Television': ['Screen', 'Remote', 'HDMI', 'Streaming', 'Pixels', 'Channels'],
      'Bed': ['Mattress', 'Blanket', 'Sheets', 'Slumber', 'Headboard', 'Duvet'],
      'Mirror': ['Reflection', 'Glass', 'Vanity', 'Silvered', 'Looking-Glass', 'Bathroom'],
      'Lamp': ['Bulb', 'Shade', 'Switch', 'Nightstand', 'Illumination', 'Socket'],
      'Blender': ['Blades', 'Smoothie', 'Pitcher', 'Pulse', 'Crush-Ice', 'Puree'],
      'Vacuum Cleaner': ['Suction', 'Hose', 'Carpet', 'Dustbag', 'Nozzle', 'Upright'],
      'Washing Machine': ['Laundry', 'Spin-Cycle', 'Detergent', 'Drum', 'Rinse', 'Appliance'],
      'Clock': ['Hands', 'Tick-Tock', 'Dial', 'Hour', 'Numbers', 'Pendulum'],
      'Pillow': ['Feathers', 'Slipcover', 'Soft', 'Headrest', 'Cushion', 'Sleep'],
      'Scissors': ['Blades', 'Handles', 'Snip', 'Paper-Cutting', 'Sharp', 'Pivot'],
      'Trash Can': ['Lid', 'Liner', 'Disposal', 'Bin', 'Refuse', 'Pedal'],
      'Desk': ['Drawers', 'Study', 'Office', 'Workstation', 'Keyboard-Tray', 'Writing']
    },
    foxClueBank: [
      'Room', 'Indoor', 'Furniture', 'Domestic', 'Utility',
      'Appliance', 'Living', 'Convenience', 'Home', 'Storage',
      'Household', 'Daily', 'Plug', 'Interior', 'Fixture'
    ]
  },
  {
    id: 'countries',
    name: 'COUNTRIES',
    bannerColor: 'bg-teal-600',
    accentColor: 'text-teal-700',
    description: 'Global superpowers, cultural wonders, and continental nations',
    items: [
      'United States', 'Canada', 'Mexico', 'United Kingdom',
      'France', 'Germany', 'Italy', 'Japan',
      'China', 'India', 'Australia', 'Brazil',
      'Egypt', 'Spain', 'South Korea', 'Russia'
    ],
    clueBank: {
      'United States': ['Stars-Stripes', 'Washington', 'States', 'Liberty', 'Eagle', 'Coast-to-Coast'],
      'Canada': ['Maple-Leaf', 'Ottawa', 'Hockey', 'Moose', 'Beaver', 'Mounties'],
      'Mexico': ['Mariachi', 'Sombrero', 'Pyramids', 'Aztec', 'Cancun', 'Agave'],
      'United Kingdom': ['Big-Ben', 'Monarchy', 'Parliament', 'London', 'Thames', 'Tea'],
      'France': ['Eiffel-Tower', 'Baguette', 'Paris', 'Louvre', 'Tricolor', 'Croissant'],
      'Germany': ['Autobahn', 'Berlin', 'Bavaria', 'Oktoberfest', 'Pretzel', 'Castles'],
      'Italy': ['Colosseum', 'Rome', 'Venice-Gondola', 'Pasta', 'Boot-Shaped', 'Renaissance'],
      'Japan': ['Tokyo', 'Mount-Fuji', 'Sakura', 'Anime', 'Samurai', 'Bullet-Train'],
      'China': ['Great-Wall', 'Beijing', 'Panda', 'Forbidden-City', 'Dynasties', 'Silk-Road'],
      'India': ['Taj-Mahal', 'New-Delhi', 'Curry', 'Ganges', 'Bollywood', 'Monsoon'],
      'Australia': ['Outback', 'Kangaroo', 'Sydney-Opera', 'Reef', 'Boomerang', 'Down-Under'],
      'Brazil': ['Carnaval', 'Amazon', 'Samba', 'Rio', 'Christ-Redeemer', 'Pelé'],
      'Egypt': ['Pyramids', 'Pharaohs', 'Nile', 'Sphinx', 'Cairo', 'Hieroglyphs'],
      'Spain': ['Madrid', 'Flamenco', 'Tapas', 'Barcelona', 'Matador', 'Siesta'],
      'South Korea': ['Seoul', 'K-Pop', 'Kimchi', 'Hangul', 'Taekwondo', 'Samsung'],
      'Russia': ['Kremlin', 'Moscow', 'Siberia', 'Matryoshka', 'Taiga', 'Red-Square']
    },
    foxClueBank: [
      'Flag', 'Passport', 'Capital', 'Border', 'Nation',
      'Continent', 'Culture', 'Anthem', 'Territory', 'Globe',
      'Embassy', 'Citizen', 'Geography', 'Landmark', 'Language'
    ]
  },
  {
    id: 'superheroes',
    name: 'SUPERHEROES',
    bannerColor: 'bg-red-600',
    accentColor: 'text-red-700',
    description: 'Masked vigilantes, galactic defenders, and comic book titans',
    items: [
      'Spider-Man', 'Batman', 'Superman', 'Iron Man',
      'Wonder Woman', 'Captain America', 'The Flash', 'Thor',
      'Hulk', 'Wolverine', 'Black Panther', 'Aquaman',
      'Deadpool', 'Doctor Strange', 'Robin', 'Green Lantern'
    ],
    clueBank: {
      'Spider-Man': ['Webs', 'Wall-Crawler', 'Peter', 'Spider-Sense', 'Queens', 'Spidey'],
      'Batman': ['Batarang', 'Cape', 'Gotham', 'Dark-Knight', 'Cave', 'Billionaire'],
      'Superman': ['Krypton', 'Cape', 'Lois-Lane', 'Flight', 'S-Shield', 'Daily-Planet'],
      'Iron Man': ['Arc-Reactor', 'Stark', 'Suit', 'Jarvis', 'Repulsor', 'Genius'],
      'Wonder Woman': ['Lasso-Truth', 'Themyscira', 'Amazon', 'Bracelets', 'Tiara', 'Shield'],
      'Captain America': ['Vibranium-Shield', 'Super-Soldier', 'Steve', 'Stars-Stripes', 'First-Avenger'],
      'The Flash': ['Speedster', 'Lightning-Bolt', 'Red-Suit', 'Speed-Force', 'Barry', 'Fastest-Man'],
      'Thor': ['Mjolnir', 'Asgard', 'Thunder', 'Hammer', 'Lightning', 'Odin'],
      'Hulk': ['Smash', 'Banner', 'Green-Goliath', 'Gamma-Rays', 'Rage', 'Monstrous'],
      'Wolverine': ['Adamantium', 'Claws', 'Healing-Factor', 'Logan', 'X-Men', 'Feral'],
      'Black Panther': ['Wakanda', 'Vibranium', 'Claws', 'King', 'Panther-Habit', 'T-Challa'],
      'Aquaman': ['Atlantis', 'Trident', 'Ocean', 'Marine-Life', 'King-Seas', 'Scales'],
      'Deadpool': ['Merc-with-Mouth', 'Chimichangas', 'Fourth-Wall', 'Katanas', 'Red-Mask', 'Wade'],
      'Doctor Strange': ['Eye-Agamotto', 'Sorcerer-Supreme', 'Cape-Levitation', 'Mystic', 'Portals'],
      'Robin': ['Sidekick', 'Boy-Wonder', 'Staff', 'Gotham', 'Dick-Grayson', 'Titans'],
      'Green Lantern': ['Power-Ring', 'Willpower', 'Constructs', 'Oa', 'Emerald-Knight', 'Oath']
    },
    foxClueBank: [
      'Mask', 'Costume', 'Villain', 'Superpower', 'Heroic',
      'Justice', 'Comics', 'Alias', 'Rescue', 'Vigilante',
      'Caped', 'Strength', 'Battle', 'Save-The-Day', 'Origin'
    ]
  },
  {
    id: 'professions',
    name: 'PROFESSIONS & JOBS',
    bannerColor: 'bg-blue-600',
    accentColor: 'text-blue-700',
    description: 'Skilled careers, civil servants, specialists, and tradespeople',
    items: [
      'Doctor', 'Teacher', 'Firefighter', 'Police Officer',
      'Chef', 'Pilot', 'Astronaut', 'Lawyer',
      'Dentist', 'Construction Worker', 'Plumber', 'Veterinarian',
      'Judge', 'Nurse', 'Architect', 'Farmer'
    ],
    clueBank: {
      'Doctor': ['Stethoscope', 'Prescription', 'White-Coat', 'Clinic', 'Diagnosis', 'Hospital'],
      'Teacher': ['Blackboard', 'Lesson-Plan', 'Grading', 'Classroom', 'Homework', 'Pencil'],
      'Firefighter': ['Hose', 'Hydrant', 'Ladder-Truck', 'Smoke', 'Siren', 'Turnout-Gear'],
      'Police Officer': ['Badge', 'Patrol-Car', 'Handcuffs', 'Siren', 'Uniform', 'Radio'],
      'Chef': ['Apron', 'Toque', 'Skillet', 'Kitchen', 'Knife', 'Recipe'],
      'Pilot': ['Cockpit', 'Aviation', 'Wings', 'Runway', 'Altitude', 'Flight-Deck'],
      'Astronaut': ['Spacewalk', 'Spacesuit', 'Helmet', 'Zero-G', 'Rocket', 'NASA'],
      'Lawyer': ['Briefcase', 'Courtroom', 'Objection', 'Contract', 'Bar-Exam', 'Defense'],
      'Dentist': ['Tooth-Drill', 'Cavity', 'Enamel', 'Plaque', 'Floss', 'Examination-Chair'],
      'Construction Worker': ['Hardhat', 'Scaffolding', 'Blueprint', 'Steel-Toed', 'Crane', 'Concrete'],
      'Plumber': ['Pipe-Wrench', 'Drain', 'Solder', 'Pipes', 'Leak', 'Clog'],
      'Veterinarian': ['Animals', 'Paws', 'Furry-Patients', 'Vaccine', 'Stethoscope', 'Clinic'],
      'Judge': ['Gavel', 'Robe', 'Bench', 'Verdict', 'Courtroom', 'Order'],
      'Nurse': ['Scrubs', 'Vitals', 'Syringe', 'Bedside', 'Compassion', 'Triage'],
      'Architect': ['Blueprints', 'Drafting-Table', 'Elevations', 'Scale-Model', 'Floorplans'],
      'Farmer': ['Tractor', 'Crops', 'Harvest', 'Barn', 'Fields', 'Plow']
    },
    foxClueBank: [
      'Salary', 'Career', 'Interview', 'Uniform', 'Workplace',
      'Training', 'Duty', 'Colleagues', 'Shift', 'Credentials',
      'Specialist', 'Resume', 'Profession', 'Degree', 'Trade'
    ]
  },
  {
    id: 'desserts',
    name: 'DESSERTS & SWEETS',
    bannerColor: 'bg-pink-500',
    accentColor: 'text-pink-600',
    description: 'Sugary confections, baked treats, bakery classics, and frozen delights',
    items: [
      'Ice Cream', 'Chocolate Cake', 'Donut', 'Cookie',
      'Brownie', 'Cupcake', 'Cheesecake', 'Apple Pie',
      'Churro', 'Marshmallow', 'Cotton Candy', 'Pudding',
      'Macaron', 'Waffle', 'Candy Cane', 'Croissant'
    ],
    clueBank: {
      'Ice Cream': ['Scoop', 'Cone', 'Gelato', 'Sundae', 'Freezer', 'Melting'],
      'Chocolate Cake': ['Fudge', 'Layers', 'Frosting', 'Candles', 'Rich', 'Slice'],
      'Donut': ['Glaze', 'Sprinkles', 'Hole', 'Fried-Dough', 'Boston-Cream', 'Box'],
      'Cookie': ['Chocolate-Chips', 'Oven-Baked', 'Dough', 'Milk-Dunk', 'Batch', 'Crisp'],
      'Brownie': ['Square', 'Fudgy', 'Cocoa', 'Corner-Piece', 'Chewy', 'Walnuts'],
      'Cupcake': ['Paper-Liner', 'Swirled-Icing', 'Individual', 'Topping', 'Bake-Sale'],
      'Cheesecake': ['Graham-Crust', 'Cream-Cheese', 'Strawberry-Drizzle', 'Dense', 'Rich'],
      'Apple Pie': ['Lattice-Crust', 'Cinnamon', 'Warm-Slice', 'Mode', 'Orchard'],
      'Churro': ['Cinnamon-Sugar', 'Fried-Fluted', 'Dipping-Chocolate', 'Theme-Park', 'Crispy'],
      'Marshmallow': ['Campfire', 'Toasted', 'Smores', 'Puffy', 'Hot-Cocoa', 'Sticky'],
      'Cotton Candy': ['Spun-Sugar', 'Pink-Carnival', 'Paper-Cone', 'Melts-Tongue', 'Fairground'],
      'Pudding': ['Custard', 'Spoonful', 'Vanilla-Cup', 'Smooth', 'Skin-Top', 'Creamy'],
      'Macaron': ['Meringue-Shell', 'Ganache', 'French', 'Pastel', 'Almond-Flour', 'Delicate'],
      'Waffle': ['Gridded', 'Maple-Syrup', 'Iron', 'Berries', 'Whipped-Cream', 'Crisp'],
      'Candy Cane': ['Peppermint', 'Striped-Hook', 'Christmas-Stocking', 'Minty', 'Winter'],
      'Croissant': ['Flaky-Layers', 'Butter', 'Crescent', 'Pastry', 'French-Bakery']
    },
    foxClueBank: [
      'Sweet', 'Sugar', 'Bakery', 'Indulgence', 'Treat',
      'Confection', 'Dessert', 'Baking', 'Delicious', 'Icing',
      'After-Dinner', 'Pastry', 'Decadent', 'Craving', 'Vanilla'
    ]
  },
  {
    id: 'vehicles',
    name: 'VEHICLES & TRANSPORTATION',
    bannerColor: 'bg-cyan-600',
    accentColor: 'text-cyan-700',
    description: 'Machines that fly, sail, roll, and accelerate across earth, sea, and space',
    items: [
      'Airplane', 'Helicopter', 'Bicycle', 'Motorcycle',
      'Submarine', 'Train', 'Bus', 'Cruise Ship',
      'Hot Air Balloon', 'Skateboard', 'Tractor', 'Ambulance',
      'Fire Truck', 'Taxi', 'Jet Ski', 'Rocket'
    ],
    clueBank: {
      'Airplane': ['Jet-Engine', 'Wings', 'Runway', 'Altitude', 'Turbulence', 'Aviation'],
      'Helicopter': ['Rotors', 'Hover', 'Helipad', 'Blades', 'Tail-Rotor', 'Vertical'],
      'Bicycle': ['Pedals', 'Handlebars', 'Spokes', 'Chain', 'Helmet', 'Two-Wheeler'],
      'Motorcycle': ['Revving', 'Exhaust', 'Leather-Jacket', 'Cruiser', 'Throttle', 'Chopper'],
      'Submarine': ['Periscope', 'Depth-Gauge', 'Torpedo', 'Sonar', 'Nautical', 'Submerged'],
      'Train': ['Locomotive', 'Tracks', 'Boxcars', 'Conductor', 'Whistle', 'Depot'],
      'Bus': ['Transit', 'Double-Decker', 'Farebox', 'Stops', 'School-Yellow', 'Commute'],
      'Cruise Ship': ['Lido-Deck', 'Ocean-Liner', 'Balcony-Cabins', 'Anchor', 'Buffet', 'Port'],
      'Hot Air Balloon': ['Wicker-Basket', 'Burner', 'Propane-Flame', 'Float', 'Canopy'],
      'Skateboard': ['Grip-Tape', 'Trucks', 'Urethane-Wheels', 'Ollie', 'Deck', 'Halfpipe'],
      'Tractor': ['Giant-Tires', 'Farmland', 'Plow', 'Cultivator', 'Diesel', 'Fields'],
      'Ambulance': ['Siren', 'Stretcher', 'Paramedic', 'Flashing-Lights', 'Emergency-Transit'],
      'Fire Truck': ['Ladder', 'Hoses', 'Water-Cannon', 'Sirens', 'Firehouse', 'Bright-Red'],
      'Taxi': ['Checker-Cab', 'Meter', 'Yellow', 'Hail', 'Fare', 'City-Streets'],
      'Jet Ski': ['Handlebars', 'Spray', 'Wake', 'Watercraft', 'Life-Vest', 'Engine'],
      'Rocket': ['Launchpad', 'Countdown', 'Booster-Stage', 'Thrusters', 'Orbit', 'Cape-Canaveral']
    },
    foxClueBank: [
      'Passenger', 'Travel', 'Commute', 'Engine', 'Wheels',
      'Transport', 'Speed', 'Fuel', 'Journey', 'Vehicle',
      'Navigation', 'Driver', 'Mechanic', 'Transit', 'Trip'
    ]
  },
  {
    id: 'instruments',
    name: 'MUSICAL INSTRUMENTS',
    bannerColor: 'bg-purple-600',
    accentColor: 'text-purple-700',
    description: 'Strings, brass, woodwinds, percussion, and classical concert hall staples',
    items: [
      'Acoustic Guitar', 'Piano', 'Drums', 'Violin',
      'Trumpet', 'Flute', 'Saxophone', 'Electric Bass',
      'Harmonica', 'Harp', 'Clarinet', 'Cello',
      'Accordion', 'Banjo', 'Ukulele', 'Trombone'
    ],
    clueBank: {
      'Acoustic Guitar': ['Soundhole', 'Fretboard', 'Strum', 'Pick', 'Campfire', 'Six-Strings'],
      'Piano': ['Ebony-Ivory', 'Keys', 'Pedals', 'Grand', 'Hammers', 'Bench'],
      'Drums': ['Cymbals', 'Sticks', 'Snare', 'Bass-Kick', 'Hi-Hat', 'Percussion'],
      'Violin': ['Horsehair-Bow', 'Chinrest', 'Strings', 'Fiddle', 'Virtuoso', 'Orchestra'],
      'Trumpet': ['Three-Valves', 'Brass', 'Fanfare', 'Mute', 'Mouthpiece', 'Bugle'],
      'Flute': ['Silver-Pipe', 'Woodwind', 'Keyholes', 'Air-Embouchure', 'High-Pitch'],
      'Saxophone': ['Curved-Brass', 'Reed', 'Jazz', 'Alto', 'Tenor', 'Bell'],
      'Electric Bass': ['Four-Thick-Strings', 'Groove', 'Rhythm-Section', 'Amplifier', 'Slap'],
      'Harmonica': ['Mouth-Organ', 'Blues', 'Reeds', 'Pocket-Sized', 'Blowing-Drawing'],
      'Harp': ['Pedals', 'Plucked-Strings', 'Heavenly', 'Triangular-Frame', 'Glissando'],
      'Clarinet': ['Single-Reed', 'Black-Wood', 'Bell', 'Ebony', 'Orchestral'],
      'Cello': ['Endpin', 'Seated-Between-Knees', 'Deep-Strings', 'Bow', 'Warm-Tone'],
      'Accordion': ['Bellows', 'Squeeze-Box', 'Polka', 'Keyboard-Side', 'Straps'],
      'Banjo': ['Resonator-Head', 'Bluegrass', 'Fingerpicking', 'Fifth-Peg', 'Twangy'],
      'Ukulele': ['Hawaii', 'Small-Four-Strings', 'Nylon', 'Strumming', 'Beach'],
      'Trombone': ['Telescoping-Slide', 'Brass', 'Glissando', 'Low-Brass', 'Big-Band']
    },
    foxClueBank: [
      'Melody', 'Tempo', 'Tuning', 'Acoustics', 'Performance',
      'Composer', 'Concert', 'Rhythm', 'Notes', 'Harmonics',
      'Sheet-Music', 'Musician', 'Recital', 'Scale', 'Auditorium'
    ]
  },
  {
    id: 'video_games',
    name: 'VIDEO GAMES',
    bannerColor: 'bg-violet-600',
    accentColor: 'text-violet-700',
    description: 'Generational gaming franchises, virtual worlds, battle royales, and classics',
    items: [
      'Minecraft', 'Fortnite', 'Super Mario Bros', 'Pokémon',
      'Grand Theft Auto', 'Call of Duty', 'Tetris', 'Roblox',
      'Among Us', 'Pac-Man', 'The Legend of Zelda', 'Sonic the Hedgehog',
      'FIFA', 'League of Legends', 'Angry Birds', 'Clash of Clans'
    ],
    clueBank: {
      'Minecraft': ['Creeper', 'Pickaxe', 'Voxel-Blocks', 'Crafting-Table', 'Nether', 'Diamond-Armor'],
      'Fortnite': ['Battle-Bus', 'Tilted-Towers', 'Building', 'Victory-Royale', 'Storm-Circle', 'Emotes'],
      'Super Mario Bros': ['Mushroom-Kingdom', 'Plumber', 'Bowser', 'Goomba', 'Pipes', 'Princess-Peach'],
      'Pokémon': ['Pokeball', 'Pikachu', 'Gym-Badges', 'Catch-Them-All', 'Evolution', 'Trainer'],
      'Grand Theft Auto': ['Wanted-Stars', 'Heist', 'Los-Santos', 'Open-World', 'Radio-Stations'],
      'Call of Duty': ['First-Person', 'Killstreak', 'Zombies', 'Loadout', 'Military', 'Shooter'],
      'Tetris': ['Falling-Minoes', 'Line-Clear', 'Russian-Theme', 'Stacking', 'Rotation', 'Puzzle'],
      'Roblox': ['Robux', 'User-Created', 'Avatars', 'Obby', 'Lego-Like', 'Platform'],
      'Among Us': ['Impostor', 'Vents', 'Emergency-Meeting', 'Tasks', 'Crewmate', 'Spaceship'],
      'Pac-Man': ['Pellets', 'Ghosts', 'Cherry', 'Arcade-Maze', 'Waka-Waka', 'Power-Pellet'],
      'The Legend of Zelda': ['Triforce', 'Master-Sword', 'Hyrule', 'Link', 'Ocarina', 'Rupees'],
      'Sonic the Hedgehog': ['Golden-Rings', 'Blue-Speedster', 'Loop-De-Loop', 'Green-Hill', 'Eggman'],
      'FIFA': ['Pitch', 'Ultimate-Team', 'Goal', 'EA-Sports', 'Football-Simulation', 'Corner-Kick'],
      'League of Legends': ['MOBA', 'Summoners-Rift', 'Nexus', 'Champions', 'Lanes', 'Baron'],
      'Angry Birds': ['Slingshot', 'Pigs', 'Feathered', 'Destruction', 'Eggs', 'Wood-Glass'],
      'Clash of Clans': ['Town-Hall', 'Raiding', 'Elixir', 'Barbarians', 'Village', 'Cannons']
    },
    foxClueBank: [
      'Gamer', 'Controller', 'High-Score', 'Multiplayer', 'Pixel',
      'Respawn', 'Level-Up', 'Campaign', 'Leaderboard', 'Console',
      'Franchise', 'Joystick', 'Gameplay', 'Avatar', 'Graphics'
    ]
  },
  {
    id: 'clothing',
    name: 'CLOTHING & ACCESSORIES',
    bannerColor: 'bg-fuchsia-600',
    accentColor: 'text-fuchsia-700',
    description: 'Wardrobe essentials, street fashion, footwear, and cold-weather gear',
    items: [
      'Hoodie', 'Blue Jeans', 'Sunglasses', 'Baseball Cap',
      'Winter Coat', 'Sneakers', 'High Heels', 'Scarf',
      'Leather Belt', 'Wristwatch', 'Pajamas', 'Swimsuit',
      'Necktie', 'Gloves', 'Backpack', 'Socks'
    ],
    clueBank: {
      'Hoodie': ['Kangaroo-Pocket', 'Drawstring', 'Fleece', 'Casual', 'Pullover', 'Sweatshirt'],
      'Blue Jeans': ['Denim', 'Rivets', 'Five-Pockets', 'Pants', 'Indigo', 'Belt-Loops'],
      'Sunglasses': ['Tinted-Lenses', 'UV-Protection', 'Frames', 'Shades', 'Aviators', 'Summer'],
      'Baseball Cap': ['Curved-Brim', 'Snapback', 'Team-Logo', 'Visor', 'Crown', 'Fitted'],
      'Winter Coat': ['Insulated', 'Parka', 'Zipper', 'Down-Feathers', 'Heavyweight', 'Freezing'],
      'Sneakers': ['Laces', 'Rubber-Sole', 'Athletic', 'Kicks', 'Sneakerhead', 'Tread'],
      'High Heels': ['Stiletto', 'Pumps', 'Elevated', 'Evening-Wear', 'Arch', 'Formal'],
      'Scarf': ['Knitted', 'Neck-Wrap', 'Wool', 'Tassels', 'Cozy', 'Warmth'],
      'Leather Belt': ['Buckle', 'Waistline', 'Notches', 'Loop', 'Holding-Pants', 'Strap'],
      'Wristwatch': ['Hands', 'Tick', 'Bezel', 'Strap', 'Crown', 'Timepiece'],
      'Pajamas': ['Bedtime', 'Flannel', 'Sleepwear', 'Pants-Shirt', 'Cozy', 'Slippers'],
      'Swimsuit': ['Bikini', 'Trunks', 'Poolside', 'Lycra', 'Beach', 'Swimming'],
      'Necktie': ['Windsor-Knot', 'Collar', 'Silk', 'Formal', 'Business', 'Suit'],
      'Gloves': ['Fingers', 'Leather', 'Warmth', 'Mittens', 'Winter', 'Grip'],
      'Backpack': ['Straps', 'Zippers', 'Compartments', 'Schoolbag', 'Bookbag', 'Carry-On'],
      'Socks': ['Cotton', 'Heel-Toe', 'Ankles', 'Pair', 'Shoes', 'Knitted']
    },
    foxClueBank: [
      'Fabric', 'Outfit', 'Fashion', 'Wardrobe', 'Wearing',
      'Stitching', 'Textile', 'Apparel', 'Size', 'Closet',
      'Style', 'Laundry', 'Tailor', 'Fitting', 'Cotton'
    ]
  },
  {
    id: 'disney_animation',
    name: 'DISNEY & ANIMATION CHARACTERS',
    bannerColor: 'bg-amber-600',
    accentColor: 'text-amber-700',
    description: 'Timeless animated icons, princesses, cartoon heroes, and sidekicks',
    items: [
      'Mickey Mouse', 'Donald Duck', 'Elsa', 'Simba',
      'Aladdin', 'Buzz Lightyear', 'Woody', 'Winnie the Pooh',
      'Stitch', 'Cinderella', 'SpongeBob', 'Homer Simpson',
      'Shrek', 'Pikachu', 'Mario', 'Garfield'
    ],
    clueBank: {
      'Mickey Mouse': ['Round-Ears', 'White-Gloves', 'Red-Shorts', 'Steamboat', 'Disneyland', 'Sorcerer'],
      'Donald Duck': ['Sailor-Cap', 'Beak', 'Quack', 'Feathers', 'Temper', 'Duckburg'],
      'Elsa': ['Let-It-Go', 'Ice-Palace', 'Arendelle', 'Blonde-Braid', 'Snowflake', 'Frozen'],
      'Simba': ['Pride-Rock', 'Lion-Cub', 'Roar', 'Hakuna-Matata', 'Mufasa', 'Savanna'],
      'Aladdin': ['Magic-Carpet', 'Genie-Lamp', 'Agrabah', 'Street-Rat', 'Prince-Ali', 'Jasmine'],
      'Buzz Lightyear': ['Infinity-Beyond', 'Space-Ranger', 'Laser', 'Wings', 'Star-Command'],
      'Woody': ['Snake-Boot', 'Pull-String', 'Cowboy', 'Sheriff-Badge', 'Andy', 'Hat'],
      'Winnie the Pooh': ['Hunny-Pot', 'Red-Shirt', 'Hundred-Acre-Wood', 'Bear', 'Teddy', 'Eeyore'],
      'Stitch': ['Experiment-626', 'Hawaii', 'Ohana', 'Blue-Alien', 'Lilo', 'Mischief'],
      'Cinderella': ['Glass-Slipper', 'Midnight', 'Pumpkin-Carriage', 'Fairy-Godmother', 'Ball'],
      'SpongeBob': ['SquarePants', 'Bikini-Bottom', 'Krabby-Patty', 'Pineapple', 'Yellow-Spongy'],
      'Homer Simpson': ['Donuts', 'Springfield', 'Doh', 'Duff-Beer', 'Nuclear-Plant', 'Yellow-Dad'],
      'Shrek': ['Swamp', 'Ogre', 'Fiona', 'Donkey', 'Green', 'Onion-Layers'],
      'Pikachu': ['Thunderbolt', 'Yellow-Rodent', 'Red-Cheeks', 'Ash-Ketchum', 'Pika'],
      'Mario': ['Red-Cap', 'Mustache', 'Overalls', 'Super-Mushroom', 'Plumber', 'Nintendo'],
      'Garfield': ['Lasagna', 'Mondays', 'Orange-Tabby', 'Lazy', 'Odie', 'Jon']
    },
    foxClueBank: [
      'Cartoon', 'Animated', 'Fictional', 'Costume', 'Voice-Actor',
      'Merchandise', 'Theme-Park', 'Drawing', 'Beloved', 'Storybook',
      'Childhood', 'Protagonist', 'Color', 'Character', 'Iconic'
    ]
  },
  {
    id: 'school_subjects',
    name: 'SCHOOL SUBJECTS',
    bannerColor: 'bg-lime-600',
    accentColor: 'text-lime-700',
    description: 'Academic courses, lab sciences, humanities, and extracurricular disciplines',
    items: [
      'Mathematics', 'English / Literature', 'History', 'Biology',
      'Chemistry', 'Physics', 'Art', 'Physical Education (Gym)',
      'Music', 'Geography', 'Computer Science', 'Spanish',
      'Drama', 'Economics', 'Psychology', 'Philosophy'
    ],
    clueBank: {
      'Mathematics': ['Algebra', 'Equations', 'Calculus', 'Numbers', 'Geometry', 'Proof'],
      'English / Literature': ['Novels', 'Grammar', 'Essays', 'Shakespeare', 'Poetry', 'Themes'],
      'History': ['Timeline', 'Centuries', 'Revolutions', 'Artifacts', 'Treaties', 'Ancient'],
      'Biology': ['Cells', 'Dissection', 'Genetics', 'Ecosystems', 'Organisms', 'DNA'],
      'Chemistry': ['Periodic-Table', 'Test-Tubes', 'Molecules', 'Reactions', 'Beakers', 'Acid'],
      'Physics': ['Gravity', 'Velocity', 'Kinetic', 'Optics', 'Formulas', 'Newton'],
      'Art': ['Easel', 'Paintbrush', 'Canvas', 'Sculpting', 'Color-Palette', 'Sketchbook'],
      'Physical Education (Gym)': ['Dodgeball', 'Laps', 'Whistle', 'Fitness', 'Bleachers', 'Sneakers'],
      'Music': ['Notes', 'Choir', 'Clefs', 'Band', 'Rhythm', 'Instruments'],
      'Geography': ['Maps', 'Continents', 'Topography', 'Capitals', 'Latitude', 'Globe'],
      'Computer Science': ['Coding', 'Algorithms', 'Binary', 'Software', 'Debugging', 'Syntax'],
      'Spanish': ['Conjugation', 'Vocabulary', 'Accent-Marks', 'Foreign-Language', 'Hola'],
      'Drama': ['Monologue', 'Play', 'Stage', 'Costumes', 'Curtain', 'Rehearsal'],
      'Economics': ['Supply-Demand', 'Inflation', 'Markets', 'Fiscal', 'GNP', 'Interest-Rates'],
      'Psychology': ['Behavior', 'Mind', 'Pavlov', 'Freud', 'Cognition', 'Therapy'],
      'Philosophy': ['Logic', 'Ethics', 'Morality', 'Socrates', 'Epistemology', 'Existentialism']
    },
    foxClueBank: [
      'Textbook', 'Exam', 'Classroom', 'Teacher', 'Curriculum',
      'Syllabus', 'Homework', 'Study', 'Lecture', 'Grades',
      'Academic', 'Semester', 'Notebook', 'Quiz', 'Lesson'
    ]
  },
  {
    id: 'breakfast_foods',
    name: 'BREAKFAST FOODS',
    bannerColor: 'bg-yellow-500',
    accentColor: 'text-yellow-600',
    description: 'Morning staples, griddle favorites, pastries, and skillet classics',
    items: [
      'Scrambled Eggs', 'Pancakes', 'Bacon', 'French Toast',
      'Bagel', 'Oatmeal', 'Cereal', 'Toast',
      'Breakfast Burrito', 'Sausage', 'Yogurt', 'Hash Browns',
      'Omelet', 'Cinnamon Roll', 'Muffins', 'Smoothie'
    ],
    clueBank: {
      'Scrambled Eggs': ['Whisked', 'Skillet', 'Yellow', 'Fluffy', 'Salt-Pepper', 'Pan'],
      'Pancakes': ['Syrup', 'Stack', 'Fluffy', 'Griddle', 'Butter-Pat', 'Short-Stack'],
      'Bacon': ['Crispy', 'Sizzling', 'Strips', 'Pork', 'Smoky', 'Grease'],
      'French Toast': ['Egg-Battered', 'Brioche', 'Powdered-Sugar', 'Cinnamon', 'Syrup'],
      'Bagel': ['Cream-Cheese', 'Everything', 'Toasted', 'Boiled-Dough', 'Schmear', 'Hole'],
      'Oatmeal': ['Rolled-Oats', 'Brown-Sugar', 'Porridge', 'Cinnamon', 'Warm-Bowl'],
      'Cereal': ['Milk-Bowl', 'Crunchy', 'Spoon', 'Box', 'Flakes', 'Morning'],
      'Toast': ['Toaster', 'Golden-Brown', 'Butter', 'Jam', 'Sliced-Bread', 'Crisp'],
      'Breakfast Burrito': ['Tortilla', 'Salsa', 'Scrambled', 'Wrapped', 'Chorizo', 'Handheld'],
      'Sausage': ['Links', 'Patties', 'Maple', 'Savory', 'Ground-Pork', 'Skillet'],
      'Yogurt': ['Parfait', 'Granola', 'Greek', 'Cultured', 'Berries', 'Spoonful'],
      'Hash Browns': ['Shredded-Potato', 'Golden-Crisp', 'Griddle', 'Crispy-Patties', 'Ketchup'],
      'Omelet': ['Folded', 'Cheese-Fillings', 'Peppers', 'Whisked-Eggs', 'Skillet'],
      'Cinnamon Roll': ['Icing-Glaze', 'Spiral', 'Warm-Pastry', 'Bakery', 'Sticky', 'Sweet'],
      'Muffins': ['Blueberry', 'Cup-Wrapper', 'Bakery-Top', 'Crumbly', 'Oven-Baked'],
      'Smoothie': ['Blended', 'Straw', 'Fruit-Puree', 'Protein', 'Icy', 'Glass']
    },
    foxClueBank: [
      'Morning', 'Coffee', 'Breakfast', 'Plate', 'Griddle',
      'Sunrise', 'Diner', 'Appetite', 'Fork', 'Kitchen',
      'Crispy', 'Savory', 'Sweet', 'Fresh', 'Warm'
    ]
  },
  {
    id: 'mythical_creatures',
    name: 'MYTHICAL CREATURES & MONSTERS',
    bannerColor: 'bg-rose-700',
    accentColor: 'text-rose-800',
    description: 'Legends, folklore beasts, cryptids, and ancient mythological beings',
    items: [
      'Dragon', 'Unicorn', 'Vampire', 'Werewolf',
      'Mermaid', 'Zombie', 'Phoenix', 'Ghost',
      'Bigfoot (Sasquatch)', 'Centaur', 'Cyclops', 'Sphinx',
      'Griffin', 'Minotaur', 'Kraken', 'Alien'
    ],
    clueBank: {
      'Dragon': ['Fire-Breathing', 'Scales', 'Hoard', 'Wings', 'Lair', 'Reptilian'],
      'Unicorn': ['Spiral-Horn', 'White-Steed', 'Rainbow', 'Fairy-Tale', 'Purity', 'Equine'],
      'Vampire': ['Fangs', 'Coffin', 'Garlic', 'Blood', 'Cape', 'Dracula'],
      'Werewolf': ['Full-Moon', 'Howl', 'Silver-Bullet', 'Transformation', 'Fur', 'Lycan'],
      'Mermaid': ['Fishtail', 'Ocean', 'Ariel', 'Scales', 'Siren', 'Undersea'],
      'Zombie': ['Undead', 'Brains', 'Apocalypse', 'Shambling', 'Infection', 'Horde'],
      'Phoenix': ['Ashes', 'Rebirth', 'Flaming-Feathers', 'Mythic-Bird', 'Immortal'],
      'Ghost': ['Spooky', 'Poltergeist', 'Haunting', 'Sheet', 'Phantom', 'Ethereal'],
      'Bigfoot (Sasquatch)': ['Footprints', 'Cryptid', 'Forest', 'Furry-Giant', 'Pacific-Northwest'],
      'Centaur': ['Half-Horse', 'Half-Human', 'Bow-Arrow', 'Mythology', 'Hooves'],
      'Cyclops': ['Single-Eye', 'Giant', 'Forehead', 'Odyssey', 'Forge', 'Brute'],
      'Sphinx': ['Riddles', 'Lions-Body', 'Pharaoh-Head', 'Desert', 'Monument'],
      'Griffin': ['Eagle-Head', 'Lions-Body', 'Wings', 'Heraldry', 'Beak', 'Talons'],
      'Minotaur': ['Labyrinth', 'Bulls-Head', 'Horns', 'Maze', 'Theseus', 'Crete'],
      'Kraken': ['Tentacles', 'Giant-Squid', 'Sea-Monster', 'Ship-Sinker', 'Ocean-Depths'],
      'Alien': ['UFO', 'Flying-Saucer', 'Extraterrestrial', 'Green-Beings', 'Spacecraft']
    },
    foxClueBank: [
      'Myth', 'Legend', 'Folklore', 'Monster', 'Beast',
      'Ancient', 'Tale', 'Supernatural', 'Fable', 'Mystic',
      'Creature', 'Frightening', 'Lore', 'Magical', 'Cryptid'
    ]
  },
  {
    id: 'public_places',
    name: 'PUBLIC PLACES & BUILDINGS',
    bannerColor: 'bg-slate-500',
    accentColor: 'text-slate-600',
    description: 'Civic architecture, transportation hubs, community centers, and landmarks',
    items: [
      'Airport', 'Hospital', 'Library', 'Shopping Mall',
      'Museum', 'Movie Theater', 'Bank', 'Post Office',
      'Train Station', 'Amusement Park', 'Gym', 'Restaurant',
      'Hotel', 'Gas Station', 'Church', 'Police Station'
    ],
    clueBank: {
      'Airport': ['Terminals', 'Runway', 'Gate', 'Security-Line', 'Luggage', 'Boarding'],
      'Hospital': ['Emergency-Room', 'Doctors', 'Nurses', 'Stethoscope', 'Ambulance', 'Patients'],
      'Library': ['Bookshelves', 'Quiet', 'Librarian', 'Reading', 'Check-Out', 'Catalog'],
      'Shopping Mall': ['Food-Court', 'Retail-Stores', 'Escalators', 'Directory', 'Boutiques'],
      'Museum': ['Exhibits', 'Artifacts', 'Paintings', 'Docent', 'Glass-Cases', 'History'],
      'Movie Theater': ['Popcorn', 'Big-Screen', 'Projector', 'Tickets', 'Cupholders', 'Trailers'],
      'Bank': ['Vault', 'Teller', 'ATM', 'Safe-Deposit', 'Account', 'Cash'],
      'Post Office': ['Stamps', 'Mailboxes', 'Envelopes', 'Packages', 'Parcels', 'Postal-Worker'],
      'Train Station': ['Platform', 'Tracks', 'Concourse', 'Schedule-Board', 'Locomotive', 'Tickets'],
      'Amusement Park': ['Roller-Coaster', 'Ferris-Wheel', 'Cotton-Candy', 'Midway', 'Rides'],
      'Gym': ['Weights', 'Treadmills', 'Barbells', 'Locker-Room', 'Exercise', 'Sweat'],
      'Restaurant': ['Menu', 'Waitstaff', 'Dining-Room', 'Chef', 'Table', 'Bill'],
      'Hotel': ['Lobby', 'Keycard', 'Housekeeping', 'Luggage-Cart', 'Concierge', 'Rooms'],
      'Gas Station': ['Pumps', 'Fuel', 'Nozzle', 'Convenience-Store', 'Octane', 'Canopy'],
      'Church': ['Pews', 'Steeple', 'Altar', 'Stained-Glass', 'Hymns', 'Bells'],
      'Police Station': ['Holding-Cell', 'Badges', 'Dispatch', 'Desk-Sergeant', 'Interrogation']
    },
    foxClueBank: [
      'Building', 'Facility', 'Public', 'Doors', 'Entrance',
      'Visitors', 'Address', 'Reception', 'Urban', 'Civic',
      'Community', 'Structure', 'Hours', 'Signage', 'Parking'
    ]
  },
  {
    id: 'weather_phenomena',
    name: 'WEATHER & NATURAL PHENOMENA',
    bannerColor: 'bg-teal-500',
    accentColor: 'text-teal-600',
    description: 'Meteorological forces, atmospheric wonders, and earth tremors',
    items: [
      'Tornado', 'Hurricane', 'Blizzard', 'Earthquake',
      'Lightning', 'Rainbow', 'Volcano', 'Tsunami',
      'Fog', 'Hail', 'Heatwave', 'Avalanche',
      'Flood', 'Drought', 'Northern Lights (Aurora)', 'Eclipse'
    ],
    clueBank: {
      'Tornado': ['Funnel-Cloud', 'Twister', 'Siren', 'Vortex', 'Fujita-Scale', 'Destruction'],
      'Hurricane': ['Category-Five', 'Eye-Wall', 'Tropical-Storm', 'Storm-Surge', 'Evacuation'],
      'Blizzard': ['Whiteout', 'Snowdrifts', 'Gale', 'Subzero', 'Snowstorm', 'Freezing'],
      'Earthquake': ['Fault-Line', 'Richter-Scale', 'Aftershock', 'Tremor', 'Epicenter', 'Seismic'],
      'Lightning': ['Thunder', 'Volt', 'Strike', 'Flash', 'Storm-Clouds', 'Conductor'],
      'Rainbow': ['Prism', 'Refraction', 'Seven-Colors', 'Rain-Sunshine', 'Arc', 'Pot-of-Gold'],
      'Volcano': ['Magma', 'Lava', 'Eruption', 'Crater', 'Ash-Cloud', 'Caldera'],
      'Tsunami': ['Tidal-Wave', 'Seismic-Sea', 'Inundation', 'Shoreline-Recede', 'Pacific'],
      'Fog': ['Mist', 'Low-Visibility', 'Haze', 'Dense', 'Foghorns', 'Moisture'],
      'Hail': ['Ice-Pellets', 'Thunderstorm', 'Golf-Ball-Sized', 'Frozen-Rain', 'Roof-Dent'],
      'Heatwave': ['Scorching', 'Triple-Digits', 'Thermometer', 'Advisory', 'Sweltering'],
      'Avalanche': ['Snowslide', 'Mountain-Slope', 'Beacon', 'Powder', 'Buried', 'Crust'],
      'Flood': ['Overflow', 'Submerged', 'Sandbags', 'Rising-Waters', 'Downpour', 'Riverbank'],
      'Drought': ['Arid', 'Parched-Earth', 'Rainless', 'Reservoir-Dry', 'Water-Restriction'],
      'Northern Lights (Aurora)': ['Borealis', 'Solar-Winds', 'Green-Sky', 'Polar', 'Glow', 'Night-Sky'],
      'Eclipse': ['Solar-Lunar', 'Totality', 'Shadow', 'Umbra', 'Corona', 'Sun-Moon']
    },
    foxClueBank: [
      'Atmosphere', 'Forecast', 'Meteorology', 'Sky', 'Nature',
      'Barometer', 'Severe', 'Climate', 'Outdoor', 'Condition',
      'Radar', 'Season', 'Elements', 'Alert', 'Temperature'
    ]
  },
  {
    id: 'hobbies',
    name: 'HOBBIES & PASTIMES',
    bannerColor: 'bg-green-600',
    accentColor: 'text-green-700',
    description: 'Leisure activities, creative crafts, games, outdoor pursuits, and passions',
    items: [
      'Gardening', 'Cooking', 'Fishing', 'Photography',
      'Painting', 'Camping', 'Reading', 'Gaming',
      'Knitting', 'Hiking', 'Skateboarding', 'Baking',
      'Dancing', 'Chess', 'Yoga', 'Birdwatching'
    ],
    clueBank: {
      'Gardening': ['Trowel', 'Soil', 'Seeds', 'Watering-Can', 'Pruning', 'Flowers'],
      'Cooking': ['Chef-Knife', 'Spices', 'Skillet', 'Recipe', 'Stove', 'Seasoning'],
      'Fishing': ['Rod-Reel', 'Bait', 'Hook', 'Cast', 'Tackle-Box', 'Lake'],
      'Photography': ['Shutter', 'Lens', 'Aperture', 'Tripod', 'Focus', 'Camera'],
      'Painting': ['Easel', 'Brush', 'Acrylic', 'Watercolor', 'Palette', 'Canvas'],
      'Camping': ['Tent', 'Sleeping-Bag', 'Campfire', 'Lantern', 'Wilderness', 'Campground'],
      'Reading': ['Novel', 'Bookmark', 'Pages', 'Bookworm', 'Library', 'Hardcover'],
      'Gaming': ['Console', 'Headset', 'Controller', 'Keyboard-Mouse', 'Streamer', 'Level'],
      'Knitting': ['Yarn', 'Needles', 'Stitches', 'Wool', 'Sweater', 'Purling'],
      'Hiking': ['Trail', 'Trekking-Poles', 'Backpack', 'Summit', 'Boots', 'Elevation'],
      'Skateboarding': ['Griptape', 'Kickflip', 'Wheels', 'Halfpipe', 'Deck', 'Board'],
      'Baking': ['Oven', 'Flour', 'Measuring-Cups', 'Dough', 'Parchment', 'Timer'],
      'Dancing': ['Choreography', 'Rhythm', 'Floor', 'Steps', 'Music', 'Ballroom'],
      'Chess': ['Checkmate', 'Knight', 'Pawn', '64-Squares', 'Rook', 'Grandmaster'],
      'Yoga': ['Mat', 'Downward-Dog', 'Breathing', 'Poses', 'Flexibility', 'Namaste'],
      'Birdwatching': ['Binoculars', 'Field-Guide', 'Feathered', 'Plumage', 'Perched', 'Species']
    },
    foxClueBank: [
      'Pastime', 'Recreation', 'Leisure', 'Enthusiast', 'Weekend',
      'Skill', 'Relaxation', 'Practice', 'Passion', 'Free-Time',
      'Activity', 'Hobbyist', 'Gear', 'Enjoyment', 'Club'
    ]
  },
  {
    id: 'body_parts',
    name: 'BODY PARTS',
    bannerColor: 'bg-red-500',
    accentColor: 'text-red-600',
    description: 'Human anatomy, vital organs, facial features, and skeletal joints',
    items: [
      'Heart', 'Brain', 'Lungs', 'Stomach',
      'Eyes', 'Hands', 'Feet', 'Knee',
      'Elbow', 'Nose', 'Tongue', 'Teeth',
      'Spine', 'Shoulder', 'Liver', 'Skin'
    ],
    clueBank: {
      'Heart': ['Beating', 'Pumping', 'Ventricles', 'Pulse', 'Cardiac', 'Blood'],
      'Brain': ['Neurons', 'Thinking', 'Cerebrum', 'Synapses', 'Memory', 'Skull'],
      'Lungs': ['Breathing', 'Inhale-Exhale', 'Oxygen', 'Alveoli', 'Chest', 'Air'],
      'Stomach': ['Digestion', 'Acid', 'Belly', 'Hunger', 'Digestive', 'Abdomen'],
      'Eyes': ['Pupils', 'Retina', 'Vision', 'Blink', 'Iris', 'Eyelashes'],
      'Hands': ['Fingers', 'Palms', 'Thumb', 'Grip', 'Knuckles', 'Touch'],
      'Feet': ['Toes', 'Soles', 'Heels', 'Walking', 'Arch', 'Shoes'],
      'Knee': ['Patella', 'Joint', 'Bending', 'Kneecap', 'Ligaments', 'Squat'],
      'Elbow': ['Joint', 'Bicep-Tricep', 'Funny-Bone', 'Bend', 'Arm', 'Forearm'],
      'Nose': ['Nostrils', 'Smelling', 'Bridge', 'Inhaling', 'Sniff', 'Cartilage'],
      'Tongue': ['Tastebuds', 'Saliva', 'Speaking', 'Tasting', 'Mouth', 'Lick'],
      'Teeth': ['Enamel', 'Chewing', 'Bite', 'Molars', 'Dentist', 'Smile'],
      'Spine': ['Vertebrae', 'Backbone', 'Posture', 'Spinal-Cord', 'Discs', 'Posture'],
      'Shoulder': ['Socket', 'Clavicle', 'Rotator-Cuff', 'Deltoid', 'Carrying', 'Blade'],
      'Liver': ['Detox', 'Bile', 'Hepatic', 'Organ', 'Filtering', 'Regenerate'],
      'Skin': ['Epidermis', 'Pores', 'Complexion', 'Largest-Organ', 'Touch', 'Derma']
    },
    foxClueBank: [
      'Anatomy', 'Human', 'Organ', 'Physical', 'Medical',
      'Body', 'Flesh', 'Cellular', 'Tissue', 'Physiology',
      'Structure', 'Health', 'Biological', 'Sensation', 'Doctor'
    ]
  }
];
