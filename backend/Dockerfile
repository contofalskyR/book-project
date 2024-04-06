# Specify the platform for the builder stage
FROM --platform=linux/arm64 maven:3.8.3-openjdk-11-slim AS builder
WORKDIR /app
COPY . /app
ARG mvn_arg="clean package -DskipTests"
RUN --mount=type=cache,target=/root/.m2 mvn -f /app/pom.xml $mvn_arg

# Specify the platform for the final image
FROM --platform=linux/arm64 openjdk:11-jre-slim-buster
ARG JAR_FILE=/app/book-app/target/book-app-*.jar
ARG PROFILE="local"
ENV profile_env ${PROFILE}

ARG DB_HOSTNAME
ENV db_hostname_env ${DB_HOSTNAME}
ARG DB_PORT
ENV db_port_env ${DB_PORT}
ARG DB_NAME
ENV db_name_env ${DB_NAME}
ARG DB_USERNAME
ENV db_username_env ${DB_USERNAME}
ARG DB_PASSWORD
ENV db_password_env ${DB_PASSWORD}

COPY --from=builder $JAR_FILE /opt/bookapp/app.jar
WORKDIR /opt/bookapp/

RUN addgroup --system myuser && adduser --system --ingroup myuser myuser
USER myuser
EXPOSE 8080
CMD ["java", "-jar", "-Dspring.profiles.active=${profile_env}", "-Dspring.datasource.url=jdbc:postgresql://${db_hostname_env}:5432/${db_name_env}", "-Dspring.datasource.username=${db_username_env}", "-Dspring.datasource.password=${db_password_env}", "app.jar"]
