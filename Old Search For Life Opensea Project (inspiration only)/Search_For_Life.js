/*
Project Overview:
Procedurally generated, evolving, and scalable, long-form NFT for Prohibition.art with unique random class. Features a 10 second warp speed/wormhole sequence and wormhole destination in Jams2blues' trippy, rainbow art style. Merges science, quantum mechanics, physics, and art.
🎨, Canvas Init: Sets up 3D canvas.
🎲, Random Seed & Features: Uses Prohibition's Determinisic Output for NFT Invocations.
🌌, Star Class: Einstein-Rosen bridge with blue/red shifts in 10s warp sequence.
⏲, Animation loop and Speed: based on wormhole sequence, first 10 seconds, and wormhole destination 20 seconds.
☁️, Nebula Stars: Background stars in front of galaxies in destination.
🌀, Galaxies: Appear in wormhole destination.
🌏, Celestial Bodies: Centered in viewport in destination.
🛑, Wormhole End: Warped space sphere at tunnel end in 10s warp.
✏️, Draw: Order for animation loop.
⌨️, keyboard controls for interactivity, and restarting the sequence for future adaptability to future systems.
🪟, WindowResized function for maintaining NFT's consistent appearance as a dimensionless and resolution agnostic NFT across multiple devices regardless of window size and aspect ratio
*/
// 🛑 global variable to allow WebGL for WormHoleEnd
let gl;
// 🛑 Global array to hold static stars
let staticStars = [];
// 🎲 Random Seed global variable
let R;  // Will use Prohibition's Random class
let features; // declare features globally for deterministic output and random class features
// 🌌🛑 Array to hold the stars Star class in wormhole sequence and Static Stars for Wormhole End.
let stars = [];
// ⏲️ Warp Speed Global Variable
let warpSpeedFactor = 1;  // 🌌🌈🔮🛑 for warp speed effects, mimicing hyperspace and FTL travel
let wormholeDurationFrames = 8 * 60;  // about 10 seconds for the wormhole sequence
let frameSinceLastAdjustment = 0;  // 🌌Counter for frames since last adjustment
let adjustmentRate = 0;  // 🌌 Adjust every 20 frames
// Declare a global flag to indicate if the wormhole sequence is complete
let isWormholeSequenceComplete = false; // Global flag to indicate if the wormhole sequence is complete
// 🌀☁️🌏 Wormhole Destination sequence Celestial Objects, nebulaStar, Galaxies...
let celestialObject; // 🌏
let nebulaStars = []; // ☁️
let numParticles; // ☁️
let galaxies = []; // 🌀
let numSpheres; // 🌈
let initialWindowWidth;  // ☁️ Global variable for NebulaStar Scaling
let initialWindowHeight; // ☁️ Global variable for NebulaStar Scaling
let windowWidth = window.innerWidth; // 🪟 Global Variables for storing Window size
let windowHeight = window.innerHeight; // 🪟 Global Variables for storing Window size
let frameRateHistory = [];  // tracks average framerate
let hasOptimized = false;  // ☁️🌀 A flag to check if the optimization process is complete
let optimizedGalaxiesCount = 1;  // ☁️🌀 The optimized number of galaxies
let optimizedStarsCount = 300;  // ☁️🌀 The optimized number of nebula stars
let optimizationStartFrame = 0;  // ☁️🌀 The frame count when optimization starts
let lastAdded = 'galaxy';  // ☁️🌀 Initialize with 'galaxy' or 'star'keeps track of what was last added
// 🌀☁️🌌Constants to define max number of NebulaStars, Galaxies, and Worhmole Sequence Stars
const MAX_NEBULASTARS = 30000;
const MAX_GALAXIES = 5000;
const MAX_STARS = 2000;
// 🌀 Scaling Factor for Galaxies and different resolutions
let aspectRatio = windowWidth / windowHeight;
let lastStarAdditionFrame = 0; // ☁️🌀
let lastGalaxyAdditionFrame = 0; // ☁️🌀
const additionFrameBuffer = 1;  // ☁️🌀 adjust frame buffer as needed for adding stars and galaxies
// ⌨️ rate limiting for keyboard controls to prevent spamming to break the NFT
let lastPressedTime = 0;  // 🕒 Last time the ENTER key was pressed
const minInterval = 2000;  // 🕒 Minimum interval between ENTER presses in milliseconds
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

// 🎲 Function to calculate unique features for each NFT Focusing on Celestial Objects
function calculateFeatures(tokenData) {
    // Needs initialization here, and in setup, or planet colors, sizes, and textures will be different
    R = new Random(tokenData.hash, Number(tokenData.tokenId) % 1_000_000); // Initialize your Random class

    // Your existing code
    const hash = tokenData.hash;
    const invocation = Number(tokenData.tokenId) % 1_000_000;
    features = {};

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

        features.outRing = outerRingColor;  // Store the actual HSB color array
        features.inRing = innerRingColor;  // Store the actual HSB color array
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

    return features;
}

// 🎨 Initialize Canvas
function setup() {
    colorMode(HSB);
    initializeScene();
    // 🎲 Initialize Features Script, generate Deterministic Output based on token using token ID and seed provided by prohibition.art, data etc...
    R = new Random(tokenData.hash, Number(tokenData.tokenId) % 1_000_000);
    features = calculateFeatures(tokenData);  // Features for this NFT
    
    // 🎨🛑🌌☁️🌀⌨️ resetStars and Galaxies
    resetStars();

    // 🌏 Initialize celestial objects
    resetCelestialObject();
}

