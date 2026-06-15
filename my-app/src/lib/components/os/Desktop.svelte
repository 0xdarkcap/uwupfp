<script>
    import { activeWindows, openWindow } from '$lib/stores/os.js';
    import Window from './Window.svelte';
    

    const launchPfpApp = () => {
        openWindow('pfp-app', 'PFP Generator v1.0');
    };
    const launchJSPaint = () => {
        openWindow('jspaint', 'untitled - Paint');
    };
</script>

<div class="desktop">
    <div class="shortcuts">
        <button class="shortcut" onclick={launchPfpApp} ondblclick={launchPfpApp}>
            <div class="icon-placeholder">🎨</div>
            <span>PFP Maker</span>
        </button>

        <button class="shortcut" onclick={launchJSPaint} ondblclick={launchJSPaint}>
            <div class="icon-placeholder">🖌️</div>
            <span>JS Paint</span>
        </button>
    </div>

    {#each $activeWindows as win (win.id)}
        {#if win.isOpen}
            <Window id={win.id} title={win.title} zIndex={win.zIndex}>
                
                {#if win.id === 'pfp-app'}
                    <div class="app-content">
                        <p>Welcome to the PFP Generator module.</p>
                    </div>
                
                {:else if win.id === 'jspaint'}
                    <iframe 
                        src="https://jspaint.app" 
                        title="JS Paint" 
                        class="app-iframe"
                    ></iframe>
                {/if}

            </Window>
        {/if}
    {/each}
</div>

<style>
    /* ... keep your previous Desktop CSS exact the same ... */
    .desktop {
        width: 100vw;
        height: 100vh;
        background-color: #008080;
        position: relative;
        overflow: hidden;
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
        color: black; /* Override the desktop white text */
    }

    .app-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #c0c0c0;
        display: block;
    }
</style>