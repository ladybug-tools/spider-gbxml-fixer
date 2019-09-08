# Spider gbXML Fixer 'Atrax' Read Me

<details open>

<summary>Usage</summary>

1. Open a file using the left menu
2. Wait
3. Save fixed files using 'Save file as XML' in left menu

</details>
<details open>

<summary>Concept</summary>

Mission to augment gbXML files

* To augment any gbXML file so it has sufficient data points to to carry out - successfully and without error - a basic [OpenStudio 'Run Simulation']( https://nrel.github.io/OpenStudio-user-documentation/tutorials/running_your_simulation/ )
	* 2019-08-29 ~ Mission accomplished
* To further augment any gbXML file so has sufficient data to run any simulation in any app to the highest standards of that app
	* Work-in-progress

Mission to fix gbXML files

* To repair 'clerical' errors such as incorrect names for types etc
	* See 'Fixer menu' in [Spider gbXML Viewer 'Maevia']( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer )
	* A good number of checkers and fixers are working
* To repair '3D' errors - using ray casters etc - such as exterior wall surface types located inside a building
	* See 'Fixer 3D menu' in Maevia
	* Very early stage


Vision

* The journey between CAD design programs and energy analysis is transparent, seamless and accomplished in near real time
* Building are built to the highest energy efficiency standards of their day


Some fairly complex files seem to be making the trip to OpenStudio successfully

* [berlin-office-1-1k-surfaces.zip]( https://www.ladybug.tools/spider-gbxml-fixer/v-0-05-0/spider-gbxml-fixer-dev.html#https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/berlin-office-1-1k-surfaces.zip )
* [winchester-school-560-surfaces.zip]( https://www.ladybug.tools/spider-gbxml-fixer/v-0-05-0/spider-gbxml-fixer-dev.html#https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/winchester-school-560-surfaces.zip )
* [bristol-clifton-downs-broken.xml]( https://www.ladybug.tools/spider-gbxml-fixer/v-0-05-0/spider-gbxml-fixer-dev.html#https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/bristol-clifton-downs-broken.xml )
* london-office.xml
* london-royal-arsenal-woolwich.xml
* [Berlin Office - 2K surfaces ]( https://www.ladybug.tools/spider-gbxml-fixer/v-0-05-0/spider-gbxml-fixer-dev.html#https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/berlin-office-2-2k-surfaces.zip )


It can take a while for results to appear with large files. On large files you may have to click on the arrow in the debugger.


See current [construction-defaults.txt]( #https://www.ladybug.tools/spider-gbxml-fixer/assets/construction-defaults.txt )


</details>

<details>

<summary>To Do / Wish List</summary>

* 2019-08-29 ~ Theo ~ Bring in all the fixers in Spider gbXML Viewer Maevia and have them all fun and fiz with a single button click.
* 2019-08-29 ~ Theo ~ Provide notice that file already has construction information
* 2019-08-29 ~ Theo ~ Provide greater feedback

</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>


### 2019-08-29 ~ Theo

SGF Atrax v-0-05-03

* B: Deletes mystery character that's first in file


### 2019-08-29 ~ Theo

SGF Atrax v-0-05-02

* F: Working fairly well

### 2019-08-27 ~ Theo

SGF Atrax v-0-05-0

* First commit

</details>

***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src='https://ladybug.tools/artwork/icons_bugs/ico/spider.ico' height=24 > </a></center>