// 🎨🪟⌨️ Parts of Initialize Canvas moved to initializeScene Function so initial arrays can be reset with keyboard controls
function initializeScene(){
    let cvs = createCanvas(windowWidth, windowHeight, WEBGL);
    cvs.elt.style.overflow = 'hidden';
    initialWindowWidth = windowWidth;
    initialWindowHeight = windowHeight;

    let fov = PI / 3;
    let cameraZ = (height / 2.0) / tan(PI * 30.0 / 180.0);
    // Increase the far clipping plane
    perspective(fov, aspectRatio, cameraZ / 10, 1000000);  // Set far clipping plane far enough


    gl = this._renderer.GL;  // Get WebGL rendering context
    frameRate(60);
    features = calculateFeatures(tokenData);  // Re-calculate features
}

// 🎨🛑🌌☁️⌨️ Initialize Star Classes for keyboard resets and setup/initialize canvas function
function resetStars() {
    // 🛑 Initialize more static stars with random sizes inside WormHoleEnd
    staticStars.length = 0;  // clear existing static stars
    for (let i = 0; i < 500; i++) {  // Number of Static Stars inside WormHoleEnd
        let theta = random(0, TWO_PI);
        let phi = random(0, PI);
        let x = sin(phi) * cos(theta);
        let y = sin(phi) * sin(theta);
        let z = cos(phi);
        let size = random(1, 5);  // Random sizes from 1 to 5
        staticStars.push({ x, y, z, size });
    }

    // 🌌 Initialize stars for Warp Speed/wormhole Sequence
    let initialStarCount = 300;
    stars = Array.from({ length: initialStarCount }, () => new Star());
    for (let i = 0; i < initialStarCount; i++) {
        stars[i] = new Star();
    }
    
    // ☁️ Initialize nebulaStars & Start with 300 nebulaStars initially
    nebulaStars.length = 0;  // Clear any existing nebula stars
    for (let i = 0; i < 300; i++) {
        nebulaStars.push(new NebulaStar(R));
    }
    // 🌀 Initialize Galaxy Class & start with 1 galaxy initially
    galaxies.length = 0;  // Clear any existing galaxies
    for (let i = 0; i < 1; i++) {
        galaxies.push(new Galaxy(R));
    }
    hasOptimized = false; // ☁️🌀 Initialize optimization variables for dynamic throttling & performance evolution
    optimizedStarsCount = 300; // ☁️🌀 Initialize optimization variables for dynamic throttling & performance evolution
    optimizedGalaxiesCount = 1; // ☁️🌀 Initialize optimization variables for dynamic throttling & performance evolution
}

// 🎨🌏⌨️ Initialize Celestial Object & reset Celestial Object initial size and canvas area in keyboard controls
function resetCelestialObject() {
    // Re-calculate initial values based on new dimensions
    celestialObject = new CelestialObject(R, features);  // Create a new celestial object
    celestialObject.generateTexture();  // Regenerate the texture
}

// 🛑 WormHoleEnd function during Wormhole/WarpSpeed Sequence
function WormHoleEnd() {
    push();

    // Recalculate sphereRadius based on new window dimensions
    let sphereRadius = map(warpSpeedFactor, 1, 100, 0, Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight) * 0.5);
    fill(0, 0, 0, 255);  // Black fill to avoid flickering
    noStroke();  // No outline to make it look less like a mesh
    sphere(sphereRadius);  // Draw the 3D sphere

    // After drawing the sphere, set the blend mode to BLEND before drawing the cosmic backdrop
    blendMode(BLEND);

    // 3. Cosmic Backdrop Inside the Sphere
    drawCosmicBackdropInsideSphere(sphereRadius);

    // Reset blend mode to normal
    blendMode(BLEND);

    pop();
}

// 🛑 Function to draw the cosmic backdrop inside the sphere for WormHoleEnd
function drawCosmicBackdropInsideSphere(sphereRadius) {
    push();

    // Draw scaled static stars with random sizes
    stroke(255);
    for (let star of staticStars) {
        strokeWeight(star.size);
        point(star.x * sphereRadius, star.y * sphereRadius, star.z * sphereRadius);
    }
    pop();
}

