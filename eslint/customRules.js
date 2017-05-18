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
        'one-var': [2, 'always'],
        'consistent-return': 2,
        'max-len': ['error', 120]
    }
};
