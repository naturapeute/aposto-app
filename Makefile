deploy:
	npm run build && \
	cd public && \
	git add . && \
	git commit -am "New build" && \
	git push -f && \
	cd -