// ✏️ Main Drawing Function
function draw() {
    // 🎥 Update Camera FOV and Aspect Ratio
    let fov = PI / 3;
    let cameraZ = (height / 2.0) / tan(PI * 30.0 / 180.0);
    perspective(fov, aspectRatio, cameraZ / 10, 1000000);

    // 🎥 Reset Camera and Translation for each draw loop
    camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);
    translate(0, 0, 0);
    
    // ⏲ Animation Loop
    if (frameCount <= 2 * 60) {
        warpSpeedFactor = map(frameCount, 0, 3 * 60, 1, 5); // if frame count is less than 2 * 60, set warpSpeedFactor to 3 second delay then ramp up
        background(0);  // Change to Black
    } else if (frameCount <= wormholeDurationFrames) {
        warpSpeedFactor = map(frameCount, 2 * 60, wormholeDurationFrames, 5, 100);
        background(0);  // Change to Black
    } else {
        warpSpeedFactor = 1;
    }
    
    // 🌌 Checks frame count, wormholeDurationFrames for vanishing wormhole sequence, and appearance of Wormhole Destination sequence
    if (frameCount <= wormholeDurationFrames) {
        // 🌌 Stars for wormhole sequence
        translate(0, 0, -width);
        // Update and display stars with device-agnostic size
        stars.forEach(star => {
            if (star.isActive) {
                star.update();
                star.show();
            }
        });
        // 🌌 Frame rate monitoring for dynamic adjustment
        frameRateHistory.push(frameRate());
        if (frameRateHistory.length > 10) {
            frameRateHistory.shift();  // Keep the last 10 frame rates
        }
        let avgFrameRate = frameRateHistory.reduce((a, b) => a + b, 0) / frameRateHistory.length;
        if (frameSinceLastAdjustment >= adjustmentRate) {
            if (avgFrameRate < 24) {
                // Remove disabled stars from the array
                stars = stars.filter(star => star.isActive);
            } else if (avgFrameRate > 40 && stars.length < MAX_STARS) {
                let numToAdd = Math.min(Math.floor(stars.length * 0.02), 5);  // Max of 50 stars added at a time
                numToAdd = Math.min(numToAdd, MAX_STARS - stars.length);  // Ensure the total number of stars does not exceed MAX_STARS
                for (let i = 0; i < numToAdd; i++) {
                    let newStar = new Star();
                    newStar.isActive = true;
                    stars.push(newStar);  // Add stars
                }
            }
            frameSinceLastAdjustment = 0;  // Reset counter
        } else {
            frameSinceLastAdjustment++;  // Increment counter
        }


        // 🌌 Black Background/Dark Space
        if (warpSpeedFactor >= 95) {
            background(0); // Sets the background to black
        }
        
        // 🛑 Wormhole End
        WormHoleEnd();

        // Set the flag to false since the wormhole sequence is still ongoing
        isWormholeSequenceComplete = false;
    } else {
        // Set the flag to true as the wormhole sequence is now complete
        isWormholeSequenceComplete = true;
        // ☁️ Then draw NebulaStars
        if (isWormholeSequenceComplete) {
            // 🎥 Initialize Fixed Camera
            initializeFixedCamera();  // This sets up the fixed camera without any rotation
            // With this, to make sure camera stays fixed
            camera(0, 0, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);

            // 🌌 Set Black Background
            background(0);
            
            // ☁️ Then draw NebulaStars
            for (let star of nebulaStars) {
                    star.show();
            }
            
            // 🌀 Then draw Galaxies
            for (let galaxy of galaxies) {
                galaxy.show();  // Make sure this function uses galaxy.x and galaxy.y for drawing
            }

            // 🌏 ☁️ reset the depth buffer before drawing celestial objest so nebulaStars stay behind planets.
            gl.clear(gl.DEPTH_BUFFER_BIT);

            // 🌏 Update the celestial object
            celestialObject.update();
            // 🌏 Show the celestial object
            celestialObject.show();
            translate(0, 0, celestialObject.z);
        }
    }

    // 🌀☁️ Monitoring frame rate for dynamic throttling & performance evolution
    if (frameCount > wormholeDurationFrames && !hasOptimized) {
        // Start the optimization process from the frame where the wormhole ends
        if (optimizationStartFrame === 0) {
            optimizationStartFrame = frameCount;
        }
        
        let currentFrameRate = frameRate();  // Get current frame rate
        frameRateHistory.push(currentFrameRate);
        if (hasOptimized) {
            frameRateHistory = [];  // Clear frame rate history after optimization
        }else{
            if (frameRateHistory.length > 10) {
                frameRateHistory.shift();
            }
        }

        const averageFrameRate = frameRateHistory.reduce((a, b) => a + b) / frameRateHistory.length;
        if (averageFrameRate < 24) {
            // Remove the last added item and update optimized count variables
            if (lastAdded === 'star' && nebulaStars.length > 300) {
                nebulaStars.length -= 300;
                optimizedStarsCount = nebulaStars.length;
            } else if (lastAdded === 'galaxy' && galaxies.length > 1) {
                galaxies.pop();
                optimizedGalaxiesCount = galaxies.length;
            }
            // Lock the optimized values and set hasOptimized to true
            hasOptimized = true;
        } else if (averageFrameRate > 50) {
            const currentFrame = frameCount;
            if (lastAdded === 'galaxy' && nebulaStars.length < MAX_NEBULASTARS && currentFrame - lastStarAdditionFrame > additionFrameBuffer) {
                // Add stars if a galaxy was last added
                for (let i = 0; i < 300; i++) {
                    nebulaStars.push(new NebulaStar(R));
                }
                optimizedStarsCount = nebulaStars.length;
                lastAdded = 'star';
                lastStarAdditionFrame = currentFrame;
            } else if (lastAdded === 'star' && galaxies.length < MAX_GALAXIES && currentFrame - lastGalaxyAdditionFrame > additionFrameBuffer) {
                // Add a galaxy if a star was last added
                galaxies.push(new Galaxy(R));
                optimizedGalaxiesCount = galaxies.length;
                lastAdded = 'galaxy';
                lastGalaxyAdditionFrame = currentFrame;
            } else if (galaxies.length >= MAX_GALAXIES && nebulaStars.length < MAX_NEBULASTARS) {
                // Add more stars if max galaxies reached
                for (let i = 0; i < 300; i++) {
                    nebulaStars.push(new NebulaStar(R));
                }
                lastAdded = 'star';
            } else if (nebulaStars.length >= MAX_NEBULASTARS && galaxies.length < MAX_GALAXIES) {
                // Add more galaxies if max stars reached
                galaxies.push(new Galaxy(R));
                lastAdded = 'galaxy';
            }
        }

        // If the optimization process runs for more than 5 seconds, lock in the values
        if (frameCount > optimizationStartFrame + (5 * 60)) {
            hasOptimized = true;
        }
    } else if (hasOptimized) {
        // Use optimizedGalaxiesCount and optimizedStarsCount for the rest of the animation
        while (galaxies.length > optimizedGalaxiesCount) {
            galaxies.pop();
        }
        while (nebulaStars.length > optimizedStarsCount) {
            nebulaStars.pop();
        }
    }
}

// ☁️ NebulaStar Class for wormhole Destination
class NebulaStar {
    constructor(R) {
        this.x = R.random_num(-windowWidth / 2, windowWidth / 2);
        this.y = R.random_num(-windowHeight / 2, windowHeight / 2);
        this.z = R.random_num(-1000);
        this.size = R.random_num(1, 5); // size of star
        this.scale = 1;  // Initialize scale to 1
        
        // Ensure vibrant colors by setting saturation and brightness to high values.
        this.hue = R.random_num(0, 360);
        this.saturation = (100);
        this.brightness = (100);
    }
    
