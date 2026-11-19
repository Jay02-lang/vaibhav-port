/**
 * ==========================================================================
 * VAIBHAV BADOLE — PORTFOLIO MOTION & INTERACTION ENGINE
 * --------------------------------------------------------------------------
 * High-performance, 60fps kinetic motion engine integrating:
 * 1. Kinetic Character Pop Reveals (D:\SROLLING_ANIM8N\default\20-kinetic-character-reveal.html)
 * 2. Masked Line & Paragraph Reveals (D:\SROLLING_ANIM8N\default\24-line-mask-reveal.html)
 * 3. Staggered Cascade Arrivals (D:\SROLLING_ANIM8N\default\03-staggered-cascade-sequential.html)
 * 4. Milestone Rolling Number Counters (D:\SROLLING_ANIM8N\default\29-interactive-chart-draw.html)
 * 5. 3D Scroll-Driven Showreel Stacking Deck (Zero-lag sleeping RAF loop & GPU dimming)
 * 6. Scoped Custom Follower Cursor (Hardware-accelerated translate3d, sleeping RAF)
 * 7. Word-by-Word Scrubbed Text Highlighting (D:\SROLLING_ANIM8N\default\21-scrubbed-text-highlight.html)
 * 8. 35mm Celluloid Horizontal Filmstrip Gallery (D:\SROLLING_ANIM8N\default\15-horizontal-scroll-track.html)
 * 9. Live Nagpur IST Digital Clock & Top Scroll Progress Bar
 * 10. Mobile Navigation Drawer & 1-Click Clipboard Email Copy
 * 11. Interactive Studio FAQ Accordion & Smooth Back-to-Top
 * ==========================================================================
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. DOM Cache & Elements
     ========================================================================== */
  // Section containers
  const reelTrack = document.getElementById('showreelTrack');
  const reelCards = [...document.querySelectorAll('[data-reel-card]')];
  const reelTabBtns = [...document.querySelectorAll('.reel-tab-btn')];
  const soundToggle = document.getElementById('soundToggle');
  const soundText = document.getElementById('soundText');
  
  
  const deckPrevBtn = document.getElementById('deckPrevBtn');
  const deckNextBtn = document.getElementById('deckNextBtn');
  const deckCounter = document.getElementById('deckCounter');
  const deckProgressBar = document.getElementById('deckProgressBar');
  const reelStackContainer = document.getElementById('reelStackContainer');

  // Navigation & Badges
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const localTimeBadge = document.getElementById('localTimeBadge');
  const footerClock = document.getElementById('footerClock');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const emailCopyBtn = document.getElementById('emailCopyBtn');
  const copyToast = document.getElementById('copyToast');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // About Section elements
  const aboutStory = document.getElementById('aboutStory');
  const aboutCopyParas = [...document.querySelectorAll('[data-about-copy]')];
  const aboutImages = [...document.querySelectorAll('[data-about-image]')];
  const aboutCaption = document.getElementById('aboutImageCaption');
  const aboutCount = document.getElementById('aboutImageCount');

  // 35mm Filmstrip Gallery elements
  const workFilters = document.getElementById('workFilters');
  const filmstripViewport = document.getElementById('projectWindow');
  const filmstripTrack = document.getElementById('projectTrack');
  const projectCards = [...document.querySelectorAll('[data-project-card]')];
  const filmstripPrevBtn = document.getElementById('filmstripPrev');
  const filmstripNextBtn = document.getElementById('filmstripNext');
  const filmCurrentFrame = document.getElementById('filmCurrentFrame');
  const filmTotalFrames = document.getElementById('filmTotalFrames');
  const filmstripProgressThumb = document.getElementById('filmstripProgressThumb');

  // FAQ Items
  const faqItems = [...document.querySelectorAll('.faq-item')];

  // Runtime State
  let activeReelIndex = 0;
  let isAudioMuted = false;
  let targetReelProgress = 0;
  let currentReelProgress = 0;
  let isReelLoopRunning = false;
  let reelRafId = null;

  /* ==========================================================================
     2. Kinetic Character Pop Reveal Engine
     Inspired by D:\SROLLING_ANIM8N\default\20-kinetic-character-reveal.html
     Preserves line breaks, nested accents, and handles responsive layout
     ========================================================================== */
  const splitElementIntoCharacters = (element) => {
    // Process text nodes recursively without destroying inline HTML structure
    const fragment = document.createDocumentFragment();
    let charGlobalIndex = 0;

    const processNode = (node, targetContainer) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(/(\s+)/);

        words.forEach(word => {
          if (!word) return;
          if (/^\s+$/.test(word)) {
            targetContainer.appendChild(document.createTextNode(' '));
            return;
          }

          const wordSpan = document.createElement('span');
          wordSpan.className = 'pop-word';

          for (const char of word) {
            const charSpan = document.createElement('span');
            charSpan.className = 'pop-char';
            charSpan.textContent = char;
            charSpan.style.transitionDelay = `${charGlobalIndex * 0.016}s`;
            charGlobalIndex++;
            wordSpan.appendChild(charSpan);
          }

          targetContainer.appendChild(wordSpan);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          targetContainer.appendChild(document.createElement('br'));
        } else {
          const clone = node.cloneNode(false);
          node.childNodes.forEach(child => processNode(child, clone));
          targetContainer.appendChild(clone);
        }
      }
    };

    element.childNodes.forEach(child => processNode(child, fragment));
    element.innerHTML = '';
    element.appendChild(fragment);
  };

  const popHeadings = [...document.querySelectorAll('[data-pop-text]')];
  popHeadings.forEach(heading => {
    splitElementIntoCharacters(heading);
    heading.setAttribute('data-pop-ready', 'true');
  });

  const popObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-pop-visible');
        entry.target.removeAttribute('data-pop-ready');
        popObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '40px' });

  popHeadings.forEach(h => {
    if (h.closest('#hero')) {
      // Immediately activate hero kinetic typography without waiting for observer
      requestAnimationFrame(() => {
        h.classList.add('is-pop-visible');
        h.removeAttribute('data-pop-ready');
      });
    } else {
      popObserver.observe(h);
    }
  });

  /* ==========================================================================
     3. Line Mask & Staggered Reveal Engine
     Inspired by D:\SROLLING_ANIM8N\default\24-line-mask-reveal.html & 02/03
     ========================================================================== */
  const revealLineElements = [...document.querySelectorAll('[data-reveal-line]')];
  const revealFadeElements = [...document.querySelectorAll('[data-reveal-fade]')];
  const cascadeCardElements = [...document.querySelectorAll('[data-cascade-card]')];

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '50px' });

  revealLineElements.forEach(el => {
    if (el.closest('#hero')) {
      requestAnimationFrame(() => el.classList.add('is-revealed'));
    } else {
      revealObserver.observe(el);
    }
  });

  revealFadeElements.forEach(el => {
    if (el.closest('#hero')) {
      requestAnimationFrame(() => el.classList.add('is-revealed'));
    } else {
      revealObserver.observe(el);
    }
  });

  // Stagger cascade cards by parent sibling index
  const cascadeParents = new Set(cascadeCardElements.map(c => c.parentElement));
  cascadeParents.forEach(parent => {
    if (!parent) return;
    const cards = [...parent.querySelectorAll('[data-cascade-card]')];
    cards.forEach((card, idx) => {
      card.style.transitionDelay = `${idx * 0.08}s`;
    });
  });

  cascadeCardElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     4. Milestone Rolling Number Counters
     Inspired by D:\SROLLING_ANIM8N\default\29-interactive-chart-draw.html
     ========================================================================== */
  const countElements = [...document.querySelectorAll('[data-count-to]')];
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        countObserver.unobserve(el);
        const target = parseFloat(el.getAttribute('data-count-to')) || 0;
        const suffix = el.getAttribute('data-count-suffix') || '';
        const duration = 1400; // ms
        const startTime = performance.now();

        const updateCounter = now => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Cubic ease-out curve
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * ease);
          el.innerHTML = `${current}<span class="milestone-accent">${suffix}</span>`;
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.innerHTML = `${target}<span class="milestone-accent">${suffix}</span>`;
          }
        };
        requestAnimationFrame(updateCounter);
      }
    });
  }, { threshold: 0.25 });

  countElements.forEach(el => countObserver.observe(el));

  /* ==========================================================================
     5. Audio & Video Playback Helpers
     ========================================================================== */
  const updateSoundUI = () => {
    if (!soundToggle) return;
    if (isAudioMuted) {
      soundToggle.classList.add('is-muted');
      if (soundText) soundText.textContent = 'SOUND OFF';
    } else {
      soundToggle.classList.remove('is-muted');
      if (soundText) soundText.textContent = 'SOUND ON';
    }
  };

  const playVideoSafely = video => {
    if (!video) return;
    video.muted = isAudioMuted;
    const promise = video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Autoplay policy fallback: mute and play
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  };

  if (soundToggle) {
    soundToggle.addEventListener('click', e => {
      e.stopPropagation();
      isAudioMuted = !isAudioMuted;
      updateSoundUI();

      reelCards.forEach((card, idx) => {
        const video = card.querySelector('video');
        if (video) {
          video.muted = isAudioMuted;
          if (idx === activeReelIndex && !video.paused) {
            playVideoSafely(video);
          }
        }
      });
    });
  }

  /* ==========================================================================
     6. Showreel 3D Card Stack Engine (High-Performance GPU Pipeline)
     ========================================================================== */
  let cachedReelTop = 0;
  let cachedReelTravel = 1;
  let cachedAboutTop = 0;
  let cachedAboutHeight = 1;
  let cachedTotalHeight = 1;

  const measureLayout = () => {
    if (reelTrack) {
      const rect = reelTrack.getBoundingClientRect();
      cachedReelTop = window.scrollY + rect.top;
      cachedReelTravel = Math.max(1, reelTrack.offsetHeight - window.innerHeight);
    }
    if (aboutStory) {
      const rect = aboutStory.getBoundingClientRect();
      cachedAboutTop = window.scrollY + rect.top;
      cachedAboutHeight = Math.max(1, aboutStory.offsetHeight);
    }
    cachedTotalHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };

  const updateReelStack = progress => {
    if (!reelCards.length) return;

    const count = reelCards.length;
    const last = count - 1;
    const timeline = Math.max(0, Math.min(last, progress * last));
    const nextActive = Math.min(last, Math.max(0, Math.round(timeline)));

    reelCards.forEach((card, index) => {
      const diff = timeline - index;
      const dimmer = card.querySelector('.showreel-depth-dimmer');

      if (diff > 0.05) {
        // Card has been stacked behind in 3D deck depth
        const depth = Math.min(4, diff);
        const yOffset = -depth * 14;
        const scale = Math.max(0.84, 1 - depth * 0.045);
        const rot = (index % 2 === 0 ? 1.5 : -1.5) * Math.min(2.5, depth);
        const opacity = Math.max(0.2, 1 - depth * 0.22);

        card.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale}) rotate(${rot}deg)`;
        card.style.opacity = `${opacity}`;
        if (dimmer) {
          dimmer.style.opacity = `${Math.min(0.72, depth * 0.18)}`;
        }
        card.style.zIndex = index + 1;
        card.style.pointerEvents = 'none';
      } else if (diff >= -0.05 && diff <= 0.05) {
        // Active card in crisp focus
        card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        card.style.opacity = '1';
        if (dimmer) {
          dimmer.style.opacity = '0';
        }
        card.style.zIndex = count + 2;
        card.style.pointerEvents = 'auto';
      } else {
        // Card is ahead in the deck (sliding up smoothly from below)
        const incomingFrac = Math.max(0, Math.min(1, 1 + diff));
        const yPercent = (1 - incomingFrac) * 105;
        const scale = 0.96 + incomingFrac * 0.04;

        card.style.transform = `translate3d(0, ${yPercent}%, 0) scale(${scale}) rotate(0deg)`;
        card.style.opacity = incomingFrac > 0.02 ? '1' : '0';
        if (dimmer) {
          dimmer.style.opacity = '0';
        }
        card.style.zIndex = count + 5 + index;
        card.style.pointerEvents = incomingFrac > 0.8 ? 'auto' : 'none';
      }

      // Video playback: play only on the active card to preserve GPU decoders and clean audio
      const video = card.querySelector('video');
      if (video) {
        if (index === nextActive) {
          if (activeReelIndex !== nextActive || video.paused) {
            playVideoSafely(video);
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      }
    });

    activeReelIndex = nextActive;

    // Update Tab Navigation Pills
    reelTabBtns.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === activeReelIndex);
    });

    // Update Deck Counter & Progress Bar
    if (deckCounter) {
      deckCounter.textContent = `0${activeReelIndex + 1} / 0${count}`;
    }
    if (deckProgressBar) {
      deckProgressBar.style.width = `${((activeReelIndex + 1) / count) * 100}%`;
    }
  };

  const scrollToCardIndex = idx => {
    if (!reelTrack || !reelCards.length) return;
    const count = reelCards.length;
    const clamped = Math.max(0, Math.min(count - 1, idx));
    const fraction = clamped / Math.max(1, count - 1);
    const targetScroll = cachedReelTop + (fraction * cachedReelTravel);
    if (lenisInstance) {
      lenisInstance.scrollTo(targetScroll, { duration: 0.9 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  if (deckPrevBtn) {
    deckPrevBtn.addEventListener('click', e => {
      e.stopPropagation();
      scrollToCardIndex(activeReelIndex - 1);
    });
  }

  if (deckNextBtn) {
    deckNextBtn.addEventListener('click', e => {
      e.stopPropagation();
      scrollToCardIndex(activeReelIndex + 1);
    });
  }

  reelTabBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      scrollToCardIndex(idx);
    });
  });

  // Touch swipe support on deck
  if (reelStackContainer) {
    let touchStartX = 0;
    let touchStartY = 0;

    reelStackContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    reelStackContainer.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          scrollToCardIndex(activeReelIndex + 1);
        } else {
          scrollToCardIndex(activeReelIndex - 1);
        }
      }
    }, { passive: true });
  }

  /* ==========================================================================
     7. Word-by-Word Scrubbed Text Highlighting (About Section)
     Inspired by D:\SROLLING_ANIM8N\default\21-scrubbed-text-highlight.html
     ========================================================================== */
  const aboutCaptions = [
    'visual storytelling',
    'neural animation & 2d motion',
    'sound sync & 4k master finishing'
  ];

  aboutCopyParas.forEach(p => {
    const text = p.textContent.trim();
    p.innerHTML = '';
    text.split(/\s+/).forEach(word => {
      const span = document.createElement('span');
      span.className = 'about-word';
      span.textContent = word + ' ';
      p.appendChild(span);
    });
  });

  const allAboutWords = [...document.querySelectorAll('.about-word')];
  let lastLitIndex = -1;
  let lastAboutImgIdx = -1;

  const updateAboutSection = scrollY => {
    if (!aboutStory || !allAboutWords.length) return;
    const windowHeight = window.innerHeight;
    const relTop = cachedAboutTop - scrollY;

    if (relTop <= windowHeight && (relTop + cachedAboutHeight) >= 0) {
      const progress = Math.max(0, Math.min(1, (windowHeight - relTop) / (cachedAboutHeight + windowHeight * 0.3)));
      const totalWords = allAboutWords.length;
      const litIndex = Math.floor(progress * totalWords * 1.35);

      if (litIndex !== lastLitIndex) {
        lastLitIndex = litIndex;
        for (let idx = 0; idx < totalWords; idx++) {
          allAboutWords[idx].classList.toggle('is-lit', idx <= litIndex);
        }
      }

      const imgIdx = Math.min(2, Math.floor(progress * 3));
      if (imgIdx !== lastAboutImgIdx) {
        lastAboutImgIdx = imgIdx;
        aboutImages.forEach((img, i) => {
          img.style.opacity = i === imgIdx ? '1' : '0';
        });

        if (aboutCaption && aboutCaptions[imgIdx]) {
          aboutCaption.textContent = aboutCaptions[imgIdx];
        }
        if (aboutCount) {
          aboutCount.textContent = `0${imgIdx + 1} / 03`;
        }
      }
    }
  };

  /* ==========================================================================
     9. 35mm Celluloid Horizontal Filmstrip Gallery Controller
     Ultra-smooth physics, non-locking wheel glide, drag with inertia, & scrubber
     ========================================================================== */
  let updateFilmstripHUD = () => {};

  if (filmstripViewport && filmstripTrack) {
    let currentScroll = filmstripViewport.scrollLeft;
    let targetScroll = filmstripViewport.scrollLeft;
    let isDragging = false;
    let startPointerX = 0;
    let startScroll = 0;
    let dragDistance = 0;
    let velocity = 0;
    let lastPointerX = 0;
    let lastTime = performance.now();
    let isRafRunning = false;
    let rafId = null;

    const getMaxScroll = () => {
      return Math.max(0, filmstripViewport.scrollWidth - filmstripViewport.clientWidth);
    };

    const getCardStep = () => {
      const visible = projectCards.find(c => !c.classList.contains('is-hidden'));
      return visible ? visible.offsetWidth + 28 : 420;
    };

    updateFilmstripHUD = () => {
      const maxScroll = getMaxScroll();
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;

      if (filmstripProgressThumb) {
        const thumbWidthPercent = 0.22;
        const trackWidth = filmstripViewport.clientWidth;
        const travelRange = trackWidth * (1 - thumbWidthPercent);
        filmstripProgressThumb.style.width = `${thumbWidthPercent * 100}%`;
        filmstripProgressThumb.style.transform = `translateX(${progress * travelRange}px)`;
      }

      const visibleCards = projectCards.filter(c => !c.classList.contains('is-hidden'));
      if (filmTotalFrames) {
        filmTotalFrames.textContent = visibleCards.length < 10 ? `0${visibleCards.length}` : `${visibleCards.length}`;
      }

      const viewCenter = currentScroll + filmstripViewport.clientWidth / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      visibleCards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - viewCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = idx;
        }
      });

      if (filmCurrentFrame) {
        const frameNum = closestIndex + 1;
        filmCurrentFrame.textContent = frameNum < 10 ? `0${frameNum}` : `${frameNum}`;
      }

      if (filmstripPrevBtn) {
        filmstripPrevBtn.disabled = targetScroll <= 2;
      }
      if (filmstripNextBtn) {
        filmstripNextBtn.disabled = targetScroll >= maxScroll - 2;
      }
    };

    const startAnimationLoop = () => {
      if (isRafRunning) return;
      isRafRunning = true;
      lastTime = performance.now();

      const animate = () => {
        const maxScroll = getMaxScroll();

        if (!isDragging) {
          // Apply flick velocity with natural friction decay
          if (Math.abs(velocity) > 0.3) {
            targetScroll += velocity;
            velocity *= 0.92;
          } else {
            velocity = 0;
          }

          // Clamp target within bounds
          targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));

          // Buttery smooth lerp toward target
          const diff = targetScroll - currentScroll;
          if (Math.abs(diff) > 0.4) {
            currentScroll += diff * 0.14;
          } else {
            currentScroll = targetScroll;
          }
          filmstripViewport.scrollLeft = currentScroll;
        } else {
          currentScroll = filmstripViewport.scrollLeft;
        }

        updateFilmstripHUD();

        const isMoving = Math.abs(targetScroll - currentScroll) > 0.4 || Math.abs(velocity) > 0.3 || isDragging;
        if (isMoving) {
          rafId = requestAnimationFrame(animate);
        } else {
          isRafRunning = false;
          rafId = null;
        }
      };

      rafId = requestAnimationFrame(animate);
    };

    // Synchronize if native scroll fires
    filmstripViewport.addEventListener('scroll', () => {
      if (!isRafRunning && !isDragging) {
        currentScroll = filmstripViewport.scrollLeft;
        targetScroll = currentScroll;
        updateFilmstripHUD();
      }
    }, { passive: true });

    // Wheel Event Handler: Seamless non-blocking vertical scroll, smooth pan on shift-wheel or trackpad
    filmstripViewport.addEventListener('wheel', e => {
      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return;

      const isTrackpadHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

      if (isTrackpadHorizontal) {
        targetScroll += e.deltaX * 1.15;
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
        startAnimationLoop();
        return;
      }

      // If user holds Shift while wheeling, pan horizontal gallery
      if (e.shiftKey) {
        e.preventDefault();
        targetScroll += e.deltaY * 1.25;
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
        startAnimationLoop();
      }
      // Otherwise: let vertical wheel scroll freely down the page!
    }, { passive: false });

    // Pointer Drag Engine (Desktop Mouse + Touch + Stylus)
    filmstripViewport.addEventListener('pointerdown', e => {
      if (e.button && e.button !== 0) return;

      isDragging = true;
      startPointerX = e.clientX;
      lastPointerX = e.clientX;
      lastTime = performance.now();
      startScroll = filmstripViewport.scrollLeft;
      currentScroll = startScroll;
      targetScroll = startScroll;
      dragDistance = 0;
      velocity = 0;

      filmstripViewport.classList.add('is-dragging');
      startAnimationLoop();
    });

    window.addEventListener('pointermove', e => {
      if (!isDragging) return;

      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dx = e.clientX - lastPointerX;

      // Velocity estimation for inertia fling
      velocity = -dx * (16 / dt) * 1.1;

      lastPointerX = e.clientX;
      lastTime = now;

      const totalDelta = e.clientX - startPointerX;
      dragDistance = Math.abs(totalDelta);

      const maxScroll = getMaxScroll();
      targetScroll = Math.max(0, Math.min(maxScroll, startScroll - totalDelta));
      currentScroll = targetScroll;
      filmstripViewport.scrollLeft = currentScroll;
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      filmstripViewport.classList.remove('is-dragging');
      startAnimationLoop();
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Suppress accidental click when dragging
    filmstripViewport.addEventListener('click', e => {
      if (dragDistance > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Transport buttons with smooth stepping
    if (filmstripPrevBtn) {
      filmstripPrevBtn.addEventListener('click', () => {
        targetScroll = Math.max(0, targetScroll - getCardStep());
        startAnimationLoop();
      });
    }

    if (filmstripNextBtn) {
      filmstripNextBtn.addEventListener('click', () => {
        const maxScroll = getMaxScroll();
        targetScroll = Math.min(maxScroll, targetScroll + getCardStep());
        startAnimationLoop();
      });
    }

    // Interactive Scrubber Bar Click & Drag
    const progressBarWrap = document.querySelector('.filmstrip-progress-bar-wrap');
    if (progressBarWrap) {
      const scrubToPoint = (clientX) => {
        const rect = progressBarWrap.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        targetScroll = ratio * getMaxScroll();
        startAnimationLoop();
      };

      progressBarWrap.addEventListener('pointerdown', e => {
        scrubToPoint(e.clientX);
        const onScrubMove = moveEvent => {
          scrubToPoint(moveEvent.clientX);
        };
        const onScrubUp = () => {
          window.removeEventListener('pointermove', onScrubMove);
          window.removeEventListener('pointerup', onScrubUp);
        };
        window.addEventListener('pointermove', onScrubMove);
        window.addEventListener('pointerup', onScrubUp);
      });
    }

    // Keyboard Arrow navigation
    filmstripViewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetScroll = Math.min(getMaxScroll(), targetScroll + getCardStep());
        startAnimationLoop();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetScroll = Math.max(0, targetScroll - getCardStep());
        startAnimationLoop();
      }
    });

    updateFilmstripHUD();
  }

  // Category Filtering
  if (workFilters) {
    const filterButtons = workFilters.querySelectorAll('[data-filter]');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });

        // Reset scroll position smoothly
        if (filmstripViewport) {
          filmstripViewport.scrollTo({ left: 0, behavior: 'smooth' });
        }
        setTimeout(updateFilmstripHUD, 150);
      });
    });
  }

  // Project Video Playback Controls on Hover / Tap
  projectCards.forEach(card => {
    const video = card.querySelector('video');

    card.addEventListener('pointerenter', () => {
      card.classList.add('is-playing');
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-playing');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Click to toggle video playback
    card.addEventListener('click', () => {
      if (!video) return;
      if (video.paused) {
        video.muted = true;
        video.play().catch(() => {});
        card.classList.add('is-playing');
      } else {
        video.pause();
        card.classList.remove('is-playing');
      }
    });
  });

  /* ==========================================================================
     10. Top Scroll Progress Bar Calculator (GPU Transform scaleX)
     ========================================================================== */
  const updateScrollProgress = scrollY => {
    if (!scrollProgressBar) return;
    if (cachedTotalHeight <= 0) {
      scrollProgressBar.style.transform = 'scaleX(0)';
      return;
    }
    const ratio = Math.min(1, Math.max(0, scrollY / cachedTotalHeight));
    scrollProgressBar.style.transform = `scaleX(${ratio})`;
  };

  /* ==========================================================================
     11. Mobile Navigation Drawer Controller
     ========================================================================== */
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ==========================================================================
     12. One-Click Direct Email Copy with Toast Feedback
     ========================================================================== */
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener('click', () => {
      const email = emailCopyBtn.getAttribute('data-email') || 'vaibhavbadole21@gmail.com';

      const showFeedback = success => {
        if (!copyToast) return;
        copyToast.textContent = success ? '✓ Copied to clipboard!' : 'Press Ctrl+C to copy';
        copyToast.classList.add('is-active');
        setTimeout(() => copyToast.classList.remove('is-active'), 2500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => showFeedback(true)).catch(() => {
          fallbackCopyText(email, showFeedback);
        });
      } else {
        fallbackCopyText(email, showFeedback);
      }
    });
  }

  const fallbackCopyText = (text, callback) => {
    try {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(tempInput);
      callback(successful);
    } catch {
      callback(false);
    }
  };

  /* ==========================================================================
     13. Interactive FAQ Accordion
     ========================================================================== */
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      // Close all others for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        const otherQ = otherItem.querySelector('.faq-question');
        if (otherQ && otherQ !== question) {
          otherQ.setAttribute('aria-expanded', 'false');
          otherItem.classList.remove('is-open');
        }
      });

      question.setAttribute('aria-expanded', String(!isExpanded));
      item.classList.toggle('is-open', !isExpanded);
    });
  });

  /* ==========================================================================
     14. Premier Atelier Project Inquiry Form Controller
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formScopePills = document.querySelectorAll('.form-scope-btn');
  const formFeedback = document.getElementById('formFeedback');

  let selectedDiscipline = 'Motion Design';

  if (formScopePills.length) {
    formScopePills.forEach(btn => {
      btn.addEventListener('click', () => {
        formScopePills.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        selectedDiscipline = btn.getAttribute('data-scope') || 'Motion Design';
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const timelineSelect = document.getElementById('formTimeline');
      const budgetSelect = document.getElementById('formBudget');
      const messageInput = document.getElementById('formMessage');
      const submitBtn = document.getElementById('formSubmitBtn');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const timeline = timelineSelect ? timelineSelect.value : 'Flexible';
      const budget = budgetSelect ? budgetSelect.value : 'To Be Discussed';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback is-error';
          formFeedback.textContent = 'Please complete all required fields (*).';
        }
        return;
      }

      // Construct clean, formatted email payload
      const subject = `Project Inquiry: ${selectedDiscipline} — ${name}`;
      const body = `Hi Vaibhav,%0D%0A%0D%0AMy name is ${encodeURIComponent(name)} (${encodeURIComponent(email)}).%0D%0A%0D%0AProject Discipline: ${encodeURIComponent(selectedDiscipline)}%0D%0AEstimated Timeline: ${encodeURIComponent(timeline)}%0D%0AApproximate Budget: ${encodeURIComponent(budget)}%0D%0A%0D%0AProject Brief & Vision:%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0ALooking forward to discussing this!`;

      const mailtoUri = `mailto:vaibhavbadole21@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Launching Mail Draft &hellip;</span>';
      }

      if (formFeedback) {
        formFeedback.className = 'form-feedback is-success';
        formFeedback.textContent = '✓ Opening your mail client with your inquiry pre-filled...';
      }

      window.location.href = mailtoUri;

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Project Inquiry &rarr;</span>';
        }
      }, 2500);
    });
  }

  /* ==========================================================================
     15. Smooth Back-to-Top & Anchor Links Navigation
     ========================================================================== */
  let lenisInstance = null;

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', e => {
      e.preventDefault();
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const targetY = targetEl.getBoundingClientRect().top + window.scrollY - 70;
        if (lenisInstance) {
          lenisInstance.scrollTo(targetY, { duration: 1.1 });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     16. Lenis Smooth Scroll Engine & Global Scroll Coordinator
     ========================================================================== */
  const onScroll = scrollY => {
    if (reelTrack) {
      const scrolled = scrollY - cachedReelTop;
      const progress = Math.max(0, Math.min(1, scrolled / cachedReelTravel));
      updateReelStack(progress);
    }
    updateAboutSection(scrollY);
    updateScrollProgress(scrollY);
  };

  // Initialize Lenis Smooth Scrolling Engine
  if (typeof Lenis !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      lenisInstance = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
      });

      function lenisRaf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(lenisRaf);
      }
      requestAnimationFrame(lenisRaf);

      lenisInstance.on('scroll', e => {
        onScroll(e.scroll);
      });
    }
  }

  // Fallback for native scroll if Lenis is not active
  if (!lenisInstance) {
    let isScrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!isScrollTicking) {
        requestAnimationFrame(() => {
          onScroll(window.scrollY);
          isScrollTicking = false;
        });
        isScrollTicking = true;
      }
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    measureLayout();
    onScroll(window.scrollY);
    updateFilmstripHUD();
  });

  // Initial execution on boot
  measureLayout();
  onScroll(window.scrollY);
  updateFilmstripHUD();
  updateSoundUI();
})();
