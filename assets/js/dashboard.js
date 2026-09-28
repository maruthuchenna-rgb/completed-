/**
 * Real Homes - Role-Based Dashboard Logic
 * Handles Buyer & Agent Dashboards with 5-Option Dash Bar Navigation
 */

// State
let currentRole = 'buyer'; // 'buyer' or 'agent'
let currentBuyerTab = 'buyer-overview';
let currentAgentTab = 'agent-overview';

// Initial Sample Data (can be modified in memory during session)
const buyerData = {
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    role: 'buyer',
    avatar: 'assets/images/agent-profile-3.webp',
    savedCount: 4,
    toursCount: 2,
    offersCount: 2,
    alertsCount: 3
};

const agentData = {
    name: 'Alexander Wright',
    email: 'alexander@realhomesrealty.com',
    role: 'agent',
    agency: 'Real Homes Luxury Realty',
    license: 'FL-RE-987412',
    avatar: 'assets/images/agent-profile-1.webp',
    listingsCount: 6,
    leadsCount: 5,
    showingsCount: 3,
    salesVolume: '$4,250,000'
};

// Listings in Agent Dashboard
let agentListings = [
    {
        id: 1,
        title: 'Modern Villa with Private Infinity Pool',
        location: 'Miami Beach, FL',
        price: '$1,850,000',
        status: 'for-sale',
        statusLabel: 'For Sale',
        beds: 4,
        baths: 3,
        sqft: '3,450',
        img: 'assets/images/prop-1.webp',
        views: 1420,
        inquiries: 12
    },
    {
        id: 2,
        title: 'Luxury Downtown Penthouse Suite',
        location: 'Brickell Ave, Miami',
        price: '$2,400,000',
        status: 'for-sale',
        statusLabel: 'For Sale',
        beds: 3,
        baths: 3.5,
        sqft: '2,800',
        img: 'assets/images/prop-2.webp',
        views: 2150,
        inquiries: 18
    },
    {
        id: 3,
        title: 'Waterfront Sunset Residence',
        location: 'Fort Lauderdale, FL',
        price: '$8,500 / mo',
        status: 'for-rent',
        statusLabel: 'For Rent',
        beds: 3,
        baths: 2,
        sqft: '2,100',
        img: 'assets/images/rent-sunset-residence.webp',
        views: 980,
        inquiries: 9
    },
    {
        id: 4,
        title: 'Contemporary Beverly Hills Estate',
        location: 'Sunset Blvd, CA',
        price: '$4,200,000',
        status: 'pending',
        statusLabel: 'Pending Sale',
        beds: 5,
        baths: 5,
        sqft: '5,200',
        img: 'assets/images/property-1.webp',
        views: 3100,
        inquiries: 24
    },
    {
        id: 5,
        title: 'Grand Oceanfront Villa & Garden',
        location: 'Palm Beach, FL',
        price: '$3,150,000',
        status: 'for-sale',
        statusLabel: 'For Sale',
        beds: 4,
        baths: 4,
        sqft: '3,900',
        img: 'assets/images/property-2.webp',
        views: 1670,
        inquiries: 14
    },
    {
        id: 6,
        title: 'Minimalist Architectural Loft',
        location: 'Downtown Art District',
        price: '$4,800 / mo',
        status: 'for-rent',
        statusLabel: 'For Rent',
        beds: 2,
        baths: 2,
        sqft: '1,650',
        img: 'assets/images/rent-penthouse-modern.webp',
        views: 890,
        inquiries: 7
    }
];

// Initialize User Profile Data from Session / localStorage
function loadUserData() {
    const storedName = localStorage.getItem('realhomes_user_name');
    const storedEmail = localStorage.getItem('realhomes_user_email');

    if (storedName) {
        buyerData.name = storedName;
        agentData.name = storedName;
    }
    if (storedEmail) {
        buyerData.email = storedEmail;
        agentData.email = storedEmail;
    }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load user data from localStorage
    loadUserData();

    // 2. Detect role from query param or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    const storedRole = localStorage.getItem('realhomes_user_role');

    if (roleParam === 'agent' || (!roleParam && storedRole === 'agent')) {
        setRole('agent', false);
    } else {
        setRole('buyer', false);
    }

    // 3. Check tab from hash or query
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        if (currentRole === 'buyer' && document.getElementById(hash)) {
            switchBuyerTab(hash);
        } else if (currentRole === 'agent' && document.getElementById(hash)) {
            switchAgentTab(hash);
        }
    }

    // 4. Render dynamic sections
    renderAgentListings();
    initMortgageCalculator();
});

