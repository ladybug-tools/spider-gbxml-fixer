# Fix Surface CAD Object ID Missing (FCIM) Read Me

<details open >

<summary>Concept</summary>

Assign an ID to surfaces with a missing CAD object ID

From [Schema GreenBuildingXML_Ver6.01.xsd]( http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html)

> The CADObjectId Element is used to map unique CAD object identifiers to gbXML elements

Lookup table for CAD IDs: https://github.com/ladybug-tools/spider-gbxml-fixer/blob/master/r0-4-0/gbx-gbxml-core.js#L103-L122

[Source code]( https://github.com/ladybug-tools/spider-gbxml-fixer/tree/master/r0-4-0/fcim-fix-cad-id-missing )
</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-05-17 ~ Add complete set of CAD IDs to GBX.cadIdsDefault

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-05-17 ~ Theo

* F - FCIM.html: Update to newer template / pass through Validator
* C - FCIM: Update readme
* F - FCIM.js: Add better IDs / work-in-progress
* r - FCIM.js: code cleanup / pass through jsHint


### 2019-05-16 ~ Theo

* F - First commit

</details>