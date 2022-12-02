export const setUpCanvas = (canvasId) => {
	// Initiate the canvas
	const options = {
		useService: true,
		oneMolecule: true,
		// isMobile: true,  // can we have detect if the device is mobile ?
	};

	// Set up the ChemDoodle SketcherCanvas component
	ChemDoodle.ELEMENT["H"].jmolColor = "black";
	ChemDoodle.ELEMENT["S"].jmolColor = "#B9A130";
	const sketcher = new ChemDoodle.SketcherCanvas(canvasId, 600, 400, options);

	sketcher.styles.atoms_displayTerminalCarbonLabels_2D = true;
	sketcher.styles.atoms_useJMOLColors = true;
	sketcher.styles.bonds_clearOverlaps_2D = true;
	sketcher.styles.shapes_color = "c10000";
	sketcher.repaint();
	return sketcher;
};


export const setViewCanvas = (viewCanvas, molBlock, transform = false) => {
	if (transform) {
		viewCanvas.styles.set3DRepresentation("Ball and Stick");
		viewCanvas.styles.backgroundColor = "black";
	} else {
		viewCanvas.styles.bonds_width_2D = 0.6;
		viewCanvas.styles.bonds_saturationWidthAbs_2D = 2.6;
		viewCanvas.styles.bonds_hashSpacing_2D = 2.5;
		viewCanvas.styles.atoms_font_size_2D = 10;
		viewCanvas.styles.atoms_font_families_2D = [
			"Helvetica",
			"Arial",
			"sans-serif",
		];
		viewCanvas.styles.atoms_displayTerminalCarbonLabels_2D = true;
		// viewCanvas.styles.backgroundColor = 'grey';
	}
	let mol = ChemDoodle.readMOL(molBlock, transform ? 1.5 : null);
	viewCanvas.loadMolecule(mol);
};

export const displayCorrectAns = (molBlock, isomerName) => {
	const molLs = $(".duplicates");
	const isomerSet = document.createElement("div");
	const nameHdr = document.createElement("h3");
	nameHdr.innerText = isomerName;
	isomerSet.appendChild(nameHdr);
	const span = document.createElement("span");
	const canvas2d = document.createElement("canvas");
	const canvas3d = document.createElement("canvas");
	span.appendChild(canvas2d);
	span.appendChild(canvas3d);
	span.style.display = "inline-block";
	isomerSet.appendChild(span);
	molLs.appendChild(isomerSet)

	const canvas2dId = `canvas${Object.keys(state.game.correctAns).length}0`;
	canvas2d.setAttribute("id", canvas2dId);
	const viewCanvas2d = new ChemDoodle.ViewerCanvas(canvas2dId, 150, 150);
	setViewCanvas(viewCanvas2d, molBlock);

	const canvas3dId = `canvas${Object.keys(state.game.correctAns).length}1`;
	canvas3d.setAttribute("id", canvas3dId);
	const viewCanvas3d = new ChemDoodle.TransformCanvas3D(canvas3dId, 150, 150);
	setViewCanvas(viewCanvas3d, molBlock, true);
};

export const getMolBlockStr = (canvas) => {
	return ChemDoodle.writeMOL(canvas.getMolecule());
};

export const clearCanvas = () => {
	ChemDoodle.uis.actions.ClearAction(sketcher);
	sketcher.repaint();
};