async function test() {
    try {
        console.log("Logging in...");
        const res = await fetch('http://localhost:3000/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@admin.com', password: 'admin' })
        });
        const data = await res.json();
        console.log("Login response:", data);

        if (data.token) {
            console.log("Fetching clients...");
            const clients = await fetch('http://localhost:3000/clients', {
                headers: { Authorization: `Bearer ${data.token}` }
            });
            console.log("Clients response status:", clients.status);
            const clientsData = await clients.json();
            console.log("Clients data:", clientsData);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
