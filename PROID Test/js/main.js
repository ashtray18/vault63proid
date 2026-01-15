document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Animated Stat Counters (Recount on Every Scroll) ---
    const counters = document.querySelectorAll('.stat-counter');
    const speed = 200; // The lower the slower
    const animatedCounters = new Set(); // Track which counters are currently animating

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const statItem = counter.closest('.stat-item');
        
        // Prevent multiple simultaneous animations
        if (animatedCounters.has(counter)) return;
        animatedCounters.add(counter);
        
        // Add animation effect
        if (statItem) statItem.classList.add('animate');
        
        counter.innerText = '0';
        const updateCount = () => {
            const count = +counter.innerText;
            const inc = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target.toLocaleString();
                // Remove animation class after animation completes
                setTimeout(() => {
                    if (statItem) statItem.classList.remove('animate');
                    animatedCounters.delete(counter);
                }, 600);
            }
        };
        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // --- Animate Elements on Scroll ---
    const scrollElements = document.querySelectorAll('.v-timeline-item, .card');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    scrollElements.forEach(el => {
        el.classList.add('scroll-on-view');
        scrollObserver.observe(el);
    });

    // --- Enhanced Timeline Interactivity ---
    const timelineItems = document.querySelectorAll('.v-timeline-item');
    const timelineContainer = document.querySelector('.v-timeline-container');
    
    // Scroll reveal effect for timeline
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.3 });
    timelineItems.forEach(item => timelineObserver.observe(item));

    // Interactive highlight on hover
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            timelineItems.forEach(i => i.style.opacity = '0.5');
            this.style.opacity = '1';
        });
        item.addEventListener('mouseleave', function() {
            timelineItems.forEach(i => i.style.opacity = '1');
        });
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        if (timelineContainer) {
            const scrollPosition = window.scrollY;
            const containerRect = timelineContainer.getBoundingClientRect();
            const containerCenter = window.innerHeight / 2;
            
            timelineItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const distance = itemRect.top - containerCenter;
                const opacity = 1 - Math.abs(distance) / (window.innerHeight * 0.8);
                item.style.opacity = Math.max(0.3, opacity);
            });
        }
    });

    // --- Modal Logic ---
    const allModals = document.querySelectorAll('.modal');
    // Open timeline modals
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
        });
    });
    // Open story modal
    document.querySelectorAll('#story-cta-btn, #story-share-btn-main').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('story-modal').style.display = 'block';
        });
    });
    // Close modals
    allModals.forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // --- Tabbed Content for Pillars Section ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetTab = button.getAttribute('data-tab');
            tabPanes.forEach(pane => {
                if (pane.id === targetTab) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // --- Filterable Gallery Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Story Form Submission ---
    const storyForm = document.getElementById('story-form');
    storyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for sharing your story! (This is a demo and data was not submitted)');
        document.getElementById('story-modal').style.display = 'none';
        storyForm.reset();
    });

    // --- AI Assistant Chatbot ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // NP-specific knowledge base
    const npContext = `You are the NP (Ngee Ann Polytechnic) Assistant. You help visitors to the NP Memory Lane website.
Key facts about NP:
- Founded in 1963 by the Ngee Ann Kongsi
- Originally called Ngee Ann College, renamed to Ngee Ann Polytechnic in 1982
- Located in Singapore
- Offers 40+ academic courses
- Has graduated over 200,000 students
- Facilities include: Innovation Hub, Sports Complex, Lien Ying Chow Library, Auditorium, Modern Labs
- Pillars of Excellence: Innovation & Technology, Student Life & Culture, Community Impact
- Website: www.np.edu.sg

Keep responses concise, friendly, and helpful. If asked about NP, provide accurate information from above. For general questions, be helpful but redirect to NP topics when possible.`;

    function addMessageToChat(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
        const p = document.createElement('p');
        p.textContent = message;
        messageDiv.appendChild(p);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message typing-indicator';
        messageDiv.id = 'typing-indicator';
        const p = document.createElement('p');
        p.innerHTML = '<span></span><span></span><span></span>';
        messageDiv.appendChild(p);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    async function getAIResponse(userMessage) {
        try {
            // Using Open-Meteo's free API structure, but with a fallback to a working free service
            // We'll use the Hugging Face Inference API with a free model
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: {
                        text: userMessage,
                        past_user_inputs: [],
                        generated_responses: []
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.generated_text) {
                    return data.generated_text;
                }
            }

            // Fallback: Return contextual response from knowledge base
            return getContextualResponse(userMessage);
        } catch (error) {
            console.log('API call failed, using fallback responses');
            return getContextualResponse(userMessage);
        }
    }

    function getContextualResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // NP-specific responses
        if (lowerMessage.includes('history') || lowerMessage.includes('founded')) {
            return 'Ngee Ann Polytechnic was founded in 1963 by the Ngee Ann Kongsi. It started as Ngee Ann College and was renamed to Ngee Ann Polytechnic in 1982, marking its evolution into a premier polytechnic institution.';
        }
        if (lowerMessage.includes('course') || lowerMessage.includes('program') || lowerMessage.includes('diploma')) {
            return 'NP offers over 40 academic courses across various disciplines including Engineering, Business, Information Technology, Health and Social Sciences, Design, and Applied Science. Each program is designed to prepare students for real-world career success.';
        }
        if (lowerMessage.includes('facility') || lowerMessage.includes('campus')) {
            return 'NP features state-of-the-art facilities including: Innovation Hub with modern labs, Sports Complex, Lien Ying Chow Library, Professional Auditorium, and contemporary learning spaces equipped with the latest technology.';
        }
        if (lowerMessage.includes('vr') || lowerMessage.includes('virtual reality') || lowerMessage.includes('360')) {
            return 'Our VR Experience section offers 360-degree immersive videos of NP\'s historic landmarks including the Grand Hall, Library, Innovation Hub, Canteen, Auditorium, and Sports Complex. Check it out!';
        }
        if (lowerMessage.includes('library') || lowerMessage.includes('lien ying chow')) {
            return 'The Lien Ying Chow Library is a heritage wing at NP serving as a sanctuary of knowledge and hub of student life. It houses extensive collections and provides modern learning spaces for all students.';
        }
        if (lowerMessage.includes('student') || lowerMessage.includes('life') || lowerMessage.includes('cca')) {
            return 'Student life at NP is vibrant and dynamic! With numerous Co-Curricular Activities (CCAs) spanning sports, arts, and special interest groups, students develop leadership skills and form lifelong friendships while pursuing their academic goals.';
        }
        if (lowerMessage.includes('graduate') || lowerMessage.includes('alumni')) {
            return 'NP has graduated over 200,000 students since 1963. Our alumni are successfully working across various industries worldwide, contributing to society and maintaining strong connections with the polytechnic community.';
        }
        if (lowerMessage.includes('contact') || lowerMessage.includes('website') || lowerMessage.includes('email')) {
            return 'For more information, please visit www.np.edu.sg or www.np.edu.sg/library for the library portal. You can find contact details and specific department information on the main website.';
        }
        if (lowerMessage.includes('pillar') || lowerMessage.includes('excellence') || lowerMessage.includes('value')) {
            return 'Our three Pillars of Excellence are: 1) Innovation & Technology - pioneering education through cutting-edge learning, 2) Student Life & Culture - fostering holistic development, and 3) Community Impact - giving back to society through meaningful service.';
        }
        
        // Default helpful response
        return 'I\'m the NP Assistant! I can help you with information about NP\'s history, courses, facilities, VR tours, student life, and more. What would you like to know about Ngee Ann Polytechnic?';
    }

    async function handleChatSubmit() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return;

        addMessageToChat(userMessage, true);
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        chatbotSend.disabled = true;

        showTypingIndicator();

        try {
            const botResponse = await getAIResponse(userMessage);
            removeTypingIndicator();
            addMessageToChat(botResponse, false);
        } catch (error) {
            removeTypingIndicator();
            addMessageToChat('I encountered an issue processing your request. Please try again.', false);
        } finally {
            chatbotInput.disabled = false;
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }
    }

    chatbotToggle.addEventListener('click', () => {
        chatbotWidget.classList.toggle('hidden');
        chatbotToggle.classList.toggle('hidden');
        if (!chatbotWidget.classList.contains('hidden')) {
            chatbotInput.focus();
        }
    });

    chatbotMinimize.addEventListener('click', () => {
        chatbotWidget.classList.add('hidden');
        chatbotToggle.classList.remove('hidden');
    });

    chatbotSend.addEventListener('click', handleChatSubmit);

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !chatbotSend.disabled) {
            handleChatSubmit();
        }
    });

});