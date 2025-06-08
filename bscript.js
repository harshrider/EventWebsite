const blogConfig = {
    apiUrl: 'https://script.google.com/macros/s/AKfycbwk1jNv6nqykDRcBpQ1ZL18gWzj3w_8RSp_VvodXqRort2Erp5gr0NaJvMfrJc0v1U/exec',
    postsPerPage: 6,
    currentPage: 1,
    totalPosts: 0,
    posts: [],
    filteredPosts: [],
    currentCategory: 'all'
};

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    initMobileNav();
    
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
});

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const navItems = document.querySelectorAll('.nav-links a');

    if (!navToggle || !navLinks || !navOverlay) return;

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navOverlay.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

async function loadBlogPosts() {
    const loadingEl = document.getElementById('blogLoading');
    const errorEl = document.getElementById('blogError');
    const gridEl = document.getElementById('blogGrid');
    const paginationEl = document.getElementById('blogPagination');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    gridEl.style.display = 'none';
    paginationEl.style.display = 'none';
    
    try {
        const response = await fetch(blogConfig.apiUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();
        
        if (data.posts) {
            blogConfig.posts = data.posts;
        } else if (data.values) {
            const rows = data.values.slice(1); 
            blogConfig.posts = rows.map((row, index) => ({
                id: index + 1,
                title: row[0] || 'Untitled',
                excerpt: row[1] || '',
                content: row[2] || '',
                category: row[3] || 'Event',
                date: row[4] || new Date().toISOString().split('T')[0],
                author: row[5] || '23 Events Team',
                image: row[6] || '',
                readTime: row[7] || '5 min read'
            }));
        } else {
            blogConfig.posts = data;
        }
        
        blogConfig.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        blogConfig.totalPosts = blogConfig.posts.length;
        blogConfig.filteredPosts = [...blogConfig.posts];
        
        displayBlogPosts();
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
}

function displayBlogPosts() {
    const loadingEl = document.getElementById('blogLoading');
    const gridEl = document.getElementById('blogGrid');
    const paginationEl = document.getElementById('blogPagination');
    
    const startIndex = (blogConfig.currentPage - 1) * blogConfig.postsPerPage;
    const endIndex = startIndex + blogConfig.postsPerPage;
    const currentPosts = blogConfig.filteredPosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(blogConfig.filteredPosts.length / blogConfig.postsPerPage);
    
    gridEl.innerHTML = '';
    
    if (currentPosts.length === 0) {
        gridEl.innerHTML = '<p style="text-align: center; color: #9b8653; font-size: 1.2rem;">No posts found in this category.</p>';
    } else {
        currentPosts.forEach(post => {
            const card = createBlogCard(post);
            gridEl.appendChild(card);
        });
    }
    
    loadingEl.style.display = 'none';
    gridEl.style.display = 'grid';
    
    if (totalPages > 1) {
        updatePagination(totalPages);
        paginationEl.style.display = 'flex';
    } else {
        paginationEl.style.display = 'none';
    }
    
    observeBlogCards();
}

function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.onclick = () => openBlogModal(post);
    
    const formattedDate = formatDate(post.date);
    
    card.innerHTML = `
        <div class="blog-image">
            ${post.image ? 
                `<img src="${post.image}" alt="${post.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 400 300\\'%3E%3Crect fill=\\'%239b8653\\' width=\\'400\\' height=\\'300\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' fill=\\'white\\' font-size=\\'20\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3E23 Events%3C/text%3E%3C/svg%3E'">` 
                : 
                `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    <i class="fas fa-calendar-alt"></i>
                </div>`
            }
            <span class="blog-category">${post.category}</span>
        </div>
        <div class="blog-content">
            <div class="blog-date">${formattedDate}</div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${truncateText(post.excerpt, 150)}</p>
            <div class="blog-meta">
                <div class="blog-author">
                    <i class="fas fa-user"></i>
                    <span>${post.author}</span>
                </div>
                <a href="#" class="read-more" onclick="event.preventDefault()">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch {
        return dateString;
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function updatePagination(totalPages) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    pageInfo.textContent = `Page ${blogConfig.currentPage} of ${totalPages}`;
    prevBtn.disabled = blogConfig.currentPage === 1;
    nextBtn.disabled = blogConfig.currentPage === totalPages;
}

function changePage(direction) {
    const totalPages = Math.ceil(blogConfig.filteredPosts.length / blogConfig.postsPerPage);
    const newPage = blogConfig.currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        blogConfig.currentPage = newPage;
        displayBlogPosts();
        
        document.querySelector('.blog-content-section').scrollIntoView({ behavior: 'smooth' });
    }
}

function filterPosts(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (category === 'all') {
        blogConfig.filteredPosts = [...blogConfig.posts];
    } else {
        blogConfig.filteredPosts = blogConfig.posts.filter(post => post.category === category);
    }
    
    blogConfig.currentPage = 1;
    blogConfig.currentCategory = category;
    
    displayBlogPosts();
}

function openBlogModal(post) {
    const modal = document.getElementById('blogModal');
    const modalContent = document.getElementById('modalContent');
    
    const formattedDate = formatDate(post.date);
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${post.title}</h2>
            <div class="modal-meta">
                <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                <span><i class="fas fa-user"></i> ${post.author}</span>
                <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                <span><i class="fas fa-folder"></i> ${post.category}</span>
            </div>
        </div>
        ${post.image ? 
            `<div class="modal-image">
                <img src="${post.image}" alt="${post.title}">
            </div>` 
            : ''
        }
        <div class="modal-body">
            ${formatContent(post.content)}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function formatContent(content) {
    const paragraphs = content.split('\n\n');
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('blogModal');
    if (event.target === modal) {
        closeBlogModal();
    }
});

function observeBlogCards() {
    const cards = document.querySelectorAll('.blog-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}