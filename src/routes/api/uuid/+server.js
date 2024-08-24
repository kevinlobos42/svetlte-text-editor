import {v4 as uuidv4} from 'uuid'

export async function GET(){
    const uuid = uuidv4();
    return new Response(JSON.stringify({uuid}), {
        headers: {'Content-Type': 'application/json'}
    })
}