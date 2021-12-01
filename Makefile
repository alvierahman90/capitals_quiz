all: src/countries.js

countries:
	git submodule init
	git submodule update

src/countries.js: countries
	python scripts/generate_countries_list.py countries/countries.json > src/countries.js

clean:
	rm -rf src/countries.js
	rm -rf countries
