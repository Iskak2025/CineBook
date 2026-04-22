#!/bin/sh
set -e

# Render provides INTERNAL_DB_URL in format: postgres://user:pass@host:port/db
if [ -n "$INTERNAL_DB_URL" ]; then
  # 1. Remove the 'postgres://' or 'postgresql://' prefix
  TEMP_URL=$(echo $INTERNAL_DB_URL | sed 's|^postgres://||' | sed 's|^postgresql://||')
  # 2. Remove the 'user:pass@' part if it exists
  # This regex looks for everything up to the '@' and removes it
  CLEAN_URL=$(echo $TEMP_URL | sed 's|^.*@||')
  # 3. Construct the final JDBC URL
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${CLEAN_URL}"
  echo "INFO: Formatted JDBC URL: jdbc:postgresql://(hidden-host-info)"
fi

echo "INFO: Starting CineBook backend..."
exec java -jar app.jar
