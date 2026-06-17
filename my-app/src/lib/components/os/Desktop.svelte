<script>
    import { onMount } from 'svelte';
    import { activeWindows, openWindow } from '$lib/stores/os.js';
    import Window from './Window.svelte';
    import PfpMaker from './PfpMaker.svelte'; 
    import Taskbar from './Taskbar.svelte';
    import MinesweeperApp from './MinesweeperApp.svelte';
    import PrivateersApp from './PrivateersApp.svelte';
    import NotepadApp from './NotepadApp.svelte';
    import UwUSidebar from './UwUSidebar.svelte';

    const launchPfpApp = () => {
        // Boost size to 720x480 for better layout presentation on desktop
        openWindow('pfp-app', 'PFP Generator v1.0', 960, 690); 
    };
    const launchJSPaint = () => {
        openWindow('jspaint', 'untitled - Paint', 800, 600);
    };
    const launchMinesweeper = () => {
        openWindow('minesweeper', 'Minesweeper', 260, 320);
    };
    const launchBlog = () => {
        openWindow('privateers-blog', 'Internet Explorer - PrivateerSA', 840, 780);
    };
    const launchNotepad = () => {
        openWindow('notepad', 'untitled - Notepad', 500, 400);
    };
    onMount(() => {
        launchPfpApp()
    })
</script>

<div class="desktop">

    <div class="workspace">
        <div class="shortcuts">
            <button class="shortcut" onclick={launchPfpApp} ondblclick={launchPfpApp}>
                <div class="icon-placeholder">🎨</div>
                <span>PFP Maker</span>
            </button>
            <button class="shortcut" onclick={launchJSPaint} ondblclick={launchJSPaint}>
                <div class="icon-placeholder">🖌️</div>
                <span>JS Paint</span>
            </button>
            <button class="shortcut" onclick={launchMinesweeper} ondblclick={launchMinesweeper}>
                <div class="icon-placeholder">💣</div>
                <span>Minesweeper</span>        
            </button>
            <button class="shortcut" onclick={launchBlog} ondblclick={launchBlog}>
                <div class="icon-placeholder">🌐</div>
                <span>Privateer Blog</span>
            </button>
            <button class="shortcut" onclick={launchNotepad} ondblclick={launchNotepad}>
                <div class="icon-placeholder">📝</div>
                <span>Notepad</span>
            </button>
        </div>

       {#each $activeWindows as win (win.id)}
            {#if win.isOpen}
                <Window 
                    id={win.id} 
                    title={win.title} 
                    zIndex={win.zIndex}
                    initialWidth={win.width}
                    initialHeight={win.height}
                    isMinimized={win.isMinimized}
                    minWidth={win.id === 'pfp-app' ? 640 : 250}  
                    minHeight={win.id === 'pfp-app' ? 440 : 150} 
                >
                    {#if win.id === 'pfp-app'}
                        <div class="app-content">
                            <PfpMaker /> 
                        </div>
                    {:else if win.id === 'jspaint'}
                        <iframe 
                            src="https://jspaint.app" 
                            title="JS Paint" 
                            class="app-iframe"
                        ></iframe>
                    {:else if win.id === 'minesweeper'}
                        <div class="app-content">
                            <MinesweeperApp />
                        </div>
                    {:else if win.id === 'privateers-blog'}
                        <div class="app-content">
                            <PrivateersApp />
                        </div>
                    {:else if win.id === 'notepad'}
                        <div class="app-content">
                            <NotepadApp />
                        </div>
                    {/if}
                </Window>
            {/if}
        {/each}
    </div> <UwUSidebar />
    <Taskbar />
</div>

<style>
    .desktop {
        width : '100%'; 
        height : '100%';
        height: 100dvh; /* Dynamic height for modern browsers */
        background-color: #008080;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
    }
    .maximized {
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    }
    .workspace {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 35px; /* Stops exactly at the Taskbar */
        right: 320px; /* Stops exactly at the Sidebar */
        overflow: hidden; /* Prevents windows from dragging outside */
    }

    /* On mobile, remove the right boundary since the sidebar is hidden */
    @media (max-width: 768px) {
        .workspace {
            right: 0px; 
        }
    }

    .shortcuts {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .shortcut {
        width: 80px;
        background: transparent;
        border: none;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
    }

    .icon-placeholder {
        font-size: 2rem;
        margin-bottom: 5px;
    }

    .shortcut span {
        background-color: #000080;
        padding: 2px 4px;
        border: 1px dotted transparent;
    }

    .shortcut:focus span {
        border: 1px dotted yellow;
    }

    .app-content {
        height: 100%;
        color: black;
    }

    .app-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #c0c0c0;
        display: block;
    }

    /* Remove the sidebar padding on mobile so apps fill the screen */
    @media (max-width: 768px) {
        .desktop {
            padding-right: 0px;
        }
    }
</style>