/* globals GBX */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const GGD = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-30",
	"description": "Gather data to be used by other modules and report statistics",
	"helpFile": "https://www.ladybug.tools/spider-gbxml-fixer/r0-4-0/ggd-get-gbxml-data/README.md",
	"version": "0.4.0-1"

};



GGD.getGbxmlData = function() {

	const htm =
		`
			<details ontoggle="GGDdivGbxmlData.innerHTML=GGD.getData(GBX.text);" >

				<summary id=GGDsumGetGbxmlData >Show gbXML file statistics
					<button id=butGGD class=butHelp onclick="MNU.setPopupShowHide(butGGD,GGD.helpFile);" >?</button>
				</summary>

				<div id=GGDdivGbxmlData ></div>

			</details>
		`;

	return htm;

};



GGD.getData = function( dataFile ) {

	const timeStart = performance.now();

	GBX.text = dataFile.replace( /\r\n|\n/g, '' );
	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'GBX.surfaces', GBX.surfaces );

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	GBX.spaces = GBX.text.match( reSpaces );
	//console.log( 'spaces', GBX.spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	GBX.storeys = GBX.text.match( reStoreys );
	GBX.storeys = Array.isArray( GBX.storeys ) ? GBX.storeys : [];
	//console.log( 'GBX.storeys', GBX.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	GBX.zones = GBX.text.match( reZones );
	GBX.zones = Array.isArray( GBX.zones ) ? GBX.zones : [];
	//console.log( 'GBX.zones', GBX.zones );

	const verticesCount = GBX.surfaces.map( surfaces => getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );

	const openings = GBX.text.match( /<Opening(.*?)<\/Opening>/gi );
	GBX.openings = openings || [];

	const constructions = GBX.text.match( /<Construction(.*?)<\/Construction>/gi );
	GBX.constructions = constructions || [];

	const materials = GBX.text.match( /<material(.*?)<\/material>/gi );
	GBX.materials = materials || [];

	const htm =
	`
		<p><i>gbXML elements statistics</i></p>
		<p>Surfaces: ${ GBX.surfaces.length.toLocaleString() } </p>
		<p>Spaces: ${ GBX.spaces.length.toLocaleString() } </p>
		<p>Storeys: ${ GBX.storeys.length.toLocaleString() } </p>
		<p>Zones: ${ GBX.zones.length.toLocaleString() } </p>
		<p>Openings in surfaces: ${ GBX.openings.length.toLocaleString() }</p>
		<p>Coordinates in surfaces: ${ count.toLocaleString() } </p>
		<p>Construction types: ${ GBX.constructions.length.toLocaleString() } </p>
		<p>Materials: ${ GBX.materials.length.toLocaleString() } </p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
	`;

	return htm;


		function getVertices( surface ) {

			const re = /<coordinate(.*?)<\/coordinate>/gi;
			const coordinatesText = surface.match( re );
			const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
				.map( txt => Number( txt ) );

			return coordinates;

		}

};
