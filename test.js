var assert = require('assert');
var ns = require('./');

describe('ns', function() {
  describe('normal', function() {
    it('should acccept `a`', function() {
      assert(ns('a').normal);
    });
    it('should acccept `a.b`', function() {
      assert(ns('a.b').normal);
    });
    it('should acccept `a.b.c`', function() {
      assert(ns('a.b.c').normal);
    });
    it('should acccept `local.oplog.$main`', function() {
      assert(ns('local.oplog.$main').normal);
    });
    it('should acccept `local.oplog.rs`', function() {
      assert(ns('local.oplog.rs').normal);
    });
    it('should not acccept `a.b.$c`', function() {
      assert.equal(ns('a.b.$c').normal, false);
    });
    it('should not acccept `a.b.$.c`', function() {
      assert.equal(ns('a.b.$.c').normal, false);
    });
  });

  it('should identify oplog namespaces', function() {
    assert.equal(ns('a').oplog, false);
    assert.equal(ns('a.b').oplog, false);
    assert(ns('local.oplog.rs').oplog);
    assert.equal(ns('local.oplog.foo').oplog, false);
    assert(ns('local.oplog.$main').oplog);
    assert.equal(ns('local.oplog.$foo').oplog, false);
  });

  it('should identify special namespaces', function() {
    it('should acccept `a.$.b`', function() {
      assert(ns('a.$.b').special);
    });
    it('should acccept `a.system.foo`', function() {
      assert(ns('a.system.foo').special);
    });
    it('should acccept `a.enxcol_.foo`', function() {
      assert(ns('a.enxcol_.foo').special);
    });
    it('should not accept `a.foo`', function() {
      assert.equal(ns('a.foo').special, false);
    });
    it('should not accept `a.systemfoo`', function() {
      assert.equal(ns('a.systemfoo').special, false);
    });
    it('should not accept `a.foo.system.bar`', function() {
      assert.equal(ns('a.foo.system.bar').special, false);
    });
  });

  describe('database name validation', function() {
    it('should accept `foo` as a valid database name', function() {
      assert.equal(ns('foo').validDatabaseName, true);
    });
    it('should not accept `foo/bar` as a valid database name', function() {
      assert.equal(ns('foo/bar').validDatabaseName, false);
    });
    it('should not accept `foo bar` as a valid database name', function() {
      assert.equal(ns('foo bar').validDatabaseName, false);
    });
    it('should not accept `foo\\bar` as a valid database name', function() {
      assert.equal(ns('foo\\bar').validDatabaseName, false);
    });
    it('should not accept `foo\"bar` as a valid database name', function() {
      assert.equal(ns('foo\"bar').validDatabaseName, false);
    });
    it.skip('should not accept `foo*bar` as a valid database name', function() {
      assert.equal(ns('foo*bar').validDatabaseName, false);
    });
    it.skip('should not accept `foo<bar` as a valid database name', function() {
      assert.equal(ns('foo<bar').validDatabaseName, false);
    });
    it.skip('should not accept `foo>bar` as a valid database name', function() {
      assert.equal(ns('foo>bar').validDatabaseName, false);
    });
    it.skip('should not accept `foo:bar` as a valid database name', function() {
      assert.equal(ns('foo:bar').validDatabaseName, false);
    });
    it.skip('should not accept `foo|bar` as a valid database name', function() {
      assert.equal(ns('foo|bar').validDatabaseName, false);
    });
    it.skip('should not accept `foo?bar` as a valid database name', function() {
      assert.equal(ns('foo?bar').validDatabaseName, false);
    });
  });

  describe('collection name validation', function() {
    it('should accept `a.b` as valid', function() {
      assert.equal(ns('a.b').validCollectionName, true);
    });
    it('should accept `a.b` as valid', function() {
      assert.equal(ns('a.b').validCollectionName, true);
    });
    it('should accept `a.b.` as valid', function() {
      assert.equal(ns('a.b.').validCollectionName, true);
    });
    it('should accept `a.b` as valid', function() {
      assert.equal(ns('a.b').validCollectionName, true);
    });
    it('should accept `a.b.` as valid', function() {
      assert.equal(ns('a.b.').validCollectionName, true);
    });
    it('should accept `a$b` as valid', function() {
      assert.equal(ns('a$b').validCollectionName, false);
    });

    it('should not accept `a.` as valid', function() {
      assert.equal(ns('a.').validCollectionName, false);
    });

    it('should not accept `$a` as valid', function() {
      assert.equal(ns('$a').validCollectionName, false);
    });

    it('should not accept `` as valid', function() {
      assert.equal(ns('').validCollectionName, false);
    });
  });

  describe('database hash', function() {
    it('should have the same value for `foo` and `foo`', function() {
      assert.equal(ns('foo').databaseHash, ns('foo').databaseHash);
    });
    it('should have the same value for `foo` and `foo.a`', function() {
      assert.equal(ns('foo').databaseHash, ns('foo.a').databaseHash);
    });
    it('should have the same value for `foo` and `foo.`', function() {
      assert.equal(ns('foo').databaseHash, ns('foo.').databaseHash);
    });
    it('should have the same value for `` and ``', function() {
      assert.equal(ns('').databaseHash, ns('').databaseHash);
    });
    it('should have the same value for `` and `.a`', function() {
      assert.equal(ns('').databaseHash, ns('.a').databaseHash);
    });
    it('should have the same value for `` and `.`', function() {
      assert.equal(ns('').databaseHash, ns('.').databaseHash);
    });
    it('should not have the same value for `foo` and `food`', function() {
      assert.notEqual(ns('foo').databaseHash, ns('food').databaseHash);
    });
    it('should not have the same value for `foo.` and `food`', function() {
      assert.notEqual(ns('foo.').databaseHash, ns('food').databaseHash);
    });
    it('should not have the same value for `foo.d` and `food`', function() {
      assert.notEqual(ns('foo.d').databaseHash, ns('food').databaseHash);
    });
  });

  it('should extract database names', function() {
    assert.equal(ns('foo').database, ns('foo').database);
    assert.equal(ns('foo').database, ns('foo.a').database);
    assert.equal(ns('foo.a').database, ns('foo.a').database);
    assert.equal(ns('foo.a').database, ns('foo.b').database);

    assert.equal(ns('').database, ns('').database);
    assert.equal(ns('').database, ns('.').database);
    assert.equal(ns('').database, ns('.x').database);

    assert.notEqual(ns('foo').database, ns('bar').database);
    assert.notEqual(ns('foo').database, ns('food').database);
    assert.notEqual(ns('foo.').database, ns('food').database);

    assert.notEqual(ns('').database, ns('x').database);
    assert.notEqual(ns('').database, ns('x.').database);
    assert.notEqual(ns('').database, ns('x.y').database);
    assert.notEqual(ns('.').database, ns('x').database);
    assert.notEqual(ns('.').database, ns('x.').database);
    assert.notEqual(ns('.').database, ns('x.y').database);

    assert.equal('foo', ns('foo.bar').database);
    assert.equal('foo', ns('foo').database);
    assert.equal('foo', ns('foo.bar').database);
    assert.equal('foo', ns('foo').database);

    assert.equal(ns('a.b').database, 'a');
    assert.equal(ns('a.b').collection, 'b');

    assert.equal(ns('a.b').database, 'a');
    assert.equal(ns('a.b.c').collection, 'b.c');

    assert.equal(ns('abc.').collection, '');
    assert.equal(ns('abc.').database, 'abc');
  });

  describe('sorting', function() {
    it('should sort them', function() {
      var names = ['admin', 'canadian-things', 'github', 'local', 'scope_stat', 'statsd', 'test'];
      var expect = ['canadian-things', 'github', 'scope_stat', 'statsd', 'test', 'admin', 'local'];
      ns.sort(names);
      assert.deepEqual(names, expect);
    });
  });
});
