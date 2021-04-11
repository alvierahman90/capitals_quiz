all: src/countries.js

src/countries.js:
	python scripts/generate_countries_list.py countries/countries.json > src/countries.js

clean:
	rm -rf src/countries.js
