const BASE_URL = "http://localhost:5000/api";

export async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers, 
        credentials:'include'
    });

    if(response.status === 401){
        
    console.log("refresh ");
        try{
            const newToken = await refreshToken();
            const retryHeaders = {
                ...headers,
                Authorization:`Bearer ${newToken}`
            };

            response = await fetch(`${BASE_URL}${endpoint}`,{
                ...options,
                headers: retryHeaders,
                credentials: 'include'
            })
        }catch(err){
            console.warn('Token refresh failed');
            throw err;
        }
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${response.status}`);
    }
    return response.json();
}

export async function getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/jobs?${query}`);
}

export async function createJob(jobData) {
    return fetchWithAuth('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData)
    });
}

export async function updateJob(id, jobData) {
    return fetchWithAuth(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jobData)
    });
}

export async function deleteJob(id) {
    return fetchWithAuth(`/jobs/${id}`, {
        method: 'DELETE'
    })

}

export async function login(email, password){
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email, password}),
        credentials:'include'
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data.error||'Login failed');


    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('userDetail', JSON.stringify(data.user));

    
    console.log("data.user ",localStorage.getItem('userDetail'));

    return data;


}

export async function register(userData){
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(userData)
    });


    const data = await res.json()

    if(!res.ok) throw new Error(data.error || 'Register failed');

    return data;
}

export async function refreshToken(){
    const res = await fetch(`${BASE_URL}/auth/refresh`,{
        method:'POST',
        credentials:'include'
    });
    const data = await res.json();

    if(!res.ok) throw new Error(data.error|| 'Refresh token not updating');

    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
}

export async function logout(){
    const res = await fetchWithAuth(`/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    localStorage.removeItem("accessToken");
    if(res.ok === false) throw new Error("Cannot Logout");
}

export async function jobSummary(){
    const data = await fetchWithAuth(`/jobs/summary`);
    return data;
}