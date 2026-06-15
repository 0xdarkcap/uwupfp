<script>
    import { onMount, onDestroy } from 'svelte';
    import { isBooting } from '$lib/stores/os.js';

    // We use $state for variables that need to update the UI
    let lines = $state([]);
    
    const originalAscii = `
                                                                                                                    
                                                                                                                
                                                              ==                                                
                                                             ==~                                                
                                                           +=~==                                                
                                                          +=~~=*                                                
                                                         ===+=+                                                 
                                                        +~~=~=*      =                                          
                                                      ^=*=====      ~-=                                         
                          ~---       ]]]]]((((((((((((+==+*+*)]]] =~--~                                         
                          ----~>](((((((((((((((((((^+*=~=~=+(((((*--~=                                         
                          >=----+)(((((((((((((((((^====+++*)((((*---+**                                        
                       ](((<=-----+(((((((((((((((^===~~===+(((((<=--+^**                                       
                     ((((((>~~+**=--+<(((((((((((^=++===~~=>((((((+--=*^*                                       
                    ((((((((*~+^^^+~--=)(((((((((<+~==++++^((((()((*~-~+~-                                      
                  ](((((((((^~+^^^^^*~-~^>((((((((>=~=~===+><(((>~=>(+------                                    
                ]((((((((((^~~+^^^^^^^+~-~^(((((((*~~~~~---~*((()=------------                                  
                ]((((((((((^-~+^^^^^^^^+--+(((<~=~-----------=<<+~-------------*                                
              ]((((((((((((*-~+^^^^^^^*---+(((^--------------~^+----------------~=                              
             ](((((((((((((*--=*^^^**=~---~^(^-------------------------------------                             
          ]((((((((((((((((^--~++=~--------~*>=--------------------------------------                           
         ]]]]]((((]((((((((<~----------------------~>))))))<^-------------------------~                         
             ((((]((((((((((*--------------------~^{@@@@@@@@%>--------------------------~                       
            ](((]]((((((((((>~-------------------)%@@@@@@@@@%<----------------------------                      
            ]((][(((((((((((>~-------------------)%@@@@@@@@@@}~------------------------~=*)]                    
           [((( ]((((((((((()+-------------------)%@@@@@@@@@@{~---------------------=^(((((((((                 
           ]((]](((((((((((((^~------------------>#@@@@@@@@@@{~------------------~*)((((((((((((                
           [][ ](((((((((((((<=-------------------~^}#@@@@@@%(------------------+<(((((][[((({](]               
              ](((((((((((((((*-----------------------------------------------~*((((((({@@[(({]((               
             ]((](((((((((((((<=----------------------------------------------+(((((((((((((((((                
            [((]](((((((((((((((+--------------------------------------------~<(((((((((((((((((                
               ](((((((((((((((((>~------------------------------------------^((((((((((((((((((                
               [(((((((((((((((((()~----------------------------------------~)(((((((((((((((((                 
                ](((((((((((((((((((=---------------------------------------~)((((((((((((((((                  
                ]((((]((((((((((((((()~--------------------------------------<(((((((((((((((                   
                []]((]](((((()>^^))((((<=------------------------------------=(((((((((((((                     
                   ](((((((()^++++++++*^>+~-----------------------------------=^(((((((((                       
                    ]((((((((>+++++++++++++++++===~-------------------~++++++++*                                
                     ((((((((<*++++++++++++++++++++++++=~~~------~==+++++++++++*                                
                     ](((((((((^++*^>>>>>>>^***++++++++++++++*^+++++++++++**^>>*+                               
                    ](((((((((()^***++++++++***^^^>^^^+++++++++^>^*^^^^^****+++++++                             
                    ](((((((((>*++++++++++++++++++++++***^>>>^^^*^^*+++++++++++++++++                           
                   ]((((((((<*+++++++++++++++++++++++++++++++****^^*++++++++++++++++++*                         
                   ](((((()^++++++++++++++++++=====++++=++++>*+*^*^*++++++++++++++++++++*                       
                   ](((((>+++++++++++++++++++>>**========+++>*+*^+^^+++++++++++++++++++++*                      
                   }]((<^^*++++++++++++++++==*>**)<**)+==++++***++>^++++++++++++++++++++*^^^                    
                   ]((<*++*^^++++++**+++++++========^+=+++++++++++>^+++++++++++++++++*^*+++*                    
                   ](<~=*^*+*^*++++>++++++++++++++++++++++++++++++^^+++++++++++*^++*^*++*^++                    
                     ~---~+^*+*^++>+++++++++++++++++++++++++*^+*^+*^++++++++++++*^^^++^*=--~                    
                     ~-----~*^+*^^*+++++++++++++++++++++++++**=+*+^*++++++++++++*>^+^^=----~                    
                     ~------~*^*^*++++++++++++++++++++++++++++^*+++**++++++++++++*>^+------~                    
                       ~--~=*))^+++++++++++++++++++++++++++++++++++**+++++++++++++*<=~---~                      
                         ]((((^++++++++++++++++++++++++++++++++++++**++++++++++++++*<                           
                         ]((]>*++++++++++++++++++++++++++++++++++++^^++++++++++++++*<                           
                        ](((<*+++++++++++++++++++++++++++++++++++++^^++++++++++++++*^                           
                        [[[ ^++++++++++++++++++++++++++++++++++++++^^+++++++++++++++*>                          
                            *++++++++++++++++++++++++++++++++++++++^*++++++++++++++++*                          
                             **+++++++++++++++++++++++++++++++++++++*+++++++++++++++*^                          
                                **++++++++++++++++++++++++++++++++++*+++++++++***                               
                                   ----~~~~~===+++++++++****+++==~~~~~~~~~---=                                  
                                   **+=--------~=+*           ^*=---------=+*>                                  
                                   ++++++*******++            +++**+*****+++++                                  
                                   ++++++++++++++*            *++++++++++++++*                                  
                                   *+++++++++++++              *++++++++++++*                                   
                                       ++*******                                                                
                                                                                                                
                                                                                                                
                                                                                                                `;

