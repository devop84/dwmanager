import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV file - using absolute path
const csvPath = 'C:\\Users\\valen\\OneDrive\\Área de Trabalho\\cliente.csv';

function escapeSql(str) {
  if (!str || str.trim() === '') return 'NULL';
  return `'${str.replace(/'/g, "''").replace(/\n/g, ' ').trim()}'`;
}

function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return 'NULL';
  return 'NULL';
}

// Read CSV file
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

const sqlStatements = [];
sqlStatements.push('-- Import clients data from CSV');
sqlStatements.push('-- This file was generated from cliente.csv');
sqlStatements.push('');
sqlStatements.push('BEGIN;');
sqlStatements.push('');

// Process each data line (skip header)
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Split by semicolon
  const values = line.split(';');
  
  // Ensure we have 8 columns
  while (values.length < 8) {
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
  
  // Skip invalid IDs
  if (!id || id === '0' || isNaN(parseInt(id))) {
    continue;
  }
  
  // Build INSERT statement
  const sql = `INSERT INTO clients (id, nome_cliente, tel_celular, email, nacionalidade, obs, cpf, data_nasc) VALUES (${id}, ${escapeSql(nomeCliente)}, ${escapeSql(telCelular)}, ${escapeSql(email)}, ${escapeSql(nacionalidade)}, ${escapeSql(obs)}, ${escapeSql(cpf)}, ${parseDate(dataNasc)});`;
  sqlStatements.push(sql);
}

sqlStatements.push('');
sqlStatements.push('COMMIT;');

// Write to SQL file
const outputPath = path.join(__dirname, 'import_clients_data.sql');
fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf-8');

console.log(`Generated ${sqlStatements.length - 5} INSERT statements`);
console.log(`Output written to: ${outputPath}`);

