/* globals GBX, GSA, TMPsumSurfaces */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const TMP = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-10",
	"description": "template for checking surfaces",
	"helpFile": "../tmp-template/README.md",
	"release": "0.4.1"

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
			<details ontoggle="TMPdivSurface.innerHTML=TMP.getSurfaces();" >

				<summary id=TMPsumSurfaces >Get surfaces
					${ TMP.help }
				</summary>

				<div id=TMPdivSurface ></div>

				<div id=TMPdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



TMP.getSurfaces = function() {

	const timeStart = performance.now();

	TMPdivSurfaceAttributeData.innerHTML = "";

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

	console.log( 'TMP.surfaces', TMP.surfaces );
	//console.log( 'TMP.surfaceTypes', TMP.surfaceTypes );

	/*
	const surfacesString = TMP.surfaces.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=TMPdivSurfaceAttributeData.innerHTML=TMP.getSurfaceData(${item.index },"${ item.id}");
		title="${ item.id }" >
		${ item.name }</button> / ${ item.typeSource } from:
		 <mark>${ item.exposedToSun }</mark> to: exposedToSun="false"
		`
	).join("<br>");
	*/


	const options = TMP.surfaces.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );


	TMPsumSurfaces.innerHTML = `Surfaces ~ ${ TMP.surfaces.length.toLocaleString() } found ${ TMP.help }`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ TMP.surfaces.length.toLocaleString() } surface types found.</p>


		<p>
			<select id=TMPselSurfaces onclick=TMP.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=TMP.changeAllSurfaces(); >Fix all</button></p>

		<div id="TMPdivSurfaceData" >Click a surface name above to view its details and change its surface type. Tool tip shows the ID of the surface.</div>

		<!-- <p>Click 'Save file' button in File menu to save changes to a file.</p> -->

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



TMP.setSurfaceData = function( select ) {

	const surface = TMP.surfaces[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm = GSA.getSurfacesAttributesByIndex( select.selectedIndex, surface.name );

	TMPdivSurfaceData.innerHTML = htm;

};


TMP.changeAllSurfaces = function() {

	console.log( 'GBX.surfaces', GBX.surfaces );
	
}