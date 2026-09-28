/**
 * Real Homes - Interactive JavaScript
 * Handles custom dropdowns, country flag selector, advance search toggle,
 * form submission, responsive navigation, property favorites/compare,
 * pagination, agent cards, newsletter signup, and the featured properties carousel slider.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Advanced Luxury Preloader ---
    initPreloader();

    // --- Dynamic Scrollbar & Progress Indicator ---
    initScrollProgressBar();

    // --- Hero Section Functions ---
    initHeroVideoCarousel();
    initCountrySelector();
    initSearchDropdowns();
    initAdvanceSearch();
    initCallForm();
    initMobileNav();
    initSearchAction();

    // --- Property & Agent Sections Functions ---
    initPropertyInteractions();
    initFeaturedCarousel();
    initPagination();
    initAgentCardInteractions();
    initNewsletterForm();
    initInputValidationRules();
    initScrollAnimations();
    initFloorPlanTabs();
    initPropertyVideoPlayer();
    initPropertySingleMap();
});

/* ==========================================================================
   0. Advanced Luxury Preloader
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('sitePreloader');
    if (!preloader) return;

    const progressFill = document.getElementById('preloaderProgressFill');
    const percentEl = document.getElementById('preloaderPercent');
    const statusText = document.getElementById('preloaderStatusText');

    const statusMessages = [
        'Curating Luxury Portfolios...',
        'Resolving Ultra-HD Floor Plans...',
        'Connecting Real-Time Agents...',
        'Welcome to Real Homes'
    ];

    let currentPercent = 0;
    let messageIndex = 0;
    const totalDuration = 1400; // 1.4s smooth load
    const stepTime = 25;
    const stepIncrement = 100 / (totalDuration / stepTime);

    // Rotate status messages smoothly
    const msgInterval = setInterval(() => {
        if (messageIndex < statusMessages.length - 1) {
            messageIndex++;
            if (statusText) {
                statusText.style.opacity = '0';
                setTimeout(() => {
                    statusText.textContent = statusMessages[messageIndex];
                    statusText.style.opacity = '1';
                }, 150);
            }
        }
    }, totalDuration / statusMessages.length);

    // Smooth percentage progress counter
    const progressTimer = setInterval(() => {
        currentPercent += stepIncrement;
        if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(progressTimer);
            clearInterval(msgInterval);

            if (progressFill) progressFill.style.width = '100%';
            if (percentEl) percentEl.textContent = '100%';
            if (statusText) statusText.textContent = 'Welcome to Real Homes';

            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 750);
            }, 300);
        } else {
            const rounded = Math.floor(currentPercent);
            if (progressFill) progressFill.style.width = rounded + '%';
            if (percentEl) percentEl.textContent = rounded + '%';
        }
    }, stepTime);
}

/* ==========================================================================
   1. Country Flag & Code Selector
   ========================================================================== */
function initCountrySelector() {
    const selector = document.getElementById('countryFlagSelector');
    const menu = document.getElementById('countryDropdownMenu');
    const flagDisplay = document.getElementById('selectedFlagDisplay');
    const phoneInput = document.getElementById('phoneNumberInput');

    if (!selector || !menu || !flagDisplay || !phoneInput) return;

    selector.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('show');
        closeAllDropdowns();
        if (!isOpen) {
            menu.classList.add('show');
            selector.classList.add('open');
        }
    });

    const options = menu.querySelectorAll('.country-option');
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const flag = option.getAttribute('data-flag') || '🇮🇳';
            const dialCode = option.getAttribute('data-dial') || '+91';

            flagDisplay.textContent = flag;
            phoneInput.placeholder = dialCode + ' Your Number';
            phoneInput.focus();

            menu.classList.remove('show');
            selector.classList.remove('open');
        });
    });
}

/* ==========================================================================
   2. Custom Search Dropdowns (Location, Status, Type)
   ========================================================================== */
function initSearchDropdowns() {
    const searchSegments = document.querySelectorAll('.search-segment, .re-search-segment, .blog-search-segment');

    searchSegments.forEach(segment => {
        // Toggle on segment click
        segment.addEventListener('click', (e) => {
            if (e.target.closest('.search-dropdown-options')) return;

            e.stopPropagation();
            const wasOpen = segment.classList.contains('open');
            closeAllDropdowns();

            if (!wasOpen) {
                segment.classList.add('open');
                segment.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard navigation
        segment.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const wasOpen = segment.classList.contains('open');
                closeAllDropdowns();
                if (!wasOpen) {
                    segment.classList.add('open');
                    segment.setAttribute('aria-expanded', 'true');
                }
            } else if (e.key === 'Escape') {
                segment.classList.remove('open');
                segment.setAttribute('aria-expanded', 'false');
            }
        });

        const options = segment.querySelectorAll('.search-option-item');
        const textDisplay = segment.querySelector('.selected-text');

        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');

                if (textDisplay) {
                    // Strip icon text if any and get clean text
                    const cleanText = opt.textContent.trim();
                    textDisplay.textContent = cleanText;
                }

                segment.classList.remove('open');
                segment.setAttribute('aria-expanded', 'false');
            });
        });
    });
}

/* ==========================================================================
   3. Advance Search Drawer Toggle
   ========================================================================== */
function initAdvanceSearch() {
    const advToggleBtns = document.querySelectorAll('#btnAdvSearchToggle, .btn-re-adv-toggle, .btn-blog-advance-filter, .btn-advance-search-toggle');
    const advDrawer = document.getElementById('advanceSearchDrawer');
    const advNote = document.getElementById('advanceSearchNote');

    advToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            if (advDrawer) {
                advDrawer.classList.toggle('show');
                const isShown = advDrawer.classList.contains('show');
                btn.setAttribute('aria-expanded', isShown ? 'true' : 'false');
                if (isShown) {
                    btn.style.backgroundColor = '#0e5e57';
                } else {
                    btn.style.backgroundColor = '';
                }
            } else {
                showToast('Advanced filters are currently ready.');
            }
        });
    });

    if (advNote && advDrawer) {
        advNote.style.cursor = 'pointer';
        advNote.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            advDrawer.classList.toggle('show');
        });
    }
}

/* ==========================================================================
   4. Call Request Form Submission & Toast
   ========================================================================== */
function initCallForm() {
    const form = document.getElementById('letUsCallForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('userNameInput');
        const phoneInput = document.getElementById('phoneNumberInput');
        const emailInput = document.getElementById('userEmailInput');
        const gdprCheck = document.getElementById('gdprCheckbox');
        const submitBtn = form.querySelector('.btn-submit-call');

        if (!nameInput.value.trim()) {
            showToast('Please enter your name.', true);
            nameInput.focus();
            return;
        }

        if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
            showToast('Please enter a valid email address.', true);
            emailInput.focus();
            return;
        }

        if (!gdprCheck.checked) {
            showToast('Please agree to the GDPR terms.', true);
            gdprCheck.focus();
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Request...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            showToast('Thank you ' + nameInput.value.trim() + '! Our property specialist will call you shortly.');
            form.reset();
        }, 1100);
    });
}

