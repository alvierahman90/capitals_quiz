all: src/countries.json

src/countries.json:
	python scripts/generate_countries_list.py countries/countries.json > src/countries.json

clean:
	rm -rf src/countries.json
