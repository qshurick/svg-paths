run:
	docker-compose run --rm app

shell:
	docker-compose run --rm app ash

test:
	docker-compose run --rm app node /app/tests/test.js
