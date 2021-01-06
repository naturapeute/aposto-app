deploy:
	npm run build && \
	cd public && \
	git add build && \
	git commit build -m "New build" && \
	git push && \
	cd -
