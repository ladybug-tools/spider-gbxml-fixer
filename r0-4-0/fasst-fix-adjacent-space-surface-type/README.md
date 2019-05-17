# [Fix Adjacent Space Surface Type (FASST) Read Me]( #xxxxx/README.md )

<details open>

<summary>Concept</summary>

* Identify surfaces with two (or more) adjacent spaces and adjacent spaces have different space IDs
* Fixes
	* If tilt equals 90: update surface type to "InteriorWall", set exposedToSun to false, update CADObjectID to "Spider Fixer update: Interior Wall"
	* If tilt not equal to 90: TBD

</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-05-12 ~ Add fixes if tilt not equal 90

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-05-16 ~ Theo

* F - FASST.js: Add textarea display new data
* R - FASST.js: Separate fixSurface and fixAll

### 2019-05-14 ~ Theo

* F - FASST.js: Add button to fix single surface
* B - FASST.js: fix popup help links

### 2019-05-12 ~ Theo

* F - First commit

</details>