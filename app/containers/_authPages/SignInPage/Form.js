import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SubmitButton, Note, Grid, TextField } from 'components/_ui-elements';

import { setAuthenticationToken } from 'containers/BackendApiConnector/actions';
import { apiPost } from 'containers/BackendApiConnector/fetchers';

import messages from './messages';
import { signedInNotify } from './notifications';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      email: null,
      password: null,
      processing: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  setStateProcessing() {
    this.setState({ processing: true });
  }

  unsetStateProcessing() {
    this.setState({ processing: false });
  }

  onSubmit(event) {
    event.preventDefault();

    apiPost({
      form: this,
      path: '/auth/sign_in',
      body: {
        email: this.state.email,
        password: this.state.password,
      },
      afterSuccess: result => {
        this.setState({ errorMessage: result.error_message });

        if (result.authentication_token) {
          this.props.onSignInSuccess(result.authentication_token);
          signedInNotify();
        }
      },
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Grid>
          <Note error message={this.state.errorMessage} />
        </Grid>
        <Grid>
          <TextField
            label={<FormattedMessage {...messages.formEmail} />}
            type="email"
            name="email"
            onChange={event => this.setState({ email: event.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid>
          <TextField
            label={<FormattedMessage {...messages.formPassword} />}
            type="password"
            name="password"
            onChange={event => this.setState({ password: event.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid>
          <SubmitButton processing={this.state.processing}>
            <FormattedMessage {...messages.formButton} />
          </SubmitButton>
        </Grid>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSignInSuccess: token => dispatch(setAuthenticationToken(token)),
    dispatch,
  };
}

Form.propTypes = {
  onSignInSuccess: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(Form);
