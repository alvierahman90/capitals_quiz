all: countries.js flags

countries/countries.json: .SUBMODULES

countries.js: countries/countries.json .PHONY
	python3 scripts/generate_countries_list.py countries/countries.json > countries.js

flags: .SUBMODULES
	mkdir flags
	cp countries/data/*.svg flags

clean:
	rm -rf countries.js
	rm -rf countries

.SUBMODULES:
	git submodule init
	git submodule update

.PHONY:
