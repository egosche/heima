# Use the current mysql image as base
FROM mysql:latest

# Add the database
ENV MYSQL_DATABASE heimadb
ENV MYSQL_USER heimo
ENV MYSQL_PASSWORD Astral

# Copy scripts where they'll be executed during startup
COPY ./scripts /docker-entrypoint-initdb.d/
RUN chown -R mysql:mysql /docker-entrypoint-initdb.d/
