const aside = document.querySelector("aside");
const innerSideBar = document.querySelector(".inner-side-bar");
const sideBarIcon = document.querySelector(".side-bar-icon");
const mealsRow = document.querySelector(".meals-row");
const searchLink = document.getElementById("search");
const searchContainer = document.querySelector(".search-container");
const categoryLink = document.getElementById("categories");
const areaLink = document.getElementById("area");
const ingrediantsLink = document.getElementById("ingredients");
const contactLink = document.getElementById("contact");
const contacstForm = document.getElementById("contacts-form");
const links = Array.from(document.querySelectorAll("li"));

window.addEventListener("load", function () {
  aside.style.transform = `translateX(${-innerSideBar.clientWidth}px)`;
  handleLoading();
});

links.forEach((li) => {
  li.addEventListener("click", function () {
    handleSideBarClick();
    handleLoading();
    contacstForm.innerHTML = "";
    mealsRow.innerHTML = "";
    searchContainer.innerHTML = "";
  });
});

searchLink.addEventListener("click", displaySearchPage);
categoryLink.addEventListener("click", getMealsCategories);
areaLink.addEventListener("click", getAllAreas);
ingrediantsLink.addEventListener("click", getAllIngrediants);
contactLink.addEventListener("click", displayContact);
sideBarIcon.addEventListener("click", handleSideBarClick);
contacstForm.addEventListener("submit", function (e) {
  if (
    validateName() &&
    validatePhone &&
    validateAge() &&
    validateEmail() &&
    validatePass() &&
    validateRePass()
  ) {
    return true;
  } else {
    e.preventDefault();
  }
});

fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=").then((res) => {
  res.json().then((data) => {
    data = data.meals;
    displayMeals(data);
  });
});

function handleSideBarClick() {
  if (sideBarIcon.classList.contains("fa-xmark")) {
    aside.style.transform = `translateX(${-innerSideBar.clientWidth}px)`;
    sideBarIcon.classList.remove("fa-xmark");
    sideBarIcon.classList.add("fa-burger");
    for (let i = 0; i < links.length; i++) {
      setTimeout(() => {
        links[i].style.left = "-200px";
      }, 100 * i);
    }
  } else {
    aside.style.transform = `translateX(0)`;
    sideBarIcon.classList.remove("fa-burger");
    sideBarIcon.classList.add("fa-xmark");
    for (let i = 0; i < links.length; i++) {
      setTimeout(() => {
        links[i].style.left = "0";
      }, 100 * i);
    }
  }
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
            class="meal-layer text-black fw-bold fs-4 overflow-hidden rounded-2 d-flex justify-content-center align-items-center position-absolute start-0 top-100 end-0 bottom-0"
          >
            ${data[i].strMeal}
          </div>
        </div>
      </div>

  `;
  }
  mealsRow.innerHTML = meals;
}

function displaySearchPage() {
  handleLoading();
  mealsRow.innerHTML = "";
  let searchPage = `
   <div class="row gx-3 search-inputs pt-5">
   <div class="col-md-6">
        <input class="w-100"  type="search" placeholder="Search By Name" onkeyup="searchByName(this.value)" />
        </div>
         <div class="col-md-6">
        <input class="w-100"  type="search" placeholder="Search By Firest Letter" onkeyup="searchByFirestLetter(this.value)"  maxlength="1" />
              </div>
      </div>
  `;
  searchContainer.classList.remove("d-none");
  searchContainer.innerHTML = searchPage;
}

function searchByName(value) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`).then(
    (res) => {
      res
        .json()
        .then((resValue) => {
          if (resValue) {
            displayMeals(resValue.meals);
          }
        })
        .catch((err) => {
          console.log(err);
          mealsRow.innerHTML = `<p class ="text-center text-white py-5 fs-1 ">Not Found</p>`;
        });
    }
  );
}

