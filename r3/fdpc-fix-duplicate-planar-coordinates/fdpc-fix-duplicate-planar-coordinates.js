
// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FDPCsumDuplicatePlanar, FDPCdivDuplData, FDPCdivDuplicatePlanar */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const FDPC = { "release": "0.3.0", "date": "2019-04-03" };

FDPC.description = `Identify two or more surfaces with the same planar geometry coordinates`;

FDPC.currentStatus =
	`
		<h3>Fix Surfaces with duplicate planar coordinates (FDPC) R${ FDPC.release } ~ ${ FDPC.date }</h3>

		<p>
			${ FDPC.description }.
		</p>

		<details open>
			<summary>Issues</summary>
			<ul>
				<li></li>
			</ul>
		</details>

		<p>
			Wish List / To do:<br>
			<ul>
				<li>2019-03-29 ~ Check for openings</li>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface to delete n the select type list box</li>
			</ul>
		</p>

		<details>
			<summary>Change log</summary>

			<ul>
				<li>2019-04-18 ~ F - 'Fix all' working / waiting for testing.</li>
				<li>2019-04-03 ~ First commit</li>
			</ul>
		</details>
	`;



FDPC.getFixDuplicatePlanarCoordinates = function() {

	const htm =
		`
			<details id=FDPCdet  ontoggle="FDPCdivDuplicatePlanar.innerHTML=FDPC.getDuplicatePlanarCoordinates();" >

				<summary id=FDPCsumDuplicatePlanar class=sumHeader ><mark>Fix surfaces with duplicate planar coordinates</mark>
					<a id=FDPCSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FDPCSum,FDPC.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=FDPCdivDuplicatePlanar ></div>

			</details>

		`;

	return htm;

};



FDPC.getDuplicatePlanarCoordinates = function() {

	const timeStart = performance.now();
	const planes = [];

	for ( let surface of SGF.surfaces ) {

		const arr = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ );

		if ( arr ) { planes.push( arr[ 1 ] ); }

	}

	FDPC.duplicates = [];

	planes.forEach( ( plane1, index1 ) => {

		const planesRemainder = planes.slice( index1 + 1 );

		planesRemainder.forEach( ( plane2, index2 ) => {

			if ( plane1 === plane2 ) {

				FDPC.duplicates.push( [ index1, ( index1 + index2 + 1) ] );
			}

		} );

	} );
	//console.log( 'FDPC.duplicates', FDPC.duplicates );

	const options = FDPC.duplicates.map( ( arr, count ) => arr.map( index => {

		const surface = SGF.surfaces[ index ];
		return `<option value="${ arr.join() }" style=background-color:${ count % 2 === 0 ? "#eee" : "" };
			title="${ surface.match( / id="(.*?)"/i )[ 1 ] }" >
			${ count + 1 } ${ surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }
		</option>`;

		} )

	);
	//console.log( 'options', options );

	const help = `<a id=fdpcHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fdpcHelp,FDPC.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FDPCsumDuplicatePlanar.innerHTML =
		`Fix surfaces with duplicate planar coordinates ~ ${ FDPC.duplicates.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
			<p><i>${ FDPC.description }</i></p>

			<p>
				${ FDPC.duplicates.length.toLocaleString() } sets duplicates found.  See tool tips for surface ID.<br>
			</p>

			<p>
				<select onclick=FDPC.setDuplicateData(this); style=min-width:8rem; size=${ FDPC.duplicates.length >= 5 &&  FDPC.duplicates.length <= 20 ? 2 * FDPC.duplicates.length : 10 } >${ options }</select>
			</p>

			<div id="FDPCdivDuplData" >Click a surface ID above to view its details and delete if necessary</div>

			<p><button onclick=FDPC.deleteDuplicateSurfaces(); >Fix all</button></p>

			<p>
				Click 'Save file' button in File Menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return htm;

};



FDPC.setDuplicateData = function( select ) {
	//console.log( '', select.selectedOptions );

	const items = select.value.split( ",");
	//console.log( '', items );

	surfaceText1 = SGF.surfaces[ items[ 0 ] ];
	const id1 = surfaceText1.match( / id="(.*?)"/i )[ 1 ];

	surfaceText2 = SGF.surfaces[ items[ 1 ] ];
	const id2 = surfaceText2.match( / id="(.*?)"/i )[ 1 ];

	console.log( '', surfaceText1.length, surfaceText2.length );

	const htm =
		`
			${ GSA.getSurfacesAttributesByIndex( items[ 0 ], id1 ) }

			<p>
				Number of characters in surface text: ${ surfaceText1.length.toLocaleString() }
			</p>

			<p>
				<button onclick=FDPC.deleteSelectedSurface(${ items[ 0 ] }); >delete</button>

			</p>

			${ GSA.getSurfacesAttributesByIndex( items[ 1 ], id2) }

			<p>
				Number of characters in surface text: ${ surfaceText2.length.toLocaleString() }
			</p>

			<p>
				<button onclick=FDPC.deleteSelectedSurface(${ items[ 1 ] }); >Delete</button>
			</p>

			<hr>
		`;

	FDPCdivDuplData.innerHTML= htm;

	const details = FDPCdivDuplData.querySelectorAll( 'details' );
	details[ 1 ].open = true;
	details[ 5 ].open = true;

};



FDPC.deleteSelectedSurface = function( index ) {
	//console.log( 'select.value', select );

	const result = confirm( `OK to delete surface?` );

	if ( result === false ) { return; }

	const surfaceText = SGF.surfaces[ index ];

	SGF.text = SGF.text.replace( surfaceText, '' );
	//console.log( 'len2', SGF.text.length );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'SGF.surfaces', SGF.surfaces.length );

	FDPCdet.open = false;

	FDPCdivGetDuplicatePlanar.innerHTML = FDPC.getFixDuplicatePlanarCoordinates();

};



FDPC.deleteDuplicateSurfaces = function() {
	//console.log( 'select.value', select );

	const result = confirm( `OK to delete second surface\nwhen both surfaces have exactly the same character count\nor second surface contains the word "duplicate"?` );

	if ( result === false ) { return; }

	for ( items of FDPC.duplicates ) {

		surfaceText1 = SGF.surfaces[ items[ 0 ] ];

		surfaceText2 = SGF.surfaces[ items[ 1 ] ];

		if ( surfaceText1.length === surfaceText2.length || surfaceText2.includes( "duplicate" ) ) {

			SGF.text = SGF.text.replace( surfaceText2, '' );

		};

	}

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'SGF.surfaces', SGF.surfaces.length );

	FDPCdet.open = false;

	FDPCdivGetDuplicatePlanar.innerHTML = FDPC.getFixDuplicatePlanarCoordinates();

};