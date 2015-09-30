.PHONY: test

build:
	- rm -r dist/
	mkdir dist
	jspm bundle-sfx app/main -o dist/app.js
	./node_modules/.bin/uglifyjs dist/app.js -o dist/app.min.js
	./node_modules/.bin/html-dist index.html --remove-all --minify --insert app.min.js -o dist/index.html

clean:
	- rm -r node_modules
	- rm -r src/jspm_packages
	- rm -r dist/
	- rm -r coverage/

install:
	npm install
	jspm install
	jspm install --dev

test:
	npm test
