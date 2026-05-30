"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CyberAvatar,
  PersonaSnapshot,
  STORAGE_KEYS,
  buildCyberAvatar,
  copyToClipboard,
  display,
  loadFromLocalStorage,
  saveToLocalStorage
} from "@/lib/cyberme";
import { CyberBackdrop } from "@/components/CyberBackdrop";

export default function AvatarResultPage() {
  const [persona, setPersona] = useState<PersonaSnapshot | null>(null);
  const [avatar, setAvatar] = useState<CyberAvatar | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedPersona = loadFromLocalStorage<PersonaSnapshot>(STORAGE_KEYS.personaSnapshot);
    if (!storedPersona) return;
    const cyberAvatar = buildCyberAvatar(storedPersona);
    saveToLocalStorage(STORAGE_KEYS.cyberAvatar, cyberAvatar);
    setPersona(storedPersona);
    setAvatar(cyberAvatar);
  }, []);

  async function handleCopy() {
    if (!persona?.profilePrompt) return;
    await copyToClipboard(persona.profilePrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="cyber-screen app-screen">
      <CyberBackdrop />
      <section className="phone-frame result-frame">
        {!persona || !avatar ? (
          <div className="empty-state">
            <div className="avatar-stage small" aria-hidden="true">
              <div className="halo" />
              <div className="pixel-avatar ghost">
                <span className="pixel-head" />
                <span className="pixel-body" />
                <span className="pixel-arm left" />
                <span className="pixel-arm right" />
                <span className="pixel-leg left" />
                <span className="pixel-leg right" />
              </div>
            </div>
            <h1 className="page-title">还没有生成 CyberMe</h1>
            <p className="page-subtitle">请先完成定制问卷，让系统认识你。</p>
            <Link className="primary-button full" href="/questionnaire">
              去定制
            </Link>
          </div>
        ) : (
          <>
            <div className="topbar center">
              <div>
                <p className="eyebrow">CYBER AVATAR READY</p>
                <h1 className="page-title">你的 CyberMe 已生成</h1>
              </div>
            </div>
            <p className="page-subtitle centered">它会带着你的性格、兴趣和城市偏好，开始替你探索这座城市。</p>

            <div className="avatar-stage result-avatar" aria-hidden="true">
              <div className="halo" />
              <div className={`pixel-avatar ${avatar.visual_style}`}>
                <span className="pixel-head" />
                <span className="pixel-body" />
                <span className="pixel-arm left" />
                <span className="pixel-arm right" />
                <span className="pixel-leg left" />
                <span className="pixel-leg right" />
              </div>
              <div className="scanline" />
            </div>

            <section className="identity-card">
              <h2>{avatar.display_name}</h2>
              <p className="status-line">{avatar.status_line}</p>

              <div className="summary-block">
                <h3>核心性格</h3>
                <p>{avatar.persona_summary}</p>
              </div>
              <div className="stats-grid">
                <InfoItem label="社交能量" value={display("social_energy", persona.core_traits.social_energy)} />
                <InfoItem label="探索风格" value={display("exploration_style", persona.core_traits.exploration_style)} />
                <InfoItem label="默认城市" value={persona.city_bias.base_city || "未填写"} />
                <InfoItem label="说话语气" value={display("voice", persona.tone_style.voice)} />
                <InfoItem label="外观风格" value={display("visual_style", avatar.visual_style)} />
                <InfoItem label="生活节奏" value={display("life_pace", persona.core_traits.life_pace)} />
              </div>

              <TagGroup title="兴趣标签" tags={persona.preference_tags} />
              <TagGroup title="特长" tags={persona.strengths} />
              <TagGroup title="喜欢的城市空间" tags={persona.city_bias.preferred_places} />
            </section>

            <section className="prompt-panel">
              <button className="prompt-toggle" type="button" onClick={() => setExpanded((value) => !value)}>
                <span>用户画像提示词</span>
                <span>{expanded ? "收起" : "展开"}</span>
              </button>
              {expanded ? <pre>{persona.profilePrompt}</pre> : null}
              <button className="secondary-button full" type="button" onClick={handleCopy}>
                {copied ? "已复制" : "复制画像提示词"}
              </button>
            </section>

            <div className="result-actions">
              {/* /today is reserved for the future daily exploration page. Change to /explore if that route becomes the product entry. */}
              <Link className="primary-button full" href="/today">
                开始今日探索
              </Link>
              <Link className="secondary-button full" href="/questionnaire">
                重新定制
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TagGroup({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="tag-section">
      <h3>{title}</h3>
      <div className="tag-list">
        {(tags.length ? tags : ["未填写"]).map((tag) => (
          <span className="tag-pill" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
