/* globals */
// jshint esversion: 6
// jshint loopfunc: true

//"use strict";

var GXF = {
	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-08-29",
		description: "Parse gbXML surfaces",
		helpFile: "../js-gbxml/gxf-gbxml-fixer.md",
		license: "MIT License",
		urlSourceCode: "../js-gbxml/gxf-gbxml-fixer.js",
		version: "0.05.00-2gxfx"
	}

};




GXF.init = function( target ) {

	FOB.xhr.addEventListener( 'load', GXF.onXhrResponse, false );
	FOB.reader.addEventListener( 'load', GXF.onReaderResult, false );
	document.body.addEventListener( 'FOBonZipFileLoad', GXF.onFileZipLoad, false );
	document.body.addEventListener( 'onZipFileParse', GXF.onFileZipLoad, false );

	FOBdet.open = true;

};



GXF.onXhrResponse = function( event ) { GXF.parseFile( event.target.response ); };

GXF.onReaderResult = function() { GXF.parseFile( FOB.reader.result ); };

GXF.onFileZipLoad = function() { GXF.parseFile( FOB.text ); };


GXF.parseFile = function( gbxml )  {

	if ( !gbxml || gbxml.includes( "xmlns" ) === false ) { return; }

	divContents.innerHTML = `Working on ${ FOB.name }`;

	console.log( 'bytes', gbxml.length );

	gbxml = gbxml.charAt( 0 ) === "<" ? gbxml : gbxml.slice( 1 );

	console.log( 'gbxml', gbxml.slice( 0, 200 ) );

	GXF.gbxml = gbxml;
	//console.log( 'gbxml', gbxml );

	GXF.timeStart = performance.now();

	GXF.openings = GXF.gbxml.match( /<Opening(.*?)<\/Opening>/gis );

	GXF.openingsUpdated = 0;

	if ( GXF.openings ) {

		GXF.openings.forEach( opening => {

			const openingType = opening.match( /openingType="(.*?)"/i );

			const idRef = opening.match( /windowTypeIdRef="(.*?)"/i );

			if ( !idRef ) {

				const txt = `${ openingType[ 0 ] } windowTypeIdRef="${ openingType[ 1 ] }"`;
				//console.log( 'txt', txt );

				const newOpening = opening.replace( openingType[ 0 ], txt );
				//console.log( 'newOpening', newOpening );

				GXF.gbxml = GXF.gbxml.replace( opening, newOpening );
				//console.log( 'surface', surface );

				GXF.openingsUpdated ++;

			}

		} );
	}



	GXF.surfaces = GXF.gbxml.match( /<Surface(.*?)<\/Surface>/gis );

	GXF.surfacesUpdated = 0;

	GXF.surfaces.forEach( surface => {

		const type = surface.match( /surfaceType="(.*?)"/i );

		if ( type[ 1 ] !== "Air" && type[ 1 ] !== "Shade") {

			const construction = surface.match( /constructionIdRef="(.*?)"/i );

			if ( !construction ) {

				//console.log( 'construction', construction );

				const txt = `${ type[ 0 ] } constructionIdRef="${ type[ 1 ] }"`

				//console.log( 'txt', txt );

				const newSurface = surface.replace( type[ 0 ], txt )

				GXF.gbxml = GXF.gbxml.replace( surface, newSurface );

				GXF.surfacesUpdated ++;

			}

		} else {

			//console.log( '', type );
		}

	} );

	GXF.gbxml = GXF.gbxml.replace( /<\/Campus>/i, `</Campus> ${ constructions }` );

	GXF.gbxml = GXF.gbxml.replace( /encoding="UTF-16"/i, `encoding="UTF-8"` );


	divContents.innerHTML =
	`
		<h3>Construction data added</h3>

		<p>${ GXF.gbxml.length.toLocaleString() } bytes processed</p>

		<p>Openings found: ${ GXF.openings.length } - updated: ${ GXF.openingsUpdated }</p>

		<p>Surfaces found: ${ GXF.surfaces.length } - updated: ${ GXF.surfacesUpdated }</p>

		<p>File size: ${ GXF.gbxml.length.toLocaleString() }</p>

		<p>Ready to save. File menu » 'Save data to file' » Click 'Save to file' </p>


		<p>Happy simulating!</p>
	`;

	FSB.text = GXF.gbxml;

	console.log( 'FOB.text', FOB.text.length );

	FSB.fileName = FOB.fileName;

};


