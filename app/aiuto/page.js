export default function Aiuto(){
  return (
    <div className="container-narrow py-8">
      <div className="card p-8 space-y-4">
        <h1 className="text-2xl font-black">Aiuto</h1>
        <p><b>Che cos’è VoxPublica?</b><br/>È un assistente che scrive per te comunicati stampa, dichiarazioni e testi per i social. Tu scrivi cosa vuoi dire, lui prepara il testo.</p>

        <h2 className="text-xl font-bold mt-4">Come si usa</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li><b>Iscriviti / Accedi</b>. Dopo l’accesso compila il <b>profilo</b> (nome, ruolo, ente, contatti, tono).</li>
          <li>Vai in <b>Ufficio Stampa</b>. Scrivi cosa vuoi (“Scrivimi un testo su…”). Se vuoi, carica dei file PDF/TXT con informazioni.</li>
          <li>Scegli il <b>formato</b>: Giornale (con dichiarazione), Instagram, Facebook o WhatsApp.</li>
          <li>Clicca <b>Genera testo</b>. Leggi, eventualmente <b>copia</b> o <b>salva</b> in Bozze.</li>
          <li>In <b>Bozze/Archivio</b> ritrovi i testi salvati.</li>
        </ol>

        <h2 className="text-xl font-bold mt-4">Consigli pratici</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Per i giornali, ricorda: il <b>comunicato deve avere una dichiarazione</b>.</li>
          <li>Per i social, puoi usare <b>emoji</b>. Per i comunicati, no.</li>
          <li>Più informazioni dai (anche con file), migliore sarà il testo.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">Problemi comuni</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><b>Non entro nell’app</b>: controlla la mail di conferma iscrizione.</li>
          <li><b>Non genera il testo</b>: assicurati di aver scritto cosa vuoi e di essere collegato a internet.</li>
          <li><b>Serve aiuto?</b> Contatta il tuo referente o rispondi alla mail di registrazione.</li>
        </ul>
      </div>
    </div>
  );
}
