
/* Constants */	

// Keyboard button A code
const _WAVE_A_KEY_CODE = 65;
// Keyboard button Z code
const _WAVE_Z_KEY_CODE = 90;
// Array where for each alphabet letter a different prime number is defined:
// A=2, B=3, C=5, D=7, ... , Y=97, Z=101
const _WAVE_ALPHABET_PRIME_ARRAY = [
	2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 
	37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 
	79, 83, 89, 97, 101];
// Max number of alphabet key pressable at same time
const _WAVE_MAX_ALPHABET_PRESSED_KEYS = 8;

/* Wave class */
class Wave {
	
	constructor (elemId, setup = { }) {
		// check valid elemId argument
		if (!elemId) {
			throw "No element ID passed"
		}
		
		// retrieve HTML element
		this._elem = document.getElementById(elemId);
		
		// checks HTML element existence
		if (!this._elem) {
			throw "No HTML element found having ID '" + elemId + "'";
		}
		
		// setup instance fields
		this._width = setup.width || 1024;
		this._height = setup.height || 768;
		this._stroke = setup.stroke || 'blue';
		this._strokeWidth = setup.strokeWidth || 5;
		this._horizontalPadding = setup.horizontalPadding || 10;
		this._bottomPadding = setup.bottomPadding || 60;
		this._curveWidth = setup.curveWidth || 300;
		this._curveHeight = setup.curveHeight || 50;
		this._maxExpandedCurveHeight = setup.maxExpandedCurveHeight || 400;
		this._pointStroke = setup.pointStroke || 'black';
		this._pointStrokeWidth = setup.pointStrokeWidth || 3;
		this._pointFill = setup.pointFill || 'black';
		this._pointRadius = setup.pointRadius || 3;
		// animation settings
		this._updateFrequencyMs = setup.updateFrequencyMs || 5;
		this._angleCounterStep = setup.angleCounterStep || 5;
		this._expansionStep = setup.expansionStep || 10;
		this._contractionStep = setup.contractionStep || 20;
		// input settings
		this._keyListenerElement = setup.keyListenerElement || document;
		// wave event handler
		this._waveEventHandler = setup.waveEventHandler || function(waveEvent) { console.log(waveEvent); };

		// init instance
		this._init();
		
	}
	
	/* GETTERS */
	
	// Element width (in pixels).
	// Default value: 1024
	get width() { return this._width; }
	// Element height (in pixels).
	// Default value: 768
	get height() { return this._height; }
	// Wave path stroke.
	// Default value: blue
	get stroke() { return this._stroke; }
	// Wave path stroke width.
	// Default value: 5
	get strokeWidth() { return this._strokeWidth; }
	// Horizontal wave padding (in pixels).
	// Default value: 10
	get horizontalPadding() { return this._horizontalPadding; }
	// Bottom wave padding (in pixels).
	// Default value: 60
	get bottomPadding() { return this._bottomPadding; }
	// Curve width (in pixels).
	// Default value: 300
	get curveWidth() { return this._curveWidth; }
	// Curve height (in pixels).
	// Default value: 50
	get curveHeight() { return this._curveHeight; }
	// Max expanded curve height for a single key (in pixels).
	// Default value: 400
	get maxExpandedCurveHeight() { return this._maxExpandedCurveHeight; }
		
	// Point stroke.
	// Default value: black
	get pointStroke() { return this._pointStroke; }
	// Point stroke width (in pixels).
	// Default value: 3
	get pointStrokeWidth() { return this._pointStrokeWidth; }
	// Point fill.
	// Default value: black	
	get pointFill() { return this._pointFill; }
	// Point radius (in pixels).
	// Default value: 3
	get pointRadius() { return this._pointRadius; }
	// Curve update frequency in milliseconds.
	// Default value: 5
	get updateFrequencyMs() { return this._updateFrequencyMs; }
	// Angle counter step (in degree).
	// This value indicates how much degrees the angle of the sin
	// function needed for rolling the wave will step forward in 
	// each image update. Low values will set the wave smoother 
	// (but slower), high values set the wave more rough (but faster).
	// Default value: 5
	get angleCounterStep() { return this._angleCounterStep; }
	// Expansion step of the main curve when a key is pressed (in pixels).
	// Default value: 10
	get expansionStep() { return this._expansionStep; }
	// Contraction step of the main curve when a key is released (in pixels).
	// Default value: 20
	get contractionStep() { return this._contractionStep; }
	// HTML element to listen for the pressed keys
	// Default value: document
	get keyListenerElement() { return this._keyListenerElement; }
	
