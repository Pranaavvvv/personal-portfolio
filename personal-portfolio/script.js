// Matrix rain effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = new Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

// Terminal functionality
const outputDiv = document.querySelector('.output');
const commandInput = document.getElementById('commandInput');
const clearBtn = document.querySelector('.clear-btn');

let commandHistory = [];
let historyIndex = -1;

const commands = {
    help: () => `
        <span class="cmd-header">Available commands:</span><br>
        <span class="cmd">help</span> - <span class="cmd-desc">List all commands</span><br>
        <span class="cmd">info</span> - <span class="cmd-desc">Show info about me</span><br>
        <span class="cmd">skills</span> - <span class="cmd-desc">List my skills</span><br>
        <span class="cmd">resume</span> - <span class="cmd-desc">View my resume</span><br>
        <span class="cmd">Education</span> - <span class="cmd-desc">View my Education</span><br>
        <span class="cmd">Achievements</span> - <span class="cmd-desc">View my Achievements</span><br>
        <span class="cmd">Projects</span> - <span class="cmd-desc">View my Projects</span><br>
        <span class="cmd">Extracurriculars</span> - <span class="cmd-desc">View my Extracurriculars</span><br>
        <span class="cmd">contact</span> - <span class="cmd-desc">Get in touch with me</span><br>
        <span class="cmd">theme [color]</span> - <span class="cmd-desc">Change the terminal color theme (blue, green, orange)</span><br>
        <span class="cmd">clear</span> - <span class="cmd-desc">Clear the terminal output</span><br>
    `,
    skills: () => `
        <span class="cmd-header">Skills:</span><br>
        <span class="cmd">Frontend</span> - <span class="cmd-desc">JavaScript, HTML, CSS</span><br>
        <span class="cmd">Backend</span> - <span class="cmd-desc">Node.js, Express.js, MongoDB</span><br>
        <span class="cmd">Frameworks</span> - <span class="cmd-desc">React.js, Vue.js, Angular</span><br>
        <span class="cmd">Libraries</span> - <span class="cmd-desc">Bootstrap, Tailwind CSS</span><br>
    `,
    resume: () => `
        <div class="cmd-output">
            <span class="cmd-title">📄 Download My Resume:</span><br>
            <a href="resume.pdf" target="_blank" class="cmd-link">Click here to download my resume</a>
        </div>
    `,
    contact: () => `
        <div class="cmd-output">
            <span class="cmd-title">📞 Contact Information:</span><br>
            📧 Email: <a href="mailto:pranav.djsce24@gmail.com">pranav.djsce24@gmail.com</a><br>
            📞 Phone: +91 7977019432<br>
            💻 LinkedIn: <a href="https://www.linkedin.com/in/pranav-dharwadkar-7051b4293/" target="_blank" class="cmd-link">LinkedIn</a><br>
            🌐 GitHub: <a href="https://github.com/Pranaavvvv" target="_blank" class="cmd-link">GitHub</a><br>
        </div>
    `,
    theme: (color) => {
        const colors = {
            blue: '#00aaff',
            green: '#00ff00',
            orange: '#ffa500'
        };
        if (colors[color]) {
            document.documentElement.style.setProperty('--terminal-color', colors[color]);
            return `Theme changed to ${color}`;
        }
        return 'Available themes: blue, green, orange';
    },
    clear: () => {
        outputDiv.innerHTML = '';
        return '';
    },
};

function addOutput(command, output) {
    const p = document.createElement('p');
    p.innerHTML = `&gt; ${command}<br>${output}`;
    outputDiv.appendChild(p);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

function runCommand(commandLine) {
    const args = commandLine.split(' ');
    const command = args.shift().toLowerCase();
    const output = commands[command]
        ? commands[command](...args)
        : `Command not found: "<span class="cmd-not-found">${command}</span>". Type <span class="cmd-highlight">help</span> for available commands.`;
    addOutput(commandLine, output);
}

commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const commandLine = commandInput.value.trim();
        if (commandLine) {
            runCommand(commandLine);
            commandHistory.push(commandLine); // Save to history
            historyIndex = commandHistory.length; // Reset history index
        }
        commandInput.value = '';
    } else if (event.key === 'ArrowUp') {
        // Go to previous command
        if (historyIndex > 0) {
            historyIndex--;
            commandInput.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        // Go to the next command
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = commandHistory[historyIndex];
        } else {
            commandInput.value = '';
        }
    }
});

clearBtn.addEventListener('click', () => {
    outputDiv.innerHTML = '';
});

