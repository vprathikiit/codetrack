const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

export const saveGoalsAPI = async(token, dailyGoal, weeklyGoal) => {
  try {
    const response = await fetch(`${BASE_URL}/user/goals`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ dailyGoal, weeklyGoal })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to save goals');
    }
    return data;
  } 
  catch (err) {
    throw err;
  }
};