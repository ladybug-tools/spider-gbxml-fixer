/* globals GBX, GSA, TMPsumSurfaces, TMPdivSurfaceData, TMPdet, TMPtxt */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const TMP = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-17",
	"description": "template for checking surfaces",
	"helpFile": "./r0-4-0/tmp-template/README.md",
	"release": "0.4-2"

};


TMP.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];



TMP.getMenuTemplate = function() {

	TMP.help = `<button id=butTMP class=butHelp onclick="MNU.setPopupShowHide(butTMP,TMP.helpFile);" >?</button>`;

	const htm =
		`
			<details id=TMPdet ontoggle="TMPdivSurface.innerHTML=TMP.getSurfaces();" >

				<summary id=TMPsumSurfaces >Template: Get surfaces
					${ TMP.help }
				</summary>

				<div id=TMPdivSurface ></div>

			</details>

		`;

	return htm;

};



TMP.getSurfaces = function() {

	const timeStart = performance.now();

	TMP.surfaces = [];

	TMP.surfaces = GBX.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		exposedToSun = exposedToSun ? exposedToSun[ 0 ] : "";
		//let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : "false";

		return( { index, id, name, typeSource, exposedToSun } );

	} );
	//console.log( 'TMP.surfaces', TMP.surfaces );

	const options = TMP.surfaces.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );


	TMPsumSurfaces.innerHTML =
		`Template: Get surfaces ~ ${ TMP.surfaces.length.toLocaleString() } found ${ TMP.help }`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ TMP.surfaces.length.toLocaleString() } surface types found.</p>

		<p>
			<select id=TMPselSurfaces onclick=TMP.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=TMP.fixAllSurfaces(); >Fix all</button></p>

		<p>Click 'Save file' button in File menu to save changes to a file.</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		<hr>

		<div id="TMPdivSurfaceData" >Click a surface name above to view its details and change its surface type. Tool tip shows the ID of the surface.</div>

	`;

	return htm;

};



TMP.setSurfaceData = function( select ) {

	//const surface = TMP.surfaces[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm =
	`
		${ GSA.getSurfacesAttributesByIndex( select.value, select.selectedOptions[ 0 ].innerHTML ) }

		<p>
			<button onclick=TMP.fixSurface(${ select.value }); title="" >change surface type</button>
		</p>

		<p>
			<textarea id=TMPtxt style="height:20rem; width:100%;" ></textarea>
		</p>
	`;

	TMPdivSurfaceData.innerHTML = htm;

};



TMP.fixSurface = function( index ) {

	const surfaceText = GBX.surfaces[ index ];

	const surfaceTextNew = surfaceText.replace( /<Surface(.*?)>/i,
		"<Surface $1 > <Description>Edited by Spider gbXML Fixer</Description> ");

	TMPtxt.value = surfaceTextNew;

};



TMP.fixAllSurfaces = function() {

	for ( let surfaceText of GBX.surfaces ) {

		const surfaceTextNew = surfaceText.replace( /<Surface(.*?)> /i,
			"<Surface $1> <Description>Edited by Spider gbXML Fixer</Description> ");

		GBX.text = GBX.text.replace( surfaceText, surfaceTextNew );

	}

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	TMPdet.open = false;

	console.log( 'GBX.surfaces[ 0 ]', GBX.surfaces[ 0 ] );

};