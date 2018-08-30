const assert = require('assert');
const reportParser = require('../reportParser');

describe('Config object testing', function () {
    const report_parser = new reportParser();
    it('should return that working_dir is missing', function () {
        const parser_config = {
            'filename': 'qa.report',
            'target_field': 'report_status'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal('key "working_dir" not found', err);
        });
    });
    it('should return that filename is missing', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'target_field': 'report_status'
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal('key "filename" not found', err);
        });
    });
    it('should return that target_field is missing', function () {
        const parser_config = {
            'working_dir': __dirname+'/utils',
            'filename': 'qa.report',
        };
        report_parser.parse(parser_config, (err, parsed_value) => {
            assert.equal('key "target_field" not found', err);
        });
    });
    it('should return that config object is missing', function () {
        report_parser.parse(null, (err, parsed_value) => {
            assert.equal('Error config object is missing', err);
        });
    });
});