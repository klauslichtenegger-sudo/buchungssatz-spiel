import React, { useMemo, useState } from "react";

const TAX_RATE = "19 %";

const EXERCISES = {
  laufend: [
    {
      id: "l1",
      title: "Kunde bezahlt Rechnung per Banküberweisung",
      situation: "Ein Kunde begleicht eine bereits gebuchte offene Rechnung über 1.190 € per Banküberweisung.",
      amount: "1.190 €",
      solution: { soll: ["Bank"], haben: ["Forderungen a. LL"] },
      accounts: ["Bank", "Kasse", "Forderungen a. LL", "Verbindlichkeiten a. LL", "Umsatzerlöse", "Umsatzsteuer"],
      explanation: "Beim Zahlungseingang wurde die Umsatzsteuer bereits bei der Ausgangsrechnung gebucht. Jetzt nimmt Bank zu und die Forderung nimmt ab: Bank an Forderungen a. LL."
    },
    {
      id: "l2",
      title: "Miete wird überwiesen",
      situation: "Die Geschäftsmiete über 900 € wird per Banküberweisung bezahlt. Es fällt keine Umsatzsteuer an.",
      amount: "900 €",
      solution: { soll: ["Mietaufwand"], haben: ["Bank"] },
      accounts: ["Mietaufwand", "Bank", "Vorsteuer", "Umsatzsteuer", "Eigenkapital", "SBK"],
      explanation: "Mietaufwand wird im Soll gebucht. Bank nimmt ab und steht im Haben. In diesem Fall wird keine Umsatzsteuer berücksichtigt."
    },
    {
      id: "l3",
      title: "Barverkauf von Waren mit Umsatzsteuer",
      situation: "Waren werden bar verkauft. Nettoverkaufspreis: 600 €. Umsatzsteuer: 114 €. Bruttobetrag: 714 €.",
      amount: "714 €",
      solution: { soll: ["Kasse"], haben: ["Umsatzerlöse", "Umsatzsteuer"] },
      accounts: ["Kasse", "Bank", "Umsatzerlöse", "Umsatzsteuer", "Vorsteuer", "Forderungen a. LL"],
      explanation: "Beim Verkauf entsteht ein Ertrag und Umsatzsteuer. Kasse nimmt brutto zu: Kasse 714 € an Umsatzerlöse 600 € und Umsatzsteuer 114 €."
    },
    {
      id: "l4",
      title: "Lieferantenrechnung auf Ziel mit Vorsteuer",
      situation: "Das Unternehmen kauft Waren auf Ziel. Nettowarenwert: 2.000 €. Vorsteuer: 380 €. Bruttobetrag: 2.380 €.",
      amount: "2.380 €",
      solution: { soll: ["Wareneingang", "Vorsteuer"], haben: ["Verbindlichkeiten a. LL"] },
      accounts: ["Wareneingang", "Vorsteuer", "Verbindlichkeiten a. LL", "Umsatzsteuer", "Bank", "Umsatzerlöse"],
      explanation: "Beim Einkauf wird der Wareneingang netto im Soll gebucht. Die Vorsteuer kommt ebenfalls ins Soll. Die Verbindlichkeit steht brutto im Haben."
    },
    {
      id: "l5",
      title: "Darlehen wird aufgenommen",
      situation: "Die Bank zahlt ein Darlehen über 10.000 € auf das Bankkonto aus. Es fällt keine Umsatzsteuer an.",
      amount: "10.000 €",
      solution: { soll: ["Bank"], haben: ["Darlehen"] },
      accounts: ["Bank", "Darlehen", "Eigenkapital", "Vorsteuer", "Umsatzsteuer", "SBK"],
      explanation: "Bank nimmt zu: Aktivkonto im Soll. Darlehen nimmt zu: Passivkonto im Haben. Bei Darlehen fällt keine Umsatzsteuer an."
    },
    {
      id: "l6",
      title: "Darlehen wird getilgt",
      situation: "Ein Teil des Darlehens über 1.500 € wird per Banküberweisung getilgt. Es fällt keine Umsatzsteuer an.",
      amount: "1.500 €",
      solution: { soll: ["Darlehen"], haben: ["Bank"] },
      accounts: ["Darlehen", "Bank", "Zinsaufwand", "Vorsteuer", "Umsatzsteuer", "Verbindlichkeiten a. LL"],
      explanation: "Das Darlehen nimmt ab: Passivkonto im Soll. Bank nimmt ab: Aktivkonto im Haben. Bei einer Darlehenstilgung fällt keine Umsatzsteuer an."
    },
    {
      id: "l7",
      title: "Privatentnahme aus der Kasse",
      situation: "Der Unternehmer entnimmt 300 € aus der Geschäftskasse für private Zwecke. In dieser vereinfachten Übung wird keine Umsatzsteuer gebucht.",
      amount: "300 €",
      solution: { soll: ["Privat"], haben: ["Kasse"] },
      accounts: ["Privat", "Kasse", "Eigenkapital", "Bank", "Vorsteuer", "Umsatzsteuer"],
      explanation: "Privatentnahmen werden im Soll des Privatkontos gebucht. Kasse nimmt ab: Aktivkonto im Haben."
    },
    {
      id: "l8",
      title: "Privateinlage auf das Bankkonto",
      situation: "Der Unternehmer legt 2.000 € privates Geld auf das betriebliche Bankkonto ein. Es fällt keine Umsatzsteuer an.",
      amount: "2.000 €",
      solution: { soll: ["Bank"], haben: ["Privat"] },
      accounts: ["Bank", "Privat", "Eigenkapital", "Kasse", "Vorsteuer", "Umsatzsteuer"],
      explanation: "Bank nimmt zu: Aktivkonto im Soll. Privateinlagen werden im Haben des Privatkontos gebucht."
    },
    {
      id: "l9",
      title: "Zieleinkauf von Büromaterial mit Vorsteuer",
      situation: "Das Unternehmen kauft Büromaterial auf Ziel. Nettobetrag: 500 €. Vorsteuer: 95 €. Bruttobetrag: 595 €.",
      amount: "595 €",
      solution: { soll: ["Büromaterial", "Vorsteuer"], haben: ["Verbindlichkeiten a. LL"] },
      accounts: ["Büromaterial", "Vorsteuer", "Verbindlichkeiten a. LL", "Umsatzsteuer", "Bank", "Kasse"],
      explanation: "Büromaterial ist Aufwand und steht netto im Soll. Die Vorsteuer steht ebenfalls im Soll. Die Verbindlichkeit wird brutto im Haben gebucht."
    },
    {
      id: "l10",
      title: "Zielverkauf von Waren mit Umsatzsteuer",
      situation: "Das Unternehmen verkauft Waren auf Ziel. Nettoverkaufspreis: 4.000 €. Umsatzsteuer: 760 €. Bruttobetrag: 4.760 €.",
      amount: "4.760 €",
      solution: { soll: ["Forderungen a. LL"], haben: ["Umsatzerlöse", "Umsatzsteuer"] },
      accounts: ["Forderungen a. LL", "Umsatzerlöse", "Umsatzsteuer", "Vorsteuer", "Bank", "Wareneingang"],
      explanation: "Beim Verkauf auf Ziel entsteht eine Forderung in Höhe des Bruttobetrags. Umsatzerlöse werden netto im Haben gebucht, Umsatzsteuer ebenfalls im Haben."
    }
  ],
  abschluss: [
    {
      id: "a1",
      title: "Aktivkonto Bank abschließen",
      situation: "Das Konto Bank weist einen Schlussbestand von 12.000 € aus.",
      amount: "12.000 €",
      solution: { soll: ["SBK"], haben: ["Bank"] },
      accounts: ["SBK", "Bank", "GuV", "Eigenkapital", "Privat", "Umsatzsteuer"],
      explanation: "Aktivkonten werden über das SBK abgeschlossen: SBK an Aktivkonto."
    },
    {
      id: "a2",
      title: "Passivkonto Darlehen abschließen",
      situation: "Das Konto Darlehen weist einen Schlussbestand von 16.000 € aus.",
      amount: "16.000 €",
      solution: { soll: ["Darlehen"], haben: ["SBK"] },
      accounts: ["Darlehen", "SBK", "GuV", "Bank", "Mietaufwand", "Vorsteuer"],
      explanation: "Passivkonten werden über das SBK abgeschlossen: Passivkonto an SBK."
    },
    {
      id: "a3",
      title: "Mietaufwand abschließen",
      situation: "Das Konto Mietaufwand hat einen Saldo von 6.000 €.",
      amount: "6.000 €",
      solution: { soll: ["GuV"], haben: ["Mietaufwand"] },
      accounts: ["GuV", "Mietaufwand", "SBK", "Bank", "Eigenkapital", "Umsatzerlöse"],
      explanation: "Aufwandskonten werden über GuV abgeschlossen: GuV an Aufwandskonto."
    },
    {
      id: "a4",
      title: "Umsatzerlöse abschließen",
      situation: "Das Konto Umsatzerlöse hat einen Saldo von 15.000 €.",
      amount: "15.000 €",
      solution: { soll: ["Umsatzerlöse"], haben: ["GuV"] },
      accounts: ["Umsatzerlöse", "GuV", "SBK", "Bank", "Eigenkapital", "Mietaufwand"],
      explanation: "Ertragskonten werden über GuV abgeschlossen: Ertragskonto an GuV."
    },
    {
      id: "a5",
      title: "GuV bei Gewinn abschließen",
      situation: "Die Erträge sind größer als die Aufwendungen. Es entsteht ein Gewinn von 9.000 €.",
      amount: "9.000 €",
      solution: { soll: ["GuV"], haben: ["Eigenkapital"] },
      accounts: ["GuV", "Eigenkapital", "SBK", "Bank", "Privat", "Mietaufwand"],
      explanation: "Gewinn erhöht das Eigenkapital: GuV an Eigenkapital."
    },
    {
      id: "a6",
      title: "GuV bei Verlust abschließen",
      situation: "Die Aufwendungen sind größer als die Erträge. Es entsteht ein Verlust von 3.000 €.",
      amount: "3.000 €",
      solution: { soll: ["Eigenkapital"], haben: ["GuV"] },
      accounts: ["Eigenkapital", "GuV", "SBK", "Bank", "Privat", "Umsatzerlöse"],
      explanation: "Verlust mindert das Eigenkapital: Eigenkapital an GuV."
    },
    {
      id: "a7",
      title: "Privatkonto bei Entnahmeüberschuss abschließen",
      situation: "Die Privatentnahmen sind um 1.500 € höher als die Privateinlagen.",
      amount: "1.500 €",
      solution: { soll: ["Eigenkapital"], haben: ["Privat"] },
      accounts: ["Eigenkapital", "Privat", "GuV", "SBK", "Bank", "Kasse"],
      explanation: "Entnahmen mindern das Eigenkapital: Eigenkapital an Privat."
    },
    {
      id: "a8",
      title: "Eigenkapital abschließen",
      situation: "Das Eigenkapitalkonto weist einen Schlussbestand von 37.500 € aus.",
      amount: "37.500 €",
      solution: { soll: ["Eigenkapital"], haben: ["SBK"] },
      accounts: ["Eigenkapital", "SBK", "GuV", "Privat", "Bank", "Darlehen"],
      explanation: "Eigenkapital ist ein Passivkonto und wird über das SBK abgeschlossen: Eigenkapital an SBK."
    },
    {
      id: "a9",
      title: "Umsatzsteuer-Zahllast abschließen",
      situation: "Am Monatsende beträgt die Umsatzsteuer 1.140 € und die Vorsteuer 760 €. Die Zahllast beträgt 380 €.",
      amount: "380 €",
      solution: { soll: ["Umsatzsteuer"], haben: ["Vorsteuer", "Verbindlichkeiten ggü. Finanzamt"] },
      accounts: ["Umsatzsteuer", "Vorsteuer", "Verbindlichkeiten ggü. Finanzamt", "Forderungen ggü. Finanzamt", "GuV", "SBK"],
      explanation: "Die Vorsteuer wird mit der Umsatzsteuer verrechnet. Bleibt Umsatzsteuer übrig, entsteht eine Zahllast gegenüber dem Finanzamt."
    },
    {
      id: "a10",
      title: "Vorsteuerüberhang abschließen",
      situation: "Am Monatsende beträgt die Vorsteuer 950 € und die Umsatzsteuer 700 €. Es entsteht ein Vorsteuerüberhang von 250 €.",
      amount: "250 €",
      solution: { soll: ["Umsatzsteuer", "Forderungen ggü. Finanzamt"], haben: ["Vorsteuer"] },
      accounts: ["Umsatzsteuer", "Vorsteuer", "Forderungen ggü. Finanzamt", "Verbindlichkeiten ggü. Finanzamt", "GuV", "SBK"],
      explanation: "Wenn die Vorsteuer größer ist als die Umsatzsteuer, entsteht eine Forderung gegenüber dem Finanzamt."
    }
  ]
};

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createRound(mode) {
  return shuffle(EXERCISES[mode]).map((exercise) => ({
    ...exercise,
    accounts: shuffle(exercise.accounts)
  }));
}

