const fs        = require('fs');
const async     = require('async');
const readline  = require('readline');

const parserKeys = {
    'working_dir': 'key "working_dir" not found',
    'filename': 'key "filename" not found',
    'target_field': 'key "target_field" not found'
};

class ReportParser {
    parse(config, callback) {
        async.waterfall([
            function (callbackWaterfall) {
                if (config === null) {
                    return callbackWaterfall('Error config object is missing');
                }
                async.forEachOf(parserKeys, (value, key, callback) => {
                    if (!config.hasOwnProperty(key)) {
                        return callbackWaterfall(value);
                    }
                    callback();
                }, err => {
                    if (err) {
                        return callbackWaterfall(err);
                    }
                    callbackWaterfall(null);
                });
            },
            function (callbackWaterfall) {
                var valueFinal = null;
                const lengthTargetField = config['target_field'].length;
                const readableStream = fs.createReadStream(config['working_dir'] + '/' + config['filename']);
                const rdLine = readline.createInterface({
                    input: readableStream
                });

                rdLine.on('line', (line) => {
                    let result = line.substring(0, lengthTargetField);
                    result = result.trim();
                    if (result.indexOf(config['target_field']) !== -1) {
                        let value = line.substring(lengthTargetField);
                        let indexOfResult = value.indexOf(':');
                        if (indexOfResult !== -1) {
                            value = value.substring(indexOfResult + 1);
                        }
                        valueFinal = value.trim();
                        readableStream.destroy();
                        rdLine.close();
                    }
                });

                rdLine.on('close', () => {
                    if (config.hasOwnProperty('remove_after_parse') && config['remove_after_parse'] == true) {
                        fs.unlink(config['working_dir'] + '/' + config['filename'], (err) => {
                            if (err) {
                                return callbackWaterfall(err, valueFinal);
                            }
                        })
                    }
                    return callbackWaterfall(null, valueFinal);
                });

                readableStream.on('error', () => {
                    return callbackWaterfall('Error while reading file', null);
                });

            }
        ], function (error, success) {
            callback(error, success);
        });
    };
};

module.exports = ReportParser;