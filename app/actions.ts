'use server'
import { drizzleClient } from '@/app/lib/db/client'
import { event } from "./lib/db/schema"
export async function addEvent() {
    await drizzleClient.insert(event).values({title: 'dasd', type: 'image', description: 'adad', access_type: Math.random() < 0.5 ? 'private' : 'public' })
}