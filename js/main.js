const aside = document.querySelector("aside");
const sections = document.querySelector(".sections");
const icon = document.querySelector(".icon");
const loadingLayer = document.querySelector(".loading-layer");
let mealsRow = document.querySelector(".meals-row");
const categoryLink = document.getElementById("categories");

// document.onload = lodingEffect();
categoryLink.addEventListener("click", getMealsCategories);
icon.addEventListener("click", function () {
  if (icon.classList.contains("fa-xmark")) {
    aside.style.transform = `translateX(${-sections.clientWidth}px)`;
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-burger");
  } else {
    aside.style.transform = `translateX(0)`;
    icon.classList.remove("fa-burger");
    icon.classList.add("fa-xmark");
  }
});

fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=").then((res) => {
  res.json().then((data) => {
    data = data.meals;
    displayMeals(data);
  });
});

function getMealDesc(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(
    (res) => {
      res.json().then((mealDesc) => {
        mealDesc = mealDesc.meals[0];
        displayMealDesc(mealDesc);
      });
    }
  );
}

function displayMealDesc(meal) {
  let meals = ` 
      
          <div class="col-md-4">
            <div class="meal-desc-img">
              <img src="${meal.strMealThumb}" class="w-100" alt="" />
              <p class="meal-desc-name">${meal.strMeal}</p>
            </div>
          </div>
          <div class="col-md-8">
            <div>
              <h2 class="meal-desc-name">${meal.strMeal}</h2>
              <p>${meal.strInstructions}</p>
              <p>Area: ${meal.strArea}</p>
              <p>Category: ${meal.strCategory}</p>
              <p>Recipes:</p>
              <ul class="recipes-list list-unstyled d-flex">
                <li class="ingredient">hamada</li>
                <li class="ingredient">miada</li>
              </ul>
              <p>Tags:</p>
              <ul class="tags-list list-unstyled d-flex">
                <li class="ingredient">Hamda tag</li>
                <li class="ingredient">Hamda tag</li>
              </ul>
              <ul class="list-unstyled social-media-list d-flex">
                <li class="ingredient">youtube</li>
                <li class="ingredient">youtube</li>
              </ul>
            </div>
          </div>
  
`;

  mealsRow.innerHTML = meals;
}

function getMealsCategories() {
  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php
`)
    .then((res) => {
      return res.json();
    })
    .then((categories) => {
      displayCategories(categories.categories);
    });
}

function displayCategories(categories) {
  let categoriesHtml = ``;
  for (let i = 0; i < categories.length; i++) {
    categoriesHtml += `
       <div class="col-md-4 col-lg-3 meal-categories">
            <div class="position-relative meal" onclick="filterByCate('${categories[i].strCategory}')"  id="${categories[i].idCategory}">
              <img
                class="meal-img bg-info w-100 rounded-2"
                src="${categories[i].strCategoryThumb}"
                alt=""
              />
              <div
                class="meal-layer overflow-hidden rounded-2 d-flex justify-content-center align-items-center position-absolute start-0 top-100 end-0 bottom-0 bg-black"
              >
               ${categories[i].strCategory}
              </div>
            </div>
          </div>
  `;
    mealsRow.innerHTML = categoriesHtml;
  }
}

function filterByCate(category) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  ).then((res) => {
    res.json().then((meals) => {
      displayMeals(meals.meals);
    });
  });
}

function getAllAreas() {
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`).then(
    (res) => {
      res.json().then((areas) => {
        console.log(areas.meals);
        displayAreas(areas.meals);
      });
    }
  );
}
const areaLink = document
  .getElementById("area")
  .addEventListener("click", getAllAreas);

function displayAreas(areas) {
  let mealsAreas = "";
  for (let i = 0; i < areas.length; i++) {
    mealsAreas += `
      <div class="col-md-3 text-center" onclick="filterByArea('${areas[i].strArea}')" id="${areas[i].strArea}">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <p>${areas[i].strArea}</p>
            </div>
    `;
  }
  mealsRow.innerHTML = mealsAreas;
}

function filterByArea(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${id}`).then(
    (res) => {
      res.json().then((areaMeals) => {
        console.log(areaMeals);
        displayMeals(areaMeals.meals);
      });
    }
  );
}

function getAllIngrediants() {
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`).then(
    (res) => {
      {
        res.json().then((igerdiants) => {
          igerdiants = igerdiants.meals.slice(0, 25);
          displayIngrediants(igerdiants);
        });
      }
    }
  );
}

function displayIngrediants(ingrediants) {
  let mealsIngrediants = "";
  for (let i = 0; i < ingrediants.length; i++) {
    mealsIngrediants += `
      <div class="col-md-3 text-center" onclick="filterByIngrediants('${
        ingrediants[i].strIngredient
      }')" id="${ingrediants[i].strIngredient}">
    <i class="fa-solid fa-bowl-rice fa-4x"></i>
              <p>${ingrediants[i].strIngredient}</p>
              <p>${ingrediants[i].strDescription
                .split(" ")
                .slice(0, 20)
                .join(" ")}
            </div>
    `;
  }
  mealsRow.innerHTML = mealsIngrediants;
}

const ingrediantsLinl = document
  .getElementById("ingredients")
  .addEventListener("click", getAllIngrediants);

function filterByIngrediants(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${id}`).then(
    (res) => {
      res.json().then((ingrediants) => {
        console.log(ingrediants);
        displayMeals(ingrediants.meals);
      });
    }
  );
}

function displayMeals(data) {
  let meals = "";
  for (let i = 0; i < data.length; i++) {
    meals += `
          <div class="col-md-4 col-lg-3">
        <div
          class="position-relative meal"
          onclick=" getMealDesc('${data[i].idMeal}')"
          id="${data[i].idMeal}"
        >
          <img
            class="meal-img bg-info w-100 rounded-2"
            src="${data[i].strMealThumb}"
            alt=""
          />
          <div
            class="meal-layer overflow-hidden rounded-2 d-flex justify-content-center align-items-center position-absolute start-0 top-100 end-0 bottom-0 bg-black"
          >
            ${data[i].strMeal}
          </div>
        </div>
      </div>

  `;
  }
  mealsRow.innerHTML = meals;
}

// function lodingEffect() {
//   loadingLayer.style.opacity = "0";
//   loadingLayer.style.visability = "hidden";
//   loadingLayer.style.visability = "hidden";
//   loadingLayer.addEventListener("transitionend", () => {
//     loadingLayer.remove();
//   });
// }