const constructions =

`

<Construction id="Ceiling">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-ceiling" />
	<Name>Ceiling</Name>
</Construction>

	<Construction id="ExteriorWall">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-exterior-wall" />
	<Name>Exterior Wall</Name>
</Construction>

<Construction id="InteriorFloor">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-interior-floor" />
	<Name>Interior Floor</Name>
</Construction>

<Construction id="InteriorWall">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-interior-wall" />
	<Name>Interior Wall</Name>
</Construction>

<Construction id="RaisedFloor">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-raised-floor" />
	<Name>Raised Floor</Name>
</Construction>

<Construction id="Roof">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-roof" />
	<Name>Roof</Name>
</Construction>

<Construction id="SlabOnGrade">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-slab-on-grade" />
	<Name>Slab on Grade</Name>
</Construction>

<Construction id="UndergroundSlab">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-underground-slab" />
	<Name>Slab on Grade</Name>
</Construction>

<Construction id="UndergroundWall">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-underground-wall" />
	<Name>Underground Wall</Name>
</Construction>


<Layer id="layer-ceiling">
	<MaterialId materialIdRef="material-ceiling" />
</Layer>
<Layer id="layer-exterior-wall">
	<MaterialId materialIdRef="material-exterior-wall" />
</Layer>
<Layer id="layer-interior-floor">
	<MaterialId materialIdRef="material-interior-floor" />
</Layer>
<Layer id="layer-interior-wall">
	<MaterialId materialIdRef="material-interior-wall" />
</Layer>
<Layer id="layer-raised-floor">
	<MaterialId materialIdRef="material-raised-floor" />
</Layer>
<Layer id="layer-roof">
	<MaterialId materialIdRef="material-roof" />
</Layer>
<Layer id="layer-slab-on-grade">
	<MaterialId materialIdRef="material-slab-on-grade" />
</Layer>
<Layer id="layer-underground-slab">
	<MaterialId materialIdRef="material-underground-slab" />
</Layer>
<Layer id="layer-underground-wall">
	<MaterialId materialIdRef="material-underground-wall" />
</Layer>


<Material id="material-ceiling">
	<Name>Ceiling</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-exterior-wall">
	<Name>Exterior Wall</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-interior-floor">
	<Name>Interior Floor</Name>
	<R-value unit="SquareMeterKPerW">0.267</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-interior-wall">
	<Name>Interior Wall</Name>
	<R-value unit="SquareMeterKPerW">0.267</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-raised-floor">
	<Name>Raised Floor</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-roof">
	<Name>Roof</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-slab-on-grade">
	<Name>Slab on Grade</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-underground-slab">
	<Name>Underground Slab</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-underground-wall">
	<Name>Underground Wall</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>



<WindowType id="FixedWindow">
<Name>WinInst : SIM_EXT_GLZ</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
<Glaze id="glaze-e0a05">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Solar" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
  <Emittance type="IntIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
<Gap id="GapIdentificationbbbec" gas="Argon">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
</Gap>
<Glaze id="GlazingIdentification423ab">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
</WindowType>

<WindowType id="OperableWindow">
<Name>WinInst : SIM_EXT_GLZ</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
<Glaze id="glaze-e0a05">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Solar" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
  <Emittance type="IntIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
<Gap id="GapIdentificationbbbec" gas="Argon">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
</Gap>
<Glaze id="GlazingIdentification423ab">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
</WindowType>


<WindowType id="OperableSkylight">
<Name>Skylight_ver00 : SIM_EXT_GLZ_SKY DF01</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
<Glaze id="glaze-295cf">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Solar" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
  <Emittance type="IntIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
<Gap id="GapIdentificationd3e73" gas="Argon">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
</Gap>
<Glaze id="GlazingIdentification46ee2">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
</WindowType>

<WindowType id="NonSlidingDoor">
<Name>Doors_ver01 : SIM_INT_SLD</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
<Glaze id="glaze-83731">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Solar" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
  <Emittance type="IntIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
<Gap id="GapIdentification622df" gas="Argon">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
</Gap>
<Glaze id="GlazingIdentificationc4103">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
</WindowType>

`;
