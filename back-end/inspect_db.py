from sqlalchemy import create_engine, inspect

def inspect_tables():
    engine = create_engine('postgresql://postgres:123456@localhost:5432/postgres')
    inspector = inspect(engine)
    
    tables = ['nz_valuation_roll', 'nz_property_address_ref', 'nz_addresses']
    
    print('Tables:', inspector.get_table_names())
    for table in tables:
        print(f'\n{table} columns:')
        for col in inspector.get_columns(table):
            print(f'{col["name"]}: {col["type"]}')

if __name__ == '__main__':
    inspect_tables()
