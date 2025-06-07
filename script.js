document.addEventListener('DOMContentLoaded', function() {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const totalSlides = slides.length;

    let teamCurrentIndex = 0;
    let servicesCurrentIndex = 0;
    let workCurrentIndex = 0;
    let isMobile = false;
    initMobileNav();

    // Header scroll effect (new enhancement)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    function checkMobile() {
        const newIsMobile = window.innerWidth <= 992;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            setupCarousels();
        }
    }

    function setupCarousels() {
        const teamContainer = document.querySelector('.team-carousel-container');
        const servicesContainer = document.querySelector('.services-carousel-container');
        const teamGrid = document.querySelector('.team-grid');
        const servicesGrid = document.querySelector('.services-grid');
        
        if (!teamContainer || !servicesContainer || !teamGrid || !servicesGrid) return;
        
        if (isMobile) {
            teamContainer.classList.add('mobile-carousel');
            servicesContainer.classList.add('mobile-carousel');
            
            teamCurrentIndex = 0;
            servicesCurrentIndex = 0;
            
            updateTeamCarousel();
            updateServicesCarousel();
        } else {
            teamContainer.classList.remove('mobile-carousel');
            servicesContainer.classList.remove('mobile-carousel');
            
            teamGrid.style.transform = 'translateX(0)';
            servicesGrid.style.transform = 'translateX(0)';
        }
    }

    function updateTeamCarousel() {
        if (!isMobile) return;
        
        const teamGrid = document.querySelector('.team-grid');
        const teamDots = document.querySelectorAll('.team-dots .dot');
        
        if (!teamGrid || !teamDots.length) return;
        
        const translateX = -teamCurrentIndex * 25;
        teamGrid.style.transform = `translateX(${translateX}%)`;
        
        teamDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === teamCurrentIndex);
        });
    }

    function updateServicesCarousel() {
        if (!isMobile) return;
        
        const servicesGrid = document.querySelector('.services-grid');
        const servicesDots = document.querySelectorAll('.services-dots .dot');
        
        if (!servicesGrid || !servicesDots.length) return;
        
        const translateX = -servicesCurrentIndex * 25;
        servicesGrid.style.transform = `translateX(${translateX}%)`;
        
        servicesDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === servicesCurrentIndex);
        });
    }

    function showSlide(index) {
        if (!slides.length || !dots.length) return;
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (slides[index] && dots[index]) {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
    }

    function changeSlide(direction) {
        currentSlideIndex += direction;
        
        if (currentSlideIndex >= totalSlides) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = totalSlides - 1;
        }
        
        showSlide(currentSlideIndex);
    }

    function currentSlide(index) {
        currentSlideIndex = index - 1;
        showSlide(currentSlideIndex);
    }

    function changeTeamSlide(direction) {
        if (!isMobile) return;
        
        teamCurrentIndex += direction;
        
        if (teamCurrentIndex >= 4) {
            teamCurrentIndex = 0;
        } else if (teamCurrentIndex < 0) {
            teamCurrentIndex = 3;
        }
        
        updateTeamCarousel();
    }

    function changeServicesSlide(direction) {
        if (!isMobile) return;
        
        servicesCurrentIndex += direction;
        
        if (servicesCurrentIndex >= 4) {
            servicesCurrentIndex = 0;
        } else if (servicesCurrentIndex < 0) {
            servicesCurrentIndex = 3;
        }
        
        updateServicesCarousel();
    }

    function changeWorkSlide(direction) {
        const workSlides = document.querySelectorAll('.work-slide');
        const workDots = document.querySelectorAll('.work-dots .dot');
        
        if (!workSlides.length) return;
        
        workCurrentIndex += direction;
        
        if (workCurrentIndex >= workSlides.length) {
            workCurrentIndex = 0;
        } else if (workCurrentIndex < 0) {
            workCurrentIndex = workSlides.length - 1;
        }
        
        updateWorkCarousel();
    }

    function updateWorkCarousel() {
        const workSlides = document.querySelectorAll('.work-slide');
        const workDots = document.querySelectorAll('.work-dots .dot');
        
        if (!workSlides.length || !workDots.length) return;
        
        workSlides.forEach(slide => slide.classList.remove('active'));
        workDots.forEach(dot => dot.classList.remove('active'));
        
        if (workSlides[workCurrentIndex] && workDots[workCurrentIndex]) {
            workSlides[workCurrentIndex].classList.add('active');
            workDots[workCurrentIndex].classList.add('active');
        }
    }

    function goToTeamSlide(index) {
        if (!isMobile) return;
        teamCurrentIndex = index;
        updateTeamCarousel();
    }

    function goToServicesSlide(index) {
        if (!isMobile) return;
        servicesCurrentIndex = index;
        updateServicesCarousel();
    }

    function goToWorkSlide(index) {
        workCurrentIndex = index;
        updateWorkCarousel();
    }

    function autoSlide() {
        if (totalSlides === 0) return;
        
        currentSlideIndex++;
        if (currentSlideIndex >= totalSlides) {
            currentSlideIndex = 0;
        }
        showSlide(currentSlideIndex);
    }

    function autoWorkSlide() {
        const workSlides = document.querySelectorAll('.work-slide');
        if (workSlides.length === 0) return;
        
        workCurrentIndex++;
        if (workCurrentIndex >= workSlides.length) {
            workCurrentIndex = 0;
        }
        updateWorkCarousel();
    }

    window.changeSlide = changeSlide;
    window.currentSlide = currentSlide;

    const teamPrev = document.querySelector('.team-prev');
    const teamNext = document.querySelector('.team-next');
    const servicesPrev = document.querySelector('.services-prev');
    const servicesNext = document.querySelector('.services-next');
    const workPrev = document.querySelector('.work-prev');
    const workNext = document.querySelector('.work-next');

    if (teamPrev) teamPrev.addEventListener('click', () => changeTeamSlide(-1));
    if (teamNext) teamNext.addEventListener('click', () => changeTeamSlide(1));
    if (servicesPrev) servicesPrev.addEventListener('click', () => changeServicesSlide(-1));
    if (servicesNext) servicesNext.addEventListener('click', () => changeServicesSlide(1));
    if (workPrev) workPrev.addEventListener('click', () => changeWorkSlide(-1));
    if (workNext) workNext.addEventListener('click', () => changeWorkSlide(1));

    document.querySelectorAll('.team-dots .dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToTeamSlide(index));
    });

    document.querySelectorAll('.services-dots .dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToServicesSlide(index));
    });

    document.querySelectorAll('.work-dots .dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToWorkSlide(index));
    });

    if (totalSlides > 0) {
        setInterval(autoSlide, 10000);
    }

    const workSlides = document.querySelectorAll('.work-slide');
    if (workSlides.length > 0) {
        setInterval(autoWorkSlide, 8000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // NEW: Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // NEW: Apply initial styles and observe elements for animation
    const animateOnScroll = document.querySelectorAll('.service-card, .team-member, .work-text-content, .contact-method, .destination');
    animateOnScroll.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // NEW: Subtle parallax effect for hero section
    const heroContent = document.querySelector('.carousel-container');
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.3; // Reduced for subtlety
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }
    function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (!navToggle || !navLinks || !navOverlay) return;
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking overlay
    navOverlay.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking nav links
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on window resize if open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

    // Initialize mobile detection and carousels
    checkMobile();
    window.addEventListener('resize', checkMobile);
});