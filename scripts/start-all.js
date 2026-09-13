import 'dotenv/config';
import { spawn } from 'node:child_process';
import * as path from 'node:path';

const services = [
  { name: 'audit-service', port: 4005, dir: 'apps/audit-service' },
  { name: 'auth-service', port: 4004, dir: 'apps/auth-service' },
  { name: 'patient-service', port: 4001, dir: 'apps/patient-service' },
  { name: 'appointment-service', port: 4002, dir: 'apps/appointment-service' },
  { name: 'clinical-service', port: 4003, dir: 'apps/clinical-service' },
  { name: 'api-gateway', port: 4000, dir: 'apps/api-gateway' },
];

console.log('====================================================');
console.log('🚀 Starting Hospital Platform Microservices Mesh...');
console.log('====================================================');

const children = [];

for (const svc of services) {
  const cwd = path.resolve(process.cwd(), svc.dir);
  const child = spawn('node', ['dist/index.js'], {
    cwd,
    env: { ...process.env, PORT: svc.port.toString() },
    stdio: 'pipe'
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line) console.log(`[\x1b[36m${svc.name}\x1b[0m] ${line}`);
    }
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line) console.error(`[\x1b[31m${svc.name}\x1b[0m] ${line}`);
    }
  });

  child.on('close', (code) => {
    console.log(`[${svc.name}] Process exited with code ${code}`);
  });

  children.push(child);
}

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all hospital microservices...');
  for (const child of children) {
    child.kill('SIGINT');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  for (const child of children) {
    child.kill('SIGTERM');
  }
  process.exit(0);
});
