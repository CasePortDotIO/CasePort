"use client";

import { useCallback, useState } from "react";
import { Icon } from "./AccidentsIcon";

export type EmailScript = {
  id: string;
  icon: string;
  title: string;
  why: string;
  to: string;
  subject?: string;
  body?: string;
};

interface ActionKitProps {
  bg?: string;
  title?: string;
  intro?: string;
  container?: string;
  scripts?: EmailScript[];
}

function AkCard({ script, isOpen, onToggle, onCopy, copied }: {
  script: EmailScript;
  isOpen: boolean;
  onToggle: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className={"ak-card r" + (isOpen ? " open" : "")} data-ak={script.id}>
      <button type="button" className="ak-head" onClick={onToggle}>
        <span className="ak-ic">
          <Icon name={script.icon} />
        </span>
        <span className="ak-htext">
          <span className="ak-title">{script.title}</span>
          <span className="ak-to">{script.to}</span>
        </span>
        <span className="ak-chev">
          <Icon name={isOpen ? "chevUp" : "chevDown"} />
        </span>
      </button>
      {isOpen && (
        <div className="ak-body">
          <p className="ak-why">{script.why}</p>
          {script.subject && (
            <div className="ak-field">
              <span className="ak-label">Subject</span>
              <code className="ak-subject">{script.subject}</code>
            </div>
          )}
          <div className="ak-field">
            <span className="ak-label">
              {script.id === "insurer" ? "Say / write this" : "Message"}
            </span>
            <pre className="ak-text">{script.body}</pre>
          </div>
          <button type="button" className="btn btn-teal btn-sm ak-copy" onClick={onCopy}>
            <Icon name="file" />
            <span>{copied ? "Copied ✓" : "Copy " + (script.subject ? "subject + message" : "text")}</span>
          </button>
          <p className="ak-fill">
            Replace anything in [BRACKETS] with your details before sending.
          </p>
        </div>
      )}
    </div>
  );
}

export function ActionKit({
  bg = "bg-cream",
  title = "Your Action Kit — Copy, Paste, Send",
  intro,
  container = "container-4",
  scripts = [],
}: ActionKitProps) {
  const [openId, setOpenId] = useState<string | null>(scripts[0]?.id ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleCopy = useCallback((script: EmailScript) => {
    const text = (script.subject ? "Subject: " + script.subject + "\n\n" : "") + (script.body || "");
    const done = () => {
      setCopiedId(script.id);
      setTimeout(() => setCopiedId(null), 1800);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      done();
    }
  }, []);

  return (
    <section className={"section " + bg} data-widget="actionkit">
      <div className={container}>
        <div className="section-head">
          <h2 className="section-h">{title}</h2>
          {intro && <p className="section-sub">{intro}</p>}
        </div>
        <div className="ak-list">
          {scripts.map((script) => (
            <AkCard
              key={script.id}
              script={script}
              isOpen={openId === script.id}
              onToggle={() => handleToggle(script.id)}
              onCopy={() => handleCopy(script)}
              copied={copiedId === script.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