	// setters (do nothing)
	set width(p) { /* do nothing */ }
	set height(p) { /* do nothing */ }
	set stroke(p) { /* do nothing */ }
	set strokeWidth(p) { /* do nothing */ }
	set horizontalPadding(p) { /* do nothing */ }
	set bottomPadding(p) { /* do nothing */ }
	set curveWidth(p) { /* do nothing */ }
	set curveHeight(p) { /* do nothing */ }
	set maxExpandedCurveHeight(p) { /* do nothing */ }
	set pointStroke(p) { /* do nothing */ }
	set pointStrokeWidth(p) { /* do nothing */ }
	set pointFill(p) { /* do nothing */ }
	set pointRadius(p) { /* do nothing */ }
	set updateFrequencyMs(p) { /* do nothing */ }
	set angleCounterStep(p) { /* do nothing */ }
	set expansionStep(p) { /* do nothing */ }
	set contractionStep(p) { /* do nothing */ }
	set keyListenerElement(p) { /* do nothing */ }
	
	start() {
		var selfie = this;
		if (this._curveUpdateIntervalID != -1) {
			this._curveUpdateIntervalID = setInterval(function() {
				selfie._updateDrawnWave();
			});
		}
	}
	
	stop() {
		if (this._curveUpdateIntervalID != -1) {
			clearInterval(this._curveUpdateIntervalID);
			this._curveUpdateIntervalID = -1;
		}		
	}
	
	
	/* PRIVATE METHODS */
	
	// init instance
	_init() {
		
		/* INITIALIZE INTERVAL PRIVATE INSTANCE FIELDS */
		
		// curve update interval ID: initially set to -1
		this._updateIntervalID = -1;
		// Counter of the angle (in degree) used in the sin
		// function needed for rolling the wave
		this._rollingCurveAngleCounter = 0;
		// Rolling value needed for rolling the wave
		this._rollingCurveSinValue = 0;		
		// Start X point of the wave path
		this._wavePathX = this._horizontalPadding;
		// Start Y point of the wave path
		this._wavePathY = this._height - this._bottomPadding;
		// The rolling curve height
		this._rollingCurveHeight = 0;
		// The expanded curve height
		this._expandedCurveHeight = -this._curveHeight;
		// The current expanded curve height
		this._currentExpandedCurveHeight = 0;
		// Number of pressed keys to expande the main curve
		this._expandedCurvePressedKeyNumber = 0;
		// Pressed key set: it will have the multiplication
		// of the prime numbers related to the pressed keys
		this._expandedCurvePressedKeySet = 1;
		// Set to true when the expanded curve are decreasing
		this._expandedCurveDecreasing = false
		// Array for storing the pressure time of an alphabetic key
		this._alphabeticKeyPressTime = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		// Array for storing the idle time between alphabetic key pressures
		this._startIdleTime = 0;
		
		// create SVG element
		var svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgElem.setAttributeNS(null, 'width', this._width);
		svgElem.setAttributeNS(null, 'height', this._height);
		
		var pathElem = document.createElementNS('http://www.w3.org/2000/svg',"path");
		pathElem.setAttributeNS(null, 'd', this._getWavePath(0));
		pathElem.setAttributeNS(null, 'stroke', this._stroke);
		pathElem.setAttributeNS(null, 'stroke-width', this._strokeWidth);
		pathElem.setAttributeNS(null, 'fill', 'none');
		
		var gElem = document.createElementNS('http://www.w3.org/2000/svg',"g");
		gElem.setAttributeNS(null, 'stroke', this._pointStroke);
		gElem.setAttributeNS(null, 'stroke-width', this._pointStrokeWidth);
		gElem.setAttributeNS(null, 'fill', this._pointFill);
		
		var startPointElem = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		startPointElem.setAttributeNS(null, 'cx', this._wavePathX);
		startPointElem.setAttributeNS(null, 'cy', this._wavePathY);
		startPointElem.setAttributeNS(null, 'r', this._pointRadius);
		
		var endPointElem = document.createElementNS('http://www.w3.org/2000/svg',"circle");
		endPointElem.setAttributeNS(null, 'cx', this._wavePathX + this._curveWidth);
		endPointElem.setAttributeNS(null, 'cy', this._wavePathY);
		endPointElem.setAttributeNS(null, 'r', this._pointRadius);
		
		gElem.appendChild(startPointElem);
		gElem.appendChild(endPointElem);
		svgElem.appendChild(pathElem);
		svgElem.appendChild(gElem);
		
		// append SVG element to the HTML element set in the constructor
		this._elem.appendChild(svgElem);
		
		// stores the path element as private instance field to update it later
		this._wavePathElem = pathElem;
		
		// creates key listener to the HTML element of the wave
		var selfie = this;
		this._keyListenerElement.addEventListener('keydown', function(event) { selfie._pressedKey(event)});
		this._keyListenerElement.addEventListener('keyup', function(event) { selfie._releasedKey(event)});
	}
	
	_getWavePath(currentWaveHeight) {
		return `M ${this._wavePathX} ${this._wavePathY} q ${this._curveWidth / 2} ${currentWaveHeight} ${this._curveWidth} 0`;
	}
	
