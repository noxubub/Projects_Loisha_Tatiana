document.addEventListener('DOMContentLoaded', function () {

    /* ========================================== */
    /* 1. ЗАБАРОНА КАНТЭКСТНАГА МЕНЮ */
    /* ========================================== */
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });


    /* ========================================== */
    /* 2. КНОПКА "УВЕРХ" */
    /* ========================================== */
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* ========================================== */
    /* 3. ФІЛЬТРАЦЫЯ ТАЙМЛАЙНА ДАСЯГНЕННЯЎ */
    /* ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.vt-item');

    if (filterButtons.length > 0 && timelineItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                timelineItems.forEach(item => {
                    const itemType = item.getAttribute('data-type');

                    if (filterValue === 'all' || filterValue === itemType) {
                        item.style.display = 'flex';
                        setTimeout(() => { item.style.opacity = '1'; }, 10);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => { item.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }


    /* ========================================== */
    /* 4. РАСКРЫЦЦЁ КАРТАК ДАСЯГНЕННЯЎ (Акардэон) */
    /* ========================================== */
    const timelineCards = document.querySelectorAll('.vt-card');
    timelineCards.forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('expanded');
        });
    });


    /* ========================================== */
    /* 5. ФІЛЬТРАЦЫЯ КАРТАК ВЫПУСКНІКОЎ */
    /* ========================================== */
    const studentPageButtons = document.querySelectorAll('.students-main .filter-btn');
    const studentCards = document.querySelectorAll('.student-card-wrap');

    if (studentPageButtons.length > 0 && studentCards.length > 0) {
        studentPageButtons.forEach(button => {
            button.addEventListener('click', function () {
                studentPageButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                studentCards.forEach(card => {
                    const itemType = card.getAttribute('data-type');

                    if (card.hideTimeout) clearTimeout(card.hideTimeout);
                    if (card.showTimeout) clearTimeout(card.showTimeout);

                    if (filterValue === 'all' || filterValue === itemType) {
                        card.style.visibility = 'visible';
                        card.showTimeout = setTimeout(() => { card.style.opacity = '1'; }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.hideTimeout = setTimeout(() => { card.style.visibility = 'hidden'; }, 300);
                    }
                });
            });
        });
    }


    /* ========================================== */
    /* 6. АНІМАЦЫЯ "РТУТНАЙ" ЛІНІІ ПРЫ СКРОЛЕ */
    /* ========================================== */
    const lineActive = document.querySelector('.timeline-line-active');
    const rightColumn = document.querySelector('.achieve-right');

    if (lineActive && rightColumn) {
        function updateLine() {
            const rect = rightColumn.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            let scrollPercent = (windowHeight / 2 - rect.top) / rect.height;
            if (scrollPercent < 0) scrollPercent = 0;
            if (scrollPercent > 1) scrollPercent = 1;
            lineActive.style.height = (scrollPercent * 100) + '%';
        }
        window.addEventListener('scroll', updateLine);
        window.addEventListener('resize', updateLine);
        updateLine();
    }


    /* ========================================== */
    /* 7. АКАРДЭОН "ЗАПІСКІ ШЭФА" */
    /* ========================================== */
    const quoteToggles = document.querySelectorAll('.quote-toggle');

    quoteToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const item = this.closest('.quote-item');
            if (!item) return;

            const allItems = document.querySelectorAll('.quote-item');
            allItems.forEach(other => {
                if (other !== item) other.classList.remove('open');
            });

            item.classList.toggle('open');
        });
    });


    /* ========================================== */
    /* 8. ГАЛЕРЭЯ ЎЗНАГАРОД (мадальнае акно) */
    /* ========================================== */
    const openGalleryBtn = document.getElementById('openAchieveGallery');
    const closeGalleryBtn = document.getElementById('closeAchieveGallery');
    const achieveModal = document.getElementById('achieveModal');
    const slider = document.getElementById('achieveSlider');
    const track = document.getElementById('achieveSliderTrack');
    const prevBtn = document.getElementById('achievePrev');
    const nextBtn = document.getElementById('achieveNext');
    const dotsWrap = document.getElementById('achieveDots');

    if (openGalleryBtn && achieveModal && track && prevBtn && nextBtn && dotsWrap) {
        const slides = track.querySelectorAll('.achieve-slide');
        const total = slides.length;
        let current = 0;

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'achieve-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Фота ' + (i + 1));
            dot.addEventListener('click', function () {
                current = i;
                updateSlider();
            });
            dotsWrap.appendChild(dot);
        }

        const dots = dotsWrap.querySelectorAll('.achieve-dot');

        function updateSlider() {
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
        }

        openGalleryBtn.addEventListener('click', function () {
            achieveModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        function closeGallery() {
            achieveModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closeGallery);

        achieveModal.addEventListener('click', function (e) {
            if (e.target === achieveModal) closeGallery();
        });

        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            current = (current - 1 + total) % total;
            updateSlider();
        });

        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            current = (current + 1) % total;
            updateSlider();
        });

        let startX = 0;
        let isDragging = false;

        slider.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        slider.addEventListener('touchend', function (e) {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) current = (current + 1) % total;
                else current = (current - 1 + total) % total;
                updateSlider();
            }
            isDragging = false;
        });
    }


    /* ========================================== */
    /* 9. ПАДСВЕТКА І ПАВЕЛІЧЭННЕ Ў "ІДЭАЛ" */
    /* ========================================== */
    const idealCards = document.querySelectorAll('.ideal-card');
    const stamps = document.querySelectorAll('.stamp');

    if (idealCards.length > 0 && stamps.length > 0) {

        function linkStampToCard(stamp) {
            const letter = stamp.getAttribute('data-stamp');
            stamps.forEach(s => s.classList.remove('active-stamp'));
            stamp.classList.add('active-stamp');
            idealCards.forEach(card => {
                card.classList.remove('card-hovered');
                if (card.getAttribute('data-letter') === letter) card.classList.add('card-hovered');
            });
        }

        function linkCardToStamp(card) {
            const letter = card.getAttribute('data-letter');
            stamps.forEach(stamp => {
                stamp.classList.remove('active-stamp');
                if (stamp.getAttribute('data-stamp') === letter) stamp.classList.add('active-stamp');
            });
            idealCards.forEach(c => c.classList.remove('card-hovered'));
            card.classList.add('card-hovered');
        }

        function resetAll() {
            stamps.forEach(stamp => stamp.classList.remove('active-stamp'));
            idealCards.forEach(card => card.classList.remove('card-hovered'));
        }

        idealCards.forEach(card => {
            card.addEventListener('mouseenter', () => linkCardToStamp(card));
            card.addEventListener('mouseleave', resetAll);
        });

        stamps.forEach(stamp => {
            stamp.addEventListener('mouseenter', () => linkStampToCard(stamp));
            stamp.addEventListener('mouseleave', resetAll);
        });
    }


    /* ========================================== */
    /* 10. БІБЛІЯТЭКА: ФІЛЬТРЫ І ПОШУК */
    /* ========================================== */
    var libFilterButtons = document.querySelectorAll('.library-filters .filter-btn');
    var libCards = document.querySelectorAll('.library-card');
    var searchInput = document.getElementById('searchInput');

    if (libFilterButtons.length > 0) {
        libFilterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                libFilterButtons.forEach(function (btn) { btn.classList.remove('active'); });
                this.classList.add('active');

                var filterValue = this.getAttribute('data-filter');

                libCards.forEach(function (card) {
                    if (filterValue === 'all' || card.getAttribute('data-type') === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(function () { card.style.opacity = '1'; }, 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(function () { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            var query = this.value.toLowerCase().trim();
            libCards.forEach(function (card) {
                var title = card.querySelector('.card-title').textContent.toLowerCase();
                var desc = card.querySelector('.card-desc').textContent.toLowerCase();
                if (title.indexOf(query) !== -1 || desc.indexOf(query) !== -1) {
                    card.style.display = 'flex';
                    setTimeout(function () { card.style.opacity = '1'; }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(function () { card.style.display = 'none'; }, 300);
                }
            });
        });
    }


    /* ========================================== */
    /* 11. ГАЛЕРЭЯ 100 ВІДЭА */
    /* ========================================== */
    var galleryModal = document.getElementById('galleryModal');
    var open100VideosBtn = document.getElementById('open100Videos');
    var closeGalleryBtn2 = document.getElementById('closeGalleryBtn');
    var galleryGrid = document.getElementById('galleryGrid');

    var videoPlayerModal = document.getElementById('videoPlayerModal');
    var closeVideoPlayerBtn = document.getElementById('closeVideoPlayerBtn');
    var videoContainer = document.getElementById('videoContainer');
    var videoPlayerTitle = document.getElementById('videoPlayerTitle');


    /* ========================================== */
    /* 12. МАДАЛЬНАЕ АКНО З АРТЫКУЛАМІ */
    /* ========================================== */
    var articlesModal = document.getElementById('articlesModal');
    var openArticlesBtn = document.getElementById('openArticles');
    var closeArticlesBtn = document.getElementById('closeArticlesBtn');

    if (openArticlesBtn && articlesModal && closeArticlesBtn) {
        openArticlesBtn.addEventListener('click', function () {
            articlesModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        closeArticlesBtn.addEventListener('click', function () {
            articlesModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        articlesModal.addEventListener('click', function (e) {
            if (e.target === articlesModal) {
                articlesModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    /* ========================================== */
    /* 13. МАДАЛЬНАЕ АКНО: "РЫХТУЕМСЯ ДА АЛІМПІЯДЫ" */
    /* ========================================== */
    var olympiadModal = document.getElementById('olympiadModal');
    var openOlympiadBtn = document.getElementById('openOlympiad');
    var closeOlympiadBtn = document.getElementById('closeOlympiadBtn');
    var olympiadSlider = document.getElementById('olympiadSlider');
    var olympiadTrack = document.getElementById('olympiadSliderTrack');
    var olympiadPrev = document.getElementById('olympiadPrev');
    var olympiadNext = document.getElementById('olympiadNext');
    var olympiadDots = document.getElementById('olympiadDots');

    if (openOlympiadBtn && olympiadModal && olympiadTrack && olympiadPrev && olympiadNext && olympiadDots) {
        var olySlides = olympiadTrack.querySelectorAll('.achieve-slide');
        var olyTotal = olySlides.length;
        var olyCurrent = 0;

        for (var oi = 0; oi < olyTotal; oi++) {
            (function (idx) {
                var odot = document.createElement('button');
                odot.className = 'achieve-dot' + (idx === 0 ? ' active' : '');
                odot.setAttribute('aria-label', 'Фота ' + (idx + 1));
                odot.addEventListener('click', function () {
                    olyCurrent = idx;
                    olyUpdate();
                });
                olympiadDots.appendChild(odot);
            })(oi);
        }

        var olyDots = olympiadDots.querySelectorAll('.achieve-dot');

        function olyUpdate() {
            olympiadTrack.style.transform = 'translateX(-' + (olyCurrent * 100) + '%)';
            olyDots.forEach(function (d, i) { d.classList.toggle('active', i === olyCurrent); });
        }

        openOlympiadBtn.addEventListener('click', function () {
            olympiadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        function closeOlympiad() {
            olympiadModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeOlympiadBtn.addEventListener('click', closeOlympiad);

        olympiadModal.addEventListener('click', function (e) {
            if (e.target === olympiadModal) closeOlympiad();
        });

        olympiadPrev.addEventListener('click', function (e) {
            e.stopPropagation();
            olyCurrent = (olyCurrent - 1 + olyTotal) % olyTotal;
            olyUpdate();
        });

        olympiadNext.addEventListener('click', function (e) {
            e.stopPropagation();
            olyCurrent = (olyCurrent + 1) % olyTotal;
            olyUpdate();
        });

        var olyStartX = 0;
        var olyDragging = false;

        olympiadSlider.addEventListener('touchstart', function (e) {
            olyStartX = e.touches[0].clientX;
            olyDragging = true;
        }, { passive: true });

        olympiadSlider.addEventListener('touchend', function (e) {
            if (!olyDragging) return;
            var endX = e.changedTouches[0].clientX;
            var diff = olyStartX - endX;
            if (Math.abs(diff) > 40) {
                olyCurrent = diff > 0
                    ? (olyCurrent + 1) % olyTotal
                    : (olyCurrent - 1 + olyTotal) % olyTotal;
                olyUpdate();
            }
            olyDragging = false;
        });
    }


    /* ========================================== */
    /* 14. МАСІЎ ВІДЭА + ГЕНЕРАЦЫЯ ГАЛЕРЭІ 100 */
    /* ========================================== */
    var videoLinks = [
        "https://www.instagram.com/reel/DRcgF52jV8u/embed/",
        "https://www.instagram.com/reel/DRhhc5MDZ0a/embed/",
        "https://www.instagram.com/reel/DRmahMCjbh0/embed/",
        "https://www.instagram.com/reel/DRo81-3DY-B/embed/",
        "https://www.instagram.com/reel/DRuDZ7zDWN9/embed/",
        "https://www.instagram.com/reel/DRzWHWRjY8D/embed/",
        "https://www.instagram.com/reel/DR4haQtjbUV/embed/",
        "https://www.instagram.com/reel/DR6_qY2DScA/embed/",
        "https://www.instagram.com/reel/DSAHi3MDU_R/embed/",
        "https://www.instagram.com/reel/DSFbvCeDdby/embed/",
        "https://www.instagram.com/reel/DSKr_eMDWM0/embed/",
        "https://www.instagram.com/reel/DSNI_yeDQzg/embed/",
        "https://www.instagram.com/reel/DSShCtpDb8K/embed/",
        "https://www.instagram.com/reel/DSXVz1lDRyb/embed/",
        "https://www.instagram.com/reel/DScxqlhjeOs/embed/",
        "https://www.instagram.com/reel/DSfdGgejUE8/embed/",
        "https://www.instagram.com/reel/DSkL_ivjfEF/embed/",
        "https://www.instagram.com/reel/DSpQRXVDVnV/embed/",
        "https://www.instagram.com/reel/DSucrbojdRh/embed/",
        "https://www.instagram.com/reel/DS2OKztjb_r/embed/",
        "https://www.instagram.com/reel/DS7VJEqDRyO/embed/",
        "https://www.instagram.com/reel/DTAdcdlDSTG/embed/",
        "https://www.instagram.com/reel/DTDDBH5DRji/embed/",
        "https://www.instagram.com/reel/DTIliJjDWwF/embed/",
        "https://www.instagram.com/reel/DTNZz1DjWDR/embed/",
        "https://www.instagram.com/reel/DTSfiURDXM5/embed/",
        "https://www.instagram.com/reel/DTVHwOzDbVz/embed/",
        "https://www.instagram.com/reel/DTadcrojc86/embed/",
        "https://www.instagram.com/reel/DTfay0FjZLC/embed/",
        "https://www.instagram.com/reel/DTlMBKVjSsc/embed/",
        "https://www.instagram.com/reel/DTncEK5Da72/embed/",
        "https://www.instagram.com/reel/DTsdcuZjSpx/embed/",
        "https://www.instagram.com/reel/DTxhbIcDXsR/embed/",
        "https://www.instagram.com/reel/DT2xoGQjUYm/embed/",
        "https://www.instagram.com/reel/DT5XLvojT6X/embed/",
        "https://www.instagram.com/reel/DT-i5vNDWoJ/embed/",
        "https://www.instagram.com/reel/DUDjq0CjQgd/embed/",
        "https://www.instagram.com/reel/DUI03TfjdGZ/embed/",
        "https://www.instagram.com/reel/DUQmZJUDWN5/embed/",
        "https://www.instagram.com/reel/DUVe38kDZM2/embed/",
        "https://www.instagram.com/reel/DUa2MTwDZ0E/embed/",
        "https://www.instagram.com/reel/DUdixIuDWMj/embed/",
        "https://www.instagram.com/reel/DUian3qjfsd/embed/",
        "https://www.instagram.com/reel/DUnwQGzDeyG/embed/",
        "https://www.instagram.com/reel/DUtFffwDWY4/embed/",
        "https://www.instagram.com/reel/DUvmZ7lDabO/embed/",
        "https://www.instagram.com/reel/DU0uHAKDeHy/embed/",
        "https://www.instagram.com/reel/DU6HBmOjU47/embed/",
        "https://www.instagram.com/reel/DU-y79VDYmv/embed/",
        "https://www.instagram.com/reel/DVBl9E9jaUZ/embed/",
        "https://www.instagram.com/reel/DVGv8VfjUV2/embed/",
        "https://www.instagram.com/reel/DVL-uj9jd68/embed/",
        "https://www.instagram.com/reel/DVROgqBjQ_h/embed/",
        "https://www.instagram.com/reel/DVTx_lyDfx1/embed/",
        "https://www.instagram.com/reel/DVYZOsmDU0D/embed/",
        "https://www.instagram.com/reel/DVd7DWMCj8x/embed/",
        "https://www.instagram.com/reel/DVjdF0cDY_2/embed/",
        "https://www.instagram.com/reel/DVlGje9DSCe/embed/",
        "https://www.instagram.com/reel/DVq9s05jW44/embed/",
        "https://www.instagram.com/reel/DVv8xMkCgU8/embed/",
        "https://www.instagram.com/reel/DV1Xymqjbpq/embed/",
        "https://www.instagram.com/reel/DV33kxNjScn/embed/",
        "https://www.instagram.com/reel/DV9BTAvjdww/embed/",
        "https://www.instagram.com/reel/DWCCksdDeJf/embed/",
        "https://www.instagram.com/reel/DWHDTcZDf77/embed/",
        "https://www.instagram.com/reel/DWJ3McGjY0j/embed/",
        "https://www.instagram.com/reel/DWOugJdjW92/embed/",
        "https://www.instagram.com/reel/DWTbpeODWr5/embed/",
        "https://www.instagram.com/reel/DWZUyO3jQ92/embed/",
        "https://www.instagram.com/reel/DWbfTuCDYeR/embed/",
        "https://www.instagram.com/reel/DWg3_aHDYJq/embed/",
        "https://www.instagram.com/reel/DWl_xfhDV4S/embed/",
        "https://www.instagram.com/reel/DWttKhoDZ4L/embed/",
        "https://www.instagram.com/reel/DWyvDpHDR3T/embed/",
        "https://www.instagram.com/reel/DW4FCgXDX5M/embed/",
        "https://www.instagram.com/reel/DW9PT_IDZuj/embed/",
        "https://www.instagram.com/reel/DW_fooDDY3Y/embed/",
        "https://www.instagram.com/reel/DXE7vC7jTwe/embed/",
        "https://www.instagram.com/reel/DXKSgtoDQFX/embed/",
        "https://www.instagram.com/reel/DXO_vOwDfd8/embed/",
        "https://www.instagram.com/reel/DXRpZVFDb0I/embed/",
        "https://www.instagram.com/reel/DXW-aoXDe4g/embed/",
        "https://www.instagram.com/reel/DXcHVJ-iDX-/embed/",
        "https://www.instagram.com/reel/DXhfQSijcio/embed/",
        "https://www.instagram.com/reel/DXj7N8rjazI/embed/",
        "https://www.instagram.com/reel/DXpGKRmjZDN/embed/",
        "https://www.instagram.com/reel/DXuHoa7jSeS/embed/",
        "https://www.instagram.com/reel/DXzfaRYNlnw/embed/",
        "https://www.instagram.com/reel/DX1aER1tpQA/embed/",
        "https://www.instagram.com/reel/DX7DLqctvE3/embed/",
        "https://www.instagram.com/reel/DYAM1zyN8Y4/embed/",
        "https://www.instagram.com/reel/DYFit5et1hL/embed/",
        "https://www.instagram.com/reel/DYH4KliN_Lr/embed/",
        "https://www.instagram.com/reel/DYNIZK2tmmp/embed/",
        "https://www.instagram.com/reel/DYSEAPVtS9b/embed/",
        "https://www.instagram.com/reel/DYXSaTGtZAO/embed/",
        "https://www.instagram.com/reel/DYZ7lRMNBmv/embed/",
        "https://www.instagram.com/reel/DYe9Zivtyf7/embed/",
        "https://www.instagram.com/reel/DYkE6nrtpbY/embed/",
        "https://www.instagram.com/reel/DYpZiMUNiSQ/embed/"
    ];

    if (galleryGrid) {
        var html = '';
        for (var i = 1; i <= 100; i++) {
            html += '<div class="gallery-item" data-index="' + i + '">';
            html += '  <div class="gallery-item-play">';
            html += '    <svg width="20" height="20" viewBox="0 0 24 24" fill="#c56a4b"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
            html += '  </div>';
            html += '  <span class="gallery-item-num">' + i + '</span>';
            html += '  <p class="gallery-item-title">Пытанне №' + i + '</p>';
            html += '</div>';
        }
        galleryGrid.innerHTML = html;
    }

    if (open100VideosBtn && galleryModal) {
        open100VideosBtn.addEventListener('click', function () {
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeGalleryBtn2 && galleryModal) {
        closeGalleryBtn2.addEventListener('click', function () {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    function openVideo(src, title) {
        if (!videoContainer || !videoPlayerModal || !videoPlayerTitle) return;
        videoContainer.innerHTML = '<iframe src="' + src + '" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true"></iframe>';
        videoPlayerTitle.textContent = title;
        videoPlayerModal.classList.add('active');
    }

    if (galleryGrid) {
        galleryGrid.addEventListener('click', function (e) {
            var item = e.target.closest('.gallery-item');
            if (item) {
                var index = parseInt(item.getAttribute('data-index')) - 1;
                var src = videoLinks[index] || videoLinks[0];
                openVideo(src, 'Пытанне №' + (index + 1));
            }
        });
    }

    var videoCard = document.querySelector('.library-card.video-card');
    if (videoCard) {
        videoCard.addEventListener('click', function () {
            var src = this.getAttribute('data-video');
            var title = this.getAttribute('data-title') || 'Відэаўрок';
            openVideo(src, title);
        });
    }

    if (closeVideoPlayerBtn && videoContainer && videoPlayerModal) {
        closeVideoPlayerBtn.addEventListener('click', function () {
            videoContainer.innerHTML = '';
            videoPlayerModal.classList.remove('active');
        });
    }

    if (videoPlayerModal && videoContainer) {
        videoPlayerModal.addEventListener('click', function (e) {
            if (e.target === videoPlayerModal) {
                videoContainer.innerHTML = '';
                videoPlayerModal.classList.remove('active');
            }
        });
    }


    /* ========================================== */
    /* 15. МОДАЛЬНОЕ ОКНО: КЛАСНАЕ КІРАЎНІЦТВА + СЛАЙДЕР */
    /* ========================================== */
    var newModal = document.getElementById('newModal');
    var openNewBanner = document.getElementById('openNewBanner');
    var closeNewModalBtn = document.getElementById('closeNewModalBtn');

    var classSliderTrack = document.getElementById('classSliderTrack');
    var classPrev = document.getElementById('classPrev');
    var classNext = document.getElementById('classNext');
    var classDots = document.getElementById('classDots');

    if (openNewBanner && newModal && closeNewModalBtn) {
        openNewBanner.addEventListener('click', function () {
            newModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeNewModalBtn.addEventListener('click', function () {
            newModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        newModal.addEventListener('click', function (e) {
            if (e.target === newModal) {
                newModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        if (classSliderTrack && classPrev && classNext && classDots) {
            var classSlides = classSliderTrack.querySelectorAll('.achieve-slide');
            var classTotal = classSlides.length;
            var classCurrent = 0;

            for (var j = 0; j < classTotal; j++) {
                (function (idx) {
                    var dot = document.createElement('button');
                    dot.className = 'achieve-dot' + (idx === 0 ? ' active' : '');
                    dot.setAttribute('aria-label', 'Фота ' + (idx + 1));
                    dot.addEventListener('click', function () {
                        classCurrent = idx;
                        updateClassSlider();
                    });
                    classDots.appendChild(dot);
                })(j);
            }

            var classDotsList = classDots.querySelectorAll('.achieve-dot');

            function updateClassSlider() {
                classSliderTrack.style.transform = 'translateX(-' + (classCurrent * 100) + '%)';
                classDotsList.forEach(function (d, i) { d.classList.toggle('active', i === classCurrent); });
            }

            classPrev.addEventListener('click', function (e) {
                e.stopPropagation();
                classCurrent = (classCurrent - 1 + classTotal) % classTotal;
                updateClassSlider();
            });

            classNext.addEventListener('click', function (e) {
                e.stopPropagation();
                classCurrent = (classCurrent + 1) % classTotal;
                updateClassSlider();
            });
        }
    }


    /* ========================================== */
    /* 16. МОДАЛЬНОЕ ОКНО: МЕТАДЫЧНЫЯ РАСПРАЦОЎКІ */
    /* ========================================== */
    var methodicsModal = document.getElementById('methodicsModal');
    var openMethodicsBtn = document.getElementById('openMethodics');
    var closeMethodicsBtn = document.getElementById('closeMethodicsBtn');

    if (openMethodicsBtn && methodicsModal && closeMethodicsBtn) {
        openMethodicsBtn.addEventListener('click', function () {
            methodicsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMethodicsBtn.addEventListener('click', function () {
            methodicsModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        methodicsModal.addEventListener('click', function (e) {
            if (e.target === methodicsModal) {
                methodicsModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    /* ========================================== */
    /* 17. МОДАЛЬНОЕ ОКНО: ПЛАНЫ-КАНСПЕКТЫ ЎРОКАЎ */
    /* ========================================== */
    var lessonPlansModal = document.getElementById('lessonPlansModal');
    var openLessonPlansBtn = document.getElementById('openLessonPlans');
    var closeLessonPlansBtn = document.getElementById('closeLessonPlansBtn');

    if (openLessonPlansBtn && lessonPlansModal && closeLessonPlansBtn) {
        openLessonPlansBtn.addEventListener('click', function () {
            lessonPlansModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeLessonPlansBtn.addEventListener('click', function () {
            lessonPlansModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        lessonPlansModal.addEventListener('click', function (e) {
            if (e.target === lessonPlansModal) {
                lessonPlansModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    /* ========================================== */
    /* 18. ЗАКРЫЦЦЁ ЎСЯГО ПА ESC */
    /* ========================================== */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (videoPlayerModal && videoPlayerModal.classList.contains('active')) {
                videoContainer.innerHTML = '';
                videoPlayerModal.classList.remove('active');
            } else if (galleryModal && galleryModal.classList.contains('active')) {
                galleryModal.classList.remove('active');
                document.body.style.overflow = '';
            } else if (articlesModal && articlesModal.classList.contains('active')) {
                articlesModal.classList.remove('active');
                document.body.style.overflow = '';
            } else if (olympiadModal && olympiadModal.classList.contains('active')) {
                olympiadModal.classList.remove('active');
                document.body.style.overflow = '';
            } else if (newModal && newModal.classList.contains('active')) {
                newModal.classList.remove('active');
                document.body.style.overflow = '';
            } else if (methodicsModal && methodicsModal.classList.contains('active')) {
                methodicsModal.classList.remove('active');
                document.body.style.overflow = '';
            } else if (lessonPlansModal && lessonPlansModal.classList.contains('active')) {
                lessonPlansModal.classList.remove('active');
                document.body.style.overflow = '';
            } else if (lightbox && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });


    /* ========================================== */
    /* 19. НАКІРУНКІ: АКАРДЭОН (НОВЫ КОД) */
    /* ========================================== */
    var accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(function (item) {
        var header = item.querySelector('.accordion-header');
        var content = item.querySelector('.accordion-content');

        if (!header || !content) return;

        header.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

            accordionItems.forEach(function (otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    var otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) otherContent.style.maxHeight = null;
                }
            });

            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });


    /* ========================================== */
    /* 20. ЛАЙТБОКС З ПЕРАКЛЮЧЭННЕМ ФОТА Ў КАТЭГОРЫІ */
    /* ========================================== */
    var lightbox = document.getElementById('imageLightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.querySelector('.lightbox-close');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');

    if (lightbox && lightboxImg && lightboxClose) {
        
        var currentGroupImages = []; 
        var currentIndex = 0;        

        function updateLightboxImage() {
            if (currentGroupImages.length === 0) return;
            lightboxImg.src = currentGroupImages[currentIndex].src;
        }

        var galleryImages = document.querySelectorAll('.photo-grid img');

        galleryImages.forEach(function (img) {
            img.addEventListener('click', function (e) {
                e.stopPropagation(); 
                
                var parentGrid = this.closest('.photo-grid');
                currentGroupImages = Array.from(parentGrid.querySelectorAll('img'));
                currentIndex = currentGroupImages.indexOf(this);

                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';

                if (currentGroupImages.length <= 1) {
                    lightbox.classList.add('single-image');
                } else {
                    lightbox.classList.remove('single-image');
                }
            });
        });

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function (e) {
                e.stopPropagation();
                if (currentGroupImages.length > 1) {
                    currentIndex = (currentIndex + 1) % currentGroupImages.length;
                    updateLightboxImage();
                }
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function (e) {
                e.stopPropagation();
                if (currentGroupImages.length > 1) {
                    currentIndex = (currentIndex - 1 + currentGroupImages.length) % currentGroupImages.length;
                    updateLightboxImage();
                }
            });
        }

        lightboxClose.addEventListener('click', function () {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Кіраванне з клавіятуры (стрэлкі)
        document.addEventListener('keydown', function (e) {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight' && lightboxNext) {
                    lightboxNext.click();
                } else if (e.key === 'ArrowLeft' && lightboxPrev) {
                    lightboxPrev.click();
                }
            }
        });
    }

});