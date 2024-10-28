document.addEventListener("DOMContentLoaded", function() {
    let map = L.map('map').setView([53.430127, 14.564802], 18);
    L.tileLayer.provider('Esri.WorldImagery').addTo(map);

    document.getElementById("getLocation").addEventListener("click", function() {
        if (!navigator.geolocation) {
            alert("Geolokalizacja nie jest wspierana.");
            return;
        }

        if (Notification.permission === 'default' || Notification.permission === 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log("Powiadomienia zostały włączone.");
                } else {
                    console.log("Powiadomienia zostały zablokowane.");
                }
            });
        }

        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            map.setView([lat, lon], 18);

            // Wyświetlanie powiadomienia po uzyskaniu lokalizacji
            if (Notification.permission === 'granted') {
                new Notification("Twoja lokalizacja została zaktualizowana!");
            }
        });
    });

    // Przycisk do zapisu mapy jako obraz rastrowy
    document.getElementById("saveButton").addEventListener("click", function() {
        leafletImage(map, function(err, canvas) {
            if (err) {
                console.error("Błąd generowania obrazu z mapy:", err);
                return;
            }

            let rasterMap = document.getElementById("rasterMap");
            rasterMap.width = canvas.width;
            rasterMap.height = canvas.height;

            let rasterContext = rasterMap.getContext("2d");
            rasterContext.drawImage(canvas, 0, 0, canvas.width, canvas.height);

            // Po utworzeniu obrazu rastrowego, podziel mapę na puzzle
            splitMapIntoPieces(canvas);
        });
    });

    // Funkcja do podziału mapy na puzzle
    function splitMapIntoPieces(canvas) {
        const container = document.getElementById("puzzle-container");
        container.innerHTML = ""; // Wyczyść zawartość kontenera przed dodaniem puzzli
        const pieceWidth = canvas.width / 4;
        const pieceHeight = canvas.height / 4;

        let pieces = [];
        
        // Tworzenie puzzli i dodawanie ich do tablicy pieces
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let pieceCanvas = document.createElement("canvas");
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                let context = pieceCanvas.getContext("2d");

                context.drawImage(canvas, j * pieceWidth, i * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                pieceCanvas.classList.add("puzzle-piece");
                pieceCanvas.setAttribute("draggable", "true");

                // Ustawienie ID puzzla, aby umożliwić późniejszą weryfikację ułożenia
                pieceCanvas.id = `piece-${i}-${j}`;

                pieces.push(pieceCanvas);
            }
        }

        pieces.sort(() => Math.random() - 0.5);

        pieces.forEach(piece => container.appendChild(piece));

        createDropZone();

        addDragAndDropFunctionality();
    }

    // Funkcja do tworzenia drop zone z 16 polami
    function createDropZone() {
        const dropZoneContainer = document.getElementById("drop-zone-container");
        dropZoneContainer.innerHTML = "";

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let dropZone = document.createElement("div");
                dropZone.classList.add("drop-zone");
                dropZone.dataset.targetId = `piece-${i}-${j}`;
                dropZone.addEventListener("dragover", event => {
                    event.preventDefault();
                    dropZone.classList.add("drag-over");
                });

                dropZone.addEventListener("dragleave", () => {
                    dropZone.classList.remove("drag-over");
                });

                dropZone.addEventListener("drop", event => {
                    event.preventDefault();
                    const pieceId = event.dataTransfer.getData("text/plain");
                    const piece = document.getElementById(pieceId);

                    if (dropZone.childElementCount === 0) {
                        dropZone.appendChild(piece);
                    }
                    dropZone.classList.remove("drag-over");

                    checkIfPuzzleIsComplete();
                });

                dropZoneContainer.appendChild(dropZone);
            }
        }
    }

    function addDragAndDropFunctionality() {
        let pieces = document.querySelectorAll(".puzzle-piece");
        pieces.forEach(piece => {
            piece.addEventListener("dragstart", event => {
                event.dataTransfer.setData("text/plain", event.target.id);
                setTimeout(() => {
                    event.target.style.visibility = "hidden";
                }, 0);
            });

            piece.addEventListener("dragend", event => {
                event.target.style.visibility = "visible";
            });
        });
    }

    function checkIfPuzzleIsComplete() {
        const dropZones = document.querySelectorAll(".drop-zone");
        let allCorrect = true;

        dropZones.forEach(dropZone => {
            if (dropZone.childElementCount === 1) {
                const piece = dropZone.firstChild;
                if (piece.id !== dropZone.dataset.targetId) {
                    allCorrect = false;
                }
            } else {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            if (Notification.permission === 'granted') {
                new Notification("Gratulacje! Wszystkie puzzle zostały poprawnie ułożone!");
            } else {
                alert("Gratulacje! Wszystkie puzzle zostały poprawnie ułożone!");
            }
        }
    }
    // Funkcja do sprawdzania, czy puzzle są poprawnie ułożone
    function checkIfPuzzleIsComplete() {
    const dropZones = document.querySelectorAll(".drop-zone");
    let allCorrect = true;

    dropZones.forEach(dropZone => {
        if (dropZone.childElementCount === 1) {
            const piece = dropZone.firstChild;
            if (piece.id !== dropZone.dataset.targetId) {
                allCorrect = false;
            }
        } else {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        const overlay = document.getElementById("congratulationsOverlay");

        // Wyświetlenie nakładki z gratulacjami
        overlay.classList.add("show-overlay");

        // Powiadomienie lub alert
        if (Notification.permission === 'granted') {
            new Notification("Gratulacje! Wszystkie puzzle zostały poprawnie ułożone!");
        } else {
            alert("Gratulacje! Wszystkie puzzle zostały poprawnie ułożone!");
        }
    }
}

});

