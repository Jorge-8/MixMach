"use client";
import React, { useState } from "react";
import "../styles.css";

const cocktails = [
  {
    id: 1,
    name: "Paloma",
    image: "https://laroussecocina.mx/wp-content/uploads/2022/03/Paloma-Lazhko-Svetlana-e1647436105920.png",
    ingredients: ["Tequila", "Refresco de toronja", "Limón", "Sal"],
    steps: ["Escarchar vaso", "Agregar hielo", "Añadir tequila"]
  },
  {
    id: 2,
    name: "Blue Diablo",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRniaTcgqZclsqi2mlAaYMMNWxZvyOQM_5WXA&s",
    ingredients: ["Tequila", "Blue Curacao", "Limón", "Sal"],
    steps: ["Escarchar vaso", "Agregar hielo", "Añadir tequila"]
  },
  {
    id: 3,
    name: "Tequila Sunrise",
    image: "https://cdn.recetasderechupete.com/wp-content/uploads/2022/11/Tequila-Sunrise.jpg",
    ingredients: ["Tequila", "Jugo de naranja", "Granadina"],
    steps: ["Agregar hielo", "Añadir tequila", "Agregar jugo"]
  }
];

const buscarIngrediente = (ingrediente) => {
  const query = encodeURIComponent(ingrediente);
  const url = `https://www.google.com/search?tbm=shop&q=${query}`;
  window.open(url, "_blank");
};

export default function CocktailApp() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [search, setSearch] = useState("");

  const allIngredients = [...new Set(cocktails.flatMap(c => c.ingredients))];

  const filteredIngredients = allIngredients.filter(ing =>
    ing.toLowerCase().includes(search.toLowerCase())
  );

  const addIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const scoredCocktails = cocktails
    .map(cocktail => {
      const matches = cocktail.ingredients.filter(i => selectedIngredients.includes(i)).length;
      return { ...cocktail, matches };
    })
    .sort((a, b) => b.matches - a.matches);

  if (selectedCocktail) {
    return (
      <div className="container">
        <div className="header-2">
          <button onClick={() => setSelectedCocktail(null)}>
             <img src="https://static.vecteezy.com/system/resources/thumbnails/043/008/323/small/black-and-white-color-speech-bubble-balloon-with-arrow-point-icon-sticker-memo-keyword-planner-text-box-banner-png.png" alt="Icono" className="boton"></img>
             </button>
          <img src="https://i.ibb.co/cSFW5YHW/Captura-de-pantalla-2026-04-04-184710.png" className="mixmatch"></img>
        </div>

        <div className="detail">
          <h1 className="title">{selectedCocktail.name}</h1>
          <img src={selectedCocktail.image} className="detail-img" />

          <h2>Ingredientes:</h2>
{selectedCocktail.ingredients.map((ing, i) => {
  const tiene = selectedIngredients.includes(ing);

  return (
    <div key={i} className="ingredient-row">
      <span className={tiene ? "ok" : "missing"}>
        {tiene ? "✔" : "✖"} {ing}
      </span>

      {!tiene && (
        <button
          className="cart-btn"
          onClick={() => buscarIngrediente(ing)}
        >
          🛒
        </button>
      )}
    </div>
  );
})}
          <h2>Preparación:</h2>
          <ol>
            {selectedCocktail.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
       
      <div className="header">
        
        <img src="https://i.ibb.co/cSFW5YHW/Captura-de-pantalla-2026-04-04-184710.png" className="mixmatch"></img>
        <input
          type="text"
          placeholder="Buscar ingrediente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
          
        <div className="search-list">
          {filteredIngredients.map((ingredient, i) => (
            <div key={i} className="search-item" onClick={() => addIngredient(ingredient)}>
              {ingredient}
            </div>
          ))}
          
        </div>
        
      </div>

      <div className="ingredients-bar">
        {selectedIngredients.map((ing, i) => (
          <div key={i} className="ingredient-tag">
            {ing}
            <button onClick={() => removeIngredient(ing)}>
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828778.png" alt="Icono" className="boton-x"></img>
                
                </button>
          </div>
        ))}
      </div>

      <div className="cards">
        {scoredCocktails.map(cocktail => {
          const missing = cocktail.ingredients.filter(i => !selectedIngredients.includes(i));

          return (
            <div key={cocktail.id} className="card" onClick={() => setSelectedCocktail(cocktail)}>
              <img src={cocktail.image} />

              {missing.length > 0 && (
                <div className="overlay">
                  {missing.map((m, i) => (
                    <div key={i}>✖ {m}</div>
                  ))}
                </div>
              )}

              <div className="card-title">{cocktail.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