const glitchChars = "[]()<>^=*+@#%{}";
    
    // 1. Move color map generation OUTSIDE onMount so it executes instantly
    const asciiLines = originalAscii.split('\n');
    const colorMap = asciiLines.map((line, y) => {
        return line.split('').map((char, x) => {
            if (char === ' ') return null;
            if (char === '-') return '#ffffff'; 
            if (char === '(') return '#b300b3'; 
            if (char === '[' || char === ']') return '#000000'; 
            if (char === '+') return '#fcd303'; 
            if (char === '@') return '#000000'; 
            if (y <= 10 && x >= 45 && x <= 72) return '#f0d8a8';
            if (y >= 36 && y <= 39 && x >= 32 && x <= 46) return '#f0d8a8';
            if (y >= 8 && y <= 13 && x <= 34) return '#b300b3';
            if (y >= 14 && y <= 33 && x <= 26) return '#b300b3';
            if (y >= 34 && y <= 45 && x <= 22) return '#b300b3';
            if (y >= 7 && y <= 11 && x >= 75) return '#b300b3';
            if (y >= 12 && y <= 15 && x >= 74) return '#b300b3';
            if (y >= 16 && y <= 26 && x >= 73) return '#b300b3';
            if (y >= 34 && y <= 51) return '#fcd303';
            if (y === 52) return '#fcd303'; 
            if (y === 53) return '#ffffff'; 
            if (y >= 54) return '#fcd303';  
            return '#ffffff';
        });
    });

    // 2. Refactor frame generation to accept an isGlitching boolean
    const generateFrame = (isGlitching = false) => {
        let newHtml = '';
        for (let y = 0; y < asciiLines.length; y++) {
            let currentSpanColor = null;
            let lineHtml = '';
            for (let x = 0; x < asciiLines[y].length; x++) {
                const origChar = asciiLines[y][x];
                let displayChar = origChar;
                
                // Only roll random numbers if glitching is active
                if (isGlitching && origChar !== ' ' && origChar !== '\n') {
                    if (Math.random() < 0.15) {
                        displayChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    }
                }
                
                const color = colorMap[y][x];
                if (color !== currentSpanColor) {
                    if (currentSpanColor !== null) {
                        lineHtml += '</span>';
                    }
                    lineHtml += `<span style="color: ${color}; text-shadow: 0 0 2px ${color}88;">`;
                    currentSpanColor = color;
                }
                lineHtml += displayChar;
            }
            if (currentSpanColor !== null) {
                lineHtml += '</span>';
            }
            newHtml += lineHtml + '\n';
        }
        return newHtml;
    };

    // 3. Initialize the state instantly with a NON-glitching frame.
    // This prevents Hydration Errors while ensuring the logo renders at 0ms alongside the title.
    let displayHtml = $state(generateFrame(false));
    let glitchInterval;

    const bootSequence = [
        "AMIBIOS(C)2026 Unicorn, Inc.",
        "SVELTEKIT PFP GENERATOR ACPI BIOS Revision 3105",
        "CPU: Intel(R) Core(TM) i9-10980XE CPU @ 3.00GHz",
        "Speed: 3000MHz",
        " ",
        "Total Memory: 65536MB (DDR4-2133)",
        " ",
        "USB Devices total: 1 Drive, 3 Keyboards, 1 Mouse, 4 Hubs",
        "USB Drive #0: Seagate Expansion Desk 0915",
        " ",
        "Detected ATA/ATAPI Devices...",
        " ",
        "Please enter setup to recover BIOS setting.",
        "After setting up Intel(R) Optane Memory or the RAID configuration was built,",
        "SATA Mode Selection must be changed to RAID mode to avoid unknown issues.",
        "If OS was previously installed as AHCI, set SATA mode to AHCI in BIOS.",
        "Press F1 to Run SETUP"
    ];

    onMount(() => {
        // 4. Start the glitch interval ONLY on the client
        glitchInterval = setInterval(() => {
            displayHtml = generateFrame(true);
        }, 50);

        // 5. Start typing text
        let delay = 0;
        bootSequence.forEach((line, index) => {
            setTimeout(() => {
                lines = [...lines, line];
                if (index === bootSequence.length - 1) {
                    setTimeout(() => isBooting.set(false), 2000); 
                }
            }, delay);
            delay += Math.random() * 80 + 20; 
        });
    });

    onDestroy(() => {
        if (glitchInterval) clearInterval(glitchInterval);
    });
