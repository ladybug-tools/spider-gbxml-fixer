//Copyright 2019 Ladybug Tools authors. MIT License
/* globals FIL, divContents, GGD, GCS, OCV, GSAh1FileName, */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const GSA = { release: "3.0.0", date: "2019-04-11 ~ " };

GSA.description = `Display all possible data for a surface`;


GSA.currentStatus =
	`
		<h3>Get Surface Attributes(GSA) ${ GSA.release } - ${ GSA.date }</h3>

		<p>${ GSA.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r3/gsa-get-surface-attributes.js" target="_blank">
			gsa-get-surface-attributes.js source code</a>
		</p>
		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li></li>
			</ul>
		</details>
		<details>
			<summary>Change log</summary>
			<ul>
  				<li>2019-04-11 ~ F - R3 First commit</li>
			</ul>
		</details>
	`;



GSA.getSurfacesAttributesByIndex = function( indexes, id = 1 ) {

	indexes = Array.isArray( indexes ) ? indexes : [ indexes ];
	//console.log( 'indexes', indexes );

	const parser = new DOMParser();

	const htmArray = indexes.map( ( index ) => {

		const surfaceXml = parser.parseFromString( SGF.surfaces[ index ], "application/xml" ).documentElement;
		//console.log( 'surfaceXml', surfaceXml );

		const htmAttributes = GSA.getSurfaceAttributes( surfaceXml, id, index );
		//console.log( 'htmAttributes', htmAttributes );

		return htmAttributes;


	} );

	return htmArray;

};



GSA.getSurfaceAttributes = function( surfaceXml, id, index ) {
	//console.log( 'surfaceXml', surfaceXml );

	const htmSurface = GSA.getAttributesHtml( surfaceXml );
	const htmAdjacentSpace = GSA.getAttributesAdjacentSpace( surfaceXml );
	const htmPlanarGeometry = GSA.getAttributesPlanarGeometry( surfaceXml );

	const rect = surfaceXml.getElementsByTagName( "RectangularGeometry" )[ 0 ];
	//console.log( '', rect );
	const htmRectangularGeometry = GSA.getAttributesHtml( rect );

	const htm =
	`
		<div><b>Selected Surface: ${ id }</b><br>Attributes:</div>

		${ htmSurface }

		<details>
			<summary> AdjacentSpace</summary>
			${ htmAdjacentSpace }
		</details>

		<details>
			<summary> Planar Geometry </summary>
			${ htmPlanarGeometry }
		</details>

		<details>
			<summary> Rectangular Geometry </summary>
			<div>${ htmRectangularGeometry } </div>
		</details>

		<details>
			<summary> gbXML Text </summary>
			<textarea style=height:15rem;width:100% >${ SGF.surfaces[ index ] } </textarea>
		</details>

	`;

	return htm;

};



GSA.getAttributesHtml = function( obj ) {
	//console.log( 'obj', obj );

	let htm ='';

	if ( !obj.attributes ) { return htm; }  //////////  make more forgiving

	for ( let attribute of obj.attributes ) {

		htm +=
		`<div>
			<span class=attributeTitle >${ attribute.name }</span>:
			<span class=attributeValue >${ attribute.value }</span>
		</div>`;

		if ( attribute.name === "constructionIdRef" ) {

			//console.log( 'attribute.value', attribute.value );

			//constructions = GSA.text.match( /<Construction(.*?)<\/Construction>/gi );

			// silly way of doing things, but it's a start
			const parser = new DOMParser();
			const campusXml = parser.parseFromString( GSA.text, "application/xml").documentElement;
			//GSA.campusXml = campusXml;
			//console.log( 'campusXml', campusXml.attributes );

			const constructions = Array.from( campusXml.getElementsByTagName( 'Construction' ) );
			const construction = constructions.find( item => item.id === attribute.value );
			//console.log( 'construction', construction);

			const xmlText = new XMLSerializer().serializeToString( construction );
			//console.log( 'xmlText', xmlText );

			htm += `<textarea style=height:5rem;width:100%; >${ xmlText }</textarea>`;

		}

	}

	const nodes = obj.childNodes;
	const numbers = ['Azimuth', 'Height', 'Tilt', 'Width' ];

	for ( let node of nodes ) {
		//console.log( 'node', node);

		if ( node.nodeName !== "#text" ) {
			//console.log( 'node', node.nodeName, node );

			if ( node.childElementCount > 0 ) {
				//console.log( 'node', node );

			} else if ( node.innerHTML ) {
				//console.log( 'node', node );

				const value = numbers.includes( node.nodeName ) ? Number( node.innerHTML ).toLocaleString() : node.innerHTML;

				htm +=

				`<div>
					<span class=attributeTitle >${ node.nodeName }</span>:
					<span class=attributeValue >${ value }</span>
				</div>`;

			}

		} else {

			//console.log( 'node', node );

		}

	}

	return htm;

};



