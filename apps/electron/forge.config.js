const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
module.exports = {
    packagerConfig: {

    },
    makers: [
        {
            name: '@electron-forge/maker-zip'
        }
    ],
}