import pandas as pd
from db_connection import get_db_connection
from sqlalchemy import create_engine
import sys

def create_table_if_not_exists(connection, df):
    try:
        # Use TEXT for all columns to handle mixed data types
        columns_def = [f"{col.lower()} TEXT" for col in df.columns]
        create_table_sql = f"""
            CREATE TABLE IF NOT EXISTS nz_addresses (
                id SERIAL PRIMARY KEY,
                {', '.join(columns_def)}
            )
        """
        
        with connection.cursor() as cursor:
            cursor.execute("DROP TABLE IF EXISTS nz_addresses")
            cursor.execute(create_table_sql)
        connection.commit()
        print("Table created successfully.")
    except Exception as e:
        print(f"Error creating table: {e}")
        sys.exit(1)

def import_csv_to_postgres():
    try:
        # Read the first row to get column structure
        df_sample = pd.read_csv('nz-addresses.csv', nrows=1)
        
        # Connect to database
        conn = get_db_connection()
        if not conn:
            print("Failed to connect to database")
            return
            
        # Create table with correct structure
        create_table_if_not_exists(conn, df_sample)
        
        # Create SQLAlchemy engine for pandas
        engine = create_engine('postgresql://postgres:123456@localhost:5432/postgres')
        
        # Read and process CSV in chunks
        chunksize = 10000  # Smaller chunks to handle memory better
        total_rows = 0
        
        for chunk_number, chunk in enumerate(pd.read_csv('nz-addresses.csv', chunksize=chunksize, low_memory=False)):
            # Convert all columns to string to handle mixed data types
            chunk = chunk.astype(str)
            
            # Clean column names (remove spaces, special characters)
            chunk.columns = [col.lower() for col in chunk.columns]
            
            # Import chunk to postgres
            chunk.to_sql('nz_addresses', engine, if_exists='append', index=False)
            total_rows += len(chunk)
            print(f"Imported chunk {chunk_number + 1} ({total_rows} rows processed)")
        
        print(f"Data import completed successfully! Total rows imported: {total_rows}")
        
    except Exception as e:
        print(f"Error during import: {e}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    import_csv_to_postgres()
