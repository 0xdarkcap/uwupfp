<script>
    import { onMount, onDestroy } from 'svelte';
    import { activeWindows, openWindow, restoreWindow, focusWindow } from '$lib/stores/os.js';

    let startMenuOpen = $state(false);
    let time = $state('');
    let clockInterval;

    const apps = [
        { id: 'pfp-app', title: 'PFP Maker', icon: '🎨', w: 400, h: 300 },
        { id: 'jspaint', title: 'JS Paint', icon: '🖌️', w: 800, h: 600 }
    ];

    onMount(() => {
        const updateTime = () => {
            time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        updateTime();
        clockInterval = setInterval(updateTime, 1000);
    });

    onDestroy(() => {
        if (clockInterval) clearInterval(clockInterval);
    });

    const toggleStartMenu = () => startMenuOpen = !startMenuOpen;
    const closeMenu = () => startMenuOpen = false;

    const launchApp = (app) => {
        openWindow(app.id, app.title, app.w, app.h);
        startMenuOpen = false;
    };

    const handleTaskbarClick = (win) => {
        if (win.isMinimized) {
            restoreWindow(win.id);
        } else {
            focusWindow(win.id);
        }
    };
</script>

{#if startMenuOpen}
    <div class="start-menu-backdrop" onclick={closeMenu}></div>
{/if}

<div class="taskbar">
    <button 
        class="start-button {startMenuOpen ? 'active' : ''}" 
        onclick={toggleStartMenu}
    >
        <span class="windows-logo">⊞</span> Start
    </button>

    <div class="taskbar-apps">
        {#each $activeWindows as win}
            {#if win.isOpen}
                <button 
                    class="taskbar-app-btn {win.isMinimized ? '' : 'active'}" 
                    onclick={() => handleTaskbarClick(win)}
                >
                    {win.title}
                </button>
            {/if}
        {/each}
    </div>

    <div class="system-tray">
        <span class="clock">{time}</span>
    </div>

    {#if startMenuOpen}
        <div class="start-menu">
            <div class="start-menu-sidebar">
                <span>Windows 98</span>
            </div>
            <div class="start-menu-items">
                {#each apps as app}
                    <button class="start-item" onclick={() => launchApp(app)}>
                        <span class="icon">{app.icon}</span>
                        {app.title}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .taskbar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 35px;
        background: #c0c0c0;
        border-top: 2px solid #ffffff;
        display: flex;
        align-items: center;
        padding: 2px;
        box-sizing: border-box;
        z-index: 9999;
    }

    .start-button {
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: bold;
        font-size: 1rem;
        padding: 4px 8px;
        margin-right: 5px;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #000000 #000000 #ffffff;
        cursor: pointer;
    }

    .start-button.active, .start-button:active {
        border-color: #000000 #ffffff #ffffff #000000;
        background: #e0e0e0;
    }

    .windows-logo {
        color: #000;
        font-size: 1.2rem;
    }

    .taskbar-apps {
        flex-grow: 1;
        display: flex;
        gap: 4px;
        overflow-x: hidden;
    }

    .taskbar-app-btn {
        background: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #000000 #000000 #ffffff;
        padding: 4px 10px;
        font-size: 0.85rem;
        font-weight: bold;
        cursor: pointer;
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Pushed in state for open windows */
    .taskbar-app-btn.active {
        border-color: #000000 #ffffff #ffffff #000000;
        background: #d3d3d3;
        background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, #c0c0c0 2px, #c0c0c0 4px);
    }

    .system-tray {
        padding: 4px 10px;
        border: 2px solid;
        border-color: #000000 #ffffff #ffffff #000000;
        margin-left: 5px;
        display: flex;
        align-items: center;
    }

    .clock {
        font-size: 0.85rem;
    }

    .start-menu-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9998;
    }

    /* PC Desktop Start Menu */
    .start-menu {
        position: absolute;
        bottom: 35px;
        left: 0;
        width: 250px;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #000000 #000000 #ffffff;
        display: flex;
        flex-direction: row;
        z-index: 10000;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
    }

    .start-menu-sidebar {
        width: 30px;
        background: #000080; /* Classic Win98 blue gradient */
        background: linear-gradient(to bottom, #000080, #1084d0);
        display: flex;
        align-items: flex-end;
        padding-bottom: 5px;
    }

    .start-menu-sidebar span {
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        padding: 10px 5px;
        letter-spacing: 1px;
    }

    .start-menu-items {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 2px;
    }

    .start-item {
        display: flex;
        align-items: center;
        gap: 10px;
        background: transparent;
        border: none;
        padding: 10px;
        text-align: left;
        font-size: 1rem;
        cursor: pointer;
        width: 100%;
    }

    .start-item:hover {
        background: #000080;
        color: white;
    }

    .start-item .icon {
        font-size: 1.5rem;
    }

    /* =========================================
       MOBILE APP GRID OVERRIDE
       ========================================= */
    @media (max-width: 768px) {
        .taskbar-apps {
            display: none; /* Hide window queue on mobile completely */
        }

        .start-menu {
            /* Transform into a full-screen app grid */
            flex-direction: column;
            width: 100vw;
            height: calc(100vh - 35px); /* Take up everything except the taskbar */
            bottom: 35px;
            left: 0;
            background: #008080; /* Match desktop background */
            border: none;
            box-shadow: none;
        }

        .start-menu-sidebar {
            display: none; /* Hide the sidebar branding */
        }

        .start-menu-items {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: flex-start;
            gap: 20px;
            padding: 20px;
        }

        .start-item {
            flex-direction: column;
            width: 80px;
            text-align: center;
            color: white;
            padding: 5px;
        }

        .start-item:hover {
            background: transparent;
        }

        .start-item .icon {
            font-size: 3rem;
            margin-bottom: 5px;
        }
    }
</style>