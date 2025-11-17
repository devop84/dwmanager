#!/usr/bin/env python3
import csv
import sys
import os

# Path to CSV file
csv_path = os.path.join(os.path.dirname(__file__), '../../cliente.csv')

def escape_sql(value):
    """Escape SQL string values"""
    if not value or value.strip() == '':
        return 'NULL'
    # Replace single quotes with double single quotes for SQL
    escaped = value.replace("'", "''").replace('\n', ' ').strip()
    return f"'{escaped}'"

def parse_date(date_str):
    """Parse date string - returns NULL if empty"""
    if not date_str or date_str.strip() == '':
        return 'NULL'
    return 'NULL'  # Date field appears empty in CSV

# Read CSV and generate SQL
sql_statements = []
sql_statements.append('-- Import clients data from CSV')
sql_statements.append('BEGIN;')
sql_statements.append('')

try:
    with open(csv_path, 'r', encoding='utf-8') as f:
        # Read all lines
        lines = f.readlines()
        
        # Skip header
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
            
            # Split by semicolon
            values = line.split(';')
            
            # Ensure we have 8 columns
            while len(values) < 8:
                values.append('')
            
            id_val = values[0].strip()
            nome_cliente = values[1].strip() if len(values) > 1 else ''
            tel_celular = values[2].strip() if len(values) > 2 else ''
            email = values[3].strip() if len(values) > 3 else ''
            nacionalidade = values[4].strip() if len(values) > 4 else ''
            obs = values[5].strip() if len(values) > 5 else ''
            cpf = values[6].strip() if len(values) > 6 else ''
            data_nasc = values[7].strip() if len(values) > 7 else ''
            
            # Skip invalid IDs
            if not id_val or id_val == '0' or not id_val.isdigit():
                continue
            
            # Build INSERT statement
            sql = f"INSERT INTO clients (id, nome_cliente, tel_celular, email, nacionalidade, obs, cpf, data_nasc) VALUES ({id_val}, {escape_sql(nome_cliente)}, {escape_sql(tel_celular)}, {escape_sql(email)}, {escape_sql(nacionalidade)}, {escape_sql(obs)}, {escape_sql(cpf)}, {parse_date(data_nasc)});"
            sql_statements.append(sql)
    
    sql_statements.append('')
    sql_statements.append('COMMIT;')
    
    # Write to SQL file
    output_path = os.path.join(os.path.dirname(__file__), 'import_clients_data.sql')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"Generated {len(sql_statements) - 4} INSERT statements")
    print(f"Output written to: {output_path}")
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)