/* ==========================================================================
   5. Interactive Search Action & Live Property Filter
   ========================================================================== */
function initSearchAction() {
    const searchBtns = document.querySelectorAll('#btnMainSearch, #btnReSearchSubmit, #btnPropSearchSubmit, .btn-blog-search-submit');
    if (!searchBtns.length) return;

    searchBtns.forEach(searchBtn => {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Find closest search bar or fallback to document segments
            const wrapper = searchBtn.closest('.search-bar-wrapper, .re-search-bar-wrapper, .blog-search-bar-wrapper') || document;
            const locText = wrapper.querySelector('#locSegment .selected-text, #reLocSegment .selected-text, #propLocSegment .selected-text, #blogLocSegment .selected-text, .re-search-segment:nth-child(1) .selected-text, .blog-search-segment:nth-child(1) .selected-text')?.textContent.trim() || 'All Locations';
            const statText = wrapper.querySelector('#statusSegment .selected-text, #reStatusSegment .selected-text, #propStatusSegment .selected-text, #blogStatusSegment .selected-text, .re-search-segment:nth-child(2) .selected-text, .blog-search-segment:nth-child(2) .selected-text')?.textContent.trim() || 'Any';
            const typeText = wrapper.querySelector('#typeSegment .selected-text, #reTypeSegment .selected-text, #propTypeSegment .selected-text, #blogTypeSegment .selected-text, .re-search-segment:nth-child(3) .selected-text, .blog-search-segment:nth-child(3) .selected-text')?.textContent.trim() || 'All Types';
            
            const minPrice = document.getElementById('minPrice')?.value || '';
            const maxPrice = document.getElementById('maxPrice')?.value || '';
            const bedrooms = document.getElementById('bedrooms')?.value || '';
            const bathrooms = document.getElementById('bathrooms')?.value || '';

            // 1. Home Page Recent Properties Filtering
            const homeSection = document.getElementById('recentProperties');
            if (homeSection) {
                const cards = Array.from(homeSection.querySelectorAll('.property-card'));
                let matchedCount = 0;

                cards.forEach((card) => {
                    const cardLocation = (card.querySelector('.property-location')?.textContent || '').toLowerCase();
                    const cardTitle = (card.querySelector('.property-title')?.textContent || '').toLowerCase();
                    const cardPriceText = (card.querySelector('.property-price')?.textContent || '').replace(/[^0-9.]/g, '');
                    const cardPrice = parseFloat(cardPriceText) || 0;
                    const cardBedsText = card.querySelector('.spec-col:nth-child(1) .spec-value span')?.textContent || '0';
                    const cardBeds = parseInt(cardBedsText, 10) || 0;
                    const cardBathsText = card.querySelector('.spec-col:nth-child(2) .spec-value span')?.textContent || '0';
                    const cardBaths = parseFloat(cardBathsText) || 0;

                    let isMatch = true;

                    if (locText !== 'All Locations' && !locText.includes('All')) {
                        const locKey = locText.split(',')[0].trim().toLowerCase();
                        if (!cardLocation.includes(locKey) && !cardTitle.includes(locKey)) {
                            isMatch = false;
                        }
                    }

                    if (isMatch && statText !== 'Any' && !statText.includes('Any')) {
                        const isRent = statText.toLowerCase().includes('rent');
                        const isSale = statText.toLowerCase().includes('sale');
                        const isFeatured = statText.toLowerCase().includes('featured');

                        if (isRent && !card.querySelector('.price-suffix')) isMatch = false;
                        if (isSale && card.querySelector('.price-suffix')) isMatch = false;
                        if (isFeatured && !card.querySelector('.ribbon-featured')) isMatch = false;
                    }

                    if (isMatch && typeText !== 'All Types' && !typeText.includes('All')) {
                        const typeKey = typeText.toLowerCase();
                        if (!cardTitle.includes(typeKey) && !cardLocation.includes(typeKey)) {
                            if (typeKey.includes('villa') && !cardTitle.includes('villa') && !cardTitle.includes('home')) isMatch = false;
                        }
                    }

                    if (isMatch && minPrice && cardPrice < parseFloat(minPrice)) isMatch = false;
                    if (isMatch && maxPrice && cardPrice > parseFloat(maxPrice)) isMatch = false;
                    if (isMatch && bedrooms && cardBeds < parseInt(bedrooms, 10)) isMatch = false;
                    if (isMatch && bathrooms && cardBaths < parseFloat(bathrooms)) isMatch = false;

                    if (isMatch) {
                        card.style.display = '';
                        card.classList.add('revealed');
                        matchedCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (matchedCount === 0 && cards.length > 0) {
                    cards.slice(0, 2).forEach(c => {
                        c.style.display = '';
                        c.classList.add('revealed');
                    });
                    matchedCount = 2;
                }

                let banner = homeSection.querySelector('.search-results-feedback-banner');
                if (!banner) {
                    banner = document.createElement('div');
                    banner.className = 'search-results-feedback-banner';
                    const grid = homeSection.querySelector('.properties-grid');
                    if (grid) homeSection.querySelector('.section-container').insertBefore(banner, grid);
                }

                banner.innerHTML = `
                    <div class="results-text">
                        <i class="fas fa-filter"></i>
                        <span>Showing results for <strong>${locText}</strong> &bull; ${statText} &bull; ${typeText}</span>
                        <span class="results-count-badge">${matchedCount} Found</span>
                    </div>
                    <button type="button" class="btn-clear-search-filter" id="btnClearSearchFilter">
                        <i class="fas fa-times"></i> Clear Filters
                    </button>
                `;

                banner.querySelector('#btnClearSearchFilter')?.addEventListener('click', () => {
                    cards.forEach(c => {
                        c.style.display = '';
                        c.classList.add('revealed');
                    });
                    banner.remove();
                    showToast('All filters cleared.');
                });

                const targetTop = homeSection.getBoundingClientRect().top + window.pageYOffset - 20;
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });

                showToast(`Found ${matchedCount} properties matching your search criteria.`);
                return;
            }

            // 2. Real Estate Page Filtering
            const reSection = document.getElementById('reListingsSection');
            if (reSection) {
                const reCards = Array.from(reSection.querySelectorAll('.re-horizontal-card'));
                let matchedCount = 0;

                reCards.forEach((card) => {
                    const cardTitle = (card.querySelector('.re-card-title')?.textContent || '').toLowerCase();
                    const cardStatus = (card.querySelector('.re-price-status-type')?.textContent || '').toLowerCase();
                    const cardPriceText = (card.querySelector('.re-price-amount')?.textContent || '').replace(/[^0-9.]/g, '');
                    const cardPrice = parseFloat(cardPriceText) || 0;
                    const cardBedsText = card.querySelector('.re-specs-mini-table .re-spec-mini-col:nth-child(1) .re-spec-mini-val')?.textContent || '0';
                    const cardBeds = parseInt(cardBedsText.replace(/[^0-9]/g, ''), 10) || 0;
                    const cardBathsText = card.querySelector('.re-specs-mini-table .re-spec-mini-col:nth-child(2) .re-spec-mini-val')?.textContent || '0';
                    const cardBaths = parseFloat(cardBathsText.replace(/[^0-9.]/g, '')) || 0;

                    let isMatch = true;

                    if (locText !== 'All Locations' && !locText.includes('All')) {
                        const locKey = locText.split(',')[0].trim().toLowerCase();
                        if (!cardTitle.includes(locKey)) {
                            isMatch = false;
                        }
                    }

                    if (isMatch && statText !== 'Any' && !statText.includes('Any')) {
                        const isRent = statText.toLowerCase().includes('rent');
                        const isSale = statText.toLowerCase().includes('sale');
                        const isFeatured = statText.toLowerCase().includes('featured');

                        if (isRent && !cardStatus.includes('rent')) isMatch = false;
                        if (isSale && !cardStatus.includes('sale')) isMatch = false;
                        if (isFeatured && !card.querySelector('.re-corner-ribbon-featured')) isMatch = false;
                    }

                    if (isMatch && typeText !== 'All Types' && !typeText.includes('All')) {
                        const typeKey = typeText.toLowerCase();
                        if (!cardTitle.includes(typeKey)) {
                            if (typeKey.includes('single') && !cardTitle.includes('home')) isMatch = false;
                        }
                    }

                    if (isMatch && minPrice && cardPrice < parseFloat(minPrice)) isMatch = false;
                    if (isMatch && maxPrice && cardPrice > parseFloat(maxPrice)) isMatch = false;
                    if (isMatch && bedrooms && cardBeds < parseInt(bedrooms, 10)) isMatch = false;
                    if (isMatch && bathrooms && cardBaths < parseFloat(bathrooms)) isMatch = false;

                    if (isMatch) {
                        card.style.display = '';
                        card.classList.add('revealed');
                        matchedCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (matchedCount === 0 && reCards.length > 0) {
                    reCards.slice(0, 2).forEach(c => {
                        c.style.display = '';
                        c.classList.add('revealed');
                    });
                    matchedCount = 2;
                }

                // Update counter
                const counter = reSection.querySelector('.re-results-counter');
                if (counter) {
                    counter.innerHTML = `<span class="highlight-num">1</span> to <span class="highlight-num">${matchedCount}</span> out of <span class="total-num">${matchedCount}</span> properties`;
                }

                let banner = reSection.querySelector('.search-results-feedback-banner');
                if (!banner) {
                    banner = document.createElement('div');
                    banner.className = 'search-results-feedback-banner';
                    const stack = reSection.querySelector('.re-list-cards-stack');
                    if (stack) reSection.querySelector('.section-container').insertBefore(banner, stack);
                }

                banner.innerHTML = `
                    <div class="results-text">
                        <i class="fas fa-filter"></i>
                        <span>Showing results for <strong>${locText}</strong> &bull; ${statText} &bull; ${typeText}</span>
                        <span class="results-count-badge">${matchedCount} Properties</span>
                    </div>
                    <button type="button" class="btn-clear-search-filter" id="btnClearReFilter">
                        <i class="fas fa-times"></i> Clear Filters
                    </button>
                `;

                banner.querySelector('#btnClearReFilter')?.addEventListener('click', () => {
                    reCards.forEach(c => {
                        c.style.display = '';
                        c.classList.add('revealed');
                    });
                    banner.remove();
                    if (counter) {
                        counter.innerHTML = `<span class="highlight-num">1</span> to <span class="highlight-num">6</span> out of <span class="total-num">13</span> properties`;
                    }
                    showToast('All property filters cleared.');
                });

                const targetTop = reSection.getBoundingClientRect().top + window.pageYOffset - 20;
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });

                showToast(`Found ${matchedCount} properties matching your criteria.`);
                return;
            }

            // 3. Property Page / Blog Page / Generic Search Action
            const similarSection = document.getElementById('similarPropertiesSection');
            if (similarSection) {
                const simCards = Array.from(similarSection.querySelectorAll('.similar-card'));
                let matched = 0;
                simCards.forEach(card => {
                    const title = (card.querySelector('.similar-card-prop-title')?.textContent || '').toLowerCase();
                    const status = (card.querySelector('.similar-card-price-type')?.textContent || '').toLowerCase();
                    let match = true;
                    if (statText !== 'Any' && !statText.includes('Any')) {
                        if (statText.toLowerCase().includes('rent') && !status.includes('rent')) match = false;
                        if (statText.toLowerCase().includes('sale') && !status.includes('sale')) match = false;
                    }
                    if (typeText !== 'All Types' && !typeText.includes('All')) {
                        if (!title.includes(typeText.toLowerCase())) match = false;
                    }
                    if (match) {
                        card.style.display = '';
                        matched++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (matched === 0 && simCards.length > 0) {
                    simCards.forEach(c => c.style.display = '');
                    matched = simCards.length;
                }

                const targetTop = similarSection.getBoundingClientRect().top + window.pageYOffset - 20;
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
                showToast(`Filtering similar properties for ${locText} (${statText} - ${typeText}).`);
                return;
            }

            const blogGrid = document.querySelector('.blog-posts-grid');
            if (blogGrid) {
                const blogPosts = Array.from(blogGrid.querySelectorAll('.blog-post-card'));
                let matched = 0;
                blogPosts.forEach(post => {
                    const title = (post.querySelector('.blog-post-title')?.textContent || '').toLowerCase();
                    const excerpt = (post.querySelector('.blog-post-excerpt')?.textContent || '').toLowerCase();
                    let match = true;
                    if (locText !== 'All Locations' && !locText.includes('All')) {
                        const locKey = locText.split(',')[0].trim().toLowerCase();
                        if (!title.includes(locKey) && !excerpt.includes(locKey)) match = false;
                    }
                    if (match) {
                        post.style.display = '';
                        matched++;
                    } else {
                        post.style.display = 'none';
                    }
                });

                if (matched === 0 && blogPosts.length > 0) {
                    blogPosts.forEach(p => p.style.display = '');
                    matched = blogPosts.length;
                }

                showToast(`Searching articles for ${locText} (${statText} - ${typeText}).`);
                return;
            }

            showToast(`Searching properties in ${locText} (${statText} - ${typeText})...`);
        });
    });
}

/* ==========================================================================
   6. Mobile Navigation Toggle & Scroll Lock
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const mainNav = document.getElementById('mainNav');

    if (!toggle || !mainNav) return;

    function setMenuState(open) {
        if (open) {
            mainNav.classList.add('mobile-active');
            document.body.classList.add('mobile-menu-open');
            document.documentElement.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            const icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas fa-times';
        } else {
            mainNav.classList.remove('mobile-active');
            document.body.classList.remove('mobile-menu-open');
            document.documentElement.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            const icon = toggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const shouldOpen = !mainNav.classList.contains('mobile-active');
        setMenuState(shouldOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('mobile-active') && !mainNav.contains(e.target) && !toggle.contains(e.target)) {
            setMenuState(false);
        }
    });

    // Close menu when clicking any link inside
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    // Close menu and restore scroll on desktop resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && mainNav.classList.contains('mobile-active')) {
            setMenuState(false);
        }
    });
}

/* ==========================================================================
   7. Property Cards Favorite & Compare Actions
   ========================================================================== */
function initPropertyInteractions() {
    // Favorite hearts toggle
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = btn.querySelector('i');
            const card = btn.closest('.property-card') || btn.closest('.featured-showcase-slide');
            const title = card?.querySelector('.property-title, .featured-title')?.textContent.trim() || 'Property';

            if (icon.classList.contains('far')) {
                icon.className = 'fas fa-heart text-danger';
                btn.classList.add('active');
                showToast('Added "' + title + '" to your favorites!');
            } else {
                icon.className = 'far fa-heart';
                btn.classList.remove('active');
                showToast('Removed "' + title + '" from favorites.');
            }
        });
    });

    // Compare button toggle
    document.querySelectorAll('.btn-compare').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            const card = btn.closest('.property-card') || btn.closest('.featured-showcase-slide');
            const title = card?.querySelector('.property-title, .featured-title')?.textContent.trim() || 'Property';

            if (btn.classList.contains('active')) {
                showToast('Added "' + title + '" to comparison list.');
            } else {
                showToast('Removed "' + title + '" from comparison.');
            }
        });
    });
}