    show() {
        push();
        
        // Dynamic scaling based on window dimensions
        let scalingFactor = windowWidth * windowHeight / (initialWindowWidth * initialWindowHeight);
        // scale factor for star twinkling effect
        this.scale = random(0.8, 1.2);
       
        
        let newSize = this.size * scalingFactor * this.scale;
        
        // Ensure the size is at least 0.2 and not more than 1
        newSize = max(newSize, 2);  // Ensuring a minimum size
        newSize = min(newSize, 5);  // Ensuring a maximum size
        
        translate(this.x, this.y, this.z);
        stroke(this.hue, this.saturation, this.brightness, 255);
        strokeWeight(newSize);
        point(0, 0);
        
        pop();
    }    
}

// 🌀 Galaxy Class for Wormhole Destination  
class Galaxy {
    constructor(R) {
        // Z-depth, e.g., -3000 units away from the camera
        this.z = -3000;

        // Default FOV in radians
        let fov = PI / 3;

        // Calculating the aspect ratio
        let aspectRatio = windowWidth / windowHeight;

        // Distance from the camera
        let d = abs(this.z);

        // Calculating the visible area at the Z-depth
        let visibleHeightAtZ = 2 * Math.tan(fov / 2) * d;
        let visibleWidthAtZ = visibleHeightAtZ * aspectRatio;

        // Logarithmic scaling factor
        let viewportArea = windowWidth * windowHeight;
        let scalingFactor = Math.log(viewportArea + 1);

        // Basic fine-tuning variable
        let fineTuning = 1.25;

        // Adaptive fine-tuning for larger resolutions
        if (windowWidth > 1920 || windowHeight > 1080) {
            fineTuning = 1.58; // For resolutions above 1920x1080
        }

        // Fine-tuning for 4K and above
        if (windowWidth > 3840 || windowHeight > 2160) {
            fineTuning = 2.25; // For 4K and above
        }

        // Special fine-tuning for 8K in portrait mode
        if ((windowWidth > 7680 || windowHeight > 4320) && aspectRatio < 1) {
            fineTuning = 3.1; // This value can be adjusted for 8K in portrait mode
        }

        // Apply the fine-tuning
        scalingFactor *= fineTuning;

        // Normalize the scaling factor
        scalingFactor = scalingFactor / Math.log(viewportArea + 2);

        // Randomly positioning within the dynamically scaled visible area
        this.x = R.random_num(-visibleWidthAtZ / 2, visibleWidthAtZ / 2) * scalingFactor;
        this.y = R.random_num(-visibleHeightAtZ / 2, visibleHeightAtZ / 2) * scalingFactor;

        // Update size and color based on scaling factor
        this.type = R.random_int(0, 3); // We'll use this to determine the shape of the galaxy
        this.size = R.random_num(5, 50);
        this.initialSize = this.size;  // Remember the original size
        this.numArms = R.random_int(2, 8); // Number of spiral arms
        this.twistFactor = R.random_num(0.2, 0.3); // Determines the tightness of the spiral arms
        // Randomize the color for a rainbow effect
        // New lines to ensure brightness and saturation
        let hue = R.random_num(0, 255);
        let saturation = 255;
        let brightness = R.random_num(190, 255);
        this.color = [hue, saturation, brightness];
        this.alpha = R.random_num(225, 255);  // Transparency
        // Add initial rotation angles for random orientation
        this.initialRotationX = R.random_num(0, TWO_PI);
        this.initialRotationY = R.random_num(0, TWO_PI);
        this.initialRotationZ = R.random_num(0, TWO_PI);
        // Add a rotation speed for the galaxy
        this.rotationSpeed = R.random_num(0.009, 0.02);
        this.rotationDirection = R.random_num(0, 1) > 0.5 ? 1 : -1;
        // Add a rotation speed for the galaxy
        this.rotationSpeed = R.random_num(0.009, 0.02);
        this.rotationDirection = R.random_num(0, 1) > 0.5 ? 1 : -1;

        // Adding binary spiral rarity (e.g., 20% chance)
        this.isBinarySpiral = R.random_num(0, 1) < 0.20;

        // Adding rainbow galaxy rarity (e.g., 20% chance)
        this.isRainbowGalaxy = R.random_num(0, 1) < 0.20;
        this.overallHueOffset = 0;  // Initialize to 0
    }

