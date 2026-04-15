"use client";

import { supabase } from "./client";

export async function signUp(email: String, password: String){
    return await supabase.auth.signUp({
        email,
        password,
    });
}

export async function signIn(email: String, password: String){
    return await supabase.auth.signIn({
        email,
        password,
    });
}