function normalizeList(list) {
  return [...list].sort().join("||");
}

function sameAccounts(a, b) {
  return normalizeList(a) === normalizeList(b);
}

function formatBooking(solution, amount) {
  return `${solution.soll.join(" + ")} an ${solution.haben.join(" + ")} ${amount}`;
}

export default function BuchungssatzDragDropSpiel() {
  const [mode, setMode] = useState("laufend");
  const [round, setRound] = useState(() => createRound("laufend"));
  const [index, setIndex] = useState(0);
  const [slots, setSlots] = useState({ soll: [], haben: [] });
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [draggedAccount, setDraggedAccount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  const current = round[index];
  const isLast = index === round.length - 1;
  const isCorrect = checked && sameAccounts(slots.soll, current.solution.soll) && sameAccounts(slots.haben, current.solution.haben);
  const finished = checked && isLast;
  const progress = Math.round(((checked ? index + 1 : index) / round.length) * 100);
  const percent = Math.round((score / round.length) * 100);

  const availableAccounts = useMemo(() => {
    const used = new Set([...slots.soll, ...slots.haben]);
    return current.accounts.filter((account) => !used.has(account));
  }, [current, slots]);

  function changeMode(newMode) {
    setMode(newMode);
    setRound(createRound(newMode));
    setIndex(0);
    setSlots({ soll: [], haben: [] });
    setChecked(false);
    setScore(0);
    setDraggedAccount("");
    setSelectedAccount("");
  }

  function restart() {
    setRound(createRound(mode));
    setIndex(0);
    setSlots({ soll: [], haben: [] });
    setChecked(false);
    setScore(0);
    setDraggedAccount("");
    setSelectedAccount("");
  }

  function removeFromSlot(slotName, account) {
    if (checked) return;
    setSlots((old) => ({
      ...old,
      [slotName]: old[slotName].filter((item) => item !== account)
    }));
  }

  function placeAccount(slotName, account) {
    if (checked || !account) return;
    setSlots((old) => {
      const cleaned = {
        soll: old.soll.filter((item) => item !== account),
        haben: old.haben.filter((item) => item !== account)
      };

      return {
        ...cleaned,
        [slotName]: [...cleaned[slotName], account]
      };
    });
    setSelectedAccount("");
  }

  function placeByClick(account) {
    if (checked) return;
    setSelectedAccount((old) => (old === account ? "" : account));
  }

  function handleDragStart(account, event) {
    setDraggedAccount(account);
    event.dataTransfer.setData("text/plain", account);
  }

  function handleDrop(slotName, event) {
    event.preventDefault();
    const account = event.dataTransfer.getData("text/plain") || draggedAccount;
    placeAccount(slotName, account);
    setDraggedAccount("");
  }

  function handleSlotClick(slotName) {
    if (checked || !selectedAccount) return;
    placeAccount(slotName, selectedAccount);
  }

  function handleSlotKeyDown(slotName, event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleSlotClick(slotName);
  }

  function checkAnswer() {
    if (checked || slots.soll.length === 0 || slots.haben.length === 0) return;
    const correct = sameAccounts(slots.soll, current.solution.soll) && sameAccounts(slots.haben, current.solution.haben);
    setChecked(true);
    if (correct) setScore((old) => old + 1);
  }

  function next() {
    if (!checked || isLast) return;
    setIndex((old) => old + 1);
    setSlots({ soll: [], haben: [] });
    setChecked(false);
    setDraggedAccount("");
    setSelectedAccount("");
  }

  function accountButton(account) {
    return (
      <button
        className={selectedAccount === account ? "account-chip selected" : "account-chip"}
        draggable={!checked}
        key={account}
        onClick={() => placeByClick(account)}
        onDragStart={(event) => handleDragStart(account, event)}
        title="Antippen und danach Soll oder Haben wählen"
        type="button"
      >
        {account}
      </button>
    );
  }

  function slotBox(slotName, label) {
    const values = slots[slotName];
    const correctValues = current.solution[slotName];
    const wrong = checked && !sameAccounts(values, correctValues);
    const correct = checked && sameAccounts(values, correctValues);

    return (
      <div
        className={`drop-slot ${selectedAccount && !checked ? "can-place" : ""} ${correct ? "is-correct" : ""} ${wrong ? "is-wrong" : ""}`}
        onClick={() => handleSlotClick(slotName)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => handleDrop(slotName, event)}
        onKeyDown={(event) => handleSlotKeyDown(slotName, event)}
        role="button"
        tabIndex={checked || !selectedAccount ? -1 : 0}
      >
        <div className="slot-label">{label}</div>
        {values.length > 0 ? (
          <div className="placed-list">
            {values.map((value) => (
              <button className="placed-account" key={value} onClick={() => removeFromSlot(slotName, value)} type="button">
                {value}
              </button>
            ))}
          </div>
        ) : (
          <div className="placeholder">{selectedAccount && !checked ? `${selectedAccount} hier ablegen` : "Konto hierher ziehen oder antippen"}</div>
        )}
        {checked && wrong ? <div className="mini-correction">Richtig: {correctValues.join(" + ")}</div> : null}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="wrapper">
        <header className="header">
          <div>
            <div className="kicker">Buchführung-Übung mit Umsatzsteuer</div>
            <h1>Buchungssatz bauen</h1>
            <p>Ziehe die richtigen Konten in die Felder Soll und Haben. Am Handy: Konto antippen, dann Soll oder Haben antippen.</p>
          </div>
          <div className="score-panel" aria-label={`Punktestand ${score} von ${round.length}`}>
            <div className="score-number">{score}/{round.length}</div>
            <div className="score-label">Punkte</div>
          </div>
        </header>

        <section className="mode-box" aria-label="Übungsmodus">
          <button className={mode === "laufend" ? "mode-button active" : "mode-button"} onClick={() => changeMode("laufend")} type="button">
            Buchen während des Jahres
          </button>
          <button className={mode === "abschluss" ? "mode-button active" : "mode-button"} onClick={() => changeMode("abschluss")} type="button">
            Kontoabschluss
          </button>
        </section>

        <div className="progress-outer" aria-label={`Fortschritt ${progress} Prozent`}>
          <div className="progress-inner" style={{ width: `${progress}%` }} />
        </div>

        <main className="layout">
          <section className="card">
            {!finished ? (
              <>
                <div className="top-line">
                  <span className="badge">{mode === "laufend" ? "Buchen während des Jahres" : "Kontoabschluss"}</span>
                  <span className="badge light">Umsatzsteuer: {TAX_RATE}</span>
                  <span className="badge light">Fall {index + 1} von {round.length}</span>
                </div>

                <h2>{current.title}</h2>
                <div className="case-box">{current.situation}</div>
                <div className="amount-box">Betrag: <strong>{current.amount}</strong></div>
                <div className="instruction-box">Bilde den Buchungssatz: <strong>Soll an Haben</strong></div>

                <div className="booking-line">
                  {slotBox("soll", "Soll")}
                  <div className="an-word">an</div>
                  {slotBox("haben", "Haben")}
                </div>

                <section className="accounts-box">
                  <h3>Kontenauswahl</h3>
                  <p>Du kannst Konten ziehen oder antippen. Auf dem Handy wählst du erst ein Konto und danach das passende Feld.</p>
                  <div className="account-grid">{availableAccounts.map(accountButton)}</div>
                </section>

                {checked ? (
                  <div className={isCorrect ? "feedback correct" : "feedback wrong"}>
                    <div className="feedback-title">{isCorrect ? "Richtig!" : "Noch nicht richtig."}</div>
                    <div className="booking-sentence">Richtiger Buchungssatz: <strong>{formatBooking(current.solution, current.amount)}</strong></div>
                    <div>{current.explanation}</div>
                  </div>
                ) : (
                  <div className="hint-box">Tipp: Bei Verkäufen steht die Umsatzsteuer meist im Haben. Bei Einkäufen steht die Vorsteuer meist im Soll.</div>
                )}

                <div className="button-row">
                  <button className="secondary-button" disabled={checked} onClick={() => setSlots({ soll: [], haben: [] })} type="button">
                    Felder leeren
                  </button>
                  <button className="secondary-button" onClick={restart} type="button">Neu mischen</button>
                  {!checked ? (
                    <button className="primary-button" disabled={slots.soll.length === 0 || slots.haben.length === 0} onClick={checkAnswer} type="button">
                      Prüfen
                    </button>
                  ) : (
                    <button className="primary-button" disabled={isLast} onClick={next} type="button">
                      Nächster Fall
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="finished-box">
                <div className="trophy" aria-hidden="true">★</div>
                <h2>Übung beendet!</h2>
                <p>Du hast {score} von {round.length} Buchungssätzen richtig gebildet.</p>
                <div className="percent-box">
                  <div className="percent">{percent}%</div>
                  <div>
                    {percent >= 85
                      ? "Sehr gut! Du kannst die Buchungssätze mit Umsatzsteuer schon sicher bilden."
                      : percent >= 60
                        ? "Ordentlich! Wiederhole besonders Vorsteuer und Umsatzsteuer."
                        : "Übe zuerst die Umsatzsteuer-Regeln und starte dann eine neue Runde."}
                  </div>
                </div>
                <button className="primary-button" onClick={restart} type="button">Neue Runde starten</button>
              </div>
            )}
          </section>

          <aside className="side-bar">
            <section className="side-card">
              <h3>Merkhilfe</h3>
              <div className="rule-card"><strong>Aktivkonto</strong><br />Mehrung Soll, Minderung Haben</div>
              <div className="rule-card"><strong>Passivkonto</strong><br />Mehrung Haben, Minderung Soll</div>
              <div className="rule-card"><strong>Aufwand</strong><br />immer Soll</div>
              <div className="rule-card"><strong>Ertrag</strong><br />immer Haben</div>
              <div className="rule-card"><strong>Vorsteuer</strong><br />beim Einkauf im Soll</div>
              <div className="rule-card"><strong>Umsatzsteuer</strong><br />beim Verkauf im Haben</div>
            </section>

            <section className="dark-card">
              <h3>Kontoabschlüsse</h3>
              <div className="closing-line"><span>Aktivkonto</span><strong>SBK an Aktivkonto</strong></div>
              <div className="closing-line"><span>Passivkonto</span><strong>Passivkonto an SBK</strong></div>
              <div className="closing-line"><span>Aufwand</span><strong>GuV an Aufwand</strong></div>
              <div className="closing-line"><span>Ertrag</span><strong>Ertrag an GuV</strong></div>
              <div className="closing-line"><span>Gewinn</span><strong>GuV an Eigenkapital</strong></div>
              <div className="closing-line"><span>Verlust</span><strong>Eigenkapital an GuV</strong></div>
              <div className="closing-line"><span>USt-Zahllast</span><strong>USt an Vorsteuer + Finanzamt</strong></div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}