</script>

<div class="bios-screen">
    <div class="bios-header">
        <div class="logo-container">
            <pre class="ascii-unicorn">{@html displayHtml}</pre>
        </div>
        <h1 class="megatrends-title">Unicorn</h1>
    </div>
    
    <div class="boot-text">
        {#each lines as line}
            <p>{line === " " ? "\u00A0" : line}</p> 
        {/each}
    </div>
</div>

<style>
    .bios-screen {
        width: 100vw;
        height: 100vh;
        background-color: #111; /* Slight off-black to mimic monitors */
        color: #fff;
        font-family: 'Courier New', Courier, monospace;
        padding: 2rem 3rem; /* Push it away from the absolute edge like the photo */
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start; /* Align top instead of center */
    }

    /* Flexbox layout to put the logo and title side-by-side */
    .bios-header {
        display: flex;
        align-items: center; /* Vertically aligns title with logo */
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    /* Scaling the ASCII down to act as a tight, clean logo */
    .logo-container {
        /* Prevents flexbox from squishing the container */
        flex-shrink: 0; 
    }

    .ascii-unicorn {
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        /* Drastically reduced font-size perfectly scales it down to logo-size */
        font-size: 3px; 
        line-height: 3px; 
        letter-spacing: 0;
        margin: 0;
    }

    .megatrends-title {
        font-family: 'Times New Roman', Times, serif; /* The classic AMIBIOS serif look */
        font-size: 4.5rem;
        font-weight: bold;
        color: #eeeeee;
        margin: 0;
        letter-spacing: -0.02em;
    }

    .boot-text {
        width: 100%;
        text-align: left; /* Keep it left aligned like the photo */
    }

    .boot-text p {
        margin: 0 0 0.4rem 0;
        font-size: 1.1rem;
        font-weight: bold;
        color: #e0e0e0; /* Off-white typical of old monitors */
        text-shadow: 0 0 1px rgba(255, 255, 255, 0.4);
    }
    /* Mobile Responsiveness */
    @media (max-width: 768px) {
        .bios-screen {
            padding: 1rem; /* Reclaim horizontal real estate */
        }

        .bios-header {
            flex-direction: column; /* Stack the logo and title on small screens */
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .ascii-unicorn {
            font-size: 2px; /* Shrink the grid slightly to guarantee it fits */
            line-height: 2px;
        }

        .megatrends-title {
            font-size: 2.5rem; /* Prevent the title from blowing out the viewport */
        }

        .boot-text p {
            font-size: 0.85rem; /* Scale down the boot text so long lines wrap cleanly */
            margin: 0 0 0.2rem 0;
        }
    }
</style>