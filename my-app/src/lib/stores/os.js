import { writable } from 'svelte/store';

export const isBooting = writable(true);
export const activeWindows = writable([]);
export const highestZIndex = writable(10);

export const openWindow = (id, title, width = 400, height = 300) => {
    highestZIndex.update(n => n + 1);
    
    activeWindows.update(windows => {
        const existing = windows.find(w => w.id === id);
        if (existing) {
            existing.isOpen = true;
            existing.isMinimized = false; // Restore if it was minimized
            highestZIndex.subscribe(val => existing.zIndex = val)();
            return [...windows];
        }
        
        let newZ = 10;
        highestZIndex.subscribe(val => newZ = val)();
        
        return [...windows, { id, title, isOpen: true, isMinimized: false, zIndex: newZ, width, height }];
    });
};
export const closeWindow = (id) => {
    activeWindows.update(windows => {
        const win = windows.find(w => w.id === id);
        if (win) win.isOpen = false;
        return [...windows];
    });
};

export const focusWindow = (id) => {
    highestZIndex.update(n => n + 1);
    activeWindows.update(windows => {
        const win = windows.find(w => w.id === id);
        if (win) {
            highestZIndex.subscribe(val => win.zIndex = val)();
        }
        return [...windows];
    });
};

// ... existing imports and writable stores ...

// Updated to include isMinimized: false


// NEW: Minimize and Restore logic
export const minimizeWindow = (id) => {
    activeWindows.update(windows => {
        const win = windows.find(w => w.id === id);
        if (win) win.isMinimized = true;
        return [...windows];
    });
};

export const restoreWindow = (id) => {
    highestZIndex.update(n => n + 1);
    activeWindows.update(windows => {
        const win = windows.find(w => w.id === id);
        if (win) {
            win.isMinimized = false;
            highestZIndex.subscribe(val => win.zIndex = val)();
        }
        return [...windows];
    });
};