    show() {
        let globalZ = this.z + (this.initialZ * height / initialWindowHeight);  // Calculate the global Z-coordinate
        this.globalZ = globalZ;  // Store it as a property
        push();
        translate(this.x, this.y, this.z);
    
        strokeWeight(2);  // Reduced for less intensity

        // Rotate the galaxy based on the initial rotation angles
        rotateX(this.initialRotationX);
        rotateY(this.initialRotationY);
        rotateZ(this.initialRotationZ);
    
        // Create the galaxy using points with some noise
        for (let arm = 0; arm < this.numArms; arm++) {
            let thetaOffset = (TWO_PI / this.numArms) * arm; // Offset each arm
            
            for (let theta = 0; theta < TWO_PI; theta += 0.1) {
                let noiseFactor = noise(theta * 4, arm * 0.01); // Noise to make it more galaxy-like
                let radius = this.size * 5 * (this.twistFactor + theta) * noiseFactor;  // Added scaling factor of 10
                let x = radius * cos(theta + thetaOffset);
                let y = radius * sin(theta + thetaOffset);
                let z = 0; // All points lie in the same plane

                // Apply rotation directly to the points
                let angle = frameCount * this.rotationSpeed * this.rotationDirection;
                let rotatedX = x * cos(angle) - y * sin(angle);
                let rotatedY = x * sin(angle) + y * cos(angle);

                // Update the overall hue offset for the galaxy only if it's a rainbow galaxy or a binary spiral galaxy with a rainbow occurrence
                if (this.isRainbowGalaxy || (this.isBinarySpiral && this.isRainbowGalaxy)) {
                    this.overallHueOffset += 0.005;  // Increase the speed as needed
                    if (this.overallHueOffset >= 360) {
                        this.overallHueOffset = 0;
                    }
                }

                // For rainbow galaxies
                if (this.isRainbowGalaxy) {
                    let hueShift = sin(frameCount * 0.5 + theta) * 90;  // Slower and varying hue change
                    let rainbowColor = color((this.color[0] + this.overallHueOffset + hueShift) % 360, this.color[1], this.color[2], 255);
                    stroke(rainbowColor);
                } else {
                    let galaxyColor = color(this.color[0], this.color[1], this.color[2], 255);  // No overall hue offset for normal galaxies
                    stroke(galaxyColor);
                }

                point(rotatedX, rotatedY, z);  // Draw a point instead of a line vertex

                // If it's a binary spiral galaxy, create a mirrored arm
                if (this.isBinarySpiral) {
                    // Mirror the point across the X-axis
                    point(rotatedX, -rotatedY, z);
                }
            }
        }

        pop();
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

// 🌏 CelestialObject class for wormhole destination sequence
class CelestialObject {
    constructor(R, features) {
        this.R = R; // Random number generator instance for custom Prohibition.art class for NFT seeds
        this.features = features; // stores features for planets, moons, etc.

        // Pre-calculate constant values for the celestial object
        this.textureResolutionFactor = 1; // Texture resolution factor for planet textures
        this.moonTextureResolutionFactor = 1; // Texture resolution factor for moon textures
        this.planetNoiseOffset = { x: random(0, 1000), y: random(0, 1000), z: random(0, 1000) };
        this.moonNoiseOffset = { x: random(0, 1000), y: random(0, 1000), z: random(0, 1000) };
        // Calculate initial values for size, aspect ratio, etc.
        this.calculateInitialValues();
        // Initialize moons
        this.initMoons();
        // Initialize Color and Ring Related Properties
        this.initColors();
        this.resize();  // Resize the celestial object
        // Rotation and Orbit angles for celestial objects, planets, moons, etc.:
        this.orbitAngle = this.features.orbitAngle;
        this.rotationAngle = this.features.rotationAngle;
    }

    // Function to pre-calculate initial values
    calculateInitialValues() {
        // Size/position calculations for planets
        this.size = getNumericSize(this.features.actualPlanetSize);
        this.initialSize = this.size; // store initial size removed + 70 from testing 🤦‍♂️
        this.initialAspectRatio = windowWidth / windowHeight; // store initial aspect ratio
        this.initialCanvasArea = windowWidth * windowHeight; // store initial canvas area
        this.initialSizeRatio = this.size / (windowWidth * windowHeight); // store initial size ratio
        this.maxSize = 150;  // Maximum size the celestial object can grow to
        this.sizeFactor = 0.05;  // Factor to control dynamic resizing
        this.z = 1001;
    }

    // Function to initialize moons
    initMoons() {
        // Moons:
        this.numMoons = this.features.numMoons; // Up to 3 moons
        this.moons = []; // array for moons
        const ringOuterSize = this.size * 1.5;  // The size of the outer ring
        let lastMoonDistance = 0; // Keep track of the last moon's distance
        
        for (let i = 1; i <= this.numMoons; i++) {
            const moonSizeFactor = 2;
            const moonSize = this.features[`moon${i}Size`] * moonSizeFactor;
            
            // Ensure a minimum gap between adjacent moons
            const minGap = moonSize * 5;  // 1.5 times the size of a moon as the minimum gap
            const moonDistance = Math.max(ringOuterSize + moonSize + this.features[`moon${i}MaxMDist`], lastMoonDistance + minGap);
            
            lastMoonDistance = moonDistance; // Update the lastMoonDistance
            const moonAngle = this.features[`moon${i}Angle`];
            const moonColorName = this.features[`moon${i}ColorName`];
            const moonColor = possibleRGBColors.find(color => color.name === moonColorName).rgb;
            const moonTexture = this.generateMoonTexture(moonSize, moonColor);
            
            const moon = { size: moonSize, distance: moonDistance, angle: moonAngle, texture: moonTexture, color: moonColor };
            
            moon.initialSize = moonSize;
            moon.initialDistance = moonDistance;
            moon.initialSizeRatio = moonSize / this.size;
            moon.initialDistanceRatio = moonDistance / this.size;
            
            this.moons.push(moon);
        }
        
        this.moons.sort((a, b) => a.distance - b.distance);  // Sort based on distance
    }

    // Initialize color-related properties and planet rings
    initColors() {
        this.isEarthLike = this.features.isEarthLike; // 5% chance to be Earth-Like
        this.randomTiltAngle = this.features.randomTiltAngle; // up to 45 degrees for planet tilt
        this.colorName = this.features.planetColor; // Store the color name for the planet
        this.outerRingColor = this.features.outRing; // color for outer ring on normal rings with 50% chance of hueshift
        this.innerRingColor = this.features.inRing; // color for inner ring on normal rings with 50% chance of hueshift
        this.hasRing = this.features.hasRings; // 50% chance of having rings
        this.isRainbowRing = this.features.isRainbowRing; // 10% chance to spawn rainbow Ring if rings are present
        this.ringTilt = this.features.ringTilt; // up to 45 degrees random tilt for rings
        this.hueOffset = 0;  // Initial hue offset for rainbow ring remains the same as this is not a pre-determined feature
    }

    // Method to update the celestial object orbit, moon angles, axial rotation, hue offset for rainbow ring
    update() {
        // Elliptical orbit
        this.orbitAngle += 0.005;
        if (this.orbitAngle > TWO_PI) {
        this.orbitAngle -= TWO_PI;
        }
        // Update moon angles for orbit in opposite direction
        this.moons.forEach(moon => {
            moon.angle -= 0.02; // += for rotation with planet, -= for rotation opposite planet
            if (moon.angle < 0) {
                moon.angle += TWO_PI;  // Loop back the angle when it goes below 0
            }
        });
        // Axial rotation
        this.rotationAngle += 0.005;
        if (this.rotationAngle > TWO_PI) {
        this.rotationAngle -= TWO_PI;
        }
        // Update hue offset for rainbow ring
        this.hueOffset += 50; // color change speed for rainbow rings
        if (this.hueOffset >= 360) {
            this.hueOffset -= 360;
        }
    }

    // Method to handle planet and moon resizing
    resize() {
        // Calculate canvas diagonal
        let canvasDiagonal = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight);

        // Calculate the baseline size as 3% of the canvas diagonal
        let baselineSize = canvasDiagonal * 0.03;

        // Create a scaling factor based on the initialSize (scaled between 0.9 and 1.1 for some variety)
        let scalingFactor = 0.9 + (this.initialSize - 25) * 0.002;

        // Calculate new size for planet based on baseline size and scaling factor
        this.size = baselineSize * scalingFactor;

        // Update moon sizes and distances
        this.moons.forEach(moon => {
            // Calculate new size for the moon based on baseline size and scaling factor
            moon.size = (baselineSize * 0.5) * scalingFactor;  // Moons are half the size of planets
            
            // Update the moon's distance based on the new planet size
            moon.distance = this.size * 1.5 + moon.size;  // The 1.5 factor ensures the moon is outside any potential ring
        });
    }

    // Function to generate and set a planet texture
    generateTexture() {
        let pg = createGraphics(Math.floor(this.size * 2 * this.textureResolutionFactor), Math.floor(this.size * 2 * this.textureResolutionFactor)); //for planet graphics
        let cloudPg = createGraphics(Math.floor(this.size * 2 * this.textureResolutionFactor), Math.floor(this.size * 2 * this.textureResolutionFactor));  // For clouds
        pg.colorMode(RGB);
        pg.noStroke();
        cloudPg.noStroke();
        let octaves = 3;
        let persistence = 0.5;
        let lacunarity = 5;
        this.planetNoiseOffset.x
        this.planetNoiseOffset.y
        this.planetNoiseOffset.z
        let cloudOffsetX = random(0, 1000);
        let cloudOffsetY = random(0, 1000);
        let cloudOffsetZ = random(0, 1000);        
        // Search for the color in both arrays
        const planetColorObj = [...possibleRGBColors, ...rareRGBColors].find(color => color.name === this.colorName);
        const planetRGB = planetColorObj ? planetColorObj.rgb : [255, 255, 255]; // Default to white if not found

        // Loop through each pixel in the texture
        for (let y = 0; y < pg.height; y++) {
            for (let x = 0; x < pg.width; x++) {
                let u = map(x, 0, pg.width, 0, TWO_PI);  // Changed from -PI to TWO_PI
                let v = map(y, 0, pg.height, -PI / 2, PI / 2);

                // Convert to Cartesian coordinates
                let xp = cos(v) * cos(u);  // Adjusted formula
                let yp = cos(v) * sin(u);  // Adjusted formula
                let zp = sin(v);

                let noiseVal = 0;
                let amplitude = 1;
                let frequency = 1;
                
                // 🌍 Surface generation for Earth-like planets
                if (this.isEarthLike) {
                    // Generate Perlin noise based on 3D Cartesian coordinates
                    for (let i = 0; i < octaves; i++) {
                        let n = noise(xp * frequency + this.planetNoiseOffset.x, yp * frequency + this.planetNoiseOffset.y, zp * frequency + this.planetNoiseOffset.z);
                        noiseVal += n * amplitude;
                        
                        amplitude *= persistence;
                        frequency *= lacunarity;
                    }

                    // Paint the pixel based on noise value
                    if (noiseVal > 0.8) {
                        pg.fill(0, 128, 0);  // Land
                    } else {
                        pg.fill(0, 0, 255);  // Water
                    }
                    pg.rect(x, y, 1, 1);

                    // 🌦 Generate clouds using similar Perlin noise structure as the surface
                    let cloudNoiseVal = 0;
                    amplitude = 1;
                    frequency = 1;
                    for (let i = 0; i < octaves; i++) {
                        let n = noise(xp * frequency + cloudOffsetX, yp * frequency + cloudOffsetY, zp * frequency + cloudOffsetZ);
                        cloudNoiseVal += n * amplitude;
                        amplitude *= persistence;
                        frequency *= lacunarity;
                    }

                    // Paint the cloud based on noise value
                    if (cloudNoiseVal > 0.6 && cloudNoiseVal < 0.8) {
                        let alpha = map(cloudNoiseVal, 0.6, 0.8, 0, 180);
                        cloudPg.fill(255, 255, 255, alpha);
                    } else {
                        cloudPg.fill(0, 0, 0, 0);
                    }
                    cloudPg.rect(x, y, 1, 1);
                } else {
                    // Generate Perlin noise for non-Earth-like planets.
                    for (let i = 0; i < octaves; i++) {
                        let n = noise(xp * frequency + this.moonNoiseOffset.x, yp * frequency + this.moonNoiseOffset.y, zp * frequency + this.moonNoiseOffset.z);
                        noiseVal += n * amplitude;
                        
                        amplitude *= persistence;
                        frequency *= lacunarity;
                    }

                    let r = Math.max(100, noiseVal * planetRGB[0]);
                    let g = Math.max(100, noiseVal * planetRGB[1]);
                    let b = Math.max(100, noiseVal * planetRGB[2]);
                    pg.fill(r, g, b);
                    pg.rect(x, y, 1, 1);
                }
            }
        }
        
        // Combine the cloud layer with the main surface
        pg.image(cloudPg, 0, 0);
        this.texture = pg;
    }

    // Function to generate a texture for moons
    generateMoonTexture(moonSize, moonColor) {
        let pg = createGraphics(Math.floor(moonSize * 2 * this.moonTextureResolutionFactor), Math.floor(moonSize * 2 * this.moonTextureResolutionFactor));
        pg.noStroke();
        let octaves = 4;  // Number of octaves
        let persistence = 0.5;  // Persistence (amplitude)
        let lacunarity = 5;  // Lacunarity (frequency)
        // Generate random offsets for noise
        this.moonNoiseOffset.x
        this.moonNoiseOffset.y
        this.moonNoiseOffset.z
        
        // Loop through each pixel in the texture
        for (let y = 0; y < pg.height; y++) {
            for (let x = 0; x < pg.width; x++) {
                let lat = map(y, 0, pg.height, 0, PI);
                let lon = map(x, 0, pg.width, 0, TWO_PI);
                
                let noiseVal = 0;
                let amplitude = 1;
                let frequency = 1;
                
                // Generate moon texture
                for (let i = 0; i < octaves; i++) {
                    let n = noise(sin(lat) * cos(lon) * frequency + this.moonNoiseOffset.x, sin(lat) * sin(lon) * frequency + this.moonNoiseOffset.y, cos(lat) * frequency + this.moonNoiseOffset.z);
                    noiseVal += n * amplitude;
                    
                    amplitude *= persistence;
                    frequency *= lacunarity;
                }

                // Add color variations
                let r = Math.max(50, noiseVal * (moonColor[0]));
                let g = Math.max(50, noiseVal * (moonColor[1]));
                let b = Math.max(50, noiseVal * (moonColor[2]));
                
                // Prevent greys or single-color dominance
                if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
                    r += 30;
                    g += 20;
                    b += 10;
                }

                pg.fill(r, g, b);
                pg.rect(x, y, 1, 1);
            }
        }
        return pg;
    }

