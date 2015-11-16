'use strict';

import createParent from '../util/createParent';
import { findDOMNode } from 'react-dom';

var React;
var Login;
var TestUtils;

describe('Login Component', () => {
    let login;

    beforeEach(() => {
        React = require('react');
        Login = require('../../src/js/components/Login');
        TestUtils = require('react-addons-test-utils');
    });

    describe('DOM', () => {

        beforeEach(() => {
            login = TestUtils.renderIntoDocument(<Login />);
        });

        it('should render a div with className "login"', () => {
            expect(findDOMNode(login).className).to.equal('login');
        });

        it('should render an error message only when passed as prop', () => {
            let error;
            error = TestUtils.scryRenderedDOMComponentsWithClass(login, 'error');

            expect(error.length).to.equal(0);

            // rerender with errorMessage prop
            login = TestUtils.renderIntoDocument(<Login errorMessage="uh oh" />);
            error = TestUtils.findRenderedDOMComponentWithClass(login, 'error');

            expect(findDOMNode(error).textContent).to.equal('uh oh');
        });
    });

    describe('Props', () => {
        let parent;
        let login;

        beforeEach(() => {
            let LoginParent = createParent(Login, 'login', {
                errorMessage: '',
                user: { isLoggedIn: false }
            });

            parent = TestUtils.renderIntoDocument(<LoginParent />);
            login = parent.refs.login;
        });

        it('should disable submit button until props update', () => {
            let submitButton = findDOMNode(TestUtils.findRenderedDOMComponentWithTag(login, 'button'));

            login.setState({ submitted: true });
            expect(submitButton.disabled).to.equal(true);

            parent.setState({ errorMessage: 'invalid user' });

            expect(login.state.submitted).to.equal(false);
            expect(submitButton.disabled).to.equal(false);
        });

        it('should clear form when user prop updates', () => {
            login.clearForm = sinon.spy();
            expect(login.clearForm).to.have.not.been.called;

            parent.setState({ user: { isLoggedIn: true } });
            expect(login.clearForm).to.have.been.called;
        });

    });
});