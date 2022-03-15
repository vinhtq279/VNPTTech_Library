import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

class Nav extends React.Component {
    
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }

    state = {};

    update() {
        this.setState(this.state);
    }

    render(){
	if (Cookies.get('uid') == 'vinhtq' || Cookies.get('uid') == 'ngocdm'){
		return (
                    <div id='nav'>
                        <span>THƯ VIỆN VNPT TECHNOLOGY </span>
                        <ul>
                            <li style={window.location.pathname === '/' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/' onClick={this.update}>Home</Link></li>
                            <li style={window.location.pathname === '/issuing' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/issuing' onClick={this.update}>Yêu Cầu</Link></li>
			    <li style={window.location.pathname === '/returnAdmin' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/returnAdmin' onClick={this.update}>Trả Sách</Link></li>
                            <li style={window.location.pathname === '/login' ? {display: 'none'} : {display: 'inline-block'}}><a href='http://172.24.104.83:4000'>Đăng Nhập</a></li>
                            <li style={window.location.pathname === '/search' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/searchAdmin' onClick={this.update}>Tìm Kiếm</Link></li>
                            <li style={{display: 'inline-block'}}>{Cookies.get('uid')}</li>
                        </ul>
                    </div>
                );
	}else{
	        return (
        	    <div id='nav'>
                	<span>VNPT TECHNOLOGY LIBRARY </span>
	                <ul>
        	            <li style={window.location.pathname === '/' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/' onClick={this.update}>Home</Link></li>
			    <li style={window.location.pathname === '/issue' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/issue' onClick={this.update}>Issue</Link></li>
	                    <li style={window.location.pathname === '/issuedbook' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/issuedbook' onClick={this.update}>Issued Book</Link></li>
			    <li style={window.location.pathname === '/login' ? {display: 'none'} : {display: 'inline-block'}}><a href='http://172.24.104.83:4000'>Login</a></li>
 			    <li style={window.location.pathname === '/search' ? {display: 'none'} : {display: 'inline-block'}}><Link to='/search' onClick={this.update}>Search</Link></li>
 			    <li style={{display: 'inline-block'}}>{Cookies.get('uid')}</li>
	                </ul>
        	    </div>
        	);
	}
    }
}

export default Nav;