    // Function for drawing planet with moons
    drawPlanet() {
        push();  // Isolate transformations for the planet

        // Apply axial rotation and random tilt for the planet
        rotateY(this.rotationAngle);
        rotateZ(this.randomTiltAngle);

        // Drawing planet
        
        texture(this.texture);
        noStroke();
        sphere(this.size);

        // Draw rings if the planet has them
        if (this.hasRing) {
            // Random tilt for the ring
            rotateX(this.ringTilt);
            rotateZ(this.ringTilt);

            // Determine the size of the ring based on the planet's size
            let ringOuterSize = this.size * 1.5;
            let ringInnerSize = this.size * 1.2;
            // if it is a rainbowring, draw it
            if (this.isRainbowRing) {
                let numSegments = 100;
                let angleStep = TWO_PI / numSegments;
                for (let i = 0; i < numSegments; i++) {
                    let angle1 = i * angleStep;
                    let angle2 = (i + 1) * angleStep;
                    
                    let hueVal = (map(i, 0, numSegments, 0, 360) + this.hueOffset) % 360;
                    fill(hueVal, 100, 100);
            
                    beginShape();
                    vertex(ringInnerSize * cos(angle1), ringInnerSize * sin(angle1));
                    vertex(ringInnerSize * cos(angle2), ringInnerSize * sin(angle2));
                    vertex(ringOuterSize * cos(angle2), ringOuterSize * sin(angle2));
                    vertex(ringOuterSize * cos(angle1), ringOuterSize * sin(angle1));
                    endShape(CLOSE);
                }
            } else {
                // Explicitly set the outer ring color and draw it
                let outerRingHue = this.outerRingColor[0];
                let outerRingSaturation = this.outerRingColor[1];
                let outerRingBrightness = this.outerRingColor[2];
                fill(outerRingHue, outerRingSaturation, outerRingBrightness);
                noStroke();
                torus(ringOuterSize, 2);

                // Explicitly set the inner ring color and draw it
                let innerRingHue = this.innerRingColor[0];
                let innerRingSaturation = this.innerRingColor[1];
                let innerRingBrightness = this.innerRingColor[2];
                fill(innerRingHue, innerRingSaturation, innerRingBrightness);
                torus(ringInnerSize, 2);
            }

            // Undo the random tilt for the ring
            rotateZ(-this.ringTilt);
            rotateX(-this.ringTilt);
        }

        pop();  // Reset transformations for the next celestial object

        // Reset rotation for moons
        rotateX(-PI / 2);  // Undo the ring rotation
        rotateZ(-this.randomTiltAngle);  // Undo the tilt

        // Draw moons with orbits around the Z-axis
        for (let moon of this.moons) {
            moon.size = moon.initialSizeRatio * this.size;
            moon.distance = moon.initialDistanceRatio * this.size;
            push();  // Isolate transformations for each moon

            let ellipticalX = moon.distance * cos(moon.angle);
            let ellipticalY = moon.distance * sin(moon.angle);

            // Translate the moon in orbit around the planet
            translate(ellipticalX, ellipticalY, 0);

            texture(moon.texture);
            noStroke();
            sphere(moon.size);

            pop();  // Reset transformations for the next moon
        }
    }

