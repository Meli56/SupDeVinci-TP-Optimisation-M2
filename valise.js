// ------------------
// Algorithme initial
// ------------------
function multiConstraintKnapsack(weightCapacity, volumeCapacity, items) {
    const scale = 10;
    const scaledWeightCapacity = Math.floor(weightCapacity * scale);
    const scaledVolumeCapacity = Math.floor(volumeCapacity * scale);
    
    const scaledItems = items.map(item => ({
        ...item,
        scaledWeight: Math.floor(item.weight * scale),
        scaledVolume: Math.floor(item.volume * scale),
        valuePerWeight: item.value / item.weight, 
        valuePerVolume: item.value / item.volume
    }));

    let n = scaledItems.length;
    let dp = Array(n + 1).fill().map(() => 
        Array(scaledWeightCapacity + 1).fill().map(() => 
            Array(scaledVolumeCapacity + 1).fill(0)
        )
    );

    let choices = Array(n + 1).fill().map(() => 
        Array(scaledWeightCapacity + 1).fill().map(() => 
            Array(scaledVolumeCapacity + 1).fill().map(() => ({ count: 0 }))
        )
    );

    for (let i = 1; i <= n; i++) {
        const item = scaledItems[i - 1];
        
        for (let w = 0; w <= scaledWeightCapacity; w++) {
            for (let v = 0; v <= scaledVolumeCapacity; v++) {
                dp[i][w][v] = dp[i-1][w][v];
                choices[i][w][v].count = 0;
                
                for (let q = 1; q <= item.quantity; q++) {
                    if (q * item.scaledWeight <= w && q * item.scaledVolume <= v) {
                        let remainingWeight = w - q * item.scaledWeight;
                        let remainingVolume = v - q * item.scaledVolume;
                        let valueWithItems = q * item.value + dp[i-1][remainingWeight][remainingVolume];
                        
                        if (valueWithItems > dp[i][w][v]) {
                            dp[i][w][v] = valueWithItems;
                            choices[i][w][v].count = q;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
    }

    let selectedItems = [];
    let w = scaledWeightCapacity;
    let v = scaledVolumeCapacity;

    for (let i = n; i > 0; i--) {
        const count = choices[i][w][v].count;
        if (count > 0) {
            selectedItems.push({ ...items[i-1], count: count });
            w -= count * scaledItems[i-1].scaledWeight;
            v -= count * scaledItems[i-1].scaledVolume;
        }
    }

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let added = 0;
        
        while (added < item.quantity && (w - item.weight * scale) >= 0 && (v - item.volume * scale) >= 0) {
            selectedItems.push({ ...item, count: 1 });
            w -= item.weight * scale;
            v -= item.volume * scale;
            added++;
        }
    }

    return {
        maxValue: dp[n][scaledWeightCapacity][scaledVolumeCapacity],
        selectedItems: selectedItems
    };
}


// -------------------
// Algorithme optimisé
// -------------------
function multiConstraintKnapsackOpti(weightCapacity, volumeCapacity, items) {
    const scale = 10;
    const scaledWeightCapacity = Math.floor(weightCapacity * scale);
    const scaledVolumeCapacity = Math.floor(volumeCapacity * scale);
    
    const scaledItems = items.map(item => ({
        ...item,
        scaledWeight: Math.floor(item.weight * scale),
        scaledVolume: Math.floor(item.volume * scale),
        valuePerWeight: item.value / item.weight, 
        valuePerVolume: item.value / item.volume
    }));

    let n = scaledItems.length;
    let dp = Array(n + 1).fill().map(() => 
        Array(scaledWeightCapacity + 1).fill().map(() => 
            Array(scaledVolumeCapacity + 1).fill(0)
        )
    );

    let choices = Array(n + 1).fill().map(() => 
        Array(scaledWeightCapacity + 1).fill().map(() => 
            Array(scaledVolumeCapacity + 1).fill().map(() => ({ count: 0 }))
        )
    );

    for (let i = 1; i <= n; i++) {
        const item = scaledItems[i - 1];
        
        for (let w = 0; w <= scaledWeightCapacity; w++) {
            for (let v = 0; v <= scaledVolumeCapacity; v++) {
                dp[i][w][v] = dp[i-1][w][v];
                choices[i][w][v].count = 0;
                
                for (let q = 1; q <= item.quantity; q++) {
                    if (q * item.scaledWeight <= w && q * item.scaledVolume <= v) {
                        let remainingWeight = w - q * item.scaledWeight;
                        let remainingVolume = v - q * item.scaledVolume;
                        let valueWithItems = q * item.value + dp[i-1][remainingWeight][remainingVolume];
                        
                        if (valueWithItems > dp[i][w][v]) {
                            dp[i][w][v] = valueWithItems;
                            choices[i][w][v].count = q;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
    }

    let selectedItems = [];
    let w = scaledWeightCapacity;
    let v = scaledVolumeCapacity;

    for (let i = n; i > 0; i--) {
        const count = choices[i][w][v].count;
        if (count > 0) {
            selectedItems.push({ ...items[i-1], count: count });
            w -= count * scaledItems[i-1].scaledWeight;
            v -= count * scaledItems[i-1].scaledVolume;
        }
    }

    selectedItems.sort((a, b) => b.valuePerWeight - a.valuePerWeight);
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let added = 0;

        let alreadySelected = selectedItems.find(sel => sel.name === item.name);
        let remainingQuantity = item.quantity - (alreadySelected ? alreadySelected.count : 0);
        
        while (added < remainingQuantity && (w - item.weight * scale) >= 0 && (v - item.volume * scale) >= 0) {
            selectedItems.push({ ...item, count: 1 });
            w -= item.weight * scale;
            v -= item.volume * scale;
            added++;
        }
    }

    return {
        maxValue: dp[n][scaledWeightCapacity][scaledVolumeCapacity],
        selectedItems: selectedItems
    };
}


// ---------------------
// Algorithme asynchrone
// ---------------------
async function asyncMultiCompartmentKnapsack(weightCapacity, volumeCapacity, items, compartments = 2) {
    return new Promise((resolve) => {
        let compartmentWeightCapacity = weightCapacity / compartments;
        let compartmentVolumeCapacity = volumeCapacity / compartments;

        let remainingItems = [...items];
        let compartmentsContent = Array.from({ length: compartments }, () => ({ items: [], weight: 0, volume: 0 }));

        function fillCompartment(index) {
            if (index >= compartments) {
                let totalWeightAsync = compartmentsContent.reduce((sum, comp) => sum + comp.weight, 0);
                let totalVolumeAsync = compartmentsContent.reduce((sum, comp) => sum + comp.volume, 0);

                resolve({ totalWeightAsync, totalVolumeAsync, compartments: compartmentsContent });
                return;
            }

            let remainingWeight = compartmentWeightCapacity;
            let remainingVolume = compartmentVolumeCapacity;
            let selectedItems = [];

            for (let item of remainingItems) {
                let count = 0;
                while (count < item.quantity &&
                    remainingWeight >= item.weight &&
                    remainingVolume >= item.volume) {
                    selectedItems.push({ ...item, count: count + 1 });
                    remainingWeight -= item.weight;
                    remainingVolume -= item.volume;
                    count++;
                }
                item.quantity -= count;
            }

            compartmentsContent[index].items = selectedItems;
            compartmentsContent[index].weight = compartmentWeightCapacity - remainingWeight;
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
        await asyncMultiCompartmentKnapsack(weightCapacity, volumeCapacity, items);
    } catch (error) {
        console.error("Erreur lors du calcul :", error);
    }
}

// -------------------------------------------------------------------------
// Exécution
// -------------------------------------------------------------------------

// Poids et volume maximum de la valise 
const weightCapacity = 5;
const volumeCapacity = 22;

const items = [
    { name: "T-shirt", weight: 0.2, volume: 0.5, value: 7, quantity: 7 },
    { name: "Culottes", weight: 0.05, volume: 0.2, value: 7, quantity: 7 },
    { name: "Chaussettes", weight: 0.05, volume: 0.2, value: 7, quantity: 7 },
    { name: "Short", weight: 0.2, volume: 0.4, value: 6, quantity: 3 },
    { name: "Pull", weight: 0.5, volume: 1.0, value: 2, quantity: 2 },
    { name: "Tongs", weight: 0.3, volume: 0.4, value: 4, quantity: 1 },
    { name: "Lunettes de soleil", weight: 0.05, volume: 0.2, value: 6, quantity: 1 },
    { name: "Crème solaire", weight: 0.2, volume: 0.2, value: 8, quantity: 1 },
    { name: "Serviette de plage", weight: 0.3, volume: 1.0, value: 7, quantity: 1 },
    { name: "Serviette de bain", weight: 0.4, volume: 1.5, value: 1, quantity: 1 },
    { name: "Livre", weight: 0.4, volume: 0.5, value: 1, quantity: 1 },
    { name: "Brosse à dents", weight: 0.02, volume: 0.1, value: 9, quantity: 1 },
    { name: "Dentifrice", weight: 0.07, volume: 0.2, value: 8, quantity: 1 },
    { name: "Déodorant", weight: 0.2, volume: 0.3, value: 7, quantity: 1 },
    { name: "Parfum", weight: 0.3, volume: 0.3, value: 1, quantity: 1 },
    { name: "Chargeur de téléphone", weight: 0.1, volume: 0.2, value: 6, quantity: 1 },
    { name: "AirPods", weight: 0.05, volume: 0.1, value: 1, quantity: 1 },
    { name: "Batterie portable", weight: 0.2, volume: 0.3, value: 3, quantity: 1 },
    { name: "Doudou", weight: 0.3, volume: 0.5, value: 1, quantity: 1 },
    { name: "Maillot de bain", weight: 0.1, volume: 0.2, value: 9, quantity: 2 },
    { name: "Gel douche", weight: 0.2, volume: 0.2, value: 5, quantity: 1 },
    { name: "Shampooing", weight: 0.2, volume: 0.2, value: 8, quantity: 1 },
    { name: "Gourde vide", weight: 0.1, volume: 0.3, value: 6, quantity: 1 }
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
    const result = await fn(...args);  // Attendre que la Promise soit résolue
    const end = performance.now();
    return { result, time: (end - start).toFixed(4) };
}




// Exécuter l'algorithme initial (version de l'utilisateur)
const oldSolution = benchmark(multiConstraintKnapsack, weightCapacity, volumeCapacity, items);
console.log("\n=== Benchmark: Algorithme initial ===");
console.log("Temps d'exécution :", oldSolution.time, "ms");

// Exécuter l'algorithme optimisé (nouvelle version améliorée)
const newSolution = benchmark(multiConstraintKnapsackOpti, weightCapacity, volumeCapacity, items);
console.log("\n=== Benchmark: Algorithme optimisé ===");
console.log("Temps d'exécution :", newSolution.time, "ms");


// Exécuter l'algorithme optimisé (nouvelle version améliorée)
(async () => {
    console.log("\n=== Benchmark: Algorithme asynchrone ===");
    const asyncSolution = await benchmarkAsync(runAsyncKnapsack);
    console.log("Temps d'exécution :", asyncSolution.time, "ms");
})();
