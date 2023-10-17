import {Component} from 'react'
import {Redirect, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    userId: '',
    pin: '',
    showErrorMsg: false,
    errMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 10})
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({showErrorMsg: true, errMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  renderUserId = () => {
    const {userId} = this.state
    return (
      <>
        <label htmlFor="userId" className="label">
          USER ID
        </label>
        <input
          id="userId"
          type="text"
          className="input-bar"
          placeholder="Enter User ID"
          value={userId}
          onChange={this.onChangeUserId}
        />
      </>
    )
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  renderPin = () => {
    const {pin} = this.state
    return (
      <>
        <label htmlFor="pin" className="label">
          PIN
        </label>
        <input
          id="pin"
          type="password"
          className="input-bar"
          placeholder="Enter PIN"
          value={pin}
          onChange={this.onChangePin}
        />
      </>
    )
  }

  render() {
    const {showErrorMsg, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <div className="login-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
          <form className="form" onSubmit={this.submitForm}>
            <h1 className="form-heading">Welcome Back!</h1>
            <div className="input-container">{this.renderUserId()}</div>
            <div className="input-container">{this.renderPin()}</div>
            <button type="submit" className="login-btn">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default withRouter(LoginForm)
