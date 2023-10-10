db_up:
	# Docker compose start running in a detached mode
	docker-compose up -d
p_mg:
	# Command to run prisma migrate
	npx prisma migrate dev

prisma_studio:
	npx prisma studio
