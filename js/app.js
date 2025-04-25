// SAP CDC (Gigya) Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize Gigya - Replace with your actual API key in the HTML file
    // Note: The API key should be already set in the HTML where the Gigya SDK is loaded
    
    // Check if user is already logged in
    gigya.accounts.getAccountInfo({
        callback: onGetAccountInfoResponse
    });
    
    // Load the login Screenset
    loadLoginScreenset();
    
    // Add event listener for logout button
    document.getElementById('logout-button').addEventListener('click', function() {
        gigya.accounts.logout({
            callback: onLogoutResponse
        });
    });
});

// Function to load the login Screenset
function loadLoginScreenset() {
    gigya.accounts.showScreenSet({
        screenSet: 'Default-RegistrationLogin',
        startScreen: 'gigya-login-screen',
        containerID: 'login-container',
        onAfterSubmit: onLoginSubmit
    });
}

// Handle login submission
function onLoginSubmit(response) {
    if (response.errorCode === 0) {
        // Successfully logged in
        console.log('Login successful');
        
        // Get account info to display profile
        gigya.accounts.getAccountInfo({
            callback: onGetAccountInfoResponse
        });
    } else {
        console.error('Login error:', response.errorMessage);
    }
}

// Handle account info response
function onGetAccountInfoResponse(response) {
    if (response.errorCode === 0) {
        // User is logged in, show profile section
        document.querySelector('.login-card').classList.add('hidden');
        const profileSection = document.getElementById('profile-section');
        profileSection.classList.remove('hidden');
        
        // Display user info
        const profileContainer = document.getElementById('profile-container');
        profileContainer.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    ${response.profile.photoURL ? 
                        `<img src="${response.profile.photoURL}" alt="Profile Photo">` : 
                        `<div class="avatar-placeholder">${getInitials(response.profile.firstName, response.profile.lastName)}</div>`
                    }
                </div>
                <div class="profile-info">
                    <h4>${response.profile.firstName || ''} ${response.profile.lastName || ''}</h4>
                    <p>${response.profile.email || ''}</p>
                </div>
            </div>
            <div class="profile-details">
                <p><strong>Last Login:</strong> ${formatDate(response.lastLoginTimestamp)}</p>
                <p><strong>Account ID:</strong> ${response.UID.substring(0, 10)}...</p>
            </div>
        `;
        
        // Add custom profile styles
        addProfileStyles();
    } else {
        // User is not logged in, show login section
        document.querySelector('.login-card').classList.remove('hidden');
        document.getElementById('profile-section').classList.add('hidden');
    }
}

// Handle logout response
function onLogoutResponse(response) {
    if (response.errorCode === 0) {
        console.log('Logout successful');
        document.querySelector('.login-card').classList.remove('hidden');
        document.getElementById('profile-section').classList.add('hidden');
        
        // Reload login Screenset
        loadLoginScreenset();
    } else {
        console.error('Logout error:', response.errorMessage);
    }
}

// Helper function to get initials from name
function getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || '?';
}

// Helper function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

// Add dynamic profile styles
function addProfileStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 1.5rem;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .avatar-placeholder {
            width: 100%;
            height: 100%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: bold;
        }
        
        .profile-info h4 {
            margin: 0;
            color: var(--dark-color);
            font-size: 1.4rem;
        }
        
        .profile-info p {
            margin: 0.25rem 0 0;
            color: #666;
        }
        
        .profile-details {
            background-color: #f5f7fa;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .profile-details p {
            margin: 0.5rem 0;
        }
    `;
    
    document.head.appendChild(style);
}

// Add animated background
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 1,
            color: getRandomColor(),
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }
    
    function getRandomColor() {
        const colors = ['#0076cb', '#19a979', '#2d3e50', '#70c4e2', '#ff6b6b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
        
        // Connect particles that are close
        connectParticles();
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(45, 62, 80, ${0.2 - distance/600})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    animate();
});
