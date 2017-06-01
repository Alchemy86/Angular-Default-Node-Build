'use strict';

function blueprintValidator(blueprint) {
    const errors = [];

    if (!blueprint) {
        errors.push(new TypeError('Manifest file does not exist or cannot be found'));
    }

    if (!blueprint.hasOwnProperty('css')) {
        errors.push(new TypeError('css section does not exist.'));
    }

    return errors;
}

module.exports = {
    validateJs: (blueprint) => {
        const errors = [];
        errors.push(blueprintValidator(blueprint));
        return {
            valid: errors.length === 0,
            errors
        };
    }
};
