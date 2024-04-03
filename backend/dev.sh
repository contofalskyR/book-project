mvn -f pom.xml clean package -DskipTests

java -jar -Dspring.profiles.active=local -Dspring.datasource.url=jdbc:postgresql://localhost:5433/book_project_db -Dspring.datasource.username=dbuser -Dspring.datasource.password=dbpassword -Dspring.devtools.restart.enabled=true -Dserver.port=8080 book-app/target/book-app-0.2.0.jar