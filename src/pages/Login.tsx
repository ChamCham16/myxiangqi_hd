import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  return (
    <StyledLogin>
      <div className="form-signin">
        <form onSubmit={loginUser}>
          <h1 className="form-header">Login</h1>
          <input type="text" name='username' id="inputUsername" className="form-control" placeholder="Username" required />
          <input type="password" name='password' id="inputPassword" className="form-control" placeholder="Password" required />
          <button className="form-button" type="submit">Sign in</button>
        </form>
      </div>
    </StyledLogin>
  )
};

const StyledLogin = styled.div`
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-header {
  margin-bottom: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #495057;
  text-align: center;
}

.form-control {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  margin-bottom: 10px;
}

.form-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  cursor: pointer;
}
`;

export default Login;