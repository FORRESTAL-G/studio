# Product Requirements Document (PRD)

## Nome Applicazione
Gi-UX ALPHA 2

## Visione Generale
Applicazione di comunicazione avanzata che integra chat testuale, messaggistica audio, trascrizione automatica, chiamate vocali e personalizzazione UI/UX. Progettata per un'esperienza moderna, accessibile e internazionale.

---

## Architettura e Flusso UI/UX
- **Single Page App**: Tutte le interazioni avvengono su una singola schermata, con header e footer fissi.
- **Header**: Mostra nome app, stato connessione (online/offline), selettore lingua, toggle tema.
- **Footer**: Input messaggio testuale, bottone invio, registrazione audio, gestione chiamata vocale.
- **Area Chat**: Visualizza cronologia messaggi, indicatori di digitazione, messaggi audio, trascrizioni.
- **Voice Call UI**: Overlay modale per chiamate vocali, avatar animati, timer, mute/unmute, fine chiamata.

---

## Componenti Principali
### Header
- Visualizza nome app (localizzato), stato connessione (badge con icona), selettore lingua, toggle tema.
- Stato online/offline aggiornato in tempo reale tramite eventi browser.

### Footer
- Input multilinea per testo.
- Bottone invio (abilitato solo se testo presente e non in invio).
- AudioRecorder: bottone microfono per registrazione audio (max 60s), barra progresso, gestione permessi.
- Bottone chiamata: avvia/termina chiamata vocale, cambia stato e icona.

### ChatArea
- Scroll automatico su nuovi messaggi.
- Messaggi visualizzati con componenti MessageItem.
- Indicatori di digitazione (es. "L'assistente sta scrivendo...").

### MessageItem
- Messaggi utente e assistente con stili distinti.
- Supporto markdown per testo.
- Messaggi audio: player con play/pause, restart, barra progresso, durata.
- Trascrizione: se presente, visualizzata sotto l'audio.
- Stato messaggio: pending, sent, failed, transcribing (icone e timestamp).

### AudioRecorder
- Gestione permessi microfono.
- Stato recording, barra progresso, durata.
- Chiusura e rilascio risorse a fine registrazione.

### VoiceCallUi
- Overlay modale, avatar animati, timer chiamata.
- Pulsanti mute/unmute, fine chiamata.
- Visualizzazione nomi e avatar utente/assistente.

### ThemeToggle & LanguageSelector
- Cambio tema (light/dark) e lingua (it/en) runtime.
- Persistenza preferenze in localStorage.

---

## Funzionalità Tecniche
- **Gestione Stato**: useState/useEffect per stato locale, hooks custom per toast e mobile detection.
- **Internazionalizzazione**: Context provider, traduzioni in JSON, fallback automatico.
- **Theming**: Context provider, supporto dark/light, classi Tailwind dinamiche.
- **Toast Notifications**: Feedback per errori (offline, permessi, feature disabilitate).
- **Gestione Connessione**: Eventi online/offline, UI reattiva.
- **Simulazione Backend**: Risposte assistente simulate lato client.
- **Accessibilità**: ARIA label su bottoni, focus management.
- **Responsive Design**: Layout flessibile, supporto mobile/desktop.

---

## Stile e Linee Guida UI
- Colori principali: teal vibrante (#21c9a8), sfondo scuro (#314642), accenti verdi (#36c45e).
- Font moderni e arrotondati (es. Geist, Squircle).
- Icone Lucide per azioni e status.
- Transizioni fluide su interazioni.
- Spaziatura e padding consistenti.

---

## Tipologie di Messaggi
- **Testo**: markdown, timestamp, stato invio.
- **Audio**: player, durata, trascrizione opzionale.
- **Transcribing**: stato intermedio, spinner/label.

---

## Estendibilità e Best Practice
- Componenti modulari, SRP e principi SOLID.
- Tipizzazione TypeScript rigorosa.
- Separazione logica/presentazione.
- Custom hooks per logica riutilizzabile.
- Pronto per integrazione backend reale (API, WebSocket).

---

## Requisiti Non Funzionali
- Compatibilità cross-browser.
- Performance ottimizzata (virtualizzazione, cleanup eventi, bundle ridotto).
- Sicurezza: gestione permessi, nessun dato sensibile lato client.
- Pronto per test end-to-end e CI/CD.

---

## Glossario
- **Toast**: Notifica temporanea.
- **Transcribing**: Stato di trascrizione audio in corso.
- **Theme**: Tema UI (light/dark).
- **SRP**: Single Responsibility Principle.

---

## Allegati e Riferimenti
- [docs/blueprint.md](docs/blueprint.md): Linee guida UI/UX e palette colori.
- [src/contexts/i18n-provider.tsx](src/contexts/i18n-provider.tsx): Gestione internazionalizzazione.
- [src/app/page.tsx](src/app/page.tsx): Entry point e flusso principale.
- [src/components/](src/components/): Tutti i componenti UI.

---

Fine documento.
