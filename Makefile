all: countries.js

countries:
	git submodule init
	git submodule update

countries.js: countries
	python scripts/generate_countries_list.py countries/countries.json > countries.js

clean:
	rm -rf countries.js
	rm -rf countries
