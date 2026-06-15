<script>
import { closeWindow, focusWindow } from '$lib/stores/os.js';

    // Accept initialWidth and initialHeight from the parent
    let { id, title, zIndex, initialWidth = 400, initialHeight = 300 } = $props();

    // Initialize state using the new dynamic props
    let width = $state(initialWidth);
    let height = $state(initialHeight);
    
    // Dynamically center based on the requested size
    let left = $state(window.innerWidth / 2 - (initialWidth / 2)); 
    let top = $state(window.innerHeight / 2 - (initialHeight / 2));

    // --- DRAG LOGIC ---
    let isDragging = false;
    let dragStartX, dragStartY, initialLeft, initialTop;

    function onDragStart(e) {
        if (e.button !== 0) return; // Only react to Left Click
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialLeft = left;
        initialTop = top;
        
        focusWindow(id); // Bring to front when grabbed

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);
    }

    function onDrag(e) {
        if (!isDragging) return;
        left = initialLeft + (e.clientX - dragStartX);
        top = initialTop + (e.clientY - dragStartY);
    }

    function onDragEnd() {
        isDragging = false;
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', onDragEnd);
    }

    // --- RESIZE LOGIC ---
    let isResizing = false;
    let resizeStartW, resizeStartH;

    function onResizeStart(e) {
        e.stopPropagation(); // Prevent triggering the window focus/drag
        if (e.button !== 0) return;
        isResizing = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        resizeStartW = width;
        resizeStartH = height;

        window.addEventListener('mousemove', onResize);
        window.addEventListener('mouseup', onResizeEnd);
    }

    function onResize(e) {
        if (!isResizing) return;
        // Ensure it doesn't get too small (min 250x150)
        width = Math.max(250, resizeStartW + (e.clientX - dragStartX));
        height = Math.max(150, resizeStartH + (e.clientY - dragStartY));
    }

    function onResizeEnd() {
        isResizing = false;
        window.removeEventListener('mousemove', onResize);
        window.removeEventListener('mouseup', onResizeEnd);
    }

    // --- MINIMIZE LOGIC ---
    function minimizeWindow() {
        // For now, this just closes the window. 
        // Once we build a taskbar, we will update the OS store to handle true minimization.
        closeWindow(id); 
    }
</script>

<div 
    class="win98-window" 
    style="
        z-index: {zIndex}; 
        top: {top}px; 
        left: {left}px; 
        width: {width}px; 
        height: {height}px;
    "
    onmousedown={() => focusWindow(id)} 
>
    <div class="title-bar" onmousedown={onDragStart}>
        <div class="title-bar-text">{title}</div>
        <div class="title-bar-controls">
            <button aria-label="Minimize" onclick={minimizeWindow}>_</button>
            <button aria-label="Close" onclick={() => closeWindow(id)}>X</button>
        </div>
    </div>
    
    <div class="window-body">
        <slot></slot>
    </div>

    <div class="resize-handle" onmousedown={onResizeStart}></div>
</div>

<style>
    .win98-window {
        position: absolute;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #000000 #000000 #ffffff;
        display: flex;
        flex-direction: column;
        /* Adds a subtle classic shadow to floating windows */
        box-shadow: 2px 2px 0 rgba(0,0,0,0.5); 
    }

    .title-bar {
        background: #000080;
        color: white;
        padding: 3px 2px 3px 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        /* Indicates to the user that this area is grab-able */
        cursor: default; 
    }

    .title-bar-controls {
        display: flex;
        gap: 2px;
    }

    .title-bar-controls button {
        background: #c0c0c0;
        border: 1px solid;
        border-color: #ffffff #000000 #000000 #ffffff;
        font-weight: bold;
        cursor: pointer;
        padding: 0 4px;
        font-size: 0.8rem;
    }

    .title-bar-controls button:active {
        border-color: #000000 #ffffff #ffffff #000000;
        /* Classic 98 push-in effect */
        padding: 1px 3px 0 5px; 
    }

    .window-body {
        padding: 10px;
        flex-grow: 1;
        overflow: auto; /* Adds scrollbars if content gets too big */
    }

    .resize-handle {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 12px;
        height: 12px;
        cursor: nwse-resize; /* The diagonal resize arrow */
        z-index: 10;
        /* A classic ridged texture could be added here later, for now it's an invisible hit-box */
    }

    /* =========================================
       MOBILE OVERRIDES
       ========================================= */
    @media (max-width: 768px) {
        .win98-window {
            /* Force to absolute bounds of the screen, overriding inline styles */
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            /* Remove the 3D border and shadow since it fills the screen */
            border: none;
            box-shadow: none;
        }

        .resize-handle {
            /* Disable resizing entirely */
            display: none !important;
        }

        .title-bar {
            /* Remove dragging cursor implication */
            cursor: default;
        }
    }
    @media (max-width: 768px) {
        /* ... your existing mobile overrides for .win98-window, .resize-handle, etc ... */

        /* 1. Hide the minimize button entirely */
        button[aria-label="Minimize"] {
            display: none !important;
        }

        /* 2. Make the close button a much larger, touch-friendly target */
        button[aria-label="Close"] {
            padding: 4px 16px !important;
            font-size: 1.2rem !important;
        }

        /* Optional: Give the title bar slightly more breathing room for the bigger button */
        .title-bar {
            padding: 6px 4px 6px 6px !important;
        }
    }
</style>