/* globals GBX, OCVsumOpeningsVertices */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const OCV = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-21",
	"description": "Openings: check openings with more than four vertices",
	"helpFile": "./r0-4-0/ocv-openings-check-vertices/README.md",
	"release": "0.4.0-2"

};



OCV.getOpeningsCheckVertices = function() {

	OCV.help = `<button id=butOCV class=butHelp onclick="MNU.setPopupShowHide(butOCV,OCV.helpFile);" >?</button>`;

	const htm =
		`
			<details ontoggle="OCVdivOpeningsVertices.innerHTML=OCV.getOpeningsVertices();" >

				<summary id=OCVsumOpeningsVertices >Check for openings with more than four vertices
					${ OCV.help }
				</summary>

				<div id=OCVdivOpeningsVertices ></div>

			</details>

		`;

	return htm;

};


OCV.getOpeningsVertices = function() {

	OCV.ids = [];

	GBX.openings.map( opening => {

		const planar = opening.match(  /<PlanarGeometry(.*?)<\/PlanarGeometry>/gi )[ 0 ];
		//console.log( 'planar', planar );

		OCV.vertices = getVertices( planar );
		//console.log( 'vertices', vertices.length );

		if ( OCV.vertices.length > 12 ) {

			const id = opening.match(  / id="(.*?)"/i )[ 1 ];
			OCV.ids.push( id );

		}

	} );

	const tag = OCV.ids.length === 0 ? "span" : "mark";

	OCVsumOpeningsVertices.innerHTML = `Check for openings with more than four vertices ~ <${ tag }>${ OCV.ids.length }</${ tag }> found ${ OCV.help }`;

	const htm =
		`
			<p>
				Number of openings with greater then four vertices: ${ OCV.ids.length }
			</p>

			<p>
				IDs: ${ OCV.ids }
			</p>
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
