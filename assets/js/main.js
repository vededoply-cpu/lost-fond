/* assets/js/main.js - Lost & Found Management Portal (PWA & Mobile Responsive) */

// Global function for Mobile Table Tab switching
window.switchMobileTable = function(type) {
    const lostCol = document.getElementById('lostTableColumn');
    const foundCol = document.getElementById('foundTableColumn');
    const btnLost = document.getElementById('btnTabLost');
    const btnFound = document.getElementById('btnTabFound');

    if (window.innerWidth < 992) {
        if (type === 'lost') {
            if (lostCol) lostCol.style.display = 'block';
            if (foundCol) foundCol.style.display = 'none';
            if (btnLost) btnLost.className = 'mobile-tab-btn active lost-tab';
            if (btnFound) btnFound.className = 'mobile-tab-btn found-tab';
        } else {
            if (lostCol) lostCol.style.display = 'none';
            if (foundCol) foundCol.style.display = 'block';
            if (btnLost) btnLost.className = 'mobile-tab-btn lost-tab';
            if (btnFound) btnFound.className = 'mobile-tab-btn active found-tab';
        }
    } else {
        // Desktop always shows both
        if (lostCol) lostCol.style.display = 'block';
        if (foundCol) foundCol.style.display = 'block';
    }
};

// Global function for opening Quick Detail Modal
window.showItemQuickView = function(itemKey) {
    const contentDiv = document.getElementById('quickDetailContent');
    const fullLink = document.getElementById('viewFullDetailsBtn');
    const modalElem = document.getElementById('quickDetailModal');

    if (!modalElem || !contentDiv) return;

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElem);

    const item = (window.allItemsData && window.allItemsData[itemKey]) ? window.allItemsData[itemKey] : null;

    if (!item) {
        contentDiv.innerHTML = '<div class="alert alert-warning my-3 text-center"><i class="bi bi-exclamation-circle me-2"></i> Item details not found.</div>';
        modalInstance.show();
        return;
    }

    try {
        const details = item.details ? (typeof item.details === 'string' ? JSON.parse(item.details) : item.details) : {};
        const isLost = item.type === 'lost';
        const isVehicle = (details.item_classification === 'vehicle') || 
                          (item.item_type && ['Two wheeler', 'Three wheeler', 'Four wheeler', 'Heavy transport vehicle', 'Bicycle'].some(v => item.item_type.toLowerCase().includes(v.toLowerCase())));

        if (fullLink) {
            fullLink.href = 'item/' + (item.slug || item.id);
        }

        const dateStr = item.date_reported ? new Date(item.date_reported).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

        let html = `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="badge ${isLost ? 'bg-danger' : 'bg-success'} fs-6 px-3 py-2 text-uppercase fw-bold border border-dark">
                        <i class="bi ${isLost ? 'bi-exclamation-octagon-fill' : 'bi-check-circle-fill'} me-1"></i> ${item.type} Item #${item.id}
                    </span>
                    <span class="badge bg-warning text-dark fs-6 px-3 py-2 fw-bold border border-dark">
                        ${escapeHtml(item.item_type || item.category_name || 'General')}
                    </span>
                </div>
                <span class="badge bg-light text-dark border border-dark fw-bold px-2 py-1"><i class="bi bi-calendar-event me-1 text-danger"></i> ${dateStr}</span>
            </div>

            <h4 class="fw-black text-dark mb-3" style="font-family: 'Outfit', sans-serif;">${escapeHtml(item.title)}</h4>

            <div class="row g-3">
                <!-- Left: Info Cards -->
                <div class="col-12 col-lg-7">
                    ${isVehicle ? `
                        <div class="bg-white p-3 rounded-3 border-2 border-dark border mb-3 shadow-xs">
                            <div class="text-primary small text-uppercase fw-bold mb-2 pb-1 border-bottom d-flex justify-content-between align-items-center">
                                <span><i class="bi bi-car-front-fill me-1"></i> Vehicle Specifications</span>
                                <span class="badge bg-warning text-dark">${escapeHtml(details.vehicle_fuel_type || 'Petrol')}</span>
                            </div>
                            <div class="row g-2 small">
                                <div class="col-12 col-sm-6">
                                    <div class="bg-light p-2 rounded border">
                                        <div class="text-muted fw-bold" style="font-size: 11px;">REGISTRATION NO.</div>
                                        <div class="text-danger fw-black fs-6 text-uppercase">${escapeHtml(details.vehicle_reg_no || 'N/A')}</div>
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6">
                                    <div class="bg-light p-2 rounded border">
                                        <div class="text-muted fw-bold" style="font-size: 11px;">MODEL / VARIANT</div>
                                        <div class="text-dark fw-bold">${escapeHtml(details.vehicle_brand || '')} ${escapeHtml(details.vehicle_model_variant || details.vehicle_model || 'N/A')}</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <span class="text-muted">Engine No:</span> <strong class="text-dark">${escapeHtml(details.vehicle_engine_no || 'N/A')}</strong>
                                </div>
                                <div class="col-6">
                                    <span class="text-muted">Chassis No:</span> <strong class="text-dark">${escapeHtml(details.vehicle_chassis_no || 'N/A')}</strong>
                                </div>
                                <div class="col-12">
                                    <span class="text-muted">RTO Office:</span> <strong>${escapeHtml(details.vehicle_rto || 'N/A')}</strong>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="bg-white p-3 rounded-3 border-2 border-dark border mb-3 shadow-xs">
                            <div class="text-danger small text-uppercase fw-bold mb-2 pb-1 border-bottom">
                                <i class="bi bi-box-seam-fill me-1"></i> Item Specifications
                            </div>
                            <div class="row g-2 small">
                                <div class="col-6">
                                    <div class="bg-light p-2 rounded border">
                                        <div class="text-muted fw-bold" style="font-size: 11px;">WEIGHT W/T</div>
                                        <div class="text-danger fw-black fs-6">${escapeHtml(details.general_weight || 'N/A')}</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="bg-light p-2 rounded border">
                                        <div class="text-muted fw-bold" style="font-size: 11px;">QUANTITY</div>
                                        <div class="text-dark fw-bold fs-6">${escapeHtml(details.general_item_qty || '1')}</div>
                                    </div>
                                </div>
                                <div class="col-12"><strong>Location Range:</strong> ${escapeHtml(details.general_location_range || 'N/A')}</div>
                                <div class="col-12"><strong>Physical Condition:</strong> ${escapeHtml(details.general_physical_condition || item.description || 'N/A')}</div>
                            </div>
                        </div>
                    `}

                    <div class="bg-white p-3 rounded-3 border-2 border-dark border mb-3">
                        <div class="text-muted small text-uppercase fw-bold mb-1">Incident Location (स्थान)</div>
                        <div class="fw-bold text-danger fs-6"><i class="bi bi-geo-alt-fill me-1"></i> ${escapeHtml(item.location || 'N/A')}</div>
                    </div>

                    ${(details.police_thana) ? `
                        <div class="bg-white p-3 rounded-3 border-2 border-dark border">
                            <div class="text-muted small text-uppercase fw-bold mb-1"><i class="bi bi-building-shield me-1 text-primary"></i> Police Station (थाना)</div>
                            <div class="small fw-bold text-dark">${escapeHtml(details.police_thana)} ${details.police_city ? '('+escapeHtml(details.police_city)+')' : ''}</div>
                        </div>
                    ` : ''}
                </div>

                <!-- Right: Photo Preview -->
                <div class="col-12 col-lg-5">
                    <div class="bg-white p-3 rounded-3 border-2 border-dark border text-center h-100 d-flex flex-column justify-content-center align-items-center">
                        ${item.image_path ? `
                            <img src="${escapeHtml(item.image_path)}" class="img-fluid rounded-3 border border-dark mb-2" style="max-height: 220px; width: 100%; object-fit: contain; background: #f8f9fa;">
                            <span class="badge bg-dark text-white fw-bold px-3 py-1">Uploaded Photograph</span>
                        ` : `
                            <div class="text-muted py-4">
                                <i class="bi bi-camera fs-1 d-block mb-2 text-warning"></i>
                                <span class="small fw-bold">No photograph attached</span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        contentDiv.innerHTML = html;
        modalInstance.show();
    } catch (err) {
        console.error('Quick view error:', err);
        contentDiv.innerHTML = '<div class="alert alert-danger my-3">Error rendering item details.</div>';
        modalInstance.show();
    }
};

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Service Worker Registration (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('[PWA] Service Worker active with scope:', registration.scope);
            })
            .catch(err => {
                console.warn('[PWA] Service Worker registration failed:', err);
            });
    }

    // 2. PWA BeforeInstallPrompt Handling
    let deferredPrompt = null;
    const installBanner = document.getElementById('pwaInstallBanner');
    const installBtn = document.getElementById('pwaInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBanner) {
            installBanner.style.display = 'flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (installBanner) installBanner.style.display = 'none';
        });
    }

    window.addEventListener('appinstalled', () => {
        if (installBanner) installBanner.style.display = 'none';
    });

    // 3. Responsive Screen Resize Handler for Dual Tables
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            const lostCol = document.getElementById('lostTableColumn');
            const foundCol = document.getElementById('foundTableColumn');
            if (lostCol) lostCol.style.display = 'block';
            if (foundCol) foundCol.style.display = 'block';
        } else {
            const btnLost = document.getElementById('btnTabLost');
            if (btnLost && btnLost.classList.contains('active')) {
                window.switchMobileTable('lost');
            } else {
                window.switchMobileTable('found');
            }
        }
    });

    // Initialize mobile view
    if (window.innerWidth < 992) {
        window.switchMobileTable('lost');
    }

    // 4. Dynamic item type classification switching in forms
    const typeSelectors = document.querySelectorAll('.item-type-selector');
    typeSelectors.forEach(select => {
        select.addEventListener('change', function() {
            const reportType = this.getAttribute('data-type');
            const selectedOption = this.options[this.selectedIndex];
            const group = selectedOption.getAttribute('data-group') || 'general';
            
            const classificationHidden = document.getElementById(reportType + '_classification');
            const groupDisplay = document.getElementById(reportType + '_group_display');
            const vehicleFields = document.querySelector('.vehicle-specific-fields-' + reportType);
            const generalFields = document.querySelector('.general-specific-fields-' + reportType);

            if (classificationHidden) classificationHidden.value = group;

            if (group === 'vehicle') {
                if (groupDisplay) groupDisplay.value = 'Vehicle Details Form (वाहन विवरण)';
                if (vehicleFields) vehicleFields.style.display = 'block';
                if (generalFields) generalFields.style.display = 'none';
            } else {
                if (groupDisplay) groupDisplay.value = 'Valuables & Documents Form (दस्तावेज़/सामान विवरण)';
                if (vehicleFields) vehicleFields.style.display = 'none';
                if (generalFields) generalFields.style.display = 'block';
            }
        });
    });

    // 5. Image Upload Live Thumbnail Preview
    document.querySelectorAll('input[type="file"]').forEach(fileInput => {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file && file.type.startsWith('image/')) {
                let previewContainer = this.parentElement.querySelector('.live-file-preview');
                if (!previewContainer) {
                    previewContainer = document.createElement('div');
                    previewContainer.className = 'live-file-preview mt-2 text-center p-2 bg-light rounded border';
                    this.parentElement.appendChild(previewContainer);
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewContainer.innerHTML = `
                        <img src="${e.target.result}" class="img-thumbnail" style="max-height: 100px; object-fit: contain;">
                        <div class="small text-success fw-bold mt-1"><i class="bi bi-check2-circle"></i> Ready to upload (${(file.size/1024).toFixed(1)} KB)</div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // 6. Form submission with AJAX & validation
    function setupForm(formId, alertId) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const alertBox = document.getElementById(alertId);
                const btn = form.querySelector('button[type="submit"]');
                const originalBtnHtml = btn.innerHTML;

                if (!navigator.onLine) {
                    alertBox.className = 'alert alert-danger mt-3 py-3 fw-bold';
                    alertBox.innerHTML = '<i class="bi bi-wifi-off me-2 fs-5"></i> <strong>Offline Mode:</strong> Internet connection is disconnected. Please reconnect to submit reports.';
                    alertBox.classList.remove('d-none');
                    return;
                }
                
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Submitting Report...';
                
                const formData = new FormData(this);
                
                fetch('api/submit_item.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alertBox.className = 'alert alert-success mt-3 py-3 fw-bold';
                        alertBox.innerHTML = '<i class="bi bi-check-circle-fill me-2 fs-5"></i> ' + data.message;
                        alertBox.classList.remove('d-none');
                        form.reset();
                        
                        form.querySelectorAll('.live-file-preview').forEach(el => el.remove());
                        
                        setTimeout(() => {
                            const modalElem = form.closest('.modal');
                            if (modalElem) {
                                const modal = bootstrap.Modal.getInstance(modalElem);
                                if (modal) modal.hide();
                            }
                            alertBox.classList.add('d-none');
                            window.location.reload();
                        }, 2000);
                    } else {
                        alertBox.className = 'alert alert-danger mt-3 py-3 fw-bold';
                        alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i> ' + (data.message || 'Error submitting report.');
                        alertBox.classList.remove('d-none');
                    }
                })
                .catch(error => {
                    alertBox.className = 'alert alert-danger mt-3 py-3 fw-bold';
                    alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i> Network error occurred. Please check connection and try again.';
                    alertBox.classList.remove('d-none');
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalBtnHtml;
                });
            });
        }
    }

    setupForm('form-report-lost', 'lostAlert');
    setupForm('form-report-found', 'foundAlert');

    // 7. Debounced Live search and Item Type dropdown filtering for dual tables
    const searchInput = document.getElementById('globalSearchInput');
    const itemTypeFilter = document.getElementById('headerItemTypeFilter');

    let debounceTimer = null;
    function filterTables() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const filterType = itemTypeFilter ? itemTypeFilter.value.trim().toLowerCase() : '';

            const allRows = document.querySelectorAll('.data-row');
            let visibleLostCount = 0;
            let visibleFoundCount = 0;

            allRows.forEach(row => {
                const rowText = (row.getAttribute('data-search') || '').toLowerCase();
                const rowType = (row.getAttribute('data-item-type') || '').toLowerCase();
                const isLost = row.classList.contains('lost-row');

                const matchesQuery = query === '' || rowText.includes(query);
                const matchesType = filterType === '' || filterType === 'all' || rowType.includes(filterType);

                if (matchesQuery && matchesType) {
                    row.style.display = '';
                    if (isLost) visibleLostCount++;
                    else visibleFoundCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            // Toggle no-results placeholders
            const lostNoResults = document.getElementById('lostNoResults');
            const foundNoResults = document.getElementById('foundNoResults');
            if (lostNoResults) lostNoResults.style.display = (visibleLostCount === 0 && allRows.length > 0) ? '' : 'none';
            if (foundNoResults) foundNoResults.style.display = (visibleFoundCount === 0 && allRows.length > 0) ? '' : 'none';
        }, 120);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTables);
    }
    if (itemTypeFilter) {
        itemTypeFilter.addEventListener('change', filterTables);
    }

    // 8. Real-time Offline Screen & Auto-Reconnect Monitor
    (function initNetworkMonitor() {
        let offlineOverlay = null;

        function createOfflineOverlay() {
            let overlay = document.getElementById('portalOfflineOverlay');
            if (overlay) return overlay;

            overlay = document.createElement('div');
            overlay.id = 'portalOfflineOverlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,#ff7800 0%,#f76707 100%);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;color:#111827;font-family:\'Plus Jakarta Sans\',sans-serif;overflow-y:auto;';
            overlay.innerHTML = `
                <div style="background:#ffffff;border:4px solid #000000;box-shadow:8px 8px 0px #000000;border-radius:16px;padding:36px 24px;max-width:520px;width:100%;text-align:center;animation:popIn 0.3s ease-out;">
                    <div style="font-size:64px;color:#e03131;margin-bottom:12px;">
                        <i class="bi bi-wifi-off"></i>
                    </div>
                    <h2 style="font-weight:900;color:#000000;margin-bottom:4px;font-family:\'Outfit\',sans-serif;font-size:24px;">You are currently offline</h2>
                    <div style="font-weight:800;color:#d9480f;font-size:16px;margin-bottom:14px;">इंटरनेट कनेक्शन डिस्कनेक्ट हो गया है</div>
                    <p style="color:#6c757d;font-size:14px;margin-bottom:18px;line-height:1.5;">
                        Network connection lost. The portal will automatically reconnect as soon as your internet is back.
                    </p>
                    <div style="background:#f8f9fa;border:2px dashed #ced4da;border-radius:8px;padding:14px;margin-bottom:20px;text-align:left;font-size:13.5px;">
                        <div style="font-weight:800;color:#111827;margin-bottom:6px;"><i class="bi bi-telephone-fill text-danger me-1"></i> Emergency Helpline (आपातकालीन नंबर):</div>
                        <div style="color:#495057;">• Police Control Room: <strong style="color:#000;">112 / 100</strong></div>
                        <div style="color:#495057;">• Portal Helpline: <strong style="color:#000;">+91 07314968409</strong></div>
                    </div>
                    <button onclick="window.location.reload()" style="background:#ff7800;color:#ffffff;border:3px solid #000000;box-shadow:4px 4px 0px #000000;font-weight:800;font-size:15px;padding:11px 26px;border-radius:8px;cursor:pointer;">
                        <i class="bi bi-arrow-clockwise me-1"></i> Retry Connection (पुनः प्रयास करें)
                    </button>
                </div>
                <div style="text-align:center;margin-top:16px;color:#ffffff;font-size:13px;font-weight:700;text-shadow:1px 1px 2px rgba(0,0,0,0.5);">
                    Design and Developed by <a href="https://edoply.in" target="_blank" style="color:#ffffff;text-decoration:underline;">Edoply Pvt Ltd</a>
                </div>
            `;
            document.body.appendChild(overlay);
            return overlay;
        }

        function showOfflineScreen() {
            offlineOverlay = createOfflineOverlay();
            if (offlineOverlay) offlineOverlay.style.display = 'flex';
        }

        function hideOfflineScreen() {
            if (offlineOverlay) offlineOverlay.style.display = 'none';
            
            // Show online reconnect toast
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#2f9e44;color:#ffffff;border:2.5px solid #000000;box-shadow:4px 4px 0px #000000;border-radius:8px;padding:10px 22px;font-weight:800;z-index:1000000;display:flex;align-items:center;gap:8px;';
            toast.innerHTML = '<i class="bi bi-wifi fs-5"></i> Back Online! Restoring live portal...';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
                window.location.reload();
            }, 1000);
        }

        window.addEventListener('offline', showOfflineScreen);
        window.addEventListener('online', hideOfflineScreen);

        if (!navigator.onLine) {
            showOfflineScreen();
        }
    })();

    // 9. Wireframe Table Populator
    function renderWireframeTables() {
        if (!window.allItemsData) return;
        const lostTbody = document.querySelector('#lostTable tbody');
        const foundTbody = document.querySelector('#foundTable tbody');
        if (!lostTbody || !foundTbody) return;

        let lostHtml = '';
        let foundHtml = '';
        let lostCount = 0;
        let foundCount = 0;

        Object.keys(window.allItemsData).forEach(key => {
            const item = window.allItemsData[key];
            let details = {};
            try {
                details = typeof item.details === 'string' ? JSON.parse(item.details) : (item.details || {});
            } catch(e) {}

            const regNo = details.vehicle_reg_no || item.title || 'NN 00';
            const chassis = details.vehicle_chassis_no || details.general_weight || 'NN 00';
            const engine = details.vehicle_engine_no || details.police_thana || 'NN 00';
            const photoVal = item.image_path ? `<img src="${escapeHtml(item.image_path)}" style="height:22px; max-width:40px; object-fit:cover;">` : (details.vehicle_brand || 'Photo');

            const rowHtml = `
                <tr class="data-row ${item.type}-row clickable-row" onclick="showItemQuickView('${key}')" data-search="${escapeHtml(regNo)} ${escapeHtml(chassis)} ${escapeHtml(engine)} ${escapeHtml(item.title)}" data-item-type="${escapeHtml(item.item_type || '')}">
                    <td>${escapeHtml(regNo)}</td>
                    <td>${escapeHtml(chassis)}</td>
                    <td>${escapeHtml(engine)}</td>
                    <td>${photoVal}</td>
                </tr>
            `;

            if (item.type === 'lost') {
                lostHtml += rowHtml;
                lostCount++;
            } else {
                foundHtml += rowHtml;
                foundCount++;
            }
        });

        // Fill remaining placeholder rows up to 20
        const lostPlaceholdersNeeded = Math.max(0, 20 - lostCount);
        for (let i = 0; i < lostPlaceholdersNeeded; i++) {
            lostHtml += `<tr class="empty-placeholder-row"><td>NN 00</td><td>NN 00</td><td>NN 00</td><td>Photo</td></tr>`;
        }

        const foundPlaceholdersNeeded = Math.max(0, 20 - foundCount);
        for (let i = 0; i < foundPlaceholdersNeeded; i++) {
            foundHtml += `<tr class="empty-placeholder-row"><td>NN 00</td><td>NN 00</td><td>NN 00</td><td>Photo</td></tr>`;
        }

        lostHtml += `<tr id="lostNoResults" style="display:none;"><td colspan="4" class="py-3 text-muted"><i class="bi bi-info-circle me-1"></i> No matching lost items found.</td></tr>`;
        foundHtml += `<tr id="foundNoResults" style="display:none;"><td colspan="4" class="py-3 text-muted"><i class="bi bi-info-circle me-1"></i> No matching found items.</td></tr>`;

        lostTbody.innerHTML = lostHtml;
        foundTbody.innerHTML = foundHtml;
    }

    renderWireframeTables();

});

