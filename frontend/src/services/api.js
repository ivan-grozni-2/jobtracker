const baseUrl = "http://localhost:5000/api";

export async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'appliction/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers
    });

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