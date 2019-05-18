/* globals GBX, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


GCO = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-16",
	"description": "Check model offset from origin",
	"helpFile": "./r0-4-0/tmp-template/README.md",
	"release": "0.1.0"

};



GCO.getCheckOffset = function() {

	GCO.help = `<button id=butGCO class=butHelp onclick="MNU.setPopupShowHide(butGCO,GCO.helpFile);" >?</button>`;

	const htm =
		`
			<details ontoggle="GCOdivCheckOffset.innerHTML=GCO.getOffset();" >

				<summary id=GCOsumCheckOffset >Check project offset distance from origin
					${ GCO.help }
				</summary>

				<div id=GCOdivCheckOffset ></div>

			</details>

		`;

	return htm;

};


GCO.getOffset = function() {

	const timeStart = performance.now();
	let max = 0;

	GBX.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi )
		.forEach ( coordinate => {

			const numb = Number( coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );
			max = numb > max ? numb : max;

		} );


	GCOsumCheckOffset.innerHTML =
		`Check maximum offset distance from origin ~ <mark>${ max.toLocaleString() }</mark> units
			${ GCO.help }
		`;

	const offsetHtm =

	`
		<p><i>Largest distance - x, y, or z - from the origin at 0, 0, 0</i></p>

		<p>Largest coordinate found: ${ max.toLocaleString() }</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return offsetHtm;


};
