// ------------------
// Algorithme initial (non optimisé)
// ------------------
function knapsackByVolume(volumeCapacity, items) {
    const scale = 10;
    const scaledVolumeCapacity = Math.floor(volumeCapacity * scale);
    
    const scaledItems = items.map(item => ({
        ...item,
        scaledVolume: Math.floor(item.volume * scale),
        valuePerVolume: item.value / item.volume
    }));

    let n = scaledItems.length;
    let dp = Array(n + 1).fill().map(() => Array(scaledVolumeCapacity + 1).fill(0));
    let choices = Array(n + 1).fill().map(() => Array(scaledVolumeCapacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const item = scaledItems[i - 1];
        
        for (let v = 0; v <= scaledVolumeCapacity; v++) {
            dp[i][v] = dp[i-1][v];
            choices[i][v] = 0;
            
            for (let q = 1; q <= item.quantity; q++) {
                if (q * item.scaledVolume <= v) {
                    let remainingVolume = v - q * item.scaledVolume;
                    let valueWithItems = q * item.value + dp[i-1][remainingVolume];
                    
                    if (valueWithItems > dp[i][v]) {
                        dp[i][v] = valueWithItems;
                        choices[i][v] = q;
                    }
                } else {
                    break;
                }
            }
        }
    }

    let selectedItems = [];
    let v = scaledVolumeCapacity;

    for (let i = n; i > 0; i--) {
        const count = choices[i][v];
        if (count > 0) {
            selectedItems.push({ ...items[i-1], count: count });
            v -= count * scaledItems[i-1].scaledVolume;
        }
    }

    return {
        maxValue: dp[n][scaledVolumeCapacity],
        selectedItems: selectedItems
    };
}

// -------------------
// Algorithme optimisé
// -------------------
function knapsackByVolumeOpti(volumeCapacity, items) {
    const scale = 10;
    const scaledVolumeCapacity = Math.floor(volumeCapacity * scale);
    
    const scaledItems = items.map(item => ({
        ...item,
        scaledVolume: Math.floor(item.volume * scale),
        valuePerVolume: item.value / item.volume
    }));

    let n = scaledItems.length;
    let dp = Array(n + 1).fill().map(() => Array(scaledVolumeCapacity + 1).fill(0));
    let choices = Array(n + 1).fill().map(() => Array(scaledVolumeCapacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const item = scaledItems[i - 1];
        
        for (let v = 0; v <= scaledVolumeCapacity; v++) {
            dp[i][v] = dp[i-1][v];
            choices[i][v] = 0;
            
            for (let q = 1; q <= item.quantity; q++) {
                if (q * item.scaledVolume <= v) {
                    let remainingVolume = v - q * item.scaledVolume;
                    let valueWithItems = q * item.value + dp[i-1][remainingVolume];
                    
                    if (valueWithItems > dp[i][v]) {
                        dp[i][v] = valueWithItems;
                        choices[i][v] = q;
                    }
                } else {
                    break;
                }
            }
        }
    }

    let selectedItems = [];
    let v = scaledVolumeCapacity;
    items.sort((a, b) => b.valuePerWeight - a.valuePerWeight);

    for (let i = n; i > 0; i--) {
        const count = choices[i][v];
        if (count > 0) {
            selectedItems.push({ ...items[i-1], count: count });
            v -= count * scaledItems[i-1].scaledVolume;
        }
    }

    return {
        maxValue: dp[n][scaledVolumeCapacity],
        selectedItems: selectedItems
    };
}

// ---------------------
// Algorithme asynchrone
// ---------------------
async function asyncKnapsackByVolume(volumeCapacity, items, compartments) {
    return new Promise((resolve) => {
        let compartmentVolumeCapacity = volumeCapacity / compartments;
        let remainingItems = [...items];
        let compartmentsContent = Array.from({ length: compartments }, () => ({ items: [], volume: 0 }));
        let compartimentUsed = 0;

        function fillCompartment(index) {
            if (index >= compartments) {
                // Lorsque tous les compartiments sont remplis, on affiche les résultats
                // console.log(`=== Contenu des ${compartments} camions ===`);
                compartmentsContent.forEach((comp, idx) => {
                    if(comp.items.length >= 1){
                        // console.log(`Camion ${idx + 1}:`);
                        // comp.items.forEach(item => {
                        //     console.log(` - ${item.name} (quantité: ${item.count})`);
                        // });
                        // console.log(`Volume utilisé: ${comp.volume.toFixed(2)} L\n`);
                        compartimentUsed++
                    }
                });
                console.log(`Nombre camions utilisés: ${compartimentUsed}`);
                resolve(compartmentsContent);
                return;
            }

            let remainingVolume = compartmentVolumeCapacity;
            let selectedItems = [];

            for (let item of remainingItems) {
                let count = 0;
                while (count < item.quantity && remainingVolume >= item.volume) {
                    selectedItems.push({ ...item, count: count + 1 });
                    remainingVolume -= item.volume;
                    count++;
                }
                item.quantity -= count;
            }

            compartmentsContent[index].items = selectedItems;
            compartmentsContent[index].volume = compartmentVolumeCapacity - remainingVolume;

            setTimeout(() => fillCompartment(index + 1), 0);
        }

        fillCompartment(0);
    });
}

// ---------------------
// Run Algorithme asynchrone
// ---------------------
async function runAsyncKnapsack() {
    try {
        await asyncKnapsackByVolume(volumeCapacity, items, compartmentsMax);
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
}

// -------------------------------------------------------------------------
// Exécution
// -------------------------------------------------------------------------

// 3 camions de 5000L
const volumeCapacity = 15000;
const compartmentsMax = 6;

const items = [
    { name: "Lit double", volume: 200, value: 10, quantity: 1 },
    { name: "Canapé 3 places", volume: 250, value: 10, quantity: 1 },
    { name: "Fauteuil", volume: 100, value: 9, quantity: 2 },
    { name: "Table à manger", volume: 150, value: 9, quantity: 1 },
    { name: "Chaises de salle à manger",  volume: 40, value: 7, quantity: 6 },
    { name: "Buffet", volume: 180, value: 8, quantity: 1 },
    { name: "Armoire",  volume: 250, value: 10, quantity: 1 },
    { name: "Commode", volume: 120, value: 8, quantity: 1 },
    { name: "Bureau", volume: 150, value: 8, quantity: 1 },
    { name: "Chaise de bureau", volume: 50, value: 7, quantity: 1 },
    { name: "Table basse", volume: 80, value: 7, quantity: 1 },
    { name: "Étagère", volume: 100, value: 7, quantity: 2 },
    { name: "Matelas", volume: 180, value: 9, quantity: 1 },
    { name: "Tête de lit", volume: 100, value: 7, quantity: 1 },
    { name: "Cadre de lit", volume: 180, value: 8, quantity: 1 },
    { name: "Lave-linge", volume: 100, value: 9, quantity: 1 },
    { name: "Sèche-linge", volume: 100, value: 8, quantity: 1 },
    { name: "Lave-vaisselle", volume: 80, value: 8, quantity: 1 },
    { name: "Réfrigérateur",  volume: 200, value: 10, quantity: 1 },
    { name: "Congélateur", volume: 150, value: 9, quantity: 1 },
    { name: "Four électrique", volume: 60, value: 8, quantity: 1 },
    { name: "Plaque de cuisson", volume: 50, value: 7, quantity: 1 },
    { name: "Micro-ondes", volume: 40, value: 7, quantity: 1 },
    { name: "Hotte aspirante", volume: 50, value: 6, quantity: 1 },
    { name: "Télévision", volume: 100, value: 9, quantity: 1 },
    { name: "Home cinéma", volume: 50, value: 8, quantity: 1 },
    { name: "Console de jeux", volume: 15, value: 8, quantity: 1 },
    { name: "Ordinateur de bureau", volume: 40, value: 8, quantity: 1 },
    { name: "Imprimante", volume: 30, value: 7, quantity: 1 },
    { name: "Écran d'ordinateur", volume: 20, value: 7, quantity: 2 },
    { name: "Aspirateur", volume: 30, value: 7, quantity: 1 },
    { name: "Radiateur d'appoint", volume: 50, value: 7, quantity: 1 },
    { name: "Ventilateur", volume: 30, value: 6, quantity: 1 },
    { name: "Tapis", volume: 100, value: 6, quantity: 2 },
    { name: "Miroir mural", volume: 60, value: 7, quantity: 2 },
    { name: "Carton vêtements",  volume: 40, value: 7, quantity: 4 },
    { name: "Carton vaisselle", volume: 35, value: 9, quantity: 3 },
    { name: "Carton livres", volume: 30, value: 8, quantity: 5 },
    { name: "Boîte à outils",  volume: 25, value: 9, quantity: 1 },
    { name: "Enceinte Bluetooth", volume: 10, value: 8, quantity: 1 },
    { name: "Table de jardin", volume: 100, value: 7, quantity: 1 },
    { name: "Chaises de jardin",  volume: 40, value: 6, quantity: 4 },
    { name: "Barbecue", volume: 120, value: 8, quantity: 1 },
    { name: "Parasol",  volume: 50, value: 6, quantity: 1 },
    { name: "Coffre de rangement extérieur", volume: 80, value: 7, quantity: 1 },
    { name: "Sac de voyage",volume: 30, value: 6, quantity: 2 },
    { name: "Valise", volume: 50, value: 6, quantity: 1 },
    { name: "Couette",volume: 30, value: 6, quantity: 2 },
    { name: "Oreillers", volume: 15, value: 6, quantity: 4 },
    { name: "Linge de lit", volume: 25, value: 6, quantity: 3 },
    { name: "Serviettes", volume: 15, value: 6, quantity: 4 },
    { name: "Poubelle",volume: 25, value: 5, quantity: 1 },
    { name: "Balai", volume: 15, value: 4, quantity: 1 },
    { name: "Serpillère", volume: 15, value: 4, quantity: 1 },
    { name: "Boîte de rangement plastique", volume: 20, value: 5, quantity: 4 },
    { name: "Jouets enfants", volume: 15, value: 6, quantity: 3 },
    { name: "Poussette",  volume: 50, value: 6, quantity: 1 },
    { name: "Lit parapluie", volume: 40, value: 6, quantity: 1 },
    { name: "Trottinette",volume: 30, value: 6, quantity: 1 },
    { name: "Vélo enfant",  volume: 60, value: 7, quantity: 1 },
    { name: "Vélo adulte", volume: 120, value: 8, quantity: 1 },
    { name: "Plantes en pot", volume: 20, value: 6, quantity: 2 },
    
    // Ajout de 100 objets supplémentaires
    { name: "Classeur", volume: 25, value: 5, quantity: 3 },
    { name: "Table d'appoint", volume: 40, value: 6, quantity: 2 },
    { name: "Chaise de jardin", volume: 35, value: 5, quantity: 4 },
    { name: "Lit superposé", volume: 150, value: 8, quantity: 2 },
    { name: "Tente de camping", volume: 100, value: 7, quantity: 3 },
    { name: "Sac de couchage", volume: 20, value: 5, quantity: 4 },
    { name: "Table pliante", volume: 60, value: 6, quantity: 2 },
    { name: "Coffre à jouets", volume: 40, value: 6, quantity: 2 },
    { name: "Planche à repasser", volume: 25, value: 4, quantity: 1 },
    { name: "Fer à repasser", volume: 15, value: 3, quantity: 2 },
    { name: "Balancelle", volume: 50, value: 7, quantity: 1 },
    { name: "Piano", volume: 200, value: 9, quantity: 1 },
    { name: "Guitare", volume: 30, value: 7, quantity: 3 },
    { name: "Table de billard", volume: 150, value: 10, quantity: 1 },
    { name: "Machine à café", volume: 40, value: 6, quantity: 3 },
    { name: "Piano électronique", volume: 80, value: 8, quantity: 1 },
    { name: "Barre de son", volume: 50, value: 6, quantity: 2 },
    { name: "Console Nintendo Switch", volume: 20, value: 7, quantity: 2 },
    { name: "Sac à dos", volume: 30, value: 5, quantity: 5 },
    { name: "Tapis de course", volume: 100, value: 9, quantity: 1 },
    { name: "Vitrine", volume: 80, value: 7, quantity: 2 },
    { name: "Lustre", volume: 40, value: 6, quantity: 2 },
    { name: "Balançoire", volume: 60, value: 8, quantity: 1 },
    { name: "Hamac", volume: 30, value: 7, quantity: 2 },
    { name: "Grille-pain", volume: 20, value: 5, quantity: 4 },
    { name: "Planche de surf", volume: 70, value: 8, quantity: 1 },
    { name: "Chaise longue", volume: 100, value: 7, quantity: 1 },
    { name: "Piscine gonflable", volume: 150, value: 8, quantity: 2 },
    { name: "Bac à sable", volume: 60, value: 6, quantity: 3 },
    { name: "Aire de jeux", volume: 200, value: 9, quantity: 1 },
    { name: "Panneau solaire", volume: 80, value: 9, quantity: 1 },
    { name: "Abri de jardin", volume: 200, value: 10, quantity: 1 },
    { name: "Karaoké", volume: 40, value: 6, quantity: 2 },
    { name: "Réchauffeur de piscine", volume: 80, value: 7, quantity: 1 },
    { name: "Cafetière expresso", volume: 30, value: 8, quantity: 1 },
    { name: "Échelle", volume: 50, value: 7, quantity: 2 },
    { name: "Manteau", volume: 40, value: 7, quantity: 5 },
    { name: "Corde à sauter", volume: 5, value: 3, quantity: 6 },
    { name: "Chaussures de ski", volume: 60, value: 8, quantity: 2 },
    { name: "Raquettes de tennis", volume: 25, value: 6, quantity: 3 },
    { name: "Skis", volume: 100, value: 9, quantity: 1 },
    { name: "Snowboard", volume: 120, value: 9, quantity: 1 },
    { name: "Appareil photo", volume: 40, value: 7, quantity: 3 },
    { name: "Caméra de sécurité", volume: 25, value: 6, quantity: 4 },
    { name: "Casseroles", volume: 30, value: 7, quantity: 3 },
    { name: "Poêles", volume: 35, value: 6, quantity: 3 },
    { name: "Bouteilles de vin", volume: 25, value: 6, quantity: 6 },
    { name: "Coffre-fort", volume: 80, value: 8, quantity: 1 },
    { name: "Porte-manteau", volume: 40, value: 6, quantity: 4 },
    { name: "Bureau d'angle", volume: 150, value: 9, quantity: 1 },
    { name: "Chaise de plage", volume: 25, value: 5, quantity: 3 },
    { name: "Parasol de plage", volume: 40, value: 6, quantity: 2 },
    { name: "Draps de bain", volume: 15, value: 5, quantity: 5 },
    { name: "Sac de couchage", volume: 30, value: 6, quantity: 2 },
    { name: "Lunettes de soleil", volume: 10, value: 4, quantity: 4 },
    { name: "Casque audio", volume: 25, value: 6, quantity: 2 }
];

    

// ---------
// Benchmark
// ---------
function benchmark(fn, ...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    return { result, time: (end - start).toFixed(4) };
}
async function benchmarkAsync(fn, ...args) {
    const start = performance.now();
    const result = await fn(...args); 
    const end = performance.now();
    return { result, time: (end - start).toFixed(4) };
}

const oldSolution = benchmark(knapsackByVolume, volumeCapacity, items);
console.log("\n=== Benchmark: Algorithme initial ===");
console.log("Temps d'exécution :", oldSolution.time, "ms");

const newSolution = benchmark(knapsackByVolumeOpti, volumeCapacity, items);
console.log("\n=== Benchmark: Algorithme optimisé ===");
console.log("Temps d'exécution :", newSolution.time, "ms");

(async () => {
    console.log("\n=== Benchmark: Algorithme asynchrone ===");
    const asyncSolution = await benchmarkAsync(runAsyncKnapsack);
    console.log("Temps d'exécution :", asyncSolution.time, "ms");
})();