function searchByFirestLetter(value) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`).then(
    (res) => {
      res
        .json()
        .then((resValue) => {
          if (resValue) {
            displayMeals(resValue.meals);
          }
        })
        .catch((err) => {
          console.log(err);
          mealsRow.innerHTML = `<p class ="text-center text-white py-5 fs-1 ">Not Found</p>`;
        });
    }
  );
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
            <div class="position-relative meal  text-" onclick="filterByCate('${categories[i].strCategory}')"  id="${categories[i].idCategory}">
              <img
                class="meal-img bg-info w-100 rounded-2"
                src="${categories[i].strCategoryThumb}"
                alt=""
              />
              <div
                class="meal-layer text-black fw-bold fs-4 overflow-hidden rounded-2 d-flex justify-content-center align-items-center position-absolute start-0 top-100 end-0 bottom-0"
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
        displayAreas(areas.meals);
      });
    }
  );
}

function displayAreas(areas) {
  handleLoading();
  let mealsAreas = "";
  for (let i = 0; i < areas.length; i++) {
    mealsAreas += `
      <div class="col-md-3 text-center" onclick="filterByArea('${areas[i].strArea}')" id="${areas[i].strArea}">
        <div class='border  area p-3 rounded-2'>
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <p class="mt-2 fs-2">${areas[i].strArea}</p>
            </div>
            </div>
    `;
  }
  mealsRow.innerHTML = mealsAreas;
}

function filterByArea(areaId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaId}`).then(
    (res) => {
      res.json().then((areaMeals) => {
        handleLoading();
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
  searchContainer.innerHTML = "";
  let mealsIngrediants = "";
  for (let i = 0; i < ingrediants.length; i++) {
    mealsIngrediants += `

      <div class="col-md-3 text-center" onclick="filterByIngrediants('${
        ingrediants[i].strIngredient
      }')" id="${ingrediants[i].strIngredient}">
      <div class='border ingrediant p-3 rounded-2'>
    <i class="fa-solid fa-bowl-rice fa-4x"></i>
              <p class="mt-2 fs-2">${ingrediants[i].strIngredient}</p>
              <p>${ingrediants[i].strDescription
                .split(" ")
                .slice(0, 20)
                .join(" ")}
            </div>
            </div>
    `;
  }
  mealsRow.innerHTML = mealsIngrediants;
}

function filterByIngrediants(ingrediantId) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediantId}`
  ).then((res) => {
    res.json().then((ingrediants) => {
      handleLoading();
      displayMeals(ingrediants.meals);
    });
  });
}

function displayContact() {
  const contacts = `
          <div class="row gx-3 gy-2 pt-5">
      <div class="col-md-6">
        <div>
          <input
            class="w-100"
            type="text"
            name=""
            id="name-input"
            placeholder="Enter Your Name"
            onblur="validateName()"
          />
          <div class="alert alert-danger p-1 name-alert d-none" role="alert">
            Please provide a valid Name.
          </div>
        </div>
        <div>
          <input
            class="w-100"
            type="text"
            name=""
            id="email-input"
            placeholder="Enter Your Email"
            onblur="validateEmail()"
          />
          <div class="alert alert-danger p-1 email-alert d-none" role="alert">
            Please provide a valid Email.
          </div>
        </div>
        <div>
          <input
            class="w-100"
            type="text"
            name=""
            id="phone-input"
            placeholder="Enter Your Phone"
            onblur="validatePhone()"
          />
          <div class="alert alert-danger p-1 phone-alert d-none" role="alert">
            Must be Egyption Number
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div>
          <input
            class="w-100"
            type="number"
            name=""
            id="age-input"
            placeholder="Enter Your Age"
            onblur="validateAge()"
          />
          <div class="alert alert-danger p-1 age-alert d-none" role="alert">
            Age between 12 - 99
          </div>
        </div>
        <div>
          <input
            class="w-100"
            type="password"
            name=""
            id="pass-input"
            placeholder="Password"
            onblur="validatePass()"
          />
          <div class="alert alert-danger p-1 pass-alert  d-none" role="alert">
            Must contain capital and small letters and at least number and
            speacial char
          </div>
        </div>
        <div>
          <input
            class="w-100"
            type="password"
            name=""
            id="repass-input"
            placeholder="Repassword"
            onblur="validateRePass()"
          />
          <div class="alert alert-danger repass-alert p-1 d-none" role="alert">
            Not valid or password confirmation doesn't match
          </div>
        </div>
      </div>
      <input class="m-auto bg-info text-white col-md-4" id="confirm-form" type="submit" value="Send" />
    </div>

  `;
  contacstForm.innerHTML = contacts;
}

function getMealDesc(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`).then(
    (res) => {
      res.json().then((mealDesc) => {
        mealDesc = mealDesc.meals[0];
        displayMealDesc(mealDesc);
      });
    }
  );
}

