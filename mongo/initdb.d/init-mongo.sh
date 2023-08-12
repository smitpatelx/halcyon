set -e

mongo <<EOF
use $MONGO_INITDB_DATABASE

db.createUser({
  user: '$MONGO_USER',
  pwd: '$MONGO_PASS',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_DB'
  }]
})
EOF