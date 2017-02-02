import { RuleTester, Failure, Position } from './ruleTester';
const ruleTester = new RuleTester('space-in-parens');
const MISSING_SPACE_ERROR = 'there must be a space inside this paren.';
const REJECTED_SPACE_ERROR = 'there should be no spaces inside this paren.';

function expecting( errors  ): Failure[] {
    return errors.map((err) => {
        if ( err.message && err.column ) {
            return {
                failure: err.message,
                startPosition: new Position(err.line, err.column),
                endPosition: new Position(err.line, err.column)
            };
        }
    });
}

ruleTester.addTestGroup('valid', 'should pass valid', [
    { code: 'foo()', options: ['always'] },
    { code: 'foo( bar )', options: ['always'] },
    { code: 'foo\n(\nbar\n)\n', options: ['always'] },
    { code: 'foo\n(  \nbar\n )\n', options: ['always'] },
    { code: 'foo\n(\n bar  \n)\n', options: ['always'] },
    { code: 'foo\n( \n  bar \n  )\n', options: ['always'] },
    { code: 'foo\n(\t\nbar\n)', options: ['always'] },
    { code: '\tfoo(\n\t\tbar\n\t)', options: ['always'] },
    { code: '\tfoo\n(\t\n\t\tbar\t\n\t)', options: ['always'] },
    { code: 'var x = ( 1 + 2 ) * 3', options: ['always'] },
    { code: 'var x = `foo(bar)`', options: ['always'] },
    { code: 'var x = "bar( baz )"', options: ['always'] },
    { code: 'var foo = `(bar)`;', options: ['always'] },
    { code: 'var foo = `(bar ${baz})`;', options: ['always'] },
    { code: 'var foo = `(bar ${( 1 + 2 )})`;', options: ['always'] },
    { code: 'bar()', options: ['never'] },
    { code: 'bar(baz)', options: ['never'] },
    { code: 'var x = (4 + 5) * 6', options: ['never'] },
    { code: 'foo\n(\nbar\n)\n', options: ['never'] },
    { code: 'foo\n(  \nbar\n )\n', options: ['never'] },
    { code: 'foo\n(\n bar  \n)\n', options: ['never'] },
    { code: 'foo\n( \n  bar \n  )\n', options: ['never'] },
    { code: 'var foo = `( bar )`;', options: ['never'] },
    { code: 'var foo = `( bar ${baz} )`;', options: ['never'] },
    { code: 'var foo = `(bar ${(1 + 2)})`;', options: ['never'] },

    // exceptions
    { code: 'foo({ bar: "baz" })', options: ['always', { exceptions: ['{}'] }] },
    { code: 'foo( { bar: "baz" } )', options: ['always', { exceptions: ['[]', '()'] }] },
    { code: 'foo( 1, { bar: "baz" })', options: ['always', { exceptions: ['{}'] }] },
    { code: 'foo({ bar: "baz" }, 1 )', options: ['always', { exceptions: ['{}'] }] },
    { code: 'foo({\nbar: "baz",\nbaz: "bar"\n})', options: ['always', { exceptions: ['{}'] }] },
    { code: 'foo({ bar: "baz" })', options: ['never', { exceptions: ['[]', '()'] }] },
    { code: 'foo( { bar: "baz" } )', options: ['never', { exceptions: ['{}'] }] },
    { code: 'foo(1, { bar: "baz" } )', options: ['never', { exceptions: ['{}'] }] },
    { code: 'foo( { bar: "baz" }, 1)', options: ['never', { exceptions: ['{}'] }] },
    { code: 'foo( {\nbar: "baz",\nbaz: "bar"\n} )', options: ['never', { exceptions: ['{}'] }] },

    { code: 'foo([ 1, 2 ])', options: ['always', { exceptions: ['[]'] }] },
    { code: 'foo( [ 1, 2 ] )', options: ['always', { exceptions: ['{}'] }] },
    { code: 'foo( 1, [ 1, 2 ])', options: ['always', { exceptions: ['[]'] }] },
    { code: 'foo([ 1, 2 ], 1 )', options: ['always', { exceptions: ['[]'] }] },
    { code: 'foo([\n1,\n2\n])', options: ['always', { exceptions: ['[]'] }] },
    { code: 'foo([ 1, 2 ])', options: ['never', { exceptions: ['{}'] }] },
    { code: 'foo( [ 1, 2 ] )', options: ['never', { exceptions: ['[]'] }] },
    { code: 'foo(1, [ 1, 2 ] )', options: ['never', { exceptions: ['[]'] }] },
    { code: 'foo( [ 1, 2 ], 1)', options: ['never', { exceptions: ['[]'] }] },
    { code: 'foo( [\n1,\n2\n] )', options: ['never', { exceptions: ['[]'] }] },

    { code: 'foo(( 1 + 2 ))', options: ['always', { exceptions: ['()'] }] },
    { code: 'foo( ( 1 + 2 ) )', options: ['always', { exceptions: ['{}'] }] },
    { code: 'foo( 1 / ( 1 + 2 ))', options: ['always', { exceptions: ['()'] }] },
    { code: 'foo(( 1 + 2 ) / 1 )', options: ['always', { exceptions: ['()'] }] },
    { code: 'foo((\n1 + 2\n))', options: ['always', { exceptions: ['()'] }] },
    { code: 'foo((1 + 2))', options: ['never', { exceptions: ['{}'] }] },
    { code: 'foo( (1 + 2) )', options: ['never', { exceptions: ['()'] }] },
    { code: 'foo(1 / (1 + 2) )', options: ['never', { exceptions: ['()'] }] },
    { code: 'foo( (1 + 2) / 1)', options: ['never', { exceptions: ['()'] }] },
    { code: 'foo( (\n1 + 2\n) )', options: ['never', { exceptions: ['()'] }] },

    { code: 'foo()', options: ['always', { exceptions: ['empty'] }] },
    { code: 'foo( )', options: ['always', { exceptions: ['{}'] }] },
    { code: 'foo(\n1 + 2\n)', options: ['always', { exceptions: ['empty'] }] },
    { code: 'foo()', options: ['never', { exceptions: ['{}'] }] },
    { code: 'foo( )', options: ['never', { exceptions: ['empty'] }] },
    { code: 'foo( \n1 + 2\n )', options: ['never', { exceptions: ['empty'] }] },

    { code: 'foo({ bar: "baz" }, [ 1, 2 ])', options: ['always', { exceptions: ['{}', '[]'] }] },
    { code: 'foo({\nbar: "baz"\n}, [\n1,\n2\n])', options: ['always', { exceptions: ['{}', '[]'] }] },
    { code: 'foo(); bar({bar:"baz"}); baz([1,2])', options: ['always', { exceptions: ['{}', '[]', '()'] }] },
    { code: 'foo( { bar: "baz" }, [ 1, 2 ] )', options: ['never', { exceptions: ['{}', '[]'] }] },
    { code: 'foo( {\nbar: "baz"\n}, [\n1,\n2\n] )', options: ['never', { exceptions: ['{}', '[]'] }] },
    { code: 'foo( ); bar( {bar:"baz"} ); baz( [1,2] )', options: ['never', { exceptions: ['{}', '[]', 'empty'] }] },

    // faulty exceptions option
    { code: 'foo( { bar: "baz" } )', options: ['always', { exceptions: [] }] }
]);

