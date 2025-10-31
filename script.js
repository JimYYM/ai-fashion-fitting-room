// ===========================
// Global State
// ===========================
let uploadedPhoto = null;
let selectedAvatar = 'slim'; // Default to slim avatar
let selectedOutfit = null;

// Hard-coded AI suggestions
const aiSuggestions = [
    { icon: '💡', text: 'Try bold colors for your skin tone - they really make you stand out!' },
    { icon: '✨', text: 'This outfit suits your body type perfectly. The fit is ideal!' },
    { icon: '👗', text: 'Consider pairing this with accessories to elevate your look.' },
    { icon: '🎨', text: 'Earth tones would complement your natural features beautifully.' },
    { icon: '🌟', text: 'Athletic wear enhances your physique - great choice for casual days!' },
    { icon: '💎', text: 'For formal events, darker shades create a sophisticated silhouette.' },
    { icon: '🔥', text: 'This style is trending! You\'re ahead of the fashion curve.' },
    { icon: '👔', text: 'Mix patterns carefully - solid colors work best with your selected avatar.' },
];

// Avatar configurations
const avatars = {
    slim: { emoji: '🧍', label: 'Slim / Petite', description: 'Perfect for slender builds' },
    athletic: { emoji: '🏃', label: 'Athletic / Fit', description: 'Toned and active body type' },
    average: { emoji: '🚶', label: 'Average', description: 'Standard proportions' },
    curvy: { emoji: '💃', label: 'Curvy', description: 'Full-figured silhouette' },
    plus: { emoji: '🧍‍♀️', label: 'Plus Size', description: 'Beautiful plus-size proportions' }
};

// Outfit configurations
const outfits = {
    outfit1: { emoji: '👕', name: 'Classic Polo', brand: 'brandA' },
    outfit2: { emoji: '👔', name: 'Oxford Shirt', brand: 'brandA' },
    outfit3: { emoji: '🧥', name: 'Blazer Jacket', brand: 'brandA' },
    outfit4: { emoji: '👗', name: 'Modern Dress', brand: 'brandB' },
    outfit5: { emoji: '👖', name: 'Designer Jeans', brand: 'brandB' },
    outfit6: { emoji: '🎽', name: 'Streetwear Top', brand: 'brandB' },
    outfit7: { emoji: '🩱', name: 'Pro Sportswear', brand: 'brandC' },
    outfit8: { emoji: '🏃', name: 'Running Outfit', brand: 'brandC' },
    outfit9: { emoji: '🧣', name: 'Winter Active', brand: 'brandC' }
};

// ===========================
// Image Upload Functionality
// ===========================
const photoUpload = document.getElementById('photoUpload');
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('previewContainer');
const photoPreview = document.getElementById('photoPreview');
const removePhoto = document.getElementById('removePhoto');
const validationMessage = document.getElementById('validationMessage');

// Drag and drop functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.background = 'rgba(99, 102, 241, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border-color)';
    uploadArea.style.background = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-color)';
    uploadArea.style.background = 'transparent';
    
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
});

photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
});

function handleFileUpload(file) {
    // Validation
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showValidationMessage('Please upload a JPEG or PNG file.', 'error');
        return;
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        showValidationMessage('File size must be less than 5MB.', 'error');
        return;
    }
    
    // Read and display the file
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedPhoto = e.target.result;
        photoPreview.src = uploadedPhoto;
        uploadArea.style.display = 'none';
        previewContainer.style.display = 'block';
        showValidationMessage('Photo uploaded successfully! ✓', 'success');
        updateTryOnDisplay();
    };
    reader.readAsDataURL(file);
}

removePhoto.addEventListener('click', () => {
    uploadedPhoto = null;
    photoPreview.src = '';
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'block';
    photoUpload.value = '';
    validationMessage.style.display = 'none';
    updateTryOnDisplay();
});

function showValidationMessage(message, type) {
    validationMessage.textContent = message;
    validationMessage.className = `validation-message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            validationMessage.style.display = 'none';
        }, 3000);
    }
}

// ===========================
// Avatar Selection (Removed - Slim is default)
// ===========================
// Avatar selection has been removed. The slim avatar is now the default and always displayed.

// ===========================
// Brand Filtering
// ===========================
const brandFilters = document.querySelectorAll('.brand-filter');
let allOutfitCards = document.querySelectorAll('.outfit-card');

brandFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Update active filter
        brandFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        const selectedBrand = filter.dataset.brand;
        
        // Filter outfits
        allOutfitCards.forEach(card => {
            if (selectedBrand === 'all' || card.dataset.brand === selectedBrand) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Add message
        if (selectedBrand === 'all') {
            addAssistantMessage('🏷️', 'Showing all brands. Browse our complete collection!');
        } else {
            const brandNames = {
                brandA: 'Brand A - Classic',
                brandB: 'Brand B - Modern',
                brandC: 'Brand C - Athletic'
            };
            addAssistantMessage('🏷️', `Filtered to ${brandNames[selectedBrand]}. Great choice!`);
        }
    });
});

// ===========================
// Try-On Display Update
// ===========================
function updateTryOnDisplay() {
    const tryOnDisplay = document.getElementById('tryOnDisplay');
    
    // Always show the slim avatar (default)
    const avatar = avatars[selectedAvatar];
    const outfitEmoji = selectedOutfit ? outfits[selectedOutfit].emoji : '';
    
    tryOnDisplay.innerHTML = `
        <div class="try-on-active">
            <div class="try-on-avatar">
                ${avatar.emoji}
                ${outfitEmoji ? `<div class="outfit-overlay">${outfitEmoji}</div>` : ''}
            </div>
        </div>
    `;
}

// ===========================
// Outfit Selection
// ===========================
allOutfitCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove previous selection
        allOutfitCards.forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        selectedOutfit = card.dataset.outfit;
        
        // Update the try-on display
        updateTryOnDisplay();
        
        // Add assistant message
        const outfitName = outfits[selectedOutfit].name;
        addAssistantMessage('👗', `You've selected "${outfitName}". Looking great!`);
    });
});