    // Function that shows celestial objects
    show() {
        push();  // Isolate transformations for each celestial object
        // Apply elliptical orbit here
        rotateY(this.orbitAngle);
        this.drawPlanet();  // The planet, its moons, and rings are drawn in this method
        pop();  // Reset transformations for the next celestial object
    }
}

// 🎥 New function to initialize a fixed camera
function initializeFixedCamera() {
    let camX = sin(frameCount * 0.01) * 2000;
    let camZ = cos(frameCount * 0.01) * 2000;
    camera(camX, 1000, camZ, 0, 0, 0, 0, 1, 0);
}

// 🌌 Star class for warp speed/wormhole sequence
class Star {
    constructor() {
        this.reinitialize();  // Initialize star properties
    }

    reinitialize() {
        // Generate initial properties in a standardized virtual space (e.g., -1000 to 1000)
        this.virtualX = R.random_num(-1000, 1000);
        this.virtualY = R.random_num(-1000, 1000);
        this.virtualZ = R.random_num(0, 1000);
        this.pz = this.virtualZ;
        this.initialZ = this.virtualZ;
    }

    // Scale the virtual coordinates to actual canvas dimensions
    scaleToCanvas() {
        this.x = map(this.virtualX, -1000, 1000, -width, width);
        this.y = map(this.virtualY, -1000, 1000, -height, height);
        this.z = map(this.virtualZ, 0, 1000, 0, width);
    }

