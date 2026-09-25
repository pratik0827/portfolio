// ===== DOM ELEMENTS =====
const bootScreen = document.getElementById('boot-screen');
const bootText = document.getElementById('boot-text');
const terminalHistory = document.getElementById('terminal-history');
const commandInput = document.getElementById('command-input');
const terminalContent = document.getElementById('terminal-content');
const fileItems = document.querySelectorAll('.file');
const osWindow = document.querySelector('.os-window');
const windowHeader = document.querySelector('.window-header');
const btnClose = document.querySelector('.close');
const btnMinimize = document.querySelector('.minimize');
const btnMaximize = document.querySelector('.maximize');

const modeToggleBtn = document.getElementById('mode-toggle');
const modernUi = document.getElementById('modern-ui');
const terminalUi = document.getElementById('terminal-ui');
const toggleText = document.getElementById('toggle-text');
const projectsGrid = document.getElementById('projects-grid');

let isGeekMode = false;
let bootRan = false;
let fileSystem = {}; // Will be populated dynamically

// Fetch GitHub Repos and Populate Grid & Terminal
async function fetchAndRenderProjects() {
    try {
        const response = await fetch('https://api.github.com/users/pratik0827/repos?sort=updated');
        const repos = await response.json();
        
        // Filter out the portfolio repo if needed, or keep it. Let's just use all non-forks
        const validRepos = repos.filter(repo => !repo.fork);

        // Add Diet Own project manually
        validRepos.unshift({
            name: 'Diet Own',
            html_url: '#',
            description: 'A personalized diet tracking and meal planning application tailored specifically for my own fitness journey.',
            language: 'JavaScript',
            stargazers_count: 0
        });
        
        projectsGrid.innerHTML = ''; // Clear loading
        let terminalProjectsJsonStr = `{\n  <span class="format-json-key">"projects"</span>: [\n`;
        
        validRepos.forEach((repo, i) => {
            // Modern UI rendering
            const pDiv = document.createElement('div');
            pDiv.className = 'project-item';
            const lang = repo.language || 'Code';
            let techIcon = 'fas fa-code';
            if (lang === 'JavaScript' || lang === 'TypeScript') techIcon = 'fab fa-js';
            if (lang === 'Python') techIcon = 'fab fa-python';
            if (lang === 'HTML') techIcon = 'fab fa-html5';
            if (lang === 'CSS') techIcon = 'fab fa-css3';
            
            pDiv.innerHTML = `
                <h4><a href="` + repo.html_url + `" target="_blank">` + repo.name + `</a> <i class="fab fa-github"></i></h4>
                <p>` + (repo.description || 'No description provided.') + `</p>
                <div class='project-tech'>
                    <span class='tech-tag'><i class="` + techIcon + `"></i> ` + lang + `</span>
                    ` + (repo.stargazers_count > 0 ? `<span class='tech-tag'><i class="fas fa-star"></i> ` + repo.stargazers_count + `</span>` : '') + `
                </div>
            `;
            projectsGrid.appendChild(pDiv);
            
            // Terminal JSON string building
            terminalProjectsJsonStr += `    {\n      <span class="format-json-key">"name"</span>: <span class="format-json-string">"` + repo.name + `"</span>,\n      <span class="format-json-key">"language"</span>: <span class="format-json-string">"` + lang + `"</span>,\n      <span class="format-json-key">"description"</span>: <span class="format-json-string">"` + (repo.description ? repo.description.replace(/"/g, '\\"') : '') + `"</span>\n    }` + (i < validRepos.length - 1 ? ',' : '') + `\n`;
        });
        
        terminalProjectsJsonStr += `  ]\n}`;
        initFileSystem(terminalProjectsJsonStr);
        
    } catch (e) {
        projectsGrid.innerHTML = '<p>Error loading projects from GitHub.</p>';
        initFileSystem('{\n  <span class="format-error">"error": "Failed to fetch from GitHub"</span>\n}');
    }
}

function initFileSystem(projectsStr) {
    fileSystem = {
        'readme.md': `
<span class="format-h1"># Pratik Patil | Full Stack Developer</span>
<span class="format-text">Welcome to my interactive portfolio OS.</span>
<span class="format-text">Type <span class="format-json-string">'help'</span> to see available commands, or click files in the explorer on the left.</span>
<br>
<span class="format-h2">## About Me</span>
<span class="format-text">A Computer Science graduate building scalable backends, intuitive frontends, and intelligent desktop applications. I thrive on turning complex problems into elegant, efficient, and user-centric solutions.</span>
<br>
<span class="format-h2">## Quick Links</span>
<span class="format-text">- GitHub: <a class="format-link" href="https://github.com/pratik0827" target="_blank">github.com/pratik0827</a></span>
<span class="format-text">- LinkedIn: <a class="format-link" href="https://linkedin.com/in/pratik-patil-a42856409" target="_blank">linkedin.com/in/pratik-patil-a42856409</a></span>
        `,
        'about.txt': `
NAME: Pratik Patil
ROLE: Full Stack Developer & Innovator
EDUCATION: B.Sc. Computer Science (GPA: 8.80/10)
CERTIFICATION: Google Cloud Certified in Generative AI

TECHNICAL ARSENAL:
------------------
Languages:  Java, Python, JavaScript (ES6+), Rust, C++, C
Backend:    Node.js, .NET, Tauri, FastAPI, REST APIs
Frontend:   React, HTML5, CSS3, Tailwind CSS
Databases:  SQL, MySQL, TimescaleDB
Tools:      Git/GitHub, CI/CD
        `,
        'experience.log': `
[2026-06] Python Developer Intern @ Infotact Solutions
  > Developed and maintained Python scripts integrating 3rd-party REST APIs.
  > Implemented structured input validation and error handling.
  > Debugged integration issues & added logging for traceability.

[2026-07] Software Engineering Virtual Experience @ Walmart USA
  > Designed a simulated backend API to flag defective inventory items.
  > Applied validation logic and clear output formatting.
        `,
        'projects.json': projectsStr,
        'contact.sh': `
#!/bin/bash
echo "Initiating contact sequence..."

EMAIL="pratikpatil5846w@gmail.com"
PHONE="+91 8446354717"
LOCATION="Saphale, Palghar, Maharashtra"

echo "Select preferred method:"
echo "1) <a class="format-link" href="mailto:pratikpatil5846w@gmail.com">Send Email</a>"
echo "2) <a class="format-link" href="tel:8446354717">Call Phone</a>"

echo "Status: AWAITING_CONNECTION"
        `
    };
}

fetchAndRenderProjects();

// ===== MODE TOGGLE =====
modeToggleBtn.addEventListener('click', () => {
    isGeekMode = !isGeekMode;
    if (isGeekMode) {
        modernUi.classList.remove('active-mode');
        modernUi.classList.add('hidden-mode');
        terminalUi.classList.remove('hidden-mode');
        terminalUi.classList.add('active-mode');
        toggleText.innerText = "Modern UI";
        if (!bootRan) {
            bootRan = true;
            runBootSequence();
        }
    } else {
        terminalUi.classList.remove('active-mode');
        terminalUi.classList.add('hidden-mode');
        modernUi.classList.remove('hidden-mode');
        modernUi.classList.add('active-mode');
        toggleText.innerText = "Geek Mode";
    }
});


// ===== AUDIO EFFECTS =====
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playTypingSound() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300 + Math.random() * 200, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// ===== WINDOW DRAG & CONTROLS =====
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let windowX = 0;
let windowY = 0;

windowHeader.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-controls')) return;
    isDragging = true;
    dragOffsetX = e.clientX - windowX;
    dragOffsetY = e.clientY - windowY;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    windowX = e.clientX - dragOffsetX;
    windowY = e.clientY - dragOffsetY;
    osWindow.style.transform = "translate(" + windowX + "px, " + windowY + "px)";
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

btnClose.addEventListener('click', () => {
    osWindow.style.display = 'none';
    setTimeout(() => alert('You closed the OS! Refresh the page to reboot.'), 500);
});

btnMinimize.addEventListener('click', () => {
    osWindow.classList.toggle('minimized');
    osWindow.classList.remove('maximized');
});

btnMaximize.addEventListener('click', () => {
    osWindow.classList.toggle('maximized');
    osWindow.classList.remove('minimized');
    if (osWindow.classList.contains('maximized')) {
        osWindow.style.transform = 'translate(0px, 0px)';
    } else {
        osWindow.style.transform = "translate(" + windowX + "px, " + windowY + "px)";
    }
});

// ===== BOOT SEQUENCE =====
const bootLines = [
    "Initializing Boot Sequence...",
    "Loading Kernel... <span class='boot-success'>[OK]</span>",
    "Mounting Virtual File System... <span class='boot-success'>[OK]</span>",
    "Loading Display Drivers... <span class='boot-success'>[OK]</span>",
    "Starting User Interface... <span class='boot-success'>[OK]</span>",
    "Establishing Neural Link... <span class='boot-warn'>[WARNING: Unstable]</span>",
    "Bypassing Security Protocols... <span class='boot-success'>[ACCESS GRANTED]</span>",
    "Welcome to Pratik-OS v1.0"
];

async function runBootSequence() {
    bootScreen.style.display = 'flex';
    bootScreen.style.opacity = '1';
    for (let i = 0; i < bootLines.length; i++) {
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.innerHTML = bootLines[i];
        bootText.appendChild(line);
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
    }
    
    setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            commandInput.focus();
            executeCommand('cat readme.md', false);
        }, 1000);
    }, 500);
}