// ===========================
// Match & Rank Functionality (Auto-Select)
// ===========================
const matchBtn = document.getElementById('matchBtn');

matchBtn.addEventListener('click', () => {
    // Show loading state
    matchBtn.textContent = '🔄 AI Matching...';
    matchBtn.disabled = true;
    
    setTimeout(() => {
        // Remove all previous selections and highlights
        allOutfitCards.forEach(card => {
            card.classList.remove('selected', 'top-pick', 'auto-selected');
        });
        
        // Get visible cards only (based on current filter)
        const visibleCards = Array.from(allOutfitCards).filter(card => 
            card.style.display !== 'none'
        );
        
        // Auto-select 3 random outfits from visible ones
        const numToSelect = Math.min(3, visibleCards.length);
        const selectedIndices = new Set();
        
        while (selectedIndices.size < numToSelect) {
            const randomIndex = Math.floor(Math.random() * visibleCards.length);
            selectedIndices.add(randomIndex);
        }
        
        // Apply auto-selected styling with staggered animation
        Array.from(selectedIndices).forEach((index, i) => {
            setTimeout(() => {
                visibleCards[index].classList.add('auto-selected');
                
                // Scroll to first selected item
                if (i === 0) {
                    visibleCards[index].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, i * 200);
        });
        
        // Select the first one for try-on
        const firstSelected = visibleCards[Array.from(selectedIndices)[0]];
        selectedOutfit = firstSelected.dataset.outfit;
        updateTryOnDisplay();
        
        // Mark one as top pick (the first one)
        setTimeout(() => {
            firstSelected.classList.remove('auto-selected');
            firstSelected.classList.add('top-pick');
            firstSelected.classList.add('selected');
        }, 800);
        
        // Reset button
        matchBtn.textContent = '✨ Auto-Match Perfect Outfits';
        matchBtn.disabled = false;
        
        // Add AI messages
        setTimeout(() => {
            const topPickOutfit = outfits[selectedOutfit].name;
            addAssistantMessage('⭐', `AI Analysis Complete! "${topPickOutfit}" is your top match based on style preferences.`);
        }, 1000);
        
        setTimeout(() => {
            addAssistantMessage('✨', `We've selected ${numToSelect} perfect outfits for you. The top pick is already displayed on your avatar!`);
        }, 1500);
        
        setTimeout(() => {
            const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
            addAssistantMessage(randomSuggestion.icon, randomSuggestion.text);
        }, 2000);
    }, 1500);
});

// ===========================
// Style Assistant
// ===========================
const getSuggestion = document.getElementById('getSuggestion');
const assistantMessages = document.getElementById('assistantMessages');

getSuggestion.addEventListener('click', () => {
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    addAssistantMessage(randomSuggestion.icon, randomSuggestion.text);
});

function addAssistantMessage(icon, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <span class="message-icon">${icon}</span>
        <p>${text}</p>
    `;
    
    assistantMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
    
    // Limit messages to 10
    const messages = assistantMessages.querySelectorAll('.message');
    if (messages.length > 10) {
        messages[0].remove();
    }
}

// ===========================
// Social Share Buttons
// ===========================
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const platform = e.target.textContent.trim().split(' ')[1];
        
        // Simulate sharing
        const messages = [
            `Sharing to ${platform}... (Demo mode)`,
            `Your style has been shared to ${platform}! 📱`,
            `${platform} post created! (This is a demo)`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addAssistantMessage('📤', randomMessage);
        
        // Visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// ===========================
// Technical Challenges Collapsible
// ===========================
const challengesHeader = document.getElementById('challengesHeader');
const challengesContent = document.getElementById('challengesContent');

challengesHeader.addEventListener('click', () => {
    challengesHeader.classList.toggle('active');
    challengesContent.classList.toggle('active');
});

// ===========================
// Welcome Message on Load
// ===========================
window.addEventListener('load', () => {
    // Initialize with slim avatar displayed
    updateTryOnDisplay();
    
    setTimeout(() => {
        addAssistantMessage('👋', 'Welcome to AI Fashion Fitting Room! Start by selecting an outfit to try on.');
    }, 500);
});

// ===========================
// Additional Interactive Features
// ===========================

// Add hover effect for outfit cards with sound simulation
allOutfitCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('selected') && !card.classList.contains('top-pick')) {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('selected') && !card.classList.contains('top-pick')) {
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'S' for suggestion
    if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.metaKey) {
            getSuggestion.click();
        }
    }
    
    // Press 'M' for match
    if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.metaKey) {
            matchBtn.click();
        }
    }
});

// Add loading simulation for Match & Rank
matchBtn.addEventListener('click', function() {
    const originalText = this.textContent;
    this.textContent = '🔄 Analyzing...';
    this.disabled = true;
    
    setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
    }, 1500);
});

// Console Easter Egg
console.log('%c🎨 AI Fashion Fitting Room', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cThis is a concept demo. No actual AI processing occurs.', 'font-size: 12px; color: #6b7280;');
console.log('%cKeyboard shortcuts:\n  - Press "S" for style suggestion\n  - Press "M" for match & rank', 'font-size: 11px; color: #10b981;');
