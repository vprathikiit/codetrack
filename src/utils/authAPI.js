const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

export const signupAPI = async(email, password, lcUsername, cfUsername) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, lcUsername, cfUsername})
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        return data;
    }
    catch(err) {
        throw err;
    }
};

export const loginAPI = async(email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    }
    catch(err) {
        throw err;
    }
};

export const getMeAPI = async(token) => {
    try {
        const response = await fetch(`${BASE_URL}/user/me`, {
            headers: {'Authorization': `Bearer ${token}`}
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || 'Failed to get user');
        }

        return data;
    }
    catch(err) {
        throw err;
    }
};

export const updateUsernameAPI = async(token, lcUsername, cfUsername) => {
    try {
        const response = await fetch(`${BASE_URL}/user/usernames`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({lcUsername, cfUsername})
        });

        const data = await response.json();
        
        if(!response.ok) {
            throw new Error(data.message || 'Failed to update usernames');
        }

        return data;
    }
    catch(err) {
        throw err;
    }
};