/* ==========================================================================
   8. Featured Properties Carousel Slider
   ========================================================================== */
const featuredSlidesData = [
    {
        title: 'Home in Coral Gables',
        description: 'Elegant retreat in a quiet Coral Gables setting. This home provides wonderful entertaining spaces with a chef\'s kitchen opening to...',
        bedrooms: 4,
        bathrooms: 4.5,
        area: '3800 Sq Ft',
        status: 'For Sale',
        price: '$825,000.00',
        image: 'assets/images/featured-1.webp'
    },
    {
        title: 'Modern Villa in Merrick Way',
        description: 'Spectacular contemporary estate with luxury lighting, infinity pool, custom architectural styling and smart home automation throughout.',
        bedrooms: 5,
        bathrooms: 5.5,
        area: '5200 Sq Ft',
        status: 'For Sale',
        price: '$1,250,000.00',
        image: 'assets/images/property-1.webp'
    },
    {
        title: 'Grand Sunset Estate',
        description: 'Ultra-luxury Mediterranean villa overlooking panoramic views, with resort-style pool, manicured gardens and private courtyard driveway.',
        bedrooms: 6,
        bathrooms: 7,
        area: '9350 Sq Ft',
        status: 'For Sale',
        price: '$1,890,000.00',
        image: 'assets/images/property-3.webp'
    }
];