GSA.getAttributesAdjacentSpace = function( surfaceXml ){

	const adjacentSpaceId = surfaceXml.getElementsByTagName( "AdjacentSpaceId" );
	//console.log( 'adjacentSpaceId', adjacentSpaceId );
	//a = adjacentSpaceId

	let htm;

	if ( adjacentSpaceId.length === 0 ) {

		GSA.adjacentSpaceIds = [];
		GSA.storey = '';

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		const spaceId2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		const spaceText1 = GSA.spaces.find( item => item.includes( spaceId1 ) );
		//console.log( 'spaceText1', spaceText1 );
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		const spaceText2 = GSA.spaces.find( item => item.includes( spaceId2 ) );
		//console.log( 'spaceText2', spaceText2 );
		const spaceName2 = spaceText2.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		GSA.adjacentSpaceIds = [ spaceId1, spaceId2 ];

		GSA.setAttributesStoreyAndZone( spaceId2 );

		htm =
		`<div>
				<span class=attributeTitle >spaceIdRef 1:</span>
				<span class=attributeValue >${ spaceId1 } / ${ spaceName1 }</span>

			</div>
			<div>
				<span class=attributeTitle >spaceIdRef 2:</span>
				<span class=attributeValue >${ spaceId2 } / ${ spaceName2 }</span>
			</div>
		`;

	} else {
		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		GSA.adjacentSpaceIds = [ spaceId ];

		const spaceText1 = SGF.spaces.find( item => item.includes( spaceId ) );
		//console.log( 'spaceText1', spaceText1 );
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		GSA.setAttributesStoreyAndZone( spaceId );

		htm =
		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ spaceId } / ${ spaceName1 }</span>
		</div>`;

	}

	return htm;

};



GSA.setAttributesStoreyAndZone = function( spaceId ) {

	const spaceText = SGF.spaces.find( item => item.includes( spaceId ) );
	//console.log( 'spaceText', spaceText );

	const storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ );
	//console.log( 'storeyId', GSA.storeyId[ 1 ] );

	GSA.storeyId = storeyId ? storeyId[ 1 ] : [];
	//console.log( 'storeyId', GSA.storeyId[ 1 ] );

	const storeyText = SGF.storeys.find( item => item.includes( GSA.storeyId ) );
	//console.log( 'storeyText', storeyText );

	const storeyName = storeyText ? storeyText.match ( '<Name>(.*?)</Name>' ) : "";

	GSA.storeyName = storeyName ? storeyName[ 1 ] : "no storey name in file";
	//console.log( 'GSA.storeyName', GSA.storeyName );

	GSA.zoneId = spaceText.match ( /zoneIdRef="(.*?)"/ );

	if ( GSA.zoneId ) {

		GSA.zoneId = GSA.zoneId[ 1 ];
		//console.log( 'zoneId', GSA.zoneId[ 1 ] );

		const zoneText = SGF.zones.find( item => item.includes( GSA.zoneId ) );
		//console.log( 'storeyText', zoneText );

		GSA.zoneName = zoneText.match ( '<Name>(.*?)</Name>' )[ 1 ];
		//console.log( 'GSA.zoneName', GSA.zoneName );

	} else {

		GSA.zoneName = "None";

	}


};



GSA.getAttributesPlanarGeometry = function( surfaceXml ) {

	const plane = surfaceXml.getElementsByTagName( 'PlanarGeometry' );

	const points = plane[ 0 ].getElementsByTagName( 'Coordinate' );
	//console.log( 'points', points );

	let htm = '';
	for ( let i = 0; i < points.length; ) {

		//console.log( 'points', points );

		htm +=
		`
			<div><span class=attributeTitle >CartesianPoint:</span></div>
			&nbsp;
			<span class=attributeTitle >x:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >y:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >z:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span><br>
		`;

	}

	return htm;

};