ruleTester.addTestGroup('invalid', 'should fail invalid', [

        {
            code: 'foo( bar)',
            output: 'foo( bar )',
            options: ['always'],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 9 }])
        },
        {
            code: 'foo(bar)',
            output: 'foo( bar )',
            options: ['always'],
            errors: expecting([
                { message: MISSING_SPACE_ERROR, line: 0, column: 4 },
                { message: MISSING_SPACE_ERROR, line: 0, column: 8 }
            ])
        },
        {
            code: 'var x = ( 1 + 2) * 3',
            output: 'var x = ( 1 + 2 ) * 3',
            options: ['always'],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 16 }])
        },
        {
            code: 'var x = (1 + 2 ) * 3',
            output: 'var x = ( 1 + 2 ) * 3',
            options: ['always'],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 9 }])
        },
        {
            code: 'foo\n(bar\n)\n',
            output: 'foo\n( bar\n)\n',
            options: ['always'],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 1, column: 1 }])
        },
        {
            code: 'bar(baz )',
            output: 'bar(baz)',
            options: ['never'],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 9 } ])
        },
        {
            code: 'bar( baz )',
            output: 'bar(baz)',
            options: ['never'],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 4 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 10 }
            ])
        },
        {
            code: 'var x = ( 4 + 5) * 6',
            output: 'var x = (4 + 5) * 6',
            options: ['never'],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 9 } ])
        },
        {
            code: 'var x = (4 + 5 ) * 6',
            output: 'var x = (4 + 5) * 6',
            options: ['never'],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 16 } ])
        },

        // exceptions
        {
            code: 'fooa({ bar: "baz" })',
            output: 'foo( { bar: "baz" } )',
            options: ['always', { exceptions: ['[]'] }],
            errors: expecting([
                { message: MISSING_SPACE_ERROR, line: 0, column: 5 },
                { message: MISSING_SPACE_ERROR, line: 0, column: 20 }
            ])
        },
        {
            code: 'foob( { bar: "baz" } )',
            output: 'foo({ bar: "baz" })',
            options: ['always', { exceptions: ['{}'] }],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 5 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 22 }
            ])
        },
        {
            code: 'fooc({ bar: "baz" })',
            output: 'foo( { bar: "baz" } )',
            options: ['never', { exceptions: ['{}'] }],
            errors: expecting([
                { message: MISSING_SPACE_ERROR, line: 0, column: 5 },
                { message: MISSING_SPACE_ERROR, line: 0, column: 20 }
            ])
        },
        {
            code: 'food( { bar: "baz" } )',
            output: 'foo({ bar: "baz" })',
            options: ['never', { exceptions: ['[]'] }],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 5 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 22 }
            ])
        },
        {
            code: 'foo1( { bar: "baz" })',
            output: 'foo({ bar: "baz" })',
            options: ['always', { exceptions: ['{}'] }],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 5 } ])
        },
        {
            code: 'foo2( { bar: "baz" })',
            output: 'foo( { bar: "baz" } )',
            options: ['never', { exceptions: ['{}'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 21 }])
        },
        {
            code: 'foo3({ bar: "baz" } )',
            output: 'foo({ bar: "baz" })',
            options: ['always', { exceptions: ['{}'] }],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 21 } ])
        },
        {
            code: 'foo4({ bar: "baz" } )',
            output: 'foo( { bar: "baz" } )',
            options: ['never', { exceptions: ['{}'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 5 }])
        },
        {
            code: 'foo6([ 1, 2 ])',
            output: 'foo( [ 1, 2 ] )',
            options: ['always', { exceptions: ['empty'] }],
            errors: expecting([
                { message: MISSING_SPACE_ERROR, line: 0, column: 5 },
                { message: MISSING_SPACE_ERROR, line: 0, column: 14 }
            ])
        },
        {
            code: 'foo7( [ 1, 2 ] )',
            output: 'foo([ 1, 2 ])',
            options: ['always', { exceptions: ['[]'] }],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 5 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 16 }
            ])
        },
        {
            code: 'fooq([ 1, 2 ])',
            output: 'foo( [ 1, 2 ] )',
            options: ['never', { exceptions: ['[]'] }],
            errors: expecting([
                { message: MISSING_SPACE_ERROR, line: 0, column: 5 },
                { message: MISSING_SPACE_ERROR, line: 0, column: 14 }
            ])
        },
        {
            code: 'foow( [ 1, 2 ] )',
            output: 'foo([ 1, 2 ])',
            options: ['never', { exceptions: ['()'] }],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 5 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 16 }
            ])
        },
        {
            code: 'fooe([ 1, 2 ] )',
            output: 'foo([ 1, 2 ])',
            options: ['always', { exceptions: ['[]'] }],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 15 } ])
        },
        {
            code: 'foor([ 1, 2 ] )',
            output: 'foo( [ 1, 2 ] )',
            options: ['never', { exceptions: ['[]'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 5 }])
        },
        {
            code: 'foot( [ 1, 2 ])',
            output: 'foo([ 1, 2 ])',
            options: ['always', { exceptions: ['[]'] }],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 5 } ])
        },
        {
            code: 'fooy( [ 1, 2 ])',
            output: 'foo( [ 1, 2 ] )',
            options: ['never', { exceptions: ['[]'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 15 }])
        },
        {
            code: '(( 1 + 2 ))',
            output: '( ( 1 + 2 ) )',
            options: ['always', { exceptions: ['[]'] }],
            errors: expecting([
                { message: MISSING_SPACE_ERROR, line: 0, column: 1 },
                { message: MISSING_SPACE_ERROR, line: 0, column: 11 }
            ])
        },
        {
            code: '( ( 1 + 2 ) )',
            output: '(( 1 + 2 ))',
            options: ['always', { exceptions: ['()'] }],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 1 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 13 }
            ])
        },
        {
            code: '(( 1 + 2 ))',
            output: '( ( 1 + 2 ) )',
            options: ['always', { exceptions: ['[]'] }],
            errors: expecting([
                { message: MISSING_SPACE_ERROR, line: 0, column: 1 },
                { message: MISSING_SPACE_ERROR, line: 0, column: 11 }
            ])
        },
        {
            code: '( ( 1 + 2 ) )',
            output: '((1 + 2))',
            options: ['never'],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 1 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 3 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 11 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 13 }
            ])
        },
        {
            code: '( ( 1 + 2 ) )',
            output: '((1 + 2))',
            options: ['never', { exceptions: ['[]'] }],
            errors: expecting([
                { message: REJECTED_SPACE_ERROR, line: 0, column: 1 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 3 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 11 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 13 },
                { message: REJECTED_SPACE_ERROR, line: 0, column: 13 }
            ])
        },
        {
            code: '( ( 1 + 2 ))',
            output: '(( 1 + 2 ))',
            options: ['always', { exceptions: ['()'] }],
            errors: expecting([{ message: REJECTED_SPACE_ERROR, line: 0, column: 1 }])
        },
        {
            code: '( (1 + 2))',
            output: '( (1 + 2) )',
            options: ['never', { exceptions: ['()'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 10 }])
        },
        {
            code: '(( 1 + 2 ) )',
            output: '(( 1 + 2 ))',
            options: ['always', { exceptions: ['()'] }],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 12 } ])
        },
        {
            code: '((1 + 2) )',
            output: '( (1 + 2) )',
            options: ['never', { exceptions: ['()'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 1 }])
        },
        {
            code: 'var result = ( 1 / ( 1 + 2 ) ) + 3',
            output: 'var result = ( 1 / ( 1 + 2 )) + 3',
            options: ['always', { exceptions: ['()'] }],
            errors: expecting([ { message: REJECTED_SPACE_ERROR, line: 0, column: 30 } ])
        },
        {
            code: 'var result = (1 / (1 + 2)) + 3',
            output: 'var result = (1 / (1 + 2) ) + 3',
            options: ['never', { exceptions: ['()'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 26 }])
        },
        {
            code: 'var result = ( 1 / ( 1 + 2)) + 3',
            output: 'var result = ( 1 / ( 1 + 2 )) + 3',
            options: ['always', { exceptions: ['()'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 27 }])
        },
        {
            code: 'var result = (1 / (1 + 2)) + 3',
            output: 'var result = (1 / (1 + 2) ) + 3',
            options: ['never', { exceptions: ['()'] }],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 26 }])
        },
        {
            code: 'foo\n(\nbar )\n',
            output: 'foo\n(\nbar)\n',
            options: ['never'],
            errors: expecting([{ message: REJECTED_SPACE_ERROR, line: 2, column: 5 }])
        },
        {
            code: 'var foo = `(bar ${(1 + 2 )})`;',
            output: 'var foo = `(bar ${(1 + 2)})`;',
            options: ['never'],
            errors: expecting([{ message: REJECTED_SPACE_ERROR, line: 0, column: 26 }])
        },
        {
            code: 'var foo = `(bar ${(1 + 2 )})`;',
            output: 'var foo = `(bar ${( 1 + 2 )})`;',
            options: ['always'],
            errors: expecting([{ message: MISSING_SPACE_ERROR, line: 0, column: 19 }])
        }

]);

ruleTester.runTests();
