// An explicitly labelled example. Decisions affect this preview only.
/* global HTMLElement, document, requestAnimationFrame, customElements */
(() => {
  const cases = [
    { file: 'motor_control.c', path: 'src/control/motor_control.c', line: 42, severity: 'Bounds check', title: 'Check the channel before writing to the output.',
      description: 'The channel is used to index the output table. The proposal checks it against the configured channel count before the write. An engineer still needs to review the failure path and verify it on the project.',
      context: 'void motor_set(uint8_t channel, uint16_t duty)', before: ['{', '    outputs[channel] = duty;', '}'],
      proposal: ['{', '    if (channel >= MOTOR_CHANNEL_COUNT) {', '        return;', '    }', '    outputs[channel] = duty;', '}'], added: [1, 2, 3],
      authority: 'Source → proposed guard → engineer review', test: 'Verification: not run in this example' },
    { file: 'sensor_read.c', path: 'src/drivers/sensor_read.c', line: 67, severity: 'Null check', title: 'Validate the destination before storing a reading.',
      description: 'The caller supplies the destination pointer. The proposal returns the existing invalid-argument status for a null destination. Review the API contract and run the project checks before accepting a real change.',
      context: 'status_t sensor_read(uint16_t *reading)', before: ['{', '    *reading = adc_read();', '    return STATUS_OK;', '}'],
      proposal: ['{', '    if (reading == NULL) {', '        return STATUS_INVALID_ARGUMENT;', '    }', '    *reading = adc_read();', '    return STATUS_OK;', '}'], added: [1, 2, 3],
      authority: 'API contract → proposed guard → engineer review', test: 'Verification: not run in this example' },
  ];
  class NoyceReview extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true';
      this.current = 0; this.mode = 'proposal';
      this.innerHTML = `<div class="nx-review"><div class="nx-review-bar"><strong>Review a proposed change</strong><span class="nx-review-demo">Interactive example · no project connected</span></div><div class="nx-review-body"><aside class="nx-review-files" aria-label="Example files"><p>2 FILES TO REVIEW</p>${cases.map((c, i) => `<button type="button" data-file="${i}" aria-pressed="${i === 0}"><span aria-hidden="true">⌘</span>${c.file}<span>1</span></button>`).join('')}</aside><div class="nx-review-main"><div class="nx-review-title"><span class="nx-review-path"></span><div class="nx-review-toggle" role="group" aria-label="Code version"><button type="button" data-mode="before" aria-pressed="false">Original</button><button type="button" data-mode="proposal" aria-pressed="true">Proposed diff</button></div></div><pre class="nx-diff" tabindex="0" aria-label="Example code diff"><code></code></pre><div class="nx-review-finding"><span class="nx-review-label"></span><h3></h3><p></p><div class="nx-review-authority"><span></span><span></span></div><div class="nx-review-controls"><button type="button" data-decision="approved">Approve example</button><button type="button" data-decision="rejected">Reject example</button><a class="nx-text-link" href="/docs/review-ai-changes">How real review gates work ↗</a></div></div></div></div><div class="nx-review-status" role="status" aria-live="polite"></div></div><p class="nx-review-footnote">Illustrative code and findings. In Noyce, change sets are staged for review; actual results and required gates come from your project.</p>`;
      this.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.file !== undefined) { this.current = Number(b.dataset.file); this.render(); }
        if (b.dataset.mode) { this.mode = b.dataset.mode; this.render(); }
        if (b.dataset.decision) {
          const status = this.querySelector('.nx-review-status');
          status.dataset.decided = 'true';
          status.textContent = b.dataset.decision === 'approved' ? 'Example approved. In a real project, Noyce checks the required gates before applying the change.' : 'Example rejected. A real rejected proposal is not applied to your firmware.';
        }
      });
      this.render();
    }
    render() {
      const c = cases[this.current];
      this.querySelectorAll('[data-file]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.file) === this.current)));
      this.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === this.mode)));
      this.querySelector('.nx-review-path').textContent = c.path;
      const code = this.querySelector('.nx-diff code');
      code.replaceChildren();
      const lines = [{ text: c.context, kind: 'context' }, ...(this.mode === 'before' ? c.before.map(text => ({ text, kind: 'context' })) : c.proposal.map((text, i) => ({ text, kind: c.added.includes(i) ? 'add' : 'context' })))];
      lines.forEach((l, i) => {
        const span = document.createElement('span'); span.className = 'nx-diff-line'; span.dataset.kind = l.kind;
        const num = document.createElement('span'); num.className = 'nx-line-number'; num.textContent = c.line + i; num.setAttribute('aria-hidden', 'true');
        span.append(num, document.createTextNode((l.kind === 'add' ? '+ ' : '  ') + l.text)); code.append(span);
      });
      this.querySelector('.nx-review-label').textContent = '◇ ' + c.severity;
      this.querySelector('h3').textContent = c.title;
      this.querySelector('.nx-review-finding > p').textContent = c.description;
      const meta = this.querySelectorAll('.nx-review-authority span'); meta[0].textContent = c.authority; meta[1].textContent = c.test;
      const status = this.querySelector('.nx-review-status'); status.dataset.decided = 'false'; status.textContent = 'Awaiting your decision · this example does not write any files.';
      const main = this.querySelector('.nx-review-main'); main.dataset.changing = 'false'; requestAnimationFrame(() => { main.dataset.changing = 'true'; });
    }
  }
  if (!customElements.get('noyce-review')) customElements.define('noyce-review', NoyceReview);
})();
