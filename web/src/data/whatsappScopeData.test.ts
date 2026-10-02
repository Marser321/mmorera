import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SCOPE_MODULES,
  VELOCITY_TIERS,
  calculateScopeSummary,
  WHATSAPP_PHONE_NUMBER,
} from "./whatsappScopeData";

describe("whatsapp scope studio data model", () => {
  it("publishes 5 core scope modules with valid definitions", () => {
    assert.equal(SCOPE_MODULES.length, 5);
    for (const mod of SCOPE_MODULES) {
      assert.ok(mod.id.length > 0);
      assert.ok(mod.name.es.length > 0);
      assert.ok(mod.name.en.length > 0);
      assert.ok(mod.badge.es.length > 0);
      assert.ok(mod.description.es.length > 0);
      assert.ok(mod.hoursSavedWeekly > 0);
    }
  });

  it("publishes 3 distinct velocity tiers with chronological order", () => {
    assert.equal(VELOCITY_TIERS.length, 3);
    assert.equal(VELOCITY_TIERS[0].id, "agile");
    assert.equal(VELOCITY_TIERS[1].id, "full");
    assert.equal(VELOCITY_TIERS[2].id, "enterprise");
    assert.ok(VELOCITY_TIERS[0].days < VELOCITY_TIERS[1].days);
    assert.ok(VELOCITY_TIERS[1].days < VELOCITY_TIERS[2].days);
  });

  it("calculates realistic hours saved and formatting for Spanish", () => {
    const summary = calculateScopeSummary(["webapp", "ai-agent"], "full", 500, "es");
    assert.equal(summary.totalModules, 2);
    assert.equal(summary.velocity.id, "full");
    assert.ok(summary.estimatedHoursSavedWeekly >= 20);
    assert.ok(summary.formattedMessage.includes("Alcance de Proyecto — MMORERA OS"));
    assert.ok(summary.formattedMessage.includes("Web App & Plataforma Next.js 16"));
    assert.ok(summary.formattedMessage.includes("Agentes de IA & Telefonía de Voz"));
    assert.ok(summary.whatsAppUrl.startsWith(`https://wa.me/${WHATSAPP_PHONE_NUMBER}`));
  });

  it("calculates realistic hours saved and formatting for English", () => {
    const summary = calculateScopeSummary(["webapp", "crm-pipeline", "billing"], "agile", 1200, "en");
    assert.equal(summary.totalModules, 3);
    assert.equal(summary.velocity.id, "agile");
    assert.ok(summary.estimatedHoursSavedWeekly > 25);
    assert.ok(summary.formattedMessage.includes("Project Scope — MMORERA OS"));
    assert.ok(summary.formattedMessage.includes("Next.js 16 Web App & Platform"));
    assert.ok(summary.formattedMessage.includes("Automated Billing & Checkout"));
    assert.ok(summary.whatsAppUrl.includes(WHATSAPP_PHONE_NUMBER));
  });

  it("handles empty modules safely with default fallback message", () => {
    const summary = calculateScopeSummary([], "enterprise", 200, "es");
    assert.equal(summary.totalModules, 0);
    assert.ok(summary.formattedMessage.includes("Diagnóstico general"));
  });
});
