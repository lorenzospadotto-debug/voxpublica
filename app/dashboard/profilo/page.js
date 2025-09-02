"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfiloPage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          email: user.email,
          nome: "",
          cognome: "",
          ruolo: "",
          ente: "",
          telefono: "",
        });
      }
    }
    loadProfile();
  }, []);

  if (!profile) return <p>Caricamento...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profilo</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm">Nome</label>
          <input
            type="text"
            value={profile.nome}
            onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Cognome</label>
          <input
            type="text"
            value={profile.cognome}
            onChange={(e) => setProfile({ ...profile, cognome: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Ruolo</label>
          <input
            type="text"
            value={profile.ruolo}
            onChange={(e) => setProfile({ ...profile, ruolo: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Ente</label>
          <input
            type="text"
            value={profile.ente}
            onChange={(e) => setProfile({ ...profile, ente: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Telefono</label>
          <input
            type="text"
            value={profile.telefono}
            onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
      </form>
    </main>
  );
}
