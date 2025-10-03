// 'use client';

// import { useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useAuthStore } from '@/store/useAuthStore';
// import { useRouter } from 'next/navigation';

// export function useSupabaseAuthListener() {
//     const router = useRouter();
//   useEffect(() => {
//     const { data: subscription } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         console.log('event', event);
//         console.log('session', session);
//         // redirect to login if not authenticated and to home if authenticated
//         if(!session) {
//             router.push('/auth/login');
//         } else {
//             router.push('/chat');
//         }
//         useAuthStore.getState().setSession(session);
//       }
//     );

//     return () => subscription.subscription.unsubscribe();
//   }, []);
// }
