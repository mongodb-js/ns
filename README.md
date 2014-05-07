# mongodb-ns

[![build status](https://secure.travis-ci.org/imlucas/mongodb-ns.png)](http://travis-ci.org/imlucas/mongodb-ns)

Handle dem namespaces like the kernel do.

```
var ns = require('mongodb-ns');

var bacon = ns('canadian-things.songs-aboot-bacon');
console.log(bacon.toString(), bacon);

// knows how to handle graphite-style metrics to boot
var maple = ns('canadian-things.maple-based-fabrics.read.time');
console.log(maple.toString(), maple);
```

will output

```
canadian-things.songs-aboot-bacon {
  ns: 'canadian-things.songs-aboot-bacon',
  dotIndex: 15,
  database: 'canadian-things',
  collection: 'songs-aboot-bacon',
  system: false,
  oplog: false,
  command: false,
  special: false,
  normal: true,
  validDatabaseName: true,
  validCollectionName: true,
  databaseHash: 23620443216
}

canadian-things.maple-based-fabrics.read.time {
  ns: 'canadian-things.maple-based-fabrics.read.time',
  dotIndex: 15,
  database: 'canadian-things',
  collection: 'maple-based-fabrics',
  metric: 'read',
  metricType: 'time',
  system: false,
  oplog: false,
  command: false,
  special: false,
  normal: true,
  validDatabaseName: true,
  validCollectionName: true,
  databaseHash: 23620443216
}
```


## license

MIT
