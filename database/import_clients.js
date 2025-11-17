import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CSV file
const csvPath = path.join(__dirname, '../../cliente.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (semicolon-delimited)
const lines = csvContent.split('\n').filter(line => line.trim());
const header = lines[0].split(';');

// Generate SQL INSERT statements
let sqlStatements = [];
sqlStatements.push('-- Import clients data');
sqlStatements.push('BEGIN;');
sqlStatements.push('');

// Function to escape SQL strings
function escapeSql(str) {
  if (!str || str.trim() === '') return 'NULL';
  return `'${str.replace(/'/g, "''").replace(/\n/g, ' ').trim()}'`;
}

// Function to parse date (if present)
function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return 'NULL';
  // Try to parse the date - adjust format as needed
  // For now, return NULL if empty
  return 'NULL';
}

// Process each data line
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const values = line.split(';');
  
  // Ensure we have enough columns
  while (values.length < header.length) {
    values.push('');
  }
  
  const id = values[0]?.trim();
  const nomeCliente = values[1]?.trim() || '';
  const telCelular = values[2]?.trim() || '';
  const email = values[3]?.trim() || '';
  const nacionalidade = values[4]?.trim() || '';
  const obs = values[5]?.trim() || '';
  const cpf = values[6]?.trim() || '';
  const dataNasc = values[7]?.trim() || '';
  
  // Skip if ID is empty or invalid
  if (!id || id === '0' || isNaN(parseInt(id))) {
    continue;
  }
  
  const sql = `INSERT INTO clients (id, nome_cliente, tel_celular, email, nacionalidade, obs, cpf, data_nasc) 
VALUES (${id}, ${escapeSql(nomeCliente)}, ${escapeSql(telCelular)}, ${escapeSql(email)}, ${escapeSql(nacionalidade)}, ${escapeSql(obs)}, ${escapeSql(cpf)}, ${parseDate(dataNasc)});`;
  
  sqlStatements.push(sql);
}

sqlStatements.push('');
sqlStatements.push('COMMIT;');

// Write to SQL file
const outputPath = path.join(__dirname, 'import_clients_data.sql');
fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf-8');

console.log(`Generated ${sqlStatements.length - 4} INSERT statements`);
console.log(`Output written to: ${outputPath}`);