let currentFeaturedIndex = 0;

function initFeaturedCarousel() {
    const prevBtn = document.getElementById('featuredPrev');
    const nextBtn = document.getElementById('featuredNext');

    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        currentFeaturedIndex = (currentFeaturedIndex - 1 + featuredSlidesData.length) % featuredSlidesData.length;
        renderFeaturedSlide(currentFeaturedIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredSlidesData.length;
        renderFeaturedSlide(currentFeaturedIndex);
    });
}

function renderFeaturedSlide(index) {
    const data = featuredSlidesData[index];
    const container = document.querySelector('.featured-showcase-container');
    if (!container || !data) return;

    // Smooth fade effect
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.25s ease';

    setTimeout(() => {
        const img = container.querySelector('.featured-main-img');
        const title = container.querySelector('.featured-title a');
        const desc = container.querySelector('.featured-description');
        const beds = container.querySelector('.spec-col:nth-child(1) .spec-value span');
        const baths = container.querySelector('.spec-col:nth-child(2) .spec-value span');
        const area = container.querySelector('.spec-col:nth-child(3) .spec-value span');
        const status = container.querySelector('.price-box .status-type');
        const price = container.querySelector('.price-box .price-value');

        if (img) img.src = data.image;
        if (title) title.textContent = data.title;
        if (desc) desc.textContent = data.description;
        if (beds) beds.textContent = data.bedrooms;
        if (baths) baths.textContent = data.bathrooms;
        if (area) area.innerHTML = data.area.split(' ')[0] + ' <small>Sq Ft</small>';
        if (status) status.textContent = data.status;
        if (price) price.textContent = data.price;

        container.style.opacity = '1';
    }, 250);
}

/* ==========================================================================
   9. Agent Card Interactive Actions
   ========================================================================== */
function initAgentCardInteractions() {
    document.querySelectorAll('.agent-box-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-6px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

/* ==========================================================================
   10. Newsletter Form Submission
   ========================================================================== */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletterEmailInput');
        if (!emailInput || !validateEmail(emailInput.value.trim())) {
            showToast('Please enter a valid email address.', true);
            return;
        }

        const submitBtn = form.querySelector('.btn-newsletter-signup');
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
            showToast('Thank you! You are now subscribed to our newsletter.');
            form.reset();
        }, 1000);
    });
}

/* ==========================================================================
   11. Pagination Action
   ========================================================================== */
function initPagination() {
    const pageButtons = document.querySelectorAll('.properties-pagination .page-num');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.properties-pagination');
            parent.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast('Loaded Page ' + btn.textContent.trim() + ' Properties');
        });
    });
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */
function closeAllDropdowns() {
    document.querySelectorAll('.country-dropdown-menu').forEach(m => m.classList.remove('show'));
    document.querySelectorAll('.country-flag-selector').forEach(s => s.classList.remove('open'));
    document.querySelectorAll('.search-segment, .re-search-segment, .blog-search-segment').forEach(s => s.classList.remove('open'));
}

document.addEventListener('click', () => {
    closeAllDropdowns();
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, isError = false) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }

    toast.className = 'toast-notification ' + (isError ? 'error' : 'success');
    toast.innerHTML = '<i class="fas ' + (isError ? 'fa-exclamation-circle' : 'fa-check-circle') + '"></i> <span>' + message + '</span>';
    
    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
/* ==========================================================================
   12. Real Estate Interactive Map (Leaflet.js)
   ========================================================================== */
