"use client";

import { supabase } from "./client";

export async function signUp(email: string, password: string){
    return await supabase.auth.signUp({
        email,
        password,
    });
}

export async function signIn(email: string, password: string){
    return await supabase.auth.signIn({
        email,
        password,
    });
}