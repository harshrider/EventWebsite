document.addEventListener('DOMContentLoaded', function() {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    let teamCurrentIndex = 0;
    let servicesCurrentIndex = 0;
    let isMobile = false;

    function checkMobile() {
        isMobile = window.innerWidth <= 768;
        setupCarousels();
    }

    function setupCarousels() {
        const teamContainer = document.querySelector('.team-carousel-container');
        const servicesContainer = document.querySelector('.services-carousel-container');
        const teamGrid = document.querySelector('.team-grid');
        const servicesGrid = document.querySelector('.services-grid');
        
        if (isMobile) {
            teamContainer.classList.add('mobile-carousel');
            servicesContainer.classList.add('mobile-carousel');
            
            setupTeamCarousel();
            setupServicesCarousel();
        } else {
            teamContainer.classList.remove('mobile-carousel');
            servicesContainer.classList.remove('mobile-carousel');
            
            teamGrid.style.transform = 'translateX(0)';
            servicesGrid.style.transform = 'translateX(0)';
        }
    }

    function setupTeamCarousel() {
        const teamMembers = document.querySelectorAll('.team-member');
        const teamDots = document.querySelectorAll('.team-dots .dot');
        
        teamMembers.forEach((member, index) => {
            member.classList.toggle('active', index === teamCurrentIndex);
        });
        
        teamDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === teamCurrentIndex);
        });
        
        updateTeamCarousel();
    }

    function setupServicesCarousel() {
        const serviceCards = document.querySelectorAll('.service-card');
        const servicesDots = document.querySelectorAll('.services-dots .dot');
        
        serviceCards.forEach((card, index) => {
            card.classList.toggle('active', index === servicesCurrentIndex);
        });
        
        servicesDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === servicesCurrentIndex);
        });
        
        updateServicesCarousel();
    }

    function updateTeamCarousel() {
        if (!isMobile) return;
        
        const teamGrid = document.querySelector('.team-grid');
        const translateX = -teamCurrentIndex * 100;
        teamGrid.style.transform = `translateX(${translateX}%)`;
        
        const teamDots = document.querySelectorAll('.team-dots .dot');
        teamDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === teamCurrentIndex);
        });
    }

    function updateServicesCarousel() {
        if (!isMobile) return;
        
        const servicesGrid = document.querySelector('.services-grid');
        const translateX = -servicesCurrentIndex * 100;
        servicesGrid.style.transform = `translateX(${translateX}%)`;
        
        const servicesDots = document.querySelectorAll('.services-dots .dot');
        servicesDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === servicesCurrentIndex);
        });
    }

    function showSlide(index) {
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

    function autoSlide() {
        currentSlideIndex++;
        if (currentSlideIndex >= totalSlides) {
            currentSlideIndex = 0;
        }
        showSlide(currentSlideIndex);
    }

    window.changeSlide = changeSlide;
    window.currentSlide = currentSlide;

    document.querySelector('.team-prev').addEventListener('click', () => changeTeamSlide(-1));
    document.querySelector('.team-next').addEventListener('click', () => changeTeamSlide(1));
    document.querySelector('.services-prev').addEventListener('click', () => changeServicesSlide(-1));
    document.querySelector('.services-next').addEventListener('click', () => changeServicesSlide(1));

    document.querySelectorAll('.team-dots .dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToTeamSlide(index));
    });

    document.querySelectorAll('.services-dots .dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToServicesSlide(index));
    });

    if (totalSlides > 0) {
        setInterval(autoSlide, 10000);
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

    checkMobile();
    window.addEventListener('resize', checkMobile);
});