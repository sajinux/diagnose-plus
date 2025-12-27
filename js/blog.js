/**
 * Blog Logic for Diagnose Plus
 * Handles fetching posts, rendering the grid, and modal functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const blogModal = document.getElementById('blog-modal');
    const modalClose = document.getElementById('modal-close');

    // Modal Elements
    const modalEmoji = document.getElementById('modal-emoji');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalAuthor = document.getElementById('modal-author');
    const modalBody = document.getElementById('modal-body');

    // Fetch all blog posts
    async function fetchPosts() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.blog}`);
            const result = await response.json();

            if (result.success) {
                renderPosts(result.data);
            } else {
                console.error('Failed to fetch posts:', result.message);
                blogGrid.innerHTML = '<p class="error">අපට මේ මොහොතේ ලිපි ලබා ගැනීමට නොහැකි විය. කරුණාකර පසුව උත්සාහ කරන්න.</p>';
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            blogGrid.innerHTML = '<p class="error">සම්බන්ධතා දෝෂයකි. කරුණාකර පසුව උත්සාහ කරන්න.</p>';
        }
    }

    // Render posts to the grid
    function renderPosts(posts) {
        if (!posts || posts.length === 0) {
            blogGrid.innerHTML = '<p>තවම ලිපි කිසිවක් නැත.</p>';
            return;
        }

        blogGrid.innerHTML = posts.map(post => `
            <article class="blog-card">
                <div class="blog-image">
                    <img src="${post.image_emoji}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="blog-body">
                    <span class="blog-category">${post.category}</span>
                    <h2 class="blog-title">${post.title}</h2>
                    <div class="blog-meta">
                        <span>📅 ${formatDate(post.created_at)}</span>
                        <span>👤 ${post.author}</span>
                    </div>
                    <p class="blog-excerpt">
                        ${post.excerpt}
                    </p>
                    <a href="#" class="blog-link" data-id="${post.id}">Read More →</a>
                </div>
            </article>
        `).join('');

        // Add event listeners to "Read More" links
        document.querySelectorAll('.blog-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = e.target.getAttribute('data-id');
                openPost(postId);
            });
        });
    }

    // Fetch and open a single post in the modal
    async function openPost(id) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.blog}/${id}`);
            const result = await response.json();

            if (result.success) {
                const post = result.data;

                modalEmoji.innerHTML = `<img src="${post.image_emoji}" alt="${post.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;">`;
                modalCategory.textContent = post.category;
                modalTitle.textContent = post.title;
                modalDate.textContent = `📅 ${formatDate(post.created_at)}`;
                modalAuthor.textContent = `👤 ${post.author}`;
                modalBody.innerHTML = post.content.split('\n').map(p => `<p>${p}</p>`).join('');

                blogModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        } catch (error) {
            console.error('Error opening post:', error);
        }
    }

    // Close modal
    function closeModal() {
        blogModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    modalClose.addEventListener('click', closeModal);

    // Close on outside click
    blogModal.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            closeModal();
        }
    });

    // Format date string
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Initial fetch
    fetchPosts();
});