function initRealEstateMap() {
    const mapContainer = document.getElementById('reInteractiveMap');
    if (!mapContainer || typeof L === 'undefined') return;

    // Miami, Florida Coordinates
    const miamiCoords = [25.7617, -80.1918];
    const map = L.map('reInteractiveMap', {
        center: [25.72, -80.26],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false
    });

    // Street Tile Layer (OpenStreetMap / CartoDB Positron for clean look matching screenshot)
    const streetTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
    }).addTo(map);

    // Satellite Tile Layer (Esri World Imagery)
    const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18
    });

    // Map & Satellite Toggle Buttons
    const btnMap = document.getElementById('btnMapDefault');
    const btnSatellite = document.getElementById('btnMapSatellite');

    if (btnMap && btnSatellite) {
        btnMap.addEventListener('click', () => {
            btnMap.classList.add('active');
            btnSatellite.classList.remove('active');
            map.removeLayer(satelliteTiles);
            map.addLayer(streetTiles);
        });

        btnSatellite.addEventListener('click', () => {
            btnSatellite.classList.add('active');
            btnMap.classList.remove('active');
            map.removeLayer(streetTiles);
            map.addLayer(satelliteTiles);
        });
    }

    // Property Pin Markers matching screenshot locations
    const markersData = [
        { lat: 25.7617, lng: -80.1918, label: '2', type: 'cluster', title: 'Miami Downtown (2 Properties)' },
        { lat: 25.8150, lng: -80.3100, icon: 'fa-home', type: 'single', title: 'Doral Villa ($540,000)' },
        { lat: 25.6866, lng: -80.3163, icon: 'fa-home', type: 'single', title: 'Kendall Estate ($825,000)' },
        { lat: 25.6200, lng: -80.3200, icon: 'fa-building', type: 'single', title: 'Palmetto Bay Luxury House' },
        { lat: 25.6000, lng: -80.2900, label: '2', type: 'cluster', title: 'Cutler Bay Properties' }
    ];

    markersData.forEach(item => {
        const pinHtml = item.type === 'cluster' 
            ? `<div class="custom-map-pin pin-icon-cluster">${item.label}</div>`
            : `<div class="custom-map-pin pin-icon-single"><i class="fas ${item.icon}"></i></div>`;

        const customIcon = L.divIcon({
            html: pinHtml,
            className: 're-map-marker-container',
            iconSize: item.type === 'cluster' ? [42, 42] : [38, 38],
            iconAnchor: [20, 20]
        });

        const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`<strong>${item.title}</strong><br><a href="#" style="color:#1ea69a;font-weight:600;">View Details</a>`);
    });
}

// Attach to document ready
document.addEventListener('DOMContentLoaded', () => {
    initRealEstateMap();
});
/* ==========================================================================
   13. Single Property Detail Slider (Villa on Grand Avenue)
   ========================================================================== */
function initPropertyDetailSlider() {
    const mainImg = document.getElementById('propMainSlideImg');
    const prevBtn = document.getElementById('propSlidePrev');
    const nextBtn = document.getElementById('propSlideNext');

    if (!mainImg || !prevBtn || !nextBtn) return;

    const propertySlides = [
        'assets/images/single-property-slide-1.webp',
        'assets/images/single-property-slide-2.webp',
        'assets/images/re-list-prop-1.webp',
        'assets/images/re-list-prop-2.webp'
    ];

    let currentSlideIdx = 0;

    const switchSlide = (idx) => {
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
            mainImg.src = propertySlides[idx];
            mainImg.style.opacity = '1';
        }, 150);
    };

    prevBtn.addEventListener('click', () => {
        currentSlideIdx = (currentSlideIdx - 1 + propertySlides.length) % propertySlides.length;
        switchSlide(currentSlideIdx);
    });

    nextBtn.addEventListener('click', () => {
        currentSlideIdx = (currentSlideIdx + 1) % propertySlides.length;
        switchSlide(currentSlideIdx);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPropertyDetailSlider();
});
/* ==========================================================================
   14. Property Detail Page Forms (Agent Message & Tour Scheduling)
   ========================================================================== */
function initPropertyDetailInteractions() {
    // Agent Sidebar Contact Form
    const agentForm = document.getElementById('agentSidebarMsgForm');
    if (agentForm) {
        agentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = agentForm.querySelector('.btn-agent-send-msg');
            const origText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = origText;
                submitBtn.disabled = false;
                showToast('Thank you! Your message has been sent to Agent Nathan James.');
                agentForm.reset();
            }, 1000);
        });
    }

    // Schedule Tour Form
    const tourForm = document.getElementById('scheduleTourForm');
    if (tourForm) {
        tourForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = tourForm.querySelector('.btn-submit-tour');
            const origText = submitBtn.textContent;

            submitBtn.textContent = 'Scheduling...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
                showToast('Tour scheduled successfully! We will confirm your appointment via email.');
                tourForm.reset();
            }, 1000);
        });

        // Tour Type Toggle (In-Person vs Video Chat)
        const btnInPerson = document.getElementById('btnTourInPerson');
        const btnVideo = document.getElementById('btnTourVideo');
        if (btnInPerson && btnVideo) {
            btnInPerson.addEventListener('click', () => {
                btnInPerson.classList.add('active');
                btnVideo.classList.remove('active');
            });
            btnVideo.addEventListener('click', () => {
                btnVideo.classList.add('active');
                btnInPerson.classList.remove('active');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initPropertyDetailInteractions();
});
/* ==========================================================================
   15. Similar Properties Filter Tabs
   ========================================================================== */
function initSimilarPropertiesTabs() {
    const tabs = document.querySelectorAll('.btn-similar-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showToast('Filtered Similar Properties by: ' + tab.textContent.trim());
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSimilarPropertiesTabs();
});

/* ==========================================================================
   16. Global Input Field Character Filters
   - Phone Inputs: Allow ONLY numbers (0-9). Strip/block all letters and symbols.
   - Name Inputs: Allow ONLY letters (A-Z, a-z) and spaces. Strip/block all numbers.
   ========================================================================== */
function initInputValidationRules() {
    // 1. Phone number inputs listener (digits only, no letters)
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target && isPhoneInput(target)) {
            const sanitized = target.value.replace(/[^0-9]/g, '');
            if (target.value !== sanitized) {
                target.value = sanitized;
            }
        } else if (target && isNameInput(target)) {
            const sanitized = target.value.replace(/[^a-zA-Z\s]/g, '');
            if (target.value !== sanitized) {
                target.value = sanitized;
            }
        }
    }, true);

    // 2. Prevent invalid keypress directly
    document.addEventListener('keypress', (e) => {
        const target = e.target;
        if (target && isPhoneInput(target)) {
            // Allow only numbers 0-9
            if (!/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
                e.preventDefault();
            }
        } else if (target && isNameInput(target)) {
            // Allow only letters a-z, A-Z, and space
            if (!/[a-zA-Z\s]/.test(e.key) && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
                e.preventDefault();
            }
        }
    }, true);

    // 3. Clean on paste
    document.addEventListener('paste', (e) => {
        const target = e.target;
        if (target && (isPhoneInput(target) || isNameInput(target))) {
            setTimeout(() => {
                if (isPhoneInput(target)) {
                    target.value = target.value.replace(/[^0-9]/g, '');
                } else if (isNameInput(target)) {
                    target.value = target.value.replace(/[^a-zA-Z\s]/g, '');
                }
            }, 0);
        }
    }, true);
}

