const app = {
  // Éléments du DOM
  invaderContainer: document.getElementById("invader"),
  configurationForm: document.querySelector(".configuration"),
  paletteContainer: document.querySelector(".palette"),

  // Valeurs par défaut pour la grille et les pixels
  defaultGridSize: 8,
  defaultPixelSize: 25,

  // Valeurs actuelles de la grille et des pixels
  gridSize: null, // Initialisées à null pour déclencher la création initiale
  pixelSize: null,

  // Palette de couleurs
  styles: [
    "palette--gris",
    "palette--noir",
    "palette--orange",
    "palette--vert",
  ],
  currentColor: "palette--noir", // Style sélectionné par défaut

  // Méthodes d'initialisation
  init() {
    // Création des éléments du formulaire (avec les valeurs par défaut)
    this.gridSizeInput = this.createInput(
      "number",
      "Taille de la grille",
      1,
      20,
      this.defaultGridSize,
      "form-grid-size"
    );
    this.pixelSizeInput = this.createInput(
      "number",
      "Taille des pixels",
      5,
      50,
      this.defaultPixelSize,
      "form-grid-pixel"
    );
    this.submitButton = this.createSubmitButton();

    // Ajout des éléments au formulaire
    this.configurationForm.append(
      this.gridSizeInput,
      this.pixelSizeInput,
      this.submitButton
    );

    // Gestionnaire d'événement pour la soumission du formulaire
    this.configurationForm.addEventListener(
      "submit",
      this.handleFormSubmit.bind(this)
    );

    // Création initiale de la grille avec les valeurs par défaut
    this.createGrid(this.defaultGridSize);
    this.attachPixelEventListeners();
    this.generatePalette();
  },

  // Méthode générique pour créer des éléments de formulaire
  createInput(type, placeholder, min, max, value, className) {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.min = min;
    input.max = max;
    input.value = value;
    input.classList.add(className);
    return input;
  },

  createSubmitButton() {
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Valider";
    return button;
  },

  handleFormSubmit(event) {
    event.preventDefault();
    this.gridSize = parseInt(this.gridSizeInput.value);
    this.pixelSize = parseInt(this.pixelSizeInput.value);

    // Validation des valeurs
    if (this.isValidConfiguration()) {
      this.createGrid(this.gridSize);
    } else {
      alert("Configuration invalide. Veuillez vérifier les valeurs.");
    }
  },

  isValidConfiguration() {
    return (
      this.gridSize >= 1 &&
      this.gridSize <= 20 &&
      this.pixelSize >= 5 &&
      this.pixelSize <= 50
    );
  },

  // Attache les écouteurs d'événements aux pixels
  attachPixelEventListeners() {
    this.invaderContainer.addEventListener("click", (event) => {
      const pixel = event.target;
      if (pixel.classList.contains("pixel")) {
        // Trouver l'ancienne classe de couleur (s'il y en a une)
        const oldColorClass = [...pixel.classList].find((className) =>
          this.styles.includes(className)
        );

        // Remplacer l'ancienne classe par la nouvelle (si nécessaire)
        if (oldColorClass) {
          pixel.classList.replace(oldColorClass, this.currentColor);
        } else {
          pixel.classList.add(this.currentColor); // Si pas d'ancienne couleur, juste ajouter
        }

        // Appliquer les styles CSS correspondants à la nouvelle couleur
        this.applyPixelStyle(pixel);
      }
    });
  },

  applyPixelStyle(pixel) {
    const colorClass = pixel.classList[1]; // La deuxième classe correspond à la couleur
    if (colorClass) {
      const colorStyles = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${colorClass.replace("palette--", "")}`)
        .trim();
      pixel.style.backgroundColor = colorStyles;
    } else {
      // Remettre la couleur par défaut si aucune classe de couleur n'est trouvée
      pixel.style.backgroundColor = "#D2DAE2"; // Ou la couleur par défaut de votre choix
    }
  },

  updateActiveColor() {
    const colorButtons = document.querySelectorAll('.color-button');
    colorButtons.forEach(button => {
      button.classList.remove('active'); // Désactiver tous les boutons
    });
  
    // Activer le bouton correspondant à la couleur actuelle
    const selectedButton = document.querySelector(`.color-button.${this.currentColor}`);
    selectedButton.classList.add('active');
  
    // Mettre à jour la variable CSS avec la couleur du bouton actif
    const activeColor = getComputedStyle(selectedButton).getPropertyValue('background-color');
    document.documentElement.style.setProperty('--active-color', activeColor);
  },

  // Méthode de création de la grille
  createGrid: function (size) {
    // Suppression de l'ancienne grille
    while (this.invaderContainer.firstChild) {
      this.invaderContainer.removeChild(this.invaderContainer.firstChild);
    }

    // Création des lignes et des pixels
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < size; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (let col = 0; col < size; col++) {
        const pixelDiv = document.createElement("div");
        pixelDiv.classList.add("pixel");
        pixelDiv.style.width = `${this.pixelSize}px`;
        pixelDiv.style.height = `${this.pixelSize}px`;
        rowDiv.appendChild(pixelDiv);
      }
      fragment.appendChild(rowDiv);
    }

    this.invaderContainer.appendChild(fragment);

    // Mise en forme de la grille avec CSS Grid
    this.invaderContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    this.invaderContainer.style.width = `${size * this.pixelSize}px`; // Calcul dynamique de la largeur
  },

  generatePalette: function () {
    const palette = document.createElement("div");
    palette.classList.add("palette");

    this.styles.forEach((style) => {
      const colorButton = document.createElement("button"); // Utilisation de boutons
      colorButton.classList.add("color-button", style);
      colorButton.dataset.style = style;
      colorButton.addEventListener("click", () => {
        this.currentColor = style; // Mettre à jour la couleur actuelle
        this.updateActiveColor(); // Mettre à jour la couleur active visuellement
      });
      palette.appendChild(colorButton);
    });

    document.body.appendChild(palette);
  },
};

// Démarrage de l'application
app.init();