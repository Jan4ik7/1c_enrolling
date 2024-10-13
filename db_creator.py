import sqlite3

# Подключение к базе данных
def db_connection():
    db = sqlite3.connect('dishes.db')
    db.row_factory = sqlite3.Row
    return db

# Инициализация базы данных
def init_db():
    with db_connection() as db:
        db.execute('''
            CREATE TABLE IF NOT EXISTS dishes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                bmr REAL NOT NULL
            )
        ''')
    print("База данных инициализирована.")

# Optional: run this when the script is executed directly
if __name__ == "__main__":
    init_db()