// Switch Role Function (Buyer vs Agent)
function setRole(role, notify = true) {
    currentRole = role;
    localStorage.setItem('realhomes_user_role', role);
    loadUserData();

    const appLayout = document.getElementById('dashAppLayout');
    const rolePillBuyer = document.getElementById('rolePillBuyer');
    const rolePillAgent = document.getElementById('rolePillAgent');
    
    // Sidebar elements
    const buyerSidebarNav = document.getElementById('buyerSidebarNav');
    const agentSidebarNav = document.getElementById('agentSidebarNav');
    const sidebarAvatar = document.getElementById('dashSidebarAvatar');
    const sidebarName = document.getElementById('dashSidebarName');
    const sidebarBadge = document.getElementById('dashSidebarRoleBadge');
    
    // Topbar elements
    const topbarAvatar = document.getElementById('dashTopbarAvatar');
    const topbarName = document.getElementById('dashTopbarName');

    // Heading elements
    const buyerHeadingName = document.getElementById('buyerHeadingName');
    const agentHeadingName = document.getElementById('agentHeadingName');

    // Profile form inputs
    const buyerNameInput = document.getElementById('buyerProfileNameInput');
    const buyerEmailInput = document.getElementById('buyerProfileEmailInput');
    const agentNameInput = document.getElementById('agentProfileNameInput');

    // Panels container
    const buyerPanels = document.querySelectorAll('.buyer-panel-group');
    const agentPanels = document.querySelectorAll('.agent-panel-group');

    const currentUser = role === 'agent' ? agentData : buyerData;

    // Populate user name and email in all places
    if (sidebarName) sidebarName.textContent = currentUser.name;
    if (topbarName) topbarName.textContent = currentUser.name;
    if (buyerHeadingName) buyerHeadingName.textContent = currentUser.name;
    if (agentHeadingName) agentHeadingName.textContent = currentUser.name;

    if (buyerNameInput) buyerNameInput.value = buyerData.name;
    if (buyerEmailInput) buyerEmailInput.value = buyerData.email;
    if (agentNameInput) agentNameInput.value = agentData.name;

    if (role === 'agent') {
        if (appLayout) appLayout.classList.add('theme-agent');
        if (rolePillAgent) rolePillAgent.classList.add('active');
        if (rolePillBuyer) rolePillBuyer.classList.remove('active');

        // Show Agent sidebar nav, hide buyer
        if (buyerSidebarNav) buyerSidebarNav.style.display = 'none';
        if (agentSidebarNav) agentSidebarNav.style.display = 'block';

        // Update User info
        if (sidebarAvatar) sidebarAvatar.src = agentData.avatar;
        if (topbarAvatar) topbarAvatar.src = agentData.avatar;
        if (sidebarBadge) {
            sidebarBadge.className = 'dash-role-badge agent';
            sidebarBadge.innerHTML = '<i class="fas fa-briefcase"></i> Agent / Seller';
        }

        // Toggle panel groups
        buyerPanels.forEach(p => p.style.display = 'none');
        agentPanels.forEach(p => p.style.display = 'block');

        // Activate active tab
        switchAgentTab(currentAgentTab);

        if (notify) showToast(`Switched to Agent Dashboard (${currentUser.name})`, 'info');
    } else {
        if (appLayout) appLayout.classList.remove('theme-agent');
        if (rolePillBuyer) rolePillBuyer.classList.add('active');
        if (rolePillAgent) rolePillAgent.classList.remove('active');

        // Show Buyer sidebar nav, hide agent
        if (buyerSidebarNav) buyerSidebarNav.style.display = 'block';
        if (agentSidebarNav) agentSidebarNav.style.display = 'none';

        // Update User info
        if (sidebarAvatar) sidebarAvatar.src = buyerData.avatar;
        if (topbarAvatar) topbarAvatar.src = buyerData.avatar;
        if (sidebarBadge) {
            sidebarBadge.className = 'dash-role-badge buyer';
            sidebarBadge.innerHTML = '<i class="fas fa-user-tag"></i> Buyer / Tenant';
        }

        // Toggle panel groups
        agentPanels.forEach(p => p.style.display = 'none');
        buyerPanels.forEach(p => p.style.display = 'block');

        // Activate active tab
        switchBuyerTab(currentBuyerTab);

        if (notify) showToast(`Switched to Buyer Dashboard (${currentUser.name})`, 'info');
    }

    // Close mobile sidebar if open
    closeMobileSidebar();
}

