document.addEventListener('DOMContentLoaded', function() {

    // Dropdown menu logic
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdown) {
        dropdown.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                const isDisplayed = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isDisplayed ? 'none' : 'block';
            }
        });
    }

    // Update copyright year
    const copyright = document.getElementById('copyright');
    if (copyright) {
        const currentYear = new Date().getFullYear();
        copyright.innerHTML = `&copy; ${currentYear} Projeto Minecraft. Feito com 💚 por @itsmegustavoo`;
    }

    // On-scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: remove 'visible' class when out of view
                // entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach((section, sectionIndex) => {
        if (section.classList.contains('hero')) {
            return; // Skip the hero section
        }

        let elementsToAnimate;

        if (section.classList.contains('updates-news')) {
            elementsToAnimate = section.querySelectorAll('.news-item');
        } else if (section.classList.contains('tutorials')) {
            elementsToAnimate = section.querySelectorAll('.tutorial-item');
        } else if (section.classList.contains('game-history')) {
            elementsToAnimate = section.querySelectorAll('.history-image, .history-text');
        } else if (section.classList.contains('player-builds')) {
            elementsToAnimate = section.querySelectorAll('.build-card');
        } else {
            elementsToAnimate = section.querySelectorAll('.section-image, .content-container p'); // Generic for other sections
        }
        
        elementsToAnimate.forEach((element, elementIndex) => {
            element.classList.add('hidden');
            if (element.classList.contains('slide-in-left') || element.classList.contains('slide-in-right') || element.classList.contains('fade-in')) {
                // Already has a specific animation class, keep it
            } else if (element.classList.contains('news-item') || element.classList.contains('tutorial-item') || element.classList.contains('build-card')) {
                element.classList.add('fade-in'); // Default for cards
            } else if (element.classList.contains('history-image')) {
                element.classList.add('slide-in-right');
            } else if (element.classList.contains('history-text')) {
                element.classList.add('fade-in');
            } else if (element.tagName === 'P') {
                element.classList.add('fade-in');
            } else {
                // Fallback for other elements, apply slide-in based on index
                if (elementIndex % 2 === 0) {
                    element.classList.add('slide-in-left');
                } else {
                    element.classList.add('slide-in-right');
                }
            }
            observer.observe(element);
        });
    });
    

    // Block Gallery Modal (existing code)
    const modal = document.getElementById('block-modal');
    const modalName = document.getElementById('modal-block-name');
    const modalDescription = document.getElementById('modal-block-description');
    const blockItems = document.querySelectorAll('.block-item');
    const closeButton = document.querySelector('.close-button');

    blockItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.getAttribute('data-name');
            const description = item.getAttribute('data-description');
            
            modalName.textContent = name;
            modalDescription.textContent = description;
            modal.style.display = 'block';
        });
    });

    if(closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Community Gallery Carousel (existing code)
    const gallery = document.querySelector('.community-gallery');
    if (gallery) {
        const items = gallery.querySelectorAll('.gallery-item');
        const prevButton = document.querySelector('.carousel-control.prev');
        const nextButton = document.querySelector('.carousel-control.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let slideInterval;

        function createDots() {
            items.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            const dots = document.querySelectorAll('.carousel-dots .dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            gallery.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots();
            resetInterval();
        }

        function nextSlide() {
            const newIndex = (currentIndex + 1) % items.length;
            goToSlide(newIndex);
        }

        function prevSlide() {
            const newIndex = (currentIndex - 1 + items.length) % items.length;
            goToSlide(newIndex);
        }
        
        function startInterval() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        if (items.length > 0) {
            createDots();
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
            startInterval();
        }
    }

    // Player Builds Carousel
    const buildsCarousel = document.querySelector('.builds-carousel');
    if (buildsCarousel) {
        const prevButton = document.querySelector('.player-builds .prev-button');
        const nextButton = document.querySelector('.player-builds .next-button');

        prevButton.addEventListener('click', () => {
            buildsCarousel.scrollBy({
                left: -380, // Scroll left by card width + gap
                behavior: 'smooth'
            });
        });

        nextButton.addEventListener('click', () => {
            buildsCarousel.scrollBy({
                left: 380, // Scroll right by card width + gap
                behavior: 'smooth'
            });
        });
    }

    // Tutorial Carousel (Seamless Looping)
    const tutorialCarousel = document.querySelector('.tutorial-carousel');
    const tutorialItems = tutorialCarousel ? Array.from(tutorialCarousel.children) : [];
    const tutorialPrevButton = document.querySelector('.tutorials .prev-button');
    const tutorialNextButton = document.querySelector('.tutorials .next-button');

    if (tutorialCarousel && tutorialItems.length > 0) {
        const itemWidth = tutorialItems[0].offsetWidth + 30; // Item width + gap
        const visibleItems = Math.floor(tutorialCarousel.offsetWidth / itemWidth);
        const duplicatesCount = Math.max(visibleItems, 3); // Duplicate at least 3 items for seamless effect

        // Clone and append/prepend items
        for (let i = 0; i < duplicatesCount; i++) {
            tutorialCarousel.appendChild(tutorialItems[i].cloneNode(true));
            tutorialCarousel.prepend(tutorialItems[tutorialItems.length - 1 - i].cloneNode(true));
        }

        // Update tutorialItems to include duplicates
        const allTutorialItems = Array.from(tutorialCarousel.children);
        
        // Set initial scroll position to skip prepended duplicates
        tutorialCarousel.scrollLeft = duplicatesCount * itemWidth;

        let autoScrollInterval;

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                tutorialCarousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }, 3000); // Scroll every 3 seconds
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        const handleScrollEnd = () => {
            if (tutorialCarousel.scrollLeft >= (allTutorialItems.length - duplicatesCount) * itemWidth) {
                // Jump to the start of the original items (after prepended duplicates)
                tutorialCarousel.scrollLeft = duplicatesCount * itemWidth;
            } else if (tutorialCarousel.scrollLeft <= 0) {
                // Jump to the end of the original items (before appended duplicates)
                tutorialCarousel.scrollLeft = (allTutorialItems.length - duplicatesCount * 2) * itemWidth;
            }
        };

        tutorialCarousel.addEventListener('scroll', () => {
            // This timeout ensures the scroll animation completes before checking position
            clearTimeout(tutorialCarousel.scrollTimeout);
            tutorialCarousel.scrollTimeout = setTimeout(handleScrollEnd, 100);
        });

        if (tutorialPrevButton) {
            tutorialPrevButton.addEventListener('click', () => {
                stopAutoScroll();
                tutorialCarousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                startAutoScroll(); // Restart auto-scroll after manual interaction
            });
        }

        if (tutorialNextButton) {
            tutorialNextButton.addEventListener('click', () => {
                stopAutoScroll();
                tutorialCarousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
                startAutoScroll(); // Restart auto-scroll after manual interaction
            });
        }
        
        // Pause auto-scroll on hover
        tutorialCarousel.addEventListener('mouseenter', stopAutoScroll);
        tutorialCarousel.addEventListener('mouseleave', startAutoScroll);
        if (tutorialPrevButton) tutorialPrevButton.addEventListener('mouseenter', stopAutoScroll);
        if (tutorialPrevButton) tutorialPrevButton.addEventListener('mouseleave', startAutoScroll);
        if (tutorialNextButton) tutorialNextButton.addEventListener('mouseenter', stopAutoScroll);
        if (tutorialNextButton) tutorialNextButton.addEventListener('mouseleave', startAutoScroll);


        startAutoScroll();
    }

    // Hamburger Menu Logic
    const burgerCheckbox = document.getElementById('burger-checkbox');
    const hamburgerNavMenu = document.querySelector('.hamburger-nav-menu');

    if (burgerCheckbox && hamburgerNavMenu) {
        burgerCheckbox.addEventListener('change', () => {
            if (burgerCheckbox.checked) {
                hamburgerNavMenu.classList.add('active');
            } else {
                hamburgerNavMenu.classList.remove('active');
            }
        });
    }

    // Move Nav Items on Resize
    function handleResize() {
        const navMenu = document.querySelector('.nav-menu');
        const hamburgerMenuUl = document.querySelector('.hamburger-nav-menu ul');
        const inicioNavItem = document.getElementById('nav-item-inicio');
        const conquistasNavItem = document.getElementById('nav-item-conquistas');
        const jogarNavItem = document.getElementById('nav-item-jogar');

        if (!navMenu || !hamburgerMenuUl || !inicioNavItem || !conquistasNavItem || !jogarNavItem) {
            return; // Exit if elements are not found
        }

        if (window.innerWidth <= 768) {
            // Move to hamburger menu if they are not already there
            if (inicioNavItem.parentElement === navMenu) {
                hamburgerMenuUl.prepend(jogarNavItem);
                hamburgerMenuUl.prepend(conquistasNavItem);
                hamburgerMenuUl.prepend(inicioNavItem);
            }
        } else {
            // Move back to main nav menu if they are not already there
            if (inicioNavItem.parentElement === hamburgerMenuUl) {
                // Append them in the correct order to the main nav menu
                navMenu.appendChild(inicioNavItem);
                navMenu.appendChild(conquistasNavItem);
                navMenu.appendChild(jogarNavItem);
            }
        }
    }

    // Initial check on page load
    handleResize();
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
});