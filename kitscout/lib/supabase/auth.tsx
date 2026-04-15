import { supabase } from "./client";

export async function signUp(email: string, password: string){
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;

    return data;
}

export async function signIn(email: string, password: string){
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return data;
}

export async function signOut(): Promise<void>{
    const {error} = await supabase.auth.signOut();

    if (error){
        console.error("Sign out failed", error);
    }

    return;
}