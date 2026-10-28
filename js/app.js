/**
 * CipherTrack by CipherSchools - Application Controller & State Engine
 * Handles State, Manual Entry, Excel Import, Reconciliation, Automated Alerts, and Reporting
 */

(function () {
  'use strict';

  // Application State
  const state = {
    selectedUniversity: 'lpu',
    mentors: JSON.parse(JSON.stringify(INITIAL_MENTORS_DATA)),
    dispatchLogs: JSON.parse(JSON.stringify(INITIAL_DISPATCH_LOGS)),
    auditTrail: [],
    selectedMentorForModal: null,
    activeTab: 'tab-dashboard',
    activeExceptionFilter: 'all',
    selectedSimMentorId: 'MTR-102',
    parsedExcelData: null,
    chatThreads: {
      'MTR-102': [
        { sender: 'bot', text: 'Good morning Priya! Your Full Stack Web session starts at 09:30 AM in Web Lab 402. Please ensure you sign in before 09:30 AM.', time: '09:12 AM' },
        { sender: 'mentor', text: 'Signed in at 09:12 AM. In class now!', time: '09:14 AM' },
        { sender: 'bot', text: 'Reminder: Your shift finishes at 17:00 PM. Please remember to log your exit punch on the register before leaving campus.', time: '16:45 PM' }
      ],
      'MTR-104': [
        { sender: 'bot', text: 'Hi Ananya! Class in Cyber Security Lab 101 began at 09:30 AM, but no check-in punch was recorded. Please sign the attendance sheet.', time: '09:35 AM' },
        { sender: 'mentor', text: 'In Lab 101, class started. Signing manual register now!', time: '09:37 AM' }
      ],
      'MTR-106': [
        { sender: 'bot', text: 'Hi Sneha! You have a Mobile Development class scheduled at 09:30 AM. No attendance record found today. Please update status.', time: '09:20 AM' }
      ],
      'MTR-111': [
        { sender: 'bot', text: 'Hi Tanmay! Reminder: Don\'t forget to record your sign-out after your Web3 lecture in Fintech Lab 5.', time: '16:45 PM' },
        { sender: 'mentor', text: 'Understood, updating exit time on the desk sheet.', time: '16:48 PM' }
      ]
    }
  };

  // DOM Elements Cache
  const dom = {
    tabs: document.querySelectorAll('.tab-btn'),
    panels: document.querySelectorAll('.tab-panel'),
    toastContainer: document.getElementById('toastContainer'),
    // KPI elements
    kpiTotalMentors: document.getElementById('kpiTotalMentors'),
    kpiVerifiedCount: document.getElementById('kpiVerifiedCount'),
    kpiVerifiedPct: document.getElementById('kpiVerifiedPct'),
    kpiExceptionsCount: document.getElementById('kpiExceptionsCount'),
    kpiExceptionsDetail: document.getElementById('kpiExceptionsDetail'),
    kpiComplianceScore: document.getElementById('kpiComplianceScore'),
    kpiComplianceBar: document.getElementById('kpiComplianceBar'),
    kpiBillingRisk: document.getElementById('kpiBillingRisk'),
    badgeDashboardCompliance: document.getElementById('badgeDashboardCompliance'),
    badgeReconciliationDiscrepancies: document.getElementById('badgeReconciliationDiscrepancies'),
    badgeExceptionsPending: document.getElementById('badgeExceptionsPending'),
    unresolvedAlert: document.getElementById('unresolvedAlert'),
    quickNudgeCount: document.getElementById('quickNudgeCount'),
    // SLA
    slaPunctualityPct: document.getElementById('slaPunctualityPct'),
    slaExitIntegrityPct: document.getElementById('slaExitIntegrityPct'),
    // Tables
    dashboardTableBody: document.getElementById('dashboardTableBody'),
    dashboardSearchInput: document.getElementById('dashboardSearchInput'),
    dashboardStatusFilter: document.getElementById('dashboardStatusFilter'),
    reconcileTableBody: document.getElementById('reconcileTableBody'),
    exceptionsTableBody: document.getElementById('exceptionsTableBody'),
    dispatchLogBody: document.getElementById('dispatchLogBody'),
    reportTableBody: document.getElementById('reportTableBody'),
    // Modals
    reconcileModal: document.getElementById('reconcileModal'),
    auditReportModal: document.getElementById('auditReportModal'),
    excelImportModal: document.getElementById('excelImportModal'),
    manualEntryModal: document.getElementById('manualEntryModal'),
    // Buttons
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    auditModalCloseBtn: document.getElementById('auditModalCloseBtn'),
    auditModalCancelBtn: document.getElementById('auditModalCancelBtn'),
    excelModalCloseBtn: document.getElementById('excelModalCloseBtn'),
    excelModalCancelBtn: document.getElementById('excelModalCancelBtn'),
    manualModalCloseBtn: document.getElementById('manualModalCloseBtn'),
    manualModalCancelBtn: document.getElementById('manualModalCancelBtn'),
    // Simulator
    simTargetMentor: document.getElementById('simTargetMentor'),
    phoneChatThread: document.getElementById('phoneChatThread'),
    phoneQuickReplyInput: document.getElementById('phoneQuickReplyInput'),
    btnSendSimulatedReply: document.getElementById('btnSendSimulatedReply'),
    // University Campus & Footer
    universitySelect: document.getElementById('universitySelect'),
    currentCampusLogo: document.getElementById('currentCampusLogo'),
    contextUniversityName: document.getElementById('contextUniversityName'),
    dashboardUniName: document.getElementById('dashboardUniName'),
    slaCardUniName: document.getElementById('slaCardUniName'),
    reportOrgHeading: document.getElementById('reportOrgHeading'),
    reportDeanSignName: document.getElementById('reportDeanSignName'),
    reportDeanSignTitle: document.getElementById('reportDeanSignTitle'),
    footerCampusDisplay: document.getElementById('footerCampusDisplay'),
    btnResetDemoFooter: document.getElementById('btnResetDemoFooter')
  };

  // Helper: Format Time
  function formatCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  // Toast System
  function showToast(message, type = 'info') {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '✕';

    toast.innerHTML = `
      <span style="font-weight:bold;">${icon}</span>
      <span>${message}</span>
    `;

    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // University Campus Selector Handler
  function updateUniversityCampus(uniKey, silent = false) {
    if (typeof UNIVERSITY_PROFILES === 'undefined') return;
    const profile = UNIVERSITY_PROFILES[uniKey];
    if (!profile) return;

    state.selectedUniversity = uniKey;

    if (dom.universitySelect && dom.universitySelect.value !== uniKey) {
      dom.universitySelect.value = uniKey;
    }
    if (dom.currentCampusLogo) {
      dom.currentCampusLogo.src = profile.logo;
      dom.currentCampusLogo.alt = `${profile.name} Logo`;
    }
    if (dom.contextUniversityName) {
      dom.contextUniversityName.textContent = `${profile.name} (${profile.shortName}), ${profile.location}`;
    }
    if (dom.dashboardUniName) {
      dom.dashboardUniName.textContent = `${profile.name} (${profile.shortName})`;
    }
    if (dom.slaCardUniName) {
      dom.slaCardUniName.textContent = profile.name;
    }
    if (dom.reportOrgHeading) {
      dom.reportOrgHeading.textContent = `CIPHERSCHOOLS • ${profile.name.toUpperCase()} (${profile.shortName})`;
    }
    if (dom.reportDeanSignTitle) {
      const titleRole = profile.leadContact.includes('(') ? profile.leadContact.split('(')[1].replace(')', '') : 'Dean of Academic Operations';
      dom.reportDeanSignTitle.textContent = `${titleRole} • ${profile.name}`;
    }
    if (dom.reportDeanSignName) {
      dom.reportDeanSignName.textContent = profile.leadContact.split('(')[0].trim();
    }
    if (dom.footerCampusDisplay) {
      dom.footerCampusDisplay.textContent = `${profile.name} (${profile.shortName}) • ${profile.location}`;
    }

    if (!silent) {
      showToast(`Switched campus partner to ${profile.name} (${profile.shortName})`, 'info');
    }
  }

  // ==========================================================================
  // METRIC & KPI CALCULATOR
  // ==========================================================================
  function recalculateMetrics() {
    const total = state.mentors.length;
    const verified = state.mentors.filter(m => m.status === 'verified' || m.status === 'reconciled').length;
    const exceptions = state.mentors.filter(m => m.status === 'missing_out' || m.status === 'missing_in' || m.status === 'absent');
    const missingOut = state.mentors.filter(m => m.status === 'missing_out').length;
    const missingIn = state.mentors.filter(m => m.status === 'missing_in').length;
    const absent = state.mentors.filter(m => m.status === 'absent').length;

    // Punctuality: Count how many punched in BEFORE scheduled class time (09:30 AM)
    let onTimeCount = 0;
    let checkedInTotal = 0;
    state.mentors.forEach(m => {
      if (!m.checkIn.includes('--')) {
        checkedInTotal++;
        const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
        if (pEval.status === 'on_time') {
          onTimeCount++;
        }
      }
    });

    const punctualityRate = checkedInTotal > 0 ? ((onTimeCount / checkedInTotal) * 100).toFixed(1) : '0.0';

    // Calculate unverified billing risk hours (8.0 standard hrs for each missing punch / absent)
    let riskHours = 0;
    state.mentors.forEach(m => {
      if (m.status === 'missing_out') riskHours += 4.0;
      else if (m.status === 'missing_in') riskHours += 4.0;
      else if (m.status === 'absent') riskHours += 8.0;
    });

    // Update DOM
    if (dom.kpiTotalMentors) dom.kpiTotalMentors.textContent = total;
    if (dom.kpiVerifiedCount) dom.kpiVerifiedCount.innerHTML = `${verified} <span class="kpi-denominator">/ ${total}</span>`;
    if (dom.kpiVerifiedPct) dom.kpiVerifiedPct.textContent = `${((verified / total) * 100).toFixed(1)}% Complete`;
    if (dom.kpiExceptionsCount) dom.kpiExceptionsCount.textContent = exceptions.length;
    if (dom.kpiExceptionsDetail) dom.kpiExceptionsDetail.textContent = `${missingOut} Missing Out • ${missingIn} Missing In • ${absent} Absent`;
    if (dom.kpiComplianceScore) dom.kpiComplianceScore.textContent = `${punctualityRate}%`;
    if (dom.kpiComplianceBar) dom.kpiComplianceBar.style.width = `${punctualityRate}%`;
    if (dom.kpiBillingRisk) dom.kpiBillingRisk.innerHTML = `${riskHours.toFixed(1)} <span class="unit">hrs</span>`;

    // Badges
    if (dom.badgeDashboardCompliance) dom.badgeDashboardCompliance.textContent = `${punctualityRate}% On-Time`;
    if (dom.badgeReconciliationDiscrepancies) dom.badgeReconciliationDiscrepancies.textContent = `${missingOut + missingIn} Incomplete`;
    if (dom.badgeExceptionsPending) dom.badgeExceptionsPending.textContent = `${exceptions.length} Exceptions`;
    if (dom.unresolvedAlert) dom.unresolvedAlert.textContent = `${exceptions.length} Mentors require attendance action`;
    if (dom.quickNudgeCount) dom.quickNudgeCount.textContent = exceptions.length;

    // SLA
    if (dom.slaPunctualityPct) dom.slaPunctualityPct.textContent = `${punctualityRate}%`;
    if (dom.slaExitIntegrityPct) {
      const exitRate = (((total - missingOut - absent) / total) * 100).toFixed(1);
      dom.slaExitIntegrityPct.textContent = `${exitRate}%`;
    }

    // Counts on Reconcile Tab
    const statUnpaired = document.getElementById('statUnpairedCount');
    if (statUnpaired) statUnpaired.textContent = `${missingOut + missingIn} Incomplete Records`;
    const recNeedsActionCount = document.getElementById('reconcileNeedsActionCount');
    if (recNeedsActionCount) recNeedsActionCount.textContent = missingOut + missingIn;

    const countAllExceptions = document.getElementById('countAllExceptions');
    if (countAllExceptions) countAllExceptions.textContent = exceptions.length;
    const countMissingOut = document.getElementById('countMissingOut');
    if (countMissingOut) countMissingOut.textContent = missingOut;
    const countMissingIn = document.getElementById('countMissingIn');
    if (countMissingIn) countMissingIn.textContent = missingIn;
    const countUnreported = document.getElementById('countUnreported');
    if (countUnreported) countUnreported.textContent = absent;

    // Late arrivals count (> 09:30 AM)
    const lateCount = state.mentors.filter(m => {
      const p = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
      return p.status === 'late';
    }).length;
    const countLateArrivals = document.getElementById('countLateArrivals');
    if (countLateArrivals) countLateArrivals.textContent = lateCount;
  }

  // ==========================================================================
  // RENDER: DASHBOARD TAB (SOLUTION 4 - CLEAN & FOCUSED)
  // ==========================================================================
  function renderDashboard() {
    renderDashboardTable();
  }

  // ==========================================================================
  // RENDER: DATA ANALYSIS & TRENDS TAB
  // ==========================================================================
  function renderAnalysis() {
    renderHourlyChart();
  }

  function renderHourlyChart() {
    const container = document.getElementById('punchHourlyBars');
    if (!container) return;

    // Punctuality arrival distributions relative to 09:30 AM
    const hourlyData = [
      { slot: '08:45 AM', onTime: 4, late: 0, missing: 0 },
      { slot: '09:00 AM', onTime: 6, late: 0, missing: 0 },
      { slot: '09:15 AM', onTime: 5, late: 0, missing: 0 },
      { slot: '09:25 AM', onTime: 2, late: 0, missing: 0 },
      { slot: '09:35 AM', onTime: 0, late: 1, missing: 0 },
      { slot: '09:45 AM', onTime: 0, late: 2, missing: 0 },
      { slot: 'No Punch', onTime: 0, late: 0, missing: 2 }
    ];

    container.innerHTML = hourlyData.map(item => {
      const total = item.onTime + item.late + item.missing;
      const heightPx = Math.max(20, total * 18);
      
      const onTimePct = total > 0 ? (item.onTime / total) * 100 : 0;
      const latePct = total > 0 ? (item.late / total) * 100 : 0;
      const gapPct = total > 0 ? (item.missing / total) * 100 : 0;

      return `
        <div class="timeline-bar-col">
          <span class="bar-count-label">${total}</span>
          <div class="bar-stack" style="height: ${heightPx}px;">
            <div class="bar-segment in-bar" style="height: ${onTimePct}%;"></div>
            <div class="bar-segment late-bar" style="height: ${latePct}%;"></div>
            <div class="bar-segment gap-bar" style="height: ${gapPct}%;"></div>
          </div>
          <span class="bar-time-label">${item.slot}</span>
        </div>
      `;
    }).join('');
  }

  function renderDashboardTable() {
    if (!dom.dashboardTableBody) return;

    const searchTerm = (dom.dashboardSearchInput ? dom.dashboardSearchInput.value : '').toLowerCase();
    const statusFilter = dom.dashboardStatusFilter ? dom.dashboardStatusFilter.value : 'all';

    const filtered = state.mentors.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm) ||
                            m.id.toLowerCase().includes(searchTerm) ||
                            m.dept.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;

      const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');

      if (statusFilter === 'all') return true;
      if (statusFilter === 'on_time') return pEval.status === 'on_time';
      if (statusFilter === 'late') return pEval.status === 'late';
      if (statusFilter === 'exception') return m.status === 'missing_out' || m.status === 'missing_in' || m.status === 'absent' || pEval.status === 'late';
      if (statusFilter === 'missing_out') return m.status === 'missing_out';
      if (statusFilter === 'missing_in') return m.status === 'missing_in';
      if (statusFilter === 'absent') return m.status === 'absent';
      return m.status === statusFilter;
    });

    if (filtered.length === 0) {
      dom.dashboardTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            <p>No mentors found matching filter criteria "${searchTerm}".</p>
          </td>
        </tr>
      `;
      return;
    }

    dom.dashboardTableBody.innerHTML = filtered.map(m => {
      let statusBadge = '';
      let rowClass = '';

      if (m.status === 'verified') {
        statusBadge = '<span class="pill pill-success">✓ Complete Shift</span>';
      } else if (m.status === 'reconciled') {
        statusBadge = '<span class="pill pill-info">✓ Reconciled by Lead</span>';
        rowClass = 'row-reconciled';
      } else if (m.status === 'missing_out') {
        statusBadge = '<span class="pill pill-danger">⚠️ Missing Check-Out</span>';
        rowClass = 'row-exception';
      } else if (m.status === 'missing_in') {
        statusBadge = '<span class="pill pill-warning">⚠️ Missing Check-In</span>';
        rowClass = 'row-exception';
      } else if (m.status === 'absent') {
        statusBadge = '<span class="pill pill-danger">✕ Unreported / Absent</span>';
        rowClass = 'row-exception';
      }

      // Evaluate Class Punctuality
      const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
      const punctualityBadge = `<span class="pill ${pEval.badgeClass}">${pEval.label}</span>`;

      const inClass = m.checkIn.includes('--') ? 'stamp-missing' : 'stamp-in';
      const outClass = m.checkOut.includes('--') ? 'stamp-missing' : 'stamp-out';

      return `
        <tr class="${rowClass}">
          <td>
            <div class="mentor-profile-cell">
              <div class="mentor-avatar">${m.avatar}</div>
              <div class="mentor-meta">
                <span class="mentor-name">${m.name}</span>
                <span class="mentor-id">${m.id}</span>
              </div>
            </div>
          </td>
          <td>${m.dept}</td>
          <td>
            <div class="class-time-tag">
              <span>🕒 ${m.scheduledClassTime || '09:30 AM'}</span>
            </div>
            <span class="class-room-sub">${m.classroom || 'Lab 402'}</span>
          </td>
          <td><span class="stamp-tag ${inClass}">${m.checkIn}</span></td>
          <td>${punctualityBadge}</td>
          <td><span class="stamp-tag ${outClass}">${m.checkOut}</span></td>
          <td><strong>${m.effectiveHours > 0 ? m.effectiveHours + ' hrs' : '0.0 hrs'}</strong></td>
          <td>${statusBadge}</td>
          <td class="text-right">
            ${m.status === 'missing_out' || m.status === 'missing_in' || m.status === 'absent' ? `
              <button class="btn btn-primary btn-xs" onclick="window.app.openReconcileModal('${m.id}')">
                Reconcile
              </button>
            ` : `
              <button class="btn btn-outline btn-xs" onclick="window.app.openManualEntryForMentor('${m.id}')">
                Edit Punch
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // RENDER: RECONCILIATION TAB (SOLUTION 1)
  // ==========================================================================
  let reconcileFilterNeedsActionOnly = false;

  function renderReconciliation() {
    if (!dom.reconcileTableBody) return;

    let mentorsToShow = state.mentors;
    if (reconcileFilterNeedsActionOnly) {
      mentorsToShow = mentorsToShow.filter(m => m.status === 'missing_out' || m.status === 'missing_in');
    }

    if (mentorsToShow.length === 0) {
      dom.reconcileTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            <p>🎉 All mentor attendance entries for today have been fully matched and reconciled!</p>
          </td>
        </tr>
      `;
      return;
    }

    dom.reconcileTableBody.innerHTML = mentorsToShow.map(m => {
      const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
      let suggestion = 'Verified shift attendance (09:00 - 17:00)';
      let statusBadge = '<span class="badge badge-success">Clean Match</span>';
      let actionBtn = `<button class="btn btn-outline btn-xs" onclick="window.app.openManualEntryForMentor('${m.id}')">Edit</button>`;

      if (m.status === 'missing_out') {
        suggestion = m.evidence || 'Pair with 17:00 PM session end timetable.';
        statusBadge = '<span class="badge badge-danger">Unresolved</span>';
        actionBtn = `<button class="btn btn-primary btn-xs" onclick="window.app.openReconcileModal('${m.id}')">Reconcile / Adjust</button>`;
      } else if (m.status === 'missing_in') {
        suggestion = m.evidence || 'Pair with 09:30 AM lab commencement.';
        statusBadge = '<span class="badge badge-warning">Unresolved</span>';
        actionBtn = `<button class="btn btn-primary btn-xs" onclick="window.app.openReconcileModal('${m.id}')">Reconcile / Adjust</button>`;
      } else if (m.status === 'absent') {
        suggestion = 'Contact mentor or verify leave portal.';
        statusBadge = '<span class="badge badge-neutral">Absent</span>';
        actionBtn = `<button class="btn btn-secondary btn-xs" onclick="window.app.openReconcileModal('${m.id}')">Log Excuse</button>`;
      } else if (m.status === 'reconciled') {
        suggestion = m.evidence || 'Manually regularized with proof.';
        statusBadge = '<span class="badge badge-success">Reconciled</span>';
        actionBtn = `<button class="btn btn-outline btn-xs" onclick="window.app.openReconcileModal('${m.id}')">View Note</button>`;
      }

      return `
        <tr class="${m.status.includes('missing') ? 'row-exception' : ''}">
          <td>
            <div class="mentor-profile-cell">
              <div class="mentor-avatar">${m.avatar}</div>
              <div class="mentor-meta">
                <span class="mentor-name">${m.name}</span>
                <span class="mentor-id">${m.id} • ${m.dept}</span>
              </div>
            </div>
          </td>
          <td>
            <strong>${m.scheduledClassTime || '09:30 AM'}</strong><br>
            <small class="text-muted">${m.classroom || 'Lab Room'}</small>
          </td>
          <td><span class="stamp-tag ${m.checkIn.includes('--') ? 'stamp-missing' : 'stamp-in'}">${m.checkIn}</span></td>
          <td><span class="pill ${pEval.badgeClass}">${pEval.label}</span></td>
          <td><span class="stamp-tag ${m.checkOut.includes('--') ? 'stamp-missing' : 'stamp-out'}">${m.checkOut}</span></td>
          <td><small style="color:var(--text-secondary); max-width:260px; display:inline-block;">${suggestion}</small></td>
          <td>${statusBadge}</td>
          <td class="text-right">${actionBtn}</td>
        </tr>
      `;
    }).join('');

    renderAuditTrail();
  }

  function renderAuditTrail() {
    const timeline = document.getElementById('auditTimeline');
    const badge = document.getElementById('auditCountBadge');
    if (!timeline) return;

    if (badge) {
      badge.textContent = `${state.auditTrail.length} action${state.auditTrail.length === 1 ? '' : 's'} logged today`;
    }

    if (state.auditTrail.length === 0) {
      timeline.innerHTML = `
        <div class="empty-state">
          <p>No manual adjustments made yet today. Click "Reconcile / Adjust" on any mentor with an incomplete punch to log a resolution.</p>
        </div>
      `;
      return;
    }

    timeline.innerHTML = state.auditTrail.map(entry => `
      <div class="audit-entry">
        <div class="audit-icon">✓</div>
        <div class="audit-content">
          <div class="audit-header-line">
            <span class="audit-actor">${entry.actor} → Reconciled <strong>${entry.mentorName} (${entry.mentorId})</strong></span>
            <span class="audit-time">${entry.timestamp}</span>
          </div>
          <div class="audit-reason">
            <strong>Method:</strong> ${entry.method} • <strong>Adjustment:</strong> ${entry.adjustment} <br>
            <strong>Note:</strong> "${entry.note}"
          </div>
        </div>
      </div>
    `).join('');

    const resolvedStat = document.getElementById('statResolvedCount');
    if (resolvedStat) {
      resolvedStat.textContent = `${state.auditTrail.length} Resolved Today`;
    }
  }

  // ==========================================================================
  // RENDER: AUTOMATED REMINDERS TAB (SOLUTION 2)
  // ==========================================================================
  function renderReminders() {
    renderDispatchLogTable();
    populateSimulatorDropdown();
    renderSimulatorChat();
  }

  function renderDispatchLogTable() {
    if (!dom.dispatchLogBody) return;

    dom.dispatchLogBody.innerHTML = state.dispatchLogs.map(item => `
      <tr>
        <td style="font-family:var(--font-mono); font-size:0.78rem;">${item.time}</td>
        <td><strong>${item.mentorName}</strong> <br><small class="text-muted">${item.mentorId}</small></td>
        <td><span class="badge badge-info">${item.triggerType}</span></td>
        <td>${item.channel}</td>
        <td><span class="pill pill-success">${item.status}</span></td>
        <td><small style="color:var(--text-secondary);">${item.reply}</small></td>
      </tr>
    `).join('');

    const countBadge = document.getElementById('dispatchTotalCountBadge');
    if (countBadge) {
      countBadge.textContent = `${state.dispatchLogs.length} Reminders Dispatched`;
    }
  }

  function populateSimulatorDropdown() {
    if (!dom.simTargetMentor) return;

    dom.simTargetMentor.innerHTML = state.mentors
      .filter(m => m.status.includes('missing') || m.status === 'absent' || m.id === 'MTR-102')
      .map(m => `
        <option value="${m.id}" ${m.id === state.selectedSimMentorId ? 'selected' : ''}>
          ${m.name} (${m.id}) - ${m.status.toUpperCase()}
        </option>
      `).join('');
  }

  function renderSimulatorChat() {
    if (!dom.phoneChatThread) return;

    const thread = state.chatThreads[state.selectedSimMentorId] || [
      { sender: 'bot', text: 'Hi! CipherSchools mentor reminder desk is active.', time: '09:00 AM' }
    ];

    dom.phoneChatThread.innerHTML = thread.map(msg => `
      <div class="chat-bubble ${msg.sender}">
        <p>${msg.text}</p>
        <div class="chat-meta">
          <span>${msg.time}</span>
          ${msg.sender === 'bot' ? '<span>✓✓</span>' : ''}
        </div>
      </div>
    `).join('');

    dom.phoneChatThread.scrollTop = dom.phoneChatThread.scrollHeight;
  }

  // ==========================================================================
  // RENDER: EXCEPTION REPORTING TAB (SOLUTION 3)
  // ==========================================================================
  function renderExceptions() {
    if (!dom.exceptionsTableBody) return;

    const deptFilter = document.getElementById('exceptionDeptFilter') ? document.getElementById('exceptionDeptFilter').value : 'all';
    const resolutionFilter = document.getElementById('exceptionResolutionFilter') ? document.getElementById('exceptionResolutionFilter').value : 'all';

    const exceptionsList = state.mentors.filter(m => {
      const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
      const isLate = pEval.status === 'late';
      const isMissingPunch = m.status === 'missing_out' || m.status === 'missing_in' || m.status === 'absent';
      const isUnderHours = m.effectiveHours > 0 && m.effectiveHours < 7.5;

      const isException = isLate || isMissingPunch || isUnderHours;
      if (!isException) return false;

      // Category Pill filter
      if (state.activeExceptionFilter !== 'all') {
        if (state.activeExceptionFilter === 'late_arrival' && !isLate) return false;
        if (state.activeExceptionFilter === 'missing_out' && m.status !== 'missing_out') return false;
        if (state.activeExceptionFilter === 'missing_in' && m.status !== 'missing_in') return false;
        if (state.activeExceptionFilter === 'unreported' && m.status !== 'absent') return false;
        if (state.activeExceptionFilter === 'under_hours' && !isUnderHours) return false;
      }

      // Dept filter
      if (deptFilter !== 'all' && m.dept !== deptFilter) return false;

      // Resolution filter
      if (resolutionFilter === 'pending' && m.status === 'reconciled') return false;
      if (resolutionFilter === 'resolved' && m.status !== 'reconciled') return false;

      return true;
    });

    if (exceptionsList.length === 0) {
      dom.exceptionsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            <p>No exceptions found matching current filter parameters.</p>
          </td>
        </tr>
      `;
      return;
    }

    dom.exceptionsTableBody.innerHTML = exceptionsList.map((m, idx) => {
      const excId = `EXC-2026-${String(idx + 101).padStart(3, '0')}`;
      const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
      
      let category = 'Missing Check-Out';
      let severity = '<span class="badge badge-danger">High Risk</span>';
      
      if (m.status === 'missing_in') {
        category = 'Missing Check-In';
        severity = '<span class="badge badge-warning">Medium Risk</span>';
      } else if (m.status === 'absent') {
        category = 'Zero Touch Attendance';
        severity = '<span class="badge badge-danger">Critical</span>';
      } else if (pEval.status === 'late') {
        category = `Late Arrival (After ${m.scheduledClassTime || '09:30 AM'})`;
        severity = '<span class="badge badge-warning">Punctuality Alert</span>';
      } else if (m.effectiveHours > 0 && m.effectiveHours < 7.5) {
        category = 'Under-Hours Shift';
        severity = '<span class="badge badge-info">Low</span>';
      }

      let resStatus = '<span class="pill pill-danger">Action Required</span>';
      if (m.status === 'reconciled') {
        resStatus = '<span class="pill pill-success">Reconciled</span>';
      } else if (m.status === 'verified') {
        resStatus = '<span class="pill pill-info">Logged & Verified</span>';
      }

      return `
        <tr>
          <td style="font-family:var(--font-mono); font-weight:700;">${excId}</td>
          <td>
            <strong>${m.name}</strong> <br>
            <small class="text-muted">${m.id}</small>
          </td>
          <td>
            <strong>${m.scheduledClassTime || '09:30 AM'}</strong><br>
            <small class="text-muted">${m.classroom || 'Lab'}</small>
          </td>
          <td>
            <small>IN: <strong>${m.checkIn}</strong></small><br>
            <small>OUT: <strong>${m.checkOut}</strong></small>
          </td>
          <td>
            <strong>${category}</strong><br>
            <small>${pEval.label}</small>
          </td>
          <td>${severity}</td>
          <td>${resStatus}</td>
          <td class="text-right">
            ${m.status === 'reconciled' ? `
              <button class="btn btn-outline btn-xs" onclick="window.app.openReconcileModal('${m.id}')">Inspect</button>
            ` : `
              <button class="btn btn-primary btn-xs" onclick="window.app.openReconcileModal('${m.id}')">Regularize</button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // MODAL 1: RECONCILE / ADJUST MODAL LOGIC (SOLUTION 1)
  // ==========================================================================
  function openReconcileModal(mentorId) {
    const mentor = state.mentors.find(m => m.id === mentorId);
    if (!mentor) return;

    state.selectedMentorForModal = mentor;

    const modalMentorName = document.getElementById('modalMentorName');
    const modalMentorMeta = document.getElementById('modalMentorMeta');
    const modalCheckInTime = document.getElementById('modalCheckInTime');
    const modalCheckOutTime = document.getElementById('modalCheckOutTime');
    const modalCheckInSub = document.getElementById('modalCheckInSub');
    const reconcileReason = document.getElementById('reconcileReason');
    const regularizeActionType = document.getElementById('regularizeActionType');
    const manualTimeGroup = document.getElementById('manualTimeGroup');

    if (modalMentorName) modalMentorName.textContent = `Reconcile Attendance: ${mentor.name}`;
    if (modalMentorMeta) modalMentorMeta.textContent = `${mentor.id} • ${mentor.name} • ${mentor.dept}`;
    if (modalCheckInTime) modalCheckInTime.textContent = mentor.checkIn;
    if (modalCheckOutTime) modalCheckOutTime.textContent = mentor.checkOut;

    const pEval = evaluatePunctuality(mentor.checkIn, mentor.scheduledClassTime || '09:30 AM');
    if (modalCheckInSub) {
      modalCheckInSub.textContent = `Class: ${mentor.scheduledClassTime || '09:30 AM'} (${pEval.label})`;
    }
    
    if (reconcileReason) {
      reconcileReason.value = mentor.evidence || 'Verified in Class Lab with student attendance roll call.';
    }

    if (manualTimeGroup) manualTimeGroup.style.display = 'none';
    if (regularizeActionType) {
      regularizeActionType.value = 'class_timetable';
      regularizeActionType.onchange = function () {
        if (this.value === 'manual_override') {
          manualTimeGroup.style.display = 'block';
        } else {
          manualTimeGroup.style.display = 'none';
        }
      };
    }

    dom.reconcileModal.classList.add('open');
  }

  function closeReconcileModal() {
    if (dom.reconcileModal) dom.reconcileModal.classList.remove('open');
    state.selectedMentorForModal = null;
  }

  function applyReconciliation() {
    const mentor = state.selectedMentorForModal;
    if (!mentor) return;

    const actionType = document.getElementById('regularizeActionType').value;
    const reason = document.getElementById('reconcileReason').value || 'CipherSchools lead approved adjustment';
    const manualTime = document.getElementById('manualAdjustedTime') ? document.getElementById('manualAdjustedTime').value : '17:00';

    let resolvedOut = '17:00 PM';
    let resolvedIn = mentor.checkIn;
    let adjustmentDesc = '';

    if (actionType === 'class_timetable') {
      if (mentor.checkOut.includes('--')) resolvedOut = '17:00 PM';
      if (mentor.checkIn.includes('--')) resolvedIn = '09:15 AM';
      mentor.effectiveHours = 7.75;
      adjustmentDesc = 'Paired with 17:00 PM Timetable';
    } else if (actionType === 'manual_override') {
      resolvedOut = `${manualTime} PM`;
      mentor.effectiveHours = 7.8;
      adjustmentDesc = `Manual override set to ${manualTime}`;
    } else if (actionType === 'mark_half_day') {
      resolvedOut = '13:00 PM';
      mentor.effectiveHours = 4.0;
      adjustmentDesc = 'Approved Half-Day (4.0 hrs)';
    } else if (actionType === 'excused_transit') {
      resolvedOut = '17:00 PM';
      resolvedIn = '09:15 AM';
      mentor.effectiveHours = 7.75;
      adjustmentDesc = 'Excused University Academic Event';
    }

    // Mutate state
    mentor.checkIn = resolvedIn;
    mentor.checkOut = resolvedOut;
    mentor.status = 'reconciled';
    mentor.evidence = reason;

    // Log to Audit Trail
    state.auditTrail.unshift({
      id: `AUD-${Date.now()}`,
      actor: 'Naveen Kumar (CipherSchools Lead)',
      mentorId: mentor.id,
      mentorName: mentor.name,
      method: actionType.replace('_', ' ').toUpperCase(),
      adjustment: adjustmentDesc,
      note: reason,
      timestamp: formatCurrentTime()
    });

    closeReconcileModal();
    recalculateMetrics();
    renderDashboard();
    renderReconciliation();
    renderExceptions();

    showToast(`✓ Reconciled attendance for ${mentor.name}. Record updated!`, 'success');
  }

  // Auto suggest for all candidates
  function autoPairAllCandidates() {
    const unpaired = state.mentors.filter(m => m.status === 'missing_out' || m.status === 'missing_in');
    if (unpaired.length === 0) {
      showToast('All mentor records are already complete!', 'info');
      return;
    }

    unpaired.forEach(m => {
      if (m.checkOut.includes('--')) m.checkOut = '17:00 PM';
      if (m.checkIn.includes('--')) m.checkIn = '09:15 AM';
      m.status = 'reconciled';
      m.effectiveHours = 7.75;
      m.evidence = 'Auto-paired against Lovely Professional University course roster.';

      state.auditTrail.unshift({
        id: `AUD-${Date.now()}-${m.id}`,
        actor: 'Timetable Pairing Engine',
        mentorId: m.id,
        mentorName: m.name,
        method: 'TIMETABLE PAIRING',
        adjustment: 'Matched 09:15 AM - 17:00 PM Shift',
        note: 'Matched against student classroom roll call.',
        timestamp: formatCurrentTime()
      });
    });

    recalculateMetrics();
    renderDashboard();
    renderReconciliation();
    renderExceptions();
    showToast(`✓ Successfully auto-paired and reconciled ${unpaired.length} mentors!`, 'success');
  }

  // ==========================================================================
  // MODAL 2: EXCEL / CSV IMPORT DESK
  // ==========================================================================
  function openExcelImportModal() {
    if (dom.excelImportModal) dom.excelImportModal.classList.add('open');
  }

  function closeExcelImportModal() {
    if (dom.excelImportModal) dom.excelImportModal.classList.remove('open');
  }

  function loadSampleExcelData() {
    state.parsedExcelData = SAMPLE_EXCEL_IMPORT_DATA;

    const previewWrap = document.getElementById('importPreviewWrap');
    const previewBody = document.getElementById('excelPreviewBody');
    const parsedRowCount = document.getElementById('parsedRowCount');
    const btnApply = document.getElementById('btnApplyExcelImport');

    if (previewWrap) previewWrap.style.display = 'block';
    if (parsedRowCount) parsedRowCount.textContent = state.parsedExcelData.length;
    if (btnApply) btnApply.disabled = false;

    if (previewBody) {
      previewBody.innerHTML = state.parsedExcelData.map(row => {
        const pEval = evaluatePunctuality(row.in, row.scheduled);
        return `
          <tr>
            <td><strong>${row.id}</strong></td>
            <td>${row.name}</td>
            <td>${row.scheduled}</td>
            <td><span class="stamp-tag stamp-in">${row.in}</span></td>
            <td><span class="pill ${pEval.badgeClass}">${pEval.label}</span></td>
            <td><span class="stamp-tag stamp-out">${row.out}</span></td>
            <td>${row.room}</td>
          </tr>
        `;
      }).join('');
    }

    showToast('Loaded sample Lovely Professional University Attendance Sheet (20 mentors). Ready to import!', 'info');
  }

  function applyExcelImport() {
    if (!state.parsedExcelData) return;

    state.parsedExcelData.forEach(row => {
      const mentor = state.mentors.find(m => m.id === row.id);
      if (mentor) {
        mentor.checkIn = row.in;
        mentor.checkOut = row.out;
        mentor.scheduledClassTime = row.scheduled;
        mentor.classroom = row.room;
        mentor.source = 'Excel Import';
        mentor.status = (row.in !== '--:--' && row.out !== '--:--') ? 'verified' : (row.in === '--:--' ? 'missing_in' : 'missing_out');
        mentor.effectiveHours = (mentor.status === 'verified') ? 8.0 : 0.0;
        mentor.evidence = 'Imported from LPU Signed Attendance Excel Sheet';
      }
    });

    state.auditTrail.unshift({
      id: `AUD-EXCEL-${Date.now()}`,
      actor: 'Excel Import Engine',
      mentorId: 'ALL-20',
      mentorName: 'Cohort Batch Import',
      method: 'EXCEL FILE INGESTION',
      adjustment: 'Batch-updated 20 mentor punch stamps',
      note: 'Imported LPU campus morning and evening sign-in records.',
      timestamp: formatCurrentTime()
    });

    closeExcelImportModal();
    recalculateMetrics();
    renderDashboard();
    renderReconciliation();
    renderExceptions();

    showToast('✓ Successfully imported attendance records from LPU Excel spreadsheet!', 'success');
  }

  function downloadCSVTemplate() {
    const template = 'Mentor_ID,Mentor_Name,Department,Scheduled_Class,Check_In,Check_Out,Classroom\n' +
      'MTR-101,Dr. Aarav Sharma,Data Science & AI,09:30 AM,09:05 AM,17:15 PM,Block 34 Lab 301\n' +
      'MTR-102,Priya Nair,Full Stack Web,09:30 AM,09:12 AM,17:00 PM,Block 34 Lab 402\n';

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cipherschools_lpu_attendance_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded sample attendance template CSV!', 'success');
  }

  // ==========================================================================
  // MODAL 3: LOG / EDIT MANUAL ATTENDANCE ENTRY
  // ==========================================================================
  function populateManualMentorSelect(selectedId = null) {
    const select = document.getElementById('manualEntryMentorSelect');
    if (!select) return;

    select.innerHTML = state.mentors.map(m => `
      <option value="${m.id}" ${m.id === selectedId ? 'selected' : ''}>
        ${m.name} (${m.id}) • ${m.dept}
      </option>
    `).join('');
  }

  function openManualEntryModal(preselectedId = null) {
    populateManualMentorSelect(preselectedId || state.mentors[0].id);

    if (preselectedId) {
      const m = state.mentors.find(item => item.id === preselectedId);
      if (m) {
        if (document.getElementById('manualScheduledTime')) document.getElementById('manualScheduledTime').value = m.scheduledClassTime || '09:30 AM';
        if (document.getElementById('manualClassroom')) document.getElementById('manualClassroom').value = m.classroom || 'Block 34, Lab 402';
      }
    }

    if (dom.manualEntryModal) dom.manualEntryModal.classList.add('open');
  }

  function closeManualEntryModal() {
    if (dom.manualEntryModal) dom.manualEntryModal.classList.remove('open');
  }

  function saveManualEntry() {
    const select = document.getElementById('manualEntryMentorSelect');
    const mentorId = select ? select.value : null;
    const mentor = state.mentors.find(m => m.id === mentorId);
    if (!mentor) return;

    const scheduled = document.getElementById('manualScheduledTime').value || '09:30 AM';
    const classroom = document.getElementById('manualClassroom').value || 'Block 34, Lab 402';
    const checkInInput = document.getElementById('manualEntryCheckIn').value;
    const checkOutInput = document.getElementById('manualEntryCheckOut').value;
    const remarks = document.getElementById('manualEntryRemarks').value || 'Manual entry by coordinator';

    function formatTime24to12(timeStr) {
      if (!timeStr) return '--:--';
      const parts = timeStr.split(':');
      let h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
    }

    const formattedIn = formatTime24to12(checkInInput);
    const formattedOut = formatTime24to12(checkOutInput);

    mentor.scheduledClassTime = scheduled;
    mentor.classroom = classroom;
    mentor.checkIn = formattedIn;
    mentor.checkOut = formattedOut;
    mentor.source = 'Manual Entry';
    mentor.status = (formattedIn !== '--:--' && formattedOut !== '--:--') ? 'verified' : (formattedIn === '--:--' ? 'missing_in' : 'missing_out');
    mentor.effectiveHours = (mentor.status === 'verified') ? 7.8 : 0.0;
    mentor.evidence = remarks;

    state.auditTrail.unshift({
      id: `AUD-MANUAL-${Date.now()}`,
      actor: 'Naveen Kumar (CipherSchools LPU Lead)',
      mentorId: mentor.id,
      mentorName: mentor.name,
      method: 'MANUAL PUNCH ENTRY',
      adjustment: `In: ${formattedIn}, Out: ${formattedOut}`,
      note: remarks,
      timestamp: formatCurrentTime()
    });

    closeManualEntryModal();
    recalculateMetrics();
    renderDashboard();
    renderReconciliation();
    renderExceptions();

    showToast(`✓ Manually saved punch for ${mentor.name}!`, 'success');
  }

  // ==========================================================================
  // AUTOMATED REMINDER TRIGGER LOGIC (SOLUTION 2)
  // ==========================================================================
  function triggerRuleManually(ruleNum) {
    if (ruleNum === 1) {
      // Pre-Class Check-In Alert (09:15 AM)
      const targets = state.mentors.filter(m => m.checkIn.includes('--'));
      if (targets.length === 0) {
        showToast('Rule 1: All mentors already have checked in before class!', 'info');
        return;
      }

      targets.forEach(m => {
        const dspId = `DSP-${Date.now()}-${m.id}`;
        state.dispatchLogs.unshift({
          id: dspId,
          time: formatCurrentTime(),
          mentorId: m.id,
          mentorName: m.name,
          triggerType: '09:15 AM Pre-Class Reminder',
          channel: 'WhatsApp + SMS',
          status: 'Delivered',
          reply: 'Triggered via rule simulation'
        });

        if (!state.chatThreads[m.id]) state.chatThreads[m.id] = [];
        state.chatThreads[m.id].push({
          sender: 'bot',
          text: `Hi ${m.name}! Your scheduled class at Lovely Professional University starts at ${m.scheduledClassTime || '09:30 AM'} in ${m.classroom || 'Lab'}. Please sign in before 09:30 AM to maintain on-time status!`,
          time: formatCurrentTime()
        });
      });

      renderReminders();
      showToast(`Rule 1 Triggered: Dispatched pre-class reminders to ${targets.length} mentors!`, 'warning');
    } else if (ruleNum === 2) {
      // Evening Sign-out Safeguard
      const targets = state.mentors.filter(m => !m.checkIn.includes('--') && m.checkOut.includes('--'));
      if (targets.length === 0) {
        showToast('Rule 2: No mentors currently on campus with missing sign-out punches.', 'info');
        return;
      }

      targets.forEach(m => {
        state.dispatchLogs.unshift({
          id: `DSP-${Date.now()}-${m.id}`,
          time: formatCurrentTime(),
          mentorId: m.id,
          mentorName: m.name,
          triggerType: 'Shift-End Sign-Out Alert',
          channel: 'WhatsApp + App Push',
          status: 'Read',
          reply: 'Awaiting exit sign-out'
        });

        if (!state.chatThreads[m.id]) state.chatThreads[m.id] = [];
        state.chatThreads[m.id].push({
          sender: 'bot',
          text: `Hi ${m.name}! Your shift at LPU finishes at 17:00 PM. Please remember to record your sign-out on the desk register before leaving campus!`,
          time: formatCurrentTime()
        });
      });

      renderReminders();
      showToast(`Rule 2 Triggered: Dispatched exit sign-out nudge to ${targets.length} mentors!`, 'info');
    } else if (ruleNum === 3) {
      // Coordinator Digest
      state.dispatchLogs.unshift({
        id: `DSP-${Date.now()}-COORD`,
        time: formatCurrentTime(),
        mentorId: 'MTR-ALL',
        mentorName: 'CipherSchools LPU Lead (Naveen Kumar)',
        triggerType: 'Class Punctuality Digest',
        channel: 'Slack + WhatsApp Digest',
        status: 'Delivered',
        reply: 'Digest review in progress'
      });
      renderReminders();
      showToast('Rule 3 Triggered: Sent 09:40 AM class punctuality digest to coordinator.', 'success');
    }
  }

  function sendSimulatedReply() {
    const input = dom.phoneQuickReplyInput;
    if (!input || !input.value.trim()) return;

    const mentorId = state.selectedSimMentorId;
    const text = input.value.trim();

    if (!state.chatThreads[mentorId]) state.chatThreads[mentorId] = [];
    state.chatThreads[mentorId].push({
      sender: 'mentor',
      text: text,
      time: formatCurrentTime()
    });

    const log = state.dispatchLogs.find(l => l.mentorId === mentorId);
    if (log) {
      log.reply = text;
      log.status = 'Replied';
    }

    input.value = '';
    renderSimulatorChat();
    renderDispatchLogTable();
    showToast(`Received reply from ${mentorId}: "${text}"`, 'success');
  }

  // ==========================================================================
  // EXPORT & AUDIT REPORT MODAL (SOLUTION 3 & 4)
  // ==========================================================================
  function openAuditReportModal() {
    if (!dom.auditReportModal) return;

    const total = state.mentors.length;
    const verified = state.mentors.filter(m => m.status === 'verified' || m.status === 'reconciled').length;
    const exceptions = state.mentors.filter(m => m.status === 'missing_out' || m.status === 'missing_in' || m.status === 'absent');
    const totalHours = state.mentors.reduce((acc, m) => acc + (m.effectiveHours || 0), 0).toFixed(1);

    let onTimeCount = 0;
    let checkedInTotal = 0;
    state.mentors.forEach(m => {
      if (!m.checkIn.includes('--')) {
        checkedInTotal++;
        const p = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
        if (p.status === 'on_time') onTimeCount++;
      }
    });
    const punctualityRate = checkedInTotal > 0 ? ((onTimeCount / checkedInTotal) * 100).toFixed(1) : '0.0';

    const reportPunctualityRate = document.getElementById('reportPunctualityRate');
    const reportExceptionTotal = document.getElementById('reportExceptionTotal');
    const reportReconciledTotal = document.getElementById('reportReconciledTotal');
    const reportTotalHours = document.getElementById('reportTotalHours');

    if (reportPunctualityRate) reportPunctualityRate.textContent = `${punctualityRate}%`;
    if (reportExceptionTotal) reportExceptionTotal.textContent = `${exceptions.length} Cases`;
    if (reportReconciledTotal) reportReconciledTotal.textContent = `${state.auditTrail.length} Cases`;
    if (reportTotalHours) reportTotalHours.textContent = `${totalHours} hrs`;

    if (dom.reportTableBody) {
      dom.reportTableBody.innerHTML = state.mentors.map(m => {
        const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
        return `
          <tr>
            <td style="font-family:var(--font-mono); font-weight:700;">${m.id}</td>
            <td>${m.name}</td>
            <td>${m.dept}</td>
            <td>${m.scheduledClassTime || '09:30 AM'}</td>
            <td>${m.checkIn}</td>
            <td>${pEval.label}</td>
            <td>${m.checkOut}</td>
            <td>${m.effectiveHours > 0 ? m.effectiveHours + 'h' : '0.0h'}</td>
            <td><strong>${m.status.toUpperCase()}</strong></td>
          </tr>
        `;
      }).join('');
    }

    dom.auditReportModal.classList.add('open');
  }

  function closeAuditReportModal() {
    if (dom.auditReportModal) dom.auditReportModal.classList.remove('open');
  }

  function exportCSV() {
    let csv = 'Mentor_ID,Mentor_Name,Department,Scheduled_Class,Check_In,Class_Punctuality,Check_Out,Net_Hours,Status,Source\n';
    state.mentors.forEach(m => {
      const pEval = evaluatePunctuality(m.checkIn, m.scheduledClassTime || '09:30 AM');
      csv += `"${m.id}","${m.name}","${m.dept}","${m.scheduledClassTime || '09:30 AM'}","${m.checkIn}","${pEval.label}","${m.checkOut}",${m.effectiveHours},"${m.status}","${m.source || 'Manual'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cipherschools_lpu_attendance_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('✓ Exported attendance ledger to CSV!', 'success');
  }

  function resetDemo() {
    state.mentors = JSON.parse(JSON.stringify(INITIAL_MENTORS_DATA));
    state.dispatchLogs = JSON.parse(JSON.stringify(INITIAL_DISPATCH_LOGS));
    state.auditTrail = [];
    state.activeExceptionFilter = 'all';
    state.parsedExcelData = null;

    updateUniversityCampus('lpu', true);
    recalculateMetrics();
    renderDashboard();
    renderAnalysis();
    renderReconciliation();
    renderReminders();
    renderExceptions();

    showToast('Demo state reset to initial conditions (6 unresolved exceptions).', 'info');
  }

  // ==========================================================================
  // EVENT LISTENERS INITIALIZATION
  // ==========================================================================
  function initEvents() {
    // Tabs Navigation
    dom.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        dom.tabs.forEach(t => t.classList.remove('active'));
        dom.panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
        state.activeTab = targetId;

        if (targetId === 'tab-dashboard') renderDashboard();
        if (targetId === 'tab-reconciliation') renderReconciliation();
        if (targetId === 'tab-reminders') renderReminders();
        if (targetId === 'tab-exceptions') renderExceptions();
        if (targetId === 'tab-analysis') renderAnalysis();
      });
    });

    // University Campus Selector
    if (dom.universitySelect) {
      dom.universitySelect.addEventListener('change', (e) => {
        updateUniversityCampus(e.target.value);
      });
    }

    // Top action buttons
    const btnOpenExcelModal = document.getElementById('btnOpenExcelModal');
    if (btnOpenExcelModal) btnOpenExcelModal.addEventListener('click', openExcelImportModal);

    const btnOpenManualEntryModal = document.getElementById('btnOpenManualEntryModal');
    if (btnOpenManualEntryModal) btnOpenManualEntryModal.addEventListener('click', () => openManualEntryModal());

    const btnResetDemo = document.getElementById('btnResetDemo');
    if (btnResetDemo) btnResetDemo.addEventListener('click', resetDemo);
    if (dom.btnResetDemoFooter) dom.btnResetDemoFooter.addEventListener('click', resetDemo);

    const btnQuickBatchReminder = document.getElementById('btnQuickBatchReminder');
    if (btnQuickBatchReminder) {
      btnQuickBatchReminder.addEventListener('click', () => {
        const tabReminders = document.getElementById('tabNavReminders');
        if (tabReminders) tabReminders.click();
        triggerRuleManually(2);
      });
    }

    // Modal Close Events
    if (dom.modalCloseBtn) dom.modalCloseBtn.addEventListener('click', closeReconcileModal);
    if (dom.modalCancelBtn) dom.modalCancelBtn.addEventListener('click', closeReconcileModal);
    if (dom.modalConfirmBtn) dom.modalConfirmBtn.addEventListener('click', applyReconciliation);

    if (dom.auditModalCloseBtn) dom.auditModalCloseBtn.addEventListener('click', closeAuditReportModal);
    if (dom.auditModalCancelBtn) dom.auditModalCancelBtn.addEventListener('click', closeAuditReportModal);

    if (dom.excelModalCloseBtn) dom.excelModalCloseBtn.addEventListener('click', closeExcelImportModal);
    if (dom.excelModalCancelBtn) dom.excelModalCancelBtn.addEventListener('click', closeExcelImportModal);

    if (dom.manualModalCloseBtn) dom.manualModalCloseBtn.addEventListener('click', closeManualEntryModal);
    if (dom.manualModalCancelBtn) dom.manualModalCancelBtn.addEventListener('click', closeManualEntryModal);

    // Excel Import Buttons
    const btnLoadSampleExcel = document.getElementById('btnLoadSampleExcel');
    if (btnLoadSampleExcel) btnLoadSampleExcel.addEventListener('click', loadSampleExcelData);

    const btnDownloadTemplate = document.getElementById('btnDownloadTemplate');
    if (btnDownloadTemplate) btnDownloadTemplate.addEventListener('click', downloadCSVTemplate);

    const btnApplyExcelImport = document.getElementById('btnApplyExcelImport');
    if (btnApplyExcelImport) btnApplyExcelImport.addEventListener('click', applyExcelImport);

    // Manual Entry Save Button
    const btnSaveManualEntry = document.getElementById('btnSaveManualEntry');
    if (btnSaveManualEntry) btnSaveManualEntry.addEventListener('click', saveManualEntry);

    // Audit Report Modal Signoff
    const btnConfirmAuditSignoff = document.getElementById('btnConfirmAuditSignoff');
    if (btnConfirmAuditSignoff) {
      btnConfirmAuditSignoff.addEventListener('click', () => {
        closeAuditReportModal();
        showToast('✓ Official Audit Report signed off and locked for University Finance!', 'success');
      });
    }

    // Reconciliation Buttons
    const btnAutoPairCandidates = document.getElementById('btnAutoPairCandidates');
    if (btnAutoPairCandidates) btnAutoPairCandidates.addEventListener('click', autoPairAllCandidates);

    const btnBatchReconcile = document.getElementById('btnBatchReconcile');
    if (btnBatchReconcile) {
      btnBatchReconcile.addEventListener('click', () => {
        autoPairAllCandidates();
        showToast('✓ Batch reconciliation committed to University Attendance Portal!', 'success');
      });
    }

    const btnFilterReconcileNeedsAction = document.getElementById('btnFilterReconcileNeedsAction');
    const btnFilterReconcileAll = document.getElementById('btnFilterReconcileAll');

    if (btnFilterReconcileNeedsAction) {
      btnFilterReconcileNeedsAction.addEventListener('click', () => {
        reconcileFilterNeedsActionOnly = true;
        renderReconciliation();
      });
    }

    if (btnFilterReconcileAll) {
      btnFilterReconcileAll.addEventListener('click', () => {
        reconcileFilterNeedsActionOnly = false;
        renderReconciliation();
      });
    }

    // Reminder Rule Buttons
    const btnTestTriggerMorning = document.getElementById('btnTestTriggerMorning');
    if (btnTestTriggerMorning) btnTestTriggerMorning.addEventListener('click', () => triggerRuleManually(1));

    const btnTestTriggerEvening = document.getElementById('btnTestTriggerEvening');
    if (btnTestTriggerEvening) btnTestTriggerEvening.addEventListener('click', () => triggerRuleManually(2));

    // Simulator
    if (dom.simTargetMentor) {
      dom.simTargetMentor.addEventListener('change', (e) => {
        state.selectedSimMentorId = e.target.value;
        renderSimulatorChat();
      });
    }

    if (dom.btnSendSimulatedReply) dom.btnSendSimulatedReply.addEventListener('click', sendSimulatedReply);
    if (dom.phoneQuickReplyInput) {
      dom.phoneQuickReplyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendSimulatedReply();
      });
    }

    // Exception Summary Filter Pills
    const summaryPills = document.querySelectorAll('.summary-pill');
    summaryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        summaryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeExceptionFilter = pill.getAttribute('data-filter');
        renderExceptions();
      });
    });

    const exceptionDeptFilter = document.getElementById('exceptionDeptFilter');
    if (exceptionDeptFilter) exceptionDeptFilter.addEventListener('change', renderExceptions);

    const exceptionResolutionFilter = document.getElementById('exceptionResolutionFilter');
    if (exceptionResolutionFilter) exceptionResolutionFilter.addEventListener('change', renderExceptions);

    // Export buttons
    const btnExportCSV = document.getElementById('btnExportCSV');
    if (btnExportCSV) btnExportCSV.addEventListener('click', exportCSV);

    const btnGeneratePDFReport = document.getElementById('btnGeneratePDFReport');
    if (btnGeneratePDFReport) btnGeneratePDFReport.addEventListener('click', openAuditReportModal);

    const btnExportDashboardSummary = document.getElementById('btnExportDashboardSummary');
    if (btnExportDashboardSummary) btnExportDashboardSummary.addEventListener('click', openAuditReportModal);

    // Dashboard filters
    if (dom.dashboardSearchInput) dom.dashboardSearchInput.addEventListener('input', renderDashboardTable);
    if (dom.dashboardStatusFilter) dom.dashboardStatusFilter.addEventListener('change', renderDashboardTable);

    // Dropzone drag/drop listeners
    const dropzone = document.getElementById('excelDropzone');
    const fileInput = document.getElementById('excelFileInput');

    if (dropzone && fileInput) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        loadSampleExcelData();
      });

      fileInput.addEventListener('change', () => {
        loadSampleExcelData();
      });
    }
  }

  // Application Bootstrapping
  function init() {
    initEvents();
    updateUniversityCampus('lpu', true);
    recalculateMetrics();
    renderDashboard();
    renderAnalysis();
    renderReconciliation();
    renderReminders();
    renderExceptions();
  }

  // Expose global controller
  window.app = {
    openReconcileModal,
    openManualEntryForMentor: (mentorId) => openManualEntryModal(mentorId),
    triggerRuleManually
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
