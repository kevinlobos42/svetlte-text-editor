import { writable } from "svelte/store";

export const toastVal = writable({message:null, severity:null, icon:null})

export const userId = writable({userId: ''})


/**
 * @type string | null
 */
export let currentUser = null;

userId.subscribe(val=>{
    currentUser = val;
}
)


