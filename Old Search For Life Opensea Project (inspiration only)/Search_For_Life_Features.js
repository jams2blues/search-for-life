// 🎲 Function to calculate unique features for each NFT
function calculateFeatures(tokenData) {
let R; //🎲 global variable for Random class
  // 🎲 Prohibition's Random Class for all randomness for deterministic output
class Random {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substring(0, 8), 16);
      let b = parseInt(uint128Hex.substring(8, 16), 16);
      let c = parseInt(uint128Hex.substring(16, 24), 16);
      let d = parseInt(uint128Hex.substring(24, 32), 16);
      return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    // seed prngA with first half of tokenData.hash
    this.prngA = new sfc32(tokenData.hash.substring(2, 34));
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(tokenData.hash.substring(34, 66));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  // random boolean with p as percent liklihood of true
  random_bool(p) {
    return this.random_dec() < p;
  }
  // random value in an array of items
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
}

// Declare default dimensions in case the actual dimensions are not accessible
const defaultWidth = 1920;  // Default screen width
const defaultHeight = 1080;  // Default screen height
// Manually defining PI and TWO_PI for the separate features script on prohibition.art
const PI = 3.141592653589793;
const TWO_PI = 6.283185307179586;
// 🌏🎲 Features for Moon colors
let possibleRGBColors = [
  { name: 'Red', rgb: [255, 0, 0] },
  { name: 'Green', rgb: [0, 255, 0] },
  { name: 'Blue', rgb: [0, 0, 255] },
  { name: 'Yellow', rgb: [255, 255, 0] },
  { name: 'Cyan', rgb: [0, 255, 255] },
  { name: 'Magenta', rgb: [255, 0, 255] },
  { name: 'Silver', rgb: [192, 192, 192] },
  { name: 'Gray', rgb: [128, 128, 128] },
  { name: 'Maroon', rgb: [128, 0, 0] },
  { name: 'Olive', rgb: [128, 128, 0] },
  { name: 'Teal', rgb: [0, 128, 128] },
  { name: 'Navy', rgb: [0, 0, 128] },
  { name: 'Lime', rgb: [0, 255, 0] },
  { name: 'Purple', rgb: [128, 0, 128] },
  { name: 'Aqua', rgb: [0, 255, 255] },
  { name: 'Fuchsia', rgb: [255, 0, 255] },
  { name: 'Gold', rgb: [255, 215, 0] },
  { name: 'Coral', rgb: [255, 127, 80] },
  { name: 'Wheat', rgb: [245, 222, 179] },
  { name: 'Linen', rgb: [250, 240, 230] },
  { name: 'Mint', rgb: [189, 252, 201] },
  { name: 'Indigo', rgb: [75, 0, 130] },
  { name: 'Lavender', rgb: [230, 230, 250] },
  { name: 'Beige', rgb: [245, 245, 220] },
  { name: 'Honeydew', rgb: [240, 255, 240] },
  { name: 'OliveDrab', rgb: [107, 142, 35] },
  { name: 'DarkSalmon', rgb: [233, 150, 122] },
  { name: 'DarkOrchid', rgb: [153, 50, 204] },
  { name: 'MediumPurple', rgb: [147, 112, 219] },
  { name: 'MediumSlateBlue', rgb: [123, 104, 238] },
  { name: 'Turquoise', rgb: [64, 224, 208] },
  { name: 'RoyalBlue', rgb: [65, 105, 225] },
  { name: 'SteelBlue', rgb: [70, 130, 180] },
  { name: 'DarkTurquoise', rgb: [0, 206, 209] },
  { name: 'DarkSlateGray', rgb: [47, 79, 79] },
  { name: 'LawnGreen', rgb: [124, 252, 0] },
  { name: 'Crimson', rgb: [220, 20, 60] },
  { name: 'DeepPink', rgb: [255, 20, 147] },
  { name: 'CadetBlue', rgb: [95, 158, 160] },
  { name: 'Moccasin', rgb: [255, 228, 181] },
  { name: 'PapayaWhip', rgb: [255, 239, 213] },
  { name: 'BlanchedAlmond', rgb: [255, 235, 205] },
  { name: 'NavajoWhite', rgb: [255, 222, 173] },
  { name: 'BurlyWood', rgb: [222, 184, 135] },
  { name: 'HotPink', rgb: [255, 105, 180] },
  { name: 'Tomato', rgb: [255, 99, 71] },
  { name: 'Salmon', rgb: [250, 128, 114] },
  { name: 'Orchid', rgb: [218, 112, 214] },
  { name: 'Goldenrod', rgb: [218, 165, 32] },
  { name: 'PaleVioletRed', rgb: [219, 112, 147] },
  { name: 'Cornsilk', rgb: [255, 248, 220] },
  { name: 'Bisque', rgb: [255, 228, 196] },
  { name: 'SandyBrown', rgb: [244, 164, 96] },
  { name: 'SaddleBrown', rgb: [139, 69, 19] },
  { name: 'DarkOliveGreen', rgb: [85, 107, 47] },
  { name: 'DarkGoldenRod', rgb: [184, 134, 11] },
  { name: 'FireBrick', rgb: [178, 34, 34] },
  { name: 'DarkMagenta', rgb: [139, 0, 139] },
  { name: 'DarkViolet', rgb: [148, 0, 211] },
  { name: 'DarkOrange', rgb: [255, 140, 0] },
  { name: 'LimeGreen', rgb: [50, 205, 50] },
  { name: 'MediumSeaGreen', rgb: [60, 179, 113] },
  { name: 'Sienna', rgb: [160, 82, 45] },
  { name: 'Chartreuse', rgb: [127, 255, 0] },
  { name: 'MediumSpringGreen', rgb: [0, 250, 154] },
  { name: 'DarkCyan', rgb: [0, 139, 139] },
  { name: 'Peru', rgb: [205, 133, 63] },
  { name: 'Tan', rgb: [210, 180, 140] },
  { name: 'Khaki', rgb: [240, 230, 140] },
  { name: 'Plum', rgb: [221, 160, 221] },
  { name: 'RosyBrown', rgb: [188, 143, 143] },
  { name: 'Gainsboro', rgb: [220, 220, 220] },
  { name: 'PeachPuff', rgb: [255, 218, 185] },
  { name: 'MintCream', rgb: [245, 255, 250] },
  { name: 'Lavender', rgb: [230, 230, 250] }
];

