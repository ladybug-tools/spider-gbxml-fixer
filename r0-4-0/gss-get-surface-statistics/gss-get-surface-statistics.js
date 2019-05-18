/* globals GBX, GSA, GSSsumSurfaces */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const GSS = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-10",
	"description": "template for checking surfaces",
	"helpFile": "./r0-4-0/gss-get-surface-statistics/README.md",
	"release": "0.4.1"

};


GSS.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];



GSS.getMenuSurfaceStatistics = function() {

	GSS.help = `<button id=butGSS class=butHelp onclick="MNU.setPopupShowHide(butGSS,GSS.helpFile);" >?</button>`;


	const htm =
		`
			<details ontoggle="GSSdivSurface.innerHTML=GSS.getSurfaces();" >

				<summary id=GSSsumSurfaces >Show surfaces statistics
					${ GSS.help }
				</summary>

				<div id=GSSdivSurface ></div>

				<div id=GSSdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



GSS.getSurfaces = function() {

	const timeStart = performance.now();

	const matches = GBX.text.match( /surfaceType="(.*?)"/gi );
	//console.log( 'matches', matches );

	const items = matches.map( item => item.slice( 13, -1 ) );
	//console.log( 'items', items );

	const types = [...new Set( items )];
	//console.log( 'types', types );


	matchesId = GBX.text.match( /<CADObjectId>(.*?)\[/gi );
	//console.log( 'matchesId', matchesId );

	itemsId = matchesId.slice( 1 ).map( item => item.slice( 13, -2 ) );
	//console.log( 'itemsId', itemsId );

	const cadIds = [...new Set( itemsId ) ].sort();
	//console.log( 'cadIds', cadIds );

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ types.length } surface types found: <br> ${ types.join( "<br>" ) } </p>

		<p>${ cadIds.length } CAD Object IDs found: <br> ${ cadIds.join( "<br>" ) } </p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;


};



GSS.setSurfaceData = function( select ) {

	const surface = GSS.surfaces[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm = GSA.getSurfacesAttributesByIndex( select.selectedIndex, surface.name );

	GSSdivSurfaceData.innerHTML = htm;

};


GSS.changeAllSurfaces = function() {

	console.log( 'GBX.surfaces', GBX.surfaces );

}