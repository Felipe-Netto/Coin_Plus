'use client'

import axios from "axios";
import React, {ReactNode, useEffect, useState} from "react";
import { createContext } from "react";
import { setCookie, parseCookies } from 'nookies';
import { useRouter } from "next/navigation";

interface AuthProviderProps {
    children: ReactNode;
}

type AuthContextType = {
    isAuthenticaded: boolean;
    user: User | null;
    signIn: (data: SignInData) => Promise<boolean>;
}

type SignInData = {
    email: string;
    senha: string;
}

type User = {
    id_user: number;
    nome: string;
    email: string;
    saldo: number;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticaded = !!user;

    useEffect(() => {
        const { 'coinplus.token': token } = parseCookies();

        if(token){
            axios.post("http://localhost:3333/user/token", {
                token,
            }).then(response => {
                const user = response.data;
                console.log(user);
                setUser(user);
            }).catch((error) => {
                console.log('ERROR:', error);
                router.push("/");
            });
        }else {
            router.push("/");
        }
    }, []);

    async function signIn({ email, senha }: SignInData) {
        try {
            const response = await axios.post("http://localhost:3333/user", {
            email,
            senha,
            });

            const { token, user } = response.data;

            if (!token || !user) {
            throw new Error("Dados inválidos retornados pela API");
            }

            setCookie(undefined, "coinplus.token", token, {
            maxAge: 60 * 60 * 1, // 1 hora
            path: "/", // Torna o cookie disponível em todas as rotas
            });

            setUser(user);    
            return true;
        } catch (error) {
          console.error("Erro ao autenticar usuário:", error);
          return false;
        }
      }

    return (
        <AuthContext.Provider value={{ user, isAuthenticaded, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}