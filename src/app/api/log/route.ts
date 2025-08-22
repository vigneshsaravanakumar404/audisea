import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message, level = 'info' } = await request.json();

        // Log to server terminal
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        // This will appear in your terminal when running the dev server
        console.log(logMessage);

        return NextResponse.json({ success: true, logged: logMessage });
    } catch (error) {
        console.error('Error in logging API:', error);
        return NextResponse.json({ success: false, error: 'Failed to log message' }, { status: 500 });
    }
}
