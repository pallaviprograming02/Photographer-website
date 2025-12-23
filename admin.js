/* admin.js */

(() => {
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));

    // --- Auth ---
    const loginSection = qs('#loginSection');
    const dashboardSection = qs('#dashboardSection');
    const loginForm = qs('#loginForm');
    const loginError = qs('#loginError');
    const logoutBtn = qs('#logoutBtn');

    // Simple "Session" (clears on refresh for security in this demo, or use sessionStorage)
    let isAdmin = false;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = qs('#password').value;
        if (pwd === 'admin123') { // Simple hardcoded password
            isAdmin = true;
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            initDashboard();
        } else {
            loginError.textContent = 'Invalid password';
        }
    });

    logoutBtn.addEventListener('click', () => {
        isAdmin = false;
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
        qs('#password').value = '';
    });

    // --- Dashboard Logic ---

    // Tabs
    const tabs = qsa('.tab-btn');
    const contents = qsa('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = qs(`#${tab.dataset.tab}`);
            if (target) target.classList.add('active');
        });
    });

    function initDashboard() {
        renderOrders();
        renderPhotos();
    }

    // --- Orders ---
    const ordersBody = qs('#ordersBody');
    const noOrders = qs('#noOrders');

    function renderOrders() {
        const orders = DataManager.getOrders();
        ordersBody.innerHTML = '';

        if (orders.length === 0) {
            noOrders.style.display = 'block';
            return;
        }
        noOrders.style.display = 'none';

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${order.date || '-'}</td>
        <td>${order.service}</td>
        <td>
          <strong>${order.name}</strong><br>
          <span class="muted" style="font-size:0.8rem">${order.email}</span>
        </td>
        <td>${order.phone}</td>
        <td><span class="status-badge status-${order.status}">${order.status}</span></td>
        <td>
          ${order.status === 'Pending' ? `
            <button class="btn btn-ghost" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; border-color: #10b981; color: #10b981;" onclick="updateStatus(${order.id}, 'Accepted')">✓</button>
            <button class="btn btn-ghost" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; border-color: #ef4444; color: #ef4444;" onclick="updateStatus(${order.id}, 'Rejected')">✕</button>
          ` : ''}
        </td>
      `;
            ordersBody.appendChild(tr);
        });
    }

    // Make available globally for inline onclicks
    window.updateStatus = (id, status) => {
        DataManager.updateOrderStatus(id, status);
        renderOrders();
    };

})();
