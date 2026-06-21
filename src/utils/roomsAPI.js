const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

export const createRoomAPI = async(token, name) => {
    try {
        const response = await fetch(`${BASE_URL}/rooms/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name})
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message || 'failed to create room');
        }
        return data;
    }
    catch(err) {
        throw err;
    }
};

export const joinRoomAPI = async(token, code) => {
    try {
        const response = await fetch(`${BASE_URL}/rooms/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({code})
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message || 'failed to join room');
        }
        return data;
    }
    catch(err) {
        throw err;
    }
};

export const getMyRoomsAPI = async(token) => {
    try {
        const response = await fetch(`${BASE_URL}/rooms/my`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message || 'Failed to get rooms');
        }
        return data;
    }
    catch(err) {
        throw err;
    }
};