// ===== TERMINAL LOGIC =====
let cmdHistory = [];
let historyIdx = -1;

commandInput.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Tab') {
        playTypingSound();
    }

    if (e.key === 'Enter') {
        const command = this.value.trim();
        if (command) {
            cmdHistory.push(command);
            historyIdx = cmdHistory.length;
            executeCommand(command, true);
        }
        this.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIdx > 0) {
            historyIdx--;
            this.value = cmdHistory[historyIdx];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx < cmdHistory.length - 1) {
            historyIdx++;
            this.value = cmdHistory[historyIdx];
        } else {
            historyIdx = cmdHistory.length;
            this.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        handleAutocomplete(this);
    }
});

function handleAutocomplete(inputElement) {
    const val = inputElement.value;
    const parts = val.split(' ');
    const commands = ['help', 'ls', 'cat', 'clear', 'whoami', 'date', 'echo', 'theme', 'resume', 'sudo', 'rm'];
    const files = Object.keys(fileSystem);

    if (parts.length === 1) {
        const match = commands.find(c => c.startsWith(parts[0].toLowerCase()));
        if (match) inputElement.value = match + ' ';
    } else if (parts.length === 2 && parts[0].toLowerCase() === 'cat') {
        const match = files.find(f => f.startsWith(parts[1].toLowerCase()));
        if (match) inputElement.value = 'cat ' + match;
    }
}

