from flask import Flask, request, render_template
import sqlite3
from db_creator import db_connection

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add_dish', methods=['POST'])
def add_dish():
    data = request.form
    with db_connection() as db:
        cursor = db.execute('''
            INSERT INTO dishes (name, bmr)
            VALUES (?, ?)
        ''', (data['name'], data['bmr']))
        db.commit()
        dish_id = cursor.lastrowid
    return f'Блюдо добавлено! ID: {dish_id}', 201

@app.route('/dishes', methods=['GET'])
def get_dishes():
    with db_connection() as db:
        dishes = db.execute('SELECT * FROM dishes').fetchall()
    return [{'id': dish['id'], 'name': dish['name'], 'bmr': dish['bmr']} for dish in dishes], 200

@app.route('/edit_dish/<int:dish_id>', methods=['PUT'])
def edit_dish(dish_id):
    data = request.form
    with db_connection() as db:
        db.execute('''
            UPDATE dishes
            SET name = ?, bmr = ?
            WHERE id = ?
        ''', (data['name'], data['bmr'], dish_id))
        db.commit()
    return 'Блюдо обновлено!', 200

@app.route('/delete_dish/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    with db_connection() as db:
        db.execute('DELETE FROM dishes WHERE id = ?', (dish_id,))
        db.commit()
    return 'Блюдо удалено!', 200

@app.route('/search_dishes', methods=['GET'])
def search_dishes():
    query = request.args.get('q')
    with db_connection() as db:
        dishes = db.execute('SELECT * FROM dishes WHERE name LIKE ?', ('%' + query + '%',)).fetchall()
    return [{'id': dish['id'], 'name': dish['name'], 'bmr': dish['bmr']} for dish in dishes], 200

@app.route('/bmr_data', methods=['POST'])
def get_calories_data():
    dish_ids = request.json.get('dish_ids', [])
    bmr_data = []
    
    with db_connection() as db:
        for dish_id in dish_ids:
            dish = db.execute('SELECT * FROM dishes WHERE id = ?', (dish_id,)).fetchone()
            if dish:
                bmr_data.append({"name": dish['name'], "bmr": dish['bmr']})
    
    return bmr_data, 200

if __name__ == '__main__':
    app.run(debug=True)
