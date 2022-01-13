all: countries.js

countries/countries.json: .SUBMODULES

countries.js: countries/countries.json
	python3 scripts/generate_countries_list.py countries/countries.json > countries.js

clean:
	rm -rf countries.js
	rm -rf countries

.SUBMODULES:
	git submodule init
	git submodule update

