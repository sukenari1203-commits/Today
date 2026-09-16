(() => {
  const app = document.getElementById('app');
  const volume = window.GUIDE_DATA.volumes[0];
  const STORAGE = 'adult-real-guide-progress-v1';

  const state = loadState();
  let currentSectionIndex = getCurrentSectionIndex();
  let currentPageIndex = Math.max(0, Math.min(state.pageIndex || 0, getSection().pages.length - 1));
  let dragStartX = null;
  let dragCurrentX = null;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE)) || { sectionIndex: 0, pageIndex: 0, completed: [] };
    } catch (_) {
      return { sectionIndex: 0, pageIndex: 0, completed: [] };
    }
  }

  function saveState() {
    const next = {
      sectionIndex: currentSectionIndex,
      pageIndex: currentPageIndex,
      completed: state.completed || []
    };
    localStorage.setItem(STORAGE, JSON.stringify(next));
    Object.assign(state, next);
  }

  function getCurrentSectionIndex() {
    return Math.min(state.sectionIndex || 0, Math.max(0, volume.sections.length - 1));
  }

  function getSection() {
    return volume.sections[currentSectionIndex];
  }

  function progressRatio() {
    const totalExistingPages = volume.sections.reduce((n, s) => n + s.pages.length, 0);
    let before = 0;
    for (let i = 0; i < currentSectionIndex; i++) before += volume.sections[i].pages.length;
    return totalExistingPages ? (before + currentPageIndex + 1) / totalExistingPages : 0;
  }

  function showCover() {
    const ratio = progressRatio();
    const section = getSection();
    app.innerHTML = `
      <section class="cover" style="--bookmark:${Math.max(16, ratio * 68)}%">
        <div class="cover-bookmark" aria-hidden="true"></div>
        <div>
          <div class="cover-kicker">VOLUME 01</div>
          <h1>${escapeHtml(volume.title)}</h1>
          <p>${escapeHtml(volume.subtitle)}</p>
        </div>
        <div class="cover-actions">
          <button class="primary-btn" id="readBtn">${currentPageIndex > 0 ? '続きを読む' : '最初の問いを開く'}</button>
          <div class="locked-note">本棚は第1冊（100セクション）を読み終えたあとに解放。<br>現在は Section ${String(section.number).padStart(2,'0')} まで実装済み。</div>
        </div>
      </section>
    `;
    document.getElementById('readBtn').addEventListener('click', showReader);
  }

  function showReader() {
    const section = getSection();
    const page = section.pages[currentPageIndex];
    app.innerHTML = `
      <section class="reader" aria-label="${escapeHtml(section.title)}">
        <div class="book-frame">
          <article class="page ${page.type}" id="page">
            <div class="topbar">
              <button class="icon-btn" id="closeBtn" aria-label="表紙に戻る">✕</button>
              <span>SECTION ${String(section.number).padStart(2,'0')}</span>
              <span>${currentPageIndex + 1}/${section.pages.length}</span>
            </div>
            ${renderPage(page)}
            ${page.endSection ? '' : `<div class="page-corner" id="corner" aria-label="次のページ"></div>`}
          </article>
          <div class="page-index-dots" aria-hidden="true">
            ${section.pages.map((_, i) => `<div class="dot ${i === currentPageIndex ? 'active' : ''}"></div>`).join('')}
          </div>
        </div>
      </section>
    `;

    const pageEl = document.getElementById('page');
    document.getElementById('closeBtn').addEventListener('click', () => { saveState(); showCover(); });
    document.getElementById('corner')?.addEventListener('click', nextPage);
    document.getElementById('finishBtn')?.addEventListener('click', finishSection);

    pageEl.addEventListener('pointerdown', onPointerDown);
    pageEl.addEventListener('pointermove', onPointerMove);
    pageEl.addEventListener('pointerup', onPointerUp);
    pageEl.addEventListener('pointercancel', onPointerCancel);
  }

  function renderPage(page) {
    const eyebrow = page.eyebrow ? `<div class="eyebrow">${escapeHtml(page.eyebrow)}</div>` : '';
    const stamp = page.stamp ? `<div class="failure-stamp">${escapeHtml(page.stamp)}</div>` : '';
    const title = page.title ? `<h2 class="page-title">${escapeHtml(page.title)}</h2>` : '';
    const visual = renderVisual(page.visual);
    const body = page.body ? `<div class="page-body">${page.body.map(p => `<p>${escapeHtml(p)}</p>`).join('')}</div>` : '';
    const note = page.note ? `<div class="note">${escapeHtml(page.note)}</div>` : '';
    const day = page.dayLine ? `<div class="day-line">デイ「${escapeHtml(page.dayLine)}」</div>` : '';
    const reveal = page.reveal ? `<div class="reveal">${escapeHtml(page.reveal)}</div>` : '';
    const trigger = page.trigger ? `<div class="trigger">${escapeHtml(page.trigger)}</div>` : '';
    const wisdom = page.wisdom ? `<div class="wisdom-text">「${escapeHtml(page.wisdom)}」</div>` : '';
    const chorus = page.type === 'chorus' ? renderChorus(page) : '';
    const finish = page.endSection ? `<div class="wisdom-close"><button id="finishBtn" class="primary-btn">セクションを閉じる</button></div>` : '';

    return `${eyebrow}${stamp}${title}${chorus || visual}${body}${note}${reveal}${wisdom}${day}${finish}${trigger}`;
  }

  function renderVisual(v) {
    if (!v) return '';
    const day = v.dayPose ? renderDay(v.dayPose) : '';

    if (v.kind === 'timeline') return `<div class="visual timeline"><div>${escapeHtml(v.left)}</div><div>${escapeHtml(v.right)}</div>${day}</div>`;
    if (v.kind === 'split') return `<div class="visual split"><div>${escapeHtml(v.left)}</div><div>${escapeHtml(v.right)}</div><div class="badge">${escapeHtml(v.badge)}</div>${day}</div>`;
    if (v.kind === 'islands') return `<div class="visual islands">${v.items.map(x => `<div class="island">${escapeHtml(x)}</div>`).join('')}${day}</div>`;
    if (v.kind === 'routine') return `<div class="visual routine"><div class="routine-row">${v.items.map((x, i) => `<span class="chip">${i ? '→ ' : ''}${escapeHtml(x)}</span>`).join('')}</div><div class="routine-row"><span class="chip">月</span><span class="chip">火</span><span class="chip">水</span><span class="chip">木</span><span class="chip">金</span></div>${day}</div>`;
    if (v.kind === 'clocks' || v.kind === 'rail') return `<div class="visual ${v.kind}">${v.items.map(x => `<div class="chip">${escapeHtml(x)}</div>`).join('')}${day}</div>`;
    if (['station', 'collision', 'manyClocks'].includes(v.kind)) return `<div class="visual failure-scene"><div>${escapeHtml(v.label)}</div>${day}</div>`;
    if (v.kind === 'network') return `<div class="visual network">${v.items.map(x => `<div class="chip">${escapeHtml(x)}</div>`).join('')}${day}</div>`;
    return '';
  }

  function renderDay(pose) {
    const accessories = {
      school: '🎒', watch: '⌚', memory: '💭', routine: '☕', traveler: '🧳', conductor: '🎩', confused: '❓', silent: '', observe: '🔎', modern: '📱'
    };
    const accessory = accessories[pose] || '';
    return `
      <div class="day-wrap" aria-label="デイ">
        <svg class="day-svg" viewBox="0 0 120 120" role="img" aria-hidden="true">
          <path d="M26 49C9 43 6 28 13 17c9 5 18 10 24 20" fill="#55504d" opacity=".92"/>
          <path d="M94 49c17-6 20-21 13-32-9 5-18 10-24 20" fill="#55504d" opacity=".92"/>
          <path d="M42 35 29 8c16 5 24 15 27 26" fill="#55504d"/>
          <path d="M78 35 91 8c-16 5-24 15-27 26" fill="#55504d"/>
          <path d="m39 29-7-13c8 4 13 8 17 16" fill="#d3a99b"/>
          <path d="m81 29 7-13c-8 4-13 8-17 16" fill="#d3a99b"/>
          <ellipse cx="60" cy="69" rx="36" ry="40" fill="#5e5956"/>
          <ellipse cx="60" cy="83" rx="23" ry="22" fill="#b9b4ae"/>
          <ellipse cx="47" cy="59" rx="9" ry="11" fill="#171615"/>
          <ellipse cx="73" cy="59" rx="9" ry="11" fill="#171615"/>
          <circle cx="44" cy="55" r="2.6" fill="white"/>
          <circle cx="70" cy="55" r="2.6" fill="white"/>
          <path d="M56 72c3 2 5 2 8 0" stroke="#292623" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="m52 71 3 8 4-7" fill="#f2eee9"/>
          <path d="m68 71-3 8-4-7" fill="#f2eee9"/>
          <path d="M35 86c14 5 31 5 48-1" stroke="#6f4b33" stroke-width="4" fill="none" stroke-linecap="round"/>
          <rect x="78" y="84" width="16" height="14" rx="3" fill="#7b5639" transform="rotate(-7 78 84)"/>
        </svg>
        ${accessory ? `<span class="day-accessory">${accessory}</span>` : ''}
      </div>
    `;
  }

  function renderChorus(page) {
    return `<div class="chorus-stage">
      <div class="chorus-col">${page.chorusLeft.map(x => `<div class="chip">${escapeHtml(x)}</div>`).join('')}</div>
      <div class="chorus-arrow">→</div>
      <div class="chorus-col">${page.chorusRight.map(x => `<div class="chip">${escapeHtml(x)}</div>`).join('')}</div>
    </div>`;
  }

  function nextPage() {
    const section = getSection();
    if (currentPageIndex >= section.pages.length - 1) return;
    animateTurn('next', () => {
      currentPageIndex += 1;
      saveState();
      showReader();
    });
  }

  function prevPage() {
    if (currentPageIndex <= 0) return;
    animateTurn('prev', () => {
      currentPageIndex -= 1;
      saveState();
      showReader();
    });
  }

  function animateTurn(dir, done) {
    const pageEl = document.getElementById('page');
    if (!pageEl) return done();
    pageEl.classList.add('turning');
    pageEl.style.transformOrigin = dir === 'next' ? 'left center' : 'right center';
    requestAnimationFrame(() => {
      pageEl.style.transform = dir === 'next' ? 'rotateY(-78deg)' : 'rotateY(78deg)';
      pageEl.style.filter = 'brightness(.93)';
    });
    setTimeout(done, 315);
  }

  function finishSection() {
    const section = getSection();
    if (!state.completed.includes(section.id)) state.completed.push(section.id);
    const hasNext = currentSectionIndex < volume.sections.length - 1;

    if (hasNext) {
      currentSectionIndex += 1;
      currentPageIndex = 0;
      saveState();
      showReader();
      return;
    }

    saveState();
    app.innerHTML = `
      <section class="section-complete">
        <div class="cover-kicker">SECTION ${String(section.number).padStart(2,'0')} COMPLETE</div>
        <h2>一つ目の問い、終了。</h2>
        <p>Section 02 を sections.js に追加すれば、ここから自動で続く。<br>第1冊の本棚は100セクション完読時に解放する設計。</p>
        <button id="backCover" class="primary-btn">表紙に戻る</button>
      </section>
    `;
    document.getElementById('backCover').addEventListener('click', showCover);
  }

  function onPointerDown(e) {
    if (e.target.closest('button')) return;
    dragStartX = e.clientX;
    dragCurrentX = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (dragStartX == null) return;
    dragCurrentX = e.clientX;
    const dx = dragCurrentX - dragStartX;
    const pageEl = e.currentTarget;
    pageEl.classList.add('dragging');
    const w = Math.max(260, pageEl.clientWidth);
    const ratio = Math.max(-1, Math.min(1, dx / w));

    if (ratio < 0) {
      pageEl.style.transformOrigin = 'left center';
      pageEl.style.transform = `rotateY(${ratio * 48}deg)`;
    } else if (currentPageIndex > 0) {
      pageEl.style.transformOrigin = 'right center';
      pageEl.style.transform = `rotateY(${ratio * 32}deg)`;
    }
  }

  function onPointerUp(e) {
    if (dragStartX == null) return;
    const dx = (dragCurrentX ?? e.clientX) - dragStartX;
    resetDrag(e.currentTarget);
    dragStartX = null;
    dragCurrentX = null;

    if (dx < -54) nextPage();
    else if (dx > 54) prevPage();
  }

  function onPointerCancel(e) {
    resetDrag(e.currentTarget);
    dragStartX = null;
    dragCurrentX = null;
  }

  function resetDrag(el) {
    el.classList.remove('dragging');
    el.style.transform = '';
    el.style.transformOrigin = '';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
      .replaceAll('\n', '<br>');
  }

  document.addEventListener('keydown', (e) => {
    if (!document.querySelector('.reader')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') nextPage();
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevPage();
    if (e.key === 'Escape') showCover();
  });

  showCover();
})();
