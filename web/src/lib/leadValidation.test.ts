import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { composeLeadMessage, escapeHtml, validateAndNormalizeLead } from './leadValidation';

const validLead = {
  nombre: '  Mario   Prueba  ',
  email: ' QA@Example.com ',
  empresa: '  Estudio  ',
  servicios_interes: ['brief_aplicar'],
  mensaje: 'Quiero construir una nueva experiencia digital con una dirección clara.',
  projectStage: 'new-version',
  teamContext: 'small-team',
  timeline: '1-3-months',
};

describe('project brief validation', () => {
  test('normalizes the qualitative brief without a revenue field', () => {
    const result = validateAndNormalizeLead(validLead);
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.nombre, 'Mario Prueba');
    assert.equal(result.data.email, 'qa@example.com');
    assert.equal('revenue' in result.data, false);
    assert.match(composeLeadMessage(result.data), /Stage: Ya existe y necesita una nueva versión/);
    assert.match(composeLeadMessage(result.data), /Team: Hay un equipo pequeño involucrado/);
    assert.match(composeLeadMessage(result.data), /Timeline: En 1–3 meses/);
  });

  test('rejects invalid stage, team, timing and short project descriptions', () => {
    const result = validateAndNormalizeLead({
      ...validLead,
      mensaje: 'Muy corto',
      projectStage: 'other',
      teamContext: '',
      timeline: '',
    });
    assert.equal(result.success, false);
    if (result.success) return;
    assert.deepEqual(Object.keys(result.fieldErrors).sort(), ['mensaje', 'projectStage', 'teamContext', 'timeline'].sort());
  });

  test('escapes user HTML before composing notification markup', () => {
    assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });
});