    update() {
        this.pz = this.z;  // Store the current z-coordinate for use in the next frame
    
        // Update in virtual space
        this.virtualZ -= 6 * warpSpeedFactor;
    
        // Calculate the distance from the center of the viewport
        let d = dist(0, 0, this.virtualX, this.virtualY);
        
        // Radius of the central hole, growing with warpSpeedFactor
        // Limiting the maximum hole radius to 50
        let holeRadius = constrain(map(warpSpeedFactor, 1, 100, 0, 500), 0, 50);
        
        // Check if the star is within the hole, and if so, reinitialize it
        if (d < holeRadius) {
            this.reinitialize();
            this.virtualZ = 1000;  // Reset z-coordinate far away
        }
    
        // If the star moves past the viewer, reinitialize it
        if (this.virtualZ < 1) {
            this.reinitialize();
            this.virtualZ = 1000;  // Reset z-coordinate far away
        }
        
        // Scale to actual canvas dimensions
        this.scaleToCanvas();  // Make sure this method uses windowWidth and windowHeight
    }    

    // include theoretical FTL start white, Blue shift toward the stars, then red shift on the other side of FTL away from light
    show() {
        let hueShiftFactor;
        let saturation = 255;  // Initialize to full saturation
        
        if (warpSpeedFactor < 10) {
            hueShiftFactor = 0;  
            saturation = 0;  // No saturation for white
        } else if (warpSpeedFactor < 30) {
            hueShiftFactor = map(warpSpeedFactor, 10, 30, 240, 270); // Blue
        } else if (warpSpeedFactor < 50) {
            hueShiftFactor = map(warpSpeedFactor, 30, 50, 270, 360); // Violet to magenta
        } else if (warpSpeedFactor < 70) {
            hueShiftFactor = map(warpSpeedFactor, 50, 70, 0, 60); // Red to orange
        } else {
            hueShiftFactor = map(warpSpeedFactor, 70, 100, 60, 120); // Orange to Green
        }
        
        stroke(hueShiftFactor, saturation, 255); // Full brightness
    
        let sx = map(this.x / this.z, 0, 1, 0, width);
        let sy = map(this.y / this.z, 0, 1, 0, height);
    
        let px = map(this.x / this.pz, 0, 1, 0, width);
        let py = map(this.y / this.pz, 0, 1, 0, height);
    
        this.pz = this.z;
    
        let r = map(this.z, 0, width, 3, 0);
        strokeWeight(r);
    
        let dx = sx - px;
        let dy = sy - py;
    
        let endX = sx + dx * warpSpeedFactor;
        let endY = sy + dy * warpSpeedFactor;
    
        line(sx, sy, endX, endY);
    }        
// Add an isActive flag to control rendering
isActive = true;
}

// ⌨️ Keyboard controls
function keyPressed() {
  const currentTime = new Date().getTime();

  if (keyCode === ENTER) {  // ENTER to restart NFT at wormhole sequence
    if (currentTime - lastPressedTime < minInterval) {
      // 🚫 Block rapid ENTER presses
      return;
    }

    lastPressedTime = currentTime;  // 🕒 Update last pressed time

    // 🌀☁️ Reset optimization flags for galaxy and nebula stars threshold optimization process
    frameRateHistory = []; // Reset frame rate history
    hasOptimized = false; // Reset optimization flag
    optimizedGalaxiesCount = 1; // Reset optimized galaxy count
    optimizedStarsCount = 300; // Reset optimized star count
    optimizationStartFrame = 0; // Reset optimization start frame
    // 🛑 Clear arrays for Wormhole End stars
    staticStars.length = 500;
    frameCount = 0;
    
    // 🎨🪟 Re-initialize canvas setup
    initializeScene();
    // 🌌🛑☁️ Re-initialize Stars
    resetStars();
    // 🌏 Reset the Celestial Objects
    resetCelestialObject();  // 🌏 Reset the celestial object based on new dimensions
    celestialObject.generateTexture(); // 🌏 Regenerate texture based on new dimensions
    
    loop();  // ⏲️ Restart the loop
  }
}


// 🪟 WindowResized function
function windowResized() {
    // Update window dimensions and resize the canvas
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    resizeCanvas(windowWidth, windowHeight, true);

    // 🎥🌀 reset global aspect ratio on resizes:
    aspectRatio = windowWidth / windowHeight;

    // 🎥 Recalculate the perspective based on new window dimensions
    let newFov = PI / 3;
    let newAspectRatio = windowWidth / windowHeight; // New aspect ratio
    let newCameraZ = (height / 2.0) / tan(PI * 30.0 / 180.0);
    perspective(newFov, newAspectRatio, newCameraZ / 10, 1000000);  // Set far clipping plane far enough

    // 🌀☁️ Reset optimization flags for galaxy and nebula stars threshold optimization process
    frameRateHistory = []; // Reset frame rate history
    hasOptimized = false; // Reset optimization flag
    optimizedGalaxiesCount = 1; // Reset optimized galaxy count
    optimizedStarsCount = 300; // Reset optimized star count
    optimizationStartFrame = 0; // Reset optimization start frame
    // 🛑 Clear arrays for Wormhole End stars
    staticStars.length = 500;
    frameCount = 0;
    
    // 🎨🪟 Re-initialize canvas setup
    initializeScene();
    // 🌌🛑☁️ Re-initialize Stars
    resetStars();
    // 🌏 Reset the Celestial Objects
    resetCelestialObject();  // 🌏 Reset the celestial object based on new dimensions
    celestialObject.generateTexture(); // 🌏 Regenerate texture based on new dimensions
    
    loop();  // ⏲️ Restart the loop
}