	// update drawn wave
	_updateDrawnWave() {
		// convert angle from degree to number (Ex: 180° -> Math.PI)
		var rollingCurveAngle = this._rollingCurveAngleCounter / 360.0 * 2 * Math.PI;
		
		// Step forward rolling curve angle counter by ciclying to 360°
		this._rollingCurveAngleCounter = 
			(this._rollingCurveAngleCounter + this._angleCounterStep) % 361;
		
		// Get current sin value of the rolling curve
		this._rollingCurveSinValue = Math.sin(rollingCurveAngle);
		
		// Calculates current height of the rolling curve
		this._rollingCurveHeight = 
			Math.trunc(this._rollingCurveSinValue * this._curveHeight);
		
		if (this._expandedCurvePressedKeyNumber > 0) {
			if (this._currentExpandedCurveHeight > this._expandedCurveHeight) {
				this._currentExpandedCurveHeight -= (this._expansionStep * this._expandedCurvePressedKeyNumber);
			} else {
				this._currentExpandedCurveHeight += (this._expansionStep * this._expandedCurvePressedKeyNumber);				
			}
		} else if (this._expandedCurveDecreasing) {
			this._currentExpandedCurveHeight += this._contractionStep;
			if (this._rollingCurveHeight < this._currentExpandedCurveHeight) {
				this._expandedCurveDecreasing = false;
			}
		} else {
			this._currentExpandedCurveHeight = this._rollingCurveHeight;
		}
		
		// Update wave path
		this._updateWavePath();
	}
	
	_updateWavePath() {
		this._wavePathElem.setAttributeNS(null, 'd', this._getWavePath(this._currentExpandedCurveHeight));
	}
	
	_pressedKey(event) {
		var keyCode = event.keyCode;
		if (this._isAlphabeticKey(keyCode)) {
			var keyIndex = keyCode - _WAVE_A_KEY_CODE;
			var keyPrime = _WAVE_ALPHABET_PRIME_ARRAY[keyIndex];
			if (this._expandedCurvePressedKeySet % keyPrime != 0) {
				this._expandedCurvePressedKeySet *= keyPrime;
				this._expandedCurvePressedKeyNumber++;
				this._expandedCurveHeight -= 
					Math.trunc((this._maxExpandedCurveHeight / (_WAVE_ALPHABET_PRIME_ARRAY.length - 1)) * (keyIndex ));
				
				// Start wave event preparation
				this._manageEventAfterKeyPressed(keyIndex);
			}
		}
	}
	
	_releasedKey(event) {
		var keyCode = event.keyCode;
		if (this._isAlphabeticKey(keyCode)) {
			var keyIndex = keyCode - _WAVE_A_KEY_CODE;
			var keyPrime = _WAVE_ALPHABET_PRIME_ARRAY[keyIndex];
			this._expandedCurvePressedKeySet /= keyPrime;;
			this._expandedCurvePressedKeyNumber--;
			this._expandedCurveHeight += 
					Math.trunc((this._maxExpandedCurveHeight / (_WAVE_ALPHABET_PRIME_ARRAY.length - 1)) * (keyIndex));
			if (this._expandedCurvePressedKeyNumber == 0) {
				this._expandedCurveDecreasing = true;
			}
			
			// Generate wave event
			this._manageEventAfterKeyReleased(keyIndex);
		}
	}
	
	_isAlphabeticKey(keyCode) {
		return keyCode >= _WAVE_A_KEY_CODE && keyCode <= _WAVE_Z_KEY_CODE;
	}
	
	_manageEventAfterKeyPressed(keyIndex) {
		// Start event preparation
		this._alphabeticKeyPressTime[keyIndex] = Date.now();
		// If it is the first key pressed and there is a previous
		// timestamp storing the start idle time then trigger idle event
		if (this._expandedCurvePressedKeyNumber == 1 && this._startIdleTime > 0) {
			var selfie = this;
			var waveEvent = { event: "idle", duration: Date.now() - this._startIdleTime};
			console.log(waveEvent);
			setTimeout(this._updateFrequencyMs / 2, function() {
				this._waveEventHandler(waveEvent);
			});
		}		
	}
	
	_manageEventAfterKeyReleased(keyIndex) {
		
		var selfie = this;
		var now = Date.now();
		var waveEvent = { key: String.fromCharCode(_WAVE_A_KEY_CODE + keyIndex), duration: now - this._alphabeticKeyPressTime[keyIndex]};
		console.log(waveEvent);
		// send event having key pressed and pressure time
		setTimeout(this._updateFrequencyMs / 2, function() {
			this._waveEventHandler(waveEvent);
		});
		// if no other keys are pressed then starts to calculate the idle time
		if (this._expandedCurvePressedKeyNumber == 0) {
			this._startIdleTime = now;
		}		
	}
}

