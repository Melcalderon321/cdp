/**
 * CLÍNICA DEL PILAR - Interactive Logic Engine
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Dynamic Sede coordinates and data mapping
    const sedesData = {
        dalvian: {
            title: "Sede Dalvian (Sede Principal)",
            address: "Av. 7 Colores 2015, Local 42, Dalvian · Mendoza",
            hours: "Lun a Vie · 08:00 – 20:00",
            coords: "32° 52' S · 68° 51' W",
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000",
            mapLink: "https://maps.google.com/?q=Av.+7+Colores+2015+Dalvian+Mendoza"
        },
        peru: {
            title: "Sede Perú (Consultorios externos)",
            address: "Av. Perú 1140, Ciudad · Mendoza",
            hours: "Lun a Vie · 08:00 – 21:00",
            coords: "32° 53' S · 68° 50' W",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
            mapLink: "https://maps.google.com/?q=Av.+Peru+1140+Mendoza"
        },
        godoycruz: {
            title: "Sede Godoy Cruz (Imágenes médicas)",
            address: "San Martín 521, Godoy Cruz · Mendoza",
            hours: "Lun a Sáb · 07:30 – 20:00",
            coords: "32° 55' S · 68° 50' W",
            image: "assets/clinicadelpilar_webgc.png",
            mapLink: "https://maps.google.com/?q=San+Martin+521+Godoy+Cruz+Mendoza"
        },
        laboratorio: {
            title: "Polidiagnóstico (Laboratorio)",
            address: "9 de Julio 1247, Ciudad · Mendoza",
            hours: "Lun a Vie · 07:00 – 19:00",
            coords: "32° 53' S · 68° 51' W",
            image: "https://images.unsplash.com/photo-1579154204601-01588f35116f?q=80&w=1000",
            mapLink: "https://maps.google.com/?q=9+de+Julio+1247+Mendoza"
        }
    };

    // Doctor mapping data to prefill the appointment selectors dynamically
    const doctorsData = [
        { id: "sianni", name: "Dr. Orlando Sianni", specialty: "Cardiología" },
        { id: "pereyra", name: "Dra. Ana Pereyra", specialty: "Traumatología" },
        { id: "caballero", name: "Dr. Federico Caballero", specialty: "Cirugía General" },
        { id: "acosta", name: "Dra. Mariana Acosta", specialty: "Oftalmología" }
    ];

    /* ==========================================================================
       1. STICKY HEADER & SCROLL SPY
       ========================================================================== */
    const header = document.querySelector(".header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        // Sticky Header toggling
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Active Link Highlighting (Scroll Spy)
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    /* ==========================================================================
       2. HIGH-END HERO CAROUSEL
       ========================================================================== */
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    const prevBtn = document.querySelector(".hero-btn.prev");
    const nextBtn = document.querySelector(".hero-btn.next");
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides && slides.length > 0) {
            slides.forEach(slide => slide.classList.remove("active"));
        }
        if (dots && dots.length > 0) {
            dots.forEach(dot => dot.classList.remove("active"));
        }
        
        if (slides && slides.length > 0) {
            currentSlide = (index + slides.length) % slides.length;
            
            if (slides[currentSlide]) {
                slides[currentSlide].classList.add("active");
            }
            if (dots && dots[currentSlide]) {
                dots[currentSlide].classList.add("active");
            }

            // Update URL to match current slide without jumping or reloading
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, null, "#slide-" + (currentSlide + 1));
            }
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideShow() {
        stopSlideShow();
        slideInterval = setInterval(nextSlide, 6500);
    }

    function stopSlideShow() {
        if (slideInterval) clearInterval(slideInterval);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            startSlideShow();
        });
        prevBtn.addEventListener("click", () => {
            prevSlide();
            startSlideShow();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startSlideShow();
        });
    });

    // Start carousel
    if (slides.length > 0) {
        // Check if there is a hash in the URL to start at a specific slide
        const hash = window.location.hash;
        if (hash && hash.startsWith("#slide-")) {
            const requestedSlide = parseInt(hash.replace("#slide-", "")) - 1;
            if (!isNaN(requestedSlide) && requestedSlide >= 0 && requestedSlide < slides.length) {
                currentSlide = requestedSlide;
            }
        }
        showSlide(currentSlide);
        startSlideShow();
    }

    /* ==========================================================================
       3. INTERACTIVE SEDES SWITCHER
       ========================================================================== */
    const sedeTabs = document.querySelectorAll(".sede-tab");
    const sedeImage = document.getElementById("sede-active-image");
    const sedeTitle = document.getElementById("sede-active-title");
    const sedeAddress = document.getElementById("sede-active-address");
    const sedeHours = document.getElementById("sede-active-hours");
    const sedeCoords = document.getElementById("sede-active-coords");
    const sedeMapBtn = document.getElementById("sede-active-map");

    sedeTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetSede = tab.dataset.sede;
            if (!sedesData[targetSede]) return;

            // Remove active states
            sedeTabs.forEach(t => t.classList.remove("active"));
            
            // Add active state to clicked
            tab.classList.add("active");

            // Fetch info
            const data = sedesData[targetSede];

            // Smooth image swap transition
            if (sedeImage) {
                sedeImage.style.opacity = "0.2";
                setTimeout(() => {
                    sedeImage.src = data.image;
                    sedeImage.style.opacity = "1";
                }, 250);
            }

            // Update details
            if (sedeTitle) sedeTitle.textContent = data.title;
            if (sedeAddress) sedeAddress.innerHTML = `<i data-lucide="map-pin" class="lucide-icon"></i> ${data.address}`;
            if (sedeHours) sedeHours.innerHTML = `<i data-lucide="clock" class="lucide-icon"></i> ${data.hours}`;
            if (sedeCoords) sedeCoords.innerHTML = `<i data-lucide="compass" class="lucide-icon"></i> ${data.coords}`;
            if (sedeMapBtn) sedeMapBtn.href = data.mapLink;

            // Rerender Lucide icons for the updated content
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    /* ==========================================================================
       4. MEDICAL TEAM CATEGORY FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const doctorCards = document.querySelectorAll(".doctor-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active status
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Add active to current
            button.classList.add("active");

            const filterValue = button.dataset.filter;

            doctorCards.forEach(card => {
                const specialty = card.dataset.specialty;

                if (filterValue === "all" || specialty === filterValue) {
                    card.style.display = "flex";
                    // Trigger minor entry animation
                    card.style.opacity = "0";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    /* ==========================================================================
       5. SEARCHABLE ACCORDION FOR SPECIALTIES
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    const searchInput = document.getElementById("specialty-search");
    const accordionItems = document.querySelectorAll(".accordion-item");
    
    // Accordion interaction
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const content = item.querySelector(".accordion-content");
            const isOpen = item.classList.contains("active");

            // Close all items
            accordionItems.forEach(i => {
                i.classList.remove("active");
                i.querySelector(".accordion-content").style.maxHeight = null;
            });

            // Open clicked if it wasn't open
            if (!isOpen) {
                item.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Real-time specialty search filter
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            let matchedAny = false;

            accordionItems.forEach(item => {
                const name = item.querySelector(".accordion-name").textContent.toLowerCase();
                const desc = item.querySelector(".accordion-desc").textContent.toLowerCase();

                if (name.includes(query) || desc.includes(query)) {
                    item.style.display = "block";
                    matchedAny = true;
                } else {
                    item.style.display = "none";
                }
            });

            // Show a feedback message if nothing matches
            let noResultMsg = document.getElementById("search-no-result");
            if (!matchedAny) {
                if (!noResultMsg) {
                    noResultMsg = document.createElement("p");
                    noResultMsg.id = "search-no-result";
                    noResultMsg.style.textAlign = "center";
                    noResultMsg.style.color = "var(--text-muted-dark)";
                    noResultMsg.style.padding = "2rem";
                    noResultMsg.style.fontWeight = "600";
                    noResultMsg.textContent = "No se encontraron especialidades que coincidan.";
                    document.querySelector(".specs-accordion").appendChild(noResultMsg);
                }
            } else {
                if (noResultMsg) noResultMsg.remove();
            }
        });
    }

    /* ==========================================================================
       6. TESTIMONIALS ACCORDION / SLIDER
       ========================================================================== */
    const testimonialSlides = document.querySelectorAll(".testi-slide");
    const testimonialDots = document.querySelectorAll(".testi-dot");
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonialSlides.forEach(slide => slide.classList.remove("active"));
        testimonialDots.forEach(dot => dot.classList.remove("active"));

        currentTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;

        testimonialSlides[currentTestimonial].classList.add("active");
        testimonialDots[currentTestimonial].classList.add("active");
    }

    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1);
    }

    testimonialDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showTestimonial(index);
            startTestimonialShow();
        });
    });

    function startTestimonialShow() {
        if (testimonialInterval) clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 5000);
    }

    if (testimonialSlides.length > 0) {
        startTestimonialShow();
    }

    /* ==========================================================================
       7. DYNAMIC MODALS ENGINE
       ========================================================================== */
    const modals = document.querySelectorAll(".modal-overlay");
    const closeButtons = document.querySelectorAll(".modal-close");

    // Modal triggering anchors/actions
    const triggerButtons = [
        { selector: ".btn-booking-trigger", modalId: "modal-booking" },
        { selector: ".btn-coverage-trigger", modalId: "modal-coverage" },
        { selector: ".btn-payment-trigger", modalId: "modal-payment" }
    ];

    triggerButtons.forEach(trigger => {
        document.querySelectorAll(trigger.selector).forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                openModal(trigger.modalId);
            });
        });
    });

    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent scrolling
        }
    }

    function closeModal() {
        modals.forEach(m => m.classList.remove("active"));
        document.body.style.overflow = "auto";
    }

    closeButtons.forEach(btn => {
        btn.addEventListener("click", closeModal);
    });

    // Close on overlay clicking
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });

    // Close on ESC key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    /* ==========================================================================
       8. INTELLIGENT WA APPOINTMENT ROUTER
       ========================================================================== */
    const bookingForm = document.getElementById("appointment-form");
    const specialtySelect = document.getElementById("booking-specialty");
    const doctorSelect = document.getElementById("booking-doctor");

    // Doctor filter inside booking modal: selecting a specialty automatically updates eligible doctors!
    if (specialtySelect && doctorSelect) {
        specialtySelect.addEventListener("change", () => {
            const selectedSpec = specialtySelect.value;

            // Reset doctor select options
            doctorSelect.innerHTML = '<option value="">Seleccione profesional (opcional)</option>';

            const filteredDoctors = doctorsData.filter(doc => !selectedSpec || doc.specialty === selectedSpec);
            
            filteredDoctors.forEach(doc => {
                const opt = document.createElement("option");
                opt.value = doc.name;
                opt.textContent = doc.name;
                doctorSelect.appendChild(opt);
            });
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Extract selection values
            const name = document.getElementById("booking-name").value.trim();
            const phone = document.getElementById("booking-phone").value.trim();
            const sede = document.getElementById("booking-sede").value;
            const specialty = document.getElementById("booking-specialty").value;
            const doctor = document.getElementById("booking-doctor").value;

            if (!name || !phone || !sede || !specialty) {
                alert("Por favor complete los campos obligatorios.");
                return;
            }

            // Construct elegant WhatsApp routing message
            const doctorText = doctor ? `\n• *Profesional:* ${doctor}` : "";
            
            const waMessage = `Hola, me contacto desde la web de *Clínica del Pilar* para solicitar un turno médico.

A continuación mis datos:
• *Nombre:* ${name}
• *Teléfono:* ${phone}
• *Sede:* ${sede}
• *Especialidad:* ${specialty}${doctorText}

Quedo a la espera de la confirmación de la fecha y hora disponible. ¡Muchas gracias!`;

            // Format message for URL query
            const encodedMessage = encodeURIComponent(waMessage);

            // Open WhatsApp routing window (using Argentina clinic code template 5492610000000 or general placeholder API)
            const whatsappUrl = `https://wa.me/5492610000000?text=${encodedMessage}`;
            window.open(whatsappUrl, "_blank");

            // Close modal
            closeModal();
            bookingForm.reset();
        });
    }

    /* ==========================================================================
       9. SMOOTH ENTRY REVEAL (IntersectionObserver)
       ========================================================================== */
    const revealElements = document.querySelectorAll(".quick-card, .doctor-card, .accordion-item, .sede-tab, .cobertura-pill");
    
    // Set standard hidden state styles via inline CSS fallback or stylesheet classes
    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(25px)";
        el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       10. CTA TEXT REVEAL ANIMATION
       ========================================================================== */
    const ctaTitle = document.querySelector(".cta-title");
    if (ctaTitle) {
        const ctaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        ctaObserver.observe(ctaTitle);
    }

    /* ==========================================================================
       11. MANIFIESTO ROTATOR (Misión, Visión, Valores)
       ========================================================================== */
    const manifestoSlides = document.querySelectorAll(".manifiesto-slide");
    const manifestoWaveImg = document.getElementById("manifiesto-wave-img");
    let currentManifestoSlide = 0;
    let manifestoInterval;

    function showManifestoSlide(index) {
        if (manifestoSlides.length === 0) return;
        manifestoSlides.forEach(slide => slide.classList.remove("active"));
        currentManifestoSlide = (index + manifestoSlides.length) % manifestoSlides.length;
        manifestoSlides[currentManifestoSlide].classList.add("active");
        if (manifestoWaveImg) {
            manifestoWaveImg.style.transform = `translateX(-${currentManifestoSlide * 24}%)`;
        }
    }

    function nextManifestoSlide() {
        showManifestoSlide(currentManifestoSlide + 1);
    }

    if (manifestoSlides.length > 1) {
        showManifestoSlide(0);
        manifestoInterval = setInterval(nextManifestoSlide, 6000);
    }

    /* ==========================================================================
       12. INTERACTIVE MAP FOR 4 SEDES (contacto.html)
       ========================================================================== */
    const mapTabBtns = document.querySelectorAll(".map-tab-btn");
    const mapSedeTag = document.getElementById("map-sede-tag");
    const mapSedeTitle = document.getElementById("map-sede-title");
    const mapSedeAddress = document.getElementById("map-sede-address");
    const mapSedePhone = document.getElementById("map-sede-phone");
    const mapSedeHours = document.getElementById("map-sede-hours");
    const mapSedeLink = document.getElementById("map-sede-link");
    const mapIframe = document.getElementById("map-iframe");

    const mapSedesData = {
        peru: {
            tag: "Consultorios Externos",
            title: "Sede Perú",
            address: "Av. Perú 1717, Ciudad · Mendoza",
            phone: "261 4242054",
            hours: "Lunes a Viernes de 08:00 a 21:00 hs",
            mapUrl: "https://maps.google.com/maps?q=Av.+Peru+1717,+Mendoza&t=&z=15&ie=UTF8&iwloc=&output=embed",
            link: "https://maps.google.com/?q=Av.+Peru+1717,+Mendoza"
        },
        dalvian: {
            tag: "Sede Principal",
            title: "Sede Dalvian",
            address: "Av. 7 Colores 2015, Local 42, Dalvian · Mendoza",
            phone: "261 4242054",
            hours: "Lunes a Viernes de 08:00 a 20:00 hs",
            mapUrl: "https://maps.google.com/maps?q=Av.+7+Colores+2015+Dalvian+Mendoza&t=&z=15&ie=UTF8&iwloc=&output=embed",
            link: "https://maps.google.com/?q=Av.+7+Colores+2015+Dalvian+Mendoza"
        },
        brasil: {
            tag: "Próximamente · Alta Complejidad",
            title: "Sede Brasil (Próximamente)",
            address: "Brasil 308, Ciudad · Mendoza",
            phone: "261 4242054",
            hours: "Próximamente Apertura",
            mapUrl: "https://maps.google.com/maps?q=Brasil+308,+Mendoza&t=&z=15&ie=UTF8&iwloc=&output=embed",
            link: "https://maps.google.com/?q=Brasil+308,+Mendoza"
        },
        godoycruz: {
            tag: "Imágenes Médicas",
            title: "Sede Godoy Cruz",
            address: "San Martín 1867, Godoy Cruz · Mendoza",
            phone: "261 4242054",
            hours: "Lunes a Sábado de 07:30 a 20:00 hs",
            mapUrl: "https://maps.google.com/maps?q=San+Martin+1867+Godoy+Cruz+Mendoza&t=&z=15&ie=UTF8&iwloc=&output=embed",
            link: "https://maps.google.com/?q=San+Martin+1867+Godoy+Cruz+Mendoza"
        }
    };

    if (mapTabBtns.length > 0 && mapIframe) {
        mapTabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                mapTabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const key = btn.getAttribute("data-map-sede");
                const data = mapSedesData[key];
                if (data) {
                    if (mapSedeTitle) mapSedeTitle.textContent = data.title;
                    if (mapSedeAddress) mapSedeAddress.innerHTML = `<i data-lucide="map-pin" style="width: 16px; height: 16px; display: inline; color: var(--primary);"></i> ${data.address}`;
                    if (mapSedePhone) mapSedePhone.innerHTML = `<i data-lucide="phone" style="width: 16px; height: 16px; display: inline; color: var(--primary);"></i> <strong>Teléfono:</strong> <a href="tel:+54${data.phone}" style="color: var(--primary); text-decoration: none; font-weight: 700;">${data.phone}</a>`;
                    if (mapSedeHours) mapSedeHours.innerHTML = `<i data-lucide="clock" style="width: 16px; height: 16px; display: inline; color: var(--primary);"></i> <strong>Horario:</strong> ${data.hours}`;
                    if (mapSedeLink) mapSedeLink.href = data.link;
                    mapIframe.src = data.mapUrl;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            });
        });
    }

    /* ==========================================================================
       13. CONTACT FORM INTERACTION (contacto.html)
       ========================================================================== */
    const mainContactForm = document.getElementById("main-contact-form");
    const contactFormFeedback = document.getElementById("contact-form-feedback");

    if (mainContactForm && contactFormFeedback) {
        mainContactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = mainContactForm.querySelector(".btn-contact-submit");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin" style="width: 18px; height: 18px;"></i> Enviando...`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            setTimeout(() => {
                mainContactForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i data-lucide="send" style="width: 18px; height: 18px;"></i> Enviar Consulta`;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
                contactFormFeedback.classList.add("success");
                contactFormFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });
    }

    /* ==========================================================================
       14. SERVICIOS & ESPECIALIDADES DIRECTORY FILTERING (servicios.html)
       ========================================================================== */
    const specSearchInput = document.getElementById("spec-search-input");
    const filterPillBtns = document.querySelectorAll(".filter-pill-btn");
    const specDirItems = document.querySelectorAll(".spec-dir-item");
    const noSpecResults = document.getElementById("no-spec-results");
    const resetSpecSearchBtn = document.getElementById("reset-spec-search");

    if (specDirItems.length > 0) {
        let currentFilter = "all";
        let currentQuery = "";

        function filterDirectory() {
            let visibleCount = 0;
            specDirItems.forEach(item => {
                const category = item.getAttribute("data-category") || "";
                const titleText = item.querySelector("h5") ? item.querySelector("h5").textContent.toLowerCase() : "";
                const descText = item.querySelector("p") ? item.querySelector("p").textContent.toLowerCase() : "";
                const matchesCategory = (currentFilter === "all" || category === currentFilter);
                const matchesSearch = (!currentQuery || titleText.includes(currentQuery) || descText.includes(currentQuery));

                if (matchesCategory && matchesSearch) {
                    item.style.display = "block";
                    visibleCount++;
                } else {
                    item.style.display = "none";
                }
            });

            if (noSpecResults) {
                noSpecResults.style.display = (visibleCount === 0) ? "block" : "none";
            }
        }

        if (specSearchInput) {
            specSearchInput.addEventListener("input", (e) => {
                currentQuery = e.target.value.toLowerCase().trim();
                filterDirectory();
            });
        }

        filterPillBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterPillBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.getAttribute("data-filter") || "all";
                filterDirectory();
            });
        });

        if (resetSpecSearchBtn) {
            resetSpecSearchBtn.addEventListener("click", () => {
                if (specSearchInput) specSearchInput.value = "";
                currentQuery = "";
                currentFilter = "all";
                filterPillBtns.forEach(b => b.classList.remove("active"));
                if (filterPillBtns[0]) filterPillBtns[0].classList.add("active");
                filterDirectory();
            });
        }
    }

    /* ==========================================================================
       NAV DROPDOWN CLICK/TOGGLE LOGIC
       ========================================================================== */
    const dropdownItems = document.querySelectorAll(".nav-item-dropdown");
    dropdownItems.forEach(item => {
        const toggleLink = item.querySelector("a");
        if (toggleLink) {
            toggleLink.addEventListener("click", (e) => {
                const href = toggleLink.getAttribute("href");
                if (!href || href === "javascript:void(0);" || href === "javascript:void(0)" || href === "#" || href === "#sedes" || href.includes("contacto.html")) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const wasActive = item.classList.contains("active");
                    dropdownItems.forEach(other => other.classList.remove("active"));
                    if (!wasActive) {
                        item.classList.add("active");
                    }
                }
            });
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-item-dropdown")) {
            dropdownItems.forEach(item => item.classList.remove("active"));
        }
    });
});