// 🌏🎲 Rare and Lore-Filled Planet Colors
let rareRGBColors = [
  { name: 'CosmicSapphire', rgb: [23, 45, 210] },
  { name: 'NebulaRose', rgb: [255, 30, 150] },
  { name: 'GalacticGold', rgb: [255, 215, 10] },
  { name: 'StardustSilver', rgb: [192, 192, 192] },
  { name: 'QuasarQuartz', rgb: [127, 0, 255] },
  { name: 'OrionOlive', rgb: [128, 128, 0] },
  { name: 'PulsarPink', rgb: [255, 182, 193] },
  { name: 'MeteorMaroon', rgb: [128, 0, 0] },
  { name: 'AstroAmethyst', rgb: [153, 50, 204] },
  { name: 'NovaNavy', rgb: [0, 0, 128] },
  { name: 'BlackHoleBlack', rgb: [0, 0, 0] },
  { name: 'SolarFlareScarlet', rgb: [255, 36, 0] },
  { name: 'CelestialCyan', rgb: [0, 255, 255] },
  { name: 'SupernovaSmoke', rgb: [105, 105, 105] },
  { name: 'EclipseEmerald', rgb: [0, 128, 0] },
  { name: 'PlutoPlum', rgb: [221, 160, 221] },
  { name: 'AndromedaAmber', rgb: [255, 191, 0] },
  { name: 'ZenithZircon', rgb: [0, 216, 255] },
  { name: 'VoyagerVermilion', rgb: [227, 66, 52] },
  { name: 'EventideEbony', rgb: [42, 42, 42] }
];

  let windowWidth, windowHeight;
  // Initialize the Random class here, if not initialized in setup()
  R = new Random(tokenData.hash, Number(tokenData.tokenId) % 1_000_000); // Initialize your Random class

  // Your existing code
  const hash = tokenData.hash;
  const invocation = Number(tokenData.tokenId) % 1_000_000;
  let features = {};

  try {
      windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  } catch (e) {
      // If dimensions are not accessible, use default dimensions
      windowWidth = defaultWidth;
      windowHeight = defaultHeight;
  }

  // 🌏 Boolean features
  features.isEarthLike = R.random_bool(0.05);  // 5% chance of being Earth-like
  features.hasRings = R.random_bool(0.5);  // 50% chance of having rings
  features.isRainbowRing = features.hasRings ? R.random_bool(0.1) : false;  // 10% chance of rainbow rings if rings are present

  // 🌈 Only generate ring colors if there are rings
  if (features.hasRings) {
      const possibleHues = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      let innerRingColor = [R.random_choice(possibleHues), 100, 100];
      let outerRingColor = [R.random_choice(possibleHues), 100, 100];

      // Adding a random hue to either the inner or outer ring to increase chances of them being different
      if (R.random_bool(0.5)) {  // 50% chance
          // Change the hue of the outer ring
          outerRingColor[0] = (outerRingColor[0] + R.random_num(0, 359)) % 360;
      } else {
          // Change the hue of the inner ring
          innerRingColor[0] = (innerRingColor[0] + R.random_num(0, 359)) % 360;
      }

      // Calculate color names after hue shift
      const describeColor = (hue) => {
        const colorRanges = [
            'Red', 'Orange-Red', 'Dark Orange', 'Orange', 'Yellow-Orange',
            'Dark Yellow', 'Yellow', 'Light Yellow', 'Lime', 'Green-Yellow',
            'Light Green', 'Green', 'Dark Green', 'Green-Teal', 'Teal',
            'Dark Teal', 'Cyan', 'Light Cyan', 'Dark Cyan', 'Sky Blue',
            'Blue', 'Royal Blue', 'Light Blue', 'Navy', 'Dark Blue',
            'Purple', 'Violet', 'Lavender', 'Magenta', 'Deep Magenta',
            'Pink', 'Hot Pink', 'Fuchsia', 'Deep Pink', 'Salmon',
            'Coral', 'Tomato'
        ];
    
        // The index is calculated by floor division of hue by 10
        const index = Math.floor(hue / 10);
    
        // Return the corresponding color name, or 'Red' if index is out of range
        return colorRanges[index] || 'Red';
      };

      // Save color names for display
      features.outRing = describeColor(outerRingColor[0]);
      features.inRing = describeColor(innerRingColor[0]);

      // If rainbow rings, set the color name to 'Rainbow'
      if (features.isRainbowRing) {
        features.outRing = '🌈';
        features.inRing = '🌈';
    }    
  } else {
      // If no rings, set the color name to 'None'
      features.outRing = 'None';
      features.inRing = 'None';
  }

  // 🌏 Moon features
  features.numMoons = R.random_int(0, 3);

  // 🌏 Planet size Enum class
  const PlanetSizeEnum = {
      DWARF: 'DWARF',
      SMALL: 'SMALL',
      MEDIUM: 'MEDIUM',
      LARGE: 'LARGE',
      GIANT: 'GIANT',
      GARGANTUAN: 'GARGANTUAN',
      COLOSSAL: 'COLOSSAL',
      UNIVERSAL: 'UNIVERSAL',
      MULTIVERSAL: 'MULTIVERSAL',
      OMNIVERSAL: 'OMNIVERSAL'
  };
  // 🌍 Planet Size Class (weights are now more explicit)
  const PlanetSize = [
      { name: 'Dwarf', value: PlanetSizeEnum.DWARF, weight: 10 },
      { name: 'Small', value: PlanetSizeEnum.SMALL, weight: 20 },
      { name: 'Medium', value: PlanetSizeEnum.MEDIUM, weight: 30 },
      { name: 'Large', value: PlanetSizeEnum.LARGE, weight: 20 },
      { name: 'Giant', value: PlanetSizeEnum.GIANT, weight: 10 },
      { name: 'Gargantuan', value: PlanetSizeEnum.GARGANTUAN, weight: 5 },
      { name: 'Colossal', value: PlanetSizeEnum.COLOSSAL, weight: 3 },
      { name: 'Universal', value: PlanetSizeEnum.UNIVERSAL, weight: 1 },
      { name: 'Multiversal', value: PlanetSizeEnum.MULTIVERSAL, weight: 1 },
      { name: 'Omniversal', value: PlanetSizeEnum.OMNIVERSAL, weight: 1 }
  ];
  let weightedArray = [];  // 🌏 for Planet Size
  PlanetSize.forEach((size) => { 
      for (let i = 0; i < size.weight; i++) {
      weightedArray.push(size);
      }
  });
  function getNumericSize(sizeEnum) {
  switch(sizeEnum) {
      case 'DWARF': return 1;
      case 'SMALL': return 2;
      case 'MEDIUM': return 3;
      case 'LARGE': return 4;
      case 'GIANT': return 5;
      case 'GARGANTUAN': return 6;
      case 'COLOSSAL': return 7;
      case 'UNIVERSAL': return 8;
      case 'MULTIVERSAL': return 9;
      case 'OMNIVERSAL': return 10;
      default: return 1;
  }
  }
  
  // 🌏 Possible actualPlanetSize Values
  function getNumericSize(sizeEnum) {
    switch(sizeEnum) {
        case 'DWARF': return 25;
        case 'SMALL': return 30;
        case 'MEDIUM': return 40;
        case 'LARGE': return 45;
        case 'GIANT': return 50;
        case 'GARGANTUAN': return 60;
        case 'COLOSSAL': return 70;
        case 'UNIVERSAL': return 80;
        case 'MULTIVERSAL': return 90;
        case 'OMNIVERSAL': return 100;
        default: return 25;
    }
  }

  // 🌏 Randomly select a size category
  const selectedSize = R.random_choice(weightedArray);

  // 🌏 Generate actual size within the range of the selected category
  features.actualPlanetSize = selectedSize.value;

  // 🌏 Convert radians to degrees for a better understanding
  features.orbitAngle = (R.random_num(0, TWO_PI) * 180 / PI).toFixed(0);  // Now in degrees
  features.rotationAngle = (R.random_num(0, TWO_PI) * 180 / PI).toFixed(0);  // Now in degrees

  // 🌏 Features for Moons
  const actualNumericPlanetSize = getNumericSize(features.actualPlanetSize);  // convert Enum to Number
  
  // 🌏 Features for Moons
  for (let i = 1; i <= features.numMoons; i++) {
    features[`moon${i}Size`] = Math.round(R.random_num(5, actualNumericPlanetSize / 4));
    features[`moon${i}MinMDist`] = Math.round(features.hasRings ? actualNumericPlanetSize * 1.6 : actualNumericPlanetSize * 1.5);
    features[`moon${i}MaxMDist`] = Math.round(features.hasRings ? actualNumericPlanetSize * 3.2 : actualNumericPlanetSize * 3);
    features[`moon${i}Angle`] = Math.round(R.random_num(0, TWO_PI) * (180 / PI));
    const selectedColor = R.random_choice(possibleRGBColors);
    features[`moon${i}ColorName`] = selectedColor.name;
  }

  // 🌏 Random planet tilt
  features.randomTiltAngle = (R.random_num(0, PI / 4) * 180 / PI).toFixed(0); // Now in degrees
  // 🌏 Random tilt for the ring
  features.ringTilt = (R.random_num(0, PI / 4) * 180 / PI).toFixed(0);  // Now in degrees

  // 🌏 Combine both arrays for planet color selection
  const allPlanetColors = [...possibleRGBColors, ...rareRGBColors];
  const randomPlanetIndex = R.random_choice(allPlanetColors);
  features.planetColor = randomPlanetIndex.name;

  if (features.isEarthLike) {
      features.planetColor = 'Blue Space Marble';
  }

  // 🏆 Rarity Scoring Class
  class Rarity {
    constructor(features) {
      this.features = features;
    }

    // Enum-like object for rarity levels
    static RARITY_LEVELS = {
      '🍀': 'Quantum',
      '🍀🍀': 'Subatomic',
      '🍀🍀🍀': 'Atomic',
      '🍀🍀🍀🍀': 'Molecular',
      '🍀🍀🍀🍀🍀': 'Stellar',
      '🍀🍀🍀🍀🍀🍀': 'Galactic',
      '🍀🍀🍀🍀🍀🍀🍀': 'Cosmic',
      '🍀🍀🍀🍀🍀🍀🍀🍀': 'Ethereal',
      '🍀🍀🍀🍀🍀🍀🍀🍀🍀': 'Transcendental',
      '🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀': 'Omnipotent'
    };

    // Internal function to calculate score
    _calculateScore() {
      this.score = 0;
      // 5% Earth-like feature adds the most points
      if (this.features.isEarthLike) {
          this.score += 3000;
      }

      // Ring attributes
      if (this.features.hasRings) {
          this.score += 500;
          if (this.features.isRainbowRing) {
          this.score += 1000;
          }
      }

      // Moons: More moons add more rarity
      this.score += this.features.numMoons * 100;

      // Check for rare colors
      const isRareColor = rareRGBColors.some(color => color.name === this.features.planetColor);
      if (isRareColor) {
        this.score += 1000;
      }

      // Planet size, bigger is rarer
      const sizeNumericValue = getNumericSize(this.features.actualPlanetSize); // Get numeric value based on size category
      this.score += sizeNumericValue * 5; // Multiply by 50 for each size category, rarest planet size gets 500 points

      return this.score;
    }

    // Classify rarity based on score
    classifyRarity() {
      this._calculateScore();  // Re-calculate the score first

      if (this.score >= 4800) return {emoji: '🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀', name: 'Omnipotent'};
      if (this.score >= 3300) return {emoji: '🍀🍀🍀🍀🍀🍀🍀🍀🍀', name: 'Transcendental'};
      if (this.score >= 3000) return {emoji: '🍀🍀🍀🍀🍀🍀🍀🍀', name: 'Ethereal'};
      if (this.score >= 2800) return {emoji: '🍀🍀🍀🍀🍀🍀🍀', name: 'Cosmic'};
      if (this.score >= 2500) return {emoji: '🍀🍀🍀🍀🍀🍀', name: 'Galactic'};
      if (this.score >= 1800) return {emoji: '🍀🍀🍀🍀🍀', name: 'Stellar'};
      if (this.score >= 1500) return {emoji: '🍀🍀🍀🍀', name: 'Molecular'};
      if (this.score >= 1300) return {emoji: '🍀🍀🍀', name: 'Atomic'};
      if (this.score >= 1000) return {emoji: '🍀🍀', name: 'Subatomic'};
      return {emoji: '🍀', name: 'Quantum'};
    }
  }

  // 🏆 Calculate Rarity at the end
  const rarity = new Rarity(features);
  const rarityClassification = rarity.classifyRarity();
  features.rarityScore = rarityClassification.name;
  features.rarityEmoji = rarityClassification.emoji;
  return features;
}

// 🪟 WindowResized function
function windowResized() {
  calculateFeatures(tokenData);
}