"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

/** X-ray vs MRI before/after reveal slider. Mirrors `CP.widgets.invisibleInjury()`. */
export function InvisibleInjury() {
  const [v, setV] = useState(55);

  return (
    <section className="section bg-white" data-widget="invisible">
      <div className="container-4">
        <div className="section-head center">
          <h2 className="section-h">Why &quot;It Didn&rsquo;t Show on the X-ray&quot; Is a Trap</h2>
          <p className="section-sub center">
            Insurers call an injury &quot;minor&quot; when it doesn&rsquo;t appear on an X-ray.
            But X-rays only show bone. Drag the slider to see what an MRI reveals — and what
            the X-ray missed.
          </p>
        </div>
        <div className="ii-stage" id="iiStage">
          <div className="ii-img ii-mri">
            <img src="/accidents/img/mri.png" alt="MRI showing a herniated disc pressing on a nerve" />
            <span className="ii-tag ii-tag-mri">MRI — herniated disc + pinched nerve, clearly visible</span>
          </div>
          <div className="ii-img ii-xray" id="iiXray" style={{ clipPath: `inset(0 0 0 ${v}%)` }}>
            <img src="/accidents/img/xray.png" alt="X-ray showing only bone, with no visible soft-tissue injury" />
            <span className="ii-tag ii-tag-xray">X-ray — bone only, injury invisible</span>
          </div>
          <div className="ii-handle" id="iiHandle" style={{ left: `${v}%` }}>
            <span className="ii-handle-grip">
              <Icon name="chev" />
              <Icon name="back" />
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={v}
            className="ii-range"
            id="iiRange"
            aria-label="Reveal X-ray versus MRI"
            onChange={(e) => setV(Number(e.target.value))}
          />
        </div>
        <div className="ii-points">
          <div className="ii-point">
            <Icon name="alert" style={{ color: "#c4714a" }} />
            <span>
              <b>X-rays show bone, not soft tissue.</b> Herniated discs, torn ligaments,
              whiplash, and nerve damage are invisible on X-ray.
            </span>
          </div>
          <div className="ii-point">
            <Icon name="check2" style={{ color: "#4a8c7e" }} />
            <span>
              <b>MRI reveals the real injury.</b> Soft-tissue damage that drives your pain — and
              your claim — only shows on the right imaging.
            </span>
          </div>
          <div className="ii-point">
            <Icon name="file" style={{ color: "#4a8c7e" }} />
            <span>
              <b>&quot;Normal X-ray&quot; &ne; &quot;no injury.&quot;</b> If you&rsquo;re still in
              pain, the right imaging and documentation protect your health and your case.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