function isPhoneInput(input) {
    if (!input || input.tagName !== 'INPUT') return false;
    const type = (input.getAttribute('type') || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const className = (input.className || '').toLowerCase();

    return type === 'tel' ||
           id.includes('phone') ||
           name.includes('phone') ||
           placeholder.includes('phone') ||
           placeholder.includes('number') ||
           className.includes('phone');
}

function isNameInput(input) {
    if (!input || input.tagName !== 'INPUT') return false;
    const type = (input.getAttribute('type') || '').toLowerCase();
    if (type !== 'text') return false;

    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const className = (input.className || '').toLowerCase();

    // Avoid search bars or email inputs
    if (placeholder.includes('search') || placeholder.includes('email') || id.includes('search') || id.includes('email') || id.includes('price')) return false;

    return id.includes('name') ||
           name.includes('name') ||
           placeholder.includes('name') ||
           className.includes('name');
}

document.addEventListener('DOMContentLoaded', () => {
    initInputValidationRules();
    initScrollAnimations();
    initFloorPlanTabs();
});

/* ==========================================================================
   16b. Dynamic Scroll Progress Bar & Scroll-To-Top Button
   ========================================================================== */
function initScrollProgressBar() {
    // 1. Inject Top Progress Indicator Bar if not present
    let progressBar = document.getElementById('siteScrollProgressBar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'siteScrollProgressBar';
        progressBar.className = 'site-scroll-progress-bar';
        document.body.appendChild(progressBar);
    }

    // 2. Inject Scroll-To-Top Button with Circular Progress Ring if not present
    let scrollTopBtn = document.getElementById('siteScrollTopBtn');
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.id = 'siteScrollTopBtn';
        scrollTopBtn.className = 'site-scroll-top-btn';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollTopBtn.setAttribute('title', 'Back to top');
        scrollTopBtn.innerHTML = `
            <svg class="scroll-progress-ring" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="23"></circle>
            </svg>
            <i class="fas fa-chevron-up"></i>
        `;
        document.body.appendChild(scrollTopBtn);
    }

    const circle = scrollTopBtn.querySelector('circle');
    const circumference = 2 * Math.PI * 23; // ~144.51
    if (circle) {
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;
    }

    let isScrollingTimeout = null;
    let ticking = false;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        const progressPercent = Math.min(Math.max(progress * 100, 0), 100);

        // Update Top Bar
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }

        // Update Circular Ring on Scroll Button
        if (circle) {
            const offset = circumference - (progress * circumference);
            circle.style.strokeDashoffset = `${offset}`;
        }

        // Toggle Scroll-to-Top Button Visibility
        if (scrollTopBtn) {
            if (scrollTop > 280) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        // Toggle Sticky Navigation Bar on Scroll
        const header = document.querySelector('.site-header, .site-header-re');
        if (header) {
            if (scrollTop > 80) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        }

        // Add Active Glow on Scrollbar Thumb
        document.body.classList.add('is-scrolling');
        clearTimeout(isScrollingTimeout);
        isScrollingTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 600);

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    // Initial calculation
    handleScroll();

    // Scroll to Top Smoothly
    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   17. Scroll-Triggered Reveal Animations (Content Enters Smoothly from TOP)
   ========================================================================== */
function initScrollAnimations() {
    // Collect all elements intended for reveal
    const animElements = document.querySelectorAll(
        '.scroll-reveal-fade, .scroll-reveal-top, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-card, .scroll-reveal-section, .section-heading-wrap, .property-card, .agent-box-card, .feature-card, .news-card, .cta-choice-card, .partner-logo-card, .buy-sell-card, .testimonial-container, .footer-col'
    );
    if (!animElements.length) return;

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -30px 0px',
            threshold: 0.08
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animElements.forEach(el => {
            // Ensure classes are present for top reveal styling
            if (!el.classList.contains('scroll-reveal-card') && 
                !el.classList.contains('scroll-reveal-fade') && 
                !el.classList.contains('scroll-reveal-left') && 
                !el.classList.contains('scroll-reveal-right') &&
                !el.classList.contains('scroll-reveal-top')) {
                el.classList.add('scroll-reveal-top');
            }

            // If already in initial viewport on page load, reveal immediately
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
                el.classList.add('revealed');
            } else {
                observer.observe(el);
            }
        });
    } else {
        // Fallback for older browsers
        animElements.forEach(el => el.classList.add('revealed'));
    }
}

/* ==========================================================================
   18. Property Detail Floor Plan Level Switcher
   ========================================================================== */
function initFloorPlanTabs() {
    const tabs = document.querySelectorAll('.btn-floor-tab');
    const activeImg = document.getElementById('floorPlanActiveImg');
    const expandBtn = document.getElementById('floorPlanExpandBtn');
    if (!tabs.length || !activeImg) return;

    const floorImages = {
        'floorMain': 'assets/images/prop-floor-plan.webp',
        'floorUpper': 'assets/images/prop-floor-plan-upper.webp'
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-target');
            if (floorImages[target]) {
                activeImg.style.opacity = '0.3';
                setTimeout(() => {
                    activeImg.src = floorImages[target];
                    if (expandBtn) expandBtn.href = floorImages[target];
                    activeImg.style.opacity = '1';
                }, 180);
            }
        });
    });
}

/* ==========================================================================
   19. Property Tour Video Player & Slow-Motion Controller
   ========================================================================== */
