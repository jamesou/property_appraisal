import psycopg2
from psycopg2 import Error

def get_db_connection():
    try:
        connection = psycopg2.connect(
            host="localhost",
            port="5432",
            database="postgres",
            user="postgres",
            password="123456"
        )
        print("Successfully connected to PostgreSQL database!")
        return connection
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL:", error)
        return None

if __name__ == "__main__":
    # Test the connection
    conn = get_db_connection()
    if conn:
        conn.close()
        print("Database connection closed.")
