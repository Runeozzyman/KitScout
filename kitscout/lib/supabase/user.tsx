import { sourceMapsEnabled } from "process";
import { supabase } from "./client";

export default async function getUser(){

    const {data, error} = await supabase.auth.getUser();

    if (error) throw error;

    return data;

}