function displayMealDesc(meal) {
  handleLoading();
  searchContainer.innerHTML = "";
  let ingredients = "";
  for (let i = 0; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  const meals = ` 
          <div class="col-md-5">
            <div class="meal-desc-img ">
              <img src="${meal.strMealThumb}" class="w-100 rounded-2" alt="" />
              <p class="meal-desc-name fs-3 mt-2">${meal.strMeal}</p>
            </div>
          </div>
          <div class="col-md-7">
            <div>
              <h2>Instructions</h2>
              <p class="lead" >${meal.strInstructions}</p>
              <p>Area: ${meal.strArea}</p>
              <p>Category: ${meal.strCategory}</p>
              <p>Recipes:</p>
              <ul class="list-unstyled d-flex flex-wrap">
                ${ingredients}
              </ul>

              <p>Tags:</p>
              <ul class="list-unstyled social-media-list d-flex">
                <li> <a href="${meal.strYoutube}" class=" text-decoration-none bg-danger text-white m-2 p-1 rounded-1">Youtube</a> </li>
                <li> <a href="${meal.strSource}" class=" text-decoration-none bg-success text-white  m-2 p-1 rounded-1">Source</a> </li>
            
              </ul>
            </div>
          </div>
`;
  mealsRow.innerHTML = meals;
}

function validateName() {
  regexName = /^[a-zA-Z ]+$/;
  if (regexName.test(document.getElementById("name-input").value)) {
    document.querySelector(".name-alert").classList.add("d-none");
    return true;
  } else {
    document.querySelector(".name-alert").classList.remove("d-none");
    return false;
  }
}

function validatePhone() {
  regexPhone = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/g;
  if (regexPhone.test(document.getElementById("phone-input").value)) {
    document.querySelector(".phone-alert").classList.add("d-none");
    return true;
  } else {
    document.querySelector(".phone-alert").classList.remove("d-none");
    return false;
  }
}

function validateAge() {
  regexAge = /^(1[2-9]|[2-9]\d)$/gm;
  if (regexAge.test(document.getElementById("age-input").value)) {
    document.querySelector(".age-alert").classList.add("d-none");
    return true;
  } else {
    document.querySelector(".age-alert").classList.remove("d-none");
    return false;
  }
}
function validateEmail() {
  regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (regexEmail.test(document.getElementById("email-input").value)) {
    document.querySelector(".email-alert").classList.add("d-none");
    return true;
  } else {
    document.querySelector(".email-alert").classList.remove("d-none");
    return false;
  }
}

function validatePass() {
  regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (regexPass.test(document.getElementById("pass-input").value)) {
    document.querySelector(".pass-alert").classList.add("d-none");
    return true;
  } else {
    document.querySelector(".pass-alert").classList.remove("d-none");
    return false;
  }
}

function validateRePass() {
  regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (
    regexPass.test(document.getElementById("pass-input").value) &&
    document.getElementById("pass-input").value ===
      document.getElementById("repass-input").value
  ) {
    document.querySelector(".repass-alert").classList.add("d-none");
    return true;
  } else {
    document.querySelector(".repass-alert").classList.remove("d-none");
    return false;
  }
}

function handleLoading() {
  const loadingLayer = document.querySelector(".loading-layer");
  loadingLayer.style.display = "block";
  loadingLayer.style.opacity = 1;
  setTimeout(() => {
    loadingLayer.style.opacity = "0";
  }, 500);
  loadingLayer.addEventListener("transitionend", () => {
    loadingLayer.style.display = "none";
  });
}
