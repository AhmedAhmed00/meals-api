let mainPage = document.querySelector(".main");
const aside = document.querySelector("aside");
const sections = document.querySelector(".sections");
const icon = document.querySelector(".icon");
const loadingLayer = document.querySelector(".loading-layer");
let mealList = document.querySelector(".meals-row");

document.onload = lodingEffect();

mealList.addEventListener("click", function (e) {
  getMealDesc(e);
});
fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=").then((res) => {
  res.json().then((data) => {
    data = data.meals;
    displayMeals(data);
  });
});

function getMealDesc(e) {
  let id = e.target.parentElement.getAttribute("id");
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(
    (res) => {
      res.json().then((mealDesc) => {
        mealDesc = mealDesc.meals[0];
        lodingEffect();
        displayMealDesc(mealDesc);
      });
    }
  );
}

function displayMealDesc(meal) {
  let descRow = ` 
       <section class="meal-info">
      <div class="container">
        <div class="row desc-row">
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
        </div>
      </div>
    </section>
`;

  mainPage.innerHTML = descRow;
}

function displayMeals(data) {
  const mealsRow = document.querySelector(".meals-row");
  let meals = "";
  for (let i = 0; i < data.length; i++) {
    meals += `
   <div class="col-md-4 col-lg-3 ">
            <div class="position-relative meal " id="${data[i].idMeal}">
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

function lodingEffect() {
  loadingLayer.style.opacity = "0";
  loadingLayer.style.visability = "hidden";
  loadingLayer.style.visability = "hidden";
  loadingLayer.addEventListener("transitionend", () => {
    loadingLayer.remove();
  });
}

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
