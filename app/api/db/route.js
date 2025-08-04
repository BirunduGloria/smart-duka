import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(dbData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return NextResponse.json(
      { error: 'Failed to read database file' },
      { status: 500 }
    );
  }
} 