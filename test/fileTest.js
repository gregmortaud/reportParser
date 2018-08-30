const assert = require('assert');
const fs = require('fs');
const ReportParser = require('../reportParser');
var should = require('chai').should();

describe('File testing', function () {
    const report_parser = new ReportParser();
    before(function () {
        fs.createReadStream(__dirname + '/utils/qa.reportTest1').pipe(fs.createWriteStream(__dirname + '/utils/qa.reportTmp'));
    });
    it('should return an error while reading file', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': false,
            'filename': 'test',
            'target_field': 'report_status'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            should.exist(err);
        });
    });
    it('should return value OK and err null', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': false,
            'filename': 'qa.reportTest1',
            'target_field': 'report_status'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal('OK', parsed_value);
            assert.equal(null, err);
        });
    });
    it('should return value null and err null', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': false,
            'filename': 'qa.reportTest2',
            'target_field': 'report_status'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal(null, parsed_value);
            assert.equal(null, err);
        });
    });
    it('should return value 395 and err null', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': false,
            'filename': 'qa.reportTest3',
            'target_field': 'data_points_checked'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal(395, parsed_value);
            assert.equal(null, err);
        });
    });
    it('should return value :43:32 and err null', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': false,
            'filename': 'qa.reportTest4',
            'target_field': 'data_testing'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal(':43:32', parsed_value);
            assert.equal(null, err);
        });
    });
    it('should return empty value and err null', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': false,
            'filename': 'qa.reportTest5',
            'target_field': ':data:test-'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal('', parsed_value);
            assert.equal(null, err);
        });
    });
    it('should return value 45', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': false,
            'filename': 'qa.reportTest6',
            'target_field': 'data_testing'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal('45', parsed_value);
            assert.equal(null, err);
            fs.access(__dirname + '/utils/qa.reportTest6', fs.constants.F_OK, (err) => {
                should.not.exist(err);
            });
        });
    });
    it('should delete the target file', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'remove_after_parse': true,
            'filename': 'qa.reportTmp',
            'target_field': 'mission_name'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal('Tesla Roadster', parsed_value);
            assert.equal(null, err);
            fs.access(__dirname +'/utils/qa.reportTmp', fs.constants.F_OK, (err) => {
                should.exist(err);
            });
        });
    });
});