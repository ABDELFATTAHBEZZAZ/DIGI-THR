import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { isStaticMode, staticResponses } from "./staticMode";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // En développement, on utilise le chemin relatif pour profiter du proxy Vite
  // En production, on utilise l'URL complète si nécessaire
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? '' : 'http://localhost:3001';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  
  console.log(`Envoi de la requête ${method} vers ${fullUrl}`); // Log pour le débogage
  
  const headers: HeadersInit = {};
  
  // Ajouter le content-type uniquement pour les requêtes avec un corps
  if (data) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Ajouter les credentials pour les requêtes d'authentification
  const credentials: RequestCredentials = 'include';
  
  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn<T>({ on401: unauthorizedBehavior }: { on401: UnauthorizedBehavior }): QueryFunction<T> {
  return async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    // Use static data in production/static mode
    if (isStaticMode && staticResponses[url as keyof typeof staticResponses]) {
      const staticResponse = staticResponses[url as keyof typeof staticResponses];
      return staticResponse() as Promise<T>;
    }
    
    try {
      const res = await apiRequest('GET', url);
      return await res.json() as T;
    } catch (error: any) {
      if (unauthorizedBehavior === "returnNull" && error.message.startsWith('401:')) {
        return null as unknown as T;
      }
      throw error;
    }
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
