const fs = require('fs');

const error_log = async ( error, msg, path) => {

    var date = new Date(Date.now());

    console.log('================================================================');
    console.log(`| [ ${date.toString()} ] [ ${path} ]`);
    console.log(`| Error: ${error}`);
    console.log(`| ${msg}`);
    console.log('================================================================');

    const error_log = `
    ================================================================
    | [ ${date.toString()} ] [ ${path} ] 
    | [ Error: ${error} ] [ ${msg} ]
    ================================================================`;

    fs.appendFile('error_log.txt', error_log, (err) => {
    });

}

module.exports = error_log;