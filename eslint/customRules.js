'use strict';

module.exports = {
    rules: {
        'no-undef': 2,
        'no-undef-init': 2,
        'no-undefined': 0,
        'comma-dangle': [2, 'never'],
        'require-jsdoc': ['error', {
            'require': {
                'FunctionDeclaration': false,
                'MethodDefinition': false,
                'ClassDeclaration': false,
                'ArrowFunctionExpression': false
            }
        }],
        'one-var': ['error', 'never'],
        'consistent-return': 2
    }
};
