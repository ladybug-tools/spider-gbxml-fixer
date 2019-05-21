/* globals GBX, GCS, GCSsumGetCheckStrings */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


GCS = {
	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"description": "Check and report on elements with inappropriate null, zero or blank values values",
	"helpFile": "./r0-4-0/gcs-get-check-strings/README.md",
	"version": "0.4.0-4",
	"date": "2019-05-21"
};



GCS.getCheckStrings = function() {

	GCS.help = `<button id=butTMP class=butHelp onclick="MNU.setPopupShowHide(butTMP,GCS.helpFile);" >?</button>`;

	const htm =
		`
			<details ontoggle="GCSdivCheckStrings.innerHTML=GCS.getData();" >

				<summary id=GCSsumGetCheckStrings >Check for valid text and numbers
					${ GCS.help }
				</summary>

				<div id=GCSdivCheckStrings ></div>

			</details>

		`;

	return htm;

};



GCS.getData = function() {

	const timeStart = performance.now();
	let htm = "";

	if ( GBX.text.includes( 'utf-16' ) ) {

		htm +=
		`
			<p>
				File is utf-16 and supports double byte characters.
				The file is twice the size of a utf-8 file. This may be unnecessary.
			</p>

		`;
	}

	let area =  GBX.text.match( /<Area(> <|><|>0<?)\/Area>/gi );
	area = area ? area.length : 0;
	//console.log( 'area', area );

	htm +=
		`
			<p>
				Area = 0 or space or null: ${ area } found
			</p>
		`;


	let vol = GBX.text.match( /<volume(> <|><|>0<?)\/volume>/gi );
	vol = vol ? vol.length : 0;

	htm  +=
		`
			<p>
				Volume = 0 or space or null: ${ vol } found
			</p>
		`;

	let string = GBX.text.match( /""/gi );
	string = string ? string.length : 0;

	htm  +=
		`
			<p>
				String = "": ${ string } found
			</p>
		`;

	const errors = area + vol + string;
	//console.log( 'errors ', errors );

	const tag = errors === 0 ? "span" : "mark";
	
	GCSsumGetCheckStrings.innerHTML =
		`Check for valid text and numbers ~ <${ tag }>${ errors }</${ tag }> errors found ${ GCS.help }`;

	const generalHtm =
		`
			<p><i>check for elements with no values</i></p>

			<p>General Check - ${ errors } found</p>

			<p>${ htm }</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return generalHtm;

};
