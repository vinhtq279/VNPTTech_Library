import React from 'react';
import './Login.css';

class Login extends React.Component {
    
   loginIt = () => {
        fetch('/api/login', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    uid: document.getElementById('uid').value,
		    password: document.getElementById('password').value
                })
           });
           /*.then(res => {
                fetch('/api/borrowed')
                .then(res => res.json())
                .then(e => console.log(e));
           });*/

    }

    render() {
        return (
            <div id='login'>
                <span id="heading">LOGIN</span>
		<form>
			<input type="text" placeholder="...@vnpt-technology.vn" id="uid" />
			<input type="password" id="password" />
			<button className="btn btn-primary" onClick={() => this.loginIt()}>Login</button>
		</form>
            </div>
        );
    }

}

export default Login;
