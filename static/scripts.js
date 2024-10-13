// Флаг для отображения или скрытия списка блюд
let searchVisible = false;

// Обработка отправки формы добавления блюда
document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Отправляем данные на сервер
    fetch('/add_dish', {
        method: 'POST',
        body: new FormData(event.target)
    })
    .then(() => {
        event.target.reset(); 
        updateDishes(); 
    });
});

// Загружаем список блюд с сервера
function updateDishes() {
    fetch('/dishes')
        .then(response => response.json())
        .then(dishes => {
            const dishList = document.getElementById('dish-list');
            dishList.innerHTML = '';
            
            dishes.forEach(dish => {
                const new_dish = document.createElement('li'); 
                new_dish.innerHTML = `${dish.name} - BMR: ${dish.bmr} 
                <button onclick="deleteDish(${dish.id})">Удалить</button>
                <button onclick="selectDish(${dish.id}, '${dish.name}', ${dish.bmr})">Выбрать</button>`;
                dishList.appendChild(new_dish); 
            });
        });
}

// Поиск блюд по названию
function searchDishes() {
    const query = document.getElementById('search-input').value; 
    fetch(`/search_dishes?q=${query}`) 
        .then(response => response.json())
        .then(dishes => {
            const dishList = document.getElementById('dish-list');
            dishList.innerHTML = ''; // Удаление из списка
            
            dishes.forEach(dish => {
                const new_dish = document.createElement('li'); 
                new_dish.innerHTML = `${dish.name} - BMR: ${dish.bmr} 
                <button onclick="deleteDish(${dish.id})">Удалить</button>
                <button onclick="selectDish(${dish.id}, '${dish.name}', ${dish.bmr})">Выбрать</button>`;
                dishList.appendChild(new_dish);
            });
        });
}

// Переключение видимости списка блюд
function Visibility() {
    const dishList = document.getElementById('dish-list');
    if (searchVisible) {
        dishList.style.display = 'none'; 
        document.getElementById('show-search').textContent = 'Показать список'; 
    } else {
        dishList.style.display = 'block'; 
        document.getElementById('show-search').textContent = 'Скрыть список'; 
    }
    searchVisible = !searchVisible; // Переключаем флаг видимости
}

// Выбор блюда для графика
function selectDish(dishId, name, bmr) {
    const selectedDishList = document.getElementById('selected-dish-list');
    const new_dish = document.createElement('li'); // Переименовано
    new_dish.innerHTML = `${name} - BMR: ${bmr} <button onclick="removeSelectedDish(this, ${dishId})">Удалить</button>`;
    new_dish.setAttribute('data-id', dishId); 
    selectedDishList.appendChild(new_dish); 
}

// Удаление выбранного блюда из списка
function removeSelectedDish(button, dishId) {
    button.parentElement.remove(); 
}

// Удаление блюда
function deleteDish(dishId) {
    fetch(`/delete_dish/${dishId}`, {
        method: 'DELETE' 
    })
    .then(() => {
        updateDishes(); 
    });
}

updateDishes(); 
