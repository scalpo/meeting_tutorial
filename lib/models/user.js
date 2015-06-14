'use strict';

var ns = require('../tools/ns');
var mysql = require('mysql');
var connectionInfo = require('../../dbconfig.json');
var connection = mysql.createConnection(connectionInfo);

var postProcess = function(data, cb) {
	//advanced data filtering/manipulation "before returning data"...
	ns.logger.info('SQL>' + JSON.stringify(data));	
	cb(null, data);
}

var parseOptions = function(options) {
	//options : paging, order, selection, advancedFilter
	options.page = options.page || -1;
	options.size = options.size || -1;
	
	return options;
};

exports.getById = function(options, cb) {
	var options = parseOptions(options);
	var sql = 'CALL api_get_group_by_id ("' + options.id + '");';
	ns.logger.info('SQL:' + sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) return cb(err, null)
		postProcess(rows[0], cb);
	});
};

exports.findByName = function(options, cb) {
	var options = parseOptions(options);

	var sql = 'CALL api_find_group ("' + options.name + '", ' + options.page + ', ' + options.size + ');';
	ns.logger.info('SQL:' + sql);

	connection.query(sql, function(err, rows, fields) {
		if (err) return cb(err, null);
		postProcess(rows[0], cb);
	});
};

exports.getByRole = function(options, cb) {
	var options = parseOptions(options);
	var sql = 'CALL api_get_user_by_role ("' + options.role + '", ' + options.page + ', ' + options.size + ');';
	ns.logger.info('SQL:' + sql);

	connection.query(sql, function(err, rows, fields) {
		if (err) return cb(err, null);
		postProcess(rows[0], cb);
	});
};

exports.getAll = function(options, cb) {
	var options = parseOptions(options);
	var sql = 'CALL api_get_group(' + options.page + ', ' + options.size + ');';
	ns.logger.info('SQL:' + sql);

	connection.query(sql, function(err, rows, fields) {
		if (err) return cb(err, null);
		postProcess(rows[0], cb);			//i think the LIMIT option cause an extra row to be returned...
	});
};

exports.hack = function(options, cb) {
	//options : unsafeStatement, skipPostProcessing
	connection.query(unsafeStatement, function(err, rows, fields) {
		if (err) return cb(err, null);
		postProcess(rows[0], cb);
	});
};