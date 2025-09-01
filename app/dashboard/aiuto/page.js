export default function AiutoPage() {
  return (
    <div className="container-narrow py-8">
      <div className="card p-8 space-y-4">
        <img src="/aiuto-banner.png" alt="VoxPublica Aiuto" className="w-full mb-2 rounded-lg shadow" />
        <h1 className="text-2xl font-black">Come usare VoxPublica</h1>
        <p>
          VoxPublica è pensata per rendere semplice la comunicazione tra politico e cittadino.
          Anche se non hai esperienza con la tecnologia, puoi creare testi per la stampa,
          i social o WhatsApp in pochi clic.
        </p>

        <h2 className="text-xl font-bold mt-4">Come si usa</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li><b>Profilo:</b> compila i tuoi dati al primo accesso (ruolo, ente e <b>nome ente</b>).</li>
          <li><b>Ufficio Stampa:</b> scrivi un’idea o carica un file; VoxPublica lo trasforma in comunicato.</li>
          <li><b>Formato:</b> scegli Giornale (con dichiarazione), Instagram, Facebook o WhatsApp.</li>
          <li><b>Genera testo</b> → poi <b>Copia</b> o <b>Salva</b> in Bozze.</li>
          <li><b>Bozze/Archivio:</b> ritrovi tutto quello che hai creato.</li>
        </ol>

        <h2 className="text-xl font-bold mt-4">Consigli</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Per i giornali, inserisci sempre una <b>dichiarazione</b>.</li>
          <li>Per i social puoi usare <b>emoji</b>. Per i comunicati, no.</li>
          <li>Più informazioni dai (anche con file), meglio verrà il testo.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">Problemi comuni</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><b>Non entro:</b> controlla la mail di conferma iscrizione.</li>
          <li><b>Non genera:</b> assicurati di aver scritto cosa vuoi dire.</li>
          <li><b>Serve aiuto?</b> Rispondi alla mail di registrazione.</li>
        </ul>
      </div>
    </div>
  );
}
