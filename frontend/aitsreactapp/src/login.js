import React, { useState } from 'react';
import axios from 'axios';

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login/', {
                username,
                password,
            });
            console.log('login successful:', response.data);
            
            // redirect or update state
        } catch (err){
            setError('invalid credentials');
            console.error(err);
        }
    };
    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit = {handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input 
                        type ="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type ="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>

            </form>
        </div>
    );
}
export default Login;