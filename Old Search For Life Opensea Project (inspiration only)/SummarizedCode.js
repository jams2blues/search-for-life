  // lots of program global variables...
// 🎲 Prohibition's Random Class for all randomness for deterministic output...
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
    features.hasRings = R.random_bool(1);  // 50% chance of having rings *TEMPORARILY 100% for testing
    features.isRainbowRing = features.hasRings ? R.random_bool(0.1) : false;  // 10% chance of rainbow rings if rings are present

    // 🌈 Only generate ring colors if there are rings
    if (features.hasRings) {
        const possibleHues = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        let innerRingColor = [R.random_choice(possibleHues), 100, 100];
        let outerRingColor = [R.random_choice(possibleHues), 100, 100];
        // Adding a random hue to either the inner or outer ring to increase chances of them being different...
        // Calculate color names after hue shift...
        // Save color names for display...
        // If rainbow rings, set the color name to 'Rainbow'...
    } else {
        // If no rings, set the color name to 'None'...
    }

    // 🌏 Moon features
    features.numMoons = R.random_int(0, 3);

    // 🌏 Planet size Enum class...
    // 🌍 Planet Size Class (weights are now more explicit)...
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

// 🎨🛑🌌☁️⌨️ Initialize Star Classes for keyboard resets and setup/initialize canvas function...
// 🎨🌏⌨️ Initialize Celestial Object & reset Celestial Object initial size and canvas area in keyboard controls
function resetCelestialObject() {
    // Re-calculate initial values based on new dimensions
    celestialObject = new CelestialObject(R, features);  // Create a new celestial object
    celestialObject.generateTexture();  // Regenerate the texture
}
// more drawing funcitons...
// ✏️ Main Drawing Function
function draw() {
    // 🎥 Update Camera FOV and Aspect Ratio...
    // 🎥 Reset Camera and Translation for each draw loop...
    
    // ⏲ Animation Loop...
    // 🌌 Checks frame count, wormholeDurationFrames for vanishing wormhole sequence, and appearance of Wormhole Destination sequence
    if (frameCount <= wormholeDurationFrames) {
        // more code for other drawing methods...

        // Set the flag to false since the wormhole sequence is still ongoing
        isWormholeSequenceComplete = false;
    } else {
        // Set the flag to true as the wormhole sequence is now complete
        isWormholeSequenceComplete = true;
        // ☁️ Then draw NebulaStars
        if (isWormholeSequenceComplete) {
            // more code for other drawing methods...

            // 🌏 ☁️ reset the depth buffer before drawing celestial objest so nebulaStars stay behind planets.
            gl.clear(gl.DEPTH_BUFFER_BIT);

            // 🌏 Update the celestial object
            celestialObject.update();
            // 🌏 Show the celestial object
            celestialObject.show();
            translate(0, 0, celestialObject.z);
        }
    }

    // 🌀☁️ Monitoring frame rate for dynamic throttling & performance evolution...
}

// ☁️ NebulaStar Class for wormhole Destination...
// 🌀 Galaxy Class for Wormhole Destination...
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

        // Pre-calculate constant values for the celestial object textures for planets and moons...
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
        for (let i = 1; i <= this.numMoons; i++) {
            const moonSizeFactor = 2
            const moonSize = this.features[`moon${i}Size`] * moonSizeFactor;
            const moonDistance = ringOuterSize + moonSize + this.features[`moon${i}MaxMDist`] // Moons will always be outside the ring
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
        
        this.moons.sort((a, b) => a.distance - b.distance);
    }

    // Initialize color-related properties and planet rings
    initColors() {
        this.isEarthLike = this.features.isEarthLike; // 5% chance to be Earth-Like
        this.randomTiltAngle = this.features.randomTiltAngle; // up to 45 degrees for planet tilt
        this.colorName = this.features.planetColor; // Store the color name for the planet
        this.outerRingColor = this.features.outerRingColor; // color for outer ring on normal rings with 50% chance of hueshift
        this.innerRingColor = this.features.innerRingColor; // color for inner ring on normal rings with 50% chance of hueshift
        this.hasRing = this.features.hasRings; // 50% chance of having rings
        this.isRainbowRing = this.features.isRainbowRing; // 10% chance to spawn rainbow Ring if rings are present
        this.ringTilt = this.features.ringTilt; // up to 45 degrees random tilt for rings
        this.hueOffset = 0;  // Initial hue offset for rainbow ring remains the same as this is not a pre-determined feature
    }

    // Method to update the celestial object orbit, moon angles, axial rotation, hue offset for rainbow ring
    update() {
        // Elliptical orbit...
        // Update moon angles for orbit in opposite direction...
        // Axial rotation...
        // Update hue offset for rainbow ring...
    }

    // Method to handle planet resizing
    resize() {
        // Calculate canvas diagonal
        let canvasDiagonal = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight);
        // Calculate new size for planet based on a percentage of the canvas diagonal and a sizing constant that keeps the initialSize close to the planet's actual size and proportional to window dimensions
        const DiagonalSizeConstant = 1 / canvasDiagonal; // equivalent to 'X' in the PlanetResizeCalculation equation (CanvasDiagonal * X) * this.initialSize = this.initialSize
        let PlanetResizeCalculation = (canvasDiagonal * DiagonalSizeConstant) * this.initialSize;
        this.size = PlanetResizeCalculation
        // Update moon sizes and distances
        this.moons.forEach(moon => {
            // Calculate MoonResizeCalculation
            let MoonResizeCalculation = (canvasDiagonal * DiagonalSizeConstant) * moon.initialDistance;

            // Update the moon's distance based on MoonResizeCalculation
            moon.distance = MoonResizeCalculation;

            // Update moon size using a similar approach
            let MoonSizeCalculation = (canvasDiagonal * DiagonalSizeConstant) * moon.initialSize;
            moon.size = MoonSizeCalculation;
        });
    }

    // Function to generate and set a planet texture...
    // Function to generate a texture for moons...
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
                    // Rainbow ring code works...
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

// rest of code...