function initPropertyVideoPlayer() {
    const video = document.getElementById('propTourVideo');
    const container = document.getElementById('propVideoContainer');
    const overlay = document.getElementById('propVideoOverlay');
    const playPulseBtn = document.getElementById('propVideoPlayBtn');
    const ctrlPlayBtn = document.getElementById('btnCtrlPlayPause');
    const ctrlMuteBtn = document.getElementById('btnCtrlMute');
    const ctrlSlowMoBtn = document.getElementById('btnCtrlSlowMo');
    const topSlowMoBtn = document.getElementById('videoSpeedToggle');
    const speedLabel = document.getElementById('speedLabel');
    const fullscreenBtn = document.getElementById('btnCtrlFullscreen');
    const progressBar = document.getElementById('videoProgressBar');
    const progressWrap = document.getElementById('videoProgressWrap');
    const timeDisplay = document.getElementById('videoTimeDisplay');

    if (!video || !container) return;

    // Set default playback rate to 0.75 for smooth cinematic slow-motion effect
    let isSlowMo = true;
    video.playbackRate = 0.75;
    if (topSlowMoBtn) topSlowMoBtn.classList.add('active');
    if (ctrlSlowMoBtn) ctrlSlowMoBtn.classList.add('active');

    function togglePlay() {
        if (video.paused || video.ended) {
            video.play().then(() => {
                if (overlay) overlay.classList.add('hidden');
                if (ctrlPlayBtn) ctrlPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(err => {
                console.log('Video play prevented:', err);
            });
        } else {
            video.pause();
            if (ctrlPlayBtn) ctrlPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    if (playPulseBtn) playPulseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    if (overlay) overlay.addEventListener('click', () => {
        togglePlay();
    });

    if (ctrlPlayBtn) ctrlPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    // Mute / Unmute
    if (ctrlMuteBtn) {
        ctrlMuteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            ctrlMuteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        });
    }

    // Toggle Slow-Motion mode
    function toggleSlowMotion() {
        isSlowMo = !isSlowMo;
        video.playbackRate = isSlowMo ? 0.75 : 1.0;
        
        if (topSlowMoBtn) {
            topSlowMoBtn.classList.toggle('active', isSlowMo);
            if (speedLabel) speedLabel.textContent = isSlowMo ? 'Slow-Mo 0.75x' : 'Normal 1.0x';
        }
        if (ctrlSlowMoBtn) {
            ctrlSlowMoBtn.classList.toggle('active', isSlowMo);
            ctrlSlowMoBtn.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${isSlowMo ? '0.75x' : '1.0x'}`;
        }
        showToast(isSlowMo ? 'Cinematic Slow-Motion Mode (0.75x) Activated' : 'Normal Playback Speed (1.0x) Activated');
    }

    if (topSlowMoBtn) topSlowMoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSlowMotion();
    });

    if (ctrlSlowMoBtn) ctrlSlowMoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSlowMotion();
    });

    // Fullscreen Toggle
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }

    // Progress updates
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    video.addEventListener('timeupdate', () => {
        if (!isNaN(video.duration) && video.duration > 0) {
            const percent = (video.currentTime / video.duration) * 100;
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
    });

    video.addEventListener('loadedmetadata', () => {
        if (timeDisplay) timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    });

    // Seek on progress click
    if (progressWrap) {
        progressWrap.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = progressWrap.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (!isNaN(video.duration)) {
                video.currentTime = pos * video.duration;
            }
        });
    }

    // Video Ended
    video.addEventListener('ended', () => {
        if (overlay) overlay.classList.remove('hidden');
        if (ctrlPlayBtn) ctrlPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (progressBar) progressBar.style.width = '0%';
    });
}

/* ==========================================================================
   20. Property Single Leaflet Interactive Map (Crystal-Clear)
   ========================================================================== */
function initPropertySingleMap() {
    const mapContainer = document.getElementById('propSingleLeafletMap');
    if (!mapContainer || typeof L === 'undefined') return;

    // Villa on Grand Avenue, Coconut Grove, Miami, FL Coordinates
    const propCoords = [25.7289, -80.2589];

    // Initialize Map with smooth zoom and crisp rendering
    const map = L.map('propSingleLeafletMap', {
        center: propCoords,
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false
    });

    // Street Tile Layer (CartoDB Positron - ultra-crisp, high contrast typography)
    const streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        detectRetina: true
    }).addTo(map);

    // Satellite Imagery Layer (Esri World Imagery)
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
        detectRetina: true
    });

    // Custom Glowing Marker Icon
    const customIcon = L.divIcon({
        className: 'custom-map-marker-wrap',
        html: '<div class="custom-map-pin"><i class="fas fa-home"></i></div>',
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -42]
    });

    // Add Marker with rich Popup
    const marker = L.marker(propCoords, { icon: customIcon }).addTo(map);
    const popupContent = `
        <div style="font-family: inherit; min-width: 180px; padding: 4px;">
            <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #1e2530;">Villa on Grand Avenue</h4>
            <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;"><i class="fas fa-map-marker-alt" style="color:#1ea69a;"></i> 3015 Grand Ave, Miami</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size: 14px; font-weight: 700; color: #1ea69a;">$4,750 / mo</span>
                <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600;">For Rent</span>
            </div>
        </div>
    `;
    marker.bindPopup(popupContent).openPopup();

    // Map Layer Switcher Buttons
    const btnStreets = document.getElementById('btnMapStreets');
    const btnSatellite = document.getElementById('btnMapSatellite');
    const btnRecenter = document.getElementById('btnMapRecenter');

    if (btnStreets && btnSatellite) {
        btnStreets.addEventListener('click', () => {
            btnStreets.classList.add('active');
            btnSatellite.classList.remove('active');
            if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
            if (!map.hasLayer(streetLayer)) map.addLayer(streetLayer);
        });

        btnSatellite.addEventListener('click', () => {
            btnSatellite.classList.add('active');
            btnStreets.classList.remove('active');
            if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
            if (!map.hasLayer(satelliteLayer)) map.addLayer(satelliteLayer);
        });
    }

    if (btnRecenter) {
        btnRecenter.addEventListener('click', () => {
            map.flyTo(propCoords, 16, { duration: 1.2 });
            marker.openPopup();
        });
    }

    // Invalidate size on load to ensure crisp tile boundaries
    setTimeout(() => {
        map.invalidateSize();
    }, 400);
}

/* ==========================================================================
   14. Hero 5 Slow-Motion Video Showcase Carousel (5 to 8s Rotation)
   ========================================================================== */
function initHeroVideoCarousel() {
    const container = document.getElementById('heroVideoBgContainer');
    if (!container) return;

    const slides = Array.from(container.querySelectorAll('.hero-video-slide'));
    if (!slides.length) return;

    const SLIDE_DURATION = 7000; // Exactly 7 seconds per video
    const SLOW_MO_RATE = 0.8;    // 0.8x playback speed for cinematic slow motion

    // HUD Elements
    const hudTitle = document.getElementById('hudPropertyTitle');
    const hudType = document.getElementById('hudPropertyType');
    const hudLocation = document.getElementById('hudPropertyLocation');
    const hudPrice = document.getElementById('hudPropertyPrice');
    const hudCounter = document.getElementById('hudCounterCurrent');
    const prevBtn = document.getElementById('heroVideoPrevBtn');
    const nextBtn = document.getElementById('heroVideoNextBtn');
    const playPauseBtn = document.getElementById('heroVideoPlayPauseBtn');
    const segmentItems = Array.from(document.querySelectorAll('.hero-progress-segment'));

    let currentIndex = 0;
    let isPlaying = true;
    let slideTimer = null;
    let progressRaf = null;
    let slideStartTime = Date.now();
    let elapsedBeforePause = 0;

    // Configure all videos with slow-mo rate and error listeners
    slides.forEach((slide) => {
        const video = slide.querySelector('video');
        if (video) {
            video.playbackRate = SLOW_MO_RATE;
            video.muted = true;
            video.playsInline = true;
            // Handle when video metadata loads
            video.addEventListener('loadedmetadata', () => {
                video.playbackRate = SLOW_MO_RATE;
            });
        }
    });

    /**
     * Updates HUD card property metadata
     */
    function updateHud(slideIndex) {
        const slide = slides[slideIndex];
        if (!slide) return;

        const title = slide.getAttribute('data-title') || 'Luxury Property';
        const type = slide.getAttribute('data-type') || 'Exclusive Estate';
        const location = slide.getAttribute('data-location') || 'Global Location';
        const price = slide.getAttribute('data-price') || '$5,000,000+';

        if (hudTitle) {
            hudTitle.style.opacity = '0';
            setTimeout(() => {
                hudTitle.textContent = title;
                hudTitle.style.opacity = '1';
            }, 120);
        }

        if (hudType) {
            hudType.style.opacity = '0';
            setTimeout(() => {
                hudType.textContent = type;
                hudType.style.opacity = '1';
            }, 120);
        }

        if (hudLocation) hudLocation.textContent = location;
        if (hudPrice) hudPrice.textContent = price;
        if (hudCounter) hudCounter.textContent = String(slideIndex + 1).padStart(2, '0');
    }

    /**
     * Updates segment indicators and progress bar
     */
    function updateSegments(slideIndex, progressPercent = 0) {
        segmentItems.forEach((segment, idx) => {
            const fillBar = segment.querySelector('.progress-fill-bar');
            
            if (idx < slideIndex) {
                segment.classList.remove('active');
                segment.classList.add('completed');
                if (fillBar) {
                    fillBar.style.setProperty('--progress-w', '100%');
                    fillBar.querySelector('::after') || (fillBar.firstElementChild ? fillBar.firstElementChild.style.width = '100%' : null);
                    fillBar.style.width = '100%'; // fallback
                }
            } else if (idx === slideIndex) {
                segment.classList.add('active');
                segment.classList.remove('completed');
            } else {
                segment.classList.remove('active', 'completed');
                if (fillBar) fillBar.style.width = '100%';
            }
        });
    }

    /**
     * Smoothly switches to the target video slide index
     */
    function goToSlide(targetIndex, restartTimer = true) {
        if (targetIndex === currentIndex && slides[currentIndex].classList.contains('active')) {
            // Already active, just ensure video is playing
            const currentVideo = slides[currentIndex].querySelector('video');
            if (currentVideo && isPlaying && currentVideo.paused) {
                currentVideo.play().catch(() => {});
            }
            return;
        }

        // 1. Pause and prepare previous active slide
        const prevSlide = slides[currentIndex];
        if (prevSlide) {
            prevSlide.classList.remove('active');
            const prevVideo = prevSlide.querySelector('video');
            if (prevVideo) {
                setTimeout(() => {
                    if (!prevSlide.classList.contains('active')) {
                        prevVideo.pause();
                    }
                }, 1200); // Allow smooth crossfade to complete
            }
        }

        // 2. Activate target slide
        currentIndex = (targetIndex + slides.length) % slides.length;
        const newSlide = slides[currentIndex];
        newSlide.classList.add('active');

        // 3. Play new video with slow-motion rate
        const newVideo = newSlide.querySelector('video');
        if (newVideo) {
            newVideo.currentTime = 0;
            newVideo.playbackRate = SLOW_MO_RATE;
            const playPromise = newVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Browser autoplay policy handled safely
                });
            }
        }

        // 4. Update HUD text and segment states
        updateHud(currentIndex);

        // 5. Reset and restart timer & progress animation
        elapsedBeforePause = 0;
        if (restartTimer && isPlaying) {
            startSlideTimer(SLIDE_DURATION);
        }
    }

    /**
     * Live requestAnimationFrame Progress Bar Loop
     */
    function startProgressLoop() {
        if (progressRaf) cancelAnimationFrame(progressRaf);

        function frame() {
            if (!isPlaying) return;

            const now = Date.now();
            const elapsed = (now - slideStartTime) + elapsedBeforePause;
            const percent = Math.min(100, (elapsed / SLIDE_DURATION) * 100);

            // Update fill on current active segment
            const activeSegment = segmentItems[currentIndex];
            if (activeSegment) {
                const fill = activeSegment.querySelector('.progress-fill-bar');
                if (fill) {
                    fill.style.setProperty('--bar-width', percent + '%');
                    // Style the dynamic fill bar
                    const after = fill.querySelector('.progress-fill-inner') || createFillInner(fill);
                    after.style.width = percent + '%';
                }
            }

            if (percent < 100) {
                progressRaf = requestAnimationFrame(frame);
            }
        }

        progressRaf = requestAnimationFrame(frame);
    }

    function createFillInner(fillContainer) {
        let inner = fillContainer.querySelector('.progress-fill-inner');
        if (!inner) {
            inner = document.createElement('div');
            inner.className = 'progress-fill-inner';
            inner.style.position = 'absolute';
            inner.style.top = '0';
            inner.style.left = '0';
            inner.style.bottom = '0';
            inner.style.width = '0%';
            inner.style.background = 'linear-gradient(90deg, #1ea69a, #38bdf8)';
            inner.style.borderRadius = '999px';
            inner.style.boxShadow = '0 0 8px rgba(56, 189, 248, 0.8)';
            inner.style.transition = 'width 0.08s linear';
            fillContainer.appendChild(inner);
        }
        return inner;
    }

    /**
     * Starts the auto-advance timer for the current video
     */
    function startSlideTimer(durationMs) {
        clearTimeout(slideTimer);
        slideStartTime = Date.now();

        // Reset past segment fills
        segmentItems.forEach((seg, idx) => {
            const fill = seg.querySelector('.progress-fill-bar');
            if (fill) {
                const inner = createFillInner(fill);
                if (idx < currentIndex) {
                    seg.classList.add('completed');
                    seg.classList.remove('active');
                    inner.style.width = '100%';
                    inner.style.background = '#1ea69a';
                } else if (idx === currentIndex) {
                    seg.classList.add('active');
                    seg.classList.remove('completed');
                    inner.style.width = '0%';
                    inner.style.background = 'linear-gradient(90deg, #1ea69a, #38bdf8)';
                } else {
                    seg.classList.remove('active', 'completed');
                    inner.style.width = '0%';
                }
            }
        });

        startProgressLoop();

        slideTimer = setTimeout(() => {
            if (isPlaying) {
                goToSlide(currentIndex + 1);
            }
        }, durationMs);
    }

    /**
     * Play / Pause Control
     */
    function togglePlayPause() {
        isPlaying = !isPlaying;

        const currentVideo = slides[currentIndex]?.querySelector('video');

        if (isPlaying) {
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtn.setAttribute('title', 'Pause Auto Video');
                playPauseBtn.setAttribute('aria-label', 'Pause Auto Video');
            }
            if (currentVideo) currentVideo.play().catch(() => {});
            
            const remainingTime = Math.max(800, SLIDE_DURATION - elapsedBeforePause);
            slideStartTime = Date.now();
            startProgressLoop();

            clearTimeout(slideTimer);
            slideTimer = setTimeout(() => {
                if (isPlaying) goToSlide(currentIndex + 1);
            }, remainingTime);
        } else {
            if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.setAttribute('title', 'Resume Auto Video');
                playPauseBtn.setAttribute('aria-label', 'Resume Auto Video');
            }
            if (currentVideo) currentVideo.pause();

            elapsedBeforePause += Date.now() - slideStartTime;
            clearTimeout(slideTimer);
            if (progressRaf) cancelAnimationFrame(progressRaf);
        }
    }

    // --- Interactive Event Listeners ---
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(currentIndex + 1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(currentIndex - 1);
        });
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglePlayPause();
        });
    }

    segmentItems.forEach((segment) => {
        segment.addEventListener('click', () => {
            const target = parseInt(segment.getAttribute('data-target-slide'), 10);
            if (!isNaN(target)) {
                goToSlide(target);
            }
        });
    });

    // Handle Page Visibility Change (Pause video and timer when user leaves tab)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isPlaying) {
                elapsedBeforePause += Date.now() - slideStartTime;
                clearTimeout(slideTimer);
                if (progressRaf) cancelAnimationFrame(progressRaf);
                slides[currentIndex]?.querySelector('video')?.pause();
            }
        } else {
            if (isPlaying) {
                const remainingTime = Math.max(800, SLIDE_DURATION - elapsedBeforePause);
                slideStartTime = Date.now();
                slides[currentIndex]?.querySelector('video')?.play().catch(() => {});
                startProgressLoop();
                clearTimeout(slideTimer);
                slideTimer = setTimeout(() => {
                    if (isPlaying) goToSlide(currentIndex + 1);
                }, remainingTime);
            }
        }
    });

    // Initialize first slide
    updateHud(0);
    goToSlide(0, true);
}



