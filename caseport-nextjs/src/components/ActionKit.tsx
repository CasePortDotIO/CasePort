"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { emailScripts } from "@/data";

/** "Your Action Kit" — copy-paste scripts accordion. Mirrors `CP.ui.actionKit()`
 *  + the accordion/copy wiring in `initWidgets`. */
export function ActionKit({
  bg = "bg-cream",
  title = "Your Action Kit — Copy, Paste, Send",
  intro = "Four scripts that protect your claim in the first days — written for you, ready to use. Most accident victims never get these in time. You can send them today.",
  container = "container-4",
}: {
  bg?: string;
  title?: string;
  intro?: string;
  container?: string;
}) {
  const [openIdx, setOpenIdx] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyAll = (idx: number) => {
    const s = emailScripts[idx];
    const text = (s.subject ? "Subject: " + s.subject + "\n\n" : "") + s.body;
    const done = () => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((c) => (c === idx ? null : c)), 1800);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  };

  return (
    <section className={"section " + bg} data-widget="actionkit">
      <div className={container}>
        <div className="section-head">
          <h2 className="section-h">{title}</h2>
          <p className="section-sub">{intro}</p>
        </div>
        <div className="ak-list">
          {emailScripts.map((s, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={s.id} className={"ak-card r" + (isOpen ? " open" : "")} data-ak={s.id}>
                <button className="ak-head" onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                  <span className="ak-ic">
                    <Icon name={s.icon} />
                  </span>
                  <span className="ak-htext">
                    <span className="ak-title">{s.title}</span>
                    <span className="ak-to">{s.to}</span>
                  </span>
                  <span className="ak-chev">
                    <Icon name={isOpen ? "chevUp" : "chevDown"} />
                  </span>
                </button>
                <div className="ak-body">
                  <p className="ak-why">{s.why}</p>
                  {s.subject && (
                    <div className="ak-field">
                      <span className="ak-label">Subject</span>
                      <code className="ak-subject">{s.subject}</code>
                    </div>
                  )}
                  <div className="ak-field">
                    <span className="ak-label">{s.id === "insurer" ? "Say / write this" : "Message"}</span>
                    <pre className="ak-text">{s.body}</pre>
                  </div>
                  <button className="btn btn-teal btn-sm ak-copy" onClick={() => copyAll(i)}>
                    <Icon name="file" />
                    <span>
                      {copiedIdx === i
                        ? "Copied ✓"
                        : "Copy " + (s.subject ? "subject + message" : "text")}
                    </span>
                  </button>
                  <p className="ak-fill">
                    Replace anything in [BRACKETS] with your details before sending.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
