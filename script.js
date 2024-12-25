class MatrixEffect {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.initialize();
    }

    initialize() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
        
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        requestAnimationFrame(() => this.animate());
    }
}

// Terminal Class
class Terminal {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.commandHistory = [];
        this.historyIndex = -1;
        this.startBootSequence();
        this.setupMobileOptimizations();
    }

    initializeElements() {
        this.terminal = document.querySelector('.terminal');
        this.output = document.querySelector('.output');
        this.input = document.getElementById('commandInput');
        this.bootSequence = document.querySelector('.boot-sequence');
        this.projectDemo = document.querySelector('.project-demo-container');
    }

    async startBootSequence() {
        const bootMessages = [
            { text: 'Initializing system kernel...', delay: 500,},
            { text: 'Loading terminal modules...', delay: 400 },
            { text: 'Configuring neural interface...', delay: 300 },
            { text: 'System ready. Welcome to PranavDOS 3.0', delay: 500 },
            { text: 'Type help to check out for all details!', delay: 300 }
        ];

        this.input.disabled = true;
        for (const message of bootMessages) {
            await this.typeWriter(message.text, message.delay);
        }
        this.input.disabled = false;
        this.input.focus();
    }

    async typeWriter(text, delay = 50) {
        const p = document.createElement('p');
        p.style.color = '#0F0'; // Set text color to green
        this.bootSequence.appendChild(p);
        
        for (const char of text) {
            p.textContent += char;
            await this.sleep(30);
        }
        await this.sleep(delay);
    }
    

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        document.querySelector('.clear-btn')?.addEventListener('click', () => this.clearTerminal());
    }

    setupMobileOptimizations() {
        // Prevent zoom on input focus for mobile devices
        this.input.addEventListener('focus', (e) => {
            if (window.innerWidth < 768) {
                document.body.style.fontSize = '16px';
            }
        });

        // Handle mobile keyboard appearance
        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                const viewportHeight = window.innerHeight;
                this.terminal.style.height = `${viewportHeight * 0.95}px`;
            }
        });

        // Improve touch scrolling
        this.output.style.webkitOverflowScrolling = 'touch';
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.executeCommand(command);
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory('down');
        }
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down') {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
        }
    }

    async executeCommand(command) {
        const output = document.createElement('div');
        output.className = 'command-output';
        output.innerHTML = `<span class="prompt">&gt;</span> ${command}<br>`;
        
        const response = await this.processCommand(command);
        this.input.disabled = true;
        this.input.disabled = false;
        this.input.focus();
        output.innerHTML += response;
        
        this.output.appendChild(output);
        this.output.scrollTop = this.output.scrollHeight;


    }

    async processCommand(command) {
        const cmd = command.toLowerCase();
        const commands = {
            help: this.showHelp,
            skills: this.showSkills,
            projects: this.showProjects,
            contact: this.showContact,
            clear: () => this.clearTerminal(),
            about: this.showAbout,
            theme: (color) => this.changeTheme(color),
            education: this.showEducation,
            achievements: this.showAchievements,
        };

        const [mainCommand, ...args] = cmd.split(' ');
        if (commands[mainCommand]) {
            return await commands[mainCommand].apply(this, args);
        }
        return this.generateSimilarCommands(mainCommand);
    }


    showHelp() {
        return `<br>
<span class="cmd-header">Available Commands:</span><br>
<span class="cmd-name">help</span> <span class="cmd-desc">- Show this help message</span><br>
<span class="cmd-name">about</span> <span class="cmd-desc">- About me</span><br>
<span class="cmd-name">skills</span> <span class="cmd-desc">- View my technical skills</span><br>
<span class="cmd-name">projects</span> <span class="cmd-desc">- View my projects</span><br>
<span class="cmd-name">education</span> <span class="cmd-desc">- View my education</span><br>
<span class="cmd-name">achievements</span> <span class="cmd-desc">- View my achievements</span><br>
<span class="cmd-name">contact</span> <span class="cmd-desc">- Get my contact information</span><br>
<span class="cmd-name">theme [color]</span> <span class="cmd-desc">- Change terminal color (blue/green/orange/purple)</span><br>
<span class="cmd-name">clear</span> <span class="cmd-desc">- Clear the terminal</span><br>
`;
    }

    showAbout() {
        return `<br>
<span class="cmd-header">About Me:</span><br>
I'm Pranav Dharwadkar, a passionate <span class="highlight">ML Developer</span>, <span class="highlight">DevOps Practitioner</span>, and <span class="highlight">IT Enthusiast</span>, committed to crafting innovative and scalable solutions.<br>
I am proficient in <span class="highlight">Python</span>, <span class="highlight">Java</span>, and <span class="highlight">C++</span>, with hands-on experience in both <span class="highlight">frontend</span> and <span class="highlight">backend development</span>.<br>
I specialize in <span class="highlight">machine learning</span>, <span class="highlight">data analytics</span>, and <span class="highlight">automation workflows</span>.<br>
I have developed <span class="highlight">AI-powered mental health platforms</span> and created <span class="highlight">recommendation systems</span> and <span class="highlight">predictive analytics</span> solutions with a strong real-world focus.<br>
I am driven by a passion for learning and solving challenging problems.<br>
My goal is to build efficient systems that blend creativity and technology for impactful results.<br>
I'm excited to collaborate and push the boundaries of innovation!<br>
`;
    }

    showSkills() {
        return `<br>
<span class="cmd-header">Technical Skills:</span><br>

<span class="skill-category">Programming Languages:</span><br>
<span class="skill-item">• Python</span><br>
<span class="skill-item">• Java</span><br>
<span class="skill-item">• C++</span><br>

<span class="skill-category">Frontend Development:</span><br>
<span class="skill-item">• React.js</span><br>
<span class="skill-item">• Tailwind CSS</span><br>
<span class="skill-item">• Responsive Design</span><br>

<span class="skill-category">Backend Development:</span><br>
<span class="skill-item">• Node.js</span><br>
<span class="skill-item">• Express.js</span><br>
<span class="skill-item">• MongoDB</span><br>
<span class="skill-item">• SQL</span><br>
<span class="skill-item">• RESTful APIs</span><br>

<span class="skill-category">Machine Learning:</span><br>
<span class="skill-item">• TensorFlow</span><br>
<span class="skill-item">• MatplotLib</span><br>
<span class="skill-item">• Numpy</span><br>
<span class="skill-item">• Pandas</span><br>
<span class="skill-item">• Scikit-learn</span><br>
<span class="skill-item">• Data Analysis</span><br>
<span class="skill-item">• Neural Networks</span><br>

<span class="skill-category">Machine Learning Models:</span><br>
<span class="skill-item">• Linear Regression</span><br>
<span class="skill-item">• Random Forest</span><br>
<span class="skill-item">• Logistic Regression</span><br>
<span class="skill-item">• LSTM</span><br>
<span class="skill-item">• Collaborative and Content Based Filtering</span><br>

<span class="skill-category">Tools & Others:</span><br>
<span class="skill-item">• Git & GitHub</span><br>
<span class="skill-item">• Canva</span><br>
<span class="skill-item">• Figma</span><br>
<span class="skill-item">• Oracle</span><br>
`;
    }

    showProjects() {
        return `<br>
<span class="cmd-header">Featured Projects:</span><br>
<br>
<span class="project-title">1. NIRVANA AI</span><br>
<span class="project-desc">• Mental health support system using <span class="highlight">Google Gemini Generative AI</span></span><br>
<span class="project-desc">• Built during <span class="highlight">Google Generative AI Hackathon 2024</span></span><br>

<span class="project-title">2. Advanced Recommendation System</span><br>
<span class="project-desc">• <span class="highlight">Machine learning</span>-based recommendation engine</span><br>
<span class="project-desc">• <span class="highlight">Collaborative filtering</span> for movies, music, and books</span><br>

<span class="project-title">3. Stock Market Predictor</span><br>
<span class="project-desc">• <span class="highlight">LSTM</span>-based time series forecasting</span><br>
<span class="project-desc">• Real-time market data analysis</span><br>

<span class="project-title">4. Apooch - Pet Care App</span><br>
<span class="project-desc">• <span class="highlight">Flutter</span>-based mobile application</span><br>
<span class="project-desc">• <span class="highlight">ML</span>-powered pet health monitoring</span><br>
`;
    }

    changeTheme(color) {
        const themes = {
            blue: { primary: '#00aaff', bg: '#001824' },
            green: { primary: '#00ff00', bg: '#001100' },
            orange: { primary: '#ffa500', bg: '#241800' },
            purple: { primary: '#ff00ff', bg: '#240024' }
        };

        if (themes[color]) {
            document.documentElement.style.setProperty('--terminal-color', themes[color].primary);
            document.documentElement.style.setProperty('--terminal-bg', themes[color].bg);
            return `Theme changed to ${color}`;
        }
        return `Available themes: ${Object.keys(themes).join(', ')}`;
    }

    configureMatrix(param, value) {
        const matrixEffect = document.querySelector('.matrix-background');
        if (!param) {
            return 'Usage: matrix [speed|color|density] value';
        }
        // Matrix configuration implementation
        return `Matrix ${param} updated to ${value}`;
    }

    showContact() {
        return `<br>
<span class="cmd-header">Contact Information:</span><br>

📧 Email: pranav.djsce24@gmail.com<br>
🔗 LinkedIn: linkedin.com/in/pranav-dharwadkar-7051b4293<br>
💻 GitHub: github.com/Pranaavvvv<br>
📱 Phone: +91 7977019432<br>

Feel free to reach out! I'm always open to new opportunities and collaborations.<br>
`;
    }

    showAchievements() {
        return `<br>
<span class="cmd-header">Featured Achievements:</span><br>
<span class="achievement-item">• <span class="highlight">AKS EDUCATION's ICSE SCHOOL TOPPERS AWARD</span></span><br>
<span class="achievement-item">• <span class="highlight">MHTCET - 98.07%ile</span></span><br>
`;
    }

    generateSimilarCommands(command) {
        const allCommands = ['help', 'skills', 'projects', 'contact', 'about', 'demo', 'theme', 'matrix', 'clear'];
        const similar = allCommands.filter(cmd => this.levenshteinDistance(command, cmd) <= 2);
        
        if (similar.length > 0) {
            return `Command not found. Did you mean: ${similar.join(', ')}?`;
        }
        return `Command not found. Type 'help' for available commands.`;
    }
    showEducation() {
        return `<br>
<span class="cmd-header">Education Information:</span><br>

<span class="edu-institution">SVKM's Dwarkadas Jivanlal Sanghvi College of Engineering</span><br>
<span class="edu-degree">B.Tech In Information Technology</span><br>
<span class="edu-grade">CGPA: <span class="highlight">9.33</span></span><br>
<span class="edu-date">Expected May 2027</span><br><br>

<span class="edu-institution">Royal Junior College Of  Science Commerce And Arts</span><br>
<span class="edu-degree">HSC</span><br>
<span class="edu-grade">Percentage: <span class="highlight">80%</span></span><br>
<span class="edu-date">May 2023</span><br><br>

<span class="edu-institution">Guardian School</span><br>
<span class="edu-degree">ICSE</span><br>
<span class="edu-grade">Percentage: <span class="highlight">98.20%</span></span><br>
<span class="edu-date">April 2021</span><br>
`;
    }


    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j - 1][i] + 1,
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    clearTerminal() {
        this.output.innerHTML = '';
        return '';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MatrixEffect();
    const terminal = new Terminal();
    window.terminal = terminal;
});