// 5 Option Tab Navigation for Buyer Dashboard
function switchBuyerTab(tabId) {
    currentBuyerTab = tabId;
    window.location.hash = tabId;

    // Update nav items
    const navItems = document.querySelectorAll('#buyerSidebarNav .dash-nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-target') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update view panels
    const panels = document.querySelectorAll('.buyer-panel');
    panels.forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5 Option Tab Navigation for Agent Dashboard
function switchAgentTab(tabId) {
    currentAgentTab = tabId;
    window.location.hash = tabId;

    // Update nav items
    const navItems = document.querySelectorAll('#agentSidebarNav .dash-nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-target') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update view panels
    const panels = document.querySelectorAll('.agent-panel');
    panels.forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Sidebar Controls
function toggleMobileSidebar() {
    const sidebar = document.getElementById('dashSidebar');
    const backdrop = document.getElementById('dashSidebarBackdrop');
    sidebar.classList.toggle('mobile-open');
    backdrop.classList.toggle('active');
    if (sidebar.classList.contains('mobile-open')) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('dashSidebar');
    const backdrop = document.getElementById('dashSidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

// Render Agent Property Listings
function renderAgentListings(filter = 'all') {
    const container = document.getElementById('agentListingsGrid');
    if (!container) return;

    let filtered = agentListings;
    if (filter === 'sale') filtered = agentListings.filter(l => l.status === 'for-sale');
    if (filter === 'rent') filtered = agentListings.filter(l => l.status === 'for-rent');
    if (filter === 'pending') filtered = agentListings.filter(l => l.status === 'pending');

    container.innerHTML = filtered.map(item => `
        <div class="dash-prop-card" id="agent-listing-${item.id}">
            <div class="dash-prop-thumb-wrap">
                <img src="${item.img}" alt="${item.title}" class="dash-prop-thumb" loading="lazy">
                <span class="dash-prop-badge-status ${item.status}">${item.statusLabel}</span>
                <div class="dash-prop-price-tag">${item.price}</div>
            </div>
            <div class="dash-prop-content">
                <h3 class="dash-prop-title">${item.title}</h3>
                <div class="dash-prop-location">
                    <i class="fas fa-map-marker-alt" style="color: var(--dash-primary)"></i>
                    <span>${item.location}</span>
                </div>
                <div class="dash-prop-specs">
                    <div class="dash-prop-spec-item">
                        <i class="fas fa-bed"></i> <span>${item.beds} Beds</span>
                    </div>
                    <div class="dash-prop-spec-item">
                        <i class="fas fa-bath"></i> <span>${item.baths} Baths</span>
                    </div>
                    <div class="dash-prop-spec-item">
                        <i class="fas fa-vector-square"></i> <span>${item.sqft} sqft</span>
                    </div>
                </div>
                <div style="font-size: 11.5px; color: var(--dash-text-muted); display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span><i class="far fa-eye"></i> ${item.views} Views</span>
                    <span><i class="far fa-envelope"></i> ${item.inquiries} Leads</span>
                </div>
                <div class="dash-prop-actions">
                    <button class="dash-prop-btn primary" onclick="window.location.href='404.html'">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="dash-prop-btn" onclick="window.location.href='404.html'" title="Delete Listing">
                        <i class="fas fa-trash-alt text-danger"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Listings
function filterAgentListings(type, btn) {
    const filterBtns = document.querySelectorAll('.listing-filter-btn');
    filterBtns.forEach(b => b.classList.remove('active', 'btn-dash-primary'));
    filterBtns.forEach(b => b.classList.add('btn-dash-outline'));
    
    btn.classList.add('btn-dash-primary');
    btn.classList.remove('btn-dash-outline');

    renderAgentListings(type);
}

// Modal Handlers
function openAddListingModal() {
    document.getElementById('addListingModal').classList.add('open');
}

function closeAddListingModal() {
    document.getElementById('addListingModal').classList.remove('open');
}

function handleAddListingSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('newListingTitle').value;
    const price = document.getElementById('newListingPrice').value;
    const location = document.getElementById('newListingLocation').value;
    const type = document.getElementById('newListingType').value;
    const beds = document.getElementById('newListingBeds').value;
    const baths = document.getElementById('newListingBaths').value;
    const sqft = document.getElementById('newListingSqft').value;

    const newListing = {
        id: Date.now(),
        title: title,
        location: location,
        price: price,
        status: type,
        statusLabel: type === 'for-sale' ? 'For Sale' : 'For Rent',
        beds: beds || 3,
        baths: baths || 2,
        sqft: sqft || '2,400',
        img: 'assets/images/property-3.webp',
        views: 1,
        inquiries: 0
    };

    agentListings.unshift(newListing);
    renderAgentListings();
    closeAddListingModal();
    showToast('New property listing published successfully!', 'success');
    e.target.reset();
}

function deleteListing(id) {
    window.location.href = '404.html';
}

function editListing(id) {
    window.location.href = '404.html';
}

// Buyer Tour Booking / Reschedule / Cancel
function rescheduleTour(tourName) {
    window.location.href = '404.html';
}

function cancelTour(btn, tourName) {
    window.location.href = '404.html';
}

function launch3DWalkthrough(propName) {
    window.location.href = '404.html';
}

// Buyer Saved Properties Interactions
function removeSavedProperty(btn, propTitle) {
    window.location.href = '404.html';
}

function makeOffer(propTitle, price) {
    window.location.href = '404.html';
}

// Chat Send Function
function sendInquiryReply(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input || !container || !input.value.trim()) return;

    const text = input.value.trim();
    const msgEl = document.createElement('div');
    msgEl.className = 'dash-message-bubble outgoing';
    msgEl.innerHTML = `<strong>You:</strong> ${text} <div style="font-size: 10px; opacity: 0.8; margin-top: 4px; text-align: right;">Just now</div>`;
    
    container.appendChild(msgEl);
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Simulated Auto-reply after 1.5s
    setTimeout(() => {
        const replyEl = document.createElement('div');
        replyEl.className = 'dash-message-bubble incoming';
        replyEl.innerHTML = `<strong>Agent Nathan:</strong> Thanks for your message! I'm reviewing this right now and will update you shortly. <div style="font-size: 10px; opacity: 0.8; margin-top: 4px;">Just now</div>`;
        container.appendChild(replyEl);
        container.scrollTop = container.scrollHeight;
    }, 1200);
}

// Mortgage Calculator
function initMortgageCalculator() {
    const homePriceInput = document.getElementById('calcHomePrice');
    const downPaymentInput = document.getElementById('calcDownPayment');
    const interestInput = document.getElementById('calcInterest');
    const termInput = document.getElementById('calcTerm');

    if (!homePriceInput) return;

    function recalculate() {
        const price = parseFloat(homePriceInput.value) || 1200000;
        const downPercent = parseFloat(downPaymentInput.value) || 20;
        const rate = parseFloat(interestInput.value) || 6.5;
        const years = parseInt(termInput.value) || 30;

        const principal = price * (1 - downPercent / 100);
        const monthlyRate = rate / 100 / 12;
        const totalPayments = years * 12;

        let monthlyPayment = 0;
        if (monthlyRate > 0) {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
        } else {
            monthlyPayment = principal / totalPayments;
        }

        const estEl = document.getElementById('calcEstMonthly');
        if (estEl) {
            estEl.textContent = '$' + Math.round(monthlyPayment).toLocaleString('en-US') + ' / mo';
        }
    }

    [homePriceInput, downPaymentInput, interestInput, termInput].forEach(inp => {
        if (inp) inp.addEventListener('input', recalculate);
    });
}

// Save Profile Preferences
function savePreferences(e) {
    e.preventDefault();
    const buyerNameInput = document.getElementById('buyerProfileNameInput');
    const buyerEmailInput = document.getElementById('buyerProfileEmailInput');
    const agentNameInput = document.getElementById('agentProfileNameInput');

    let updatedName = '';
    let updatedEmail = '';

    if (currentRole === 'buyer') {
        if (buyerNameInput) updatedName = buyerNameInput.value.trim();
        if (buyerEmailInput) updatedEmail = buyerEmailInput.value.trim();
    } else {
        if (agentNameInput) updatedName = agentNameInput.value.trim();
    }

    if (updatedName) {
        localStorage.setItem('realhomes_user_name', updatedName);
        buyerData.name = updatedName;
        agentData.name = updatedName;
    }
    if (updatedEmail) {
        localStorage.setItem('realhomes_user_email', updatedEmail);
        buyerData.email = updatedEmail;
        agentData.email = updatedEmail;
    }

    // Refresh display
    const sidebarName = document.getElementById('dashSidebarName');
    const topbarName = document.getElementById('dashTopbarName');
    const buyerHeadingName = document.getElementById('buyerHeadingName');
    const agentHeadingName = document.getElementById('agentHeadingName');

    const activeName = updatedName || (currentRole === 'buyer' ? buyerData.name : agentData.name);
    if (sidebarName) sidebarName.textContent = activeName;
    if (topbarName) topbarName.textContent = activeName;
    if (buyerHeadingName) buyerHeadingName.textContent = activeName;
    if (agentHeadingName) agentHeadingName.textContent = activeName;

    showToast('Profile & preferences updated successfully!', 'success');
}

// Toast Feedback Notification Helper
function showToast(message, type = 'info') {
    const container = document.getElementById('dashToastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `dash-toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'danger') icon = 'fa-exclamation-circle';

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'dashToastContainer';
    container.className = 'dash-toast-container';
    document.body.appendChild(container);
    return container;
}

// Global Logout Handler
function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('realhomes_user_role');
        window.location.href = 'login.html';
    }
}

// Character Validation Rules for Dashboard Inputs
document.addEventListener('input', (e) => {
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;
    const type = (target.getAttribute('type') || '').toLowerCase();
    const id = (target.id || '').toLowerCase();
    const name = (target.name || '').toLowerCase();
    const placeholder = (target.placeholder || '').toLowerCase();

    // Phone: only numbers
    if (type === 'tel' || id.includes('phone') || name.includes('phone') || placeholder.includes('phone') || placeholder.includes('number')) {
        target.value = target.value.replace(/[^0-9]/g, '');
    }
    // Name: only letters & spaces (excluding price/sqft/search inputs)
    else if (type === 'text' && (id.includes('name') || name.includes('name') || placeholder.includes('name')) && !id.includes('search') && !id.includes('price')) {
        target.value = target.value.replace(/[^a-zA-Z\s]/g, '');
    }
}, true);

document.addEventListener('keypress', (e) => {
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;
    const type = (target.getAttribute('type') || '').toLowerCase();
    const id = (target.id || '').toLowerCase();
    const placeholder = (target.placeholder || '').toLowerCase();

    if (type === 'tel' || id.includes('phone') || placeholder.includes('phone') || placeholder.includes('number')) {
        if (!/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
            e.preventDefault();
        }
    } else if (type === 'text' && (id.includes('name') || placeholder.includes('name')) && !id.includes('search') && !id.includes('price')) {
        if (!/[a-zA-Z\s]/.test(e.key) && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
            e.preventDefault();
        }
    }
}, true);