function executeCommand(commandStr, echo = true) {
    const args = commandStr.split(' ');
    const cmd = args[0].toLowerCase();

    if (echo) {
        const echoLine = document.createElement('div');
        echoLine.className = 'cmd-echo';
        echoLine.innerHTML = "<span class='prompt'>guest@pratik-os:~$</span>" + commandStr;
        terminalHistory.appendChild(echoLine);
    }

    let output = '';

    switch(cmd) {
        case 'help':
            output = `
Available commands:
  <span class="format-json-string">help</span>     - Show this help message
  <span class="format-json-string">ls</span>       - List directory contents
  <span class="format-json-string">cat</span>      - Read file contents (e.g., cat about.txt)
  <span class="format-json-string">clear</span>    - Clear the terminal screen
  <span class="format-json-string">whoami</span>   - Print current user
  <span class="format-json-string">date</span>     - Show current system date and time
  <span class="format-json-string">echo</span>     - Print arguments to standard output
  <span class="format-json-string">theme</span>    - Change terminal theme (dracula, hacker, ubuntu)
  <span class="format-json-string">resume</span>   - Download my resume
  <span class="format-json-string">sudo</span>     - Run command as superuser
  <span class="format-json-string">rm</span>       - Remove files or directories
            `;
            break;
        case 'ls':
            output = Object.keys(fileSystem).join('    ');
            break;
        case 'cat':
            if (args.length < 2) {
                output = '<span class="format-error">cat: missing file operand</span>';
            } else {
                const fileName = args[1];
                if (fileSystem[fileName]) {
                    output = fileSystem[fileName];
                    setActiveFile(fileName);
                } else {
                    output = "<span class='format-error'>cat: " + fileName + ": No such file or directory</span>";
                }
            }
            break;
        case 'clear':
            terminalHistory.innerHTML = '';
            return;
        case 'whoami':
            output = 'guest';
            break;
        case 'date':
            output = new Date().toString();
            break;
        case 'echo':
            output = args.slice(1).join(' ');
            break;
        case 'theme':
            const newTheme = args[1];
            if (newTheme === 'hacker') {
                document.body.className = 'theme-hacker';
                output = '<span class="format-success">Theme set to: hacker</span>';
            } else if (newTheme === 'ubuntu') {
                document.body.className = 'theme-ubuntu';
                output = '<span class="format-success">Theme set to: ubuntu</span>';
            } else if (newTheme === 'dracula') {
                document.body.className = '';
                output = '<span class="format-success">Theme set to: dracula</span>';
            } else {
                output = '<span class="format-error">Usage: theme [dracula|hacker|ubuntu]</span>';
            }
            break;
        case 'resume':
            output = '<span class="format-success">Preparing resume download...</span>';
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Pratik Patil Resume\n\nContact: pratikpatil5846w@gmail.com\n\n(This is a placeholder. Replace this file with your actual PDF resume later!)');
                a.download = 'Pratik_Patil_Resume.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, 1000);
            break;
        case 'rm':
            if (args.includes('-rf') && args.includes('/')) {
                output = '<span class="format-error">Nice try! But I am not letting you delete my portfolio. 😅</span>';
            } else {
                output = "<span class='format-error'>rm: cannot remove '" + (args[1] || '') + "': Permission denied</span>";
            }
            break;
        case 'sudo':
            output = '<span class="format-error">guest is not in the sudoers file. This incident will be reported to Pratik.</span>';
            break;
        default:
            output = "<span class='format-error'>" + cmd + ": command not found</span>";
    }

    printOutput(output);
}

function printOutput(htmlString) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output-line';
    outputDiv.innerHTML = htmlString + '<br><br>';
    terminalHistory.appendChild(outputDiv);
    
    // Auto scroll to bottom
    setTimeout(() => {
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }, 10);
}

// ===== SIDEBAR LOGIC =====
function setActiveFile(fileName) {
    fileItems.forEach(item => {
        if (item.dataset.file === fileName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

fileItems.forEach(item => {
    item.addEventListener('click', () => {
        const fileName = item.dataset.file;
        commandInput.value = "cat " + fileName;
        executeCommand("cat " + fileName, true);
        commandInput.focus();
    });
});

// Ensure clicking anywhere in terminal focuses input
terminalContent.addEventListener('click', () => {
    if (window.getSelection().toString() === '') {
        commandInput.focus();
    }
});

